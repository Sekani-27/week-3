
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Ensure the API key is available. In a real app, this would be handled by a secure process.
if (!process.env.API_KEY) {
  // In a real application, you would not expose this in the client.
  // This is a placeholder for development environments.
  console.warn("API_KEY is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateDocumentation = async (prompt: string): Promise<GenerateContentResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response;
  } catch (error) {
    console.error("Error generating documentation:", error);
    // Re-throw a more user-friendly error
    if (error instanceof Error && error.message.includes('API key not valid')) {
       throw new Error("Invalid API Key. Please check your configuration.");
    }
    throw new Error("Failed to generate content from the API. Please try again.");
  }
};
