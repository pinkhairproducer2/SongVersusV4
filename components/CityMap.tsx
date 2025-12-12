
import React, { useState, useEffect } from 'react';
import { Territory } from '../types';
import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTerritories } from '../services/firebase';

const DEFAULT_TERRITORIES: Territory[] = [
  { id: 't1', name: 'Trap District', genre: 'Trap', control: 'Unclaimed', color: '#FF2D95', battleCount: 0 },
  { id: 't2', name: 'Boom Bap Block', genre: 'Hip Hop', control: 'Unclaimed', color: '#FFD24C', battleCount: 0 },
  { id: 't3', name: 'Cyber Pop Plaza', genre: 'Pop', control: 'Unclaimed', color: '#00E5FF', battleCount: 0 },
  { id: 't4', name: 'Riff Row', genre: 'Rock', control: 'Unclaimed', color: '#EF4444', battleCount: 0 },
];

const CityMap: React.FC = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [territories, setTerritories] = useState<Territory[]>(DEFAULT_TERRITORIES);

  useEffect(() => {
    const loadTerritories = async () => {
      try {
        const data = await getTerritories();
        if (data.length > 0) {
          setTerritories(data);
        }
      } catch (error) {
        console.error('Error loading territories:', error);
      }
    };
    loadTerritories();
  }, []);

  const activeTerritory = territories.find(t => t.id === (hovered || selected));

  const paths = {
    t1: "M 50 150 L 150 100 L 250 150 L 200 250 L 100 250 Z",
    t2: "M 260 140 L 400 80 L 450 180 L 350 240 L 260 140 Z",
    t3: "M 180 260 L 340 250 L 420 350 L 250 420 L 180 260 Z",
    t4: "M 420 70 L 550 50 L 580 150 L 460 170 Z"
  };

  return (
    <div className="relative w-full aspect-video bg-black/40 border border-white/10 rounded-lg overflow-hidden backdrop-blur-sm group">
      
      <svg viewBox="0 0 600 450" className="w-full h-full drop-shadow-2xl">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" />

        <g style={{ transform: 'scale(1)', transformOrigin: 'center' }}>
          {territories.map((t) => (
            <path
              key={t.id}
              d={(paths as any)[t.id]}
              fill={hovered === t.id ? t.color : `${t.color}33`}
              stroke={t.color}
              strokeWidth={hovered === t.id ? 3 : 1}
              className="transition-all duration-300 cursor-pointer hover:filter-drop-shadow"
              style={{ filter: hovered === t.id ? 'url(#glow)' : 'none' }}
              onMouseEnter={() => setHovered(t.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => {
                setSelected(t.id);
                setTimeout(() => navigate('/battles'), 600);
              }}
            />
          ))}
        </g>
      </svg>

      <AnimatePresence>
        {activeTerritory && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-6 left-6 bg-black/90 border border-white/20 p-4 rounded-md shadow-2xl backdrop-blur-md max-w-xs"
          >
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-display uppercase text-2xl tracking-widest text-white">
                    {activeTerritory.name}
                </h3>
                <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: activeTerritory.color }}></div>
            </div>
            
            <div className="space-y-2 font-mono text-xs text-gray-400">
                <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1"><Music className="w-3 h-3"/> Genre</span>
                    <span className="text-white font-bold">{activeTerritory.genre}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3"/> Controlled By</span>
                    <span className="font-bold" style={{ color: activeTerritory.color }}>{activeTerritory.control}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> Active Battles</span>
                    <span className="text-white text-lg font-hud">{activeTerritory.battleCount}</span>
                </div>
            </div>

            <button 
                onClick={() => navigate('/battles')}
                className="mt-4 w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-hud tracking-widest uppercase py-2 flex items-center justify-center gap-2 text-lg transition-all"
            >
                Enter District
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="absolute top-4 right-4 text-[10px] font-mono text-white/30 flex flex-col items-end pointer-events-none">
        <span>SECTOR: NEON-PRIME</span>
        <span>GRID: 44.2.1</span>
        <span>THREAT LVL: HIGH</span>
      </div>
    </div>
  );
};

export default CityMap;
