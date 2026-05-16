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
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ companyName, industry, colors }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const details = errorData.details || "";
    
    if (details.includes("API key not valid") || details.includes("API_KEY_INVALID")) {
      throw new Error("Invalid Gemini API Key. Please configure a valid API key in the AI Studio Secrets panel.");
    }
    
    throw new Error(errorData.error || "Failed to generate logo");
  }

  return response.json();
}
