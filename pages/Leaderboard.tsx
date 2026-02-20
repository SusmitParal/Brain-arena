import React from 'react';
import { UserProfile } from '../types';
import { Trophy, Crown, Medal, Shield } from 'lucide-react';

interface LeaderboardProps {
  user: UserProfile;
  onExit: () => void;
}

const MOCK_LEADERS = [
  { name: "CyberKing", score: 25000, avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=cyber", isUser: false },
  { name: "QueenBee", score: 24500, avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=queen", isUser: false },
  { name: "NinjaX", score: 23000, avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=ninja", isUser: false },
  { name: "Brainiac", score: 21000, avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=brain", isUser: false },
  { name: "Speedster", score: 19500, avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=speed", isUser: false },
];

const Leaderboard: React.FC<LeaderboardProps> = ({ user, onExit }) => {
  // Insert user into leaderboard for display
  const allLeaders = [...MOCK_LEADERS, { name: user.name, score: user.rating * 10, avatar: user.selectedAvatar || "https://api.dicebear.com/9.x/adventurer/svg?seed=user", isUser: true }]
    .sort((a, b) => b.score - a.score);

  return (
    <div className="flex-1 flex flex-col p-6 animate-fade-in overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-orbitron text-white">Global Rankings</h2>
        <div className="bg-slate-900 px-4 py-2 rounded-full border border-white/10 text-xs font-bold text-cyan-400 uppercase tracking-widest">
          Season 4
        </div>
      </div>

      <div className="space-y-4 max-w-2xl mx-auto w-full">
        {allLeaders.map((leader, index) => (
          <div 
            key={index}
            className={`flex items-center justify-between p-4 rounded-xl border ${leader.isUser ? 'bg-cyan-900/30 border-cyan-500' : 'bg-slate-900/50 border-white/5'} relative overflow-hidden`}
          >
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-8 text-center font-black text-xl text-gray-500">
                {index === 0 ? <Crown className="text-yellow-400 fill-yellow-400" /> : 
                 index === 1 ? <Medal className="text-gray-300 fill-gray-300" /> :
                 index === 2 ? <Medal className="text-amber-700 fill-amber-700" /> :
                 `#${index + 1}`}
              </div>
              <img src={leader.avatar.startsWith('http') ? leader.avatar : `https://api.dicebear.com/9.x/adventurer/svg?seed=${leader.name}`} alt="av" className="w-12 h-12 rounded-full border-2 border-white/20 bg-slate-800" />
              <div>
                <div className={`font-bold ${leader.isUser ? 'text-cyan-400' : 'text-white'}`}>{leader.name} {leader.isUser && '(You)'}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Grandmaster</div>
              </div>
            </div>
            <div className="text-2xl font-black font-rajdhani text-white relative z-10">
              {leader.score.toLocaleString()}
            </div>
            {leader.isUser && <div className="absolute inset-0 bg-cyan-500/5 animate-pulse"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
