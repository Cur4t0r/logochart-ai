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
    throw new Error("Failed to generate logo");
  }

  return response.json();
}
