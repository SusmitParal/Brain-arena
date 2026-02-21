import React, { useState, useEffect } from 'react';
import { useQuestions } from '../hooks/useQuestions';
import { motion } from 'framer-motion';

const SoloGame: React.FC<{ difficulty: string }> = ({ difficulty }) => {
  const { questions, loading, error, refresh } = useQuestions(difficulty, 'en', 1);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [exp, setExp] = useState(0);
  const [isLucky, setIsLucky] = useState(false);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (difficulty === 'Expert' || gameOver) {
      return;
    }
    const countdown = setInterval(() => {
      setTimer(prev => {
        if (prev === 1) {
          setGameOver(true);
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, [questions, gameOver, difficulty]);

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      const pointsGained = isLucky ? 10 : 2;
      setScore(score + pointsGained);
      setExp(exp + 2);
      
      // Reset timer and check for new lucky question
      setTimer(30);
      setIsLucky(Math.random() < 0.15); // 15% chance for a lucky question
      refresh();
    } else {
      setGameOver(true);
    }
  };

  if (loading && questions.length === 0) return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">Error: {error.message}</div>;
  
  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <h1 className="text-5xl font-bold mb-4">Game Over</h1>
        <p className="text-2xl mb-8">Your final score: {score}</p>
        <p className="text-xl">You earned {exp} EXP</p>
      </div>
    );
  }

  const currentQuestion = questions[0];

  if (!currentQuestion) {
      return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">Preparing next question...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <div className="text-xl font-bold">Score: {score}</div>
          <div className="text-xl font-bold">EXP: {exp}</div>
          {difficulty !== 'Expert' && <div className="text-xl font-bold">Time: {timer}</div>}
        </div>
        {isLucky && (
          <motion.div
            initial={{ scale: 0, y: -50 }}
            animate={{ scale: 1, y: 0 }}
            className="text-center text-2xl font-bold text-yellow-400 mb-4"
          >
            ✨ Lucky Question! +10 Points! ✨
          </motion.div>
        )}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold mb-6">{currentQuestion.question}</h2>
          <div className="grid grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => (
              <button 
                key={index} 
                onClick={() => handleAnswer(option === currentQuestion.answer)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-transform transform hover:scale-105"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoloGame;
