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

  console.log("Received signup request with data:", req.body.formData);

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

    res.status(200).json({ message: "Login successful", session });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "An error occurred during login" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
