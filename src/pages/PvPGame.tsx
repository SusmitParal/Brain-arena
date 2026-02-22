import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Trophy, XCircle, CheckCircle } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { Arena, Question } from '../types';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is not set.');
}
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const PvPGame: React.FC<{ arena: Arena; onExit: () => void; }> = ({ arena, onExit }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15); // Time per question
  const [isGameOver, setIsGameOver] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  // AI Opponent Logic
  const opponentName = "Bot_" + Math.floor(Math.random() * 1000);
  const opponentAccuracy = arena.difficulty === 'Easy' ? 0.6 : arena.difficulty === 'Medium' ? 0.75 : 0.9;

  const fetchQuestions = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate 10 unique trivia questions about ${arena.slug} or general knowledge. Difficulty: ${arena.difficulty}. Format: JSON array of objects with keys "id", "question", "options", "answer".`,
      });
      const responseText = result.text;
      const parsedQuestions = JSON.parse(responseText.replace(/```json|```/g, ''));
      setQuestions(prev => [...prev, ...parsedQuestions]);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [arena]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Timer Logic
  useEffect(() => {
    if (isGameOver || isLoading) return;
    if (timeLeft === 0) {
      handleNextQuestion();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isGameOver, isLoading]);

  const handleNextQuestion = () => {
    setFeedback(null);
    setTimeLeft(15);
    if (currentQuestionIndex + 1 >= questions.length) {
      fetchQuestions(); // Fetch more if running out
    }
    setCurrentQuestionIndex(prev => prev + 1);
    
    // Opponent Turn Simulation
    if (Math.random() < opponentAccuracy) {
      setOpponentScore(prev => prev + 10);
    }
  };

  const handleAnswer = (option: string) => {
    if (feedback) return; // Prevent double clicking

    const isCorrect = option === questions[currentQuestionIndex].answer;
    if (isCorrect) {
      setPlayerScore(prev => prev + 10 + Math.floor(timeLeft / 2)); // Bonus for speed
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }

    setTimeout(handleNextQuestion, 1500);
  };

  if (isLoading && questions.length === 0) {
    return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">Loading Arena...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8 bg-gray-800/50 p-4 rounded-xl backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-xl">👤</div>
          <div>
            <div className="text-sm text-gray-400">You</div>
            <div className="text-2xl font-bold text-blue-400">{playerScore}</div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-xl font-bold text-yellow-400">{arena.name}</div>
          <div className="flex items-center gap-2 text-red-400 font-mono text-lg">
            <Clock size={20} /> {timeLeft}s
          </div>
        </div>

        <div className="flex items-center gap-4 text-right">
          <div>
            <div className="text-sm text-gray-400">{opponentName}</div>
            <div className="text-2xl font-bold text-red-400">{opponentScore}</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-xl">🤖</div>
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode='wait'>
        {currentQuestion && (
          <motion.div 
            key={currentQuestion.id}
            className="w-full max-w-2xl bg-gray-800 rounded-3xl shadow-2xl p-8 border border-white/5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 leading-tight">{currentQuestion.question}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => {
                let btnColor = "bg-gray-700 hover:bg-gray-600";
                if (feedback === 'correct' && option === currentQuestion.answer) btnColor = "bg-green-600";
                if (feedback === 'wrong' && option !== currentQuestion.answer && feedback) btnColor = "bg-gray-700 opacity-50";
                if (feedback === 'wrong' && option === currentQuestion.answer) btnColor = "bg-green-600"; // Show correct answer
                
                return (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={!!feedback}
                    className={`p-6 rounded-xl text-lg font-semibold transition-colors ${btnColor} text-white shadow-md`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {option}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button onClick={onExit} className="mt-8 text-gray-500 hover:text-white underline">
        Forfeit Match
      </button>
    </div>
  );
};

export default PvPGame;
