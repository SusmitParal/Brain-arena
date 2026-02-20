import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Header from './components/Header';
import Home from './pages/Home';
import SoloGame from './pages/SoloGame';
import BattleGame from './pages/BattleGame';
import PassNPlay from './pages/PassNPlay';
import Store from './pages/Store';
import SocialHub from './pages/SocialHub';
import TeamLobby from './pages/TeamLobby';
import TeamBattle from './pages/TeamBattle';
import Leaderboard from './pages/Leaderboard';
import Tournaments from './pages/Tournaments';
import Button from './components/Button';
import { UserProfile, ScreenState, GameResult, Language, ChestTier, UserChest } from './types';
import { ENTRY_FEES, TEAM_BATTLE_TIERS, calculateLevel, calculateRank } from './constants';
import { Settings, ArrowLeft, ShieldAlert, Zap, Trophy, Crown, Star, Gift, Users } from 'lucide-react';
import { audioManager } from './services/audioService';

// Initial Mock User
const INITIAL_USER: UserProfile = {
  id: 'temp-id',
  friendCode: '000000',
  name: "Player1",
  coins: 1000,
  gems: 50,
  exp: 0,
  stars: 0, 
  level: 1,
  rating: 1200,
  matchesPlayed: 0,
  matchesWon: 0,
  language: 'en',
  inventory: ['av_1'],
  chests: [],
  friends: [],
  lastDailyClaim: 0,
  streak: 0,
  selectedAvatar: 'av_1'
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [screen, setScreen] = useState<ScreenState>('HOME');
  const [activeGameConfig, setActiveGameConfig] = useState<{difficulty?: string, entryFee?: number, questionCount?: number, isTeam?: boolean} | null>(null);
  const [lastResult, setLastResult] = useState<GameResult | null>(null);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('brain_arena_user');
    if (saved) {
      const parsedUser = JSON.parse(saved);
      // Migrations
      if (parsedUser.stars === undefined) parsedUser.stars = 0;
      if (parsedUser.gems === undefined) parsedUser.gems = 10;
      if (parsedUser.inventory === undefined) parsedUser.inventory = ['av_1'];
      if (parsedUser.chests === undefined) parsedUser.chests = [];
      if (parsedUser.friends === undefined) parsedUser.friends = [];
      if (parsedUser.friendCode === undefined) parsedUser.friendCode = Math.floor(100000 + Math.random() * 900000).toString();
      if (parsedUser.streak === undefined) parsedUser.streak = 0;
      if (parsedUser.lastDailyClaim === undefined) parsedUser.lastDailyClaim = 0;
      
      // Migrate old string chests to new object structure if needed
      if (parsedUser.chests.length > 0 && typeof parsedUser.chests[0] === 'string') {
          parsedUser.chests = parsedUser.chests.map((t: string) => ({
             id: Math.random().toString(36).substr(2,9),
             tier: t,
             obtainedAt: Date.now(),
             isUnlocked: true, // Legacy chests unlocked by default
             timeReducedByAds: 0
          }));
      }

      setUser(parsedUser);
    } else {
      // First time setup - generate ID
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      setUser(u => ({ ...u, friendCode: newCode, id: crypto.randomUUID() }));
    }
  }, []);

  // Save on update
  useEffect(() => {
    localStorage.setItem('brain_arena_user', JSON.stringify(user));
  }, [user]);

  // --- Audio Logic ---
  useEffect(() => {
    switch (screen) {
      case 'HOME':
      case 'MODE_SELECT':
      case 'GAME_LOBBY':
      case 'LEADERBOARD':
      case 'SETTINGS':
      case 'PROFILE':
      case 'GAME_RESULT':
      case 'STORE':
      case 'SOCIAL_HUB':
      case 'TEAM_LOBBY':
        audioManager.playBGM('MENU');
        break;
      case 'PASS_N_PLAY':
        audioManager.playBGM('OFFLINE');
        break;
      case 'GAME_PLAY':
        audioManager.playBGM('SOLO');
        break;
      case 'TEAM_BATTLE':
        audioManager.playBGM('BATTLE_HARD'); // Intense music for high stakes
        break;
    }
    
    // Battle music for solo battle
    if (screen === 'GAME_LOBBY' && activeGameConfig?.entryFee && !activeGameConfig.isTeam) {
       const diff = activeGameConfig.difficulty;
       if (diff === 'Expert' || diff === 'Master') {
         audioManager.playBGM('BATTLE_HARD');
       } else if (diff === 'Intermediate') {
         audioManager.playBGM('BATTLE_MEDIUM');
       } else {
         audioManager.playBGM('BATTLE_EASY');
       }
    }

  }, [screen, activeGameConfig]);


  const startSoloGame = (difficulty: string) => {
    setActiveGameConfig({ difficulty, mode: 'SOLO' } as any);
    setScreen('GAME_PLAY');
    audioManager.playSFX('click');
  };

  const startBattleGame = (fee: number, difficulty: string, questionCount: number) => {
    if (user.coins < fee) {
      audioManager.playSFX('wrong'); 
      return;
    }
    audioManager.playSFX('click');
    setUser(u => ({ ...u, coins: u.coins - fee }));
    setActiveGameConfig({ entryFee: fee, difficulty, questionCount, isTeam: false });
    setScreen('GAME_LOBBY'); 
  };

  const startTeamBattle = (totalFee: number, tierIndex: number) => {
      // Calculate share
      const myShare = Math.floor(totalFee / 7);
      if (user.coins < myShare) {
          audioManager.playSFX('wrong');
          return;
      }
      const config = TEAM_BATTLE_TIERS[tierIndex];
      
      setUser(u => ({ ...u, coins: u.coins - myShare }));
      setActiveGameConfig({ 
          entryFee: totalFee, // Store total pot reference
          difficulty: config.difficulty as any,
          isTeam: true,
          rewardGems: config.rewardGems
      } as any);
      setScreen('TEAM_BATTLE');
  };

  const handleGameEnd = (result: GameResult) => {
    if (result.won) {
        audioManager.playSFX('win');
    } else {
        audioManager.playSFX('lose');
    }

    let expGain = result.won ? 10 : 5; 
    let earnedChestTier: ChestTier | undefined = undefined;

    // Logic separation for Team vs Solo
    if (result.isTeamMatch && result.won) {
       // Team matches give big coins + Gems
       // NO CHESTS as per requirement
       const gemBonus = (activeGameConfig as any)?.rewardGems || 0;
       setUser(u => ({ ...u, gems: u.gems + gemBonus }));
       expGain += 500; // Big EXP for team wins
    } else if (activeGameConfig?.entryFee && result.won) {
       // Standard Battle Mode - CHEST DROPS
       const bonus = Math.floor(Math.sqrt(activeGameConfig.entryFee));
       expGain += bonus;
       
       // Determine Chest Tier
       if (activeGameConfig.entryFee >= 5000) earnedChestTier = 'Gold';
       else if (activeGameConfig.entryFee >= 1000) earnedChestTier = 'Silver';
       else earnedChestTier = 'Bronze';

    } else if (!activeGameConfig?.entryFee && result.won) {
       // Solo
       expGain += Math.floor(result.score / 10);
    } else if (result.winnerName) {
       // Pass N Play
       expGain = 5;
    }
    
    const starsGain = result.won && !result.winnerName ? (result.isTeamMatch ? 3 : 1) : 0; 
    
    const newTotalExp = user.exp + expGain;
    const newTotalStars = user.stars + starsGain;
    const levelInfo = calculateLevel(newTotalExp);
    
    const finalResult: GameResult = { 
        ...result, 
        expEarned: expGain,
        starsEarned: starsGain,
        chestEarned: earnedChestTier
    };
    
    setLastResult(finalResult);
    setScreen('GAME_RESULT');
    
    setUser(prev => {
      // Check Chest Slots
      let updatedChests = prev.chests;
      if (earnedChestTier) {
          if (prev.chests.length < 4) {
              const newChest: UserChest = {
                  id: Math.random().toString(36).substr(2, 9),
                  tier: earnedChestTier,
                  obtainedAt: Date.now(),
                  isUnlocked: false,
                  timeReducedByAds: 0
              };
              updatedChests = [...prev.chests, newChest];
          } else {
              // Slots full - Chest discarded (Could notify user)
              console.log("Chest slots full, reward discarded");
              finalResult.chestEarned = undefined; // Update result so UI doesn't show chest
          }
      }

      return {
        ...prev,
        coins: prev.coins + result.coinsEarned,
        exp: newTotalExp,
        stars: newTotalStars,
        level: levelInfo.level,
        rating: Math.max(0, prev.rating + result.ratingChange),
        matchesPlayed: prev.matchesPlayed + 1,
        matchesWon: result.won ? prev.matchesWon + 1 : prev.matchesWon,
        chests: updatedChests
      };
    });
  };

  // --- Render Helpers ---

  const renderContent = () => {
    switch (screen) {
      case 'HOME':
        return <Home user={user} onNavigate={(s) => {
           audioManager.playSFX('click');
           if (s === 'MODE_SELECT_SOLO') setScreen('MODE_SELECT');
           else if (s === 'MODE_SELECT_BATTLE') setScreen('GAME_LOBBY');
           else if (s === 'FRIENDS') setScreen('SOCIAL_HUB');
           else setScreen(s);
        }} onUpdateUser={setUser} />;
      
      case 'STORE':
        return <Store user={user} onUpdateUser={setUser} onNavigate={setScreen} />;

      case 'SOCIAL_HUB':
        return <SocialHub user={user} onUpdateUser={setUser} onNavigate={setScreen} />;

      case 'TEAM_LOBBY':
        return <TeamLobby user={user} onExit={() => setScreen('SOCIAL_HUB')} onStartMatch={startTeamBattle} />;

      case 'TEAM_BATTLE':
        if(activeGameConfig?.isTeam) {
            return <TeamBattle 
                user={user} 
                tierAmount={activeGameConfig.entryFee} 
                rewardGems={(activeGameConfig as any).rewardGems}
                difficulty={activeGameConfig.difficulty || "Expert"} 
                onGameEnd={handleGameEnd} 
            />;
        }
        return <div>Error: Invalid Team Config</div>;

      case 'PASS_N_PLAY':
        return <PassNPlay onGameEnd={handleGameEnd} onExit={() => setScreen('HOME')} />;

      case 'MODE_SELECT':
        return (
          <div className="flex-1 p-6 flex flex-col items-center justify-center space-y-8 animate-fade-in">
             <div className="text-center space-y-2">
                <h2 className="text-3xl font-orbitron text-cyan-400 uppercase tracking-widest">Solo Challenge</h2>
                <p className="text-gray-400">Select your intellectual threat level.</p>
             </div>
            
            <div className="grid grid-cols-1 w-full max-w-md gap-6">
               <div onClick={() => startSoloGame('Beginner')} className="group cursor-pointer bg-slate-900/50 border border-green-500/30 hover:border-green-400 p-6 rounded-xl transition-all hover:bg-slate-800/80 flex items-center justify-between">
                 <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-green-500/10 text-green-400 group-hover:scale-110 transition-transform"><Zap size={24} /></div>
                    <div><h3 className="text-xl font-orbitron text-white">Beginner</h3><p className="text-xs text-gray-500">Warm up your neurons.</p></div>
                 </div>
               </div>
               <div onClick={() => startSoloGame('Intermediate')} className="group cursor-pointer bg-slate-900/50 border border-yellow-500/30 hover:border-yellow-400 p-6 rounded-xl transition-all hover:bg-slate-800/80 flex items-center justify-between">
                 <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-yellow-500/10 text-yellow-400 group-hover:scale-110 transition-transform"><Trophy size={24} /></div>
                    <div><h3 className="text-xl font-orbitron text-white">Intermediate</h3><p className="text-xs text-gray-500">Standard competitive level.</p></div>
                 </div>
               </div>
               <div onClick={() => startSoloGame('Expert')} className="group cursor-pointer bg-slate-900/50 border border-red-500/30 hover:border-red-400 p-6 rounded-xl transition-all hover:bg-slate-800/80 flex items-center justify-between">
                 <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-red-500/10 text-red-400 group-hover:scale-110 transition-transform"><ShieldAlert size={24} /></div>
                    <div><h3 className="text-xl font-orbitron text-white">Expert</h3><p className="text-xs text-gray-500">High IQ required. Extreme mix.</p></div>
                 </div>
               </div>
            </div>
          </div>
        );

      case 'GAME_LOBBY':
        if (activeGameConfig?.entryFee && !activeGameConfig.isTeam) {
          return (
            <BattleGame 
               user={user} 
               entryFee={activeGameConfig.entryFee} 
               difficulty={activeGameConfig.difficulty || 'Intermediate'} 
               questionCount={activeGameConfig.questionCount || 20}
               onGameEnd={handleGameEnd} 
            />
          );
        }
        return (
           <div className="flex-1 flex flex-col items-center justify-center w-full animate-fade-in overflow-hidden">
            <div className="text-center space-y-2 mb-8 px-6 mt-4">
              <h2 className="text-3xl font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 uppercase tracking-widest drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">Battle Destinations</h2>
              <p className="text-gray-400">Slide to choose your battlefield.</p>
            </div>
            <div className="w-full flex overflow-x-auto snap-x snap-mandatory gap-6 px-8 py-8 pb-12 items-center no-scrollbar" style={{ scrollBehavior: 'smooth' }}>
               {ENTRY_FEES.map((tier) => {
                 const isLocked = user.coins < tier.amount;
                 return (
                   <div key={tier.amount} onClick={() => !isLocked && startBattleGame(tier.amount, tier.difficulty, tier.questionCount || 20)} className={`relative flex-shrink-0 w-[280px] md:w-[320px] h-[450px] rounded-3xl snap-center transition-all duration-500 transform ${isLocked ? 'cursor-not-allowed scale-95 opacity-80' : 'cursor-pointer hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]'} border-2 ${isLocked ? 'border-red-900/30' : 'border-white/20 hover:border-cyan-400'} group overflow-hidden bg-slate-900`}>
                     <div className="absolute inset-0 z-0"><img src={tier.img} alt={tier.label} className={`w-full h-full object-cover transition-all duration-700 ${isLocked ? 'grayscale blur-[3px] opacity-40' : 'saturate-150 contrast-125 group-hover:scale-110'}`}/><div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div></div>
                     <div className="relative z-10 flex flex-col justify-between h-full p-6">
                        <div className="flex justify-between items-start">
                           <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border backdrop-blur-md ${tier.difficulty === 'Master' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400' : tier.difficulty === 'Expert' ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-cyan-500/20 border-cyan-500 text-cyan-400'}`}>{tier.difficulty}</div>
                           <div className="text-3xl filter drop-shadow-lg">{tier.icon}</div>
                        </div>
                        <div className="space-y-3">
                           <h3 className="text-2xl font-black font-orbitron text-white leading-none drop-shadow-md">{tier.label.split(' ').map((word, i) => (<span key={i} className="block">{word}</span>))}</h3>
                           <div className={`p-3 rounded-xl border backdrop-blur-md flex items-center justify-between ${isLocked ? 'bg-red-900/20 border-red-500/50' : 'bg-white/10 border-white/20'}`}>
                              <div className="flex flex-col"><span className="text-[10px] uppercase text-gray-300">Entry Fee</span><div className={`text-xl font-bold font-rajdhani flex items-center gap-1 ${isLocked ? 'text-red-500' : 'text-yellow-400'}`}><Zap size={16} className={isLocked ? 'text-red-500' : 'text-yellow-400'} fill="currentColor"/>{tier.amount.toLocaleString()}</div></div>
                              <div className="flex flex-col items-end"><span className="text-[10px] uppercase text-gray-300">Target</span><span className="text-xl font-bold font-rajdhani text-white">{tier.questionCount && tier.questionCount > 1000 ? '∞' : tier.questionCount} Qs</span></div>
                           </div>
                           {isLocked && (<div className="text-center"><span className="text-red-500 text-xs font-bold uppercase tracking-widest animate-pulse">Insufficient Funds</span></div>)}
                        </div>
                     </div>
                   </div>
                 );
               })}
               <div className="w-4 flex-shrink-0"></div>
            </div>
          </div>
        );

      case 'GAME_PLAY':
        if (activeGameConfig?.difficulty) {
           return <SoloGame user={user} category="Mixed" difficulty={activeGameConfig.difficulty} onGameEnd={handleGameEnd} onExit={() => { audioManager.playSFX('click'); setScreen('HOME'); }} />;
        }
        return <div>Invalid Game Config</div>;

      case 'GAME_RESULT':
         const rankInfo = calculateRank(user.stars);
         const levelInfo = calculateLevel(user.exp);
         return (
           <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6 animate-fade-in relative overflow-hidden">
             <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[300px] max-h-[300px] rounded-full blur-[100px] opacity-30 ${lastResult?.won ? 'bg-yellow-500' : 'bg-red-500'}`}></div>

             <div className="text-center relative z-10">
               {lastResult?.winnerName ? (
                 <div className="mb-4 text-center"><Trophy size={64} className="text-purple-400 mx-auto mb-2" /><h2 className="text-3xl font-orbitron text-purple-200 uppercase">{lastResult.winnerName} WINS!</h2></div>
               ) : (
                  <>
                  {lastResult?.won ? <Crown size={64} className="text-yellow-400 mx-auto mb-4 animate-bounce" /> : <ShieldAlert size={64} className="text-gray-500 mx-auto mb-4" />}
                  <h1 className={`text-6xl font-black font-orbitron tracking-tighter ${lastResult?.won ? 'text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600' : 'text-gray-400'}`}>{lastResult?.won ? 'VICTORY' : 'COMPLETE'}</h1>
                  {lastResult?.isTeamMatch && <div className="text-cyan-400 font-bold uppercase tracking-widest mt-2">Team Battle</div>}
                  </>
               )}
               <p className="text-2xl mt-4 font-rajdhani text-white">Score: <span className="text-cyan-400 font-bold">{lastResult?.score}</span></p>
             </div>

             <div className="grid grid-cols-2 gap-4 w-full max-w-sm relative z-10">
               <div className="bg-slate-900/80 border border-white/10 p-6 rounded-2xl text-center">
                 <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Earnings</div>
                 <div className="text-3xl font-bold text-yellow-400 flex justify-center items-center gap-2">+{lastResult?.coinsEarned} <span className="text-sm">🪙</span></div>
               </div>
               <div className="bg-slate-900/80 border border-white/10 p-6 rounded-2xl text-center relative overflow-hidden">
                 <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">EXP</div>
                 <div className="text-3xl font-bold text-cyan-400">+{lastResult?.expEarned}</div>
                 <div className="mt-2 text-[10px] text-cyan-200 flex justify-between"><span>Lvl {levelInfo.level}</span><span>{Math.floor(levelInfo.currentLevelExp)} / {levelInfo.expRequired}</span></div>
                 <div className="mt-1 h-1 w-full bg-gray-800 rounded-full"><div className="h-full bg-cyan-500" style={{ width: `${levelInfo.progress}%` }}></div></div>
               </div>
             </div>
             
             {/* Chest Reward Display */}
             {lastResult?.chestEarned && (
                 <div className="bg-gradient-to-br from-amber-700/50 to-yellow-900/50 p-4 rounded-xl border border-yellow-500/30 flex flex-col items-center animate-pulse relative z-10 w-full max-w-sm">
                     <Gift size={32} className="text-yellow-400 mb-2" />
                     <span className="text-yellow-200 font-bold uppercase">{lastResult.chestEarned} Chest Acquired!</span>
                     <div className="text-xs text-yellow-500 mt-2">Placed in empty slot</div>
                 </div>
             )}
             {!lastResult?.chestEarned && activeGameConfig?.entryFee && !activeGameConfig.isTeam && lastResult?.won && (
                 <div className="text-xs text-red-400 uppercase tracking-widest mt-2 font-bold">Chest Slots Full!</div>
             )}


             {lastResult?.starsEarned !== undefined && lastResult.starsEarned > 0 && (
                <div className="w-full max-w-sm bg-slate-800/50 p-4 rounded-xl border border-white/5 relative z-10 flex flex-col items-center">
                   <span className="text-xs uppercase text-gray-400 tracking-widest mb-2">Rank Progress</span>
                   <div className="flex items-center space-x-1">{Array.from({length: 5}).map((_, i) => (<Star key={i} size={24} className={i < rankInfo.currentStars ? `${rankInfo.color} fill-current animate-pulse` : 'text-gray-700'} />))}</div>
                   <span className={`text-sm font-bold mt-2 ${rankInfo.color}`}>{rankInfo.tier} {rankInfo.stage}</span>
                </div>
             )}

             <Button variant="primary" size="lg" glow onClick={() => { audioManager.playSFX('click'); setScreen('HOME'); }} className="w-full max-w-xs relative z-10">Return to Base</Button>
           </div>
         );
      
      case 'LEADERBOARD':
        return <Leaderboard user={user} onNavigate={setScreen} />;

      case 'TOURNAMENTS':
        return <Tournaments user={user} onNavigate={setScreen} />;

      case 'SETTINGS':
        return (
          <div className="flex-1 p-6">
            <h2 className="text-2xl font-orbitron text-gray-200 mb-8 border-b border-white/10 pb-4">Settings</h2>
            <div className="space-y-8">
               <div>
                 <label className="block text-gray-500 mb-3 text-sm uppercase tracking-wider">Language</label>
                 <div className="grid grid-cols-3 gap-3">
                   {['en', 'hi', 'bn'].map(l => (
                     <button key={l} onClick={() => { audioManager.playSFX('click'); setUser({...user, language: l as Language}); }} className={`px-4 py-3 rounded-lg font-bold border transition-all ${user.language === l ? 'bg-cyan-600 text-white border-cyan-400 shadow-[0_0_10px_rgba(8,145,178,0.5)]' : 'bg-slate-900 text-gray-400 border-white/10 hover:border-white/30'}`}>{l === 'en' ? 'English' : l === 'hi' ? 'Hindi' : 'Bengali'}</button>
                   ))}
                 </div>
               </div>
               <div>
                   <label className="block text-gray-500 mb-3 text-sm uppercase tracking-wider">Operative Name</label>
                   <input type="text" value={user.name} onChange={(e) => setUser({...user, name: e.target.value})} className="bg-slate-900 border border-white/10 focus:border-cyan-500 p-4 rounded-lg w-full text-white outline-none font-rajdhani text-lg" />
               </div>
               
               <div className="pt-8"><Button variant="danger" className="w-full" onClick={() => { audioManager.playSFX('click'); if(confirm("Are you sure you want to wipe your progress?")) { localStorage.removeItem('brain_arena_user'); window.location.reload(); }}}>Factory Reset Profile</Button></div>
            </div>
          </div>
        );

      default:
        return <div className="flex-1 flex items-center justify-center text-gray-500">Feature coming soon...</div>;
    }
  };

  return (
    <Layout>
      <Header user={user} onProfileClick={() => { audioManager.playSFX('click'); setScreen('SETTINGS'); }} />
      {screen !== 'HOME' && screen !== 'GAME_PLAY' && screen !== 'GAME_RESULT' && screen !== 'GAME_LOBBY' && screen !== 'PASS_N_PLAY' && screen !== 'TEAM_BATTLE' && screen !== 'TEAM_LOBBY' && (
         <div className="px-6 py-4">
           <button onClick={() => { audioManager.playSFX('click'); setScreen('HOME'); }} className="text-gray-400 flex items-center hover:text-white transition-colors"><ArrowLeft size={20} className="mr-2" /> <span className="text-sm font-bold tracking-widest uppercase">Back</span></button>
         </div>
      )}
      {renderContent()}
    </Layout>
  );
};

export default App;
