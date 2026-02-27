import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Trophy, XCircle, CheckCircle, MessageSquare, Coins, Gem } from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';
import { Arena, Question, UserProfile, Rank } from '../types';
import { soundManager } from '../utils/audio';
import TauntSystem from '../components/TauntSystem';
import { SHOP_ITEMS } from '../data/shopItems';
import { PVP_ARENAS } from '../data/arenas';
import { getRandomKidsQuestions } from '../data/kidsQuestions';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is not set.');
}
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const PvPGame: React.FC<{ arena: Arena; onExit: () => void; user: UserProfile; setUser: React.Dispatch<React.SetStateAction<UserProfile>> }> = ({ arena, onExit, user, setUser }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [activeTaunt, setActiveTaunt] = useState<{ content: string, type: 'Emoji' | 'Chat' | 'Taunt', sender: 'player' | 'opponent' } | null>(null);
  const [penaltyApplied, setPenaltyApplied] = useState(false);

  const selectedAvatarItem = SHOP_ITEMS.find(item => item.id === user.selectedAvatar);
  const selectedBorderItem = SHOP_ITEMS.find(item => item.id === user.selectedBorder);
  const avatarUrl = user.selectedAvatar.startsWith('av_') ? `https://api.dicebear.com/9.x/micah/svg?seed=${user.name}` : user.selectedAvatar;
  const borderClass = selectedBorderItem?.assetName || 'border-white';

  const arenaIndex = PVP_ARENAS.findIndex(a => a.id === arena.id);
  const targetScore = arenaIndex === 0 ? 50 : 
                      arenaIndex === 1 ? 70 :
                      arenaIndex === 2 ? 90 :
                      arenaIndex === 3 ? 110 :
                      arenaIndex === 4 ? 130 : 999999;

  const [shake, setShake] = useState(false);

  const awardChest = useCallback((won: boolean, penalty: boolean = false) => {
    if (won && !penalty) {
      setUser(prev => ({
        ...prev,
        coins: prev.coins + arena.prizePool,
        exp: prev.exp + (arenaIndex + 1) * 50,
        matchesWon: prev.matchesWon + 1,
        matchesPlayed: prev.matchesPlayed + 1,
      }));
      
      soundManager.playSfx('win');

      setUser(prevUser => {
        let newStars = prevUser.stars + 1;
        let newTier = prevUser.tier;
        let newRank = prevUser.rank;
        const ranks: Rank[] = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Grand Master'];

        if (newStars >= 5) {
          newStars = 0;
          newTier += 1;
        }

        if (newTier > 4) {
          newTier = 1;
          const currentRankIndex = ranks.indexOf(prevUser.rank);
          if (currentRankIndex < ranks.length - 1) {
            newRank = ranks[currentRankIndex + 1];
          }
        }

        return { ...prevUser, stars: newStars, tier: newTier, rank: newRank };
      });
    } else if (penalty) {
      // Penalty logic
      setUser(prev => ({
        ...prev,
        coins: prev.coins + Math.floor(arena.prizePool * 0.5),
        gems: Math.max(0, prev.gems - 20),
        bronzeChestPenaltyMatches: prev.bronzeChestPenaltyMatches + 3,
        stars: Math.max(0, prev.stars - 1),
        matchesPlayed: prev.matchesPlayed + 1,
      }));
      soundManager.playSfx('lose');
    } else {
      setUser(prev => ({
        ...prev,
        coins: Math.max(0, prev.coins - Math.floor(arena.entryFee / 2)),
        stars: Math.max(0, prev.stars - 1),
        matchesPlayed: prev.matchesPlayed + 1,
      }));
      soundManager.playSfx('lose');
    }
  }, [setUser, arena, arenaIndex]);

  const handleExit = useCallback((won: boolean, penalty: boolean = false) => {
    awardChest(won, penalty);
    onExit();
  }, [awardChest, onExit]);

  const [isSearching, setIsSearching] = useState(true);
  const [isBetting, setIsBetting] = useState(false);
  const [scrollingOpponents, setScrollingOpponents] = useState<string[]>([]);
  const [finalOpponent, setFinalOpponent] = useState<string>('');

  const BOT_NAMES = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Jamie', 'Quinn', 'Avery', 'Skyler', 'Sam', 'Charlie', 'Liam', 'Emma', 'Noah', 'Olivia', 'William', 'Ava', 'James', 'Isabella'];

  useEffect(() => {
    // Generate a list of random opponent names for the scrolling animation
    const names = Array.from({ length: 20 }, () => BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)]);
    setScrollingOpponents(names);
    const finalName = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
    setFinalOpponent(finalName);

    // Stop searching after 3 seconds, then show betting animation
    const timer = setTimeout(() => {
      setIsSearching(false);
      setIsBetting(true);
      soundManager.playSfx('collect');
      setTimeout(() => {
        setIsBetting(false);
      }, 2000);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const opponentName = finalOpponent;
  const opponentAccuracy = arena.difficulty === 'Easy' ? 0.4 : arena.difficulty === 'Medium' ? 0.6 : 0.8;

  const fetchQuestions = useCallback(async () => {
    setIsLoading(true);
    
    // Use easy kids questions for the first 4 arenas
    if (arenaIndex >= 0 && arenaIndex < 4) {
      const kidsQuestions = getRandomKidsQuestions(10);
      setQuestions(kidsQuestions);
      setIsLoading(false);
      return;
    }

    try {
      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate 10 unique trivia questions. Topics must be extremely diverse, drawn from millions of possibilities (e.g., quantum physics, 18th-century literature, obscure sports, pop culture, biology, astronomy, international relations, trains, ships, entertainment, famous personalities, science, technology, art, geography, and highly specific obscure facts). Do not stick to just history or geography.
        IMPORTANT: Do not include images. The questions should be text-only.
        NO REPETITION. Ensure the questions are fresh and not commonly known.
        DO NOT repeat any of these question IDs: ${user.seenQuestionIds.join(', ')}.
        Difficulty: ${arena.difficulty}.`,
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
  }, [arena, user.seenQuestionIds]);

  useEffect(() => {
    fetchQuestions();
    soundManager.playBgm('bgm_game_pvp');
    return () => soundManager.stopBgm();
  }, [fetchQuestions]);

  // Bot taunt logic
  useEffect(() => {
    if (isSearching || isGameOver || isBetting) return;
    
    const tauntInterval = setInterval(() => {
      if (Math.random() > 0.6) { // 40% chance to taunt every 8 seconds
        const botTaunts = ['Too slow!', 'Is that all?', 'Easy win!', 'Nice try!', 'I am unstoppable!', 'You can do better.', 'GG', 'Oops!'];
        const randomTaunt = botTaunts[Math.floor(Math.random() * botTaunts.length)];
        setActiveTaunt({ content: randomTaunt, type: 'Chat', sender: 'opponent' });
        setTimeout(() => setActiveTaunt(null), 2500);
      }
    }, 8000);

    return () => clearInterval(tauntInterval);
  }, [isSearching, isGameOver, isBetting]);

  const handleNextQuestion = () => {
    setFeedback(null);
    
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex >= questions.length) {
      fetchQuestions();
    }
    setCurrentQuestionIndex(nextIndex);
    
    // Opponent logic
    if (Math.random() < opponentAccuracy) {
      const newOpponentScore = opponentScore + 10;
      setOpponentScore(newOpponentScore);
      
      
    } else {
      // Bot gave wrong answer, just continue
    }

    // Random bot taunt
    if (Math.random() < 0.3) {
      const botChats = ["Nice try!", "Too slow!", "I'm the best!", "Ez win", "Brain diff"];
      const botEmojis = ["😎", "🔥", "😂", "🧠"];
      const botTaunts = ["If you are bad, then I am your dad! 😎", "Cry about it 😭", "I am the BOSS here 👑"];
      
      const rand = Math.random();
      let type: 'Emoji' | 'Chat' | 'Taunt' = 'Chat';
      let content = '';
      
      if (rand < 0.4) {
        type = 'Chat';
        content = botChats[Math.floor(Math.random() * botChats.length)];
      } else if (rand < 0.8) {
        type = 'Emoji';
        content = botEmojis[Math.floor(Math.random() * botEmojis.length)];
      } else {
        type = 'Taunt';
        content = botTaunts[Math.floor(Math.random() * botTaunts.length)];
      }

      soundManager.playSfx('taunt');
      setActiveTaunt({ content, type, sender: 'opponent' });
      setTimeout(() => setActiveTaunt(null), 2500);
    }
  };

  const handleAnswer = (option: string) => {
    if (feedback || isGameOver) return;

    const currentQuestion = questions[currentQuestionIndex];
    
    // Add to seen questions
    setUser(prev => ({
      ...prev,
      seenQuestionIds: [...prev.seenQuestionIds, currentQuestion.id]
    }));

    const isCorrect = option === currentQuestion.answer;
    if (isCorrect) {
      soundManager.playSfx('correct');
      const newPlayerScore = playerScore + 10;
      setPlayerScore(newPlayerScore);
      setFeedback('correct');
      
      setTimeout(handleNextQuestion, 1000);
    } else {
      soundManager.playSfx('wrong');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setFeedback('wrong');
      // Match ends immediately on wrong answer
      if (playerScore > opponentScore) {
        setPenaltyApplied(true);
      }
      setTimeout(() => setIsGameOver(true), 500);
    }
  };

  const handleSendTaunt = (content: string, type: 'Emoji' | 'Chat' | 'Taunt') => {
    soundManager.playSfx('taunt');
    setActiveTaunt({ content, type, sender: 'player' });
    setTimeout(() => setActiveTaunt(null), 2500);
  };

  if (isGameOver) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-pvp-game text-white p-6 relative overflow-hidden">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#1e293b]/80 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl text-center max-w-sm w-full relative z-10"
        >
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 font-display">
            {playerScore > opponentScore && !penaltyApplied ? 'Congratulations!' : 'Game Over'}
          </h1>
          <p className="text-gray-400 mb-8 font-bold uppercase tracking-widest text-[10px] md:text-xs">
            {playerScore > opponentScore && !penaltyApplied ? 'You won the match!' : penaltyApplied ? 'High Scorer Penalty Applied!' : 'You answered incorrectly.'}
          </p>
          
          {penaltyApplied && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-xs font-bold uppercase shadow-md">
              Wrong answer while leading! -20 Gems & Bronze Curse active.
            </div>
          )}
          
          <div className="flex justify-between mb-8 bg-black/20 p-4 rounded-2xl border border-white/5 shadow-inner">
            <div className="text-center">
              <div className="text-xs text-gray-500 font-bold uppercase">You</div>
              <div className="text-3xl font-black text-blue-400">{playerScore}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 font-bold uppercase">Bot</div>
              <div className="text-3xl font-black text-red-400">{opponentScore}</div>
            </div>
          </div>

          {/* Rewards Section */}
          <div className="flex justify-center gap-4 mb-8">
            {playerScore > opponentScore && !penaltyApplied ? (
              <>
                <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-xl border border-yellow-500/30 shadow-md">
                  <Coins className="text-yellow-400" size={20} />
                  <span className="font-black text-xl text-yellow-400">+{arena.prizePool}</span>
                </div>
                <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-xl border border-blue-500/30 shadow-md">
                  <span className="font-black text-xl text-blue-400">+50 EXP</span>
                </div>
              </>
            ) : penaltyApplied ? (
              <>
                <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-xl border border-yellow-500/30 shadow-md">
                  <Coins className="text-yellow-400" size={20} />
                  <span className="font-black text-xl text-yellow-400">+{Math.floor(arena.prizePool * 0.5)}</span>
                </div>
                <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-xl border border-pink-500/30 shadow-md">
                  <Gem className="text-pink-400" size={20} />
                  <span className="font-black text-xl text-red-500">-20</span>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-xl border border-red-500/30 shadow-md">
                <Coins className="text-red-400" size={20} />
                <span className="font-black text-xl text-red-500">-{Math.floor(arena.entryFee / 2)}</span>
              </div>
            )}
          </div>

          <motion.button 
            onClick={() => handleExit(playerScore > opponentScore, penaltyApplied)} 
            className="w-full bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-purple-500/30 uppercase tracking-widest italic"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {penaltyApplied ? 'Accept Penalty' : 'Claim Rewards'}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (isSearching || isBetting || (isLoading && questions.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-pvp-game text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-30">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              x: [0, 50, 0],
              y: [0, 30, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[150px]"
          ></motion.div>
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
              x: [0, -50, 0],
              y: [0, -30, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-purple-600 rounded-full blur-[150px]"
          ></motion.div>
        </div>
        <h2 className="text-2xl md:text-4xl font-black italic tracking-tighter uppercase mb-8 md:mb-12 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 font-display z-10 text-center">
          {isSearching ? 'Searching for Opponent...' : 'Match Found!'}
        </h2>
        
        <div className="flex items-center gap-4 md:gap-8 z-10 relative w-full justify-center px-4">
          {/* Player Avatar */}
          <div className="flex flex-col items-center relative w-1/3">
            <div className={`w-20 h-20 md:w-32 md:h-32 rounded-full border-4 ${borderClass} overflow-hidden bg-gray-800 shadow-[0_0_30px_rgba(59,130,246,0.5)] shrink-0`}>
              <img src={avatarUrl} className="w-full h-full object-contain scale-110" referrerPolicy="no-referrer" />
            </div>
            <div className="mt-2 md:mt-4 text-sm md:text-xl font-black uppercase tracking-widest text-center truncate w-full">{user.name}</div>
            {isBetting && (
              <>
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={`p-coin-${i}`}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{ x: 50, y: 0, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.5, delay: i * 0.1, ease: "easeIn" }}
                    className="absolute top-1/2 right-0 text-yellow-400 z-20"
                  >
                    <Coins size={16} className="md:w-6 md:h-6" />
                  </motion.div>
                ))}
              </>
            )}
          </div>

          <div className="flex flex-col items-center justify-center w-1/3">
            {isBetting ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1.2 }}
                transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
                className="text-yellow-400 flex flex-col items-center"
              >
                <Coins size={32} className="md:w-12 md:h-12" />
                <span className="font-black text-lg md:text-xl mt-1 md:mt-2">{arena.prizePool}</span>
              </motion.div>
            ) : (
              <div className="text-2xl md:text-4xl font-black italic text-gray-500">VS</div>
            )}
          </div>

          {/* Opponent Avatar Scroller */}
          <div className="flex flex-col items-center relative w-1/3">
            <div className="w-20 h-20 md:w-32 md:h-32 rounded-full border-4 border-red-500 overflow-hidden bg-gray-800 shadow-[0_0_30px_rgba(239,68,68,0.5)] relative shrink-0">
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: isSearching ? -80 * 19 : -80 * 19 }}
                transition={{ 
                  duration: 2.5, 
                  ease: [0.25, 1, 0.5, 1], // easeOutQuart-like curve for slowing down
                }}
                className="absolute top-0 left-0 w-full md:hidden"
              >
                {scrollingOpponents.map((name, i) => (
                  <div key={i} className="w-20 h-20 flex items-center justify-center bg-gray-800">
                    <img src={`https://api.dicebear.com/9.x/micah/svg?seed=${name}`} className="w-full h-full object-contain scale-110" />
                  </div>
                ))}
                {/* Final Opponent */}
                <div className="w-20 h-20 flex items-center justify-center bg-gray-800">
                  <img src={`https://api.dicebear.com/9.x/micah/svg?seed=${finalOpponent}`} className="w-full h-full object-contain scale-110" />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: isSearching ? -128 * 19 : -128 * 19 }}
                transition={{ 
                  duration: 2.5, 
                  ease: [0.25, 1, 0.5, 1], // easeOutQuart-like curve for slowing down
                }}
                className="absolute top-0 left-0 w-full hidden md:block"
              >
                {scrollingOpponents.map((name, i) => (
                  <div key={i} className="w-32 h-32 flex items-center justify-center bg-gray-800">
                    <img src={`https://api.dicebear.com/9.x/micah/svg?seed=${name}`} className="w-full h-full object-contain scale-110" />
                  </div>
                ))}
                {/* Final Opponent */}
                <div className="w-32 h-32 flex items-center justify-center bg-gray-800">
                  <img src={`https://api.dicebear.com/9.x/micah/svg?seed=${finalOpponent}`} className="w-full h-full object-contain scale-110" />
                </div>
              </motion.div>
            </div>
            <div className="mt-2 md:mt-4 text-sm md:text-xl font-black uppercase tracking-widest text-red-400 text-center truncate w-full">
              {isSearching ? '???' : finalOpponent}
            </div>
            {isBetting && (
              <>
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={`o-coin-${i}`}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{ x: -50, y: 0, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.5, delay: i * 0.1, ease: "easeIn" }}
                    className="absolute top-1/2 left-0 text-yellow-400 z-20"
                  >
                    <Coins size={16} className="md:w-6 md:h-6" />
                  </motion.div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <motion.div 
      animate={{ x: shake ? [-10, 10, -10, 10, 0] : 0 }}
      className="min-h-screen bg-pvp-game text-white flex flex-col items-center p-2 relative overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
        <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[120px]" />
        <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center glass-panel p-2 rounded-2xl backdrop-blur-xl border border-white/10 relative z-10 mb-2 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-10 h-10 rounded-full border-2 ${borderClass} overflow-hidden bg-gray-800 shadow-lg`}>
              <img src={avatarUrl} className="w-full h-full object-contain scale-[1.1]" referrerPolicy="no-referrer" />
            </div>
            <AnimatePresence>
              {activeTaunt?.sender === 'player' && ( 
                <motion.div 
                  initial={{ scale: 0, opacity: 0, y: -10, rotate: -10 }}
                  animate={{ scale: 1, opacity: 1, y: 10, rotate: 5 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className={`absolute top-full left-1/2 -translate-x-1/2 px-4 py-2 rounded-2xl text-sm font-black whitespace-nowrap shadow-[0_10px_20px_rgba(0,0,0,0.4)] border-2 z-50 ${
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
            <div className="text-[8px] text-blue-400 font-black uppercase tracking-[0.3em]">YOU</div>
            <div className="text-2xl font-black text-blue-400 leading-none text-glow">{playerScore}</div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-orange-500 uppercase tracking-[0.2em] italic font-display">{arena.name}</div>
          <div className="flex gap-1.5 mt-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`w-2.5 h-1 rounded-full transition-all duration-500 ${i < (currentQuestionIndex % 5) ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-white/10'}`}></div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 text-right">
          <div>
            <div className="text-[8px] text-red-400 font-black uppercase tracking-[0.3em]">{opponentName}</div>
            <div className="text-2xl font-black text-red-400 leading-none text-glow">{opponentScore}</div>
          </div>
          <div className="relative">
            <div className={`w-10 h-10 rounded-full border-2 border-red-500 overflow-hidden bg-gray-800 shadow-lg`}>
              <img src={`https://api.dicebear.com/9.x/micah/svg?seed=${opponentName}`} className="w-full h-full object-contain scale-[1.1]" referrerPolicy="no-referrer" />
            </div>
            <AnimatePresence>
              {activeTaunt?.sender === 'opponent' && (
                <motion.div 
                  initial={{ scale: 0, opacity: 0, y: -10, rotate: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 10, rotate: -5 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className={`absolute top-full left-1/2 -translate-x-1/2 px-4 py-2 rounded-2xl text-sm font-black whitespace-nowrap shadow-[0_10px_20px_rgba(0,0,0,0.4)] border-2 z-50 ${
                    activeTaunt.type === 'Taunt' 
                      ? 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 text-white border-white italic tracking-tighter' 
                      : activeTaunt.type === 'Chat'
                      ? 'bg-red-600 text-white border-red-400'
                      : 'bg-white text-black border-gray-200 text-2xl'
                  }`}
                >
                  {activeTaunt.content}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="flex-grow flex items-center justify-center w-full max-w-lg relative z-10 overflow-hidden px-4">
        <AnimatePresence mode='wait'>
          {currentQuestion && (
            <motion.div 
              key={currentQuestion.id}
              className="w-full glass-panel rounded-[2.5rem] shadow-2xl p-6 border border-white/10 flex flex-col max-h-full overflow-y-auto no-scrollbar relative z-10"
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -30 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-shine" />
              
              {currentQuestion.topic && (
                <div className="mb-4 self-center shrink-0">
                  <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.4em]">
                    {currentQuestion.topic}
                  </span>
                </div>
              )}

              <div className="flex-grow flex items-center justify-center mb-8 shrink-0">
                <h2 className={`font-black text-center leading-tight tracking-tighter text-white font-display ${currentQuestion.question.length > 100 ? 'text-xl' : 'text-2xl'}`}>
                  {currentQuestion.question}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0">
                {currentQuestion.options.map((option, index) => {
                  let btnStyle = "bg-white/5 border-white/10 hover:bg-white/10 text-white/70";
                  if (feedback === 'correct' && option === currentQuestion.answer) btnStyle = "bg-emerald-500 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]";
                  if (feedback === 'wrong' && option !== currentQuestion.answer && feedback) btnStyle = "bg-white/5 opacity-20";
                  if (feedback === 'wrong' && option === currentQuestion.answer) btnStyle = "bg-emerald-500 border-emerald-400 text-white";
                  
                  return (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswer(option)}
                      disabled={!!feedback}
                      className={`p-4 rounded-2xl text-sm font-black transition-all border-2 ${btnStyle} uppercase tracking-wider italic font-display`}
                      whileHover={!feedback ? { scale: 1.02, y: -2 } : {}}
                      whileTap={!feedback ? { scale: 0.98 } : {}}
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
      <div className="w-full max-w-2xl flex justify-between items-center mt-4 md:mt-6 relative z-10 shrink-0">
        <button 
          onClick={() => { soundManager.playSfx('click'); handleExit(false); }} 
          className="text-gray-500 hover:text-red-400 font-black uppercase tracking-widest text-xs transition-colors"
        >
          Forfeit Match
        </button>
        
        <TauntSystem onSend={handleSendTaunt} user={user} />
      </div>
    </motion.div>
  );
};

export default PvPGame;
