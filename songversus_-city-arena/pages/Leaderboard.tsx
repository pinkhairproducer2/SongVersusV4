
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { ChevronUp, ChevronDown, Minus, Crown, Hexagon } from 'lucide-react';

interface LeaderboardEntry extends User {
  role: 'Artist' | 'Producer';
  points: number;
  change: 'up' | 'down' | 'same';
  peak: number;
  weeks: number;
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { id: '1', username: 'BrainGotBlaps', role: 'Producer', points: 3495, change: 'same', peak: 1, weeks: 12, coins: 50000, reputation: 124, duffles: [], rank: 'Titan', avatarUrl: 'https://picsum.photos/100/100?11' },
  { id: '2', username: 'Rasmus', role: 'Producer', points: 2329, change: 'same', peak: 2, weeks: 8, coins: 42000, reputation: 98, duffles: [], rank: 'Legend', avatarUrl: 'https://picsum.photos/100/100?12' },
  { id: '3', username: 'Lil V', role: 'Artist', points: 2291, change: 'up', peak: 3, weeks: 4, coins: 1500, reputation: 55, duffles: [], rank: 'Rookie', avatarUrl: 'https://picsum.photos/100/100?1' },
  { id: '4', username: 'Sullymon', role: 'Producer', points: 2149, change: 'down', peak: 2, weeks: 15, coins: 35000, reputation: 72, duffles: [], rank: 'Rookie', avatarUrl: 'https://picsum.photos/100/100?14' },
  { id: '5', username: 'Sik Trakz', role: 'Producer', points: 2135, change: 'same', peak: 1, weeks: 20, coins: 31000, reputation: 60, duffles: [], rank: 'Pro', avatarUrl: 'https://picsum.photos/100/100?15' },
  { id: '6', username: 'TheMystery', role: 'Artist', points: 2070, change: 'same', peak: 5, weeks: 6, coins: 2000, reputation: 45, duffles: [], rank: 'Apprentice', avatarUrl: 'https://picsum.photos/100/100?16' },
  { id: '7', username: 'pharodubs', role: 'Producer', points: 1999, change: 'up', peak: 7, weeks: 2, coins: 18000, reputation: 40, duffles: [], rank: 'Craftsman', avatarUrl: 'https://picsum.photos/100/100?17' },
  { id: '8', username: 'MC Raw', role: 'Artist', points: 1850, change: 'down', peak: 4, weeks: 10, coins: 1200, reputation: 30, duffles: [], rank: 'Rookie', avatarUrl: 'https://picsum.photos/100/100?7' },
  { id: '9', username: 'DrillK1ng', role: 'Artist', points: 1720, change: 'up', peak: 9, weeks: 1, coins: 3000, reputation: 25, duffles: [], rank: 'Rookie', avatarUrl: 'https://picsum.photos/100/100?26' },
  { id: '10', username: 'InoTech3D', role: 'Producer', points: 1650, change: 'same', peak: 8, weeks: 5, coins: 38000, reputation: 85, duffles: [], rank: 'Apprentice', avatarUrl: 'https://picsum.photos/100/100?13' },
];

const LeaderboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'ALL' | 'ARTISTS' | 'PRODUCERS'>('ALL');

  const filteredData = MOCK_LEADERBOARD.filter(user => {
    if (filter === 'ALL') return true;
    if (filter === 'ARTISTS') return user.role === 'Artist';
    if (filter === 'PRODUCERS') return user.role === 'Producer';
    return true;
  });

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-12">
      
      {/* Title Section */}
      <div className="text-center mb-12">
        <h1 className="text-6xl md:text-8xl font-display font-bold italic uppercase tracking-tighter mb-4">
          <span className="text-neon-cyan drop-shadow-[0_0_15px_rgba(0,229,255,0.5)]">SongVersus</span> 
          <span className="text-purple-500 bg-white/5 px-4 rounded-lg ml-4 border border-purple-500/30 inline-block transform -skew-x-12">100</span>
        </h1>
        <p className="text-gray-400 font-mono tracking-widest text-sm">
           GLOBAL RANKINGS // SEASON 1
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
          
          {/* Tabs */}
          <div className="flex bg-dark-800 p-1 rounded-lg border border-white/10">
              {['ARTISTS', 'PRODUCERS', 'ALL'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab as any)}
                    className={`px-8 py-2 font-display text-xl uppercase tracking-widest transition-all rounded-md ${
                        filter === tab 
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg' 
                        : 'text-gray-500 hover:text-white hover:bg-white/5'
                    }`}
                  >
                      {tab}
                  </button>
              ))}
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-4 bg-dark-800 px-6 py-2 rounded-lg border border-white/10">
              <span className="text-gray-500 font-mono text-xs uppercase">Next Update:</span>
              <span className="text-neon-cyan font-hud text-2xl tracking-widest">05H 25M 32S</span>
          </div>
      </div>

      {/* Table Header */}
      <div className="bg-dark-900 border-b border-purple-500/30 text-purple-400 font-mono text-[10px] uppercase tracking-widest grid grid-cols-12 gap-4 px-6 py-3 rounded-t-lg">
          <div className="col-span-1 text-center">Rank</div>
          <div className="col-span-5 md:col-span-4">User</div>
          <div className="col-span-3 text-right">Battle Points</div>
          <div className="col-span-1 text-center hidden md:block">Change</div>
          <div className="col-span-1 text-center hidden md:block">Peak</div>
          <div className="col-span-2 text-center hidden md:block">Weeks on Top</div>
      </div>

      {/* Table Body */}
      <div className="flex flex-col gap-2 mt-2">
          {filteredData.map((user, index) => (
              <div 
                key={user.id}
                onClick={() => navigate(`/profile/${user.id}`)}
                className="group relative grid grid-cols-12 gap-4 px-6 py-4 items-center bg-dark-800 hover:bg-dark-700 border border-transparent hover:border-purple-500/30 rounded-lg transition-all cursor-pointer overflow-hidden"
              >
                  {/* Rank */}
                  <div className="col-span-1 text-center font-hud text-3xl italic relative z-10">
                      {index + 1 === 1 && <span className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">1</span>}
                      {index + 1 === 2 && <span className="text-gray-300">2</span>}
                      {index + 1 === 3 && <span className="text-orange-400">3</span>}
                      {index + 1 > 3 && <span className="text-gray-600 group-hover:text-white">{index + 1}</span>}
                  </div>

                  {/* User */}
                  <div className="col-span-5 md:col-span-4 flex items-center gap-4 relative z-10">
                      <div className="relative">
                          <img src={user.avatarUrl} className="w-12 h-12 rounded-md object-cover border border-white/10 group-hover:border-white/50" />
                          {index === 0 && <Crown className="absolute -top-3 -left-2 w-6 h-6 text-yellow-400 fill-yellow-400/20 transform -rotate-12" />}
                      </div>
                      <div>
                          <h3 className="font-display text-xl uppercase text-white tracking-wide group-hover:text-neon-cyan transition-colors">{user.username}</h3>
                          <span className="text-xs text-gray-500 font-mono uppercase bg-black/50 px-1 rounded">{user.role}</span>
                      </div>
                  </div>

                  {/* Points */}
                  <div className="col-span-3 text-right font-hud text-2xl text-white tracking-widest relative z-10">
                      {user.points.toLocaleString()}
                  </div>

                  {/* Change */}
                  <div className="col-span-1 hidden md:flex justify-center items-center relative z-10">
                      {user.change === 'up' && <ChevronUp className="w-5 h-5 text-green-500" />}
                      {user.change === 'down' && <ChevronDown className="w-5 h-5 text-red-500" />}
                      {user.change === 'same' && <Minus className="w-4 h-4 text-gray-600" />}
                  </div>

                  {/* Peak */}
                  <div className="col-span-1 hidden md:block text-center text-gray-400 font-mono relative z-10">
                      {user.peak}
                  </div>

                  {/* Weeks */}
                  <div className="col-span-2 hidden md:block text-center text-gray-400 font-mono relative z-10">
                      {user.weeks > 0 ? user.weeks : '-'}
                  </div>

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out pointer-events-none"></div>
              </div>
          ))}
      </div>
    </div>
  );
};

export default LeaderboardPage;
