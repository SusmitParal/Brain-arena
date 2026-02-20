import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, Question, GameResult } from '../types';
import Button from '../components/Button';
import { fetchQuestions } from '../services/geminiService';
import { MOCK_QUESTIONS } from '../constants';
import { Loader2, CheckCircle, XCircle, Clock, BrainCircuit } from 'lucide-react';
import { audioManager } from '../services/audioService';

interface SoloGameProps {
  user: UserProfile;
  category: string;
  difficulty: string;
  onGameEnd: (result: GameResult) => void;
  onExit: () => void;
}

const SoloGame: React.FC<SoloGameProps> = ({ user, category, difficulty, onGameEnd, onExit }) => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20); 
  const [gameState, setGameState] = useState<'LOADING' | 'PLAYING' | 'FEEDBACK' | 'FINISHED'>('LOADING');
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch questions using the mixed topic logic
        const q = await fetchQuestions(difficulty, user.language, 5);
        setQuestions(q);
        setLoading(false);
        setGameState('PLAYING');
        startTimer();
      } catch (err) {
        console.error("SoloGame Load Error:", err);
        setQuestions(MOCK_QUESTIONS.slice(0, 5));
        setLoading(false);
        setGameState('PLAYING');
        startTimer();
      }
    };
    loadData();
    return () => stopTimer();
  }, []);

  const startTimer = () => {
    stopTimer();
    setTimeLeft(20);
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleTimeUp = () => {
    stopTimer();
    audioManager.playSFX('wrong');
    setSelectedOption(null);
    setIsCorrect(false);
    setGameState('FEEDBACK');
    setTimeout(nextQuestion, 2000);
  };

  const handleOptionClick = (option: string) => {
    if (gameState !== 'PLAYING') return;
    stopTimer();
    setSelectedOption(option);
    
    const correct = option === questions[currentIndex].answer;
    setIsCorrect(correct);
    if (correct) {
      audioManager.playSFX('correct');
      setScore(s => s + 10 + Math.ceil(timeLeft / 2)); 
    } else {
      audioManager.playSFX('wrong');
    }

    setGameState('FEEDBACK');
    setTimeout(nextQuestion, 2000);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
      setGameState('PLAYING');
      startTimer();
    } else {
      finishGame();
    }
  };

  const finishGame = () => {
    const totalPossible = questions.length * 10; 
    const won = score > (totalPossible * 0.5);
    const result: GameResult = {
      won,
      score,
      coinsEarned: Math.floor(score / 2),
      expEarned: score * 2,
      starsEarned: won ? 1 : 0,
      ratingChange: 0, 
      correctAnswers: score > 0 ? Math.floor(score / 15) : 0, 
      totalQuestions: questions.length
    };
    onGameEnd(result);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
        <div className="relative">
           <div className="w-16 h-16 rounded-full border-t-2 border-b-2 border-cyan-500 animate-spin"></div>
           <div className="w-16 h-16 rounded-full border-r-2 border-l-2 border-purple-500 animate-spin absolute top-0 left-0 animation-delay-150"></div>
        </div>
        <p className="text-cyan-400 font-orbitron animate-pulse tracking-widest text-sm">ACCESSING NEURAL NETWORK...</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  if (!currentQ) return <div>Error loading questions.</div>;

  return (
    <div className="flex-1 flex flex-col p-6 max-w-xl mx-auto w-full">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8 bg-slate-900/50 p-3 rounded-full border border-white/5">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-gray-400">
             {currentIndex + 1}/{questions.length}
           </div>
           <span className="text-xs text-gray-500 uppercase tracking-wider">{difficulty}</span>
        </div>
        
        <div className={`flex items-center gap-2 font-mono font-bold text-xl ${timeLeft < 5 ? 'text-red-500 animate-pulse' : 'text-cyan-400'}`}>
          <Clock size={20} /> {timeLeft}s
        </div>
      </div>

      {/* Question Card */}
      <div className="relative mb-8">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cyan-900/80 border border-cyan-500/50 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.5)] z-10">
          {currentQ.category || "General Knowledge"}
        </div>
        
        <div className="glass-panel p-8 rounded-2xl min-h-[180px] flex items-center justify-center text-center shadow-[0_0_30px_rgba(0,0,0,0.6)] border border-white/10 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <BrainCircuit size={100} className="text-white"/>
           </div>
           <h2 className="text-xl md:text-2xl font-bold font-rajdhani leading-snug relative z-10 drop-shadow-lg">
             {currentQ.question}
           </h2>
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3">
        {currentQ.options.map((opt, idx) => {
          let btnVariant: 'secondary' | 'primary' | 'danger' | 'gold' = 'secondary';
          let borderColor = "border-slate-700";
          
          if (gameState === 'FEEDBACK') {
            if (opt === currentQ.answer) {
              btnVariant = 'gold'; 
              borderColor = "border-yellow-500";
            }
            else if (opt === selectedOption && !isCorrect) {
              btnVariant = 'danger';
              borderColor = "border-red-500";
            }
          } else if (selectedOption === opt) {
            btnVariant = 'primary';
            borderColor = "border-cyan-500";
          }

          return (
            <button
              key={idx}
              onClick={() => handleOptionClick(opt)}
              disabled={gameState !== 'PLAYING'}
              className={`
                relative w-full text-left p-4 rounded-xl border ${borderColor} transition-all duration-200
                ${btnVariant === 'secondary' ? 'bg-slate-900/80 hover:bg-slate-800' : ''}
                ${btnVariant === 'primary' ? 'bg-cyan-900/80' : ''}
                ${btnVariant === 'gold' ? 'bg-yellow-900/80' : ''}
                ${btnVariant === 'danger' ? 'bg-red-900/80' : ''}
              `}
            >
              <div className="flex items-center">
                 <span className={`
                   flex items-center justify-center w-8 h-8 rounded-lg mr-4 font-mono text-sm font-bold
                   ${btnVariant === 'secondary' ? 'bg-slate-800 text-gray-400' : 'bg-black/30 text-white'}
                 `}>
                   {String.fromCharCode(65 + idx)}
                 </span>
                 <span className="font-rajdhani font-semibold text-lg flex-1">{opt}</span>
                 
                 {/* Icons for feedback */}
                 {gameState === 'FEEDBACK' && opt === currentQ.answer && (
                   <CheckCircle className="text-yellow-400" size={24} />
                 )}
                  {gameState === 'FEEDBACK' && opt === selectedOption && !isCorrect && (
                   <XCircle className="text-red-500" size={24} />
                 )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-8 flex justify-center">
         <button onClick={onExit} className="text-gray-600 hover:text-gray-400 uppercase tracking-widest text-xs font-bold transition-colors">
           Abort Mission
         </button>
      </div>
    </div>
  );
};

export default SoloGame;
