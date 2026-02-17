
import { GoogleGenAI, Type } from "@google/genai";
import { HealthAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const analyzeFoodImage = async (base64Image: string): Promise<HealthAnalysis> => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `Analyze this food product image. It might be the product itself or its nutritional label. 
  Provide a detailed health analysis in French. 
  Be objective and scientifically accurate based on standard nutritional guidelines (like Nutri-Score principles).`;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image,
          },
        },
        { text: prompt },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          productName: { type: Type.STRING },
          healthScore: { type: Type.NUMBER, description: "Score de 0 à 100" },
          verdict: { type: Type.STRING, enum: ['Excellent', 'Bon', 'Médiocre', 'Mauvais'] },
          calories: { type: Type.STRING },
          nutrients: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                value: { type: Type.STRING },
                impact: { type: Type.STRING, enum: ['positive', 'neutral', 'negative'] }
              },
              required: ["label", "value", "impact"]
            }
          },
          pros: { type: Type.ARRAY, items: { type: Type.STRING } },
          cons: { type: Type.ARRAY, items: { type: Type.STRING } },
          additives: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendation: { type: Type.STRING },
          alternatives: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["productName", "healthScore", "verdict", "calories", "nutrients", "pros", "cons", "additives", "recommendation", "alternatives"]
      }
    },
  });

  const text = response.text;
  if (!text) throw new Error("Aucune réponse de l'IA");
  return JSON.parse(text) as HealthAnalysis;
};
