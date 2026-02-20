import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Trophy, Coins, Star, Zap, Volume2, VolumeX, Gem } from 'lucide-react';
import { calculateRank, calculateLevel } from '../constants';
import { audioManager } from '../services/audioService';

interface HeaderProps {
  user: UserProfile;
  onProfileClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onProfileClick }) => {
  const rankInfo = calculateRank(user.stars);
  const levelInfo = calculateLevel(user.exp);
  const [isMuted, setIsMuted] = useState(audioManager.getMuteStatus());

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const muted = audioManager.toggleMute();
    setIsMuted(muted);
    if (!muted) {
        audioManager.playSFX('click');
    }
  };

  return (
    <div className="w-full px-4 pt-4 sticky top-0 z-50">
      <div className="w-full h-20 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-3xl flex items-center justify-between px-4 shadow-xl">
        {/* Profile Section */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onProfileClick}>
          <div className="relative group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-400 to-purple-500 flex items-center justify-center font-black text-2xl border-4 border-white shadow-lg transform group-hover:rotate-6 transition-transform">
              {user.name.charAt(0)}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full border-2 border-white">
              {levelInfo.level}
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="font-display font-bold text-white text-lg leading-none drop-shadow-md">{user.name}</span>
            
            {/* Rank Display with Stars */}
            <div className="flex items-center gap-1 mt-1 bg-black/20 px-2 py-0.5 rounded-lg">
               <span className={`text-[10px] ${rankInfo.color} font-black uppercase tracking-widest`}>
                 {rankInfo.tier}
               </span>
               <div className="flex">
                 {Array.from({length: 5}).map((_, i) => (
                   <Star 
                      key={i} 
                      size={10} 
                      className={i < rankInfo.currentStars ? `text-yellow-400 fill-current` : 'text-white/20'} 
                   />
                 ))}
               </div>
            </div>
          </div>
        </div>

        {/* Stats Section & Sound Toggle */}
        <div className="flex items-center gap-3">
          
          <div className="flex flex-col items-end space-y-1">
              <div className="flex gap-2">
                  <div className="flex items-center space-x-1 bg-black/30 px-3 py-1 rounded-full border border-white/10 shadow-inner">
                      <Coins size={14} className="text-yellow-400 fill-yellow-400" />
                      <span className="font-display font-bold text-sm text-white">{user.coins.toLocaleString()}</span>
                  </div>
              </div>
              <div className="flex gap-2">
                  <div className="flex items-center space-x-1 bg-black/30 px-3 py-1 rounded-full border border-white/10 shadow-inner">
                      <Gem size={14} className="text-pink-400 fill-pink-400" />
                      <span className="font-display font-bold text-sm text-white">{user.gems.toLocaleString()}</span>
                  </div>
              </div>
          </div>

          {/* Sound Toggle */}
          <button 
              onClick={handleMuteToggle}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 border-2 border-white/30 text-white transition-all active:scale-95"
          >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;