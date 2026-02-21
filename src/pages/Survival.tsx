import React, { useState } from 'react';
import { useQuestions } from '../hooks/useQuestions';

const Survival: React.FC = () => {
  const { questions, loading, error, refresh } = useQuestions('Expert', 'en', 1);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 1);
      refresh();
    } else {
      setLives(lives - 1);
      if (lives - 1 === 0) {
        // Game Over
      } else {
        refresh();
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (lives === 0) return <div>Game Over! Your score: {score}</div>;

  const currentQuestion = questions[0];

  return (
    <div>
      <h2>Lives: {lives}</h2>
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

export default Survival;
