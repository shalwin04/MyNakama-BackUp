import dotenv from "dotenv";
import path from "path";

// Specify the path to the .env file
dotenv.config();

// console.log("Supabase URL:", process.env.SUPABASE_URL);
// console.log("Supabase Private Key:", process.env.SUPABASE_PRIVATE_KEY);
// console.log("Google API Key:", process.env.GOOGLE_API_KEY);

import { fetchYouTubeVideos } from "./FetchVideos.js";
import { fetchNewsArticles } from "./FetchArticles.js";

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import nodemailer from "nodemailer";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { PromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { SupabaseHybridSearch } from "@langchain/community/retrievers/supabase";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import { formatDocumentsAsString } from "langchain/util/document";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { serialize } from "v8";

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

const API_KEY = process.env.GOOGLE_API_KEY;
const supabasePrivateKey = process.env.SUPABASE_PRIVATE_KEY;
const supabaseUrl = process.env.SUPABASE_URL;
const passkey = process.env.MYNAKAMA_KEY;

const InitializeAI = async () => {
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-pro",
    apiKey: `${API_KEY}`,
    maxOutputTokens: 2048,
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
      },
    ],
    // tools: {
    //   functionDeclarations: [
    //     draftMailFunctionDeclaration,
    //     keywordFunctionDeclaration,
    //   ],
    // },
  });

  const client = createClient(supabaseUrl, supabasePrivateKey);

  // Additional code for document handling
  const { data: existingDocs, error: checkError } = await client
    .from("documents")
    .select("id")
    .limit(1);

  if (checkError) {
    console.error("Error checking existing documents:", checkError);
    throw checkError;
  }

  if (existingDocs.length === 0) {
    const webUrls = [
      //   "https://www.choosingtherapy.com/what-to-say-to-someone-with-depression/",
      "https://www.mentalhealth.org.uk/explore-mental-health/articles/how-support-someone-mental-health-problem",
      // Add other URLs or document sources here
    ];

    const urlLoader = webUrls.map((url) => new CheerioWebBaseLoader(url));
    const urlDocs = (
      await Promise.all(urlLoader.map((loader) => loader.load()))
    ).flat();

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
      separators: ["\n\n", "\n", " ", ""],
    });
    const splitDocs = await splitter.splitDocuments(urlDocs);

    const embeddings = new GoogleGenerativeAIEmbeddings();
    const vectorstore = await SupabaseVectorStore.fromDocuments(
      splitDocs,
      embeddings,
      {
        client,
        tableName: "documents",
      }
    );
  } else {
    console.log(
      "Documents already exist in the vector store. Skipping insertion."
    );
  }

  //   const vectorstore = new SupabaseVectorStore({
  //     client,
  //     tableName: "documents",
  //   });

  const prompt = ChatPromptTemplate.fromTemplate(`
    You are a friendly and empathetic therapist. Please answer the question based on the context provided, keeping your response warm:

    <context>
    {context}
    </context>

    Question: {input}

    Respond in a way that is both supportive and concise
  `);

  const documentChain = await createStuffDocumentsChain({
    llm: model,
    prompt,
  });

  //   const retriever = vectorstore.asRetriever();
  const embeddings = new GoogleGenerativeAIEmbeddings();

  const retriever = new SupabaseHybridSearch(embeddings, {
    client,
    //  Below are the defaults, expecting that you set up your supabase table and functions according to the guide above. Please change if necessary.
    similarityK: 2,
    keywordK: 2,
    tableName: "documents",
    similarityQueryName: "match_documents",
    keywordQueryName: "kw_match_documents",
  });

  const retrievalChain = await createRetrievalChain({
    combineDocsChain: documentChain,
    retriever,
  });

  const formatChatHistory = (human, ai, previousChatHistory) => {
    const newInteraction = `Human: ${human}\nAI: ${ai}`;
    if (!previousChatHistory) {
      return newInteraction;
    }
    return `${previousChatHistory}\n\n${newInteraction}`;
  };

  const contextualizeQSystemPrompt = `Given a chat history and the latest user question
    which might reference context in the chat history, formulate a standalone question
    which can be understood without the chat history. Do NOT answer the question,
    just reformulate it if needed and otherwise return it as is.`;

  const contextualizeQPrompt = ChatPromptTemplate.fromMessages([
    ["system", contextualizeQSystemPrompt],
    new MessagesPlaceholder("chatHistory"),
    ["human", "{question}"],
  ]);

  const contextualizeQChain = contextualizeQPrompt
    .pipe(model)
    .pipe(new StringOutputParser());

  const qPrompt = `You are a compassionate and insightful mental health therapist.
     Please respond to the user's question based on the context, keeping your response warm, accepting, and empathetic. 
     Your goal is to provide a safe space, help the user become a better version of themselves, and offer practical solutions to 
     their mental health concerns.Acknowledge the user's feelings with warmth and understanding.
     Provide validation and support, showing empathy towards their situation. Ask the user an Insightful Follow-up Question.
    Provide validation and support, showing empathy towards their situation, 
    and reference relevant details from the chat history. Encourage the user to reflect on their 
    experiences by asking open-ended questions that help them identify specific aspects of their concerns.
    Offer practical suggestions or techniques that could help manage their situation, such as 
    time management tips, relaxation exercises, or coping
    strategies. Additionally, check for understanding and willingness to try these suggestions.

    {context}`;

  const questionPrompt = ChatPromptTemplate.fromMessages([
    ["system", qPrompt],
    new MessagesPlaceholder("chatHistory"),
    ["human", "{question}"],
  ]);

  const contextualizedQuestion = (input) => {
    if ("chatHistory" in input) {
      return contextualizeQChain;
    }
    return input.question;
  };

  // const questionPrompt = PromptTemplate.fromTemplate(
  //   // `You are a compassionate and insightful therapist. Please respond to the user's question based on the context provided, keeping your response warm:

  //   // CONTEXT: {context} Your Empathetic Response: Your Insightful Follow-up Question: Additionally, if appropriate, suggest seeking further resources or professional support if needed
  //   // ----------------
  //   // CHAT HISTORY: {chatHistory}
  //   // ----------------
  //   // QUESTION: {question}

  //   // This is the prompt
  //   `You are a compassionate and insightful mental health therapist.
  //    Please respond to the user's question based on the context and the chat history provided, keeping your response warm, accepting, and empathetic.
  //    Your goal is to provide a safe space, help the user become a better version of themselves, and offer practical solutions to
  //    their mental health concerns. Refer to the chatHistory before giving a response.

  //   CONTEXT: {context}
  //   ----------------
  //   CHAT HISTORY: {chatHistory}
  //   ----------------
  //   QUESTION: {question}
  //   ----------------

  //   Acknowledge the user's feelings with warmth and understanding. Provide validation and support, showing empathy towards their situation
  //   ----------------

  //   Ask the user an Insightful Follow-up Question.Provide validation and support, showing empathy towards their situation,
  //   and reference relevant details from the chat history.Encourage the user to reflect on their
  //   experiences by asking open-ended questions that help them identify specific aspects of their concerns.
  //   Offer practical suggestions or techniques that could help manage their situation, such as
  //   time management tips, relaxation exercises, or coping
  //   strategies.Additionally, check for understanding and willingness to try these suggestions.`

  //   // `You are a compassionate and insightful mental health therapist. Please respond to the
  //   // user's question based on the context provided, keeping your response warm, accepting,
  //   // and empathetic. Your goal is to provide a safe space, help the user become a better version
  //   // of themselves, and offer practical solutions to their mental health concerns.

  //   // CONTEXT: {context}
  //   // ----------------
  //   // CHAT HISTORY: {chatHistory}
  //   // ----------------
  //   // QUESTION: {question}
  //   // ----------------

  //   // Acknowledge the user's feelings with warmth and understanding. Provide validation and support,
  //   // showing empathy towards their situation.

  //   // Encourage the user to reflect on their experiences by asking open-ended questions that help
  //   // them identify specific aspects of their concerns. Validate any efforts they have already made towards their goals.

  //   // Offer practical suggestions or techniques that could help manage their situation, such as
  //   // time management tips, relaxation exercises, or coping strategies. Additionally,
  //   // check for understanding and willingness to try these suggestions.

  //   // If appropriate, suggest seeking further resources or professional support tailored to their specific needs.

  //   // Example Response Structure:
  //   //   Empathetic Response:
  //   //     Acknowledge the user's feelings with a warm and understanding tone. Validate their emotions and efforts.

  //   //   Open-Ended Follow-Up Question:
  //   //     Encourage the user to reflect by asking questions that help identify specific aspects
  //   //     of their concerns. Validate any steps they have already taken.

  //   //   Practical Suggestions:
  //   //     Offer actionable advice or techniques to help manage the user's situation. Check for
  //   //     understanding and willingness to try these suggestions.

  //   //   Additional Support:
  //   //     If needed, suggest further resources or professional support.`
  // );

  const journalPrompt = PromptTemplate.fromTemplate(
    //   Analyze the following text to identify if it contains any references to suicidal thoughts
    // or other mental health concerns. If such references are found, generate a single search query
    // to find supportive and helpful videos on YouTube, focusing on emotional support, coping strategies,
    // and mental health resources. If no such references are found, generate a relevant search query based
    // on the general content of the text.
    // `Please analyze the following text. If it contains references to suicidal thoughts or mental health
    // concerns, generate a supportive search query for YouTube videos focused on emotional support and coping strategies.
    // If the text does not reference these issues, generate a general search query based on the content.
    // ----------------
    // TEXT: {input_text}

    // ----------------
    // Search Query :

    // Example 1:
    // TEXT: "I'm feeling so overwhelmed and hopeless. Sometimes, I think about ending it all."
    // Expected Output: "How to cope with suicidal thoughts"

    // Example 2:
    // TEXT: "I just had the best day at the beach! The sun was shining, and I felt so relaxed."
    // Expected Output: "Best beach day activities"

    // Example 3:
    // TEXT: "Lately, I've been struggling a lot. I feel like I have no one to talk to."
    // Expected Output: "Emotional support for people considering suicide"

    // Example 4:
    // TEXT: "I'm planning a trip to the mountains next month."
    // Expected Output: "Mountain hiking tips"`
    // `Please analyze the following text. If it contains references to suicidal thoughts or severe mental health concerns, call the function `draftEmail`
    // draft an email addressed to the emergency contact, highlighting the user's need for special care based on the content. If the text contains general mental health concerns, generate a supportive search query for YouTube videos focused on emotional support and coping strategies. If the text does not reference any mental health issues, generate a general search query based on the content.
    // `Please analyze the following text. If it contains references to suicidal thoughts or severe mental health concerns, draft a mail
    // with the content addressed to the emergency contact, highlighting the user's need for special care and generate a supportive search query for YouTube videos
    // focused on emotional support and coping strategies.If the text does not reference any mental health issues, generate a general search query based on the content.

    // // TEXT: {input_text}
    // // Search Query:

    // // Drafted Email (if needed):`
    // `If the following text contains references to suicidal thoughts or severe mental health concerns, create a mail body with the
    // content, addressed to the emergency contact, highlighting the user's need for special care. If it does not contains references to
    // suicidal thoughts or severe mental health concerns reply N/A
    // ----------------
    // TEXT: {input_email}
    // `
    `If the following text contains references to suicidal thoughts or severe mental health concerns,
     generate a message addressed to the emergency contact, highlighting the user's need for special care.
     If it does not contain references to suicidal thoughts or severe 
     mental health concerns, reply N/A. Output only message and nothing else.

    ----------------
    TEXT: {input_email}`
  );

  const keywordPrompt = PromptTemplate.fromTemplate(
    `If the following text contains references to suicidal thoughts or severe mental health concerns, 
    generate a single supportive search query for fetching YouTube videos or articles focused on emotional 
    support and coping strategies. If it does not contain such references, generate a single general search query 
    based on the text for fecthing the youtube videos or articles focused on the content. Even if it's a general search query, output only the search query and nothing else.
      ----------------
      TEXT: {input_text}`
  );

  const chain = RunnableSequence.from([
    {
      question: (input) => input.question,
      chatHistory: (input) => input.chatHistory || "",
      context: async (input) => {
        if ("chatHistory" in input) {
          const retrivechain = contextualizedQuestion(input);
          const relevantDocs = await retriever.invoke(input.question);
          const serialized = formatDocumentsAsString(relevantDocs);
          return serialized;
        }
        return "";
      },
    },
    questionPrompt,
    model,
    new StringOutputParser(),
  ]);

  const journalChain = RunnableSequence.from([
    {
      input_email: (input) => input.input_email,
      // chatHistory: (input) => input.chatHistory || "",
      // context: async (input) => {
      //   const relevantDocs = await retriever.invoke(input.question);
      //   const serialized = formatDocumentsAsString(relevantDocs);
      //   return serialized;
      // },
    },
    journalPrompt,
    model,
    // new StringOutputParser(),
  ]);

  const keywordChain = RunnableSequence.from([
    {
      input_text: (input) => input.input_text,
      // chatHistory: (input) => input.chatHistory || "",
      // context: async (input) => {
      //   const relevantDocs = await retriever.invoke(input.question);
      //   const serialized = formatDocumentsAsString(relevantDocs);
      //   return serialized;
      // },
    },
    keywordPrompt,
    model,
    // new StringOutputParser(),
  ]);

  return { chain, journalChain, keywordChain, formatChatHistory };
};

