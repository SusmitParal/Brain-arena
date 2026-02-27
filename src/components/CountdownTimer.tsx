import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  targetDate?: string;
  onComplete?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!targetDate) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const distance = target - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft('');
        if (onComplete) onComplete();
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  if (!targetDate || !timeLeft) return null;

  return (
    <div className="flex items-center gap-1.5 text-sm font-mono text-orange-400 bg-black/30 px-3 py-1.5 rounded-full border border-orange-500/30 shadow-md">
      <Clock size={14} className="text-orange-400" />
      <span>{timeLeft}</span>
    </div>
  );
};

export default CountdownTimer;
