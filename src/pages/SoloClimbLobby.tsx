import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BrainCircuit, Zap, Trophy } from 'lucide-react';

type Difficulty = 'Beginner' | 'Intermediate' | 'Expert';

const SoloClimbLobby: React.FC<{ onStartGame: (difficulty: Difficulty) => void; onExit: () => void; }> = ({ onStartGame, onExit }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('Beginner');

  const difficulties: { name: Difficulty; icon: React.ReactNode; color: string; description: string; }[] = [
    { name: 'Beginner', icon: <BrainCircuit />, color: 'text-green-400', description: 'A gentle start to test your knowledge.' },
    { name: 'Intermediate', icon: <Zap />, color: 'text-yellow-400', description: 'A balanced challenge for the curious mind.' },
    { name: 'Expert', icon: <Trophy />, color: 'text-red-400', description: 'The ultimate test. No timer, one mistake ends the run.' },
  ];

  return (
    <div className="min-h-screen bg-solo-climb text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <motion.div 
        className="w-full max-w-2xl bg-[#1e293b]/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-8 relative border border-white/10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
      >
        <button onClick={onExit} className="absolute top-6 left-6 text-gray-400 hover:text-white z-20 transition-colors">
          <ArrowLeft size={28} />
        </button>
        
        <h1 className="text-5xl font-black italic tracking-tighter uppercase text-center mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 font-display">Infinite Climb</h1>
        <p className="text-center text-gray-400 mb-8 font-bold uppercase tracking-widest text-xs">Choose your challenge</p>

        <div className="space-y-4 mb-8">
          {difficulties.map((diff) => (
            <motion.button
              key={diff.name}
              onClick={() => setSelectedDifficulty(diff.name)}
              className={`w-full p-5 rounded-xl border-2 flex items-center gap-4 transition-all duration-200 shadow-md ${selectedDifficulty === diff.name ? 'bg-blue-600/30 border-blue-500' : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700 hover:border-blue-500/50'}`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className={`p-3 rounded-xl ${selectedDifficulty === diff.name ? 'bg-white/10' : 'bg-gray-600/30'} ${diff.color}`}>
                {diff.icon}
              </div>
              <div>
                <h3 className={`text-2xl font-black italic tracking-tighter ${selectedDifficulty === diff.name ? diff.color : 'text-white'}`}>{diff.name}</h3>
                <p className="text-sm text-gray-400 text-left">{diff.description}</p>
              </div>
            </motion.button>
          ))}
        </div>

        <motion.button
          onClick={() => onStartGame(selectedDifficulty)}
          className="w-full bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black py-4 rounded-xl text-xl shadow-lg shadow-blue-500/30 uppercase tracking-widest italic transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Start Climb
        </motion.button>
      </motion.div>
    </div>
  );
};

export default SoloClimbLobby;
