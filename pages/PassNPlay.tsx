import React, { useState, useEffect } from 'react';
import { Question, GameResult } from '../types';
import Button from '../components/Button';
import { fetchQuestions } from '../services/geminiService';
import { Users, AlertTriangle, Zap } from 'lucide-react';
import { audioManager } from '../services/audioService';

interface PassNPlayProps {
  onGameEnd: (result: GameResult) => void;
  onExit: () => void;
}

const PassNPlay: React.FC<PassNPlayProps> = ({ onGameEnd, onExit }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');

  // Load a large batch of questions for offline play
  useEffect(() => {
    const loadData = async () => {
      // Fetch "Master" difficulty to ensure challenge, or mix.
      const q = await fetchQuestions("Intermediate", "en", 20); 
      setQuestions(q);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleAnswer = (option: string) => {
    const currentQ = questions[currentQIndex];
    const isCorrect = option === currentQ.answer;

    if (!isCorrect) {
      audioManager.playSFX('wrong');
      // Wrong answer -> Instant Loss -> Other player wins
      setGameState('GAMEOVER');
      const winner = currentPlayer === 1 ? 2 : 1;
      
      setTimeout(() => {
        onGameEnd({
            won: true, // Technical win for the app flow, but logic handled below
            score: currentQIndex * 10,
            coinsEarned: 0, // No coins in offline mode
            expEarned: 50, // Small EXP for playing
            starsEarned: 0,
            ratingChange: 0,
            correctAnswers: currentQIndex,
            totalQuestions: currentQIndex + 1,
            winnerName: `Player ${winner}`
        });
      }, 2000);
      return;
    }

    // Correct Answer -> Switch Turn
    audioManager.playSFX('correct');
    if (currentQIndex < questions.length - 1) {
      setCurrentPlayer(prev => prev === 1 ? 2 : 1);
      setCurrentQIndex(prev => prev + 1);
    } else {
      // Ran out of questions (Rare)
      setGameState('GAMEOVER');
      onGameEnd({
          won: true,
          score: 1000,
          coinsEarned: 0,
          expEarned: 100,
          starsEarned: 0,
          ratingChange: 0,
          correctAnswers: 20,
          totalQuestions: 20,
          winnerName: "Draw (Max Questions)"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="animate-spin text-cyan-400 mb-4"><Zap size={40}/></div>
        <p className="text-gray-400 font-orbitron">Initializing Battle Deck...</p>
      </div>
    );
  }

  if (gameState === 'START') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8 animate-fade-in">
        <div className="bg-slate-900/80 p-8 rounded-2xl border border-white/10 shadow-2xl max-w-md">
            <Users size={64} className="mx-auto text-purple-400 mb-4"/>
            <h1 className="text-4xl font-black font-orbitron text-white mb-2">PASS 'N PLAY</h1>
            <p className="text-gray-400 mb-6 font-rajdhani">
              Sudden Death Mode. <br/>
              One device. Two players.<br/>
              Take turns answering.<br/>
              <span className="text-red-500 font-bold uppercase">One wrong move and you lose.</span>
            </p>
            <Button variant="primary" size="lg" glow onClick={() => {
                audioManager.playSFX('click');
                setGameState('PLAYING');
            }} className="w-full">
              START MATCH
            </Button>
            <button onClick={onExit} className="mt-6 text-gray-500 underline text-sm">Cancel</button>
        </div>
      </div>
    );
  }

  if (gameState === 'GAMEOVER') {
    return (
       <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <AlertTriangle size={80} className="text-red-500 mb-4 animate-bounce"/>
          <h2 className="text-3xl font-orbitron text-red-500 font-bold">WRONG ANSWER!</h2>
          <p className="text-xl text-gray-300 mt-2">Player {currentPlayer} has been eliminated.</p>
       </div>
    );
  }

  const currentQ = questions[currentQIndex];

  return (
    <div className={`flex-1 flex flex-col p-6 transition-colors duration-500 ${currentPlayer === 1 ? 'bg-cyan-950/20' : 'bg-purple-950/20'}`}>
       {/* Turn Indicator */}
       <div className="flex justify-center mb-8">
          <div className={`px-8 py-3 rounded-full font-black font-orbitron text-xl border-2 shadow-[0_0_20px_currentColor] transition-all duration-300 transform scale-110
            ${currentPlayer === 1 ? 'bg-cyan-600 border-cyan-400 text-white' : 'bg-purple-600 border-purple-400 text-white'}
          `}>
             PLAYER {currentPlayer}'S TURN
          </div>
       </div>

       {/* Question */}
       <div className="glass-panel p-8 rounded-2xl mb-8 text-center border-t-2 border-white/20 shadow-xl min-h-[160px] flex items-center justify-center">
          <h2 className="text-2xl font-bold font-rajdhani leading-relaxed">{currentQ.question}</h2>
       </div>

       {/* Options */}
       <div className="grid grid-cols-1 gap-4">
          {currentQ.options.map((opt, i) => (
             <button
               key={i}
               onClick={() => handleAnswer(opt)}
               className="bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-white p-5 rounded-xl text-left text-lg font-semibold transition-all active:scale-95"
             >
               {opt}
             </button>
          ))}
       </div>
    </div>
  );
};

export default PassNPlay;
