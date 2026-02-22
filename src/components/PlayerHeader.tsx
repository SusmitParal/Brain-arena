import React, { useState } from 'react';
import { UserProfile, Rank } from '../types';
import { Shield, Star, Coins, Gem, Settings, Mail, User as UserIcon, X } from 'lucide-react';
import { AVATARS } from '../data/avatars';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data for now
const mockUser: UserProfile = {
  id: '123',
  friendCode: 'ABCDEF',
  name: 'Player1',
  coins: 12500,
  gems: 300,
  exp: 1500,
  stars: 3,
  level: 15,
  rank: 'Silver',
  tier: 2,
  matchesPlayed: 42,
  matchesWon: 28,
  language: 'en',
  inventory: [],
  chests: [
    { id: 'c1', tier: 'Bronze', status: 'UNLOCKING', unlockTimeRemaining: 300, obtainedAt: Date.now() },
    { id: 'c2', tier: 'Silver', status: 'LOCKED', unlockTimeRemaining: 3600, obtainedAt: Date.now() }
  ],
  friends: [],
  selectedAvatar: 'av_l1', // Legendary Avatar
  selectedBorder: 'border_neon_blue',
  bronzeChestPenaltyMatches: 0,
  seenQuestionIds: [],
};

const rankIcons: Record<Rank, React.ReactNode> = {
  'Bronze': <Shield size={16} className="text-orange-400 fill-orange-400/20" />,
  'Silver': <Shield size={16} className="text-gray-300 fill-gray-300/20" />,
  'Gold': <Shield size={16} className="text-yellow-400 fill-yellow-400/20" />,
  'Platinum': <Shield size={16} className="text-cyan-400 fill-cyan-400/20" />,
  'Diamond': <Shield size={16} className="text-blue-500 fill-blue-500/20" />,
  'Master': <Shield size={16} className="text-purple-500 fill-purple-500/20" />,
  'Grand Master': <Shield size={16} className="text-red-500 fill-red-500/20" />,
};

const PlayerHeader: React.FC = () => {
  const user = mockUser;
  const [showProfile, setShowProfile] = useState(false);
  
  const currentAvatar = AVATARS.find(a => a.id === user.selectedAvatar) || AVATARS[0];
  const isLegendary = currentAvatar.rarity === 'Legendary';

  return (
    <>
      <div className="w-full flex items-center justify-between px-2 py-2 relative z-50">
        {/* Left: Profile */}
        <button onClick={() => setShowProfile(true)} className="flex items-center gap-2 group">
          <div className="relative">
            <div className={`w-14 h-14 rounded-md bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 ${isLegendary ? 'ring-2 ring-yellow-400 ring-offset-1 ring-offset-gray-900' : ''}`}>
               <motion.img 
                 src={currentAvatar.assetName} 
                 alt="Avatar" 
                 className="w-full h-full object-cover"
                 animate={isLegendary ? { opacity: [1, 0.8, 1], scale: [1, 1.05, 1] } : {}}
                 transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
               />
            </div>
            {/* Level Badge (Red Circle) */}
            <div className="absolute -bottom-2 -right-2 bg-red-600 text-white text-[10px] font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-md">
              {user.level}
            </div>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-white font-bold text-sm shadow-black drop-shadow-md">{user.name}</span>
            <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-full mt-1 border border-white/10">
              {rankIcons[user.rank]}
              <div className="flex gap-0.5">
                {Array(user.stars).fill(0).map((_, i) => <Star key={i} size={8} className="text-yellow-400 fill-yellow-400" />)}
              </div>
            </div>
          </div>
        </button>

        {/* Right: Currencies & Settings */}
        <div className="flex items-center gap-2">
          {/* Coins */}
          <div className="flex items-center bg-black/40 rounded-full border border-yellow-600/50 pr-2 pl-1 py-0.5 gap-1">
            <div className="bg-yellow-500 rounded-full p-0.5 border border-yellow-300 shadow-inner">
              <Coins size={12} className="text-yellow-900 fill-yellow-900" />
            </div>
            <span className="text-white font-bold text-xs">{user.coins.toLocaleString()}</span>
            <button className="bg-green-500 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold text-white border border-green-400 shadow-sm hover:bg-green-400 transition-colors">+</button>
          </div>

          {/* Gems */}
          <div className="flex items-center bg-black/40 rounded-full border border-pink-600/50 pr-2 pl-1 py-0.5 gap-1">
            <div className="bg-pink-500 rounded-full p-0.5 border border-pink-300 shadow-inner">
              <Gem size={12} className="text-pink-900 fill-pink-900" />
            </div>
            <span className="text-white font-bold text-xs">{user.gems}</span>
            <button className="bg-green-500 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold text-white border border-green-400 shadow-sm hover:bg-green-400 transition-colors">+</button>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-1 ml-1">
            <button className="bg-gray-700/80 p-1.5 rounded-lg border border-white/20 hover:bg-gray-600 transition-colors shadow-sm">
              <Mail size={16} className="text-white" />
            </button>
            <button className="bg-gray-700/80 p-1.5 rounded-lg border border-white/20 hover:bg-gray-600 transition-colors shadow-sm">
              <Settings size={16} className="text-white" />
            </button>
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
            className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setShowProfile(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-800 w-full max-w-sm rounded-2xl p-6 border border-white/10 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setShowProfile(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                <X size={24} />
              </button>
              
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-xl bg-blue-600 border-4 border-white shadow-xl overflow-hidden mb-4 relative">
                  <img src={currentAvatar.assetName} alt="Avatar" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 right-0 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-tl-lg">
                    Lvl {user.level}
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                <div className="flex items-center gap-2 text-yellow-400 font-bold mt-1">
                  {rankIcons[user.rank]}
                  <span>{user.rank} League</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-900/50 p-3 rounded-xl border border-white/5 text-center">
                  <div className="text-gray-400 text-xs uppercase font-bold mb-1">Matches</div>
                  <div className="text-xl font-bold text-white">{user.matchesPlayed}</div>
                </div>
                <div className="bg-gray-900/50 p-3 rounded-xl border border-white/5 text-center">
                  <div className="text-gray-400 text-xs uppercase font-bold mb-1">Win Rate</div>
                  <div className="text-xl font-bold text-green-400">
                    {Math.round((user.matchesWon / user.matchesPlayed) * 100)}%
                  </div>
                </div>
                <div className="bg-gray-900/50 p-3 rounded-xl border border-white/5 text-center">
                  <div className="text-gray-400 text-xs uppercase font-bold mb-1">Total EXP</div>
                  <div className="text-xl font-bold text-blue-400">{user.exp.toLocaleString()}</div>
                </div>
                <div className="bg-gray-900/50 p-3 rounded-xl border border-white/5 text-center">
                  <div className="text-gray-400 text-xs uppercase font-bold mb-1">Best Streak</div>
                  <div className="text-xl font-bold text-orange-400">12</div>
                </div>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg">
                Edit Profile
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PlayerHeader;
