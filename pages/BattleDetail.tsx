
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { User, Battle, ChatMessage, VisualizerType } from '../types';
import { Play, Pause, Hexagon, MessageSquare, Flag, Share2, DollarSign, Volume2, Shield, Lock, Palette } from 'lucide-react';
import { generateHypeCommentary } from '../services/gemini';
import Countdown from '../components/Countdown';
import AudioVisualizer from '../components/AudioVisualizer';

interface BattleDetailProps {
  user: User;
  onVote: () => void;
}

// Mock Battle Data with functional timestamp (Ends 2 days from now)
const MOCK_BATTLE: Battle = {
  id: 'b1', title: 'Midnight Freestyle', genre: 'Trap', type: 'BEAT',
  challenger: { id: 'c1', username: 'Lil V', coins: 1500, reputation: 5, rank: 'Rookie', avatarUrl: 'https://picsum.photos/100/100?1', wins: 5, losses: 2, crew: 'Westside', role: 'Producer', duffles: [] },
  defender: { id: 'd1', username: 'Big D', coins: 3400, reputation: 12, rank: 'Vet', avatarUrl: 'https://picsum.photos/100/100?2', wins: 15, losses: 4, crew: 'Trap Lords', role: 'Producer', duffles: [] },
  endsAt: Date.now() + 172800000 + 3600000, // 2 Days + 1 Hour
  votesChallenger: 450, votesDefender: 320, status: 'active', bpm: 140, entryFee: 2500
};

const abbreviateCrew = (name: string) => {
    if (name.length <= 4) return name;
    const words = name.split(' ');
    if (words.length > 1) {
        return words.map(w => w[0]).join('').substring(0, 4).toUpperCase();
    }
    return name.substring(0, 3).toUpperCase();
};

