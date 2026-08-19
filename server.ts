import express from "express";
import path from "path";
import http from "http";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, ThinkingLevel, Modality, GenerateVideosOperation } from "@google/genai";
import { WebSocketServer } from "ws";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limit for image uploads
app.use(express.json({ limit: "25mb" }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Helper to format Gemini API errors cleanly
function formatGeminiError(error: any, fallbackMessage: string) {
  const errMsg = String(error?.message || error || "");
  const errStatus = error?.status || error?.code;
  const isQuota =
    errStatus === 429 ||
    errMsg.includes("429") ||
    errMsg.includes("RESOURCE_EXHAUSTED") ||
    errMsg.toLowerCase().includes("quota");

  if (isQuota) {
    return "API Rate Limit / Quota Exceeded: You have temporarily reached your Gemini API quota for this model. Please wait a moment and try again.";
  }
  return errMsg || fallbackMessage;
}

// Health check route
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "Aura Academics" });
});

// ----------------------------------------------------
// 1. AI Tutor Endpoint (Multi-turn, Image Analysis, High Thinking, Fast Mode)
// ----------------------------------------------------
app.post("/api/ai/tutor", async (req, res) => {
  try {
    const { prompt, courseContext, mode, enableThinking, imageBase64, imageMimeType, history } = req.body;

    if (!prompt && !imageBase64) {
      return res.status(400).json({ error: "Prompt or image is required" });
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

    // Select model based on requirements
    let model = "gemini-3.5-flash"; // default general task model

    if (enableThinking) {
      // High Thinking model for complex academic proofs & math
      model = "gemini-3.1-pro-preview";
    } else if (mode === "fast") {
      // Fast mode model
      model = "gemini-3.1-flash-lite";
    } else if (imageBase64) {
      // Image analysis model
      model = "gemini-3.1-pro-preview";
    }

    // Build content payload
    const parts: any[] = [];
    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: imageMimeType || "image/png",
          data: imageBase64,
        },
      });
    }
    if (prompt) {
      parts.push({ text: prompt });
    }

    const config: any = {
      systemInstruction,
      temperature: 0.7,
    };

    if (enableThinking) {
      config.thinkingConfig = {
        thinkingLevel: ThinkingLevel.HIGH,
      };
      // Note: maxOutputTokens must NOT be set when high thinking is enabled
    }

    let contentsPayload: any = { parts };

    // If chat history is provided, build conversation context
    if (history && Array.isArray(history) && history.length > 0) {
      const formattedHistory = history.map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }));
      formattedHistory.push({
        role: "user",
        parts,
      });
      contentsPayload = formattedHistory;
    }

    const response = await ai.models.generateContent({
      model,
      contents: contentsPayload,
      config,
    });

    res.json({ text: response.text, modelUsed: model });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      error: formatGeminiError(error, "Failed to fetch response from Aura AI Tutor."),
      details: error.message || String(error),
    });
  }
});

// ----------------------------------------------------
// 2. Search Grounding Endpoint (googleSearch tool with gemini-3.5-flash)
// ----------------------------------------------------
app.post("/api/ai/search-grounding", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Query is required" });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: query,
      config: {
        systemInstruction: "You are an AI research assistant providing real-time up-to-date web information with sources.",
        tools: [{ googleSearch: {} }],
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const webSources = groundingChunks
      .map((c: any) => c.web)
      .filter(Boolean);

    res.json({
      text: response.text,
      sources: webSources,
    });
  } catch (error: any) {
    console.error("Search Grounding Error:", error);
    res.status(500).json({ error: formatGeminiError(error, "Search Grounding failed"), details: error.message });
  }
});

// ----------------------------------------------------
// 3. Maps Grounding Endpoint (googleMaps tool with gemini-3.5-flash)
// ----------------------------------------------------
app.post("/api/ai/maps-grounding", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Query is required" });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: query,
      config: {
        systemInstruction: "You are a campus and university location advisor providing geographical and location insights using Google Maps data.",
        tools: [{ googleMaps: {} }],
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    res.json({
      text: response.text,
      groundingChunks,
    });
  } catch (error: any) {
    console.error("Maps Grounding Error:", error);
    res.status(500).json({ error: formatGeminiError(error, "Maps Grounding failed"), details: error.message });
  }
});

