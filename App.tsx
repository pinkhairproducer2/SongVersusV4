
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/Landing';
import BattleListPage from './pages/BattleList';
import BattleDetailPage from './pages/BattleDetail';
import UploadPage from './pages/Upload';
import ProfilePage from './pages/Profile';
import LeaderboardPage from './pages/Leaderboard';
import ShopPage from './pages/Shop';
import TimelinePage from './pages/Timeline';
import { User, VisualizerType } from './types';
import { getUserById, updateUserCoins } from './services/firebase';

const DEFAULT_USER: User = {
  id: '',
  username: 'Guest',
  avatarUrl: '',
  coins: 0,
  reputation: 0,
  rank: 'Newcomer',
  role: 'Producer',
  duffles: [],
  unlockedVisualizers: ['Bars'],
  activeVisualizer: 'Bars'
};

const App: React.FC = () => {
  const [user, setUser] = useState<User>(DEFAULT_USER);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getUserById('u1');
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const handleSpendCoins = async (amount: number) => {
    if (user.id) {
      await updateUserCoins(user.id, -amount);
      setUser(prev => ({ ...prev, coins: Math.max(0, prev.coins - amount) }));
    }
  };

  const handleEarnCoins = async (amount: number) => {
    if (user.id) {
      await updateUserCoins(user.id, amount);
      setUser(prev => ({ ...prev, coins: prev.coins + amount }));
    }
  };

  const handleOpenDuffle = (duffleId: string) => {
    const rewardCash = Math.floor(Math.random() * 500) + 100;
    
    let newVisualizer: VisualizerType | undefined;
    const roll = Math.random();
    if (roll > 0.7 && !user.unlockedVisualizers?.includes('Wave')) newVisualizer = 'Wave';
    else if (roll > 0.9 && !user.unlockedVisualizers?.includes('Orb')) newVisualizer = 'Orb';

    handleEarnCoins(rewardCash);
    
    setUser(prev => ({
        ...prev,
        duffles: prev.duffles.filter(d => d.id !== duffleId),
        unlockedVisualizers: newVisualizer ? [...(prev.unlockedVisualizers || []), newVisualizer] : prev.unlockedVisualizers
    }));

    let message = `DUFFLE UNZIPPED!\n\nRewards:\n+ $${rewardCash}`;
    if (newVisualizer) message += `\n+ NEW VISUALIZER: ${newVisualizer}`;
    alert(message);
  };

  const handleCreateGang = (name: string) => {
      setUser(prev => ({ ...prev, crew: name }));
      alert(`Syndicate "${name}" established successfully.`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-white font-display text-2xl animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Layout user={user} onOpenDuffle={handleOpenDuffle}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/battles" element={<BattleListPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/timeline" element={<TimelinePage user={user} onCreateGang={handleCreateGang} />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/battle/:id" element={<BattleDetailPage user={user} onVote={() => handleEarnCoins(10)} />} />
          <Route path="/upload" element={<UploadPage user={user} onPublish={() => handleSpendCoins(500)} />} />
          <Route path="/profile" element={<ProfilePage currentUser={user} />} />
          <Route path="/profile/:id" element={<ProfilePage currentUser={user} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
