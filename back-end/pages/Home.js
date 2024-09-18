import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { formatDocumentsAsString } from "langchain/util/document";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { MessagesPlaceholder, PromptTemplate } from "@langchain/core/prompts";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { RunnableSequence } from "@langchain/core/runnables";
import dotenv from "dotenv";

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

dotenv.config();
const API_KEY = process.env.GOOGLE_API_KEY;

// supabase setup
const supabase_privatekey = process.env.SUPABASE_PRIVATE_KEY;
const supabase_url = process.env.SUPABASE_URL;

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
  });

  // supabase client
  const client = createClient(supabase_url, supabase_privatekey);

  //paths for docs
  const webUrls = [
    "https://www.choosingtherapy.com/what-to-say-to-someone-with-depression/",
    // "https://dx35vtwkllhj9.cloudfront.net/netflix/evergreen-resource-site-gb/issues/mental-health/GB_MentalHealth_HowToDealWithAnxiety.pdf",
    // "https://dx35vtwkllhj9.cloudfront.net/netflix/evergreen-resource-site-gb/issues/mental-health/GB_MentalHealth_ConversationAboutMentalHealth.pdf",
    // "https://dx35vtwkllhj9.cloudfront.net/netflix/evergreen-resource-site-gb/issues/mental-health/GB_MentalHealth_HowToDealWithLoneliness.pdf",
    // "https://dx35vtwkllhj9.cloudfront.net/netflix/evergreen-resource-site-gb/issues/mental-health/GB_MentalHealth_HowToDealWithDepression.pdf",
  ];

  //url loader
  const urlLoader = webUrls.map((url) => new CheerioWebBaseLoader(url));
  const urlDocs = (
    await Promise.all(urlLoader.map((loader) => loader.load()))
  ).flat();

  // const loader = new CheerioWebBaseLoader(
  //   "https://www.choosingtherapy.com/what-to-say-to-someone-with-depression/",
  //   "https://dx35vtwkllhj9.cloudfront.net/netflix/evergreen-resource-site-gb/issues/mental-health/GB_MentalHealth_HowToDealWithAnxiety.pdf",
  //   "https://dx35vtwkllhj9.cloudfront.net/netflix/evergreen-resource-site-gb/issues/mental-health/GB_MentalHealth_ConversationAboutMentalHealth.pdf",
  //   "https://dx35vtwkllhj9.cloudfront.net/netflix/evergreen-resource-site-gb/issues/mental-health/GB_MentalHealth_HowToDealWithLoneliness.pdf",
  //   "https://dx35vtwkllhj9.cloudfront.net/netflix/evergreen-resource-site-gb/issues/mental-health/GB_MentalHealth_HowToDealWithDepression.pdf"
  // );

  const docs = [...urlDocs];

  //splitting the docs
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
    separators: ["\n\n", "\n", " ", ""],
  });
  const splitDocs = await splitter.splitDocuments(docs);

  //creating instalce of google-embeddings
  const embeddings = new GoogleGenerativeAIEmbeddings();

  // Verify embedding dimensions
  const sampleEmbedding = await embeddings.embedDocuments(["test"]);
  console.log(`Embedding Dimensions: ${sampleEmbedding[0].length}`);

  // Log the embeddings
  console.log("Sample Embedding:", sampleEmbedding);

  const vectorstore = await SupabaseVectorStore.fromDocuments(
    splitDocs,
    embeddings,
    {
      client,
      tableName: "documents",
    }
  );

  const prompt =
    ChatPromptTemplate.fromTemplate(`You are a friendly and empathetic therapist. Please answer the question based on the context provided, keeping your response warm:

<context>
{context}
</context>

Question: {input}

Respond in a way that is both supportive and concise`);

  const documentChain = await createStuffDocumentsChain({
    llm: model,
    prompt,
  });

  const retriever = vectorstore.asRetriever();

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

  const questionPrompt = PromptTemplate.fromTemplate(
    `You are a compassionate and insightful therapist. Please respond to the user's question based on the context provided, keeping your response warm:

    CONTEXT: {context}
    ----------------
    CHAT HISTORY: {chatHistory}
    ----------------
    QUESTION: {question}
    ----------------
    Your Empathetic Response:
    Your Insightful Follow-up Question:`
  );

  const chain = RunnableSequence.from([
    {
      question: (input) => input.question,
      chatHistory: (input) => input.chatHistory || "",
      context: async (input) => {
        const relevantDocs = await retriever.invoke(input.question);
        const serialized = formatDocumentsAsString(relevantDocs);
        return serialized;
      },
    },
    questionPrompt,
    model,
    new StringOutputParser(),
  ]);

  return { chain, formatChatHistory };
};

