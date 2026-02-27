import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, X } from 'lucide-react';
import { soundManager } from '../utils/audio';
import questions from '../data/pass-n-play-questions.json';

const PassNPlayGame: React.FC<{ playerNames: string[]; onExit: () => void; }> = ({ playerNames, onExit }) => {
  const [scores, setScores] = useState(playerNames.map(() => 0));
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (option: string) => {
    if (isAnswered) return;

    setSelectedOption(option);
    setIsAnswered(true);

    if (option === currentQuestion.answer) {
      const newScores = [...scores];
      newScores[currentPlayerIndex]++;
      setScores(newScores);
      soundManager.playSfx('correct');
    } else {
      soundManager.playSfx('wrong');
    }

    setTimeout(() => {
      setIsAnswered(false);
      setSelectedOption(null);
      if (currentQuestionIndex === questions.length - 1) {
        // Game over
        alert(`Game Over!\n\nScores:\n${playerNames.map((name, i) => `${name}: ${scores[i]}`).join('\n')}`);
        onExit();
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setCurrentPlayerIndex((currentPlayerIndex + 1) % playerNames.length);
      }
    }, 2000);
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
      <div className="bg-[#1e293b]/80 backdrop-blur-xl p-4 flex items-center justify-between border-b border-white/5">
        <button
          onClick={() => { soundManager.playSfx('click'); onExit(); }}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300 font-display">{playerNames[currentPlayerIndex]}'s Turn</h1>
        <div className="flex items-center gap-4">
          {playerNames.map((name, i) => (
            <div key={i} className="text-center">
              <div className="text-xs font-bold">{name}</div>
              <div className="text-lg font-black">{scores[i]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center p-4 space-y-6">
        <motion.h2
          key={currentQuestionIndex}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-center"
        >
          {currentQuestion.question}
        </motion.h2>
        <motion.div
          className="grid grid-cols-2 gap-4 w-full max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {currentQuestion.options.map((option, i) => (
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <motion.button
                key={i}
                onClick={() => handleAnswer(option)}
                disabled={isAnswered}
                className={`w-full p-4 rounded-lg text-lg font-bold transition-all duration-300 ${
                  isAnswered
                    ? option === currentQuestion.answer
                      ? 'bg-green-500'
                      : option === selectedOption
                      ? 'bg-red-500'
                      : 'bg-gray-700'
                    : 'bg-blue-600 hover:bg-blue-500'
                }`}
                whileHover={{ scale: isAnswered ? 1 : 1.05 }}
                whileTap={{ scale: isAnswered ? 1 : 0.95 }}
              >
                {option}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PassNPlayGame;
