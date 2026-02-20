import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, GameResult, Question, ChatMessage } from '../types';
import { fetchQuestions } from '../services/geminiService';
import { TEAM_BOT_NAMES } from '../constants';
import Button from '../components/Button';
import { audioManager } from '../services/audioService';
import { Shield, Zap, Swords, Mic, MessageSquare, Skull } from 'lucide-react';

interface TeamBattleProps {
  user: UserProfile;
  tierAmount: number;
  rewardGems: number;
  difficulty: string;
  onGameEnd: (result: GameResult) => void;
}

const TeamBattle: React.FC<TeamBattleProps> = ({ user, tierAmount, rewardGems, difficulty, onGameEnd }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [stage, setStage] = useState<'LOADING' | 'PLAYING' | 'FINISHED'>('LOADING');
  
  // 7 Players per team
  const [myTeamScore, setMyTeamScore] = useState(0);
  const [enemyTeamScore, setEnemyTeamScore] = useState(0);
  
  // Chat / Logs
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Bot logic
  const enemyTeamName = "Bad Bots";

  useEffect(() => {
    const init = async () => {
       const qs = await fetchQuestions(difficulty, user.language, 10);
       setQuestions(qs);
       setStage('PLAYING');
       addLog("System", "Match Started! Let's GO!", true);
    };
    init();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog]);

  const addLog = (sender: string, text: string, isSystem = false, isTaunt = false) => {
    setChatLog(prev => [...prev.slice(-4), { id: Date.now().toString(), sender, text, isSystem, isTaunt }]);
  };

  const handleAnswer = (option: string) => {
    if (stage !== 'PLAYING') return;

    const currentQ = questions[currentQIndex];
    const isCorrect = option === currentQ.answer;

    // 1. My Contribution
    let myRoundScore = 0;
    if (isCorrect) {
       myRoundScore += 10;
       audioManager.playSFX('correct');
    } else {
       audioManager.playSFX('wrong');
    }

    // 2. Simulate Teammates (6 Bots)
    let teammatesScore = 0;
    for(let i=0; i<6; i++) {
        if (Math.random() > 0.4) teammatesScore += 10;
    }
    
    // 3. Simulate Enemy Team (7 Bots)
    let enemyRoundScore = 0;
    for(let i=0; i<7; i++) {
        if (Math.random() > 0.35) enemyRoundScore += 10;
    }

    // Chatter simulation
    if (Math.random() > 0.7) {
       const speaker = TEAM_BOT_NAMES[Math.floor(Math.random() * 6)]; // First 6 bots are teammates
       const msgs = ["I got this!", "Easy peasy!", "Help me out!", "Boom!", "Score!"];
       addLog(speaker, msgs[Math.floor(Math.random() * msgs.length)]);
    }

    setMyTeamScore(prev => prev + myRoundScore + teammatesScore);
    setEnemyTeamScore(prev => prev + enemyRoundScore);

    // Next Question or End
    if (currentQIndex < questions.length - 1) {
       setCurrentQIndex(prev => prev + 1);
    } else {
       finishMatch(myTeamScore + myRoundScore + teammatesScore, enemyTeamScore + enemyRoundScore);
    }
  };

  const finishMatch = (finalMyScore: number, finalEnemyScore: number) => {
     setStage('FINISHED');
     const won = finalMyScore > finalEnemyScore;
     
     const totalPot = tierAmount * 2;
     const myShare = Math.floor(totalPot / 7);
     
     const result: GameResult = {
        won,
        score: finalMyScore,
        coinsEarned: won ? myShare : 0, 
        expEarned: won ? 500 : 50,
        starsEarned: won ? 5 : 0,
        ratingChange: won ? 50 : -25,
        correctAnswers: Math.floor(finalMyScore / 10 / 7),
        totalQuestions: questions.length,
        chestEarned: undefined, 
        isTeamMatch: true
     };

     setTimeout(() => onGameEnd(result), 3000);
  };

  const sendTaunt = () => {
      const taunts = [
        "Catch me if you can! 🏃‍♂️", 
        "My brain is HUGE! 🧠", 
        "Nice try! 😜", 
        "I'm on fire! 🔥", 
        "Zoom zoom! 🚀", 
        "Oopsie! 🍌", 
        "Too easy! 😎", 
        "Booyah! 💥", 
        "Thinking cap: ON 🧢", 
        "Winning! 🏆",
        "Is that all? 😴",
        "Try harder! 💪"
      ];
      const t = taunts[Math.floor(Math.random() * taunts.length)];
      addLog(user.name, t, false, true);
      audioManager.playSFX('click');
  };

  if (stage === 'LOADING') return <div className="flex-1 flex items-center justify-center text-white font-black text-2xl animate-bounce">SYNCING SQUAD...</div>;

  if (stage === 'FINISHED') return (
    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
       {myTeamScore > enemyTeamScore ? (
          <>
            <Shield size={100} className="text-yellow-400 animate-bounce drop-shadow-lg" />
            <h1 className="text-6xl font-black text-white drop-shadow-[0_5px_0_rgba(0,0,0,0.5)]">VICTORY!</h1>
          </>
       ) : (
          <>
            <Skull size={100} className="text-red-900 drop-shadow-lg" />
            <h1 className="text-6xl font-black text-red-200 drop-shadow-[0_5px_0_rgba(0,0,0,0.5)]">DEFEAT</h1>
          </>
       )}
       <div className="text-4xl font-black text-white bg-black/30 px-8 py-4 rounded-3xl backdrop-blur">
          <span className="text-blue-400">{myTeamScore}</span> - <span className="text-red-400">{enemyTeamScore}</span>
       </div>
    </div>
  );

  const currentQ = questions[currentQIndex];

  return (
    <div className="flex-1 flex flex-col w-full h-full relative overflow-hidden">
       
       {/* Scoreboard */}
       <div className="relative z-10 flex justify-between items-center bg-white/10 backdrop-blur-md p-4 mx-4 mt-2 rounded-3xl border-2 border-white/30 shadow-xl">
          <div className="flex flex-col items-start">
             <div className="text-xs text-blue-200 uppercase tracking-widest font-black">{user.teamName || "Blue Team"}</div>
             <div className="text-4xl font-black text-white drop-shadow-md">{myTeamScore}</div>
             {/* 7 dots for players */}
             <div className="flex gap-1 mt-1">
                {Array.from({length:7}).map((_,i) => <div key={i} className="w-2 h-2 rounded-full bg-blue-400 shadow-sm"></div>)}
             </div>
          </div>

          <div className="flex flex-col items-center">
              <div className="bg-yellow-400 text-yellow-900 font-black px-3 py-1 rounded-full text-sm shadow-md mb-1">
                Q {currentQIndex + 1}/10
              </div>
              <Swords className="text-white opacity-50" size={24}/>
          </div>

          <div className="flex flex-col items-end">
             <div className="text-xs text-red-200 uppercase tracking-widest font-black">{enemyTeamName}</div>
             <div className="text-4xl font-black text-white drop-shadow-md">{enemyTeamScore}</div>
             <div className="flex gap-1 mt-1">
                {Array.from({length:7}).map((_,i) => <div key={i} className="w-2 h-2 rounded-full bg-red-400 shadow-sm"></div>)}
             </div>
          </div>
       </div>

       {/* Main Battle Area */}
       <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
          <div className="glass-panel w-full max-w-2xl p-8 rounded-3xl border-b-8 border-white/20 shadow-2xl mb-6 text-center min-h-[150px] flex items-center justify-center bg-white/90">
             <h2 className="text-xl md:text-2xl font-black text-slate-800">{currentQ.question}</h2>
          </div>

          <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
             {currentQ.options.map((opt, i) => (
                <button 
                  key={i} 
                  onClick={() => handleAnswer(opt)} 
                  className="bg-white hover:bg-gray-50 text-slate-800 font-bold text-lg py-4 px-6 rounded-2xl border-b-4 border-slate-300 active:border-b-0 active:translate-y-1 transition-all shadow-lg"
                >
                   {opt}
                </button>
             ))}
          </div>
       </div>

       {/* Bottom HUD: Chat & Actions */}
       <div className="relative z-10 h-48 bg-black/40 backdrop-blur-lg border-t-2 border-white/10 grid grid-cols-3">
          {/* Chat Log */}
          <div className="col-span-2 p-4 overflow-y-auto border-r-2 border-white/10 scrollbar-hide flex flex-col-reverse">
             <div ref={chatEndRef}></div>
             {chatLog.slice().reverse().map((msg) => (
                <div key={msg.id} className={`mb-2 text-sm font-bold bg-black/30 p-2 rounded-lg inline-block w-fit ${msg.isSystem ? 'text-yellow-300' : msg.isTaunt ? 'text-pink-300' : 'text-white'}`}>
                   {!msg.isSystem && <span className="text-blue-300 mr-1">{msg.sender}:</span>}
                   {msg.text}
                </div>
             ))}
          </div>

          {/* Controls */}
          <div className="col-span-1 p-4 flex flex-col gap-3 justify-center">
             <button className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl border-b-4 border-slate-900 active:border-b-0 active:translate-y-1 font-bold shadow-lg" onMouseDown={() => audioManager.playSFX('click')}>
                <Mic size={18} className={Math.random() > 0.5 ? "text-green-400 animate-pulse" : "text-gray-400"} /> 
                <span className="text-xs uppercase">Voice</span>
             </button>
             <button onClick={sendTaunt} className="flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-400 text-white py-3 rounded-xl border-b-4 border-pink-700 active:border-b-0 active:translate-y-1 font-bold shadow-lg">
                <MessageSquare size={18}/> 
                <span className="text-xs uppercase">Taunt</span>
             </button>
          </div>
       </div>
    </div>
  );
};

export default TeamBattle;
