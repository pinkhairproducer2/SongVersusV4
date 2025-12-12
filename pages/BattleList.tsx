
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Battle, User } from '../types';
import { Clock, Search, MessageSquare, Scale, Trophy, Flame, Zap, ChevronRight, MoreHorizontal, UserPlus, X, UploadCloud, FileAudio, Lock, HelpCircle } from 'lucide-react';
import Countdown from '../components/Countdown';
import { getBattles, getLeaderboard } from '../services/firebase';

const abbreviateCrew = (name: string) => {
    if (name.length <= 4) return name;
    const words = name.split(' ');
    if (words.length > 1) {
        return words.map(w => w[0]).join('').substring(0, 4).toUpperCase();
    }
    return name.substring(0, 3).toUpperCase();
};

const Badge = ({ text, type }: { text: string, type?: 'crew' | 'rank' | 'level' }) => {
    let colors = "bg-gray-800 text-gray-400 border-gray-700";
    if (type === 'crew') colors = "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    if (type === 'rank') colors = "bg-blue-500/10 text-blue-400 border-blue-500/20";
    if (type === 'level') colors = "bg-white/10 text-gray-300 border-white/10";

    const displayText = type === 'crew' ? abbreviateCrew(text) : text;

    return (
        <span 
            title={type === 'crew' ? text : undefined}
            className={`text-[9px] font-bold uppercase px-1.5 py-0.5 border rounded-sm tracking-wider ${colors} ${type === 'crew' ? 'cursor-help' : ''}`}
        >
            {displayText}
        </span>
    );
};

interface BattleCardProps {
    battle: Battle;
    navigate: any;
    onJoin: (e: any, b: Battle) => void;
}

