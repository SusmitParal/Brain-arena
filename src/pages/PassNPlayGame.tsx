import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, X, Loader2 } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { GoogleGenAI, Type } from '@google/genai';
import { Question } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

const PassNPlayGame: React.FC<{ playerNames: string[]; onExit: () => void; }> = ({ playerNames, onExit }) => {
  const [scores, setScores] = useState(playerNames.map(() => 0));
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuestions = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: 'Generate 10 fun, diverse trivia questions for a group of friends. Topics: Pop Culture, Movies, Music, General Knowledge. Format: JSON array of objects with id, question, options (4), answer, topic.',
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                answer: { type: Type.STRING },
                topic: { type: Type.STRING },
              },
            },
          },
        },
      });
      const responseText = result.text;
      const parsedQuestions = JSON.parse(responseText);
      setQuestions(prev => [...prev, ...parsedQuestions]);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (option: string) => {
    if (isAnswered || !currentQuestion) return;

    setSelectedOption(option);
    setIsAnswered(true);

    if (option === currentQuestion.answer) {
      const newScores = [...scores];
      newScores[currentPlayerIndex]++;
      setScores(newScores);
      soundManager.playSfx('correct');
    } else {
      soundManager.playSfx('wrong');
    }

    setTimeout(() => {
      setIsAnswered(false);
      setSelectedOption(null);
      
      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex >= questions.length - 2) {
        fetchQuestions(); // Pre-fetch more
      }
      
      setCurrentQuestionIndex(nextIndex);
      setCurrentPlayerIndex((currentPlayerIndex + 1) % playerNames.length);
    }, 2000);
  };

  if (isLoading && questions.length === 0) {
    return (
      <div className="fixed inset-0 bg-home text-white flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-400 mb-4" />
        <p className="font-black uppercase tracking-widest italic text-gray-400">Generating Unlimited Questions...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed inset-0 bg-home text-white flex flex-col"
    >
      {/* Header */}
      <div className="bg-[#1e293b]/80 backdrop-blur-xl p-4 flex items-center justify-between border-b border-white/5">
        <button
          onClick={() => { soundManager.playSfx('click'); onExit(); }}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300 font-display">{playerNames[currentPlayerIndex]}'s Turn</h1>
        <div className="flex items-center gap-4">
          {playerNames.map((name, i) => (
            <div key={i} className="text-center">
              <div className="text-xs font-bold">{name}</div>
              <div className="text-lg font-black">{scores[i]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center p-4 space-y-6">
        <AnimatePresence mode="wait">
          {currentQuestion && (
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-2xl flex flex-col items-center space-y-8"
            >
              <h2 className="text-3xl font-black text-center leading-tight tracking-tighter font-display">
                {currentQuestion.question}
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                {currentQuestion.options.map((option, i) => (
                  <motion.button
                    key={i}
                    onClick={() => handleAnswer(option)}
                    disabled={isAnswered}
                    className={`w-full p-6 rounded-2xl text-lg font-black transition-all border-2 uppercase italic tracking-wider font-display ${
                      isAnswered
                        ? option === currentQuestion.answer
                          ? 'bg-emerald-600 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                          : option === selectedOption
                          ? 'bg-rose-600 border-rose-400'
                          : 'bg-white/5 border-white/10 opacity-30'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:neon-glow-blue'
                    }`}
                    whileHover={!isAnswered ? { scale: 1.02, y: -2 } : {}}
                    whileTap={!isAnswered ? { scale: 0.98 } : {}}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PassNPlayGame;
