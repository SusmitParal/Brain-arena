import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function fetchQuestions(difficulty: string, language: string, count: number, seenIds: string[] = []) {
  
  let prompt;
  const shouldAskImageQuestion = Math.random() < 0.25; // 25% chance

  if (shouldAskImageQuestion) {
    prompt = `
      Generate ${count} trivia question about the creator of a famous cartoon character.
      For example, "Who is the creator of the cartoon character shown in the image?"
      The answer should be the creator's name.
      Difficulty: ${difficulty}.
      Language: ${language}.
      Ensure the questions are unique and not in this list of seen IDs: ${seenIds.join(', ')}.
      Format the output as a JSON array of objects, where each object has the following structure:
      { "id": "<unique_id>", "question": "<question_text>", "options": ["<option1>", "<option2>", "<option3>", "<option4>"], "answer": "<correct_option>", "difficulty": "${difficulty}", "topic": "Cartoon Creators", "imageUrl": "https://picsum.photos/seed/doraemon/400/300" }
    `;
  } else {
    prompt = `
      Generate ${count} trivia questions.
      Difficulty: ${difficulty}.
      Language: ${language}.
      Ensure the questions are unique and not in this list of seen IDs: ${seenIds.join(', ')}.
      Format the output as a JSON array of objects, where each object has the following structure:
      { "id": "<unique_id>", "question": "<question_text>", "options": ["<option1>", "<option2>", "<option3>", "<option4>"], "answer": "<correct_option>", "difficulty": "${difficulty}", "topic": "<topic>" }
    `;
  }

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
