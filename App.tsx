import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Home from './src/pages/Home';
import SoloClimbLobby from './src/pages/SoloClimbLobby';
import SoloClimbGame from './src/pages/SoloClimbGame';
import PvPLobby from './src/pages/PvPLobby';
import PvPGame from './src/pages/PvPGame';
import Settings from './src/pages/Settings';
import Friends from './src/pages/Friends';
import Shop from './src/pages/Shop';
import Rewards from './src/pages/Rewards';
import TeamLobby from './src/pages/TeamLobby';
import Leaderboard from './src/pages/Leaderboard';
import WelcomeScreen from './src/pages/WelcomeScreen';
import TeamFormation from './src/pages/TeamFormation';
import TeamBattleGame from './src/pages/TeamBattleGame';
import DailyArenaLobby from './src/pages/DailyArenaLobby';
import DailyArenaGame from './src/pages/DailyArenaGame';
import SensoryLobby from './src/pages/SensoryLobby';
import SensoryGame from './src/pages/SensoryGame';
import TeamVS from './src/pages/TeamVS';

import PassNPlayLobby from './src/pages/PassNPlayLobby';
import PassNPlayGame from './src/pages/PassNPlayGame';
import { ScreenState, Arena, UserProfile } from './src/types';
import SplashScreen from './src/pages/SplashScreen';
import ErrorBoundary from './src/components/ErrorBoundary';

type Difficulty = 'Beginner' | 'Intermediate' | 'Expert';

import { soundManager } from './src/utils/audio';

