
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Battle, User } from '../types';
import { Clock, Filter, Search, MessageSquare, Scale, Trophy, Flame, Zap, ChevronRight, MoreHorizontal, UserPlus, X, UploadCloud, FileAudio, Lock, HelpCircle } from 'lucide-react';
import Countdown from '../components/Countdown';

// Extended Mock Data for Leaderboard
const LEADERBOARD: User[] = [
    { id: 'l1', username: 'BrainGotBlaps', coins: 50000, reputation: 124, rank: 'Titan', role: 'Producer', avatarUrl: 'https://picsum.photos/50/50?11', wins: 120, losses: 10, duffles: [] },
    { id: 'l2', username: 'Rasmus', coins: 42000, reputation: 98, rank: 'Legend', role: 'Producer', avatarUrl: 'https://picsum.photos/50/50?12', wins: 95, losses: 12, duffles: [] },
    { id: 'l3', username: 'InoTech3D', coins: 38000, reputation: 85, rank: 'Apprentice', role: 'Producer', avatarUrl: 'https://picsum.photos/50/50?13', wins: 80, losses: 20, duffles: [] },
    { id: 'l4', username: 'Sullymon', coins: 35000, reputation: 72, rank: 'Rookie', role: 'Artist', avatarUrl: 'https://picsum.photos/50/50?14', wins: 60, losses: 5, duffles: [] },
    { id: 'l5', username: 'Sik Trakz', coins: 31000, reputation: 60, rank: 'Pro', role: 'Artist', avatarUrl: 'https://picsum.photos/50/50?15', wins: 55, losses: 15, duffles: [] },
];

const NOW = Date.now();

