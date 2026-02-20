import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/Button';
import { UserProfile, UserChest } from '../types';
import { CHEST_DATA } from '../constants';
import { Swords, Brain, Users, Trophy, Settings, Zap, Smartphone, ShoppingBag, Gift, Clock, PlayCircle, Loader2, Calendar, Coins, Gem } from 'lucide-react';
import { openChest } from '../services/rewardService';
import { audioManager } from '../services/audioService';

interface HomeProps {
  user: UserProfile;
  onNavigate: (screen: any) => void;
  onUpdateUser: (u: UserProfile) => void;
}

const Home: React.FC<HomeProps> = ({ user, onNavigate, onUpdateUser }) => {
  const [rewardModal, setRewardModal] = useState<any>(null);
  const [showDailyRewards, setShowDailyRewards] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);

  // Timer Tick Update
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Check Daily Login Logic
  useEffect(() => {
    const checkDaily = () => {
        const now = Date.now();
        const lastClaim = user.lastDailyClaim || 0;
        const oneDay = 24 * 60 * 60 * 1000;
        if (now - lastClaim > oneDay) {
            setShowDailyRewards(true);
        }
    };
    checkDaily();
  }, [user.lastDailyClaim]);


  const handleUnlockChest = (chestId: string) => {
     const updatedChests = user.chests.map(c => {
         if (c.id === chestId) {
             return { ...c, unlockStartedAt: Date.now() };
         }
         return c;
     });
     onUpdateUser({ ...user, chests: updatedChests });
     audioManager.playSFX('click');
  };

  const handleWatchAd = (chestId: string) => {
     if (!confirm("Watch a short video to reduce unlock time by 1.5 hours?")) return;
     setTimeout(() => {
         const updatedChests = user.chests.map(c => {
             if (c.id === chestId) {
                 return { ...c, timeReducedByAds: (c.timeReducedByAds || 0) + (1.5 * 60 * 60 * 1000) };
             }
             return c;
         });
         onUpdateUser({ ...user, chests: updatedChests });
         audioManager.playSFX('win');
     }, 2000);
  };

  const handleOpenChest = (chest: UserChest) => {
      const result = openChest(chest.tier);
      audioManager.playSFX('win');
      
      const newInventory = [...user.inventory];
      if (result.item && !newInventory.includes(result.item.id)) {
          newInventory.push(result.item.id);
      } else if (result.item) {
          result.gems += 5; 
      }

      const updatedChests = user.chests.filter(c => c.id !== chest.id);

      onUpdateUser({
          ...user,
          coins: user.coins + result.coins,
          gems: user.gems + result.gems,
          chests: updatedChests,
          inventory: newInventory
      });

      setRewardModal(result);
  };

  const handleSpinWheel = () => {
      if (spinning) return;
      setSpinning(true);
      audioManager.playSFX('click');
      
      // Spin duration 3s
      setTimeout(() => {
          const outcomes = [
              { label: '500 Coins', coins: 500, gems: 0, color: '#3b82f6' },
              { label: '1000 Coins', coins: 1000, gems: 0, color: '#8b5cf6' },
              { label: '10 Gems', coins: 0, gems: 10, color: '#ec4899' },
              { label: '50 Gems', coins: 0, gems: 50, color: '#14b8a6' },
              { label: 'JACKPOT', coins: 5000, gems: 100, color: '#eab308' },
              { label: '200 Coins', coins: 200, gems: 0, color: '#64748b' },
          ];
          const rand = Math.random();
          let winIndex = 0;
          if (rand < 0.05) winIndex = 4;
          else if (rand < 0.15) winIndex = 3;
          else if (rand < 0.3) winIndex = 2;
          else if (rand < 0.6) winIndex = 1;
          else winIndex = 0; // 200 Coins (most common) or 500
          
          // Force win index logic correction
          if (rand >= 0.6) winIndex = 5; // 200 Coins
          else if (rand >= 0.3 && rand < 0.6) winIndex = 0; // 500 Coins

          const win = outcomes[winIndex];
          setSpinResult(win.label);
          setSpinning(false);
          audioManager.playSFX('win');
          
          const oneDay = 24 * 60 * 60 * 1000;
          const timeDiff = Date.now() - (user.lastDailyClaim || 0);
          let newStreak = user.streak + 1;
          if (timeDiff > oneDay * 2) newStreak = 1;
          
          onUpdateUser({
              ...user,
              coins: user.coins + win.coins,
              gems: user.gems + win.gems,
              streak: newStreak,
              lastDailyClaim: Date.now()
          });
          
      }, 3000);
  };

  const renderChest = (chest: UserChest) => {
      const config = CHEST_DATA[chest.tier];
      let remaining = 0;
      let status: 'LOCKED' | 'UNLOCKING' | 'READY' = 'LOCKED';

      if (chest.isUnlocked) {
          status = 'READY';
      } else if (chest.unlockStartedAt) {
          const elapsed = now - chest.unlockStartedAt;
          const totalReduction = chest.timeReducedByAds || 0;
          const needed = config.unlockTimeMs - totalReduction;
          if (elapsed >= needed) status = 'READY';
          else {
              remaining = needed - elapsed;
              status = 'UNLOCKING';
          }
      }

      const h = Math.floor(remaining / 3600000);
      const m = Math.floor((remaining % 3600000) / 60000);
      const timeStr = `${h}h ${m}m`;

      return (
          <div key={chest.id} className={`relative bg-white border-b-4 border-gray-300 rounded-2xl p-2 flex flex-col items-center justify-between min-h-[120px] shadow-sm transform transition-transform hover:scale-105`}>
              <div className={`text-[10px] uppercase font-black tracking-widest ${status === 'READY' ? 'text-yellow-500' : 'text-gray-400'}`}>
                  {status === 'READY' ? 'OPEN!' : status === 'UNLOCKING' ? 'UNLOCKING' : chest.tier}
              </div>
              
              <div className={`bg-gradient-to-br ${config.color} w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg relative border-2 border-white transform rotate-3`}>
                  <Gift size={28} className="text-white drop-shadow-md"/>
                  {status === 'LOCKED' && <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center"><Clock size={16} className="text-white"/></div>}
              </div>

              {status === 'LOCKED' && (
                  <button onClick={() => handleUnlockChest(chest.id)} className="w-full bg-blue-100 text-[10px] py-1 rounded-lg text-blue-600 font-bold hover:bg-blue-200">
                      START
                  </button>
              )}

              {status === 'UNLOCKING' && (
                  <div className="w-full text-center">
                      <div className="text-[10px] font-mono text-gray-500 mb-1">{timeStr}</div>
                      <button onClick={() => handleWatchAd(chest.id)} className="w-full bg-purple-100 text-[10px] py-1 rounded-lg text-purple-600 flex items-center justify-center gap-1 hover:bg-purple-200 font-bold">
                          <PlayCircle size={10}/> SPEED
                      </button>
                  </div>
              )}

              {status === 'READY' && (
                  <button onClick={() => handleOpenChest(chest)} className="w-full bg-yellow-400 text-[10px] py-1 rounded-lg text-yellow-900 font-bold hover:bg-yellow-300 animate-bounce">
                      OPEN
                  </button>
              )}
          </div>
      );
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start p-6 space-y-6 animate-fade-in overflow-y-auto pb-24 scrollbar-hide">
      
      {/* Hero Section */}
      <div className="text-center space-y-1 mt-4 relative z-10">
        <h1 className="text-5xl md:text-6xl font-black text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.2)] tracking-tight">
          BRAIN<br/><span className="text-yellow-300">ARENA</span>
        </h1>
        <div className="inline-block bg-white/20 backdrop-blur-md px-4 py-1 rounded-full border border-white/30 text-xs font-bold uppercase tracking-widest text-white">
            Global IQ Battle
        </div>
      </div>

      {/* IQ Meter Preview */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md p-4 rounded-3xl border-b-8 border-blue-200 shadow-xl relative overflow-hidden group">
        <div className="flex justify-between items-end mb-2">
          <div className="flex flex-col">
             <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">My Brain Power</span>
             <span className="text-blue-600 font-black flex items-center gap-2 text-xl">
               <Brain size={24} className="text-pink-500 fill-pink-500"/> Level {user.level}
             </span>
          </div>
          <span className="text-slate-800 font-black text-2xl">Top 15%</span>
        </div>
        
        {/* Progress Bar Segmented */}
        <div className="flex gap-1 h-3 w-full bg-slate-100 p-1 rounded-full">
           <div className="h-full flex-1 bg-yellow-400 rounded-full"></div>
           <div className="h-full flex-1 bg-yellow-400 rounded-full"></div>
           <div className="h-full flex-1 bg-yellow-400 rounded-full"></div>
           <div className="h-full flex-1 bg-slate-200 rounded-full"></div>
        </div>
      </div>

      {/* Main Actions - Primary Cards */}
      <div className="w-full max-w-md grid grid-cols-1 gap-4">
        <button 
          className="relative group w-full h-28 rounded-3xl bg-blue-600 border-b-8 border-blue-800 active:border-b-0 active:translate-y-2 transition-all shadow-xl overflow-hidden"
          onClick={() => onNavigate('MODE_SELECT_SOLO')}
        >
          <div className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=800&auto=format&fit=crop" alt="solo" className="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-600/80 to-transparent"></div>
          </div>
          <div className="relative z-10 flex items-center justify-between px-6 h-full">
             <div className="flex items-center space-x-4">
                <div className="bg-white p-3 rounded-2xl text-blue-500 shadow-sm transform group-hover:rotate-6 transition-transform">
                  <Zap size={32} fill="currentColor" />
                </div>
                <div className="text-left">
                  <h3 className="text-3xl font-black text-white italic drop-shadow-md">SOLO QUIZ</h3>
                  <p className="text-xs text-blue-100 font-bold uppercase tracking-wider bg-blue-900/30 inline-block px-2 rounded">Train Brain</p>
                </div>
             </div>
          </div>
        </button>

        <button 
          className="relative group w-full h-28 rounded-3xl bg-red-600 border-b-8 border-red-800 active:border-b-0 active:translate-y-2 transition-all shadow-xl overflow-hidden"
          onClick={() => onNavigate('MODE_SELECT_BATTLE')}
        >
          <div className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop" alt="battle" className="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-600/80 to-transparent"></div>
          </div>
          <div className="relative z-10 flex items-center justify-between px-6 h-full">
             <div className="flex items-center space-x-4">
                <div className="bg-white p-3 rounded-2xl text-red-500 shadow-sm transform group-hover:-rotate-6 transition-transform">
                  <Swords size={32} />
                </div>
                <div className="text-left">
                  <h3 className="text-3xl font-black text-white italic drop-shadow-md">BATTLE</h3>
                  <p className="text-xs text-red-100 font-bold uppercase tracking-wider bg-red-900/30 inline-block px-2 rounded">PvP Arena</p>
                </div>
             </div>
          </div>
        </button>



        <div className="grid grid-cols-2 gap-4">
             <button 
              className="relative group w-full h-24 rounded-3xl bg-purple-500 border-b-8 border-purple-700 active:border-b-0 active:translate-y-2 transition-all shadow-lg overflow-hidden flex flex-col items-center justify-center text-white"
              onClick={() => onNavigate('PASS_N_PLAY')}
            >
              <div className="absolute inset-0 z-0">
                <img src="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop" alt="passnplay" className="w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-purple-600/60"></div>
              </div>
              <div className="relative z-10 flex flex-col items-center">
                <Smartphone size={28} className="mb-1 opacity-80"/>
                <span className="text-lg font-black leading-none text-center">PASS 'N<br/>PLAY</span>
              </div>
            </button>
            
            <button 
              className="relative group w-full h-24 rounded-3xl bg-yellow-400 border-b-8 border-yellow-600 active:border-b-0 active:translate-y-2 transition-all shadow-lg overflow-hidden flex flex-col items-center justify-center text-yellow-900"
              onClick={() => onNavigate('STORE')}
            >
              <div className="absolute inset-0 z-0">
                <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800&auto=format&fit=crop" alt="shop" className="w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-yellow-400/60"></div>
              </div>
              <div className="relative z-10 flex flex-col items-center">
                <ShoppingBag size={28} className="mb-1 opacity-80"/>
                <span className="text-lg font-black leading-none text-center">SHOP</span>
              </div>
            </button>
        </div>
      </div>

      {/* CHEST SLOTS UI */}
      <div className="w-full max-w-md bg-white/20 backdrop-blur-sm p-4 rounded-3xl border-2 border-white/20">
          <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-sm text-white font-black uppercase tracking-widest drop-shadow-md flex items-center gap-2"><Gift size={16}/> Chest Slots</h3>
              <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">{user.chests.length}/4</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => {
                  const chest = user.chests[i];
                  if (chest) return renderChest(chest);
                  return (
                      <div key={`empty-${i}`} className="border-2 border-dashed border-white/30 bg-black/10 rounded-2xl min-h-[120px] flex items-center justify-center">
                          <span className="text-[10px] text-white/50 font-bold uppercase">Empty</span>
                      </div>
                  );
              })}
          </div>
      </div>

      {/* Secondary Grid */}
      <div className="w-full max-w-md grid grid-cols-4 gap-3">
        <Button variant="secondary" className="flex flex-col items-center justify-center h-20 space-y-1 p-0 rounded-2xl bg-white border-slate-200 text-slate-500 hover:bg-slate-50" onClick={() => onNavigate('TOURNAMENTS')}>
          <Trophy size={20} className="text-yellow-500 fill-yellow-500"/>
          <span className="text-[10px] font-bold">Events</span>
        </Button>
        <Button variant="secondary" className="flex flex-col items-center justify-center h-20 space-y-1 p-0 rounded-2xl bg-white border-slate-200 text-slate-500 hover:bg-slate-50" onClick={() => onNavigate('FRIENDS')}>
          <Users size={20} className="text-green-500 fill-green-500"/>
          <span className="text-[10px] font-bold">Team</span>
        </Button>
        <Button variant="secondary" className="flex flex-col items-center justify-center h-20 space-y-1 p-0 rounded-2xl bg-white border-slate-200 text-slate-500 hover:bg-slate-50" onClick={() => onNavigate('LEADERBOARD')}>
          <div className="relative">
             <Trophy size={20} className="text-purple-500 fill-purple-500"/>
          </div>
          <span className="text-[10px] font-bold">Ranks</span>
        </Button>
        <Button variant="secondary" className="flex flex-col items-center justify-center h-20 space-y-1 p-0 rounded-2xl bg-white border-slate-200 text-slate-500 hover:bg-slate-50" onClick={() => onNavigate('SETTINGS')}>
          <Settings size={20} className="text-slate-400"/>
          <span className="text-[10px] font-bold">Config</span>
        </Button>
      </div>

      {/* DAILY REWARD MODAL */}
      <AnimatePresence>
      {showDailyRewards && (
           <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4"
           >
               <motion.div 
                 initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }}
                 className="bg-white border-b-8 border-purple-300 rounded-3xl p-8 max-w-sm w-full text-center relative overflow-hidden shadow-2xl"
               >
                   
                   {!spinResult ? (
                       <>
                           <h2 className="text-4xl font-black text-purple-600 mb-2 relative z-10">DAILY SPIN!</h2>
                           <p className="text-gray-500 text-sm mb-6 relative z-10 font-bold">
                               Streak: <span className="text-orange-500">{user.streak} Days 🔥</span>
                           </p>
                           
                           <div className="relative w-64 h-64 mx-auto mb-8">
                               {/* Wheel */}
                               <motion.div 
                                 animate={{ rotate: spinning ? 360 * 5 + Math.random() * 360 : 0 }}
                                 transition={{ duration: 3, ease: "easeInOut" }}
                                 className="w-full h-full rounded-full border-8 border-purple-500 relative overflow-hidden shadow-inner"
                                 style={{
                                   background: `conic-gradient(
                                     #3b82f6 0deg 60deg, 
                                     #8b5cf6 60deg 120deg, 
                                     #ec4899 120deg 180deg, 
                                     #14b8a6 180deg 240deg, 
                                     #eab308 240deg 300deg, 
                                     #64748b 300deg 360deg
                                   )`
                                 }}
                               >
                                  {/* Segments Text */}
                                  {[
                                    { label: '500', angle: 30 },
                                    { label: '1000', angle: 90 },
                                    { label: '10G', angle: 150 },
                                    { label: '50G', angle: 210 },
                                    { label: 'JACKPOT', angle: 270 },
                                    { label: '200', angle: 330 },
                                  ].map((seg, i) => (
                                    <div 
                                      key={i}
                                      className="absolute inset-0 flex items-start justify-center pt-4"
                                      style={{ transform: `rotate(${seg.angle}deg)` }}
                                    >
                                      <span className="text-[10px] font-black text-white drop-shadow-md transform rotate-180" style={{ writingMode: 'vertical-rl' }}>
                                        {seg.label}
                                      </span>
                                    </div>
                                  ))}
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-4 h-4 bg-white rounded-full z-10 shadow-md"></div>
                                  </div>
                               </motion.div>
                               
                               {/* Pointer */}
                               <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-12 bg-red-500 z-20 shadow-md flex items-end justify-center pb-1" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }}>
                                 <div className="w-2 h-2 bg-white rounded-full mb-4"></div>
                               </div>
                           </div>
                           
                           <Button variant="primary" size="lg" disabled={spinning} onClick={handleSpinWheel} className="w-full relative z-10 text-xl">
                               {spinning ? 'SPINNING...' : 'SPIN NOW!'}
                           </Button>
                       </>
                   ) : (
                       <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                           <h2 className="text-4xl font-black text-yellow-500 mb-6 relative z-10 drop-shadow-sm">WINNER!</h2>
                           <div className="text-3xl font-black text-slate-800 mb-2">{spinResult}</div>
                           <p className="text-gray-400 mb-8 font-bold">Come back tomorrow!</p>
                           <Button variant="gold" size="lg" onClick={() => { setShowDailyRewards(false); setSpinResult(null); }} className="w-full relative z-10 text-xl">
                               CLAIM REWARD
                           </Button>
                       </motion.div>
                   )}
               </motion.div>
           </motion.div>
      )}
      </AnimatePresence>

      {/* CHEST REWARD MODAL */}
      {rewardModal && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in px-4" onClick={() => setRewardModal(null)}>
               <div className="bg-white border-b-8 border-yellow-400 rounded-3xl p-8 max-w-sm w-full text-center relative overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                   <div className="absolute top-0 left-0 w-full h-32 bg-yellow-100 rounded-t-3xl"></div>
                   <h2 className="text-4xl font-black text-yellow-500 mb-6 relative z-10 drop-shadow-sm">OPENED!</h2>
                   
                   <div className="flex justify-center gap-6 mb-8 relative z-10">
                       <div className="flex flex-col items-center bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                           <Coins size={40} className="text-yellow-400 mb-2 fill-yellow-400"/>
                           <span className="text-xl font-black text-slate-700">+{rewardModal.coins}</span>
                       </div>
                       {rewardModal.gems > 0 && (
                        <div className="flex flex-col items-center bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                            <Gem size={40} className="text-pink-400 mb-2 fill-pink-400"/>
                            <span className="text-xl font-black text-slate-700">+{rewardModal.gems}</span>
                        </div>
                       )}
                   </div>

                   {rewardModal.item && (
                       <div className="bg-slate-50 p-4 rounded-2xl mb-6 border-2 border-slate-100 relative z-10 flex flex-col items-center">
                           <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">New Item Unlocked!</div>
                           {rewardModal.item.content.startsWith('http') ? (
                               <img src={rewardModal.item.content} alt={rewardModal.item.name} className="w-24 h-24 rounded-full border-4 border-white shadow-lg mb-2 object-cover" />
                           ) : (
                               <div className="text-6xl mb-2 filter drop-shadow-lg transform hover:scale-110 transition-transform cursor-pointer">{rewardModal.item.content}</div>
                           )}
                           <div className={`text-xl font-black ${
                               rewardModal.item.rarity === 'Legendary' ? 'text-yellow-500' : 'text-slate-800'
                           }`}>
                               {rewardModal.item.name}
                           </div>
                           <div className="text-xs font-bold text-slate-400 uppercase mt-1 px-2 py-1 bg-slate-200 rounded-full inline-block">{rewardModal.item.rarity}</div>
                       </div>
                   )}

                   <Button variant="gold" onClick={() => setRewardModal(null)} className="w-full relative z-10 text-xl">Awesome!</Button>
               </div>
           </div>
       )}
    </div>
  );
};

export default Home;