
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { ChevronUp, ChevronDown, Minus, Crown } from 'lucide-react';
import { getLeaderboard } from '../services/firebase';

interface LeaderboardEntry extends User {
  points?: number;
  change?: 'up' | 'down' | 'same';
  peak?: number;
  weeks?: number;
}

const LeaderboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'ALL' | 'ARTISTS' | 'PRODUCERS'>('ALL');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const users = await getLeaderboard(100);
        const entries: LeaderboardEntry[] = users.map((user, idx) => ({
          ...user,
          points: user.reputation * 100 + (user.wins || 0) * 50,
          change: 'same' as const,
          peak: idx + 1,
          weeks: Math.floor(Math.random() * 10)
        }));
        setLeaderboardData(entries);
      } catch (error) {
        console.error('Error loading leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };
    loadLeaderboard();
  }, []);

  const filteredData = leaderboardData.filter(user => {
    if (filter === 'ALL') return true;
    if (filter === 'ARTISTS') return user.role === 'Artist';
    if (filter === 'PRODUCERS') return user.role === 'Producer';
    return true;
  });

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-12">
      
      <div className="text-center mb-12">
        <h1 className="text-6xl md:text-8xl font-display font-bold italic uppercase tracking-tighter mb-4">
          <span className="text-neon-cyan drop-shadow-[0_0_15px_rgba(0,229,255,0.5)]">SongVersus</span> 
          <span className="text-purple-500 bg-white/5 px-4 rounded-lg ml-4 border border-purple-500/30 inline-block transform -skew-x-12">100</span>
        </h1>
        <p className="text-gray-400 font-mono tracking-widest text-sm">
           GLOBAL RANKINGS // SEASON 1
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
          
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

          <div className="flex items-center gap-4 bg-dark-800 px-6 py-2 rounded-lg border border-white/10">
              <span className="text-gray-500 font-mono text-xs uppercase">Next Update:</span>
              <span className="text-neon-cyan font-hud text-2xl tracking-widest">05H 25M 32S</span>
          </div>
      </div>

      <div className="bg-dark-900 border-b border-purple-500/30 text-purple-400 font-mono text-[10px] uppercase tracking-widest grid grid-cols-12 gap-4 px-6 py-3 rounded-t-lg">
          <div className="col-span-1 text-center">Rank</div>
          <div className="col-span-5 md:col-span-4">User</div>
          <div className="col-span-3 text-right">Battle Points</div>
          <div className="col-span-1 text-center hidden md:block">Change</div>
          <div className="col-span-1 text-center hidden md:block">Peak</div>
          <div className="col-span-2 text-center hidden md:block">Weeks on Top</div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500 font-mono">Loading leaderboard...</div>
      ) : filteredData.length === 0 ? (
        <div className="text-center py-12 text-gray-500 font-mono border border-dashed border-white/10 rounded mt-2">
          No users found. Be the first to join!
        </div>
      ) : (
        <div className="flex flex-col gap-2 mt-2">
            {filteredData.map((user, index) => (
                <div 
                  key={user.id}
                  onClick={() => navigate(`/profile/${user.id}`)}
                  className="group relative grid grid-cols-12 gap-4 px-6 py-4 items-center bg-dark-800 hover:bg-dark-700 border border-transparent hover:border-purple-500/30 rounded-lg transition-all cursor-pointer overflow-hidden"
                >
                    <div className="col-span-1 text-center font-hud text-3xl italic relative z-10">
                        {index + 1 === 1 && <span className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">1</span>}
                        {index + 1 === 2 && <span className="text-gray-300">2</span>}
                        {index + 1 === 3 && <span className="text-orange-400">3</span>}
                        {index + 1 > 3 && <span className="text-gray-600 group-hover:text-white">{index + 1}</span>}
                    </div>

                    <div className="col-span-5 md:col-span-4 flex items-center gap-4 relative z-10">
                        <div className="relative">
                            <img src={user.avatarUrl || 'https://via.placeholder.com/48'} className="w-12 h-12 rounded-md object-cover border border-white/10 group-hover:border-white/50" />
                            {index === 0 && <Crown className="absolute -top-3 -left-2 w-6 h-6 text-yellow-400 fill-yellow-400/20 transform -rotate-12" />}
                        </div>
                        <div>
                            <h3 className="font-display text-xl uppercase text-white tracking-wide group-hover:text-neon-cyan transition-colors">{user.username}</h3>
                            <span className="text-xs text-gray-500 font-mono uppercase bg-black/50 px-1 rounded">{user.role}</span>
                        </div>
                    </div>

                    <div className="col-span-3 text-right font-hud text-2xl text-white tracking-widest relative z-10">
                        {(user.points || 0).toLocaleString()}
                    </div>

                    <div className="col-span-1 hidden md:flex justify-center items-center relative z-10">
                        {user.change === 'up' && <ChevronUp className="w-5 h-5 text-green-500" />}
                        {user.change === 'down' && <ChevronDown className="w-5 h-5 text-red-500" />}
                        {user.change === 'same' && <Minus className="w-4 h-4 text-gray-600" />}
                    </div>

                    <div className="col-span-1 hidden md:block text-center text-gray-400 font-mono relative z-10">
                        {user.peak || '-'}
                    </div>

                    <div className="col-span-2 hidden md:block text-center text-gray-400 font-mono relative z-10">
                        {(user.weeks || 0) > 0 ? user.weeks : '-'}
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out pointer-events-none"></div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default LeaderboardPage;
