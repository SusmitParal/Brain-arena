import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Zap } from 'lucide-react';

const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 4000); // Show for 4 seconds
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[100] overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      
      {/* Animated Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-[600px] h-[600px] border border-blue-500/10 rounded-full border-dashed"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute w-[800px] h-[800px] border border-purple-500/10 rounded-full border-dashed"
        />
      </div>

      {/* Logo Animation */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center"
      >
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            filter: ["drop-shadow(0 0 20px rgba(59,130,246,0.5))", "drop-shadow(0 0 40px rgba(59,130,246,0.8))", "drop-shadow(0 0 20px rgba(59,130,246,0.5))"]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="mb-8 relative"
        >
          <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
          <BrainCircuit size={120} className="text-white relative z-10" />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 border-t-4 border-blue-500/50 rounded-full"
          />
        </motion.div>

        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-100 to-blue-400 font-display mb-6 text-center drop-shadow-2xl">
          BRAIN ARENA
        </h1>
        
        <motion.div 
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "100%" }}
          transition={{ delay: 1, duration: 1 }}
          className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent w-full max-w-lg mb-6"
        />

        <motion.p 
          initial={{ opacity: 0, letterSpacing: "0em" }}
          animate={{ opacity: 1, letterSpacing: "0.3em" }}
          transition={{ delay: 1.5, duration: 1 }}
          className="text-blue-200 text-xs md:text-sm font-bold uppercase text-center max-w-lg leading-relaxed"
        >
          Take Ultimate Test To Your Intelligence
        </motion.p>
      </motion.div>

      {/* Powered By */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 0.8 }}
        className="absolute bottom-12 text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="h-px w-8 bg-gray-700"></div>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Powered By</p>
          <div className="h-px w-8 bg-gray-700"></div>
        </div>
        <div className="flex items-center gap-2 justify-center">
          <Zap size={20} className="text-yellow-400 fill-yellow-400" />
          <div className="text-2xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 font-display drop-shadow-lg">
            ATHER-X PRO
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
