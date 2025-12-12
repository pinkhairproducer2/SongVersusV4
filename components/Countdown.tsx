
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownProps {
  endsAt: number;
  minimal?: boolean;
}

const Countdown: React.FC<CountdownProps> = ({ endsAt, minimal = false }) => {
  const [timeLeft, setTimeLeft] = useState(endsAt - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(endsAt - Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, [endsAt]);

  if (timeLeft <= 0) {
    return <span className="text-red-500 font-bold uppercase">Ended</span>;
  }

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  const isUrgent = timeLeft < 1000 * 60 * 60; // Less than 1 hour

  if (minimal) {
      return (
          <span className={`font-mono tabular-nums ${isUrgent ? 'text-red-500 animate-pulse' : ''}`}>
             {days > 0 ? `${days}d ` : ''}{hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </span>
      );
  }

  return (
    <div className={`flex items-center gap-1 font-hud text-xl tracking-widest ${isUrgent ? 'text-red-500 animate-pulse' : 'text-white'}`}>
      {!minimal && <Clock className="w-4 h-4 mb-0.5" />}
      {days > 0 && <span>{days}D</span>}
      <span>{hours.toString().padStart(2, '0')}H</span>
      <span>{minutes.toString().padStart(2, '0')}M</span>
      <span className="w-8 text-center">{seconds.toString().padStart(2, '0')}S</span>
    </div>
  );
};

export default Countdown;
