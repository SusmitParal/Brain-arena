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
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat">
      <motion.div 
        className="w-full max-w-2xl bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-lg p-8 relative"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <button onClick={onExit} className="absolute top-4 left-4 text-gray-400 hover:text-white">
          <ArrowLeft size={28} />
        </button>
        
        <h1 className="text-4xl font-bold text-center mb-2">Infinite Climb</h1>
        <p className="text-center text-gray-400 mb-8">Choose your difficulty and see how high you can climb.</p>

        <div className="space-y-4 mb-8">
          {difficulties.map((diff) => (
            <motion.button
              key={diff.name}
              onClick={() => setSelectedDifficulty(diff.name)}
              className={`w-full p-4 rounded-lg border-2 flex items-center gap-4 transition-all duration-200 ${selectedDifficulty === diff.name ? 'bg-cyan-600/30 border-cyan-500' : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`p-2 rounded-lg ${selectedDifficulty === diff.name ? diff.color : 'text-gray-300'}`}>
                {diff.icon}
              </div>
              <div>
                <h3 className={`text-xl font-semibold ${selectedDifficulty === diff.name ? diff.color : 'text-white'}`}>{diff.name}</h3>
                <p className="text-sm text-gray-400 text-left">{diff.description}</p>
              </div>
            </motion.button>
          ))}
        </div>

        <motion.button
          onClick={() => onStartGame(selectedDifficulty)}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-4 rounded-lg text-xl shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Climb
        </motion.button>
      </motion.div>
    </div>
  );
};

export default SoloClimbLobby;
