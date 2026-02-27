import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, UserPlus, MessageSquare, Swords, Users } from 'lucide-react';
import { UserProfile, ScreenState } from '../types';
import { soundManager } from '../utils/audio';

const Friends: React.FC<{ user: UserProfile; onBack: () => void; onNavigate: (screen: ScreenState) => void; }> = ({ user, onBack, onNavigate }) => {
  useEffect(() => {
    soundManager.playBgm('bgm_game_friends');
    return () => soundManager.stopBgm();
  }, []);

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed inset-0 bg-home text-white flex flex-col items-center p-4 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
        <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[120px]" />
        <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[120px]" />
      </div>
      <button
        onClick={() => { soundManager.playSfx('click'); onBack(); }}
        className="absolute top-4 left-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10"
      >
        <ArrowLeft size={24} className="text-white" />
      </button>
      <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-8 mt-12 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300 font-display z-10">Friends</h1>

      <div className="w-full max-w-md bg-[#1e293b]/80 backdrop-blur-xl rounded-2xl p-4 mb-6 border border-white/10 shadow-lg z-10">
        <h2 className="text-xl font-black italic tracking-tighter uppercase mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300 font-display">My Friends ({user.friends.length})</h2>
        {user.friends.length > 0 ? (
          <ul className="space-y-2">
            {user.friends.map((friend, index) => (
              <motion.li 
                key={index} 
                className="flex items-center justify-between bg-black/30 p-3 rounded-xl border border-white/10 shadow-md"
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-blue-400 shadow-md"></div>
                  <span className="font-bold text-gray-200">{friend}</span>
                </div>
                <div className="flex gap-2">
                  <motion.button whileTap={{ scale: 0.9 }} className="p-2 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg hover:from-green-700 hover:to-emerald-700 shadow-md"><Swords size={16} /></motion.button>
                  <motion.button whileTap={{ scale: 0.9 }} className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-md"><MessageSquare size={16} /></motion.button>
                </div>
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-center italic">You don't have any friends yet. Add some!</p>
        )}
      </div>

      <div className="w-full max-w-md bg-[#1e293b]/80 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-lg z-10">
        <h2 className="text-xl font-black italic tracking-tighter uppercase mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300 font-display">Add Friends</h2>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Enter Username" 
            className="flex-grow p-3 rounded-xl bg-black/30 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
          />
          <motion.button 
            onClick={() => { soundManager.playSfx('click'); alert('Friend request sent!'); }}
            className="bg-gradient-to-br from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-black py-3 px-6 rounded-xl flex items-center gap-2 uppercase tracking-wider italic shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <UserPlus size={20} /> Add
          </motion.button>
        </div>
      </div>

      <p className="text-sm text-gray-400 mt-8 z-10">Connect with players and challenge them!</p>

    </motion.div>
  );
};

export default Friends;
