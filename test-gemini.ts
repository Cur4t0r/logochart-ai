import { GoogleGenAI, Type } from "@google/genai";
async function run() {
  try {
    const ai = new GoogleGenAI({ apiKey: "test-key" });
    const prompt = "Hello";
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    });
    console.log("SUCCESS:", !!response.text);
  } catch (e) {
    console.log("ERROR:", e);
  }
}
run();
