import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PRIVATE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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