const BattleCard: React.FC<BattleCardProps> = ({ battle, navigate, onJoin }) => {
    const isCensored = battle.status === 'open';

    return (
        <div 
            onClick={() => navigate(`/battle/${battle.id}`)}
            className="relative bg-dark-900 border border-white/10 rounded-lg group cursor-pointer hover:border-neon-cyan/50 transition-all overflow-visible mt-6"
        >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                 <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-md shadow-lg border border-white/20 flex items-center gap-1 uppercase tracking-wider transform group-hover:scale-110 transition-transform">
                    <Zap className="w-3 h-3 fill-white" /> ${battle.entryFee} Entry
                 </div>
            </div>

            <div className="bg-white/5 px-4 py-2 flex justify-between items-center rounded-t-lg border-b border-white/5">
                <div className="flex items-center gap-2">
                    <span className="text-neon-cyan font-display uppercase tracking-wider text-sm bg-neon-cyan/10 px-2 py-0.5 rounded border border-neon-cyan/20">
                        {battle.title}
                    </span>
                    <span className="text-[9px] font-mono text-gray-500 border border-white/10 px-1 rounded uppercase">
                        {battle.type}
                    </span>
                </div>
                <Countdown endsAt={battle.endsAt} minimal />
                
                <div className="flex gap-4 text-gray-500 text-xs">
                     <div className="flex items-center gap-1"><Scale className="w-3 h-3" /> {Math.floor(Math.random() * 5)}</div>
                     <div className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {Math.floor(Math.random() * 10)}</div>
                </div>
            </div>

            <div className="p-4 bg-gradient-to-b from-dark-800 to-black rounded-b-lg">
                <div className="flex items-stretch gap-2 md:gap-4">
                    
                    <div className="flex-1 bg-dark-700/50 rounded border border-white/5 p-3 relative overflow-hidden group-hover:bg-dark-700 transition-colors">
                        <div className="absolute inset-0 bg-gradient-to-r from-neon-pink/10 to-transparent opacity-0 group-hover:opacity-20 transition-opacity"></div>
                        
                        <div className="flex items-center gap-3 relative z-10">
                            <div className="relative">
                                {isCensored ? (
                                    <div className="w-14 h-14 rounded-md border border-white/20 bg-black flex items-center justify-center">
                                        <HelpCircle className="w-8 h-8 text-gray-600" />
                                    </div>
                                ) : (
                                    <img src={battle.challenger?.avatarUrl || 'https://via.placeholder.com/56'} className="w-14 h-14 rounded-md border border-white/20 object-cover" />
                                )}
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-800"></div>
                            </div>
                            <div className="flex flex-col justify-center gap-1">
                                {isCensored ? (
                                    <>
                                        <h3 className="font-display text-xl text-gray-500 uppercase leading-none blur-[2px]">UNKNOWN</h3>
                                        <div className="flex flex-wrap gap-1">
                                            <Badge text="???" type="rank" />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="font-display text-xl text-white uppercase leading-none">{battle.challenger?.username || 'Unknown'}</h3>
                                        <div className="flex flex-wrap gap-1">
                                            {battle.challenger?.crew && <Badge text={battle.challenger.crew} type="crew" />}
                                            <Badge text={battle.challenger?.rank || 'Rookie'} type="rank" />
                                            <Badge text={`LVL ${battle.challenger?.reputation || 0}`} type="level" />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center px-1">
                        <span className="font-display italic text-3xl text-neon-cyan/50 group-hover:text-neon-cyan group-hover:scale-125 transition-all duration-300">VS</span>
                    </div>

                    {battle.defender ? (
                        <div className="flex-1 bg-dark-700/50 rounded border border-white/5 p-3 relative overflow-hidden group-hover:bg-dark-700 transition-colors text-right">
                             <div className="absolute inset-0 bg-gradient-to-l from-neon-cyan/10 to-transparent opacity-0 group-hover:opacity-20 transition-opacity"></div>
                            
                            <div className="flex flex-row-reverse items-center gap-3 relative z-10">
                                <div className="relative">
                                    <img src={battle.defender.avatarUrl || 'https://via.placeholder.com/56'} className="w-14 h-14 rounded-md border border-white/20 object-cover" />
                                    <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gray-500 rounded-full border-2 border-dark-800"></div>
                                </div>
                                <div className="flex flex-col justify-center items-end gap-1">
                                    <h3 className="font-display text-xl text-white uppercase leading-none">{battle.defender.username}</h3>
                                    <div className="flex flex-wrap gap-1 justify-end">
                                         {battle.defender.crew && <Badge text={battle.defender.crew} type="crew" />}
                                        <Badge text={battle.defender.rank || 'Rookie'} type="rank" />
                                        <Badge text={`LVL ${battle.defender.reputation || 0}`} type="level" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 bg-dark-900/50 rounded border-2 border-dashed border-white/10 p-3 relative overflow-hidden flex flex-col items-center justify-center group-hover:border-green-500/50 transition-colors">
                             <div className="text-center">
                                 <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-2">Challenger Wanted</p>
                                 <button 
                                    onClick={(e) => onJoin(e, battle)}
                                    className="bg-green-600 text-white text-sm font-display uppercase tracking-wider px-4 py-1 skew-x-[-10deg] hover:bg-green-500 transition-colors"
                                 >
                                    <span className="skew-x-[10deg]">Join Battle</span>
                                 </button>
                             </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

const BattleListPage: React.FC = () => {
  const navigate = useNavigate();
  const [filterGenre, setFilterGenre] = useState('All');
  const [activeTab, setActiveTab] = useState<'hottest' | 'open' | 'active'>('active');
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedBattle, setSelectedBattle] = useState<Battle | null>(null);
  const [battles, setBattles] = useState<Battle[]>([]);
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinForm, setJoinForm] = useState({
      file: null as File | null,
      title: '',
      description: ''
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [battlesData, leaderboardData] = await Promise.all([
          getBattles(),
          getLeaderboard(5)
        ]);
        setBattles(battlesData);
        setLeaderboard(leaderboardData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredBattles = battles.filter(b => {
      if (filterGenre !== 'All' && b.genre !== filterGenre && !b.title.includes(filterGenre)) {
          return false;
      }
      if (activeTab === 'hottest') return b.status === 'hot';
      if (activeTab === 'open') return b.status === 'open';
      if (activeTab === 'active') return b.status === 'active' || b.status === 'hot'; 
      return true;
  });

  const beatBattles = filteredBattles.filter(b => b.type === 'BEAT');
  const songBattles = filteredBattles.filter(b => b.type === 'SONG');

  const handleJoinClick = (e: React.MouseEvent, battle: Battle) => {
      e.stopPropagation();
      setSelectedBattle(battle);
      setJoinForm({ file: null, title: '', description: '' });
      setIsJoinModalOpen(true);
  };

  const handleSubmitJoin = () => {
      setIsJoinModalOpen(false);
  };

  if (loading) {
    return (
      <div className="px-4 lg:px-8 py-8 text-center">
        <div className="text-white font-display text-xl animate-pulse">Loading battles...</div>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-8 py-8 max-w-[1600px] mx-auto">
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
         <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto scrollbar-hide">
            
            <button 
                onClick={() => setActiveTab('hottest')}
                className={`px-6 py-2 font-display uppercase italic tracking-widest text-lg skew-x-[-10deg] transition-all flex items-center gap-2 border-b-2 
                ${activeTab === 'hottest' 
                    ? 'bg-orange-600 text-white border-orange-400' 
                    : 'bg-dark-700 text-gray-400 border-transparent hover:text-white hover:bg-dark-600'
                }`}
            >
                <span className="skew-x-[10deg] flex items-center gap-2">
                    <Flame className={`w-4 h-4 ${activeTab === 'hottest' ? 'fill-white' : ''}`} /> Hottest
                </span>
            </button>

            <button 
                onClick={() => setActiveTab('open')}
                className={`px-6 py-2 font-display uppercase italic tracking-widest text-lg skew-x-[-10deg] transition-all flex items-center gap-2 border-b-2
                ${activeTab === 'open' 
                    ? 'bg-green-600 text-white border-green-400' 
                    : 'bg-dark-700 text-gray-400 border-transparent hover:text-white hover:bg-dark-600'
                }`}
            >
                <span className="skew-x-[10deg] flex items-center gap-2">
                    <UserPlus className="w-4 h-4" /> Open
                </span>
            </button>

             <button 
                onClick={() => setActiveTab('active')}
                className={`px-6 py-2 font-display uppercase italic tracking-widest text-lg skew-x-[-10deg] transition-all flex items-center gap-2 border-b-2
                ${activeTab === 'active' 
                    ? 'bg-blue-600 text-white border-blue-400' 
                    : 'bg-dark-700 text-gray-400 border-transparent hover:text-white hover:bg-dark-600'
                }`}
            >
                <span className="skew-x-[10deg] flex items-center gap-2">
                    <Zap className={`w-4 h-4 ${activeTab === 'active' ? 'fill-white' : ''}`} /> Active
                </span>
            </button>

         </div>

         <div className="flex gap-2 w-full md:w-auto">
             <div className="relative flex-1 md:w-64">
                <input 
                    type="text" 
                    placeholder="Search..." 
                    className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-sm text-white focus:border-neon-cyan outline-none" 
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
             </div>
             <div className="bg-dark-800 border border-white/10 px-4 py-2 text-sm text-gray-300 flex items-center gap-2 cursor-pointer hover:bg-dark-700">
                 All Genres <ChevronRight className="w-3 h-3 rotate-90" />
             </div>
         </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-8 space-y-12">
            
            <div className="relative">
                <h3 className="text-2xl font-display uppercase italic text-white mb-6 flex items-center gap-4">
                    <span className="bg-neon-pink text-black px-2 skew-x-[-10deg] inline-block">Producers</span>
                    Beat Battles
                    <span className="flex-1 h-px bg-white/10"></span>
                </h3>
                {beatBattles.length > 0 ? (
                    beatBattles.map(battle => (
                        <BattleCard key={battle.id} battle={battle} navigate={navigate} onJoin={handleJoinClick} />
                    ))
                ) : (
                    <div className="text-gray-500 font-mono text-sm italic border border-dashed border-white/10 p-6 text-center">
                        No Beat Battles active in this sector.
                    </div>
                )}
            </div>

            <div className="relative">
                <h3 className="text-2xl font-display uppercase italic text-white mb-6 flex items-center gap-4">
                    <span className="bg-neon-cyan text-black px-2 skew-x-[-10deg] inline-block">Artists</span>
                    Song Battles
                    <span className="flex-1 h-px bg-white/10"></span>
                </h3>
                {songBattles.length > 0 ? (
                     songBattles.map(battle => (
                        <BattleCard key={battle.id} battle={battle} navigate={navigate} onJoin={handleJoinClick} />
                    ))
                ) : (
                    <div className="text-gray-500 font-mono text-sm italic border border-dashed border-white/10 p-6 text-center">
                        No Song Battles active in this sector.
                    </div>
                )}
            </div>

        </div>

        <div className="hidden lg:block lg:col-span-4">
             <div className="bg-dark-900 border border-white/10 rounded-lg p-6 sticky top-24">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-display text-2xl uppercase italic text-white flex items-center gap-2">
                        SongVersus <span className="text-purple-500 bg-purple-500/10 px-1 rounded text-lg not-italic font-bold">100</span>
                    </h2>
                </div>

                <div className="flex text-[10px] text-neon-cyan uppercase font-bold tracking-widest mb-4 px-2">
                    <span className="w-8">Rank</span>
                    <span className="flex-1">Name</span>
                    <span>Change</span>
                </div>

                {leaderboard.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 font-mono text-sm">No users yet</div>
                ) : (
                  <div className="space-y-1">
                      {leaderboard.map((user, idx) => (
                          <div key={user.id} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded cursor-pointer group transition-colors">
                              <span className="w-8 font-hud text-xl text-white italic">{idx + 1}</span>
                              <div className="flex-1">
                                  <div className="font-display text-white uppercase text-lg group-hover:text-neon-pink transition-colors">{user.username}</div>
                              </div>
                              <div className="text-gray-500">
                                  <MoreHorizontal className="w-4 h-4" />
                              </div>
                          </div>
                      ))}
                  </div>
                )}

                <button 
                  onClick={() => navigate('/leaderboard')}
                  className="w-full mt-6 border border-white/20 text-white py-2 font-display uppercase tracking-widest text-sm hover:bg-white/10 rounded-full"
                >
                    View Top 100
                </button>
             </div>
        </div>

      </div>

      {isJoinModalOpen && selectedBattle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setIsJoinModalOpen(false)} />
            <div className="relative bg-dark-900 border border-white/10 w-full max-w-lg p-0 rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                
                <div className="bg-white/5 border-b border-white/10 p-6 flex justify-between items-center">
                     <div>
                         <h2 className="font-display text-3xl uppercase italic text-white tracking-wider">Accept Contract</h2>
                         <div className="flex items-center gap-2 text-xs font-mono text-neon-cyan mt-1">
                            <span className="uppercase">{selectedBattle.title}</span>
                            <span className="text-gray-500">//</span>
                            <span>ENTRY: ${selectedBattle.entryFee}</span>
                         </div>
                     </div>
                     <button onClick={() => setIsJoinModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                         <X className="w-6 h-6" />
                     </button>
                </div>

                <div className="p-6 space-y-6">
                    {selectedBattle.status === 'open' && (
                         <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded flex items-start gap-3 text-yellow-500 text-sm font-mono">
                            <Lock className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <p>Your opponent's identity is hidden until you accept. The contract is binding.</p>
                        </div>
                    )}
                    
                    <div>
                        <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Upload Your Track</label>
                        <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-neon-cyan/50 transition-colors cursor-pointer">
                            <UploadCloud className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-400">Drag & drop or click to upload</p>
                            <p className="text-xs text-gray-600 mt-1">MP3, WAV up to 50MB</p>
                        </div>
                    </div>

                    <button 
                        onClick={handleSubmitJoin}
                        className="w-full bg-green-600 hover:bg-green-500 text-white font-display text-xl uppercase tracking-widest py-3 skew-x-[-5deg] transition-colors"
                    >
                        <span className="skew-x-[5deg] inline-block">Confirm & Join</span>
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default BattleListPage;
