import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Coins, Trophy, MapPin } from 'lucide-react';
import { PVP_ARENAS } from '../data/arenas';
import { Arena, UserProfile } from '../types';

const PvPLobby: React.FC<{ onSelectArena: (arena: Arena) => void; onExit: () => void; user: UserProfile }> = ({ onSelectArena, onExit, user }) => {
  const userLevel = user.level;
  const userCoins = user.coins;

  return (
    <div className="min-h-screen bg-pvp-game text-white flex flex-col items-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
        <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[120px]" />
        <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[120px]" />
      </div>
      <div className="w-full max-w-6xl flex items-center justify-between mb-8 pt-4 z-10">
        <button onClick={onExit} className="bg-[#1e293b]/80 p-3 rounded-full hover:bg-[#1e293b]/60 transition-colors border border-white/10">
          <ArrowLeft size={28} />
        </button>
        <h1 className="text-5xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 font-display">
          World Tour
        </h1>
        <div className="w-12"></div> {/* Spacer for centering */}
      </div>

      <div className="w-full max-w-7xl flex-grow flex items-center overflow-x-auto pb-8 px-4 snap-x snap-mandatory scrollbar-hide">
        <div className="flex gap-6 mx-auto">
          {PVP_ARENAS.map((arena, index) => {
            const isLocked = userLevel < arena.minLevel;
            const canAfford = userCoins >= arena.entryFee;

            return (
              <motion.div
                key={arena.id}
                className={`relative w-80 h-[480px] flex-shrink-0 rounded-[2.5rem] overflow-hidden snap-center shadow-2xl border border-white/10 ${isLocked ? 'grayscale opacity-60' : ''}`}
                initial={{ opacity: 0, y: 50, rotate: 5 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ delay: index * 0.1, type: 'spring', stiffness: 260, damping: 20 }}
                whileHover={!isLocked ? { scale: 1.03, rotate: 0 } : {}}
              >
                {/* Background Image */}
                <img 
                  src={`https://picsum.photos/seed/${arena.slug}/400/600?blur=2`} 
                  alt={arena.name} 
                  className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex flex-col justify-end p-6 z-10">
                  
                  {/* Header Badge */}
                  <div className="absolute top-6 right-6 bg-[#1e293b]/70 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2 shadow-lg">
                    <Trophy size={16} className="text-yellow-400" />
                    <span className="text-sm font-bold text-yellow-400">Prize: {arena.prizePool.toLocaleString()}</span>
                  </div>

                  <h2 className="text-4xl font-black italic tracking-tighter mb-1 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300 font-display">{arena.name}</h2>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">{arena.description}</p>

                  <div className="bg-[#1e293b]/70 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-inner">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-400 text-xs uppercase font-bold tracking-wider">Entry Fee</span>
                      <div className="flex items-center gap-1">
                        <Coins size={18} className="text-yellow-400" />
                        <span className={`font-black text-lg ${canAfford ? 'text-white' : 'text-red-400'}`}>
                          {arena.entryFee.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {isLocked ? (
                      <button disabled className="w-full bg-gray-700/50 text-gray-400 font-black py-3 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed uppercase tracking-widest italic">
                        <Lock size={18} />
                        <span>Level {arena.minLevel} Required</span>
                      </button>
                    ) : (
                      <motion.button 
                        onClick={() => canAfford && onSelectArena(arena)}
                        className={`w-full font-black py-3 rounded-lg shadow-lg transition-all uppercase tracking-widest italic ${canAfford ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-purple-500/30' : 'bg-gray-600/50 text-gray-300 cursor-not-allowed'}`}
                        whileHover={canAfford ? { scale: 1.02 } : {}}
                        whileTap={canAfford ? { scale: 0.98 } : {}}
                      >
                        {canAfford ? 'Play Now' : 'Not Enough Coins'}
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PvPLobby;
