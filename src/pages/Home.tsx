import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from '@google/genai';
import { User, Swords, Users, Tv, Store, Settings, Trophy, Gift, Target, Home as HomeIcon, HelpCircle, X, Check, Coins, Gem, Star, Zap, Lock, Clock, ArrowRight, Crown, Activity } from 'lucide-react';


import PlayerHeader from '../components/PlayerHeader';
import { ScreenState, UserProfile, Question } from '../types';
import PromoButton from '../components/PromoButton';
import GameModeCard from '../components/GameModeCard';
import NavIcon from '../components/NavIcon';
import { soundManager } from '../utils/audio';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

const Home: React.FC<{ user: UserProfile; onNavigate: (screen: ScreenState) => void; setUser: React.Dispatch<React.SetStateAction<UserProfile>>; currentScreen: ScreenState }> = ({ user, onNavigate, setUser, currentScreen }) => {
  const [showFreeRewards, setShowFreeRewards] = useState(false);
  const [showLuckyQuestion, setShowLuckyQuestion] = useState(false);
  const [luckyQuestion, setLuckyQuestion] = useState<Question | null>(null);
  const [animatingCoins, setAnimatingCoins] = useState(false);
  const [animatingGems, setAnimatingGems] = useState(false);
  const [luckyShotResult, setLuckyShotResult] = useState<'win' | 'lose' | null>(null);

  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const canClaimFreeReward = !user.lastFreeRewardTime || (now - user.lastFreeRewardTime > 24 * 60 * 60 * 1000);
  const canPlayLuckyQuestion = !user.lastLuckyQuestionTime || (now - user.lastLuckyQuestionTime > 24 * 60 * 60 * 1000);



  const getRemainingTime = (lastTime?: number) => {
    if (!lastTime) return '';
    const remaining = 24 * 60 * 60 * 1000 - (now - lastTime);
    if (remaining <= 0) return '';
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const fetchLuckyQuestion = async () => {
    try {
      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: 'Generate one unique, medium-difficulty trivia question. Format the output as a JSON object with keys: "id", "question", "options", and "answer".',
      });
      const responseText = result.text;
      let parsedQuestion;
      try {
        parsedQuestion = JSON.parse(responseText.replace(/```json|```/g, ''));
      } catch (e) {
        console.error('Failed to parse lucky question JSON:', e);
        return;
      }
      setLuckyQuestion(parsedQuestion);
    } catch (error) {
      console.error('Error fetching lucky question:', error);
    }
  };

  useEffect(() => {
    soundManager.playBgm('bgm_menu');
    return () => soundManager.stopBgm();
  }, []);

  return (
    <div className="min-h-screen bg-home text-white flex flex-col overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
        <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[120px]" />
        <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[120px]" />
      </div>

      {/* Top Bar */}
      <PlayerHeader user={user} setUser={setUser} />

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col items-center w-full px-4 pt-4 pb-24 overflow-y-auto no-scrollbar relative z-10">
        
        {/* Daily Streak */}
        <div className="w-full max-w-md mb-6">
          <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 rounded-2xl p-4 flex items-center justify-between backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500/20 p-2 rounded-xl">
                <Zap size={24} className="text-orange-400" />
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-orange-400">Daily Streak</div>
                <div className="text-2xl font-black text-white">{user.dailyStreak} <span className="text-sm text-gray-400">Days</span></div>
              </div>
            </div>
            <div className="flex gap-1">
              {[...Array(7)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2 h-8 rounded-full ${i < (user.dailyStreak % 7 || 7) ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'bg-white/10'}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="w-full max-w-md flex flex-col gap-4 mb-8">
          <h2 className="text-xl font-black italic tracking-tighter uppercase mb-2 text-center text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 font-display">Daily Operations</h2>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (canClaimFreeReward) {
                  soundManager.playSfx('click'); 
                  setShowFreeRewards(true); 
                } else {
                  soundManager.playSfx('wrong');
                }
              }}
              disabled={!canClaimFreeReward}
              className="relative glass-panel rounded-2xl p-4 flex-1 flex flex-col items-center justify-center font-bold overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed group transition-all hover:neon-glow-blue gpu"
            >
              <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Gift size={32} className="mb-2 text-blue-400" />
              <span className="text-sm uppercase tracking-wider">Daily Drop</span>
              {!canClaimFreeReward && <span className="text-[10px] text-gray-500 mt-1 font-mono">{getRemainingTime(user.lastFreeRewardTime)}</span>}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (canPlayLuckyQuestion) {
                  setLuckyShotResult(null);
                  soundManager.playSfx('click');
                  fetchLuckyQuestion();
                  setShowLuckyQuestion(true);
                } else {
                  soundManager.playSfx('wrong');
                }
              }}
              disabled={!canPlayLuckyQuestion}
              className="relative glass-panel rounded-2xl p-4 flex-1 flex flex-col items-center justify-center font-bold overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed group transition-all hover:neon-glow-purple gpu"
            >
              <div className="absolute inset-0 bg-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <HelpCircle size={32} className="mb-2 text-purple-400" />
              <span className="text-sm uppercase tracking-wider">Lucky Shot</span>
              {!canPlayLuckyQuestion && <span className="text-[10px] text-gray-500 mt-1 font-mono">{getRemainingTime(user.lastLuckyQuestionTime)}</span>}
            </motion.button>
          </div>
        </div>

        {/* Daily Nugget */}
        <div className="w-full max-w-md mb-8">
          <div className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 backdrop-blur-md rounded-2xl p-6 border border-emerald-500/20 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap size={64} className="text-emerald-400" />
            </div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-emerald-500/20 p-1.5 rounded-lg">
                <Zap size={16} className="text-emerald-400" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400">Daily Trivia Nugget</h3>
            </div>
            <p className="text-lg font-medium text-emerald-100 italic leading-relaxed mb-4">
              "{user.dailyNugget?.fact || "Loading knowledge..."}"
            </p>
            <div className="flex items-center justify-between border-t border-emerald-500/10 pt-3">
              <span className="text-[10px] font-mono text-emerald-500/60 uppercase">{user.dailyNugget?.date}</span>
              <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Brain Arena Daily Nugget',
                      text: user.dailyNugget?.fact,
                    }).catch(console.error);
                  } else {
                     alert("Copied to clipboard!");
                     navigator.clipboard.writeText(user.dailyNugget?.fact || "");
                  }
                }}
                className="text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
              >
                Share <ArrowRight size={10} />
              </button>
            </div>
          </div>
        </div>

        {/* Game Logo */}
        <div className="mb-12 text-center relative group">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-blue-500 blur-[100px] rounded-full"
          ></motion.div>
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <h1 className="text-7xl font-black italic tracking-tighter leading-none font-display text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 relative gpu">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-500 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">BRAIN</span>
              <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-blue-600 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">ARENA</span>
            </h1>
            <div className="mt-3 flex items-center justify-center gap-2">
              <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-blue-500/50" />
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400/80">Pro Championship</div>
              <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-blue-500/50" />
            </div>
          </motion.div>
        </div>

        {/* Game Modes Stack */}
        <div className="w-full max-w-md flex flex-col gap-4 mb-10">
          <GameModeCard 
            title="The Anomaly" 
            subtitle="Multimodal Challenges" 
            icon={<Activity size={32} className="text-white" />} 
            gradient="from-emerald-500 to-teal-600" 
            borderColor="border-emerald-400/30" 
            onClick={() => onNavigate('SENSORY_LOBBY')} 
            delay={0.05} 
          />

          <GameModeCard 
            title="Daily Arena" 
            subtitle={user.dailyArenaCompleted ? "Completed for today" : "High Stakes. Global Rank."}
            icon={<Crown size={32} className="text-white" />} 
            gradient="from-amber-500 to-orange-600" 
            borderColor="border-amber-400/50" 
            onClick={() => {
              if (!user.dailyArenaCompleted) {
                 onNavigate('DAILY_ARENA_LOBBY');
              } else {
                 soundManager.playSfx('wrong');
              }
            }}
            delay={0.05}
            disabled={user.dailyArenaCompleted}
          />

          <GameModeCard 
            title="Solo Climb" 
            subtitle="Test your limits" 
            icon={<Target size={32} className="text-white" />} 
            gradient="from-blue-600 to-blue-800" 
            borderColor="border-blue-400/30" 
            onClick={() => onNavigate('SOLO_LOBBY')} 
            delay={0.1} 
          />

          <GameModeCard 
            title="Global Clash" 
            subtitle="Ranked PvP Duel" 
            icon={<Swords size={32} className="text-white" />} 
            gradient="from-rose-600 to-rose-800" 
            borderColor="border-rose-400/30" 
            onClick={() => onNavigate('PVP_LOBBY')} 
            delay={0.2} 
          />

          <GameModeCard 
            title="Team Battle" 
            subtitle="Tactical 5v5" 
            icon={<Users size={32} className="text-white" />} 
            gradient="from-indigo-600 to-indigo-800" 
            borderColor="border-indigo-400/30" 
            onClick={() => onNavigate('TEAM_LOBBY')} 
            delay={0.3} 
          />



          <GameModeCard 
            title="Pass N Play" 
            subtitle="Offline fun with friends" 
            icon={<Users size={32} className="text-white" />} 
            gradient="from-green-600 to-green-800" 
            borderColor="border-green-400/30" 
            onClick={() => onNavigate('PASS_N_PLAY_LOBBY')} 
            delay={0.5} 
          />
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 w-full bg-[#1e293b]/90 backdrop-blur-xl border-t border-white/5 pb-8 pt-4 px-8 flex justify-between items-center z-50">
        <NavIcon icon={<HomeIcon size={24} />} label="Home" active onClick={() => onNavigate('HOME')} />
        <NavIcon icon={<Users size={24} />} label="Friends" onClick={() => onNavigate('FRIENDS')} />
        <NavIcon icon={<Store size={24} />} label="Vault" onClick={() => onNavigate('SHOP')} />
        <NavIcon icon={<Settings size={24} />} label="Menu" onClick={() => onNavigate('SETTINGS')} />
      </nav>

      {/* Modals (Free Rewards, Lucky Question) */}
      <AnimatePresence>
        {showFreeRewards && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 backdrop-blur-md"
            onClick={() => setShowFreeRewards(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#1e293b] w-full max-w-sm rounded-[2.5rem] p-8 border border-white/10 shadow-2xl relative text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-4xl font-black italic tracking-tighter uppercase text-rose-500 mb-2">Daily Drop</h2>
              <p className="text-gray-400 mb-8 font-bold uppercase tracking-widest text-xs">Your supply has arrived</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                  <Coins size={24} className="text-yellow-400 mx-auto mb-2" />
                  <div className="font-black text-xl">250</div>
                </div>
                <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                  <Gem size={24} className="text-pink-400 mx-auto mb-2" />
                  <div className="font-black text-xl">5</div>
                </div>
              </div>

              <button 
                onClick={() => {
                  setAnimatingCoins(true);
                  setAnimatingGems(true);
                  soundManager.playSfx('win');
                  setTimeout(() => {
                    setUser(prev => ({ 
                      ...prev, 
                      coins: prev.coins + 250, 
                      gems: prev.gems + 5,
                      lastFreeRewardTime: Date.now()
                    }));
                    setShowFreeRewards(false);
                    setAnimatingCoins(false);
                    setAnimatingGems(false);
                  }, 1500);
                }}
                disabled={animatingCoins}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-rose-600/30 uppercase tracking-widest italic relative overflow-hidden"
              >
                {animatingCoins ? 'Claiming...' : 'Claim All'}
                {animatingCoins && (
                  <motion.div 
                    initial={{ x: 0, y: 0, opacity: 1 }}
                    animate={{ x: -100, y: -300, opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-yellow-400"
                  >
                    <Coins size={32} />
                  </motion.div>
                )}
                {animatingGems && (
                  <motion.div 
                    initial={{ x: 0, y: 0, opacity: 1 }}
                    animate={{ x: 100, y: -300, opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-pink-400"
                  >
                    <Gem size={32} />
                  </motion.div>
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLuckyQuestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 backdrop-blur-md"
            onClick={() => { setShowLuckyQuestion(false); setLuckyShotResult(null); }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#1e293b] w-full max-w-lg rounded-[2.5rem] p-8 border border-white/10 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-4xl font-black italic tracking-tighter uppercase text-amber-500 mb-2 text-center">Lucky Shot</h2>
              <p className="text-gray-400 mb-8 font-bold uppercase tracking-widest text-xs text-center">One question, big rewards</p>

              {luckyShotResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: -50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
                >
                  <div className={`bg-black/90 p-8 rounded-3xl border-4 ${luckyShotResult === 'win' ? 'border-green-500 shadow-[0_0_50px_rgba(34,197,94,0.5)]' : 'border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.5)]'} backdrop-blur-xl text-center`}>
                    <div className={`text-6xl font-black italic tracking-tighter uppercase mb-2 ${luckyShotResult === 'win' ? 'text-green-400' : 'text-red-400'}`}>
                      {luckyShotResult === 'win' ? 'Congratulations!' : 'Better luck next time!'}
                    </div>
                    {luckyShotResult === 'win' && <p className="text-white font-bold uppercase tracking-widest">+20 Premium Gems</p>}
                  </div>
                </motion.div>
              )}

              
              {luckyQuestion ? (
                <div>
                  <div className="bg-black/20 p-6 rounded-3xl mb-6 border border-white/5">
                    <p className="text-xl font-bold text-white text-center leading-tight">{luckyQuestion.question}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {luckyQuestion.options.map((option, index) => (
                      <button 
                        key={index}
                        onClick={() => {
                                                    if (option === luckyQuestion.answer) {
                            setLuckyShotResult('win');
                            setAnimatingGems(true);
                            soundManager.playSfx('win');
                            setTimeout(() => {
                              setUser(prev => ({ 
                                ...prev, 
                                gems: prev.gems + 20,
                                lastLuckyQuestionTime: Date.now()
                              }));
                              setShowLuckyQuestion(false);
                              setLuckyQuestion(null);
                              setAnimatingGems(false);
                            }, 1500);
                          } else {
                            setLuckyShotResult('lose');
                            soundManager.playSfx('lose');
                            setUser(prev => ({ ...prev, lastLuckyQuestionTime: Date.now() }));
                            setTimeout(() => {
                              setShowLuckyQuestion(false);
                              setLuckyQuestion(null);
                            }, 1000);
                          }
                        }}
                        disabled={animatingGems}
                        className="bg-white/5 hover:bg-white/10 text-white font-black py-4 rounded-2xl transition-all border border-white/5 uppercase tracking-widest text-sm relative overflow-hidden"
                      >
                        {option}
                        {animatingGems && option === luckyQuestion.answer && (
                          <motion.div 
                            initial={{ x: 0, y: 0, opacity: 1 }}
                            animate={{ x: 0, y: -300, opacity: 0 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-pink-400"
                          >
                            <Gem size={32} />
                          </motion.div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="font-black uppercase tracking-widest text-xs text-gray-500">Generating Challenge...</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Home;



