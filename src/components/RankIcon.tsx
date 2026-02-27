import React from 'react';
import { Shield, Star, Sun, Moon, Diamond, Crown, Zap, Flame } from 'lucide-react';
import { Rank } from '../types';

const RankIcon: React.FC<{ rank: Rank; size: number }> = ({ rank, size }) => {
  switch (rank) {
    case 'Bronze':
      return <Shield size={size} className="text-orange-700 drop-shadow-md" />;
    case 'Silver':
      return <Shield size={size} className="text-gray-400 drop-shadow-md" />;
    case 'Gold':
      return <Shield size={size} className="text-yellow-500 drop-shadow-md" />;
    case 'Platinum':
      return <Moon size={size} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />;
    case 'Diamond':
      return <Diamond size={size} className="text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />;
    case 'Master':
      return <Crown size={size} className="text-purple-500 drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]" />;
    case 'Grand Master':
      return <Zap size={size} className="text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" />;
    case 'Challenger':
      return <Flame size={size} className="text-amber-500 drop-shadow-[0_0_20px_rgba(245,158,11,1)] animate-pulse" />;
    default:
      return null;
  }
};

export default RankIcon;
