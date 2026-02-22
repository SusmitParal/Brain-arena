import React, { useState } from 'react';
import Home from './src/pages/Home';
import SoloClimbLobby from './src/pages/SoloClimbLobby';
import SoloClimbGame from './src/pages/SoloClimbGame';
import PvPLobby from './src/pages/PvPLobby';
import PvPGame from './src/pages/PvPGame';
import { ScreenState, Arena } from './src/types';

type Difficulty = 'Beginner' | 'Intermediate' | 'Expert';

const App: React.FC = () => {
  const [screen, setScreen] = useState<ScreenState>('HOME');
  const [soloClimbDifficulty, setSoloClimbDifficulty] = useState<Difficulty>('Beginner');
  const [selectedArena, setSelectedArena] = useState<Arena | null>(null);

  const handleStartSoloClimb = (difficulty: Difficulty) => {
    setSoloClimbDifficulty(difficulty);
    setScreen('GAME_SOLO_CLIMB');
  };

  const handleSelectArena = (arena: Arena) => {
    setSelectedArena(arena);
    setScreen('GAME_PVP_DUEL');
  };

  const renderScreen = () => {
    switch (screen) {
      case 'HOME':
        return <Home onNavigate={setScreen} />;
      case 'SOLO_LOBBY':
        return <SoloClimbLobby onStartGame={handleStartSoloClimb} onExit={() => setScreen('HOME')} />;
      case 'GAME_SOLO_CLIMB':
        return <SoloClimbGame difficulty={soloClimbDifficulty} onExit={() => setScreen('SOLO_LOBBY')} />;
      
      case 'PVP_LOBBY':
        return <PvPLobby onSelectArena={handleSelectArena} onExit={() => setScreen('HOME')} />;
      case 'GAME_PVP_DUEL':
        if (!selectedArena) return <PvPLobby onSelectArena={handleSelectArena} onExit={() => setScreen('HOME')} />;
        return <PvPGame arena={selectedArena} onExit={() => setScreen('PVP_LOBBY')} />;

      // Placeholder screens for footer navigation
      case 'SHOP':
        return <PlaceholderScreen title="Shop" onBack={() => setScreen('HOME')} />;
      case 'LEADERBOARD':
        return <PlaceholderScreen title="Leaderboard" onBack={() => setScreen('HOME')} />;
      case 'PROFILE':
        return <PlaceholderScreen title="Profile" onBack={() => setScreen('HOME')} />;
      case 'SETTINGS':
        return <PlaceholderScreen title="Settings" onBack={() => setScreen('HOME')} />;

      // TODO: Add other cases for TEAM_LOBBY, etc.

      default:
        return <Home onNavigate={setScreen} />;
    }
  };

  return <div className="App">{renderScreen()}</div>;
};

// A temporary component for screens that are not yet built
const PlaceholderScreen: React.FC<{ title: string; onBack: () => void }> = ({ title, onBack }) => (
  <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
    <h1 className="text-4xl font-bold mb-8">{title}</h1>
    <p className="text-xl mb-8">This screen is under construction.</p>
    <button onClick={onBack} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg">
      Back to Home
    </button>
  </div>
);

export default App;


