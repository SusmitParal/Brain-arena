import React from 'react';
import { motion } from 'framer-motion';

const PromoButton: React.FC<{ icon: React.ReactNode, label: string, subLabel?: string, color: string, onClick: () => void }> = ({ icon, label, subLabel, color, onClick }) => (
  <motion.button 
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`flex-1 ${color} rounded-xl p-2 flex flex-col items-center justify-center border-b-4 border-black/20 shadow-lg relative overflow-hidden`}
  >
    <div className="absolute top-0 right-0 p-1 opacity-20 text-white">{icon}</div>
    <span className="text-[10px] font-bold text-white leading-tight text-center">{label}</span>
    {subLabel && <span className="text-[8px] font-bold text-yellow-200 leading-tight">{subLabel}</span>}
  </motion.button>
);

export default PromoButton;
