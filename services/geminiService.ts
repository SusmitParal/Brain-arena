import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";
import { MOCK_QUESTIONS, DIVERSE_TOPICS } from "../constants";

// Helper to shuffle array
const shuffle = (array: any[]) => array.sort(() => 0.5 - Math.random());

export const fetchQuestions = async (
  difficulty: string,
  language: string,
  count: number = 5
): Promise<Question[]> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.warn("No API Key found. Using mock questions.");
    return Promise.resolve(MOCK_QUESTIONS.slice(0, count));
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Pick 5 random topics from the massive list to ensure infinite variety
    const randomTopics = shuffle([...DIVERSE_TOPICS]).slice(0, 5).join(", ");
    
    const langName = language === 'hi' ? 'Hindi' : language === 'bn' ? 'Bengali' : 'English';
    
    const prompt = `Generate ${count} unique, engaging, and high-quality multiple-choice quiz questions.
    
    Context:
    - Language: ${langName}
    - Difficulty Level: ${difficulty} (Adjust complexity of question and options accordingly)
    - Topics: Mix questions randomly from these diverse domains: ${randomTopics}. 
    - Goal: Create a "Battle of Wits" feel. Include questions about personalities, cartoons, history, awards, pop culture, and science.
    - Style: Competitive quiz game, concise text, no repetitions.
    
    Format:
    - 4 Options per question.
    - 1 Correct Answer.
    - "category" field should be the specific topic of that question (e.g. "Physics", "Disney", "History").

    Return valid JSON array.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              category: { type: Type.STRING },
              difficulty: { type: Type.STRING },
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              answer: { type: Type.STRING }
            },
            required: ["question", "options", "answer", "category"]
          }
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return data.map((q: any, index: number) => ({
        ...q,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Unique ID
        difficulty // Ensure difficulty matches request
      }));
    }
    
    throw new Error("Empty response from Gemini");

  } catch (error) {
    console.error("Gemini API Error:", error);
    return MOCK_QUESTIONS.slice(0, count);
  }
};
