import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface LogoMetadata {
  svg: string;
  animation: {
    type: "spin" | "float" | "pulse" | "draw";
    duration: number;
    delay: number;
  };
  brandColors: string[];
  rationale: string;
}

export async function generateLogo(companyName: string, industry: string, colors: string[]): Promise<LogoMetadata> {
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

  return JSON.parse(response.text);
}
