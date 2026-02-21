import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function fetchQuestions(difficulty: string, language: string, count: number, seenIds: string[] = []) {
  const prompt = `
    Generate ${count} trivia questions.
    Difficulty: ${difficulty}.
    Language: ${language}.
    Ensure the questions are unique and not in this list of seen IDs: ${seenIds.join(', ')}.
    Format the output as a JSON array of objects, where each object has the following structure:
    { "id": "<unique_id>", "question": "<question_text>", "options": ["<option1>", "<option2>", "<option3>", "<option4>"], "answer": "<correct_option>", "difficulty": "${difficulty}", "topic": "<topic>" }
  `;

  try {
  const result = await genAI.models.generateContent({
    model: 'gemini-1.5-flash',
    contents: [{ parts: [{ text: prompt }] }]
  });
    const text = result.text;
    return JSON.parse(text);
  } catch (error) {
    console.error('Error fetching questions from Gemini:', error);
    // Fallback to mock questions
    return [];
  }
}
