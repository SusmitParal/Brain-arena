import React, { useState, useEffect } from 'react';
import { useQuestions } from '../hooks/useQuestions';

const TimeAttack: React.FC = () => {
  const { questions, loading, error, refresh } = useQuestions('Intermediate', 'en', 100);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }
  }, [timeLeft, gameOver]);

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 1);
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setGameOver(true);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (gameOver) return <div>Game Over! Your score: {score}</div>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <h2>Time Left: {timeLeft}</h2>
      <h2>Score: {score}</h2>
      <h3>{currentQuestion.question}</h3>
      <div>
        {currentQuestion.options.map((option, index) => (
          <button key={index} onClick={() => handleAnswer(option === currentQuestion.answer)}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeAttack;
