
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getMarketInsight = async (tokenName: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a very brief (2 sentence) market sentiment and analysis for ${tokenName} crypto. Be concise and professional.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            token: { type: Type.STRING },
            analysis: { type: Type.STRING },
            sentiment: { 
              type: Type.STRING,
              description: "One of: bullish, bearish, neutral"
            },
          },
          required: ["token", "analysis", "sentiment"]
        }
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};
