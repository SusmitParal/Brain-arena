import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, ArrowRight, Zap } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface WelcomeScreenProps {
  onComplete: (name: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [micGranted, setMicGranted] = useState(false);

  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  useEffect(() => {
    const handleInteraction = () => {
      soundManager.handleFirstInteraction();
      document.removeEventListener('click', handleInteraction);
    };
    document.addEventListener('click', handleInteraction);
    return () => {
      document.removeEventListener('click', handleInteraction);
    };
  }, []);

  const generateFriendCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleRequestMic = async () => {
    soundManager.playSfx('click');
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicGranted(true);
    } catch (err) {
      console.error("Mic access denied", err);
      // Proceed anyway or show error
      setMicGranted(true); // Allow them to proceed even if denied
    }
  };

  const handleContinue = () => {
    soundManager.playSfx('click');
    if (name.trim().length > 0) {
      onComplete(name.trim());
    }
  };



  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
        <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[120px]" />
        <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[120px]" />
      </div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 rounded-[2.5rem] w-full max-w-md z-10 relative overflow-hidden border border-white/10 shadow-2xl"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-shine" />
        <h1 className="text-5xl font-black italic tracking-tighter uppercase mb-2 text-center text-transparent bg-clip-text bg-gradient-to-b from-white to-blue-200 font-display drop-shadow-lg">BRAIN ARENA</h1>
        <p className="text-center text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-8">Pro Championship</p>
        
        <div className="mb-6">
          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Initialize Profile</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:border-blue-500 transition-all focus:neon-glow-blue placeholder-gray-600"
            placeholder="Enter Pilot Name..."
            maxLength={15}
          />
        </div>

        <div className="mb-8">
          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Comms Authorization</label>
          <p className="text-xs text-gray-500 mb-4 font-medium">Microphone access is required for real-time tactical team voice chat.</p>
          <button 
            onClick={handleRequestMic}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black transition-all uppercase tracking-widest text-xs ${micGranted ? 'bg-emerald-600 text-white neon-glow-green shadow-lg shadow-emerald-500/20' : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'}`}
          >
            <Mic size={16} />
            {micGranted ? 'Comms Active' : 'Enable Voice Comms'}
          </button>
        </div>

        <button 
          onClick={handleContinue}
          disabled={name.trim().length === 0}
          className="w-full bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-5 rounded-2xl transition-all shadow-lg shadow-blue-500/30 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-widest italic group"
        >
          Enter Arena <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>

      {/* Powered By */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute bottom-6 text-center z-10"
      >
        <div className="flex items-center gap-2 justify-center opacity-60 scale-90">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Powered By</p>
          <Zap size={12} className="text-yellow-400 fill-yellow-400" />
          <div className="text-sm font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 font-display">
            ATHER-X PRO
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
