import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gem, Star } from 'lucide-react';
import { soundManager } from '../utils/audio';

const rewards = [
  { type: 'gems', value: 5 },
  { type: 'exp', value: 50 },
  { type: 'gems', value: 10 },
  { type: 'exp', value: 100 },
  { type: 'gems', value: 20 },
  { type: 'exp', value: 200 },
  { type: 'gems', value: 50 },
  { type: 'exp', value: 500 },
];

const LuckySpin: React.FC<{ onSpin: (reward: { type: string; value: number }) => void }> = ({ onSpin }) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const handleSpin = () => {
    if (spinning) return;

    soundManager.playSfx('click');
    setSpinning(true);

    const randomIndex = Math.floor(Math.random() * rewards.length);
    const reward = rewards[randomIndex];
    const targetRotation = 360 * 5 + (360 / rewards.length) * randomIndex;

    setRotation(targetRotation);

    setTimeout(() => {
      setSpinning(false);
      onSpin(reward);
    }, 5000);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-72 h-72 mb-8">
        <motion.div
          className="w-full h-full rounded-full border-4 border-yellow-400 bg-gray-800 grid grid-cols-8 overflow-hidden shadow-xl"
          animate={{ rotate: rotation }}
          transition={{ duration: 5, ease: 'circOut' }}
        >
          {rewards.map((reward, index) => (
            <div
              key={index}
              className="absolute inset-0 flex items-center justify-center text-white font-black text-xl uppercase tracking-wider italic"
              style={{
                transform: `rotate(${(360 / rewards.length) * index}deg) translateY(-50%) translateX(50%) rotate(-${(360 / rewards.length) * index}deg)`,
                transformOrigin: 'bottom right',
                clipPath: `polygon(0 0, 100% 0, 75% 100%, 0% 100%)`,
                backgroundColor: index % 2 === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              }}
            >
              <div className="flex flex-col items-center gap-1" style={{ transform: `rotate(${360 / rewards.length / 2}deg)` }}>
                {reward.type === 'gems' ? <Gem size={24} className="text-pink-400 drop-shadow-lg" /> : <Star size={24} fill="currentColor" className="text-yellow-400 drop-shadow-lg" />}
                <span>{reward.value}</span>
              </div>
            </div>
          ))}
        </motion.div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-yellow-400 rounded-full border-4 border-white shadow-xl" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[20px] border-t-yellow-400" />
      </div>
      <motion.button
        onClick={handleSpin}
        disabled={spinning}
        className="bg-gradient-to-br from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-black py-3 px-8 rounded-xl transition-colors disabled:opacity-50 uppercase tracking-wider italic shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {spinning ? 'Spinning...' : 'Spin'}
      </motion.button>
    </div>
  );
};

export default LuckySpin;
