import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Coins, Trophy, MapPin } from 'lucide-react';
import { PVP_ARENAS } from '../data/arenas';
import { Arena } from '../types';

const PvPLobby: React.FC<{ onSelectArena: (arena: Arena) => void; onExit: () => void; }> = ({ onSelectArena, onExit }) => {
  // Mock user level for locking logic
  const userLevel = 15;
  const userCoins = 12500;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat overflow-hidden">
      <div className="w-full max-w-6xl flex items-center justify-between mb-8 pt-4">
        <button onClick={onExit} className="bg-gray-800/80 p-3 rounded-full hover:bg-gray-700 transition-colors">
          <ArrowLeft size={28} />
        </button>
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
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
                className={`relative w-80 h-[450px] flex-shrink-0 rounded-3xl overflow-hidden snap-center shadow-2xl border-4 ${isLocked ? 'border-gray-700 grayscale' : 'border-cyan-500/50'}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={!isLocked ? { scale: 1.05, y: -10 } : {}}
              >
                {/* Background Image */}
                <img 
                  src={`https://picsum.photos/seed/${arena.slug}/400/600`} 
                  alt={arena.name} 
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-6">
                  
                  {/* Header Badge */}
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1">
                    <Trophy size={14} className="text-yellow-400" />
                    <span className="text-xs font-bold text-yellow-400">Prize: {arena.prizePool.toLocaleString()}</span>
                  </div>

                  <h2 className="text-3xl font-bold mb-1 text-white drop-shadow-lg">{arena.name}</h2>
                  <p className="text-sm text-gray-300 mb-4 line-clamp-2">{arena.description}</p>

                  <div className="bg-gray-900/80 backdrop-blur-md rounded-xl p-4 border border-white/10">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-400 text-xs uppercase font-bold tracking-wider">Entry Fee</span>
                      <div className="flex items-center gap-1">
                        <Coins size={16} className="text-yellow-400" />
                        <span className={`font-bold ${canAfford ? 'text-white' : 'text-red-400'}`}>
                          {arena.entryFee.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {isLocked ? (
                      <button disabled className="w-full bg-gray-700 text-gray-400 font-bold py-3 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed">
                        <Lock size={18} />
                        <span>Level {arena.minLevel} Required</span>
                      </button>
                    ) : (
                      <button 
                        onClick={() => canAfford && onSelectArena(arena)}
                        className={`w-full font-bold py-3 rounded-lg shadow-lg transition-transform active:scale-95 ${canAfford ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500' : 'bg-gray-600 text-gray-300 cursor-not-allowed'}`}
                      >
                        {canAfford ? 'Play Now' : 'Not Enough Coins'}
                      </button>
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
