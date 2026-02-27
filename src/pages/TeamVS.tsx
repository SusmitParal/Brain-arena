import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserProfile } from '../types';
import { SHOP_ITEMS } from '../data/shopItems';

const TeamVS: React.FC<{ onAnimationComplete: () => void; userTeam: (UserProfile | { name: string; avatar: string; isBot: boolean } | null)[] }> = ({ onAnimationComplete, userTeam }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationComplete();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  const opponentTeam = Array.from({ length: 5 }).map((_, i) => ({
    name: `Challenger${i + 1}`,
    avatar: `https://api.dicebear.com/9.x/micah/svg?seed=Challenger${i + 1}`,
    isBot: true,
  }));

  const getAvatar = (p: UserProfile | { name: string; avatar: string; isBot: boolean }) => {
    if ('avatar' in p) {
      return p.avatar;
    }
    const item = SHOP_ITEMS.find(i => i.id === p.selectedAvatar);
    return item?.assetName || `https://api.dicebear.com/9.x/micah/svg?seed=${p.name}`;
  }

  const renderTeam = (team: (UserProfile | { name: string; avatar: string; isBot: boolean } | null)[], side: 'left' | 'right') => (
    <div className={`flex flex-col items-${side === 'left' ? 'start' : 'end'} gap-1.5 w-[45%]`}>
      <h2 className={`text-xl md:text-2xl font-black italic text-transparent bg-clip-text bg-gradient-to-b ${side === 'left' ? 'from-cyan-400 to-blue-600' : 'from-red-400 to-orange-600'}`}>{side === 'left' ? 'Team 1' : 'Team 2'}</h2>
      {team && team.map((player, index) => player && (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: side === 'left' ? -50 : 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + index * 0.2 }}
          className={`flex items-center gap-1.5 ${side === 'right' ? 'flex-row-reverse' : ''} w-full`}>
          <img src={getAvatar(player)} alt={player.name} className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-white/20 shrink-0" referrerPolicy="no-referrer" />
          <span className="font-bold text-xs md:text-sm truncate max-w-[80px] md:max-w-[120px]">{player.name}</span>
        </motion.div>
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-home flex items-center justify-center p-2 md:p-4"
    >
      <div className="flex items-center justify-between w-full max-w-2xl">
        {renderTeam(userTeam, 'left')}
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5, type: 'spring' }} className="text-2xl md:text-4xl font-black text-gray-400 shrink-0 mx-2">VS</motion.div>
        {renderTeam(opponentTeam, 'right')}
      </div>
    </motion.div>
  );
};

export default TeamVS;
