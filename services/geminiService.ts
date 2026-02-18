
import { GoogleGenAI, Type } from "@google/genai";
import { ShoppingFormData, PredictionResult } from "../types";

export const predictShoppingPrice = async (data: ShoppingFormData): Promise<PredictionResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    As a friendly and helpful shopping assistant, predict the total cost and itemized breakdown for the following shopping request in India (Currency: Rupees ₹).
    
    Budget Provided: ₹${data.budget}
    Shopping Category: ${data.category}
    User's Shopping List/Details: "${data.billDetails}"
    
    Rules:
    1. Estimate realistic market prices in India for each item mentioned.
    2. Be very friendly and respectful in your "friendlyNote".
    3. Calculate the "estimatedTotal" as the sum of all item prices.
    4. "budgetStatus" should be 'under' if estimatedTotal < budget, 'over' if estimatedTotal > budget, and 'exact' otherwise.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          estimatedTotal: { type: Type.NUMBER },
          currency: { type: Type.STRING },
          confidence: { type: Type.NUMBER, description: "Confidence score 0-1" },
          categoryAnalysis: { type: Type.STRING },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                quantity: { type: Type.STRING },
                estimatedPrice: { type: Type.NUMBER }
              },
              required: ["name", "quantity", "estimatedPrice"]
            }
          },
          savingsTips: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          friendlyNote: { type: Type.STRING },
          budgetStatus: { type: Type.STRING, enum: ["under", "over", "exact"] }
        },
        required: ["estimatedTotal", "currency", "items", "friendlyNote", "budgetStatus"]
      }
    }
  });

  const resultText = response.text;
  try {
    return JSON.parse(resultText) as PredictionResult;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("I had a little trouble calculating those prices. Could you try again?");
  }
};