// ----------------------------------------------------
// 4. Image-to-Video Animation (Veo Video Generation)
// ----------------------------------------------------
app.post("/api/ai/generate-video", async (req, res) => {
  try {
    const { prompt, imageBase64, imageMimeType, aspectRatio } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "An image is required to animate into video." });
    }

    const videoPrompt = prompt || "Animate this academic study illustration smoothly with fluid lighting and motion.";
    const selectedAspectRatio = aspectRatio === "9:16" ? "9:16" : "16:9";

    const operation = await ai.models.generateVideos({
      model: "veo-3.1-fast-generate-preview",
      prompt: videoPrompt,
      image: {
        imageBytes: imageBase64,
        mimeType: imageMimeType || "image/png",
      },
      config: {
        numberOfVideos: 1,
        resolution: "720p",
        aspectRatio: selectedAspectRatio,
      },
    });

    res.json({ operationName: operation.name });
  } catch (error: any) {
    console.error("Veo Video Generation Error:", error);
    res.status(500).json({ error: formatGeminiError(error, "Failed to initiate video generation."), details: error.message });
  }
});

app.post("/api/ai/video-status", async (req, res) => {
  try {
    const { operationName } = req.body;
    if (!operationName) return res.status(400).json({ error: "Operation name is required." });

    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });

    res.json({ done: updated.done, error: updated.error });
  } catch (error: any) {
    console.error("Video Status Error:", error);
    res.status(500).json({ error: "Failed to check video status.", details: error.message });
  }
});

app.post("/api/ai/video-download", async (req, res) => {
  try {
    const { operationName } = req.body;
    if (!operationName) return res.status(400).json({ error: "Operation name is required." });

    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });

    const uri = updated.response?.generatedVideos?.[0]?.video?.uri;
    if (!uri) {
      return res.status(404).json({ error: "Generated video URI not found." });
    }

    const videoRes = await fetch(uri, {
      headers: { "x-goog-api-key": process.env.GEMINI_API_KEY || "" },
    });

    if (!videoRes.ok) {
      return res.status(500).json({ error: "Failed to download video from storage." });
    }

    res.setHeader("Content-Type", "video/mp4");
    
    // Stream response
    const arrayBuffer = await videoRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.send(buffer);
  } catch (error: any) {
    console.error("Video Download Error:", error);
    res.status(500).json({ error: "Video download failed.", details: error.message });
  }
});

