import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Shield, Star } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { UserProfile } from '../types';
import { leaderboardData } from '../data/leaderboardData';

const getRankColor = (rankName: string) => {
  switch (rankName) {
    case 'Grand Master': return 'text-red-400';
    case 'Master': return 'text-purple-400';
    case 'Diamond': return 'text-cyan-400';
    case 'Platinum': return 'text-blue-400';
    case 'Gold': return 'text-yellow-400';
    default: return 'text-gray-400';
  }
};

const Leaderboard: React.FC<{ onBack: () => void; user: UserProfile }> = ({ onBack, user }) => {
  const userRank = leaderboardData.findIndex(p => p.name === user.name) + 1 || 50; // Mock user rank

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed inset-0 bg-home text-white flex flex-col relative overflow-hidden"
    >
      {/* Header */}
      <div className="bg-[#1e293b]/80 backdrop-blur-xl p-4 flex items-center gap-4 border-b border-white/5 relative z-10">
        <button
          onClick={() => { soundManager.playSfx('click'); onBack(); }}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300 font-display">Leaderboard</h1>
      </div>

      {/* Ranking List */}
      <div className="flex-grow overflow-y-auto p-4 space-y-2 z-10">
        {leaderboardData.map((player, index) => (
          <motion.div
            key={player.rank}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-center gap-4 p-3 rounded-2xl border border-white/5 ${index < 3 ? 'bg-yellow-500/10' : 'bg-black/20'}`}
          >
            <div className={`text-2xl font-black w-8 text-center ${index < 3 ? 'text-yellow-400' : 'text-gray-500'}`}>{player.rank}</div>
            <img src={player.avatar} alt={player.name} className="w-12 h-12 rounded-full border-2 border-white/10" referrerPolicy="no-referrer" />
            <div className="flex-grow">
              <div className="font-bold text-white">{player.name}</div>
              <div className={`text-sm font-bold ${getRankColor(player.rankName)}`}>{player.rankName}</div>
            </div>
            <div className="flex items-center gap-1 text-yellow-400 font-bold">
              <Star size={16} />
              <span>{player.level}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* User's Rank */}
      <div className="bg-[#1e293b]/80 backdrop-blur-xl p-4 border-t border-white/5 relative z-10">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-black w-8 text-center text-gray-400">{userRank}</div>
          <img src={user.selectedAvatar.startsWith('av_') ? 'https://api.dicebear.com/9.x/micah/svg?seed=Player1' : user.selectedAvatar} alt={user.name} className="w-12 h-12 rounded-full border-2 border-white/10" referrerPolicy="no-referrer" />
          <div className="flex-grow">
            <div className="font-bold text-white">{user.name} (You)</div>
            <div className={`text-sm font-bold ${getRankColor(user.rank)}`}>{user.rank}</div>
          </div>
          <div className="flex items-center gap-1 text-yellow-400 font-bold">
            <Star size={16} />
            <span>{user.level}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Leaderboard;
