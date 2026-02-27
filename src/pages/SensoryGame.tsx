import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, Modality } from '@google/genai';
import { UserProfile } from '../types';
import { soundManager } from '../utils/audio';
import { Clock, Check, X, Activity, Volume2, Image as ImageIcon } from 'lucide-react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

interface SensoryGameProps {
  user: UserProfile;
  onComplete: (score: number, gems: number) => void;
  onExit: () => void;
}

interface SensoryQuestion {
  id: string;
  type: 'audio' | 'image';
  target: string;
  options: string[];
  answer: string;
  mediaBase64?: string;
}

const SensoryGame: React.FC<SensoryGameProps> = ({ user, onComplete, onExit }) => {
  const [questions, setQuestions] = useState<SensoryQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gemsWon, setGemsWon] = useState(0);
  const [loading, setLoading] = useState(true);
  const [decrypting, setDecrypting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    fetchQuestionsList();
    return () => stopAudio();
  }, []);

  const stopAudio = () => {
    if (sourceRef.current) {
      try { sourceRef.current.stop(); } catch (e) {}
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
  };

  const fetchQuestionsList = async () => {
    try {
      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: 'Generate 4 multimodal trivia challenges. 2 of type "audio" (famous movie quotes), 2 of type "image" (famous global landmarks). Return JSON array with keys: type ("audio" or "image"), target (the quote text or the landmark name), options (array of 4 choices, for audio it is the movie name, for image it is the landmark name), answer (the correct option).',
      });
      const text = result.text;
      if (!text) throw new Error("Empty response");
      
      const parsed = JSON.parse(text.replace(/```json|```/g, ''));
      if (Array.isArray(parsed)) {
        setQuestions(parsed);
        setLoading(false);
        loadMediaForQuestion(parsed[0]);
      } else {
        throw new Error("Invalid format");
      }
    } catch (e) {
      console.error(e);
      // Fallback
      const fallback: SensoryQuestion[] = [
        { id: '1', type: 'audio', target: "May the force be with you.", options: ["Star Wars", "Star Trek", "Harry Potter", "The Matrix"], answer: "Star Wars" },
        { id: '2', type: 'image', target: "Eiffel Tower", options: ["Eiffel Tower", "Big Ben", "Statue of Liberty", "Colosseum"], answer: "Eiffel Tower" }
      ];
      setQuestions(fallback);
      setLoading(false);
      loadMediaForQuestion(fallback[0]);
    }
  };

  const loadMediaForQuestion = async (q: SensoryQuestion) => {
    setDecrypting(true);
    try {
      if (q.type === 'audio') {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash-preview-tts",
          contents: [{ parts: [{ text: q.target }] }],
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          },
        });
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          q.mediaBase64 = base64Audio;
        }
      } else if (q.type === 'image') {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [{ text: `A clear, high-quality photo of ${q.target}` }] },
        });
        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            q.mediaBase64 = part.inlineData.data;
            break;
          }
        }
      }
    } catch (e) {
      console.error("Failed to load media", e);
    }
    
    setDecrypting(false);
    setTimeLeft(15);
    setIsAnswered(false);
    setSelectedOption(null);
    
    if (q.type === 'audio' && q.mediaBase64) {
      playDistortedAudio(q.mediaBase64);
    }
  };

  const playDistortedAudio = async (base64Audio: string) => {
    stopAudio();
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioCtxRef.current = audioCtx;
    
    const binaryString = window.atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const audioBuffer = await audioCtx.decodeAudioData(bytes.buffer);
    const source = audioCtx.createBufferSource();
    
    // Reverse the audio
    for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
      Array.prototype.reverse.call(audioBuffer.getChannelData(i));
    }
    
    source.buffer = audioBuffer;
    source.playbackRate.value = 1.2; // slightly faster and reversed
    source.connect(audioCtx.destination);
    source.start();
    sourceRef.current = source;
  };

  useEffect(() => {
    if (loading || decrypting || isAnswered || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, decrypting, isAnswered, gameOver, currentQuestionIndex]);

  const handleTimeUp = () => {
    setIsAnswered(true);
    stopAudio();
    soundManager.playSfx('wrong');
    setTimeout(nextQuestion, 3000);
  };

  const handleAnswer = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);
    stopAudio();

    if (option === questions[currentQuestionIndex].answer) {
      soundManager.playSfx('win');
      const points = 100 + (timeLeft * 10);
      setScore(prev => prev + points);
      if (timeLeft >= 10) {
        setGemsWon(prev => prev + 1); // Premium reward for fast answer
      }
    } else {
      soundManager.playSfx('wrong');
    }

    setTimeout(nextQuestion, 3000);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIdx);
      loadMediaForQuestion(questions[nextIdx]);
    } else {
      setGameOver(true);
      onComplete(score, gemsWon);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Activity size={48} className="text-emerald-500 animate-pulse mx-auto mb-4" />
          <p className="font-black uppercase tracking-widest text-emerald-500 animate-pulse">Initializing Anomaly...</p>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md w-full gpu"
        >
          <Activity size={80} className="text-emerald-400 mx-auto mb-6 drop-shadow-[0_0_30px_rgba(52,211,153,0.6)]" />
          <h1 className="text-5xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-b from-emerald-300 to-emerald-600 mb-2 font-display">Sequence Complete</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-8">Anomaly Contained</p>
          
          <div className="bg-white/5 border border-emerald-500/20 p-8 rounded-3xl backdrop-blur-md mb-8">
            <div className="text-6xl font-black text-white mb-2">{score}</div>
            <div className="text-emerald-400 font-black uppercase tracking-widest text-xs mb-4">Total Score</div>
            {gemsWon > 0 && (
                <div className="text-pink-400 font-black uppercase tracking-widest text-sm">+{gemsWon} Premium Gems (Speed Bonus)</div>
            )}
          </div>

          <button
            onClick={onExit}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black py-4 rounded-2xl text-xl uppercase tracking-widest italic shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
          >
            Claim Rewards
          </button>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-black to-black pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-center mb-8 relative z-10">
        <div className="flex items-center gap-2">
           <div className="bg-emerald-500/20 p-2 rounded-lg border border-emerald-500/30">
             <Activity size={20} className="text-emerald-400" />
           </div>
           <span className="font-black uppercase tracking-widest text-xs text-emerald-400">The Anomaly</span>
        </div>
        <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
          <Clock size={16} className={`${timeLeft < 5 ? 'text-red-500 animate-pulse' : 'text-gray-400'}`} />
          <span className={`font-mono font-bold ${timeLeft < 5 ? 'text-red-500' : 'text-white'}`}>{timeLeft}s</span>
        </div>
      </div>

      {/* Progress */}
      <div className="w-full h-1 bg-gray-800 rounded-full mb-8 relative z-10">
        <motion.div 
          className="h-full bg-emerald-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="flex-grow flex flex-col justify-center max-w-2xl mx-auto w-full relative z-10">
        {decrypting ? (
            <div className="text-center py-20">
                <Activity size={48} className="text-emerald-500 animate-pulse mx-auto mb-4" />
                <p className="font-black uppercase tracking-widest text-emerald-500 animate-pulse">Decrypting Signal...</p>
            </div>
        ) : (
            <>
                <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8 text-center gpu"
                >
                <span className="inline-block bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-4 border border-emerald-500/20">
                    {currentQuestion.type === 'audio' ? 'Audio-Morph' : 'Thermal Map'}
                </span>
                
                {currentQuestion.type === 'audio' && (
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-6 flex flex-col items-center justify-center">
                        <Volume2 size={64} className="text-emerald-400 animate-pulse mb-4" />
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Identify the frequency</p>
                    </div>
                )}

                {currentQuestion.type === 'image' && currentQuestion.mediaBase64 && (
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-4 mb-6 flex flex-col items-center justify-center overflow-hidden gpu">
                        <img 
                            src={`data:image/jpeg;base64,${currentQuestion.mediaBase64}`} 
                            alt="Thermal Map"
                            className="w-full max-w-sm rounded-2xl gpu"
                            style={{
                                filter: `hue-rotate(${timeLeft * 20}deg) saturate(${1 + timeLeft/3}) blur(${timeLeft/3}px) contrast(${1 + timeLeft/10})`,
                                transition: 'filter 1s linear'
                            }}
                        />
                    </div>
                )}

                <h2 className="text-xl md:text-2xl font-black leading-tight">
                    {currentQuestion.type === 'audio' ? "Which movie is this quote from?" : "Identify this landmark."}
                </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedOption === option;
                    const isCorrect = isAnswered && option === currentQuestion.answer;
                    const isWrong = isAnswered && isSelected && option !== currentQuestion.answer;
                    
                    let buttonClass = "bg-white/5 border-white/10 hover:bg-white/10";
                    if (isCorrect) buttonClass = "bg-green-500 border-green-400 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]";
                    else if (isWrong) buttonClass = "bg-red-500 border-red-400 text-white";
                    else if (isSelected) buttonClass = "bg-emerald-500 border-emerald-400 text-white";

                    return (
                    <motion.button
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => handleAnswer(option)}
                        disabled={isAnswered}
                        className={`w-full p-4 rounded-xl border-2 font-bold text-left transition-all relative overflow-hidden group ${buttonClass}`}
                    >
                        <div className="flex justify-between items-center relative z-10">
                        <span>{option}</span>
                        {isCorrect && <Check size={20} />}
                        {isWrong && <X size={20} />}
                        </div>
                    </motion.button>
                    );
                })}
                </div>
            </>
        )}
      </div>
    </div>
  );
};

export default SensoryGame;
