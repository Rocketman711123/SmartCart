import { GoogleGenAI } from "@google/genai";
import { CATEGORIES } from '../constants';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  // This is a placeholder check. In a real environment, the key would be set.
  // We proceed assuming it's available in the execution context.
  console.warn("API_KEY environment variable not set. Using a placeholder.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || " " });

export const categorizeItem = async (itemName: string): Promise<string> => {
  const prompt = `Categorize the following shopping item: "${itemName}". Respond with only one of the following categories: ${CATEGORIES.join(', ')}.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    const category = response.text.trim();

    // Validate if the returned category is one of the predefined ones
    if (CATEGORIES.includes(category as any)) {
      return category;
    } else {
      console.warn(`Gemini returned an unknown category: "${category}". Defaulting to "Other".`);
      return 'Other';
    }
  } catch (error) {
    console.error("Error categorizing item with Gemini:", error);
    // Fallback to 'Other' in case of an API error
    return 'Other';
  }
};

export const getEstimatedLifespan = async (itemName: string): Promise<number> => {
    const prompt = `What is the typical shelf life of "${itemName}" in days after purchase or opening? Respond with only a single integer representing the average number of days. For example, for "Milk", you should respond with "7".`;
    const DEFAULT_LIFESPAN = 7;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const textResponse = response.text.trim();
        const lifespan = parseInt(textResponse, 10);

        if (!isNaN(lifespan) && lifespan > 0) {
            return lifespan;
        } else {
            console.warn(`Gemini returned a non-numeric lifespan: "${textResponse}". Defaulting to ${DEFAULT_LIFESPAN} days.`);
            return DEFAULT_LIFESPAN;
        }
    } catch (error) {
        console.error("Error getting item lifespan from Gemini:", error);
        return DEFAULT_LIFESPAN;
    }
};
