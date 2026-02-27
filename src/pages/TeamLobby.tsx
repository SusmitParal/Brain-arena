import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Coins, Crown, Zap, Shield, Swords } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { ScreenState } from '../types'; // Import ScreenState

interface TeamLobbyProps {
  onExit: () => void;
  onNavigate: (screen: ScreenState) => void; // Add onNavigate to allow starting game
  onSelectMode: (modeId: string) => void;
}

const teamBattleModes = [
  { id: 'mode_1', name: 'Rookie Rumble', description: 'Start your team journey!', bet: 5000, maxPlayers: 5, icon: <Zap size={20} />, color: 'from-green-500 to-emerald-600' },
  { id: 'mode_2', name: 'Bronze Blitz', description: 'A step up for new teams.', bet: 15000, maxPlayers: 5, icon: <Coins size={20} />, color: 'from-amber-500 to-orange-600' },
  { id: 'mode_3', name: 'Silver Skirmish', description: 'Prove your coordination.', bet: 50000, maxPlayers: 5, icon: <Shield size={20} />, color: 'from-gray-400 to-gray-500' },
  { id: 'mode_4', name: 'Gold Gauntlet', description: 'High stakes, higher rewards.', bet: 100000, maxPlayers: 5, icon: <Crown size={20} />, color: 'from-yellow-500 to-amber-600' },
  { id: 'mode_5', name: 'Platinum Plunge', description: 'Only for the brave.', bet: 300000, maxPlayers: 5, icon: <Swords size={20} />, color: 'from-blue-500 to-indigo-600' },
  { id: 'mode_6', name: 'Diamond Duel', description: 'Elite teams clash here.', bet: 750000, maxPlayers: 5, icon: <Users size={20} />, color: 'from-cyan-500 to-blue-600' },
  { id: 'mode_7', name: 'Master Mayhem', description: 'True mastery is tested.', bet: 1500000, maxPlayers: 5, icon: <Crown size={20} />, color: 'from-purple-500 to-pink-600' },
  { id: 'mode_8', name: 'Grand Master Gala', description: 'The pinnacle of team play.', bet: 5000000, maxPlayers: 5, icon: <Zap size={20} />, color: 'from-red-500 to-orange-600' },
  { id: 'mode_9', name: 'Legendary League', description: 'For the legends among us.', bet: 15000000, maxPlayers: 5, icon: <Shield size={20} />, color: 'from-white to-gray-300' },
  { id: 'mode_10', name: 'Ultimate Showdown', description: 'The ultimate team challenge!', bet: 50000000, maxPlayers: 5, icon: <Swords size={20} />, color: 'from-black to-gray-800' },
];

const TeamLobby: React.FC<TeamLobbyProps> = ({ onExit, onNavigate, onSelectMode }) => {
  const handleStartGame = (modeId: string) => {
    soundManager.playSfx('click');
    onSelectMode(modeId);
    onNavigate('TEAM_FORMATION');
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed inset-0 bg-home text-white flex flex-col relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-30">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-red-600 rounded-full blur-[150px]"
        ></motion.div>
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            x: [0, -50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-orange-600 rounded-full blur-[150px]"
        ></motion.div>
      </div>

      {/* Header */}
      <div className="bg-[#1e293b]/80 backdrop-blur-xl p-4 flex items-center gap-4 border-b border-white/5 relative z-10">
        <button
          onClick={() => { soundManager.playSfx('click'); onExit(); }}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300 font-display">Team Battle</h1>
      </div>

      {/* Game Modes */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamBattleModes.map((mode, index) => (
            <motion.button
              key={mode.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.05, type: 'spring', stiffness: 200, damping: 20 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleStartGame(mode.id)}
              className={`w-full bg-gradient-to-br ${mode.color} rounded-2xl p-5 flex flex-col items-start relative overflow-hidden shadow-xl border border-white/10 group`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-xl group-hover:scale-150 transition-transform duration-500"></div>

              <div className="flex items-center gap-3 mb-2 relative z-10">
                <div className="bg-black/30 p-2 rounded-full border border-white/10 shadow-inner">{mode.icon}</div>
                <h3 className="text-xl font-black italic tracking-tight uppercase leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300 font-display">{mode.name}</h3>
              </div>
              <p className="text-xs text-gray-300 mb-3 text-left relative z-10">{mode.description}</p>
              
              <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full border border-white/10 shadow-sm relative z-10">
                <Coins size={16} className="text-yellow-400" />
                <span className="font-bold text-sm text-yellow-300">{mode.bet.toLocaleString()} SP</span>
              </div>
            </motion.button>
          ))}
        </div>
        <div className="bg-[#1e293b]/80 backdrop-blur-xl rounded-2xl p-8 text-center border border-white/5 border-dashed shadow-lg z-10">
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">More team modes coming soon!</p>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamLobby;
