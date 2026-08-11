import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Health check route
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "Aura Academics" });
});

// AI Tutor Chat Route
app.post("/api/ai/tutor", async (req, res) => {
  try {
    const { prompt, courseContext, mode } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    let systemInstruction = `You are Aura AI, an expert academic tutor and study companion for college and high school students. 
You provide clear, accurate, encouraging, and structured explanations.
Use markdown formatting for code blocks, bullet points, and key formulas. Keep responses helpful, concise, and academically rigorous.`;

    if (courseContext) {
      systemInstruction += `\nCurrent Course Context: ${courseContext}.`;
    }

    if (mode === "quiz") {
      systemInstruction += `\nMode: Generate 3 multiple choice or short answer practice quiz questions with answer keys at the end.`;
    } else if (mode === "summary") {
      systemInstruction += `\nMode: Summarize key concepts in concise bullet points with key takeaways.`;
    } else if (mode === "plan") {
      systemInstruction += `\nMode: Create a structured step-by-step study schedule with time allocations.`;
    } else if (mode === "feedback") {
      systemInstruction += `\nMode: Provide constructive, supportive feedback on the submitted work. Point out strengths, identify areas for improvement, and offer actionable suggestions.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      error: "Failed to fetch response from Aura AI Tutor.",
      details: error.message || String(error),
    });
  }
});

// Predictive GPA Insights Route
app.post("/api/ai/predict-gpa", async (req, res) => {
  try {
    const { currentGpa, courses } = req.body;

    const prompt = `Current GPA: ${currentGpa}.
Courses: ${JSON.stringify(courses)}.
Provide a concise 3-bullet point AI academic performance report:
1. Strengths & High Performance Areas
2. Subject Risk Warning or Focus Area
3. Actionable recommendation to achieve a 4.0 GPA this term.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an AI Academic Counselor analyzing student grades.",
        temperature: 0.5,
      },
    });

    res.json({ insights: response.text });
  } catch (error: any) {
    console.error("GPA Prediction Error:", error);
    res.status(500).json({ error: "Could not generate GPA insights." });
  }
});

// Vite middleware for dev / static serving for prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Aura Academics] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