const App: React.FC = () => {
  useEffect(() => {
    const handleInteraction = () => {
      soundManager.handleFirstInteraction();
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, []);
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<UserProfile>({
    id: '123',
    name: 'Player1',
    coins: 5000,
    gems: 100,
    exp: 0,
    level: 1,
    rank: 'Bronze',
    league: 'Bronze Bench',
    brainPower: 50,
    titles: ['Novice'],
    stars: 0,
    tier: 1,
    matchesPlayed: 0,
    matchesWon: 0,
    language: 'en',
    inventory: ['emoji_base_smile', 'emoji_base_sad', 'emoji_base_angry', 'chat_base_hi', 'chat_base_wow', 'chat_base_gl', 'taunt_base_1', 'av_c1', 'border_basic'],
    friends: [],
    selectedAvatar: 'av_c1',
    selectedBorder: 'border_basic',
    selectedEmoji: 'emoji_base_smile',
    selectedTaunt: 'taunt_base_1',
    selectedChat: 'chat_base_hi',
    seenQuestionIds: [],
    dailyArenaCompleted: false,
    dailyNugget: { fact: 'Did you know? The human brain generates about 20 watts of electricity.', date: new Date().toDateString() },
    dailyStreak: 1,
    lastLoginDate: Date.now(),
  });

  const [screen, setScreen] = useState<ScreenState>('HOME');
  const [soloClimbDifficulty, setSoloClimbDifficulty] = useState<Difficulty>('Beginner');
  const [selectedArena, setSelectedArena] = useState<Arena | null>(null);
  const [isNewUser, setIsNewUser] = useState(true);
  const [userTeam, setUserTeam] = useState<(UserProfile | { name: string; avatar: string; isBot: boolean } | null)[]>([]);
  const [passNPlayPlayers, setPassNPlayPlayers] = useState<string[]>([]);

  // Daily Streak Logic
  useEffect(() => {
    setUser(prevUser => {
      const now = new Date();
      const lastLogin = new Date(prevUser.lastLoginDate);
      
      // Reset hours to compare just the dates
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const lastLoginDay = new Date(lastLogin.getFullYear(), lastLogin.getMonth(), lastLogin.getDate());
      
      const diffTime = Math.abs(today.getTime() - lastLoginDay.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Logged in the next day, increment streak
        return { ...prevUser, dailyStreak: prevUser.dailyStreak + 1, lastLoginDate: now.getTime() };
      } else if (diffDays > 1) {
        // Missed a day, reset streak
        return { ...prevUser, dailyStreak: 1, lastLoginDate: now.getTime() };
      }
      
      // Logged in on the same day, do nothing
      return prevUser;
    });
  }, []);

  // Global Level Calculator
  useEffect(() => {
    const timer = setInterval(() => {
      setUser(prevUser => {
        // Calculate Level from EXP
        let calculatedLevel = 1;
        let requiredExp = 1000;
        let currentExp = prevUser.exp;
        while (currentExp >= requiredExp) {
          currentExp -= requiredExp;
          calculatedLevel++;
          requiredExp = calculatedLevel * 1000;
        }
        
        if (calculatedLevel !== prevUser.level) {
          return { ...prevUser, level: calculatedLevel };
        }
        
        return prevUser;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleStartSoloClimb = (difficulty: Difficulty) => {
    setSoloClimbDifficulty(difficulty);
    setScreen('GAME_SOLO_CLIMB');
  };

  const handleSelectArena = (arena: Arena) => {
    setSelectedArena(arena);
    setScreen('GAME_PVP_DUEL');
  };

  const handleWelcomeComplete = (name: string) => {
    setUser(prev => ({
      ...prev,
      name,
    }));
    setIsNewUser(false);
  };

  const handleDailyArenaComplete = (score: number) => {
    setUser(prev => ({
      ...prev,
      dailyArenaCompleted: true,
      coins: prev.coins + score,
      matchesPlayed: prev.matchesPlayed + 1,
      brainPower: Math.min(100, prev.brainPower + 10)
    }));
    setScreen('HOME');
  };

  const handleSensoryComplete = (score: number, gems: number) => {
    setUser(prev => ({
      ...prev,
      coins: prev.coins + score,
      gems: prev.gems + gems,
      matchesPlayed: prev.matchesPlayed + 1,
      brainPower: Math.min(100, prev.brainPower + 5)
    }));
    setScreen('HOME');
  };

  const renderScreen = () => {
    if (showSplash) {
      return <SplashScreen onComplete={() => setShowSplash(false)} />;
    }

    if (isNewUser) {
      return <WelcomeScreen onComplete={handleWelcomeComplete} />;
    }

    switch (screen) {
      case 'HOME':
        return <Home user={user} onNavigate={setScreen} setUser={setUser} currentScreen={screen} />;
      case 'SOLO_LOBBY':
        return <SoloClimbLobby onStartGame={handleStartSoloClimb} onExit={() => setScreen('HOME')} />;
      case 'GAME_SOLO_CLIMB':
        return <SoloClimbGame difficulty={soloClimbDifficulty} onExit={() => setScreen('SOLO_LOBBY')} user={user} setUser={setUser} />;
      
      case 'PVP_LOBBY':
        return <PvPLobby onSelectArena={handleSelectArena} onExit={() => setScreen('HOME')} user={user} />;
      case 'GAME_PVP_DUEL':
        if (!selectedArena) return <PvPLobby onSelectArena={handleSelectArena} onExit={() => setScreen('HOME')} user={user} />;
        return <PvPGame arena={selectedArena} onExit={() => setScreen('PVP_LOBBY')} user={user} setUser={setUser} />;

      case 'SHOP':
        return <Shop user={user} onBack={() => setScreen('HOME')} setUser={setUser} />;
      case 'LEADERBOARD':
        return <Leaderboard onBack={() => setScreen('HOME')} user={user} />;
      case 'PROFILE':
        return <PlaceholderScreen title="Profile" onBack={() => setScreen('HOME')} />;
      case 'SETTINGS':
        return <Settings onBack={() => setScreen('HOME')} user={user} />;
      case 'FRIENDS':
        return <Friends user={user} onBack={() => setScreen('HOME')} onNavigate={setScreen} />;
      case 'REWARDS':
        return <Rewards user={user} onBack={() => setScreen('HOME')} setUser={setUser} />;
      case 'TEAM_LOBBY':
        return <TeamLobby onExit={() => setScreen('HOME')} onNavigate={setScreen} />;
            case 'TEAM_FORMATION':
        return <TeamFormation onBack={() => setScreen('TEAM_LOBBY')} onStartGame={(team) => { setUserTeam(team); setScreen('TEAM_VS'); }} user={user} />;
      case 'TEAM_VS':
        return <TeamVS onAnimationComplete={() => setScreen('GAME_TEAM_BATTLE')} userTeam={userTeam} />;
      case 'GAME_TEAM_BATTLE':
        return <TeamBattleGame onExit={() => setScreen('TEAM_LOBBY')} user={user} userTeam={userTeam} setUser={setUser} />;
      case 'DAILY_ARENA_LOBBY':
        return <DailyArenaLobby onExit={() => setScreen('HOME')} onNavigate={setScreen} />;
      case 'GAME_DAILY_ARENA':
        return <DailyArenaGame user={user} onComplete={handleDailyArenaComplete} onExit={() => setScreen('HOME')} />;
      case 'SENSORY_LOBBY':
        return <SensoryLobby onExit={() => setScreen('HOME')} onNavigate={setScreen} />;
      case 'GAME_SENSORY':
        return <SensoryGame user={user} onComplete={handleSensoryComplete} onExit={() => setScreen('HOME')} />;
      
      case 'PASS_N_PLAY_LOBBY':
        return <PassNPlayLobby onStartGame={(playerNames) => { setPassNPlayPlayers(playerNames); setScreen('GAME_PASS_N_PLAY'); }} onExit={() => setScreen('HOME')} />;
      case 'GAME_PASS_N_PLAY':
        return <PassNPlayGame playerNames={passNPlayPlayers} onExit={() => setScreen('PASS_N_PLAY_LOBBY')} />;

      default:
        return <Home user={user} onNavigate={setScreen} setUser={setUser} currentScreen={screen} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="App min-h-screen bg-[#0A0A0A] gpu overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={isNewUser ? 'welcome' : screen}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full h-full"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
};

// A temporary component for screens that are not yet built

const PlaceholderScreen: React.FC<{ title: string; onBack: () => void }> = ({ title, onBack }) => (
  <div className="flex flex-col items-center justify-center min-h-screen w-full bg-lobby text-white p-4">
    <div className="bg-[#1e293b]/80 p-8 rounded-3xl border border-white/10 shadow-2xl text-center">
      <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-blue-400 font-display">{title}</h1>
      <p className="text-xl mb-8 text-gray-300">This screen is under construction.</p>
      <button onClick={() => { soundManager.playSfx('click'); onBack(); }} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-3 px-8 rounded-xl transition-all shadow-lg uppercase tracking-widest">
        Back to Home
      </button>
    </div>
  </div>
);

export default App;


