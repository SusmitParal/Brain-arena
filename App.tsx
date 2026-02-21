import React, { useState } from 'react';
import Home from './src/pages/Home';
import SoloGame from './src/pages/SoloGame';
import SoloGameLobby from './src/pages/SoloGameLobby';
import TimeAttack from './src/pages/TimeAttack';
import Survival from './src/pages/Survival';

const App: React.FC = () => {
  const [screen, setScreen] = useState('HOME');
  const [soloGameDifficulty, setSoloGameDifficulty] = useState('Beginner');

  const handleStartSoloGame = (difficulty: string) => {
    setSoloGameDifficulty(difficulty);
    setScreen('SOLO_GAME');
  };

  const renderScreen = () => {
    switch (screen) {
      case 'HOME':
        return <Home onNavigate={setScreen} />;
      case 'SOLO_GAME_LOBBY':
        return <SoloGameLobby onStartGame={handleStartSoloGame} />;
      case 'SOLO_GAME':
        return <SoloGame difficulty={soloGameDifficulty} />;
      case 'TIME_ATTACK':
        return <TimeAttack />;
      case 'SURVIVAL':
        return <Survival />;
      default:
        return <Home onNavigate={setScreen} />;
    }
  };

  return (
    <div>
      {renderScreen()}
    </div>
  );
};

export default App;
