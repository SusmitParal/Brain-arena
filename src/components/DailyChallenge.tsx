import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import type { DailyChallenge as DailyChallengeType } from '../types';

const DailyChallenge: React.FC<{ challenge: DailyChallengeType; onClaim: (reward: number) => void; }> = ({ challenge, onClaim }) => {
  const progress = (challenge.progress / challenge.target) * 100;

  return (
    <motion.div
      className="bg-black/30 p-4 rounded-xl flex items-center justify-between border border-white/10 shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div>
        <p className="font-black text-gray-200">{challenge.title}</p>
        <p className="text-xs text-gray-400 italic">{challenge.description}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-24 h-4 bg-gray-800 rounded-full overflow-hidden border border-white/10 shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center gap-2 text-yellow-400 font-black">
          <Star size={16} fill="currentColor" className="drop-shadow-lg" />
          <span>{challenge.reward}</span>
        </div>
        {challenge.progress >= challenge.target && (
          <motion.button 
            onClick={() => onClaim(challenge.reward)} 
            className="bg-gradient-to-br from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-black py-1 px-3 rounded-lg uppercase tracking-wider italic shadow-md"
            whileTap={{ scale: 0.95 }}
          >
            Claim
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default DailyChallenge;
