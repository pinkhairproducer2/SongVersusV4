
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { Hexagon, Menu, Plus, Zap, Map, Radio, Trophy, ShoppingCart, Briefcase, Search, X, Lock, CheckCircle2, User as UserIcon, Activity } from 'lucide-react';
import { searchUsers } from '../services/firebase';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onOpenDuffle?: (id: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onOpenDuffle }) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [duffleOpen, setDuffleOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{id: string, username: string, role: string, avatar: string}[]>([]);

  const readyDuffles = user.duffles?.filter(d => d.status === 'ready').length || 0;

  useEffect(() => {
    const doSearch = async () => {
      if (searchQuery.length >= 2) {
        try {
          const users = await searchUsers(searchQuery);
          setSearchResults(users.map(u => ({
            id: u.id,
            username: u.username,
            role: u.role,
            avatar: u.avatarUrl
          })));
        } catch (error) {
          console.error('Search error:', error);
        }
      } else {
        setSearchResults([]);
      }
    };
    const timer = setTimeout(doSearch, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSelect = (userId: string) => {
      navigate(`/profile/${userId}`);
      setSearchOpen(false);
      setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-dark-900 text-gray-200 font-sans selection:bg-green-500 selection:text-black flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 bg-grid-pattern opacity-10 pointer-events-none z-0" />
      <div className="fixed inset-0 bg-vignette pointer-events-none z-0" />

      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/10 h-16 flex items-center justify-between px-4 lg:px-8 shadow-lg">
        
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/')}>
          <div className="relative group">
            <div className="absolute -inset-1 bg-neon-cyan rounded-full blur opacity-25 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-black border border-neon-cyan/50 rounded-full p-2">
              <Zap className="w-5 h-5 text-neon-cyan" />
            </div>
          </div>
          <h1 className="text-2xl font-display font-bold tracking-wider uppercase text-white italic transform -skew-x-6 hidden sm:block">
            Song<span className="text-neon-pink">Versus</span>
          </h1>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" className={({ isActive }) => `flex items-center gap-2 font-display text-lg uppercase tracking-widest hover:text-white transition-colors ${isActive ? 'text-white border-b-2 border-neon-cyan' : 'text-gray-500'}`}>
            <Map className="w-4 h-4" /> Map
          </NavLink>
          <NavLink to="/battles" className={({ isActive }) => `flex items-center gap-2 font-display text-lg uppercase tracking-widest hover:text-white transition-colors ${isActive ? 'text-white border-b-2 border-neon-cyan' : 'text-gray-500'}`}>
            <Radio className="w-4 h-4" /> Missions
          </NavLink>
           <NavLink to="/leaderboard" className={({ isActive }) => `flex items-center gap-2 font-display text-lg uppercase tracking-widest hover:text-white transition-colors ${isActive ? 'text-white border-b-2 border-neon-cyan' : 'text-gray-500'}`}>
            <Trophy className="w-4 h-4" /> Leaderboard
          </NavLink>
          <NavLink to="/timeline" className={({ isActive }) => `flex items-center gap-2 font-display text-lg uppercase tracking-widest hover:text-white transition-colors ${isActive ? 'text-white border-b-2 border-neon-cyan' : 'text-gray-500'}`}>
            <Activity className="w-4 h-4" /> Timeline
          </NavLink>
           <NavLink to="/shop" className={({ isActive }) => `flex items-center gap-2 font-display text-lg uppercase tracking-widest hover:text-white transition-colors ${isActive ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-500'}`}>
            <ShoppingCart className="w-4 h-4" /> Black Market
          </NavLink>
        </nav>

        <div className="flex items-center gap-4 lg:gap-6">
          
          <div className="flex items-center gap-2">
             <NavLink to="/upload" className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/20 px-4 py-1.5 rounded hover:bg-white/10 transition-all group">
                <Plus className="w-4 h-4 text-neon-pink group-hover:text-white" />
                <span className="font-hud text-lg text-gray-300 group-hover:text-white tracking-widest uppercase">Upload</span>
             </NavLink>
             <button onClick={() => setSearchOpen(true)} className="bg-white/5 border border-white/20 p-2 rounded hover:bg-white/10 transition-colors">
                <Search className="w-5 h-5 text-neon-cyan" />
             </button>
          </div>
          
          <div className="flex flex-col items-end cursor-pointer" onClick={() => setDuffleOpen(true)}>
             <div className="text-2xl font-display font-bold text-green-500 tracking-wide drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] leading-none">
                ${user.coins?.toLocaleString() || '0'}
             </div>
             <div className="flex items-center gap-1 group">
                <span className="text-[10px] text-gray-400 font-mono uppercase group-hover:text-white transition-colors">Duffles</span>
                <Briefcase className={`w-3 h-3 ${readyDuffles > 0 ? 'text-yellow-400 animate-bounce' : 'text-gray-500'}`} />
                {readyDuffles > 0 && <span className="text-[10px] bg-yellow-400 text-black px-1 rounded-sm font-bold leading-none">{readyDuffles}</span>}
             </div>
          </div>

          <div 
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden relative group cursor-pointer hover:border-green-500 transition-colors"
          >
            <img src={user.avatarUrl || 'https://via.placeholder.com/40'} alt="User" className="w-full h-full object-cover" />
          </div>

          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {searchOpen && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-start justify-center pt-24 px-4">
              <div className="bg-dark-900 border border-white/10 w-full max-w-lg rounded-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                  <div className="p-4 border-b border-white/10 flex items-center gap-3">
                      <Search className="w-5 h-5 text-gray-500" />
                      <input 
                        autoFocus
                        placeholder="SEARCH OPERATIVES..." 
                        className="bg-transparent w-full text-xl font-display uppercase tracking-wider text-white outline-none placeholder-gray-600"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <button onClick={() => setSearchOpen(false)}><X className="w-5 h-5 text-gray-500 hover:text-white" /></button>
                  </div>
                  <div className="p-2 max-h-64 overflow-y-auto">
                      {searchResults.map(u => (
                          <div 
                            key={u.id} 
                            onClick={() => handleSearchSelect(u.id)}
                            className="flex items-center gap-3 p-3 hover:bg-white/5 rounded cursor-pointer group transition-colors"
                          >
                              <img src={u.avatar || 'https://via.placeholder.com/40'} className="w-10 h-10 rounded border border-white/10" />
                              <div>
                                  <div className="font-display text-lg uppercase text-white group-hover:text-neon-cyan">{u.username}</div>
                                  <div className="text-xs font-mono text-gray-500 uppercase">{u.role}</div>
                              </div>
                          </div>
                      ))}
                      {searchQuery.length >= 2 && searchResults.length === 0 && (
                          <div className="p-4 text-center text-gray-500 font-mono text-sm">No operatives found.</div>
                      )}
                      {searchQuery.length < 2 && (
                          <div className="p-4 text-center text-gray-500 font-mono text-sm">Type at least 2 characters to search.</div>
                      )}
                  </div>
              </div>
              <div className="fixed inset-0 -z-10" onClick={() => setSearchOpen(false)}></div>
          </div>
      )}

      {duffleOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-dark-800 border border-white/20 w-full max-w-2xl rounded-xl shadow-2xl relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500"></div>
                <button onClick={() => setDuffleOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X className="w-6 h-6" /></button>
                
                <div className="p-8">
                    <h2 className="text-4xl font-display uppercase italic text-white mb-2 flex items-center gap-3">
                        <Briefcase className="w-8 h-8 text-yellow-500" /> Duffle Inventory
                    </h2>
                    <p className="text-gray-400 font-mono text-sm mb-8">
                        Secure your earnings. Duffles take 24 hours to decrypt.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6">
                        {(user.duffles || []).map((duffle) => (
                            <div key={duffle.id} className="bg-black/40 border border-white/10 rounded-lg p-6 flex flex-col items-center justify-center text-center relative group overflow-hidden">
                                {duffle.status === 'ready' ? (
                                    <>
                                        <div className="absolute inset-0 bg-yellow-500/10 animate-pulse"></div>
                                        <Briefcase className="w-16 h-16 text-yellow-400 mb-4 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                                        <h3 className="font-display text-xl uppercase text-white mb-2">{duffle.type} Duffle</h3>
                                        <button 
                                            onClick={() => onOpenDuffle && onOpenDuffle(duffle.id)}
                                            className="bg-yellow-500 text-black font-bold uppercase tracking-widest text-sm px-6 py-2 rounded hover:bg-white transition-colors"
                                        >
                                            UNZIP
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-12 h-12 text-gray-600 mb-4" />
                                        <h3 className="font-display text-xl uppercase text-gray-400 mb-2">{duffle.type} Duffle</h3>
                                        <div className="font-mono text-xs text-neon-cyan border border-neon-cyan/30 px-2 py-1 rounded bg-neon-cyan/5">
                                            UNLOCKS IN 14H 20M
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                        
                        {[...Array(Math.max(0, 3 - (user.duffles?.length || 0)))].map((_, i) => (
                             <div key={`empty-${i}`} className="bg-black/20 border-2 border-dashed border-white/5 rounded-lg p-6 flex flex-col items-center justify-center text-center opacity-50">
                                 <div className="w-12 h-12 rounded-full bg-white/5 mb-4"></div>
                                 <p className="text-xs font-mono uppercase text-gray-600">Empty Slot</p>
                             </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="fixed inset-0 -z-10" onClick={() => setDuffleOpen(false)}></div>
        </div>
      )}

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/95 flex flex-col items-center justify-center gap-8 p-8">
            <button className="absolute top-6 right-6 text-gray-400" onClick={() => setMobileMenuOpen(false)}>Close [X]</button>
            <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-display uppercase tracking-widest text-white hover:text-green-500">Map Hub</NavLink>
            <NavLink to="/battles" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-display uppercase tracking-widest text-white hover:text-green-500">Missions</NavLink>
            <NavLink to="/leaderboard" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-display uppercase tracking-widest text-white hover:text-green-500">Leaderboard</NavLink>
            <NavLink to="/timeline" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-display uppercase tracking-widest text-white hover:text-green-500">Timeline</NavLink>
            <NavLink to="/shop" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-display uppercase tracking-widest text-green-500 hover:text-white">Black Market</NavLink>
            <NavLink to="/upload" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-display uppercase tracking-widest text-neon-pink">Create Job</NavLink>
            <NavLink to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-display uppercase tracking-widest text-purple-400">My Profile</NavLink>
        </div>
      )}

      <main className="flex-1 relative z-10 overflow-y-auto">
        {children}
      </main>

      <footer className="bg-black border-t border-white/5 py-2 px-6 text-[10px] text-gray-600 font-mono flex justify-between items-center z-20">
        <div className="flex gap-4">
            <span>LOS SANTOS REGION</span>
            <span>SERVER: ONLINE</span>
        </div>
        <div className="flex gap-4">
          <span>BUILD 2.6.0</span>
          <span className="text-green-500">SECURE CONNECTION</span>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
