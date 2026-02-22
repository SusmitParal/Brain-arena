import React from 'react';
import { motion } from 'framer-motion';
import { User, Swords, Users, Tv, Store, Settings, Trophy, Gift, Target, Box, Home as HomeIcon, HelpCircle } from 'lucide-react';
import PlayerHeader from '../components/PlayerHeader';
import { ScreenState } from '../types';

const Home: React.FC<{ onNavigate: (screen: ScreenState) => void }> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col overflow-hidden">
      {/* Top Bar */}
      <PlayerHeader />

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col items-center w-full px-4 pt-2 pb-20 overflow-y-auto">
        
        {/* Promo Banners Row */}
        <div className="w-full max-w-md flex justify-between gap-2 mb-6">
          <PromoButton icon={<Gift size={18} />} label="Free Rewards" subLabel="Collect Now!" color="bg-orange-600" />
          <PromoButton icon={<HelpCircle size={18} />} label="Lucky Question" subLabel="Win 20 Gems!" color="bg-red-700" />
          <PromoButton icon={<Trophy size={18} />} label="Leaderboards" subLabel="Ends in 2d" color="bg-yellow-600" />
        </div>

        {/* Game Logo */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full"></div>
          <h1 className="relative text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-blue-600 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] transform -rotate-2">
            BRAIN<br/>ARENA
          </h1>
        </div>

        {/* Game Modes Stack */}
        <div className="w-full max-w-md flex flex-col gap-4 mb-8">
          {/* Solo Climb (Blue Theme) */}
          <GameModeCard 
            title="Solo Climb" 
            subtitle="Infinite Trivia"
            icon={<User size={32} className="text-white" />}
            gradient="from-cyan-500 to-blue-700"
            borderColor="border-cyan-400"
            onClick={() => onNavigate('SOLO_LOBBY')}
            delay={0.1}
          />

          {/* Global Clash (Green Theme) - Renamed from World Tour */}
          <GameModeCard 
            title="Global Clash" 
            subtitle="PvP Arena"
            icon={<Swords size={32} className="text-white" />}
            gradient="from-emerald-500 to-green-700"
            borderColor="border-emerald-400"
            onClick={() => onNavigate('PVP_LOBBY')}
            delay={0.2}
          />

          {/* Team Battle (Orange Theme) */}
          <GameModeCard 
            title="Team Battle" 
            subtitle="5v5 Match"
            icon={<Users size={32} className="text-white" />}
            gradient="from-orange-400 to-red-600"
            borderColor="border-orange-300"
            onClick={() => onNavigate('TEAM_LOBBY')}
            delay={0.3}
          />
        </div>

        {/* Chest Slots Panel */}
        <div className="w-full max-w-md bg-black/40 rounded-3xl border border-white/10 p-4 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-2 px-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Chest Slots</span>
            {/* Removed Unlock All button */}
          </div>
          <div className="grid grid-cols-4 gap-3">
            <ChestSlot status="UNLOCKING" tier="Silver" time="10s" />
            <ChestSlot status="LOCKED" tier="Gold" />
            <ChestSlot status="LOCKED" tier="Platinum" />
            <ChestSlot status="EMPTY" />
          </div>
        </div>

      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 w-full bg-gray-900/95 backdrop-blur-md border-t border-white/10 pb-4 pt-2 px-6 flex justify-between items-end z-50">
        <NavIcon icon={<HomeIcon />} label="Home" active onClick={() => onNavigate('HOME')} />
        <NavIcon icon={<Users />} label="Friends" onClick={() => {}} />
        <NavIcon icon={<Store />} label="Shop" onClick={() => onNavigate('SHOP')} />
        <NavIcon icon={<Trophy />} label="Events" onClick={() => onNavigate('LEADERBOARD')} />
        <NavIcon icon={<Settings />} label="Settings" onClick={() => onNavigate('SETTINGS')} />
      </nav>
    </div>
  );
};

// --- Sub-Components ---

const PromoButton: React.FC<{ icon: React.ReactNode, label: string, subLabel?: string, color: string }> = ({ icon, label, subLabel, color }) => (
  <motion.button 
    whileTap={{ scale: 0.95 }}
    className={`flex-1 ${color} rounded-xl p-2 flex flex-col items-center justify-center border-b-4 border-black/20 shadow-lg relative overflow-hidden`}
  >
    <div className="absolute top-0 right-0 p-1 opacity-20 text-white">{icon}</div>
    <span className="text-[10px] font-bold text-white leading-tight text-center">{label}</span>
    {subLabel && <span className="text-[8px] font-bold text-yellow-200 leading-tight">{subLabel}</span>}
  </motion.button>
);

