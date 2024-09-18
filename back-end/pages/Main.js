import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

console.log("Supabase URL:", process.env.SUPABASE_URL);
console.log("Supabase Private Key:", process.env.SUPABASE_PRIVATE_KEY);
console.log("Google API Key:", process.env.GOOGLE_API_KEY);

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

const API_KEY = process.env.GOOGLE_API_KEY;

// Supabase setup
const supabasePrivateKey = process.env.SUPABASE_PRIVATE_KEY;
const supabaseUrl = process.env.SUPABASE_URL;

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

  // Supabase client
  const client = createClient(supabaseUrl, supabasePrivateKey);

  const vectorstore = new SupabaseVectorStore({
    client,
    tableName: "documents",
  });

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
