import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mic, Send, Shield, Bot, XCircle, CheckCircle, Coins, Gem, Trophy, MessageSquare } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { UserProfile, Question, Rank } from '../types';
import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

interface TeamMember {
  name: string;
  avatar: string;
  isBot: boolean;
}

const TeamBattleGame: React.FC<{ 
  onExit: () => void; 
  user: UserProfile; 
  userTeam: (UserProfile | { name: string; avatar: string; isBot: boolean } | null)[];
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}> = ({ onExit, user, userTeam, setUser }) => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [messages, setMessages] = useState<{ sender: string; text: string; isBot: boolean }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [playerTeamScore, setPlayerTeamScore] = useState(0);
  const [opponentTeamScore, setOpponentTeamScore] = useState(0);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0); // 0-4
  const [isUserTurn, setIsUserTurn] = useState(false);
  const [opponentTeam, setOpponentTeam] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const BOT_NAMES = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Jamie', 'Quinn', 'Avery', 'Skyler', 'Sam', 'Charlie', 'Liam', 'Emma', 'Noah', 'Olivia', 'William', 'Ava', 'James', 'Isabella'];

  const [isBetting, setIsBetting] = useState(true);

  // Initialize Opponent Team
  useEffect(() => {
    // Deduct entry fee (e.g., 500 coins)
    const entryFee = 500;
    if (user.coins >= entryFee) {
      setUser(prev => ({ ...prev, coins: prev.coins - entryFee }));
      soundManager.playSfx('collect');
    } else {
      // If they somehow got here without enough coins, just let them play for now 
      // but in a real app we'd prevent entry.
    }

    const team: TeamMember[] = Array.from({ length: 5 }, () => ({
      name: BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)],
      avatar: `https://api.dicebear.com/9.x/micah/svg?seed=${Math.random()}`,
      isBot: true
    }));
    setOpponentTeam(team);
    soundManager.playBgm('bgm_game_pvp');
    
    // Betting animation
    const timer = setTimeout(() => {
      setIsBetting(false);
      fetchNewQuestion();
    }, 2000);

    return () => {
      soundManager.stopBgm();
      clearTimeout(timer);
    };
  }, []);

  const [shake, setShake] = useState(false);

  const awardRewards = useCallback((won: boolean) => {
    if (won) {
      setUser(prev => ({
        ...prev,
        coins: prev.coins + 500,
        exp: prev.exp + 100,
        matchesWon: prev.matchesWon + 1,
        matchesPlayed: prev.matchesPlayed + 1,
      }));
      soundManager.playSfx('win');
    } else {
      setUser(prev => ({
        ...prev,
        matchesPlayed: prev.matchesPlayed + 1,
      }));
      soundManager.playSfx('lose');
    }
  }, [setUser]);

  const handleAnswer = useCallback((option: string) => {
    if (gameOver || selectedAnswer || !question) return;
    setSelectedAnswer(option);
    
    const isCorrect = option === question.answer;
    
    if (isCorrect) {
      soundManager.playSfx('correct');
      setPlayerTeamScore(prev => {
        const newScore = prev + 10;
        if (newScore >= 1000) { // Increased for 'Infinite' feel
          setGameOver(true);
          awardRewards(true);
        }
        return newScore;
      });
      
      // Opponent also gets a chance (Balanced accuracy: 75%)
      if (Math.random() < 0.75) {
        setOpponentTeamScore(prev => {
          const newScore = prev + 10;
          if (newScore >= 1000) { // Increased for 'Infinite' feel
            setGameOver(true);
            awardRewards(false);
          }
          return newScore;
        });
      }
    } else {
      soundManager.playSfx('wrong');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setPlayerTeamScore(prev => Math.max(0, prev - 5));
      
      // Opponent might get a point if player fails (Balanced accuracy: 75%)
      if (Math.random() < 0.75) {
        setOpponentTeamScore(prev => {
          const newScore = prev + 10;
          if (newScore >= 1000) { // Increased for 'Infinite' feel
            setGameOver(true);
            awardRewards(false);
          }
          return newScore;
        });
      }
    }

    setTimeout(() => {
      if (!gameOver) {
        setActivePlayerIndex(prev => (prev + 1) % 5);
      }
    }, 1500);
  }, [gameOver, selectedAnswer, question, awardRewards]);

  const fetchNewQuestion = async () => {
    if (gameOver) return;
    setIsLoading(true);
    try {
      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: 'Generate one unique, medium-difficulty trivia question.',
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
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
      });
      const responseText = result.text;
      const parsedQuestion = JSON.parse(responseText);
      setQuestion(parsedQuestion);
      setSelectedAnswer(null);
      
      // Determine whose turn it is in the player team
      const currentPlayer = userTeam[activePlayerIndex];
      const isUser = currentPlayer && 'id' in currentPlayer && currentPlayer.id === user.id;
      setIsUserTurn(!!isUser);
    } catch (error) {
      console.error('Error fetching question:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isBetting) {
      fetchNewQuestion();
    }
  }, [activePlayerIndex, isBetting]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Bot Turn Effect
  useEffect(() => {
    if (!isUserTurn && question && !selectedAnswer && !gameOver && !isLoading && !isBetting) {
      const timer = setTimeout(() => {
        // Balanced accuracy for teammate bots: 75%
        const isCorrect = Math.random() < 0.75;
        const answer = isCorrect ? question.answer : question.options.find(o => o !== question.answer) || question.options[0];
        handleAnswer(answer);
        
        const currentPlayer = userTeam[activePlayerIndex];
        setMessages(prev => [...prev, { 
          sender: currentPlayer?.name || 'Teammate', 
          text: isCorrect ? "Got it!" : "I think it's this one...", 
          isBot: true 
        }]);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isUserTurn, question, selectedAnswer, gameOver, isLoading, isBetting, activePlayerIndex, userTeam, handleAnswer]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages(prev => [...prev, { sender: user.name, text: inputValue, isBot: false }]);
      setInputValue('');
    }
  };

  const getAvatar = (member: any) => {
    if (!member) return `https://api.dicebear.com/9.x/micah/svg?seed=empty`;
    if (member.id === user.id) {
      return user.selectedAvatar.startsWith('av_') 
        ? `https://api.dicebear.com/9.x/micah/svg?seed=${user.name}` 
        : user.selectedAvatar;
    }
    return member.avatar || `https://api.dicebear.com/9.x/micah/svg?seed=${member.name}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: 1,
        x: shake ? [-10, 10, -10, 10, 0] : 0
      }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-pvp-game text-white flex flex-col relative overflow-hidden font-sans"
    >
      {/* Betting Animation Overlay */}
      <AnimatePresence>
        {isBetting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1.5 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="text-yellow-400 flex flex-col items-center"
            >
              <Coins size={64} />
              <span className="font-black text-3xl mt-2">5000</span>
              <span className="text-xs font-bold uppercase tracking-widest text-white/50">Total Prize Pool</span>
            </motion.div>
            
            <div className="mt-12 flex gap-8">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full border-2 border-blue-400 overflow-hidden bg-gray-800">
                  <img src={getAvatar(user)} className="w-full h-full" />
                </div>
                <div className="text-[10px] font-black uppercase text-blue-400">Team 1</div>
              </div>
              <div className="text-4xl font-black italic text-white/20 self-center">VS</div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full border-2 border-red-400 overflow-hidden bg-gray-800">
                  <img src={opponentTeam[0]?.avatar} className="w-full h-full" />
                </div>
                <div className="text-[10px] font-black uppercase text-red-400">Team 2</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
        <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[120px]" />
        <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <div className="bg-[#0f172a]/95 backdrop-blur-xl p-2 flex items-center justify-between border-b border-white/10 relative z-20 shadow-2xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { soundManager.playSfx('click'); onExit(); }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10 hover:neon-glow-blue"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-lg font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 font-display leading-none">Team Battle</h1>
            <div className="text-[8px] font-black text-blue-400 uppercase tracking-[0.3em] leading-none mt-1">Championship Arena</div>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-black/60 px-4 py-1.5 rounded-2xl border border-white/10 shadow-inner">
          <div className="text-center">
            <div className="text-[8px] text-blue-400/50 font-black uppercase leading-none">Team 1</div>
            <div className="text-xl font-black text-blue-400 leading-none mt-1 text-glow">{playerTeamScore}</div>
          </div>
          <div className="text-lg font-black italic text-gray-700 select-none">VS</div>
          <div className="text-center">
            <div className="text-[8px] text-red-400/50 font-black uppercase leading-none">Team 2</div>
            <div className="text-xl font-black text-red-400 leading-none mt-1 text-glow">{opponentTeamScore}</div>
          </div>
        </div>
      </div>

      {/* Teams Display */}
      <div className="grid grid-cols-2 gap-1 px-2 py-1 relative z-20">
        {/* Player Team */}
        <div className="bg-blue-900/30 rounded-lg p-1 border border-blue-500/30">
          <div className="flex flex-col gap-0.5">
            {userTeam.map((member: any, i) => (
              <div key={i} className={`flex items-center gap-1.5 p-0.5 rounded transition-all ${activePlayerIndex === i ? 'bg-blue-500/30 border border-blue-400/50 scale-[1.02]' : 'opacity-40'}`}>
                <div className={`w-5 h-5 rounded-full border ${activePlayerIndex === i ? 'border-blue-400' : 'border-white/10'} overflow-hidden bg-gray-800 shrink-0`}>
                  <img src={getAvatar(member)} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </div>
                <span className={`text-[8px] font-black truncate max-w-[50px] uppercase tracking-tighter ${activePlayerIndex === i ? 'text-white' : 'text-gray-400'}`}>{member?.name || 'Player'}</span>
                {activePlayerIndex === i && <div className="ml-auto w-1 h-1 bg-blue-400 rounded-full animate-ping" />}
              </div>
            ))}
          </div>
        </div>

        {/* Opponent Team */}
        <div className="bg-red-900/30 rounded-lg p-1 border border-red-500/30">
          <div className="flex flex-col gap-0.5">
            {opponentTeam.map((member, i) => (
              <div key={i} className="flex items-center gap-1.5 p-0.5 rounded opacity-60 flex-row-reverse">
                <div className="w-5 h-5 rounded-full border border-white/10 overflow-hidden bg-gray-800 shrink-0">
                  <img src={member.avatar} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </div>
                <span className="text-[8px] font-black truncate max-w-[50px] text-right uppercase tracking-tighter text-gray-400">{member.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="flex-grow flex flex-col p-2 gap-2 relative z-20 overflow-hidden">
        {/* Question Section */}
        <div className="flex-grow flex flex-col items-center justify-center px-4">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="text-center"
              >
                <div className="relative w-16 h-16 mx-auto mb-6">
                  <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-400 animate-pulse">Syncing Data...</p>
              </motion.div>
            ) : question ? (
              <motion.div
                key={question.id}
                initial={{ scale: 0.95, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 1.05, opacity: 0, y: -30 }}
                className="w-full max-w-lg"
              >
                <div className="glass-panel p-6 rounded-3xl text-center mb-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-shine" />
                  <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-3">{question.topic}</div>
                  <h2 className="text-2xl font-black leading-tight text-white font-display mb-4">{question.question}</h2>
                  <div className={`inline-block px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isUserTurn ? 'bg-blue-500 text-white animate-pulse' : 'bg-white/10 text-gray-400'}`}>
                    {isUserTurn ? "YOUR TURN" : `WAITING FOR ${userTeam[activePlayerIndex]?.name?.toUpperCase()}`}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {question.options.map((option, i) => {
                    const isCorrect = option === question.answer;
                    const isSelected = selectedAnswer === option;
                    let btnClass = "bg-white/5 border-white/10 hover:bg-white/10 text-white/70";
                    
                    if (selectedAnswer) {
                      if (isCorrect) btnClass = "bg-emerald-500 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]";
                      else if (isSelected) btnClass = "bg-rose-500 border-rose-400 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]";
                      else btnClass = "bg-white/5 opacity-20";
                    }

                    return (
                      <motion.button
                        key={i}
                        whileHover={!selectedAnswer && isUserTurn ? { scale: 1.02, y: -2 } : {}}
                        whileTap={!selectedAnswer && isUserTurn ? { scale: 0.98 } : {}}
                        disabled={!isUserTurn || !!selectedAnswer}
                        onClick={() => handleAnswer(option)}
                        className={`p-4 rounded-2xl font-black text-sm transition-all border-2 uppercase italic tracking-wider font-display ${btnClass} ${!isUserTurn ? 'cursor-not-allowed' : ''}`}
                      >
                        {option}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Chat Section */}
        <div className="h-32 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 flex flex-col overflow-hidden">
          <div className="flex-grow overflow-y-auto p-1.5 space-y-1.5 no-scrollbar">
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-start gap-1.5 ${msg.sender === user.name ? 'flex-row-reverse' : ''}`}>
                <div className="w-5 h-5 rounded-full overflow-hidden bg-gray-800 shrink-0 border border-white/10">
                  <img src={msg.sender === user.name ? getAvatar(user) : `https://api.dicebear.com/9.x/micah/svg?seed=${msg.sender}`} className="w-full h-full" referrerPolicy="no-referrer" />
                </div>
                <div className={`px-2 py-1 rounded-lg max-w-[85%] ${msg.sender === user.name ? 'bg-blue-600 rounded-tr-none' : 'bg-white/10 rounded-tl-none'}`}>
                  <div className="text-[7px] font-black text-white/50 uppercase mb-0.5">{msg.sender}</div>
                  <div className="text-[10px] font-medium leading-tight">{msg.text}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-1.5 border-t border-white/10 flex gap-1 bg-black/20">
            <button className="p-1.5 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
              <Mic size={14} />
            </button>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-grow bg-white/5 border border-white/10 rounded-lg px-2 text-[10px] text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Team chat..."
            />
            <button onClick={handleSendMessage} className="p-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Game Over Overlay */}
      <AnimatePresence>
        {gameOver && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#1e293b] p-8 rounded-[2.5rem] border border-white/10 shadow-2xl text-center max-w-sm w-full"
            >
              <Trophy className={`mx-auto mb-4 ${playerTeamScore >= opponentTeamScore ? 'text-yellow-400' : 'text-gray-400'}`} size={64} />
              <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 font-display">
                {playerTeamScore >= opponentTeamScore ? 'Victory!' : 'Defeat'}
              </h2>
              <p className="text-gray-400 mb-6 font-bold uppercase tracking-widest text-xs">
                {playerTeamScore >= opponentTeamScore ? 'Your team dominated the battle!' : 'Better luck next time!'}
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                  <div className="flex items-center justify-center gap-2 text-yellow-400 mb-1">
                    <Coins size={16} />
                    <span className="font-black text-lg">+500</span>
                  </div>
                  <div className="text-[8px] font-bold text-gray-500 uppercase">Coins</div>
                </div>
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                  <div className="flex items-center justify-center gap-2 text-blue-400 mb-1">
                    <Trophy size={16} />
                    <span className="font-black text-lg">+100</span>
                  </div>
                  <div className="text-[8px] font-bold text-gray-500 uppercase">EXP</div>
                </div>
              </div>

              <button 
                onClick={onExit}
                className="w-full bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-500/30 uppercase tracking-widest italic"
              >
                Return to Lobby
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TeamBattleGame;
