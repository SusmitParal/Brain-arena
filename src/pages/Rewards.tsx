import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Gift, Gem } from 'lucide-react';
import { UserProfile, DailyChallenge as DailyChallengeType } from '../types';
import DailyChallenge from '../components/DailyChallenge';
import LuckySpin from '../components/LuckySpin';
import ScratchCard from '../components/ScratchCard';
import CountdownTimer from '../components/CountdownTimer';
import { soundManager } from '../utils/audio';

const Rewards: React.FC<{ user: UserProfile; onBack: () => void; setUser: React.Dispatch<React.SetStateAction<UserProfile>>; }> = ({ user, onBack, setUser }) => {
  const getNextClaimTime = (lastClaimed?: string) => {
    if (!lastClaimed) return undefined;
    const lastDate = new Date(lastClaimed);
    const nextDate = new Date(lastDate.getTime() + 24 * 60 * 60 * 1000);
    return nextDate.toISOString();
  };

  const nextSpinTime = getNextClaimTime(user.lastLuckySpin);
  const nextScratchTime = getNextClaimTime(user.lastScratchCard);
  const canSpin = !nextSpinTime || new Date() >= new Date(nextSpinTime);
  const canScratch = !nextScratchTime || new Date() >= new Date(nextScratchTime);

  return (
    <div className="min-h-screen bg-home text-white flex flex-col items-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
        <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-yellow-600/30 rounded-full blur-[120px]" />
        <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-orange-600/30 rounded-full blur-[120px]" />
      </div>
      <div className="w-full max-w-4xl flex justify-between items-center mb-8 z-10">
        <button onClick={onBack} className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300 font-display">Rewards</h1>
        <div className="w-10"></div>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Daily Challenges */}
        <div className="bg-[#1e293b]/80 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-lg z-10">
          <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300 font-display">Daily Challenges</h2>
          <div className="flex flex-col gap-4">
            <DailyChallenge challenge={{ id: '1', title: 'Win 3 PvP Matches', description: 'Test your skills against other players.', target: 3, progress: user.matchesWon, reward: 50 }} onClaim={(reward) => setUser(prevUser => ({ ...prevUser, exp: prevUser.exp + reward }))} />
            <DailyChallenge challenge={{ id: '2', title: 'Play 5 Games', description: 'Any game mode counts.', target: 5, progress: user.matchesPlayed, reward: 25 }} onClaim={(reward) => setUser(prevUser => ({ ...prevUser, exp: prevUser.exp + reward }))} />
          </div>
        </div>

        {/* Lucky Spin */}
        <div className="bg-[#1e293b]/80 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-lg z-10 relative">
          <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300 font-display">Lucky Spin</h2>
          {canSpin ? (
            <LuckySpin onSpin={(reward) => {
              if (reward.type === 'gems') {
                setUser(prevUser => ({ ...prevUser, gems: prevUser.gems + reward.value, lastLuckySpin: new Date().toISOString() }));
              } else if (reward.type === 'exp') {
                setUser(prevUser => ({ ...prevUser, exp: prevUser.exp + reward.value, lastLuckySpin: new Date().toISOString() }));
              }
              alert(`You won ${reward.value} ${reward.type}!`);
            }} />
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-gray-400 mb-4 italic">Next spin available in:</p>
              <CountdownTimer targetDate={nextSpinTime} onComplete={() => setUser({...user})} />
            </div>
          )}
        </div>

        {/* Scratch Card */}
        <div className="bg-[#1e293b]/80 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-lg z-10 relative">
          <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300 font-display">Scratch Card</h2>
          {canScratch ? (
            <ScratchCard onScratch={(reward) => {
              if (reward.type === 'gems') {
                setUser(prevUser => ({ ...prevUser, gems: prevUser.gems + reward.value, lastScratchCard: new Date().toISOString() }));
              } else if (reward.type === 'exp') {
                setUser(prevUser => ({ ...prevUser, exp: prevUser.exp + reward.value, lastScratchCard: new Date().toISOString() }));
              }
              alert(`You won ${reward.value} ${reward.type}!`);
            }} />
          ) : (
            <div className="flex flex-col items-center justify-center h-32">
              <p className="text-gray-400 mb-4 italic">Next card available in:</p>
              <CountdownTimer targetDate={nextScratchTime} onComplete={() => setUser({...user})} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rewards;
