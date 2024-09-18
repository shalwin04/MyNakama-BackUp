import { createClient } from "@supabase/supabase-js";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { TextLoader } from "langchain/document_loaders/fs/text";
import dotenv from "dotenv";

dotenv.config();

const insertDocuments = async () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_PRIVATE_KEY;
  const client = createClient(supabaseUrl, supabaseKey);

  const webUrls = [
    // "https://www.choosingtherapy.com/what-to-say-to-someone-with-depression/"
    // "https://www.mentalhealth.org.uk/explore-mental-health/articles/how-support-someone-mental-health-problem",
    // Add more URLs if needed
  ];

  const textUrls = [
    "C:/Users/shalwin/OneDrive/Documents/langchain-projs/mynakam-ragDocs/self_esteem.txt",
  ];

  // const urlLoader = webUrls.map((url) => new CheerioWebBaseLoader(url));
  const urlLoader = textUrls.map((url) => new TextLoader(url));
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

  console.log("Documents inserted successfully into the vector store.");
};

insertDocuments().catch((error) => {
  console.error("Error inserting documents:", error);
});
