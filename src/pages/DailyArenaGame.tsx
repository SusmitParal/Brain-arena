import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from '@google/genai';
import { UserProfile, Question } from '../types';
import { soundManager } from '../utils/audio';
import { ArrowLeft, Clock, Check, X, Crown } from 'lucide-react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

interface DailyArenaGameProps {
  user: UserProfile;
  onComplete: (score: number) => void;
  onExit: () => void;
}

const DailyArenaGame: React.FC<DailyArenaGameProps> = ({ user, onComplete, onExit }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (loading || isAnswered || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, isAnswered, gameOver, currentQuestionIndex]);

  const fetchQuestions = async () => {
    try {
      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: 'Generate 5 difficult, high-stakes trivia questions for a daily competition. Topics: General Knowledge, Science, History, Pop Culture. JSON format: [{ "id": "1", "question": "...", "options": ["A", "B", "C", "D"], "answer": "...", "topic": "..." }]',
      });
      const text = result.text;
      if (!text) throw new Error("Empty response");
      
      const parsed = JSON.parse(text.replace(/```json|```/g, ''));
      if (Array.isArray(parsed)) {
        setQuestions(parsed);
        setLoading(false);
      } else {
        throw new Error("Invalid format");
      }
    } catch (e) {
      console.error(e);
      // Fallback
      setQuestions([
        {
          id: '1',
          question: "Which element has the highest melting point?",
          options: ["Tungsten", "Carbon", "Titanium", "Osmium"],
          answer: "Tungsten",
          topic: "Science",
          difficulty: "Expert"
        },
        // ... more fallbacks if needed
      ]);
      setLoading(false);
    }
  };

  const handleTimeUp = () => {
    setIsAnswered(true);
    soundManager.playSfx('wrong');
    setTimeout(nextQuestion, 2000);
  };

  const handleAnswer = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    if (option === questions[currentQuestionIndex].answer) {
      soundManager.playSfx('win');
      setScore(prev => prev + 100 + (timeLeft * 10)); // Score based on time
    } else {
      soundManager.playSfx('wrong');
    }

    setTimeout(nextQuestion, 2000);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(15);
      setIsAnswered(false);
      setSelectedOption(null);
    } else {
      setGameOver(true);
      onComplete(score);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-black uppercase tracking-widest text-amber-500 animate-pulse">Preparing Arena...</p>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md w-full gpu"
        >
          <Crown size={80} className="text-amber-400 mx-auto mb-6 drop-shadow-[0_0_30px_rgba(251,191,36,0.6)]" />
          <h1 className="text-5xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-b from-amber-300 to-amber-600 mb-2 font-display">Arena Closed</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-8">Your Performance</p>
          
          <div className="bg-white/5 border border-amber-500/20 p-8 rounded-3xl backdrop-blur-md mb-8">
            <div className="text-6xl font-black text-white mb-2">{score}</div>
            <div className="text-amber-400 font-black uppercase tracking-widest text-xs">Total Score</div>
          </div>

          <button
            onClick={onExit}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black py-4 rounded-2xl text-xl uppercase tracking-widest italic shadow-lg shadow-amber-500/20 transition-all active:scale-95"
          >
            Claim Rewards
          </button>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-900/20 via-black to-black pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-center mb-8 relative z-10">
        <div className="flex items-center gap-2">
           <div className="bg-amber-500/20 p-2 rounded-lg border border-amber-500/30">
             <Crown size={20} className="text-amber-400" />
           </div>
           <span className="font-black uppercase tracking-widest text-xs text-amber-400">Daily Arena</span>
        </div>
        <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
          <Clock size={16} className={`${timeLeft < 5 ? 'text-red-500 animate-pulse' : 'text-gray-400'}`} />
          <span className={`font-mono font-bold ${timeLeft < 5 ? 'text-red-500' : 'text-white'}`}>{timeLeft}s</span>
        </div>
      </div>

      {/* Progress */}
      <div className="w-full h-1 bg-gray-800 rounded-full mb-8 relative z-10">
        <motion.div 
          className="h-full bg-amber-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="flex-grow flex flex-col justify-center max-w-2xl mx-auto w-full relative z-10 gpu">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-8 text-center gpu"
        >
          <span className="inline-block bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-4 border border-amber-500/20">
            {currentQuestion.topic}
          </span>
          <h2 className="text-2xl md:text-3xl font-black leading-tight">{currentQuestion.question}</h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === option;
            const isCorrect = isAnswered && option === currentQuestion.answer;
            const isWrong = isAnswered && isSelected && option !== currentQuestion.answer;
            
            let buttonClass = "bg-white/5 border-white/10 hover:bg-white/10";
            if (isCorrect) buttonClass = "bg-green-500 border-green-400 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]";
            else if (isWrong) buttonClass = "bg-red-500 border-red-400 text-white";
            else if (isSelected) buttonClass = "bg-amber-500 border-amber-400 text-white";

            return (
              <motion.button
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => handleAnswer(option)}
                disabled={isAnswered}
                className={`w-full p-4 rounded-xl border-2 font-bold text-left transition-all relative overflow-hidden group ${buttonClass}`}
              >
                <div className="flex justify-between items-center relative z-10">
                  <span>{option}</span>
                  {isCorrect && <Check size={20} />}
                  {isWrong && <X size={20} />}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DailyArenaGame;
