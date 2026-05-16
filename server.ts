import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Gemini if key exists
  const apiKey = process.env.GEMINI_API_KEY || "";
  const ai = new GoogleGenAI({ apiKey });

  // Body parsing middleware
  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "LogoCraft AI Backend is running" });
  });

  // Logo Generation API Endpoint
  app.post("/api/generate", async (req, res) => {
    try {
      const { companyName, industry, colors } = req.body;
      
      const prompt = `Design a modern, minimalist logo for a company named "${companyName}" in the "${industry}" industry.
      Preferred colors: ${colors.join(", ")}.
      
      Generate a single SVG (100x100 viewbox) that represents this brand.
      The SVG should be clean and suitable for high-end web applications.
      
      Also provide animation parameters for the logo's entry or idle state.
      
      Return the result in JSON format.`;
    
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              svg: { type: Type.STRING, description: "The complete SVG code (clean inline SVG)" },
              animation: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, enum: ["spin", "float", "pulse", "draw"] },
                  duration: { type: Type.NUMBER },
                  delay: { type: Type.NUMBER },
                },
                required: ["type", "duration", "delay"]
              },
              brandColors: { type: Type.ARRAY, items: { type: Type.STRING } },
              rationale: { type: Type.STRING, description: "Brief design rationale" }
            },
            required: ["svg", "animation", "brandColors", "rationale"]
          }
        }
      });
    
      const result = JSON.parse(response.text || "{}");
      res.json(result);
    } catch (error) {
      console.error("AI Generation Error:", error);
      res.status(500).json({ error: "Failed to generate logo" });
    }
  });

  // Example "Storage" endpoint (memory-only for now)
  const savedLogos: any[] = [];
  app.post("/api/logos", (req, res) => {
    const { name, logoData } = req.body;
    savedLogos.push({ name, logoData, timestamp: new Date() });
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