// ----------------------------------------------------
// 5. Predictive GPA Insights Route
// ----------------------------------------------------
app.post("/api/ai/predict-gpa", async (req, res) => {
  try {
    const { currentGpa, targetGpa, courses, assignments, completedCredits, linearSummary } = req.body;

    const prompt = `Current Cumulative GPA: ${currentGpa || 3.92}
Target GPA: ${targetGpa || 4.00}
Completed Credits: ${completedCredits || 78}
Linear Regression Summary Metrics: ${JSON.stringify(linearSummary || {})}
Courses, Linear Slopes & Equations: ${JSON.stringify(courses)}
Assignment History & Upcoming Work: ${JSON.stringify(assignments || [])}

Act as an AI Academic Predictive Data Analyst. Perform a detailed forecast of the end-of-semester GPA outcomes incorporating the Ordinary Least Squares (OLS) linear trend equations ($y = mx + b$):
1. **Forecast Summary**: Predict the student's end-of-semester Term GPA and overall Cumulative GPA based on the linear slope momentum of graded assignments.
2. **Course Linear Momentum Breakdown**: Highlight top accelerating courses (positive slope $m > 0$) vs decelerating courses ($m < 0$), and specify exact target scores needed on pending assignments.
3. **Strategic Milestones**: Provide 3 prioritized, high-leverage study actions based on assignment priorities and upcoming deadlines to maximize GPA.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert AI Academic Analytics Advisor specializing in statistical grade forecasting, linear regression modeling, and GPA trajectory optimization.",
        temperature: 0.4,
      },
    });

    res.json({ insights: response.text });
  } catch (error: any) {
    console.error("GPA Prediction Error:", error);
    res.status(500).json({ error: formatGeminiError(error, "Could not generate GPA insights.") });
  }
});

// ----------------------------------------------------
// 6. PDF AI Summarizer Endpoint (Summaries, Terminology, Quiz Questions)
// ----------------------------------------------------
app.post("/api/ai/summarize-pdf", async (req, res) => {
  try {
    const { bookTitle, board, subject, grade, moduleTitle, moduleSummary, splitPages } = req.body;

    const pageContents = Array.isArray(splitPages)
      ? splitPages.map((p: any) => `[Page ${p.pageNumber} - ${p.title}]: ${p.excerpt}`).join("\n\n")
      : "";

    const prompt = `Analyze the following PDF textbook lesson module content and generate a comprehensive study breakdown:

Book Title: ${bookTitle || "Textbook"}
Syllabus / Board: ${board || "General Board"}
Grade Standard: ${grade || "Standard"}
Subject: ${subject || "General Subject"}
Lesson Module Title: ${moduleTitle || "Lesson Module"}
Module Executive Summary: ${moduleSummary || ""}

Excerpts from PDF Split Pages:
${pageContents}

Provide your response strictly as a JSON object adhering to this structure:
{
  "executiveSummary": [
    "4-5 concise, high-yield bullet point summaries capturing key concepts, mechanisms, and learning objectives"
  ],
  "keyTerms": [
    {
      "term": "Key Term Name",
      "definition": "Clear, precise academic definition according to syllabus standards",
      "example": "Contextual or practical textbook example"
    }
  ],
  "quizQuestions": [
    {
      "id": "q1",
      "question": "Thoughtful practice question testing understanding of the PDF content?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answerIndex": 0,
      "explanation": "Step-by-step reasoning explaining why Option A is correct based on the PDF content."
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert textbook curriculum analyst and AI study assistant. Produce detailed, high-yield, error-free study guides with concise summaries, key terminology, and practice questions based on textbook PDF content.",
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    });

    let resultJson: any = {};
    try {
      resultJson = JSON.parse(response.text || "{}");
    } catch (e) {
      console.error("Failed to parse Gemini JSON output:", response.text);
      resultJson = {
        executiveSummary: [response.text || "Summary generated."],
        keyTerms: [],
        quizQuestions: [],
      };
    }

    res.json(resultJson);
  } catch (error: any) {
    console.error("PDF Summarize API Error:", error);
    res.status(500).json({
      error: formatGeminiError(error, "Failed to generate AI PDF summary."),
      details: error.message || String(error),
    });
  }
});

// Create HTTP server to attach WebSockets for Live API
async function startServer() {
  const httpServer = http.createServer(app);

  // Attach Vite middleware in development
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

  // Set up WebSocket Server for Live Voice API (gemini-3.1-flash-live-preview)
  const wss = new WebSocketServer({ server: httpServer, path: "/live" });

  wss.on("connection", async (clientWs) => {
    console.log("[Live API] Client connected to Voice WebSocket.");

    try {
      const session = await ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: "You are Aura Voice AI, an empathetic, encouraging, and highly intelligent academic tutor. Keep spoken answers concise, conversational, and direct.",
        },
        callbacks: {
          onmessage: (message: any) => {
            const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audio) {
              clientWs.send(JSON.stringify({ audio }));
            }
            if (message.serverContent?.interrupted) {
              clientWs.send(JSON.stringify({ interrupted: true }));
            }
          },
          onclose: () => {
            console.log("[Live API] Gemini session closed.");
          },
          onerror: (err) => {
            console.error("[Live API] Gemini session error:", err);
          },
        },
      });

      clientWs.on("message", (data) => {
        try {
          const parsed = JSON.parse(data.toString());
          if (parsed.audio) {
            session.sendRealtimeInput({
              audio: { data: parsed.audio, mimeType: "audio/pcm;rate=16000" },
            });
          }
        } catch (e) {
          console.error("Error parsing client ws audio input:", e);
        }
      });

      clientWs.on("close", () => {
        try {
          session.close();
        } catch (e) {
          // ignore
        }
      });
    } catch (err) {
      console.error("[Live API] Connection error:", err);
      clientWs.send(JSON.stringify({ error: "Failed to initialize Gemini Live session." }));
    }
  });

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`[Aura Academics] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

