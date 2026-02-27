import React from 'react';
import { motion } from 'framer-motion';

const GameModeCard: React.FC<{ title: string, subtitle: string, icon: React.ReactNode, gradient: string, borderColor: string, onClick: () => void, delay: number, disabled?: boolean }> = ({ title, subtitle, icon, gradient, borderColor, onClick, delay, disabled }) => (
  <motion.button
    initial={{ opacity: 0, x: -50 }}
    animate={{ 
      opacity: 1, 
      x: 0,
      scale: disabled ? 1 : [1, 1.01, 1]
    }}
    transition={{ 
      delay, 
      type: 'spring',
      scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
    }}
    whileHover={!disabled ? { scale: 1.02 } : {}}
    whileTap={!disabled ? { scale: 0.98 } : {}}
    onClick={onClick}
    disabled={disabled}
    className={`w-full h-24 rounded-[2rem] glass-panel p-0.5 shadow-2xl relative group overflow-hidden transition-all ${!disabled ? 'hover:neon-glow-blue cursor-pointer' : 'opacity-50 grayscale cursor-not-allowed'}`}
  >
    <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-20 group-hover:opacity-30 transition-opacity`} />
    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    <div className={`h-full w-full rounded-[2rem] flex items-center justify-between px-8 relative z-10`}>
      <div className="flex flex-col items-start">
        <h3 className="text-3xl font-black text-white italic tracking-tighter drop-shadow-lg font-display">{title}</h3>
        <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mt-1">{subtitle}</span>
      </div>
      <div className="bg-black/40 p-4 rounded-2xl border border-white/10 shadow-inner backdrop-blur-md group-hover:scale-110 transition-transform">
        {icon}
      </div>
    </div>
    {/* Shine effect */}
    <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:animate-shine" />
  </motion.button>
);

export default GameModeCard;