async function fetchMentalHealthContent(keywords) {
  // try {
  //   if (!Array.isArray(keywords)) {
  //     keywords = [keywords];
  //   }
  //   const keywordString = keywords.join(" ");
  //   const videos = await fetchYouTubeVideos(keywordString);
  //   const articles = await fetchNewsArticles(keywordString);
  //   return [...videos, ...articles];
  try {
    // const searchkeywords = extractSearchQuery(keywords);
    if (!Array.isArray(keywords)) {
      keywords = [keywords];
    }
    const uniqueContent = new Set();

    for (const keyword of keywords) {
      const videos = await fetchYouTubeVideos(keyword);
      const articles = await fetchNewsArticles(keyword);
      console.log("Keyword Inside", keyword);

      videos.forEach((video) => uniqueContent.add(JSON.stringify(video)));
      articles.forEach((article) => uniqueContent.add(JSON.stringify(article)));
    }
    // console.log("Keywords 1", keywords[0]);
    // console.log("Keywords 2", keywords[1]);

    return Array.from(uniqueContent).map((item) => JSON.parse(item));
  } catch (error) {
    console.error("Error fetching content:", error);
  }
}

// async function extractSearchQuery(keyword) {
//   const warningRegex = /Warning:.*?\n\n\*\s\*(.*?)\*\s*\n/g; // Regex to match supportive queries
//   const generalRegex = /Search Query:\s*(.*?)(?=\n|$)/; // Regex to match general query

