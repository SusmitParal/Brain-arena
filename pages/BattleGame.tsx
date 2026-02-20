import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, Question, GameResult } from '../types';
import Button from '../components/Button';
import { fetchQuestions } from '../services/geminiService';
import { Loader2, Swords, Trophy, User, Shield, Zap, Infinity } from 'lucide-react';
import { audioManager } from '../services/audioService';

interface BattleGameProps {
  user: UserProfile;
  entryFee: number;
  difficulty: string; 
  questionCount: number;
  onGameEnd: (result: GameResult) => void;
}

const OPPONENT_NAMES = ["CyberNinja", "QuizMaster99", "BrainBot_X", "NeoStriker", "AlphaWolf"];

const BattleGame: React.FC<BattleGameProps> = ({ user, entryFee, difficulty, questionCount, onGameEnd }) => {
  const [stage, setStage] = useState<'MATCHMAKING' | 'VERSUS' | 'PLAYING' | 'FINISHED'>('MATCHMAKING');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [opponent, setOpponent] = useState({ name: 'Searching...', rating: 1000, score: 0 });
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  // Matchmaking Simulation
  useEffect(() => {
    if (stage === 'MATCHMAKING') {
      const randomTime = Math.random() * 2000 + 2000;
      setTimeout(() => {
        const oppName = OPPONENT_NAMES[Math.floor(Math.random() * OPPONENT_NAMES.length)];
        const oppRating = Math.max(100, user.rating + Math.floor(Math.random() * 200 - 100));
        setOpponent({ name: oppName, rating: oppRating, score: 0 });
        setStage('VERSUS');
        audioManager.playSFX('click');
      }, randomTime);
    }
  }, [stage, user.rating]);

  // Versus Screen -> Playing
  useEffect(() => {
    if (stage === 'VERSUS') {
      const initGame = async () => {
        const q = await fetchQuestions(difficulty, user.language, 5);
        setQuestions(q);
        setTimeout(() => setStage('PLAYING'), 3000);
      };
      initGame();
    }
  }, [stage, user.language, difficulty]);

  // Opponent Simulation Logic (Periodic score increase)
  useEffect(() => {
    if (stage === 'PLAYING') {
      // Opponent simulates play every 6 seconds
      const interval = setInterval(() => {
        const accuracy = Math.min(0.9, opponent.rating / 3000 + 0.3); // Higher rating = better chance
        const isCorrect = Math.random() < accuracy;
        if (isCorrect) {
          setOpponentScore(prev => prev + 10);
        }
      }, 6000); 

      return () => clearInterval(interval);
    }
  }, [stage, opponent.rating]);

  const handleAnswer = async (option: string | null) => {
    const currentQ = questions[currentQIndex];
    const isCorrect = option && currentQ && option === currentQ.answer;

    if (!isCorrect) {
      audioManager.playSFX('wrong');
      // Sudden Death: One wrong answer ends the game immediately
      finishBattle();
      return;
    }

    // Correct Answer
    audioManager.playSFX('correct');
    setUserScore(prev => prev + 10);

    // Fetch more questions if needed (Lazy Loading)
    // If we are 2 questions away from the end, and we haven't reached the limit
    if (currentQIndex + 3 >= questions.length && questions.length < questionCount && !loadingMore) {
        setLoadingMore(true);
        // Determine how many to fetch. Default 5, but cap at remaining.
        const remaining = questionCount - questions.length;
        const toFetch = Math.min(5, remaining);
        if (toFetch > 0) {
            fetchQuestions(difficulty, user.language, toFetch).then(newQs => {
                setQuestions(prev => [...prev, ...newQs]);
                setLoadingMore(false);
            });
        }
    }

    // Move to next question or end if limit reached
    if (currentQIndex < questions.length - 1 && currentQIndex < questionCount - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      finishBattle();
    }
  };

  const finishBattle = () => {
    setStage('FINISHED');
    // Win if user score is strictly greater
    const won = userScore > opponentScore;
    const result: GameResult = {
      won,
      score: userScore,
      coinsEarned: won ? entryFee * 2 : 50, 
      expEarned: 0,
      starsEarned: won ? 1 : 0,
      ratingChange: won ? 25 : -20,
      correctAnswers: Math.floor(userScore / 10), 
      totalQuestions: currentQIndex + 1
    };
    setTimeout(() => onGameEnd(result), 3000);
  };

  // --- Renders ---

  if (stage === 'MATCHMAKING') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
        <div className="relative">
           <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-20 animate-pulse"></div>
           <div className="w-32 h-32 border-4 border-slate-800 rounded-full flex items-center justify-center relative z-10 bg-black">
             <div className="w-24 h-24 border-t-2 border-cyan-500 rounded-full animate-spin"></div>
           </div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-500 font-bold">SCANNING</div>
        </div>
        <h2 className="text-xl font-rajdhani text-gray-400 tracking-widest uppercase">Locating Opponent...</h2>
      </div>
    );
  }

  if (stage === 'VERSUS') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center w-full px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-900/20 to-red-900/20 z-0"></div>
        <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-3xl gap-12 z-10">
          <div className="flex flex-col items-center animate-slide-in-left group">
            <div className="w-32 h-32 rounded-full bg-gradient-to-b from-cyan-500 to-blue-700 p-1 mb-6 shadow-[0_0_30px_rgba(6,182,212,0.6)]">
               <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                 <User size={64} className="text-cyan-400" />
               </div>
            </div>
            <h3 className="text-3xl font-bold font-orbitron text-white">{user.name}</h3>
            <div className="flex items-center gap-2 text-cyan-400 font-bold mt-2 bg-black/50 px-4 py-1 rounded-full">
               <Shield size={16}/> {user.rating}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-8xl font-black font-orbitron italic text-white drop-shadow-[0_0_20px_rgba(255,0,0,0.8)] animate-pulse">VS</h1>
            <div className="text-xs font-bold uppercase tracking-[0.5em] text-gray-500 mt-4">Match Found</div>
          </div>
          <div className="flex flex-col items-center animate-slide-in-right">
             <div className="w-32 h-32 rounded-full bg-gradient-to-b from-red-500 to-orange-700 p-1 mb-6 shadow-[0_0_30px_rgba(239,68,68,0.6)]">
               <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                 <User size={64} className="text-red-400" />
               </div>
            </div>
            <h3 className="text-3xl font-bold font-orbitron text-white">{opponent.name}</h3>
            <div className="flex items-center gap-2 text-red-400 font-bold mt-2 bg-black/50 px-4 py-1 rounded-full">
               <Shield size={16}/> {opponent.rating}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'PLAYING') {
    const currentQ = questions[currentQIndex];
    if (!currentQ) return <div className="flex-1 flex items-center justify-center"><Loader2 className="animate-spin"/></div>;

    return (
      <div className="flex-1 flex flex-col p-4 w-full max-w-xl mx-auto">
        {/* Battle Header - No Timer, just Scores */}
        <div className="grid grid-cols-3 items-center bg-slate-900/90 p-4 rounded-2xl border border-white/10 mb-6 shadow-xl">
          <div className="flex flex-col items-start border-r border-white/5 pr-4">
             <span className="text-cyan-400 font-bold text-xs uppercase tracking-wider mb-1">YOU</span>
             <span className="text-3xl font-orbitron text-white">{userScore}</span>
          </div>
          
          <div className="flex flex-col items-center justify-center">
             <div className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">Target</div>
             <div className="text-2xl font-black font-orbitron text-white flex items-center gap-1">
               {questionCount > 1000 ? <Infinity size={24}/> : `${currentQIndex + 1} / ${questionCount}`}
             </div>
          </div>
          
          <div className="flex flex-col items-end border-l border-white/5 pl-4">
             <span className="text-red-400 font-bold text-xs uppercase tracking-wider mb-1">ENEMY</span>
             <span className="text-3xl font-orbitron text-white">{opponentScore}</span>
          </div>
        </div>

        {/* Question */}
        <div className="glass-panel p-6 rounded-xl mb-4 text-center border-t-4 border-purple-500 shadow-2xl relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase">
            {difficulty} Level
          </div>
          <h2 className="text-lg md:text-xl font-bold font-rajdhani mt-2">{currentQ.question}</h2>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 gap-3">
          {currentQ.options.map((opt, i) => (
             <Button 
               key={i} 
               variant="secondary" 
               onClick={() => handleAnswer(opt)} 
               className="h-16 text-sm md:text-base border-slate-700 hover:border-purple-400 hover:bg-slate-800"
             >
               {opt}
             </Button>
          ))}
        </div>
        
        {/* Momentum Bar */}
        <div className="mt-8 relative w-full h-2 bg-gray-800 rounded-full overflow-hidden">
           <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white z-10"></div>
           <div 
             className="absolute top-0 bottom-0 bg-cyan-500 transition-all duration-300" 
             style={{ 
               left: '50%', 
               width: `${Math.min(50, (userScore / (userScore + opponentScore + 1)) * 50)}%`,
               transform: 'translateX(-100%)' 
             }}
           ></div>
           <div 
             className="absolute top-0 bottom-0 bg-red-500 transition-all duration-300"
             style={{ 
               left: '50%',
               width: `${Math.min(50, (opponentScore / (userScore + opponentScore + 1)) * 50)}%`
             }}
           ></div>
        </div>
        <div className="flex justify-between text-[10px] text-gray-500 mt-2 font-mono uppercase">
           <span>Domination</span>
           <span>Danger</span>
        </div>
      </div>
    );
  }

  if (stage === 'FINISHED') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
        {userScore > opponentScore ? (
           <>
            <div className="relative">
               <Trophy size={100} className="text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.6)] animate-bounce" />
               <Zap className="absolute top-0 right-0 text-white animate-pulse" fill="white"/>
            </div>
            <h1 className="text-5xl font-orbitron text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 font-black tracking-tighter">VICTORY</h1>
           </>
        ) : (
           <>
            <Swords size={100} className="text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.6)]" />
            <h1 className="text-5xl font-orbitron text-red-500 font-black tracking-tighter">DEFEAT</h1>
            <p className="text-red-300 uppercase tracking-widest font-bold">Mission Failed</p>
           </>
        )}
        <div className="text-3xl font-mono font-bold bg-slate-900 px-8 py-4 rounded-xl border border-white/10">
           <span className="text-cyan-400">{userScore}</span> <span className="text-gray-600 mx-2">/</span> <span className="text-red-400">{opponentScore}</span>
        </div>
      </div>
    );
  }

  return null;
};

export default BattleGame;