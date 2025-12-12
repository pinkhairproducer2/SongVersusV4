
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Battle } from '../types';
import { Shield, Hexagon, Trophy, DollarSign, Swords, Clock, Play, MapPin, Target, Edit2, Check, X } from 'lucide-react';
import Countdown from '../components/Countdown';
import { getUserById, getBattlesByUser } from '../services/firebase';

interface ProfilePageProps {
  currentUser: User;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [battles, setBattles] = useState<Battle[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
      username: '',
      bio: ''
  });

  const isOwnProfile = !id || id === currentUser.id;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (isOwnProfile) {
          setProfileUser(currentUser);
          setEditForm({
            username: currentUser.username,
            bio: currentUser.bio || ''
          });
          if (currentUser.id) {
            const userBattles = await getBattlesByUser(currentUser.id);
            setBattles(userBattles);
          }
        } else if (id) {
          const userData = await getUserById(id);
          if (userData) {
            setProfileUser(userData);
            const userBattles = await getBattlesByUser(id);
            setBattles(userBattles);
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [id, currentUser, isOwnProfile]);

  const handleSaveProfile = () => {
      setIsEditing(false);
  };

  const handleCancelEdit = () => {
      setEditForm({
          username: profileUser?.username || '',
          bio: profileUser?.bio || ''
      });
      setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="pb-12 max-w-7xl mx-auto px-4 lg:px-8 text-center pt-12">
        <div className="text-white font-display text-xl animate-pulse">Loading profile...</div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="pb-12 max-w-7xl mx-auto px-4 lg:px-8 text-center pt-12">
        <div className="text-gray-500 font-mono">User not found</div>
      </div>
    );
  }

  const displayUser = isEditing ? { ...profileUser, ...editForm } : profileUser;

  return (
    <div className="pb-12 max-w-7xl mx-auto px-4 lg:px-8">
      
      <div className="relative mt-8 mb-12">
        <div className="h-64 bg-dark-800 rounded-t-lg overflow-hidden relative border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
            <div className="absolute inset-0 bg-[url('https://picsum.photos/1200/400?grayscale')] bg-cover bg-center opacity-40"></div>
            
            {displayUser.crew && (
                <div className="absolute top-6 right-6 bg-black/80 border border-white/20 px-4 py-2 skew-x-[-10deg] z-20">
                    <span className="text-neon-pink font-display uppercase tracking-widest text-xl skew-x-[10deg] inline-block">{displayUser.crew}</span>
                </div>
            )}
        </div>

        <div className="relative z-20 -mt-16 px-8 flex flex-col md:flex-row items-end gap-8">
            <div className="relative group">
                 <div className="w-40 h-40 bg-black p-1 border-2 border-white/20 shadow-2xl relative overflow-hidden group-hover:border-neon-cyan transition-colors">
                    <img src={displayUser.avatarUrl || 'https://via.placeholder.com/160'} alt={displayUser.username} className="w-full h-full object-cover" />
                 </div>
                 <div className="absolute -bottom-3 -right-3 bg-dark-900 border border-white/20 p-2 rounded-full shadow-lg">
                    {displayUser.rank === 'Street Legend' ? <Trophy className="w-6 h-6 text-yellow-500" /> : <Shield className="w-6 h-6 text-gray-400" />}
                 </div>
            </div>

            <div className="flex-1 pb-4 w-full">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        {isEditing ? (
                            <input 
                                value={editForm.username}
                                onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                                className="text-4xl md:text-6xl font-display uppercase italic tracking-wider text-white bg-white/10 border border-white/20 outline-none px-2 w-full max-w-md"
                            />
                        ) : (
                            <h1 className="text-6xl font-display uppercase italic tracking-wider text-white drop-shadow-md leading-none">
                                {displayUser.username}
                            </h1>
                        )}
                        <span className="bg-white/10 border border-white/20 text-gray-300 text-xs font-mono px-2 py-0.5 rounded uppercase mt-2">{displayUser.role}</span>
                    </div>

                    {isOwnProfile && !isEditing && (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 bg-dark-800 hover:bg-white/10 border border-white/20 px-4 py-2 rounded text-sm text-gray-300 hover:text-white transition-colors uppercase font-mono tracking-widest"
                        >
                            <Edit2 className="w-3 h-3" /> Edit Profile
                        </button>
                    )}
                </div>

                {isEditing ? (
                    <div className="mt-2 flex flex-col gap-2 max-w-xl">
                        <textarea 
                            value={editForm.bio}
                            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                            className="bg-white/10 border border-white/20 text-gray-300 font-mono text-sm p-2 outline-none h-24 resize-none w-full"
                        />
                         <div className="flex gap-2">
                             <button onClick={handleSaveProfile} className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 text-xs font-bold uppercase rounded flex items-center gap-1">
                                 <Check className="w-3 h-3" /> Save Changes
                             </button>
                             <button onClick={handleCancelEdit} className="bg-red-600/20 hover:bg-red-600/40 text-red-500 border border-red-600/50 px-3 py-1 text-xs font-bold uppercase rounded flex items-center gap-1">
                                 <X className="w-3 h-3" /> Cancel
                             </button>
                         </div>
                    </div>
                ) : (
                    <p className="text-gray-400 font-mono text-sm max-w-xl border-l-2 border-neon-cyan pl-3">
                        {displayUser.bio || "No bio available."}
                    </p>
                )}
            </div>

            <div className="flex gap-4 pb-4 bg-black/50 p-4 rounded-lg backdrop-blur-sm border border-white/5">
                <div className="text-center px-4 border-r border-white/10">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 flex items-center justify-center gap-1"><Swords className="w-3 h-3"/> Win Rate</div>
                    <div className="text-3xl font-hud text-white leading-none">
                        {displayUser.wins ? Math.round((displayUser.wins / ((displayUser.wins || 0) + (displayUser.losses || 0))) * 100) : 0}%
                    </div>
                </div>
                <div className="text-center px-4 border-r border-white/10">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 flex items-center justify-center gap-1"><Hexagon className="w-3 h-3 text-purple-400"/> Rep</div>
                    <div className="text-3xl font-hud text-purple-400 leading-none">{displayUser.reputation}</div>
                </div>
                 <div className="text-center px-4">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 flex items-center justify-center gap-1"><DollarSign className="w-3 h-3 text-green-500"/> Cash</div>
                    <div className="text-3xl font-hud text-green-500 leading-none">${(displayUser.coins / 1000).toFixed(1)}k</div>
                </div>
            </div>
        </div>
      </div>

      <div className="flex gap-0 border-b border-white/10 mb-8">
        <button 
            onClick={() => setActiveTab('active')}
            className={`px-8 py-3 font-display text-xl uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'active' ? 'border-neon-cyan text-white bg-white/5' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
        >
            Active Missions
        </button>
        <button 
             onClick={() => setActiveTab('history')}
             className={`px-8 py-3 font-display text-xl uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'history' ? 'border-neon-cyan text-white bg-white/5' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
        >
            Dossier & Badges
        </button>
      </div>

      {activeTab === 'active' && (
         <div className="grid md:grid-cols-2 gap-6">
            {battles.length === 0 ? (
                <div className="col-span-2 py-12 text-center text-gray-500 font-mono uppercase tracking-widest border border-dashed border-white/10">
                    No active missions found for this operative.
                </div>
            ) : (
              battles.map(battle => (
                <div 
                    key={battle.id} 
                    onClick={() => navigate(`/battle/${battle.id}`)}
                    className="bg-dark-800 border border-white/10 p-4 flex gap-4 hover:border-green-500 transition-all cursor-pointer group"
                >
                    <div className="w-24 h-24 bg-black flex items-center justify-center relative border border-white/10">
                        <Play className="w-8 h-8 text-white opacity-50 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute top-1 left-1 bg-green-500/20 text-green-500 text-[10px] font-bold px-1">${battle.entryFee}</div>
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                         <div>
                            <div className="flex justify-between items-start">
                                <span className="text-xs font-bold text-neon-pink uppercase">{battle.genre}</span>
                                <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3"/> <Countdown endsAt={battle.endsAt} minimal /></span>
                            </div>
                            <h3 className="font-display text-2xl uppercase text-white mt-1 truncate">{battle.title}</h3>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                             <span className="text-[10px] font-mono text-gray-500 uppercase">VS</span>
                             <div className="flex items-center gap-2">
                                <img 
                                  src={battle.challenger?.id === displayUser.id ? battle.defender?.avatarUrl : battle.challenger?.avatarUrl} 
                                  className="w-6 h-6 rounded-full border border-white/20" 
                                />
                                <span className="text-sm font-display uppercase text-gray-300">
                                    {battle.challenger?.id === displayUser.id ? (battle.defender?.username || "Waiting...") : battle.challenger?.username}
                                </span>
                             </div>
                        </div>
                    </div>
                </div>
              ))
            )}
         </div>
      )}

      {activeTab === 'history' && (
          <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-1 bg-dark-800 border border-white/10 p-6">
                  <h3 className="font-display uppercase text-2xl text-white mb-6 flex items-center gap-2">
                      <Target className="w-5 h-5 text-neon-pink" /> Achievements
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                      <div className="aspect-square bg-black border border-white/20 flex flex-col items-center justify-center p-2 text-center hover:border-neon-pink transition-colors cursor-help group relative">
                          <Hexagon className="w-8 h-8 text-purple-500 mb-1" />
                          <span className="text-[10px] font-mono text-gray-400 uppercase leading-none">First Blood</span>
                      </div>
                      <div className="aspect-square bg-black border border-white/20 flex flex-col items-center justify-center p-2 text-center hover:border-neon-pink transition-colors opacity-50 grayscale">
                          <Trophy className="w-8 h-8 text-yellow-500 mb-1" />
                          <span className="text-[10px] font-mono text-gray-400 uppercase leading-none">Kingpin</span>
                      </div>
                      <div className="aspect-square bg-black border border-white/20 flex flex-col items-center justify-center p-2 text-center hover:border-neon-pink transition-colors">
                          <DollarSign className="w-8 h-8 text-green-500 mb-1" />
                          <span className="text-[10px] font-mono text-gray-400 uppercase leading-none">High Roller</span>
                      </div>
                  </div>
              </div>

              <div className="md:col-span-2 bg-dark-800 border border-white/10 p-6">
                 <h3 className="font-display uppercase text-2xl text-white mb-6 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-neon-cyan" /> Territory Control
                  </h3>
                  <div className="space-y-4">
                      <div>
                          <div className="flex justify-between text-xs font-mono uppercase text-gray-400 mb-1">
                              <span>Trap District</span>
                              <span className="text-white">Level 4 Influence</span>
                          </div>
                          <div className="h-2 bg-black rounded-full overflow-hidden">
                              <div className="h-full bg-neon-pink w-[75%]"></div>
                          </div>
                      </div>
                      <div>
                          <div className="flex justify-between text-xs font-mono uppercase text-gray-400 mb-1">
                              <span>Boom Bap Block</span>
                              <span className="text-white">Level 1 Influence</span>
                          </div>
                          <div className="h-2 bg-black rounded-full overflow-hidden">
                              <div className="h-full bg-yellow-500 w-[20%]"></div>
                          </div>
                      </div>
                      <div>
                          <div className="flex justify-between text-xs font-mono uppercase text-gray-400 mb-1">
                              <span>Cyber Plaza</span>
                              <span className="text-white">Level 0 Influence</span>
                          </div>
                          <div className="h-2 bg-black rounded-full overflow-hidden">
                              <div className="h-full bg-neon-cyan w-[0%]"></div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default ProfilePage;
