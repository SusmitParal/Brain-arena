import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Globe, Volume2, Music, LogOut, Shield, User as UserIcon, Copy } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { UserProfile } from '../types';

const Settings: React.FC<{ onBack: () => void; user: UserProfile }> = ({ onBack, user }) => {
  useEffect(() => {
    soundManager.playBgm('bgm_game_settings');
    return () => soundManager.stopBgm();
  }, []);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali', flag: '🇧🇩' },
  ];

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed inset-0 bg-home text-white flex flex-col"
    >
      {/* Header */}
      <div className="bg-[#1e293b]/80 backdrop-blur-xl p-4 flex items-center gap-4 border-b border-white/5">
        <button
          onClick={() => { soundManager.playSfx('click'); onBack(); }}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300 font-display">Settings</h1>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-6">
        {/* Audio Section */}
        <section>
          <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 px-2">Audio</h2>
          <div className="bg-[#1e293b]/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/5 shadow-lg">
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <Music size={20} className="text-blue-400" />
                <span className="font-bold">Music</span>
              </div>
              <motion.button 
                className="w-12 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-1 flex items-center justify-end shadow-md"
                whileTap={{ scale: 0.95 }}
              >
                <motion.div className="w-4 h-4 bg-white rounded-full shadow-lg" layout transition={{ type: "spring", stiffness: 700, damping: 30 }}></motion.div>
              </motion.button>
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Volume2 size={20} className="text-blue-400" />
                <span className="font-bold">Sound Effects</span>
              </div>
              <motion.button 
                className="w-12 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-1 flex items-center justify-end shadow-md"
                whileTap={{ scale: 0.95 }}
              >
                <motion.div className="w-4 h-4 bg-white rounded-full shadow-lg" layout transition={{ type: "spring", stiffness: 700, damping: 30 }}></motion.div>
              </motion.button>
            </div>
          </div>
        </section>

        {/* Language Section */}
        <section>
          <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 px-2">Language</h2>
          <div className="bg-[#1e293b]/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/5 shadow-lg">
            {languages.map((lang, index) => (
              <motion.button 
                key={lang.code}
                onClick={() => soundManager.playSfx('click')}
                className={`w-full flex items-center justify-between p-4 ${index !== languages.length - 1 ? 'border-b border-white/5' : ''} hover:bg-white/5 transition-colors`}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{lang.flag}</span>
                  <span className="font-bold">{lang.name}</span>
                </div>
                {lang.code === 'en' && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>}
              </motion.button>
            ))}
          </div>
        </section>



        {/* Account Section */}
        <section>
          <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 px-2">Account</h2>
          <div className="bg-[#1e293b]/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/5 shadow-lg">
            <motion.button 
              className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors text-red-400"
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut size={20} />
              <span className="font-bold">Log Out</span>
            </motion.button>
          </div>
        </section>

        <div className="text-center pt-4">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Version 1.0.4-PRO</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
