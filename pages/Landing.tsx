
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CityMap from '../components/CityMap';
import { Flame, Play, Clock, ArrowRight, DollarSign } from 'lucide-react';
import { Battle } from '../types';
import Countdown from '../components/Countdown';
import { getTrendingBattles } from '../services/firebase';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [trending, setTrending] = useState<Battle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrending = async () => {
      try {
        const battles = await getTrendingBattles(4);
        setTrending(battles);
      } catch (error) {
        console.error('Error loading trending battles:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTrending();
  }, []);

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="px-4 lg:px-8 pt-8">
        <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 flex flex-col justify-center space-y-6">
                <div>
                    <h2 className="text-green-500 font-mono text-sm tracking-widest mb-2 animate-pulse">NEW MISSIONS AVAILABLE</h2>
                    <h1 className="text-5xl md:text-7xl font-display font-bold uppercase leading-[0.9] text-white italic">
                        Rule The <br/> <span className="text-neon-pink text-outline-white">Streets</span>
                    </h1>
                </div>
                <p className="text-gray-400 max-w-md border-l-2 border-neon-cyan pl-4">
                    Stake your cash. Battle for territory. Win Duffles.
                </p>
                <div className="flex gap-4">
                    <button 
                        onClick={() => navigate('/battles')}
                        className="bg-white text-black px-8 py-3 font-display text-2xl uppercase tracking-widest hover:bg-neon-cyan transition-all skew-x-[-10deg] shadow-[5px_5px_0px_rgba(0,0,0,1)]"
                    >
                        <span className="skew-x-[10deg] inline-block">Find Battle</span>
                    </button>
                    <button 
                        onClick={() => navigate('/upload')}
                        className="bg-transparent border-2 border-white/30 text-white px-8 py-3 font-display text-2xl uppercase tracking-widest hover:border-green-500 hover:text-green-500 transition-all skew-x-[-10deg]"
                    >
                         <span className="skew-x-[10deg] inline-block">Create Job</span>
                    </button>
                </div>
                
                <div className="flex gap-6 pt-4 border-t border-white/10 mt-4">
                    <div>
                        <div className="text-2xl font-hud text-white">{trending.length > 0 ? `${trending.length}+` : '0'}</div>
                        <div className="text-[10px] text-gray-500 uppercase">Active Jobs</div>
                    </div>
                    <div>
                        <div className="text-2xl font-hud text-green-500">$0</div>
                        <div className="text-[10px] text-gray-500 uppercase">Cash Flow</div>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-8">
                <CityMap />
            </div>
        </div>
      </div>

      <div className="px-4 lg:px-8 mt-12">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-3xl font-display uppercase italic tracking-wider flex items-center gap-2 text-white">
                <Flame className="text-neon-pink" /> High Stakes
            </h3>
            <button className="text-sm font-mono text-green-500 hover:underline flex items-center gap-1" onClick={() => navigate('/battles')}>
                VIEW ALL <ArrowRight className="w-3 h-3" />
            </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500 font-mono">Loading battles...</div>
        ) : trending.length === 0 ? (
          <div className="text-center py-12 text-gray-500 font-mono border border-dashed border-white/10 rounded">
            No active battles yet. Be the first to create one!
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
              {trending.map(battle => (
                  <div key={battle.id} onClick={() => navigate(`/battle/${battle.id}`)} className="bg-dark-800 border border-white/10 p-0 flex gap-0 hover:border-green-500 transition-all cursor-pointer group relative overflow-hidden">
                      <div className="w-32 bg-dark-700 relative flex items-center justify-center border-r border-white/10">
                          <div className="absolute top-2 left-2 z-10">
                              <span className="bg-black/80 text-green-500 text-xs font-bold px-1.5 py-0.5 border border-green-500/30">Entry: ${battle.entryFee}</span>
                          </div>
                          <Play className="w-10 h-10 text-white opacity-50 group-hover:opacity-100 transition-all" />
                      </div>
                      <div className="flex-1 p-4 flex flex-col justify-between bg-gradient-to-r from-dark-800 to-black">
                          <div>
                              <div className="flex justify-between items-start">
                                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{battle.genre}</span>
                                  <span className="text-[10px] font-mono text-neon-pink flex items-center gap-1"><Clock className="w-3 h-3"/> <Countdown endsAt={battle.endsAt} minimal /></span>
                              </div>
                              <h4 className="font-display text-2xl uppercase tracking-wide text-white mt-1 group-hover:text-green-500 transition-colors italic">{battle.title}</h4>
                          </div>
                          
                          <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center -space-x-2">
                                  {battle.challenger?.avatarUrl && (
                                    <img src={battle.challenger.avatarUrl} className="w-8 h-8 rounded-full border-2 border-black" />
                                  )}
                                  {battle.defender?.avatarUrl ? (
                                      <img src={battle.defender.avatarUrl} className="w-8 h-8 rounded-full border-2 border-black" />
                                  ) : (
                                      <div className="w-8 h-8 rounded-full border-2 border-black bg-gray-700 flex items-center justify-center text-[10px] text-gray-400">?</div>
                                  )}
                              </div>
                              <div className="font-hud text-lg text-gray-500">
                                  {battle.votesChallenger + battle.votesDefender} <span className="text-xs">VOTES</span>
                              </div>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
