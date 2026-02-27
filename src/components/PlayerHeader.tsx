import React, { useState } from 'react';
import { UserProfile, Rank } from '../types';
import { Shield, Star, Coins, Gem, Settings, Mail, User as UserIcon, X, Edit2 } from 'lucide-react';
import RankIcon from './RankIcon';
import { SHOP_ITEMS } from '../data/shopItems';
import { motion, AnimatePresence } from 'framer-motion';

const PlayerHeader: React.FC<{ user: UserProfile }> = ({ user }) => {
  const [showProfile, setShowProfile] = useState(false);

  const selectedAvatarItem = SHOP_ITEMS.find(item => item.id === user.selectedAvatar);
  const selectedBorderItem = SHOP_ITEMS.find(item => item.id === user.selectedBorder);

  const avatarUrl = selectedAvatarItem?.assetName || 'https://api.dicebear.com/9.x/avataaars/svg?seed=Player';
  const borderClass = selectedBorderItem?.assetName || 'border-white';

  const getLevelInfo = (totalExp: number) => {
    let level = 1;
    let requiredExp = 1000;
    let currentExp = totalExp;
    while (currentExp >= requiredExp) {
      currentExp -= requiredExp;
      level++;
      requiredExp = level * 1000;
    }
    return { level, currentExp, requiredExp };
  };

  const { level, currentExp, requiredExp } = getLevelInfo(user.exp);
  const expPercentage = (currentExp / requiredExp) * 100;

  return (
    <>
      <div className="w-full flex items-center justify-between px-4 py-3 relative z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/10">
        {/* Left: Profile */}
        <button onClick={() => setShowProfile(true)} className="flex items-center gap-3 group">
          <div className="relative">
            <div className={`w-11 h-11 rounded-full border-2 ${borderClass} shadow-lg flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 bg-gray-900`}>
               <img 
                 src={avatarUrl} 
                 alt="Avatar" 
                 className="w-full h-full object-contain scale-110"
                 referrerPolicy="no-referrer"
               />
            </div>
            {/* Level Badge */}
            <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-[8px] font-black w-5 h-5 flex items-center justify-center rounded-full border border-white shadow-md uppercase">
              {level}
            </div>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-white font-black text-sm tracking-tight uppercase italic font-display">{user.name}</span>
            <div className="flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded-full mt-0.5 border border-white/10 relative overflow-hidden h-4 min-w-[100px]">
              <div className="absolute inset-0 bg-gray-900"></div>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-400"
                initial={{ width: 0 }}
                animate={{ width: `${expPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
              <div className="relative z-10 flex items-center gap-1 w-full justify-between">
                <div className="flex items-center gap-1">
                  <RankIcon rank={user.rank} size={8} />
                  <span className="text-white text-[8px] font-black uppercase tracking-tighter drop-shadow-md">{user.rank} {user.tier}</span>
                </div>
              </div>
            </div>
          </div>
        </button>

        {/* Right: Currencies */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-black/40 rounded-full border border-yellow-500/30 px-2.5 py-1 gap-1.5 shadow-inner">
            <Coins size={12} className="text-yellow-400" />
            <span className="text-white font-black text-xs font-mono">{user.coins.toLocaleString()}</span>
          </div>

          <div className="flex items-center bg-black/40 rounded-full border border-pink-500/30 px-2.5 py-1 gap-1.5 shadow-inner">
            <Gem size={12} className="text-pink-400" />
            <span className="text-white font-black text-xs font-mono">{user.gems}</span>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfile && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 backdrop-blur-md"
            onClick={() => setShowProfile(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-panel w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Background Decor */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-shine" />

              <button onClick={() => setShowProfile(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
              
              <div className="flex flex-col items-center mb-8">
                <div className="relative">
                  <div className={`w-28 h-28 rounded-full border-4 ${borderClass} shadow-2xl overflow-hidden mb-4 relative bg-gray-900`}>
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-contain scale-110" referrerPolicy="no-referrer" />
                  </div>
                  <button className="absolute bottom-4 right-0 bg-blue-600 p-2 rounded-full border-2 border-[#020617] text-white hover:bg-blue-500 transition-colors shadow-lg">
                    <Edit2 size={14} />
                  </button>
                </div>
                <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase font-display">{user.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-gray-400 font-mono text-sm tracking-widest bg-black/40 px-3 py-1 rounded-full border border-white/10">
                    ID: {user.friendCode}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-3 bg-black/40 px-4 py-2 rounded-xl border border-white/10">
                  <RankIcon rank={user.rank} size={24} />
                  <div className="flex flex-col items-start">
                    <span className="text-white font-black uppercase tracking-widest text-[10px] leading-none mb-1">{user.rank} {user.tier}</span>
                    <span className="text-blue-400 font-black uppercase tracking-widest text-[8px] leading-none">{user.league}</span>
                  </div>
                </div>
                <div className="flex gap-1.5 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={24} 
                      className={i < user.stars ? "text-yellow-400 fill-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" : "text-gray-800"} 
                    />
                  ))}
                </div>
              </div>

              <div className="w-full mb-6">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                  <span>Brain Power</span>
                  <span className="font-mono text-purple-400">{user.brainPower}%</span>
                </div>
                <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden border border-white/5 relative">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-purple-600 to-pink-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${user.brainPower}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>

              <div className="w-full mb-8">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                  <span>Level {level}</span>
                  <span className="font-mono">{currentExp} / {requiredExp} EXP</span>
                </div>
                <div className="w-full h-4 bg-black/40 rounded-full overflow-hidden border border-white/5 relative">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${expPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                  {/* Glint effect */}
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-8">
                <StatCard label="Matches" value={user.matchesPlayed} />
                <StatCard label="Win Rate" value={`${user.matchesPlayed ? Math.round((user.matchesWon / user.matchesPlayed) * 100) : 0}%`} color="text-emerald-400" />
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/30 uppercase tracking-widest italic">
                Edit Profile
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const StatCard: React.FC<{ label: string; value: string | number; color?: string }> = ({ label, value, color = "text-white" }) => (
  <div className="bg-black/20 p-4 rounded-2xl border border-white/5 text-center">
    <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">{label}</div>
    <div className={`text-xl font-black ${color}`}>{value}</div>
  </div>
);

export default PlayerHeader;
