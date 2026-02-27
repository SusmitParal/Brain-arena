import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, UserPlus, Users, Shield, Send, Plus, Bot, Search, Coins } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { UserProfile } from '../types';

const TeamFormation: React.FC<{ onBack: () => void; onStartGame: (team: (UserProfile | { name: string; avatar: string; isBot: boolean } | null)[]) => void; user: UserProfile }> = ({ onBack, onStartGame, user }) => {
  const [team, setTeam] = useState<(UserProfile | { name: string; avatar: string; isBot: boolean } | null)[]>([
    user,
    null,
    null,
    null,
    null,
  ]);
  const [isRecruiting, setIsRecruiting] = useState(false);

  const startRecruitment = () => {
    setIsRecruiting(true);
    soundManager.playSfx('countdown');

    const emptySlots = team.map((p, i) => (p === null ? i : -1)).filter(i => i !== -1);
    let delay = 0;

    emptySlots.forEach(slotIndex => {
      setTimeout(() => {
        const botName = `Player${Math.floor(Math.random() * 9000) + 1000}`;
        const bot = { name: botName, avatar: `https://api.dicebear.com/9.x/micah/svg?seed=${botName}`, isBot: true };
        setTeam(prevTeam => {
          const newTeam = [...prevTeam];
          newTeam[slotIndex] = bot;
          return newTeam;
        });
      }, delay);
      delay += 750; // Stagger the reveal
    });

    setTimeout(() => {
      setIsRecruiting(false);
      soundManager.playSfx('level_up');
    }, delay);
  };

  const isTeamFull = team.every(p => p !== null);

  const getAvatar = (p: UserProfile | { name: string; avatar: string; isBot: boolean }) => {
    if ('avatar' in p) {
      return p.avatar;
    }
    return p.selectedAvatar.startsWith('av_') ? `https://api.dicebear.com/9.x/micah/svg?seed=${p.name}` : p.selectedAvatar;
  }

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed inset-0 bg-home text-white flex flex-col relative overflow-hidden"
    >
      {/* Header */}
      <div className="bg-[#0f172a]/95 backdrop-blur-xl p-4 flex items-center justify-between border-b border-white/10 relative z-20 shadow-2xl">
        <div className="flex items-center gap-4">
          <button
            onClick={() => { soundManager.playSfx('click'); onBack(); }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10 hover:neon-glow-blue"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 font-display leading-none">Form Your Team</h1>
            <div className="text-[8px] font-black text-blue-400 uppercase tracking-[0.3em] leading-none mt-1">Recruitment Phase</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-black/40 rounded-full border border-yellow-500/30 px-3 py-1.5">
          <Coins size={14} className="text-yellow-400" />
          <span className="text-white font-black text-sm font-mono">{user.coins.toLocaleString()}</span>
        </div>
      </div>

      {/* Team Roster */}
      <div className="flex-grow p-4 space-y-6 z-10 flex flex-col justify-center">
        <div className="grid grid-cols-5 gap-2 md:gap-4">
          {team.map((player, index) => (
            <div key={index} className={`aspect-[3/4] glass-panel rounded-2xl flex flex-col items-center justify-center p-2 relative overflow-hidden transition-all ${player ? 'border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'border-dashed border-white/10 opacity-50'}`}>
              <AnimatePresence mode="wait">
                {player ? (
                  <motion.div 
                    key="player"
                    initial={{ opacity: 0, scale: 0.5, y: 10 }} 
                    animate={{ opacity: 1, scale: 1, y: 0 }} 
                    className="flex flex-col items-center justify-center text-center w-full"
                  >
                    <div className="relative">
                      <img src={getAvatar(player)} alt={player.name} className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-white/10 shadow-lg bg-gray-800" referrerPolicy="no-referrer" />
                      {index === 0 && (
                        <div className="absolute -top-1 -right-1 bg-yellow-500 text-black text-[8px] font-black px-1 rounded border border-white uppercase">Leader</div>
                      )}
                    </div>
                    <div className="text-[10px] font-black mt-2 truncate w-full uppercase tracking-tighter text-blue-400">{player.name}</div>
                  </motion.div>
                ) : (
                  <motion.div key="empty" className="text-gray-600 flex flex-col items-center gap-2">
                    {isRecruiting ? 
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Search size={24} className="text-blue-400" /></motion.div> : 
                      <UserPlus size={24} className="opacity-20" />
                    }
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-30">{isRecruiting ? 'Searching' : 'Empty'}</span>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Decorative corner */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/5 rounded-tl-xl" />
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">
            {isTeamFull ? 'Team Ready for Battle' : 'Recruit Teammates to Proceed'}
          </p>
        </div>
      </div>

      {/* Actions & Start Button */}
      <div className="p-6 z-10 bg-black/40 backdrop-blur-md border-t border-white/10">
        <div className="max-w-md mx-auto space-y-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Entry Fee:</span>
            <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-full border border-yellow-500/20">
              <Coins size={12} className="text-yellow-400" />
              <span className="text-xs font-black text-white">500</span>
            </div>
          </div>

          {isTeamFull ? (
            <button
              onClick={() => { soundManager.playSfx('click'); onStartGame(team); }}
              className="w-full bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black py-4 rounded-2xl text-xl uppercase tracking-widest italic shadow-lg shadow-green-500/20 transition-all active:scale-95"
            >
              Start Battle
            </button>
          ) : (
            <button 
              onClick={startRecruitment}
              disabled={isRecruiting}
              className="w-full bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-black py-4 rounded-2xl text-xl uppercase tracking-widest italic shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
            >
              {isRecruiting ? 'Recruiting...' : 'Recruit Team'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TeamFormation;