//   const supportiveMatches = [...response.matchAll(warningRegex)];
//   if (supportiveMatches) {
//     return supportiveMatches.map((match) => match[1].trim());
//   }

//   const generalMatch = keyword.match(generalRegex);
//   if (generalMatch) {
//     return [generalMatch[1].trim()];
//   }

//   return [];
// }

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "mynakama.chat@gmail.com",
    pass: passkey,
  },
});

async function draftConsernEmail(userId, text) {
  const supaClient = createClient(supabaseUrl, supabasePrivateKey);
  const { data: user, error } = await supaClient
    .from("users")
    .select("username, emergency_contact")
    .eq("id", userId);

  if (error) {
    console.log("DraftEmaile", error);
  }

  // console.log(user);
  const emailContent = {
    from: '"My Nakama" <mynakama.chat@gmail.com>',
    to: user[0].emergency_contact,
    subject: "Urgent: User Requires Special Care",
    text: `
        Dear Emergency Contact,
        
        We have detected that the user who is using our application is in need of special care.
        User Name : "${user[0].username}"
        
        "${text}"

        Please reach out to the user as soon as possible to provide the necessary support.

        Best regards,
        MyNakam Team
      `,
    html: `
        <p>Dear Emergency Contact,</p>
        <p>We have detected that the user who is using our application is in need of special care.</p>
        <p>User Name : "${user[0].username}"</p>
        <p>"${text}"</p>
        <p>Please reach out to the user as soon as possible to provide the necessary support.</p>
        <p>Best regards,<br>MyNakama Team</p>
      `,
  };

  try {
    await transporter.sendMail(emailContent);
    console.log("Email Sent");
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

const main = async () => {
  const { chain, journalChain, keywordChain, formatChatHistory } =
    await InitializeAI();
  const supabase = createClient(supabaseUrl, supabasePrivateKey);

  let cachedMentalHealthContent = [];

  let chatHistory = [];

  //Chat Endpoint
  app.post("/api/converse", async (req, res) => {
    const { message, chat_history } = req.body;
    try {
      const result = await chain.invoke({
        question: message,
        chatHistory,
      });

      chatHistory.push(new HumanMessage(message));
      chatHistory.push(new AIMessage(result));
      // Update chat history
      const updatedChatHistory = formatChatHistory(
        message,
        result,
        chatHistory
      );

      res.json({ result, chatHistory: updatedChatHistory });
      // console.log("Chat History:", chatHistory);
    } catch (error) {
      console.error("Error processing the request:", error);
      res.status(500).send("Error processing the request");
    }
  });

  //SignUp Endpoint
  app.post("/api/signup", async (req, res) => {
    const {
      username,
      email,
      password,
      age,
      gender,
      location,
      concerns,
      treatmentHistory,
      emergencyContact,
    } = req.body.formData;

    // console.log("Received signup request with data:", req.body.formData);

    try {
      // Sign up the user using Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        console.error("Supabase Auth error:", authError);
        throw authError;
      }

      const userId = authData.user.id;

      // Insert user details into the 'users' table
      const { data, error: dbError } = await supabase.from("users").insert([
        {
          id: userId, // Use the user ID returned by Supabase Auth
          username,
          email,
          age,
          gender,
          location,
          concerns,
          treatment_history: treatmentHistory,
          emergency_contact: emergencyContact,
        },
      ]);

      if (dbError) {
        console.error("Supabase error:", dbError);
        throw dbError;
      }

      res.status(200).json({ message: "User created successfully!", data });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: error.message });
    }
  });

  //Login Endpoint
  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    try {
      // Sign in the user using Supabase Auth
      const { data: session, error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (loginError) {
        console.error("Supabase Auth error:", loginError);
        return res.status(400).json({ error: "Invalid email or password" });
      }

      const userId = session.user.id;

      // console.log("User Id", userId);
      res.status(200).json({ message: "Login successful", session, userId });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "An error occurred during login" });
    }
  });

  // Endpoint for fetching the user's profile
  app.get("/api/profile/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
      const { data: user, error } = await supabase
        .from("users")
        .select(
          "id, username, email, age, location, concerns, treatment_history, emergency_contact"
        )
        .eq("id", userId);

      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Error fetching user profile" });
      }

      if (user.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user[0]);
      chatHistory = [];
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Endpoint for updating the user's profile
  app.put("/api/profile/:userId", async (req, res) => {
    const { userId } = req.params;
    const {
      username,
      email,
      age,
      location,
      concerns,
      treatment_history,
      emergency_contact,
    } = req.body;

    try {
      const { data: user, error } = await supabase
        .from("users")
        .update({
          username,
          email,
          age,
          location,
          concerns,
          treatment_history,
          emergency_contact,
        })
        .eq("id", userId);

      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Error updating user profile" });
      }

      res.json({ message: "Profile updated successfully" });
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  //fecth entries
  app.get("/api/journals/:userId", async (req, res) => {
    const { userId } = req.params;
    const { data, error } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("user_id", userId);

    if (error) return res.status(400).json(error);
    res.json(data);
    chatHistory = [];
  });

  // Create a new journal entry
  app.post("/api/journals", async (req, res) => {
    const { userId, title, content } = req.body;
    const { data, error } = await supabase
      .from("journal_entries")
      .insert([{ user_id: userId, title, content }]);

    // console.log("Content:", content);
    const email_content = await journalChain.invoke({
      input_email: content,
    });
    const search_keyword = await keywordChain.invoke({
      input_text: content,
    });
    // const keyword = search_keyword.trim().split("\n");
    // console.log("Email", email_content);
    if (email_content.content !== "N/A")
      draftConsernEmail(userId, email_content.content);
    console.log("Search Keyword", search_keyword.content);
    const mentalHealthContent = await fetchMentalHealthContent(
      search_keyword.content
    );
    // console.log("Fetched Mental Health Content:", mentalHealthContent);

    if (mentalHealthContent.length > 0) {
      cachedMentalHealthContent = mentalHealthContent; // Cache the content
    }

    if (error) return res.status(400).json(error);
    res.json(data);
  });

  // Update a journal entry
  app.put("/api/journals/:id", async (req, res) => {
    const { id } = req.params;
    const { userId, title, content } = req.body;
    const { data, error } = await supabase
      .from("journal_entries")
      .update({ title, content })
      .eq("id", id);

    console.log("Content:", content);
    const email_content = await journalChain.invoke({
      input_email: content,
    });
    const search_keyword = await keywordChain.invoke({
      input_text: content,
    });
    // const keyword = search_keyword.trim().split("\n");
    // console.log("Email", email_content);
    if (email_content.content !== "N/A")
      draftConsernEmail(userId, email_content.content);
    // console.log("Search Keyword", search_keyword.content);
    const mentalHealthContent = await fetchMentalHealthContent(
      search_keyword.content
    );
    // console.log("Fetched Mental Health Content:", mentalHealthContent);

    if (mentalHealthContent.length > 0) {
      cachedMentalHealthContent = mentalHealthContent; // Cache the content
    }

    if (error) return res.status(400).json(error);
    res.json(data);
  });

  // Delete a journal entry
  app.delete("/api/journals/:id", async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("journal_entries")
      .delete()
      .eq("id", id);

    if (error) return res.status(400).json(error);
    res.json(data);
  });

  //Blogs
  app.get("/api/blogs", async (req, res) => {
    try {
      if (cachedMentalHealthContent.length > 0) {
        // Send cached content if available
        res.json(cachedMentalHealthContent);
        cachedMentalHealthContent = []; // Clear the cache after sending
      } else {
        // Fetch new content if cache is empty
        const searchKeyword = "Mental Health";
        const content = await fetchMentalHealthContent(searchKeyword);
        res.json(content);
      }
    } catch (error) {
      res.status(500).send("Error fetching content");
    }
    chatHistory = [];
  });

  //Logout Endpoint
  app.post("/api/logout", async (req, res) => {
    try {
      // Get the current user session
      const { data: session, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) {
        return res.status(400).json({ error: sessionError.message });
      }

      // Sign out the user
      const { error: logoutError } = await supabase.auth.signOut();

      chatHistory = [];

      if (logoutError) {
        return res.status(400).json({ error: logoutError.message });
      }

      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      console.error("Error during logout:", error);
      res.status(500).json({ error: "An error occurred during logout" });
    }
  });

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

main().catch((error) => {
  console.error("Error initializing AI:", error);
  process.exit(1);
});
