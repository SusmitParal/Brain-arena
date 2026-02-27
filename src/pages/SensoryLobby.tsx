import React from 'react';
import { motion } from 'framer-motion';
import { Ear, Eye, Activity } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { ScreenState } from '../types';

interface SensoryLobbyProps {
  onExit: () => void;
  onNavigate: (screen: ScreenState) => void;
}

const SensoryLobby: React.FC<SensoryLobbyProps> = ({ onExit, onNavigate }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black text-white flex flex-col relative overflow-hidden"
    >
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 to-black pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <Activity size={80} className="text-emerald-400 mb-6 drop-shadow-[0_0_30px_rgba(52,211,153,0.6)]" />
            </motion.div>
            
            <h1 className="text-6xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-b from-emerald-300 to-emerald-600 mb-4 font-display drop-shadow-sm">The Anomaly</h1>
            <p className="text-emerald-100/80 font-bold uppercase tracking-widest text-sm mb-12">Multimodal Sensory Overload</p>

            <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-12">
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/5 border border-emerald-500/20 p-4 rounded-2xl backdrop-blur-md"
                >
                    <Ear size={24} className="text-emerald-400 mx-auto mb-2" />
                    <div className="text-lg font-black uppercase">Audio-Morph</div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-400">Identify Frequency</div>
                </motion.div>
                 <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/5 border border-emerald-500/20 p-4 rounded-2xl backdrop-blur-md"
                >
                    <Eye size={24} className="text-emerald-400 mx-auto mb-2" />
                    <div className="text-lg font-black uppercase">Thermal Map</div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-400">Visual Decoding</div>
                </motion.div>
            </div>

            <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                onClick={() => {
                    soundManager.playSfx('click');
                    onNavigate('GAME_SENSORY');
                }}
                className="w-full max-w-md bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black py-5 rounded-2xl text-2xl uppercase tracking-widest italic shadow-lg shadow-emerald-500/20 transition-all active:scale-95 group relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10">Initiate Sequence</span>
            </motion.button>
            
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                onClick={onExit}
                className="mt-8 text-gray-500 hover:text-white font-bold uppercase tracking-widest text-xs transition-colors"
            >
                Abort Mission
            </motion.button>
        </div>
    </motion.div>
  );
};

export default SensoryLobby;