const main = async () => {
  const { chain, formatChatHistory } = await InitializeAI();

  app.post("/api/converse", async (req, res) => {
    const { message, chatHistory } = req.body;
    try {
      const result = await chain.invoke({
        question: message,
        chatHistory,
      });

      // Update chat history
      const updatedChatHistory = formatChatHistory(
        message,
        result,
        chatHistory
      );

      res.json({ result, chatHistory: updatedChatHistory });
    } catch (error) {
      console.error("Error processing the request:", error);
      res.status(500).send("Error processing the request");
    }
  });

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
    } = req.body;

    console.log("Received signup request with data:", req.body);

    try {
      if (!password) {
        throw new Error("Password is missing in the request body");
      }

      console.log("Password before hashing:", password);

      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("Password hashed successfully");

      const { data, error } = await supabase.from("users").insert([
        {
          username,
          email,
          password: hashedPassword,
          age,
          gender,
          location,
          concerns,
          treatment_history: treatmentHistory,
          emergency_contact: emergencyContact,
        },
      ]);

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      res.status(200).json({ message: "User created successfully!", data });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: error.message });
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

// const questionOne = "I am so depressed. I dont know what to do?";

// const resultOne = await chain.invoke({
//   question: questionOne,
// });

// console.log(resultOne);

// const resultTwo = await chain.invoke({
//   chatHistory: formatChatHistory(resultOne, questionOne),
//   question: "Can you find some?",
// });

// console.log(resultTwo);

// const chatHistory = [
//   new HumanMessage("I am so depressed"),
//   new AIMessage("Yes!"),
// ];

// const historyAwarePrompt = ChatPromptTemplate.fromMessages([
//   new MessagesPlaceholder("chat_history"),
//   {
//     text: "Question: {input}",
//     variables: { input: { name: "input", type: "string" } },
//   },
//   new HumanMessage(
//     "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation"
//   ),
// ]);

// const historyAwareRetrieverChain = await createHistoryAwareRetriever({
//   llm: model,
//   retriever,
//   rephrasePrompt: historyAwarePrompt,
// });

// const result = await historyAwareRetrieverChain.invoke({
//   chat_history: chatHistory,
//   input: "Tell me how!",
// });

// const historyAwareRetrievalPrompt = ChatPromptTemplate.fromMessages([
//   new HumanMessage(
//     "You are a friendly and empathetic therapist. Please answer the question based on the context provided, keeping your response warm: \n\n{context} \n\nRespond in a way that is both supportive and concise"
//   ),
//   new MessagesPlaceholder("chat_history"),
//   new HumanMessage("{{ input }}"), // enclose "input" in curly braces
// ]);

// const historyAwareCombineDocsChain = await createStuffDocumentsChain({
//   llm: model,
//   prompt: historyAwareRetrievalPrompt,
// });

// const conversationalRetrievalChain = await createRetrievalChain({
//   retriever: historyAwareRetrieverChain,
//   combineDocsChain: historyAwareCombineDocsChain,
// });

// const result = await conversationalRetrievalChain.invoke({
//   chat_history: chatHistory,
//   input: "How do i overcome that?",
// });

// console.log(result);

// const result = await retrievalChain.invoke({
//   input: "I am depressed",
// });

// const docres = await embeddings.embedDocuments(["I am so depressed"]);

// console.log(result);

// console.log(splitDocs.length);
// console.log(splitDocs[0].pageContent.length);

// const prompt = ChatPromptTemplate.fromMessages([
//   ["system", "You're world class mental health therapist"],
//   ["user", "{input}"],
// ]);

// const outputParser = new StringOutputParser();
// const chain = prompt.pipe(model).pipe(outputParser);

// const main = async () => {
//   const retrievalChain = await InitializeAI();

//   app.post("/api/converse", async (req, res) => {
//     const { message } = req.body;
//     try {
//       // const response = await chain.invoke({
//       //   input: message,
//       // });
//       const result = await retrievalChain.invoke({
//         input: message,
//       });

//       res.json({ result });
//     } catch (error) {
//       console.error("Error processing the request:", error);
//       res.status(500).send("Error processing the request");
//     }
//   });

//   app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
//   });
// };

// main().catch((error) => {
//   console.error("Error initializing AI:", error);
//   process.exit(1);
// });

// const res = await chain.invoke([
//   [
//     "human",
//     "What would be a good company name for a company that makes colorful socks?",
//   ],
// ]);

// console.log(res);