const GameModeCard: React.FC<{ title: string, subtitle: string, icon: React.ReactNode, gradient: string, borderColor: string, onClick: () => void, delay: number }> = ({ title, subtitle, icon, gradient, borderColor, onClick, delay }) => (
  <motion.button
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, type: 'spring' }}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full h-20 rounded-2xl bg-gradient-to-r ${gradient} p-0.5 shadow-xl relative group overflow-hidden`}
  >
    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    <div className={`h-full w-full rounded-2xl border-2 ${borderColor} flex items-center justify-between px-6 relative z-10`}>
      <div className="flex flex-col items-start">
        <h3 className="text-2xl font-black text-white italic tracking-wide drop-shadow-md">{title}</h3>
        <span className="text-xs font-bold text-white/80 uppercase tracking-wider">{subtitle}</span>
      </div>
      <div className="bg-black/20 p-3 rounded-full border border-white/20 shadow-inner backdrop-blur-sm">
        {icon}
      </div>
    </div>
    {/* Shine effect */}
    <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 group-hover:animate-shine" />
  </motion.button>
);

const ChestSlot: React.FC<{ status: 'EMPTY' | 'LOCKED' | 'UNLOCKING' | 'READY', tier?: string, time?: string }> = ({ status, tier, time }) => {
  const isSlotEmpty = status === 'EMPTY';
  
  // Chest Visual Styles
  const getChestStyle = (tier?: string) => {
    switch (tier) {
      case 'Bronze': return 'bg-gradient-to-br from-orange-700 to-orange-900 border-orange-500 shadow-orange-900/50';
      case 'Silver': return 'bg-gradient-to-br from-gray-300 to-gray-500 border-gray-200 shadow-gray-500/50';
      case 'Gold': return 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-300 shadow-yellow-500/50';
      case 'Platinum': return 'bg-gradient-to-br from-cyan-400 to-blue-600 border-cyan-300 shadow-cyan-500/50';
      default: return 'bg-gray-700 border-gray-600';
    }
  };

  const chestColor = getChestStyle(tier);

  return (
    <div className={`aspect-[3/4] rounded-xl border-2 flex flex-col items-center justify-center relative overflow-hidden shadow-lg transition-all ${isSlotEmpty ? 'bg-black/20 border-white/5 border-dashed shadow-inner' : `${chestColor} border-b-4`}`}>
      {isSlotEmpty ? (
        <span className="text-[10px] font-bold text-gray-600 text-center px-2">Chest Slot</span>
      ) : (
        <>
          <div className="relative">
             <Box className={`mb-1 drop-shadow-md ${tier === 'Silver' ? 'text-gray-800' : 'text-white'}`} size={32} strokeWidth={1.5} />
             {/* Shiny glint */}
             <div className="absolute top-0 right-0 w-2 h-2 bg-white rounded-full blur-[1px] opacity-70"></div>
          </div>
          
          <span className={`text-[10px] font-black uppercase mt-1 drop-shadow-md ${tier === 'Silver' ? 'text-gray-800' : 'text-white'}`}>{status}</span>
          
          {time && (
            <div className="bg-black/60 px-2 py-0.5 rounded-full mt-1 border border-white/20">
              <span className="text-[10px] font-mono text-yellow-400 font-bold">{time}</span>
            </div>
          )}
          
          {status === 'UNLOCKING' && (
            <div className="absolute bottom-0 left-0 h-1 bg-green-400 w-full animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)]"></div>
          )}
        </>
      )}
    </div>
  );
};

const NavIcon: React.FC<{ icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 ${active ? 'text-yellow-400' : 'text-gray-400 hover:text-gray-200'}`}>
    <div className={`p-1 rounded-xl ${active ? 'bg-yellow-400/10' : ''}`}>
      {React.cloneElement(icon as React.ReactElement, { size: 24, strokeWidth: active ? 3 : 2 })}
    </div>
    <span className="text-[10px] font-bold">{label}</span>
  </button>
);

export default Home;

