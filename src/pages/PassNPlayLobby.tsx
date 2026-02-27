import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Play } from 'lucide-react';
import { soundManager } from '../utils/audio';

const PassNPlayLobby: React.FC<{ onStartGame: (playerNames: string[]) => void; onExit: () => void; }> = ({ onStartGame, onExit }) => {
  const [playerNames, setPlayerNames] = useState(['', '']);

  const handleAddPlayer = () => {
    if (playerNames.length < 4) {
      setPlayerNames([...playerNames, '']);
    }
  };

  const handleRemovePlayer = (index: number) => {
    if (playerNames.length > 2) {
      const newPlayerNames = [...playerNames];
      newPlayerNames.splice(index, 1);
      setPlayerNames(newPlayerNames);
    }
  };

  const handlePlayerNameChange = (index: number, name: string) => {
    const newPlayerNames = [...playerNames];
    newPlayerNames[index] = name;
    setPlayerNames(newPlayerNames);
  };

  const handleStartGame = () => {
    const validPlayerNames = playerNames.filter(name => name.trim() !== '');
    if (validPlayerNames.length >= 2) {
      onStartGame(validPlayerNames);
    }
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed inset-0 bg-home text-white flex flex-col"
    >
      {/* Header */}
      <div className="bg-[#1e293b]/80 backdrop-blur-xl p-4 flex items-center gap-4 border-b border-white/5">
        <button
          onClick={() => { soundManager.playSfx('click'); onExit(); }}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300 font-display">Pass N Play</h1>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-6">
        <section>
          <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 px-2">Players</h2>
          <div className="bg-[#1e293b]/80 backdrop-blur-xl rounded-2xl p-4 border border-white/5 shadow-lg space-y-4">
            {playerNames.map((name, index) => (
              <div key={index} className="flex items-center gap-4">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:border-green-500 transition-all focus:neon-glow-green placeholder-gray-600"
                  placeholder={`Player ${index + 1}`}
                />
                {playerNames.length > 2 && (
                  <button onClick={() => handleRemovePlayer(index)} className="text-red-500">Remove</button>
                )}
              </div>
            ))}
            {playerNames.length < 4 && (
              <button onClick={handleAddPlayer} className="w-full bg-white/5 hover:bg-white/10 text-white font-black py-4 rounded-2xl transition-all border border-white/5 uppercase tracking-widest text-sm">
                Add Player
              </button>
            )}
          </div>
        </section>

        <button
          onClick={handleStartGame}
          disabled={playerNames.filter(name => name.trim() !== '').length < 2}
          className="w-full bg-gradient-to-br from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white font-black py-5 rounded-2xl transition-all shadow-lg shadow-green-500/30 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-widest italic group"
        >
          Start Game <Play size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

export default PassNPlayLobby;
