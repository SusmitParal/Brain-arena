import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gem, Star } from 'lucide-react';
import { soundManager } from '../utils/audio';

const rewards = [
  { type: 'gems', value: 10 },
  { type: 'exp', value: 100 },
  { type: 'gems', value: 25 },
  { type: 'exp', value: 250 },
];

const ScratchCard: React.FC<{ onScratch: (reward: { type: string; value: number }) => void }> = ({ onScratch }) => {
  const [isScratched, setIsScratched] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const reward = rewards[Math.floor(Math.random() * rewards.length)];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'gray';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const scratch = (e: MouseEvent) => {
      if (!ctx) return;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(e.offsetX, e.offsetY, 20, 0, 2 * Math.PI);
      ctx.fill();
    };

    canvas.addEventListener('mousemove', scratch);

    return () => {
      canvas.removeEventListener('mousemove', scratch);
    };
  }, []);

  return (
    <motion.div
      className="relative w-64 h-32 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg border border-white/10"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <canvas ref={canvasRef} width="256" height="128" className="absolute top-0 left-0 w-full h-full rounded-xl" />
      <div className="flex items-center gap-2 text-gray-900 font-black text-3xl uppercase tracking-wider italic drop-shadow-lg">
        {reward.type === 'gems' ? <Gem size={32} className="text-pink-600 drop-shadow-lg" /> : <Star size={32} fill="currentColor" className="text-yellow-600 drop-shadow-lg" />}
        <span>{reward.value}</span>
      </div>
    </motion.div>
  );
};

export default ScratchCard;
