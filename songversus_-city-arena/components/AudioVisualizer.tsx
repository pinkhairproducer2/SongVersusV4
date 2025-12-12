
import React, { useEffect, useRef } from 'react';
import { VisualizerType } from '../types';

interface AudioVisualizerProps {
  active: boolean;
  color: string;
  type: VisualizerType;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ active, color, type }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Convert tailwind/theme color names to hex/rgba for canvas
  const getColor = (c: string) => {
      if (c.includes('neon-pink')) return '#FF2D95';
      if (c.includes('neon-cyan')) return '#00E5FF';
      if (c.includes('green')) return '#39FF14';
      if (c.includes('yellow')) return '#FFD24C';
      return '#FFFFFF';
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let bars: number[] = Array(30).fill(0);
    let phase = 0;

    const render = () => {
      // Resize
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const w = canvas.width;
      const h = canvas.height;
      const themeColor = getColor(color);

      ctx.clearRect(0, 0, w, h);

      if (active) {
          phase += 0.1;
          // Simulate Frequency Data
          bars = bars.map((b, i) => {
              const target = Math.random() * h * 0.8; 
              return b + (target - b) * 0.2; // Smooth transition
          });
      } else {
          // Flatten when paused
          bars = bars.map(b => b * 0.9);
      }

      ctx.fillStyle = themeColor;
      ctx.strokeStyle = themeColor;
      ctx.lineWidth = 2;

      if (type === 'Bars') {
          const barWidth = w / bars.length;
          const gap = 2;
          bars.forEach((barHeight, i) => {
              const x = i * barWidth;
              const y = (h - barHeight) / 2; // Center vertical
              ctx.fillRect(x + gap, y, barWidth - gap, barHeight);
              
              // Reflection
              ctx.globalAlpha = 0.2;
              ctx.fillRect(x + gap, y + barHeight + 5, barWidth - gap, barHeight * 0.5);
              ctx.globalAlpha = 1.0;
          });
      } 
      else if (type === 'Wave') {
          ctx.beginPath();
          ctx.moveTo(0, h/2);
          for (let i = 0; i < w; i += 5) {
             // Sine wave synthesis
             const activeMod = active ? 1 : 0.1;
             const y = h/2 + Math.sin(i * 0.05 + phase) * (h/3) * activeMod * Math.random();
             ctx.lineTo(i, y);
          }
          ctx.stroke();
          
          // Glow effect
          ctx.shadowBlur = 10;
          ctx.shadowColor = themeColor;
          ctx.stroke();
          ctx.shadowBlur = 0;
      }
      else if (type === 'Orb') {
           const centerX = w / 2;
           const centerY = h / 2;
           const baseRadius = h / 4;
           const beat = active ? Math.sin(phase) * 10 : 0;
           
           ctx.beginPath();
           ctx.arc(centerX, centerY, baseRadius + Math.abs(beat), 0, Math.PI * 2);
           ctx.strokeStyle = themeColor;
           ctx.stroke();

           // Particles
           if (active) {
               ctx.fillStyle = themeColor;
               for(let i=0; i<8; i++) {
                   const angle = phase + (i * (Math.PI * 2) / 8);
                   const r = baseRadius + 20 + Math.random() * 10;
                   ctx.beginPath();
                   ctx.arc(centerX + Math.cos(angle)*r, centerY + Math.sin(angle)*r, 2, 0, Math.PI*2);
                   ctx.fill();
               }
           }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [active, color, type]);

  return <canvas ref={canvasRef} className="w-full h-16 rounded opacity-80" />;
};

export default AudioVisualizer;
