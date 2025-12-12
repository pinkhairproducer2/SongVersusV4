
import React, { useState } from 'react';
import { User } from '../types';
import { Check, Lock, Users, Shield, Crown, ChevronRight, Copy, Flag, Swords } from 'lucide-react';

// Level Thresholds
const LEVELS = [
    { level: 1, name: 'Rookie', minRep: 0, benefit: 'Basic Access' },
    { level: 2, name: 'Apprentice', minRep: 100, benefit: 'Upload Limit Increased' },
    { level: 3, name: 'Pro', minRep: 300, benefit: 'Create Syndicate (Gang)' },
    { level: 4, name: 'Legend', minRep: 600, benefit: 'Reduced Battle Fees' },
    { level: 5, name: 'Titan', minRep: 1000, benefit: 'Global Territory Control' },
];

interface TimelineProps {
    user: User;
    onCreateGang: (name: string) => void;
}

const TimelinePage: React.FC<TimelineProps> = ({ user, onCreateGang }) => {
    const [gangName, setGangName] = useState('');
    
    // Calculate Level Logic
    // Replaced findLastIndex with a backward loop for better browser/environment support
    let currentLevelIndex = 0;
    for (let i = LEVELS.length - 1; i >= 0; i--) {
        if (user.reputation >= LEVELS[i].minRep) {
            currentLevelIndex = i;
            break;
        }
    }
    
    const currentLevel = LEVELS[currentLevelIndex];
    const nextLevel = LEVELS[currentLevelIndex + 1];
    
    // Progress for next level
    let progressPercent = 100;
    if (nextLevel) {
        const range = nextLevel.minRep - currentLevel.minRep;
        const current = user.reputation - currentLevel.minRep;
        progressPercent = Math.min(100, Math.max(0, (current / range) * 100));
    }

    const isGangUnlocked = currentLevel.level >= 3;

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (gangName.trim()) {
            onCreateGang(gangName);
            setGangName('');
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-12 pb-24">
            
            {/* Header / Current Status */}
            <div className="mb-16 text-center">
                 <h1 className="text-6xl font-display font-bold uppercase italic tracking-tighter mb-4 text-white">
                    Career <span className="text-neon-cyan">Timeline</span>
                </h1>
                <div className="inline-block bg-dark-800 border border-white/20 p-6 rounded-xl min-w-[300px]">
                    <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Current Status</div>
                    <div className="text-4xl font-display uppercase text-white mb-4">{currentLevel.name}</div>
                    
                    {/* Progress Bar */}
                    <div className="w-full h-3 bg-black rounded-full overflow-hidden border border-white/10 mb-2 relative">
                         <div 
                            className="h-full bg-gradient-to-r from-neon-pink to-purple-600 transition-all duration-1000 ease-out" 
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>
                    
                    <div className="flex justify-between text-xs font-mono text-gray-400">
                        <span>{user.reputation} REP</span>
                        {nextLevel ? (
                            <span>{nextLevel.minRep} REP REQUIRED</span>
                        ) : (
                            <span className="text-yellow-400">MAX RANK</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                
                {/* Timeline Column */}
                <div>
                    <h2 className="text-2xl font-display uppercase text-white mb-8 flex items-center gap-2">
                        <Flag className="w-5 h-5 text-neon-pink" /> Progression Path
                    </h2>
                    
                    <div className="space-y-0 relative">
                        {/* Connecting Line */}
                        <div className="absolute top-4 bottom-4 left-[19px] w-0.5 bg-white/10 -z-10"></div>

                        {LEVELS.map((lvl, idx) => {
                            const isPast = idx < currentLevelIndex;
                            const isCurrent = idx === currentLevelIndex;
                            const isLocked = idx > currentLevelIndex;

                            return (
                                <div key={lvl.level} className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${isCurrent ? 'bg-white/5 border border-white/10' : 'opacity-80'}`}>
                                    
                                    {/* Icon/Dot */}
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 z-10 ${
                                        isPast ? 'bg-green-500 border-green-500 text-black' : 
                                        isCurrent ? 'bg-neon-cyan border-neon-cyan text-black animate-pulse' : 
                                        'bg-dark-900 border-gray-700 text-gray-700'
                                    }`}>
                                        {isPast ? <Check className="w-5 h-5" /> : 
                                         isLocked ? <Lock className="w-4 h-4" /> :
                                         <span className="font-hud text-lg">{lvl.level}</span>
                                        }
                                    </div>

                                    <div className="flex-1 pt-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <h3 className={`font-display text-xl uppercase ${isLocked ? 'text-gray-500' : 'text-white'}`}>
                                                {lvl.name}
                                            </h3>
                                            <span className="text-xs font-mono text-gray-500">{lvl.minRep} REP</span>
                                        </div>
                                        <p className="text-sm text-gray-400">{lvl.benefit}</p>
                                        
                                        {isCurrent && nextLevel && (
                                            <div className="mt-2 text-xs text-neon-cyan font-mono">
                                                {nextLevel.minRep - user.reputation} REP to next rank
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Syndicate Column */}
                <div>
                    <h2 className="text-2xl font-display uppercase text-white mb-8 flex items-center gap-2">
                        <Users className="w-5 h-5 text-green-500" /> Syndicate Control
                    </h2>

                    {!isGangUnlocked ? (
                        /* LOCKED STATE */
                        <div className="bg-dark-800 border border-white/10 border-dashed p-8 rounded-xl text-center opacity-75">
                            <Lock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <h3 className="font-display text-2xl uppercase text-gray-400 mb-2">Locked</h3>
                            <p className="text-gray-500 font-mono text-sm">
                                Reach <span className="text-neon-cyan">PRO RANK (LVL 3)</span> to form your own Syndicate.
                            </p>
                        </div>
                    ) : user.crew ? (
                        /* ACTIVE CREW DASHBOARD */
                        <div className="bg-dark-800 border border-green-500/30 p-8 rounded-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Crown className="w-32 h-32 text-green-500" />
                            </div>
                            
                            <div className="relative z-10">
                                <div className="text-xs font-mono text-green-500 uppercase tracking-widest mb-2">Active Syndicate</div>
                                <h3 className="font-display text-4xl uppercase text-white italic mb-6">{user.crew}</h3>
                                
                                <div className="space-y-4 mb-8">
                                    <div className="bg-black/40 p-3 rounded flex items-center gap-3">
                                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold">L</div>
                                        <div className="flex-1">
                                            <div className="text-white font-bold text-sm uppercase">Leader</div>
                                            <div className="text-gray-500 text-xs">{user.username}</div>
                                        </div>
                                    </div>
                                    <div className="bg-black/40 p-3 rounded flex items-center gap-3 opacity-70">
                                        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-xs text-gray-400 font-bold">?</div>
                                        <div className="flex-1">
                                            <div className="text-white font-bold text-sm uppercase">Recruit Slot</div>
                                            <div className="text-gray-500 text-xs">Empty</div>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => alert('Invite Code Copied: SYN-8821-X')}
                                    className="w-full bg-green-600 hover:bg-green-500 text-white font-display text-xl uppercase py-3 tracking-widest flex items-center justify-center gap-2 transition-colors skew-x-[-5deg]"
                                >
                                    <Copy className="w-4 h-4" /> Invite Operative
                                </button>
                            </div>
                        </div>
                    ) : (
                         /* CREATE CREW FORM */
                        <div className="bg-gradient-to-br from-dark-800 to-black border border-white/20 p-8 rounded-xl shadow-2xl">
                             <div className="text-center mb-6">
                                <Crown className="w-12 h-12 text-neon-pink mx-auto mb-4 animate-bounce" />
                                <h3 className="font-display text-3xl uppercase text-white">Form Syndicate</h3>
                                <p className="text-gray-400 font-mono text-sm mt-2">
                                    Establish a gang. Recruit members. Dominate territory.
                                </p>
                             </div>

                             <form onSubmit={handleCreateSubmit} className="space-y-4">
                                 <div>
                                     <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Syndicate Name</label>
                                     <input 
                                        type="text" 
                                        value={gangName} 
                                        onChange={(e) => setGangName(e.target.value)}
                                        className="w-full bg-black border border-white/20 px-4 py-3 text-white font-display text-xl focus:border-neon-pink outline-none placeholder-gray-700"
                                        placeholder="E.G. NEON KINGS"
                                        maxLength={20}
                                     />
                                 </div>
                                 <button 
                                    type="submit"
                                    disabled={!gangName.trim()}
                                    className="w-full bg-white text-black font-display text-xl uppercase py-3 tracking-widest hover:bg-neon-pink hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                 >
                                     Establish
                                 </button>
                             </form>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default TimelinePage;