const BattlePlayer = ({ active, onClick, color, visualizerType }: { active: boolean, onClick: () => void, color: string, visualizerType: VisualizerType }) => {
    return (
        <div className={`mt-4 w-full bg-black/40 border ${active ? `border-${color}` : 'border-white/10'} p-3 rounded flex items-center gap-4 transition-all group hover:bg-white/5`}>
            <button 
                onClick={onClick}
                className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full border-2 ${active ? `bg-${color} border-${color} text-black` : 'border-gray-500 text-gray-500 hover:text-white hover:border-white'} transition-all`}
            >
                {active ? <Pause className="fill-current w-5 h-5" /> : <Play className="fill-current w-5 h-5 ml-1" />}
            </button>
            <div className="flex-1 space-y-2 h-16 flex flex-col justify-center">
                {/* Simulated Audio Visualizer */}
                <AudioVisualizer active={active} color={color} type={visualizerType} />
            </div>
        </div>
    )
}

const BattleDetailPage: React.FC<BattleDetailProps> = ({ user, onVote }) => {
  const { id } = useParams();
  const [playingSide, setPlayingSide] = useState<'challenger' | 'defender' | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [votesC, setVotesC] = useState(MOCK_BATTLE.votesChallenger);
  const [votesD, setVotesD] = useState(MOCK_BATTLE.votesDefender);
  const [activeVisualizer, setActiveVisualizer] = useState<VisualizerType>(user.activeVisualizer || 'Bars');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', user: 'System', text: 'Betting lines open. Stake cash to boost.', isBot: true },
    { id: '2', user: 'Fanboy99', text: 'Lil V going hard on this one.' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Hype Bot Logic
  const triggerHypeBot = async () => {
    const defName = MOCK_BATTLE.defender?.username || "Opponent";
    const leader = votesC > votesD ? MOCK_BATTLE.challenger.username : defName;
    const commentary = await generateHypeCommentary(MOCK_BATTLE.title, MOCK_BATTLE.genre, leader);
    setMessages(prev => [...prev, { id: Date.now().toString(), user: 'HypeBot_AI', text: commentary, isBot: true }]);
  };

  const handleVote = (side: 'challenger' | 'defender') => {
    if (hasVoted) return; 
    
    if (side === 'challenger') setVotesC(v => v + 1);
    else setVotesD(v => v + 1);
    
    setHasVoted(true);
    onVote();
    if (Math.random() > 0.7) triggerHypeBot(); 
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), user: user.username, text: chatInput }]);
    setChatInput('');
  };

  const togglePlay = (side: 'challenger' | 'defender') => {
      if (playingSide === side) {
          setPlayingSide(null);
      } else {
          setPlayingSide(side);
      }
  }

  const cycleVisualizer = () => {
      const available = user.unlockedVisualizers || ['Bars'];
      const currentIdx = available.indexOf(activeVisualizer);
      const nextIdx = (currentIdx + 1) % available.length;
      setActiveVisualizer(available[nextIdx]);
  };

  return (
    <div className="pb-12 max-w-[1400px] mx-auto px-4 lg:px-8 pt-6">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b-2 border-white/10 pb-6">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <span className="bg-neon-pink text-black px-2 py-0.5 font-bold font-display uppercase tracking-widest">{MOCK_BATTLE.genre}</span>
                <span className="bg-green-600/20 text-green-500 border border-green-600/50 px-2 py-0.5 font-mono text-xs flex items-center gap-1">
                    <DollarSign className="w-3 h-3" /> ENTRY FEE: ${MOCK_BATTLE.entryFee.toLocaleString()}
                </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display uppercase italic tracking-wider text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                {MOCK_BATTLE.title}
            </h1>
        </div>
        <div className="mt-4 md:mt-0 text-right">
            <div className="text-gray-400 font-mono text-xs uppercase bg-black px-2 py-1 inline-block border border-gray-800">Mission Timer</div>
            <Countdown endsAt={MOCK_BATTLE.endsAt} />
        </div>
      </div>

      {/* Visualizer Selector */}
      <div className="mb-4 flex justify-end">
          <button 
            onClick={cycleVisualizer}
            className="flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white bg-dark-800 px-3 py-1 rounded border border-white/10"
          >
              <Palette className="w-3 h-3" /> Visualizer: <span className="text-neon-cyan uppercase">{activeVisualizer}</span>
          </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left: Challenger Card */}
        <div className="lg:col-span-5 bg-dark-800 border-l-4 border-neon-pink p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Shield className="w-32 h-32 text-neon-pink" />
            </div>
            
            <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="relative">
                    <img src={MOCK_BATTLE.challenger.avatarUrl} className="w-20 h-20 rounded-none border-2 border-white shadow-lg" />
                    <div className="absolute -bottom-2 -right-2 bg-neon-pink text-black font-bold text-xs px-1.5 border border-white">LVL {MOCK_BATTLE.challenger.reputation}</div>
                </div>
                <div>
                    <h2 className="text-3xl font-display uppercase text-white">{MOCK_BATTLE.challenger.username}</h2>
                    <p className="text-gray-400 font-mono text-xs">CHALLENGER // {MOCK_BATTLE.challenger.rank}</p>
                    {MOCK_BATTLE.challenger.crew && (
                        <span title={MOCK_BATTLE.challenger.crew} className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-sm tracking-wider cursor-help mt-1 inline-block">
                            {abbreviateCrew(MOCK_BATTLE.challenger.crew)}
                        </span>
                    )}
                </div>
            </div>

            {/* PLAYER A */}
            <div className="mb-8">
                <label className="text-xs font-mono text-neon-pink uppercase">Track A // Audio Source</label>
                <BattlePlayer 
                    active={playingSide === 'challenger'} 
                    onClick={() => togglePlay('challenger')} 
                    color="neon-pink"
                    visualizerType={activeVisualizer}
                />
            </div>

            <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                 <div className="text-center">
                    <div className="text-4xl font-hud text-white">
                        {hasVoted ? votesC : <span className="text-gray-600 animate-pulse">???</span>}
                    </div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest">Votes</div>
                </div>
                <button 
                    onClick={() => handleVote('challenger')}
                    disabled={hasVoted}
                    className={`px-8 py-3 font-display text-xl uppercase tracking-widest skew-x-[-10deg] shadow-[4px_4px_0px_#000] transition-all
                        ${hasVoted 
                            ? 'bg-dark-700 text-gray-500 cursor-not-allowed border border-white/10' 
                            : 'bg-neon-pink text-white hover:bg-white hover:text-neon-pink'
                        }`}
                >
                    <span className="skew-x-[10deg] inline-block">{hasVoted ? 'Voted' : 'Vote Left'}</span>
                </button>
            </div>
        </div>

        {/* Center: Feed */}
        <div className="lg:col-span-2 flex flex-col gap-4">
             <div className="flex-1 bg-black/40 border border-white/10 flex flex-col">
                 <div className="bg-white/5 p-2 text-center text-[10px] font-mono text-gray-400 uppercase tracking-widest border-b border-white/10">
                    Live Feed
                 </div>
                 <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[300px] lg:max-h-none text-xs">
                    {!hasVoted && (
                         <div className="p-4 text-center border border-dashed border-white/10 rounded m-2">
                             <Lock className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                             <p className="text-gray-500 text-[10px] uppercase">Vote to unlock live stats</p>
                         </div>
                    )}
                    {messages.map((msg) => (
                        <div key={msg.id} className={`${msg.isBot ? 'text-green-400' : 'text-gray-300'}`}>
                            <span className="font-bold uppercase opacity-70">{msg.user}:</span> {msg.text}
                        </div>
                    ))}
                 </div>
                 <form onSubmit={handleSendMessage} className="p-2 border-t border-white/10 flex">
                    <input 
                        className="bg-transparent w-full text-xs text-white outline-none placeholder-gray-600"
                        placeholder="Say something..."
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                    />
                 </form>
             </div>
             
             <div className="flex justify-center py-4">
                 <div className="bg-white/10 rounded-full p-4 border border-white/20">
                     <div className="font-display text-2xl italic text-white">VS</div>
                 </div>
             </div>
        </div>

        {/* Right: Defender Card */}
        {MOCK_BATTLE.defender && (
        <div className="lg:col-span-5 bg-dark-800 border-r-4 border-neon-cyan p-6 relative overflow-hidden group text-right">
             <div className="absolute top-0 left-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Shield className="w-32 h-32 text-neon-cyan" />
            </div>

            <div className="flex flex-row-reverse items-center gap-4 mb-6 relative z-10">
                <div className="relative">
                    <img src={MOCK_BATTLE.defender.avatarUrl} className="w-20 h-20 rounded-none border-2 border-white shadow-lg" />
                    <div className="absolute -bottom-2 -left-2 bg-neon-cyan text-black font-bold text-xs px-1.5 border border-white">LVL {MOCK_BATTLE.defender.reputation}</div>
                </div>
                <div>
                    <h2 className="text-3xl font-display uppercase text-white">{MOCK_BATTLE.defender.username}</h2>
                    <p className="text-gray-400 font-mono text-xs">DEFENDER // {MOCK_BATTLE.defender.rank}</p>
                    {MOCK_BATTLE.defender.crew && (
                        <span title={MOCK_BATTLE.defender.crew} className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-sm tracking-wider cursor-help mt-1 inline-block">
                            {abbreviateCrew(MOCK_BATTLE.defender.crew)}
                        </span>
                    )}
                </div>
            </div>

             {/* PLAYER B */}
             <div className="mb-8" dir="rtl">
                <label className="text-xs font-mono text-neon-cyan uppercase w-full block text-right">Track B // Audio Source</label>
                <div dir="ltr">
                    <BattlePlayer 
                        active={playingSide === 'defender'} 
                        onClick={() => togglePlay('defender')} 
                        color="neon-cyan"
                        visualizerType={activeVisualizer}
                    />
                </div>
            </div>

            <div className="flex flex-row-reverse items-center justify-between mt-auto pt-6 border-t border-white/5">
                 <div className="text-center">
                    <div className="text-4xl font-hud text-white">
                        {hasVoted ? votesD : <span className="text-gray-600 animate-pulse">???</span>}
                    </div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest">Votes</div>
                </div>
                <button 
                    onClick={() => handleVote('defender')}
                    disabled={hasVoted}
                    className={`px-8 py-3 font-display text-xl uppercase tracking-widest skew-x-[-10deg] shadow-[4px_4px_0px_#000] transition-all
                        ${hasVoted 
                            ? 'bg-dark-700 text-gray-500 cursor-not-allowed border border-white/10' 
                            : 'bg-neon-cyan text-black hover:bg-white hover:text-black'
                        }`}
                >
                    <span className="skew-x-[10deg] inline-block">{hasVoted ? 'Voted' : 'Vote Right'}</span>
                </button>
            </div>
        </div>
        )}

      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 max-w-lg mx-auto">
        <button className="flex items-center justify-center gap-2 py-3 bg-dark-700 border border-white/10 hover:border-green-500 transition-colors uppercase font-hud tracking-wider text-gray-300 hover:text-white">
            <Share2 className="w-4 h-4" /> Share Job
        </button>
        <button className="flex items-center justify-center gap-2 py-3 bg-dark-700 border border-white/10 hover:border-red-500 transition-colors uppercase font-hud tracking-wider text-gray-300 hover:text-white">
            <Flag className="w-4 h-4" /> Report
        </button>
      </div>

    </div>
  );
};

export default BattleDetailPage;
