import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Clock, ArrowLeft, Coins } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { Question, UserProfile } from '../types';
import { soundManager } from '../utils/audio';
import TauntSystem from '../components/TauntSystem';
import { SHOP_ITEMS } from '../data/shopItems';
import { getRandomKidsQuestions } from '../data/kidsQuestions';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is not set.');
}
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

type Difficulty = 'Beginner' | 'Intermediate' | 'Expert';

const SoloClimbGame: React.FC<{ difficulty: Difficulty; onExit: () => void; user: UserProfile; setUser: React.Dispatch<React.SetStateAction<UserProfile>> }> = ({ difficulty, onExit, user, setUser }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(difficulty === 'Beginner' ? 15 : difficulty === 'Intermediate' ? 10 : Infinity);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [activeTaunt, setActiveTaunt] = useState<{ content: string, type: 'Emoji' | 'Chat' | 'Taunt' } | null>(null);

  const selectedAvatarItem = SHOP_ITEMS.find(item => item.id === user.selectedAvatar);
  const selectedBorderItem = SHOP_ITEMS.find(item => item.id === user.selectedBorder);
  const avatarUrl = selectedAvatarItem?.assetName || 'https://api.dicebear.com/9.x/avataaars/svg?seed=Player';
  const borderClass = selectedBorderItem?.assetName || 'border-white';

  const awardChest = useCallback((won: boolean) => {
    if (won) {
      soundManager.playSfx('win');
    } else {
      soundManager.playSfx('lose');
    }
  }, []);

  const handleExit = useCallback((won: boolean) => {
    awardChest(won);
    onExit();
  }, [awardChest, onExit]);

  const fetchQuestions = useCallback(async () => {
    setIsLoading(true);
    
    const promptDifficulty = difficulty === 'Beginner' ? 'extremely easy, kid-friendly' : difficulty;
    
    try {
      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate 5 unique trivia questions of ${promptDifficulty} difficulty. 
        Topics must be extremely diverse, drawn from millions of possibilities (e.g., quantum physics, 18th-century literature, obscure sports, pop culture, biology, astronomy, international relations, trains, ships, entertainment, famous personalities, science, technology, art, geography, and highly specific obscure facts). Do not stick to just history or geography.
        ${difficulty === 'Beginner' ? 'Questions should be suitable for children aged 5-10.' : ''}
        IMPORTANT: At least 2 questions MUST be "image-based". For these, provide a descriptive "imageUrl" using a placeholder like 'https://picsum.photos/seed/[unique_seed]/800/450' and ensure the question refers to visual details.
        DO NOT repeat any of these question IDs: ${user.seenQuestionIds.join(', ')}.
        For each question, provide a unique "id" (string), "question", 4 multiple-choice "options", "answer", and "topic". 
        Format the output as a JSON array of objects.`,
      });
      const responseText = result.text;
      if (!responseText) throw new Error("Empty response");
      
      let parsedQuestions;
      try {
        parsedQuestions = JSON.parse(responseText.replace(/```json|```/g, ''));
      } catch (e) {
        throw new Error("Invalid JSON response");
      }
      const validQuestions = (Array.isArray(parsedQuestions) ? parsedQuestions : [parsedQuestions]).filter(q => q && q.question && Array.isArray(q.options) && q.answer);
      
      if (validQuestions.length === 0) throw new Error("No valid questions parsed");
      
      setQuestions(prev => [...prev, ...validQuestions]);
    } catch (error) {
      console.error('Error fetching questions:', error);
      // Fallback question to prevent crash
      setQuestions(prev => [...prev, {
        id: `fallback_${Date.now()}`,
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        answer: "Paris",
        topic: "Geography"
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [difficulty, user.seenQuestionIds]);

  useEffect(() => {
    fetchQuestions();
    soundManager.playBgm('bgm_game_solo');
    return () => soundManager.stopBgm();
  }, [fetchQuestions]);

  useEffect(() => {
    if (isGameOver || difficulty === 'Expert' || feedback) return;
    if (timeLeft === 0) {
      setIsGameOver(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 5 && prev > 0) {
          soundManager.playSfx('countdown');
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isGameOver, difficulty, feedback]);

  const handleAnswer = (option: string) => {
    if (feedback) return;

    const currentQuestion = questions[currentQuestionIndex];
    
    // Add to seen questions
    setUser(prev => ({
      ...prev,
      seenQuestionIds: [...prev.seenQuestionIds, currentQuestion.id]
    }));

    if (option === currentQuestion.answer) {
      soundManager.playSfx('correct');
      setFeedback('correct');
      setScore(prev => prev + 2);
      setTimeout(() => {
        setFeedback(null);
        setCurrentQuestionIndex(prev => prev + 1);
        setTimeLeft(difficulty === 'Beginner' ? 15 : 10);
        if (currentQuestionIndex + 1 >= questions.length) {
          fetchQuestions();
        }
      }, 1000);
    } else {
      soundManager.playSfx('wrong');
      setFeedback('wrong');
      setTimeout(() => setIsGameOver(true), 500);
    }
  };

  const handleSendTaunt = (content: string, type: 'Emoji' | 'Chat' | 'Taunt') => {
    soundManager.playSfx('click');
    setActiveTaunt({ content, type });
    setTimeout(() => setActiveTaunt(null), 2500);
  };

  if (isLoading && questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-solo-climb text-white">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-black uppercase tracking-widest italic text-gray-300">Preparing Climb...</p>
      </div>
    );
  }

  if (isGameOver) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-solo-climb text-white p-6 relative overflow-hidden">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#1e293b]/80 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl text-center max-w-sm w-full relative z-10"
        >
          <h1 className="text-5xl font-black italic tracking-tighter uppercase mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 font-display">Climb Over</h1>
          <p className="text-gray-400 mb-8 font-bold uppercase tracking-widest text-xs">You reached peak height</p>
          
          <div className="bg-black/20 p-6 rounded-2xl mb-8 border border-white/5 shadow-inner">
            <div className="text-xs text-gray-500 font-bold uppercase mb-1">Total EXP</div>
            <div className="text-5xl font-black text-blue-400">+{score}</div>
          </div>

          {/* Rewards Section */}
          <div className="flex justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-xl border border-yellow-500/30 shadow-md">
              <Coins className="text-yellow-400" size={20} />
              <span className="font-black text-xl text-yellow-400">+{Math.floor(score / 10)}</span>
            </div>
          </div>

          <motion.button 
            onClick={() => handleExit(score > 0)} 
            className="w-full bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-500/30 uppercase tracking-widest italic"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Collect Rewards
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-solo-climb text-white flex flex-col items-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
        <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[120px]" />
        <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-6 bg-[#1e293b]/80 p-4 rounded-2xl backdrop-blur-xl border border-white/5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-12 h-12 rounded-full border-2 ${borderClass} overflow-hidden bg-gray-800`}>
              <img src={avatarUrl} className="w-full h-full object-contain scale-[1.1]" referrerPolicy="no-referrer" />
            </div>
            <AnimatePresence>
              {activeTaunt && (
                <motion.div 
                  initial={{ scale: 0, opacity: 0, y: 10, rotate: -10 }}
                  animate={{ scale: 1, opacity: 1, y: -50, rotate: 5 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className={`absolute -top-2 left-1/2 -translate-x-1/2 px-4 py-2 rounded-2xl text-sm font-black whitespace-nowrap shadow-[0_10px_20px_rgba(0,0,0,0.4)] border-2 z-50 ${
                    activeTaunt.type === 'Taunt' 
                      ? 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 text-white border-white italic tracking-tighter' 
                      : activeTaunt.type === 'Chat'
                      ? 'bg-blue-600 text-white border-blue-400'
                      : 'bg-white text-black border-gray-200 text-2xl'
                  }`}
                >
                  {activeTaunt.content}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Score</div>
            <div className="text-xl font-black text-blue-400">{score}</div>
          </div>
        </div>

        {difficulty !== 'Expert' && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-colors ${timeLeft <= 5 ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse' : 'bg-black/20 border-white/10 text-white'}`}>
            <Clock size={16} />
            <span className="font-black text-lg">{timeLeft}s</span>
          </div>
        )}

        <button 
          onClick={() => { soundManager.playSfx('click'); handleExit(false); }}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Question Card */}
      <div className="flex-grow flex items-center justify-center w-full max-w-2xl relative z-10">
        <AnimatePresence mode='wait'>
          {currentQuestion && (
            <motion.div 
              key={currentQuestion.id}
              className="w-full bg-[#1e293b]/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-8 border border-white/10 flex flex-col relative z-10"
              initial={{ opacity: 0, scale: 0.8, y: 100, rotateX: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -100, rotateX: -30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {currentQuestion.topic && (
                <div className="mb-4 self-center">
                  <span className="bg-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-purple-500/30 shadow-md">
                    {currentQuestion.topic}
                  </span>
                </div>
              )}

              {/* Image Support */}
              {(currentQuestion.imageUrl || Math.random() > 0.5) && (
                <div className="w-full aspect-video rounded-2xl overflow-hidden mb-6 border border-white/10 shadow-lg bg-black/40 group">
                  <img 
                    src={currentQuestion.imageUrl || `https://picsum.photos/seed/${currentQuestion.id}/800/450?blur=1`} 
                    alt="Question"
                    className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              <div className="flex-grow flex items-center justify-center mb-8">
                <h2 className={`font-black text-center leading-tight tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300 font-display ${currentQuestion.question.length > 100 ? 'text-xl' : currentQuestion.question.length > 60 ? 'text-2xl' : 'text-3xl'}`}>
                  {currentQuestion.question}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => {
                  let btnStyle = "bg-white/5 border-white/5 hover:bg-white/10 shadow-md";
                  if (feedback === 'correct' && option === currentQuestion.answer) btnStyle = "bg-emerald-600 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]";
                  if (feedback === 'wrong' && option !== currentQuestion.answer && feedback) btnStyle = "bg-white/5 opacity-30";
                  if (feedback === 'wrong' && option === currentQuestion.answer) btnStyle = "bg-emerald-600 border-emerald-500";
                  
                  return (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswer(option)}
                      disabled={!!feedback}
                      className={`p-5 rounded-2xl text-lg font-black transition-all border-2 ${btnStyle} text-white uppercase tracking-wider italic`}
                      whileHover={{ scale: 1.05, y: -5, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {option}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Controls */}
      <div className="w-full max-w-2xl flex justify-end items-center mt-6 relative z-10">
        <TauntSystem onSend={handleSendTaunt} user={user} />
      </div>
    </div>
  );
};

export default SoloClimbGame;
