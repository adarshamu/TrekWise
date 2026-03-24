import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config(); 

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const { message } = req.body;
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", 
        messages: [
          {
            role: "system",
            content:
              "You are a trekking assistant for TrekWise. Suggest treks, safety tips, and travel advice.",
          },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();
    console.log(" OpenAI raw response:", data);

    const reply = data?.choices?.[0]?.message?.content ?? "No response.";
    res.json({ reply });
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ error: "OpenAI error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 OpenAI server running on http://localhost:${PORT}`)
);