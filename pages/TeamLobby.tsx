import React, { useState } from 'react';
import { UserProfile, Teammate } from '../types';
import Button from '../components/Button';
import { TEAM_BATTLE_TIERS, TEAM_BOT_NAMES } from '../constants';
import { Users, Shield, Zap, MessageCircle, Mic, Lock, UserPlus } from 'lucide-react';
import { audioManager } from '../services/audioService';

interface TeamLobbyProps {
  user: UserProfile;
  onStartMatch: (fee: number, tierIndex: number) => void;
  onExit: () => void;
}

const TeamLobby: React.FC<TeamLobbyProps> = ({ user, onStartMatch, onExit }) => {
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [lobbyMembers, setLobbyMembers] = useState<Teammate[]>([
    { id: 'me', name: user.name, isOnline: true, avatar: '😎' },
    ...user.friends.slice(0, 6) // Auto-fill with friends
  ]);
  
  // Auto-fill remaining slots with bots if friends < 6
  if (lobbyMembers.length < 7) {
     const needed = 7 - lobbyMembers.length;
     const bots: Teammate[] = Array.from({length: needed}).map((_, i) => ({
         id: `bot_${i}`,
         name: TEAM_BOT_NAMES[i],
         isOnline: true,
         avatar: '🤖'
     }));
     // This is just for display, in a real app we'd update state properly
     lobbyMembers.push(...bots);
  }

  const handleStart = () => {
     if (selectedTier === null) return;
     const tier = TEAM_BATTLE_TIERS[selectedTier];
     
     // Cost per player calculation check
     const splitCost = Math.floor(tier.amount / 7);
     
     if (user.coins < splitCost) {
         audioManager.playSFX('wrong');
         alert(`Insufficient funds! Your share is ${splitCost.toLocaleString()} coins.`);
         return;
     }

     audioManager.playSFX('click');
     onStartMatch(tier.amount, selectedTier);
  };

  return (
    <div className="flex-1 flex flex-col p-4 animate-fade-in overflow-hidden">
       {/* Top Bar */}
       <div className="flex justify-between items-center mb-4 bg-slate-900/80 p-3 rounded-xl border border-white/10">
          <div className="flex items-center gap-3">
             <Shield className="text-cyan-400" size={24}/>
             <div>
                <div className="font-bold text-white uppercase">{user.teamName || "Mercenaries"}</div>
                <div className="text-[10px] text-gray-400">Lobby: {lobbyMembers.length}/7 Ready</div>
             </div>
          </div>
          <Button variant="danger" size="sm" onClick={onExit}>Exit Lobby</Button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-hidden">
          {/* Left: Squad Roster & Chat */}
          <div className="flex flex-col gap-4 overflow-y-auto">
             <div className="bg-slate-900/50 p-4 rounded-xl border border-white/10">
                <h3 className="text-xs uppercase text-gray-400 mb-3 tracking-widest flex items-center justify-between">
                    Active Squad 
                    <div className="flex gap-2">
                        <Mic size={14} className="text-green-500 animate-pulse" />
                        <span className="text-green-500 font-bold">Voice Active</span>
                    </div>
                </h3>
                <div className="space-y-2">
                   {lobbyMembers.map((member, i) => (
                      <div key={i} className="flex items-center justify-between bg-black/40 p-2 rounded border border-white/5">
                         <div className="flex items-center gap-3">
                            <span className="text-xl">{member.avatar}</span>
                            <span className={member.id === 'me' ? 'text-cyan-400 font-bold' : 'text-gray-300'}>{member.name}</span>
                         </div>
                         <div className="flex gap-2">
                             {/* Fake mic indicator for random users */}
                             {Math.random() > 0.7 && <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>}
                         </div>
                      </div>
                   ))}
                   <button className="w-full py-2 border border-dashed border-gray-600 text-gray-500 rounded text-xs hover:border-white hover:text-white transition-colors flex items-center justify-center gap-2">
                      <UserPlus size={14} /> Recruit Mercenaries
                   </button>
                </div>
             </div>

             <div className="flex-1 bg-slate-900/50 p-4 rounded-xl border border-white/10 flex flex-col min-h-[200px]">
                <h3 className="text-xs uppercase text-gray-400 mb-2 tracking-widest">Team Comms</h3>
                <div className="flex-1 overflow-y-auto space-y-2 text-sm text-gray-300 p-2 font-mono">
                    <div className="text-cyan-400/80"><span className="font-bold text-cyan-400">System:</span> Squad uplink established.</div>
                    <div><span className="font-bold text-white">Viper:</span> Ready to roll.</div>
                    <div><span className="font-bold text-white">Ghost:</span> Which tier we hitting cap?</div>
                </div>
                <div className="mt-2 flex gap-2">
                   <input disabled placeholder="Type to team..." className="flex-1 bg-black/40 border border-white/10 rounded px-3 py-2 text-sm outline-none cursor-not-allowed opacity-50"/>
                   <button className="p-2 bg-cyan-600 rounded text-white opacity-50"><MessageCircle size={16}/></button>
                </div>
             </div>
          </div>

          {/* Right: Mission Select */}
          <div className="bg-slate-900/50 p-4 rounded-xl border border-white/10 overflow-y-auto">
              <h3 className="text-xl font-orbitron text-white mb-4 text-center uppercase">Select Operation Tier</h3>
              <div className="space-y-3">
                 {TEAM_BATTLE_TIERS.map((tier, idx) => {
                    const splitCost = Math.floor(tier.amount / 7);
                    const isAffordable = user.coins >= splitCost;
                    const isSelected = selectedTier === idx;

                    return (
                        <div 
                          key={idx}
                          onClick={() => isAffordable && setSelectedTier(idx)}
                          className={`
                            relative p-4 rounded-lg border-2 transition-all cursor-pointer group
                            ${isSelected ? 'bg-cyan-900/40 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'bg-black/40 border-white/5 hover:border-white/20'}
                            ${!isAffordable ? 'opacity-50 grayscale cursor-not-allowed' : ''}
                          `}
                        >
                           <div className="flex justify-between items-center relative z-10">
                              <div>
                                 <div className={`font-black font-orbitron uppercase text-lg ${isSelected ? 'text-cyan-300' : 'text-gray-300'}`}>{tier.label}</div>
                                 <div className="text-xs text-gray-500 uppercase tracking-wider">{tier.difficulty} • 7 vs 7</div>
                              </div>
                              <div className="text-right">
                                 <div className="text-yellow-400 font-bold font-rajdhani text-xl flex items-center justify-end gap-1">
                                    <Zap size={16} fill="currentColor"/> {tier.amount.toLocaleString()}
                                 </div>
                                 <div className="text-[10px] text-gray-400">Share: {splitCost.toLocaleString()}</div>
                              </div>
                           </div>
                           {!isAffordable && <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20 font-bold text-red-500 uppercase tracking-widest"><Lock size={16} className="mr-2"/> Locked</div>}
                        </div>
                    );
                 })}
              </div>

              <div className="mt-6">
                 <Button 
                    variant="primary" 
                    glow={selectedTier !== null} 
                    className="w-full py-4 text-xl" 
                    disabled={selectedTier === null}
                    onClick={handleStart}
                 >
                    INITIALIZE BATTLE
                 </Button>
                 <p className="text-center text-[10px] text-gray-500 mt-2">
                    Winner takes all. Reward split equally among survivors.
                 </p>
              </div>
          </div>
       </div>
    </div>
  );
};

export default TeamLobby;
