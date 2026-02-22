import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Clock } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { Question } from '../types';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is not set.');
}
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

type Difficulty = 'Beginner' | 'Intermediate' | 'Expert';

const SoloClimbGame: React.FC<{ difficulty: Difficulty; onExit: () => void; }> = ({ difficulty, onExit }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(difficulty === 'Beginner' ? 15 : difficulty === 'Intermediate' ? 10 : Infinity);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuestions = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate 5 unique trivia questions of ${difficulty} difficulty. For each question, provide a question, 4 multiple-choice options, and the correct answer. Format the output as a JSON array of objects, where each object has keys: "id", "question", "options", and "answer".`,
      });
      const responseText = result.text;
      const parsedQuestions = JSON.parse(responseText.replace(/```json|```/g, ''));
      setQuestions(prev => [...prev, ...parsedQuestions]);
    } catch (error) {
      console.error('Error fetching questions:', error);
      // Handle error, maybe show a message to the user
    } finally {
      setIsLoading(false);
    }
  }, [difficulty]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  useEffect(() => {
    if (isGameOver || difficulty === 'Expert') return;
    if (timeLeft === 0) {
      setIsGameOver(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isGameOver, difficulty]);

  const handleAnswer = (option: string) => {
    if (option === questions[currentQuestionIndex].answer) {
      setScore(prev => prev + 2); // 2 EXP per question
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(difficulty === 'Beginner' ? 15 : 10);
    } else {
      setIsGameOver(true);
    }
  };

  if (isLoading && questions.length === 0) {
    return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">Loading questions...</div>;
  }

  if (isGameOver) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <h1 className="text-5xl font-bold mb-4">Game Over</h1>
        <p className="text-2xl mb-8">You climbed {score / 2} questions and earned {score} EXP!</p>
        <button onClick={onExit} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-8 rounded-lg">Back to Lobby</button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      {currentQuestion && (
        <motion.div 
          key={currentQuestion.id}
          className="w-full max-w-3xl bg-gray-800 rounded-2xl shadow-lg p-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center mb-6">
            <div className="text-2xl font-bold text-cyan-400">Score: {score}</div>
            {difficulty !== 'Expert' && (
              <div className="flex items-center gap-2 text-xl font-semibold text-red-400">
                <Clock />
                <span>{timeLeft}s</span>
              </div>
            )}
          </div>
          <h2 className="text-3xl font-semibold text-center mb-8">{currentQuestion.question}</h2>
          <div className="grid grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleAnswer(option)}
                className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 px-6 rounded-lg text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SoloClimbGame;
