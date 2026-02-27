import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Clock, Trophy, Users } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { ScreenState } from '../types';

interface DailyArenaLobbyProps {
  onExit: () => void;
  onNavigate: (screen: ScreenState) => void;
}

const DailyArenaLobby: React.FC<DailyArenaLobbyProps> = ({ onExit, onNavigate }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black text-white flex flex-col relative overflow-hidden"
    >
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 to-black pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <Crown size={80} className="text-amber-400 mb-6 drop-shadow-[0_0_30px_rgba(251,191,36,0.6)]" />
            </motion.div>
            
            <h1 className="text-6xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-b from-amber-300 to-amber-600 mb-4 font-display drop-shadow-sm">Daily Arena</h1>
            <p className="text-amber-100/80 font-bold uppercase tracking-widest text-sm mb-12">Global Competition • One Chance</p>

            <div className="grid grid-cols-3 gap-4 w-full max-w-md mb-12">
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/5 border border-amber-500/20 p-4 rounded-2xl backdrop-blur-md"
                >
                    <Clock size={24} className="text-amber-400 mx-auto mb-2" />
                    <div className="text-2xl font-black">24h</div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-400">Cycle</div>
                </motion.div>
                 <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/5 border border-amber-500/20 p-4 rounded-2xl backdrop-blur-md"
                >
                    <Trophy size={24} className="text-amber-400 mx-auto mb-2" />
                    <div className="text-2xl font-black">10k</div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-400">Prize Pool</div>
                </motion.div>
                 <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white/5 border border-amber-500/20 p-4 rounded-2xl backdrop-blur-md"
                >
                    <Users size={24} className="text-amber-400 mx-auto mb-2" />
                    <div className="text-2xl font-black">5.2k</div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-400">Players</div>
                </motion.div>
            </div>

            <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                onClick={() => {
                    soundManager.playSfx('click');
                    onNavigate('GAME_DAILY_ARENA');
                }}
                className="w-full max-w-md bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black py-5 rounded-2xl text-2xl uppercase tracking-widest italic shadow-lg shadow-amber-500/20 transition-all active:scale-95 group relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10">Enter Arena</span>
            </motion.button>
            
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                onClick={onExit}
                className="mt-8 text-gray-500 hover:text-white font-bold uppercase tracking-widest text-xs transition-colors"
            >
                Return to Base
            </motion.button>
        </div>
    </motion.div>
  );
};

export default DailyArenaLobby;
