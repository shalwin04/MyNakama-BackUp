import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PRIVATE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

//fecth entries
app.get("/api/journals/:userId", async (req, res) => {
  const { userId } = req.params;
  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", userId);

  if (error) return res.status(400).json(error);
  res.json(data);
});

// Create a new journal entry
app.post("/api/journals", async (req, res) => {
  const { userId, title, content } = req.body;
  const { data, error } = await supabase
    .from("journal_entries")
    .insert([{ user_id: userId, title, content }]);

  if (error) return res.status(400).json(error);
  res.json(data);
});

// Update a journal entry
app.put("/api/journals/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const { data, error } = await supabase
    .from("journal_entries")
    .update({ title, content })
    .eq("id", id);

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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
