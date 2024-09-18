import dotenv from "dotenv";
import path from "path";

// Specify the path to the .env file
dotenv.config();

// console.log("Supabase URL:", process.env.SUPABASE_URL);
// console.log("Supabase Private Key:", process.env.SUPABASE_PRIVATE_KEY);
console.log("Google API Key:", process.env.GOOGLE_API_KEY);

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
import { createRetrievalChain } from "langchain/chains/retrieval";
import { PromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { SupabaseHybridSearch } from "@langchain/community/retrievers/supabase";
import { RunnableSequence } from "@langchain/core/runnables";
import { formatDocumentsAsString } from "langchain/util/document";

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

const API_KEY = process.env.GOOGLE_API_KEY;
// const supabasePrivateKey = process.env.SUPABASE_PRIVATE_KEY;
// const supabaseUrl = process.env.SUPABASE_URL;

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

  //   const client = createClient(supabaseUrl, supabasePrivateKey);

  // Additional code for document handling
  //   const { data: existingDocs, error: checkError } = await client
  //     .from("documents")
  //     .select("id")
  //     .limit(1);

  //   if (checkError) {
  //     console.error("Error checking existing documents:", checkError);
  //     throw checkError;
  //   }

  //   if (existingDocs.length === 0) {
  //     const webUrls = [
  //       //   "https://www.choosingtherapy.com/what-to-say-to-someone-with-depression/",
  //       "https://www.mentalhealth.org.uk/explore-mental-health/articles/how-support-someone-mental-health-problem",
  //       // Add other URLs or document sources here
  //     ];

  //     const urlLoader = webUrls.map((url) => new CheerioWebBaseLoader(url));
  //     const urlDocs = (
  //       await Promise.all(urlLoader.map((loader) => loader.load()))
  //     ).flat();

  //     const splitter = new RecursiveCharacterTextSplitter({
  //       chunkSize: 500,
  //       chunkOverlap: 50,
  //       separators: ["\n\n", "\n", " ", ""],
  //     });
  //     const splitDocs = await splitter.splitDocuments(urlDocs);

  //     const embeddings = new GoogleGenerativeAIEmbeddings();
  //     const vectorstore = await SupabaseVectorStore.fromDocuments(
  //       splitDocs,
  //       embeddings,
  //       {
  //         client,
  //         tableName: "documents",
  //       }
  //     );
  //   } else {
  //     console.log(
  //       "Documents already exist in the vector store. Skipping insertion."
  //     );
  //   }

  //   const vectorstore = new SupabaseVectorStore({
  //     client,
  //     tableName: "documents",
  //   });

  // const prompt = ChatPromptTemplate.fromTemplate(`
  //   You are a friendly and empathetic therapist. Please answer the question based on the context provided, keeping your response warm:

  //   <context>
  //   {context}
  //   </context>

  //   Question: {input}

  //   Respond in a way that is both supportive and concise
  // `);

  // const documentChain = await createStuffDocumentsChain({
  //   llm: model,
  //   prompt,
  // });

  //   const retriever = vectorstore.asRetriever();
  // const embeddings = new GoogleGenerativeAIEmbeddings();

  // const retriever = new SupabaseHybridSearch(embeddings, {
  //   client,
  //   //  Below are the defaults, expecting that you set up your supabase table and functions according to the guide above. Please change if necessary.
  //   similarityK: 2,
  //   keywordK: 2,
  //   tableName: "documents",
  //   similarityQueryName: "match_documents",
  //   keywordQueryName: "kw_match_documents",
  // });

  // const retrievalChain = await createRetrievalChain({
  //   combineDocsChain: documentChain,
  //   retriever,
  // });

  const formatChatHistory = (human, ai, previousChatHistory) => {
    const newInteraction = `Human: ${human}\nAI: ${ai}`;
    if (!previousChatHistory) {
      return newInteraction;
    }
    return `${previousChatHistory}\n\n${newInteraction}`;
  };

  const questionPrompt = PromptTemplate.fromTemplate(
    `Analyze the following text to identify if it contains any references to suicidal thoughts 
    or other mental health concerns. If such references are found, extract keywords and phrases 
    that can be used to search for supportive and helpful videos on YouTube. The output should 
    be relevant to providing emotional support, coping strategies, and mental health resources. 
    Format the output as a list of keywords or search queries. If no such references are found, 
    extract general keywords related to the content of the text.

    ----------------
    CHAT HISTORY: {chatHistory}
    ----------------
    TEXT: {question}`
  );

  const chain = RunnableSequence.from([
    {
      question: (input) => input.question,
      chatHistory: (input) => input.chatHistory || "",
      // context: async (input) => {
      //   const relevantDocs = await retriever.invoke(input.question);
      //   const serialized = formatDocumentsAsString(relevantDocs);
      //   return serialized;
      // },
    },
    questionPrompt,
    model,
    new StringOutputParser(),
  ]);

  return { chain, formatChatHistory };
};

const main = async () => {
  const { chain, formatChatHistory } = await InitializeAI();
  // const supabase = createClient(supabaseUrl, supabasePrivateKey);

  //Chat Endpoint
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

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

main().catch((error) => {
  console.error("Error initializing AI:", error);
  process.exit(1);
});