const MOCK_BATTLES: Battle[] = [
  { 
    id: 'b1', title: 'Free Smoke', genre: 'Trap', type: 'BEAT',
    challenger: { id: 'c1', username: 'EugeneMack', coins: 0, reputation: 55, rank: 'Apprentice', crew: 'Frontline Money Boys', role: 'Producer', avatarUrl: 'https://picsum.photos/100/100?20', wins: 55, losses: 12, duffles: [] },
    defender: { id: 'd1', username: 'BLKCZR', coins: 0, reputation: 35, rank: 'Rookie', crew: 'Trapped In The Studio', role: 'Producer', avatarUrl: 'https://picsum.photos/100/100?21', wins: 35, losses: 8, duffles: [] },
    endsAt: NOW + 172800000, // +2 days
    votesChallenger: 450, votesDefender: 320, status: 'hot', bpm: 140, entryFee: 500
  },
  { 
    id: 'b2', title: 'Melodic Trap', genre: 'Melodic', type: 'BEAT',
    challenger: { id: 'c2', username: 'Ra808', coins: 0, reputation: 1, rank: 'Rookie', role: 'Producer', avatarUrl: 'https://picsum.photos/100/100?22', wins: 1, losses: 0, duffles: [] },
    defender: { id: 'd2', username: 'BLKCZR', coins: 0, reputation: 35, rank: 'Rookie', crew: 'TITS', role: 'Producer', avatarUrl: 'https://picsum.photos/100/100?21', wins: 35, losses: 8, duffles: [] },
    endsAt: NOW + 176400000, // +2 days 1 hour
    votesChallenger: 120, votesDefender: 140, status: 'active', bpm: 110, entryFee: 100
  },
  { 
    id: 'b3', title: 'Sample Flip', genre: 'Boom Bap', type: 'BEAT',
    challenger: { id: 'c3', username: 'vicenp', coins: 0, reputation: 30, rank: 'Rookie', crew: 'TITS', role: 'Producer', avatarUrl: 'https://picsum.photos/100/100?23', wins: 30, losses: 5, duffles: [] },
    defender: { id: 'd3', username: 'InoTech3D', coins: 0, reputation: 51, rank: 'Apprentice', crew: 'TITS', role: 'Producer', avatarUrl: 'https://picsum.photos/100/100?24', wins: 51, losses: 10, duffles: [] },
    endsAt: NOW + 1800000, // +30 mins (Urgent)
    votesChallenger: 200, votesDefender: 180, status: 'active', bpm: 90, entryFee: 250
  },
  { 
    id: 'b4', title: 'Remix Challenge', genre: 'Remix', type: 'SONG',
    challenger: { id: 'c5', username: 'MC_Spitfire', coins: 0, reputation: 35, rank: 'Rookie', crew: 'TITS', role: 'Artist', avatarUrl: 'https://picsum.photos/100/100?21', wins: 35, losses: 8, duffles: [] },
    defender: { id: 'd5', username: 'YoungGlow', coins: 0, reputation: 53, rank: 'Craftsman', crew: 'Blxp', role: 'Artist', avatarUrl: 'https://picsum.photos/100/100?25', wins: 53, losses: 2, duffles: [] },
    endsAt: NOW + 43200000, // +12 hours
    votesChallenger: 66, votesDefender: 50, status: 'hot', bpm: 180, entryFee: 1000
  },
  // Open Battles
  { 
    id: 'b5', title: 'Open Verse Challenge', genre: 'Drill', type: 'SONG',
    challenger: { id: 'c6', username: 'DrillK1ng', coins: 0, reputation: 15, rank: 'Rookie', role: 'Artist', avatarUrl: 'https://picsum.photos/100/100?26', wins: 15, losses: 5, duffles: [] },
    endsAt: NOW + 86400000, 
    votesChallenger: 0, votesDefender: 0, status: 'open', bpm: 142, entryFee: 500
  },
  { 
    id: 'b6', title: 'Synthwave Duel', genre: 'Synthwave', type: 'BEAT',
    challenger: { id: 'c7', username: 'RetroVibes', coins: 0, reputation: 40, rank: 'Pro', role: 'Producer', avatarUrl: 'https://picsum.photos/100/100?27', wins: 40, losses: 12, duffles: [] },
    endsAt: NOW + 90000000,
    votesChallenger: 0, votesDefender: 0, status: 'open', bpm: 100, entryFee: 750
  }
];

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
            {/* Floating Stake Pill */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                 <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-md shadow-lg border border-white/20 flex items-center gap-1 uppercase tracking-wider transform group-hover:scale-110 transition-transform">
                    <Zap className="w-3 h-3 fill-white" /> ${battle.entryFee} Entry
                 </div>
            </div>

            {/* Header Bar */}
            <div className="bg-white/5 px-4 py-2 flex justify-between items-center rounded-t-lg border-b border-white/5">
                <div className="flex items-center gap-2">
                    <span className="text-neon-cyan font-display uppercase tracking-wider text-sm bg-neon-cyan/10 px-2 py-0.5 rounded border border-neon-cyan/20">
                        {battle.title}
                    </span>
                    <span className="text-[9px] font-mono text-gray-500 border border-white/10 px-1 rounded uppercase">
                        {battle.type}
                    </span>
                </div>
                {/* Use Countdown Component here */}
                <Countdown endsAt={battle.endsAt} minimal />
                
                <div className="flex gap-4 text-gray-500 text-xs">
                     <div className="flex items-center gap-1"><Scale className="w-3 h-3" /> {Math.floor(Math.random() * 5)}</div>
                     <div className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {Math.floor(Math.random() * 10)}</div>
                </div>
            </div>

            {/* Card Content */}
            <div className="p-4 bg-gradient-to-b from-dark-800 to-black rounded-b-lg">
                <div className="flex items-stretch gap-2 md:gap-4">
                    
                    {/* Challenger (Left) */}
                    <div className="flex-1 bg-dark-700/50 rounded border border-white/5 p-3 relative overflow-hidden group-hover:bg-dark-700 transition-colors">
                        <div className="absolute inset-0 bg-gradient-to-r from-neon-pink/10 to-transparent opacity-0 group-hover:opacity-20 transition-opacity"></div>
                        
                        <div className="flex items-center gap-3 relative z-10">
                            <div className="relative">
                                {isCensored ? (
                                    <div className="w-14 h-14 rounded-md border border-white/20 bg-black flex items-center justify-center">
                                        <HelpCircle className="w-8 h-8 text-gray-600" />
                                    </div>
                                ) : (
                                    <img src={battle.challenger.avatarUrl} className="w-14 h-14 rounded-md border border-white/20 object-cover" />
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
                                        <h3 className="font-display text-xl text-white uppercase leading-none">{battle.challenger.username}</h3>
                                        <div className="flex flex-wrap gap-1">
                                            {battle.challenger.crew && <Badge text={battle.challenger.crew} type="crew" />}
                                            <Badge text={battle.challenger.rank} type="rank" />
                                            <Badge text={`LVL ${battle.challenger.reputation}`} type="level" />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* VS Divider */}
                    <div className="flex items-center justify-center px-1">
                        <span className="font-display italic text-3xl text-neon-cyan/50 group-hover:text-neon-cyan group-hover:scale-125 transition-all duration-300">VS</span>
                    </div>

                    {/* Defender (Right) */}
                    {battle.defender ? (
                        <div className="flex-1 bg-dark-700/50 rounded border border-white/5 p-3 relative overflow-hidden group-hover:bg-dark-700 transition-colors text-right">
                             <div className="absolute inset-0 bg-gradient-to-l from-neon-cyan/10 to-transparent opacity-0 group-hover:opacity-20 transition-opacity"></div>
                            
                            <div className="flex flex-row-reverse items-center gap-3 relative z-10">
                                <div className="relative">
                                    <img src={battle.defender.avatarUrl} className="w-14 h-14 rounded-md border border-white/20 object-cover" />
                                    <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gray-500 rounded-full border-2 border-dark-800"></div>
                                </div>
                                <div className="flex flex-col justify-center items-end gap-1">
                                    <h3 className="font-display text-xl text-white uppercase leading-none">{battle.defender.username}</h3>
                                    <div className="flex flex-wrap gap-1 justify-end">
                                         {battle.defender.crew && <Badge text={battle.defender.crew} type="crew" />}
                                        <Badge text={battle.defender.rank} type="rank" />
                                        <Badge text={`LVL ${battle.defender.reputation}`} type="level" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* OPEN SLOT STATE */
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
  const [joinForm, setJoinForm] = useState({
      file: null as File | null,
      title: '',
      description: ''
  });

  const filteredBattles = MOCK_BATTLES.filter(b => {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setJoinForm(prev => ({ ...prev, file: e.target.files![0] }));
      }
  };

  const handleSubmitJoin = () => {
      setIsJoinModalOpen(false);
  };

  return (
    <div className="px-4 lg:px-8 py-8 max-w-[1600px] mx-auto">
      
      {/* Top Controls */}
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
        
        {/* Main Feed */}
        <div className="lg:col-span-8 space-y-12">
            
            {/* BEAT BATTLES SECTION */}
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

            {/* SONG BATTLES SECTION */}
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

        {/* Sidebar / Leaderboard */}
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

                <div className="space-y-1">
                    {LEADERBOARD.map((user, idx) => (
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

                <button className="w-full mt-6 border border-white/20 text-white py-2 font-display uppercase tracking-widest text-sm hover:bg-white/10 rounded-full">
                    View Top 100
                </button>
             </div>
        </div>

      </div>

      {/* JOIN BATTLE MODAL */}
      {isJoinModalOpen && selectedBattle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setIsJoinModalOpen(false)} />
            <div className="relative bg-dark-900 border border-white/10 w-full max-w-lg p-0 rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
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

                {/* Body */}
                <div className="p-6 space-y-6">
                    
                    {/* Censored Info Notice */}
                    {selectedBattle.status === 'open' && (
                         <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded flex items-start gap-3 text-yellow-500 text-sm font-mono">
                             <Lock className="w-5 h-5 flex-shrink-0" />
                             <div>
                                 <p className="font-bold uppercase mb-1">Blind Contract</p>
                                 <p className="text-xs text-yellow-500/70">Opponent identity is hidden. You will not know who you are battling until you confirm entry and upload your track.</p>
                             </div>
                         </div>
                    )}

                    {/* File Upload */}
                    <div className="relative group">
                        <div className={`border-2 border-dashed ${joinForm.file ? 'border-green-500 bg-green-500/10' : 'border-white/20 hover:border-white/40 bg-black/40'} rounded-lg p-8 flex flex-col items-center justify-center transition-all text-center cursor-pointer relative`}>
                            <input type="file" onChange={handleFileChange} accept="audio/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                            {joinForm.file ? (
                                <>
                                    <FileAudio className="w-10 h-10 text-green-500 mb-2" />
                                    <p className="font-display text-xl text-white uppercase">{joinForm.file.name}</p>
                                    <p className="text-green-500 text-xs font-mono uppercase mt-1">Ready for upload</p>
                                </>
                            ) : (
                                <>
                                    <UploadCloud className="w-10 h-10 text-gray-500 mb-2 group-hover:text-white transition-colors" />
                                    <p className="font-display text-xl text-gray-300 uppercase">Drop Audio File</p>
                                    <p className="text-gray-500 text-xs font-mono uppercase mt-1">MP3, WAV (Max 10MB)</p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Track Title</label>
                            <input 
                                type="text" 
                                value={joinForm.title}
                                onChange={(e) => setJoinForm({...joinForm, title: e.target.value})}
                                className="w-full bg-black border border-white/20 px-4 py-3 text-white font-display text-lg focus:border-neon-cyan outline-none placeholder-gray-700"
                                placeholder="ENTER TRACK NAME..."
                            />
                        </div>
                         <div>
                            <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Description (Optional)</label>
                            <textarea 
                                value={joinForm.description}
                                onChange={(e) => setJoinForm({...joinForm, description: e.target.value})}
                                className="w-full bg-black border border-white/20 px-4 py-3 text-white font-sans text-sm focus:border-neon-cyan outline-none placeholder-gray-700 h-24 resize-none"
                                placeholder="Talk your talk..."
                            />
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 flex gap-4 bg-black/20">
                     <button onClick={() => setIsJoinModalOpen(false)} className="flex-1 py-3 font-display uppercase tracking-widest text-gray-400 hover:bg-white/5 border border-transparent hover:border-white/10">
                         Cancel
                     </button>
                     <button 
                        onClick={handleSubmitJoin}
                        disabled={!joinForm.file || !joinForm.title}
                        className="flex-[2] py-3 bg-green-600 text-white font-display uppercase tracking-widest hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(22,163,74,0.3)] transition-all"
                     >
                         Join Battle
                     </button>
                </div>

            </div>
        </div>
      )}
    </div>
  );
};

export default BattleListPage;
