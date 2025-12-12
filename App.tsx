
import React, { useState } from 'react';
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

// Mock current user
import { User, VisualizerType } from './types';

const CURRENT_USER: User = {
  id: 'u1',
  username: 'BeatMaster_X',
  avatarUrl: 'https://picsum.photos/100/100',
  coins: 5250,
  reputation: 12, // Formerly orbs
  rank: 'Street Legend',
  crew: '808 Mafia',
  bio: 'Producing beats since 2018. King of the Trap District.',
  wins: 24,
  losses: 5,
  role: 'Producer',
  unlockedVisualizers: ['Bars'],
  activeVisualizer: 'Bars',
  duffles: [
    { id: 'd1', acquiredAt: Date.now() - 90000000, unlocksAt: Date.now() - 1000, status: 'ready', type: 'Gold' },
    { id: 'd2', acquiredAt: Date.now(), unlocksAt: Date.now() + 86400000, status: 'locked', type: 'Standard' }
  ]
};

const App: React.FC = () => {
  const [user, setUser] = useState<User>(CURRENT_USER);

  const handleSpendCoins = (amount: number) => {
    setUser(prev => ({ ...prev, coins: Math.max(0, prev.coins - amount) }));
  };

  const handleEarnCoins = (amount: number) => {
    setUser(prev => ({ ...prev, coins: prev.coins + amount }));
  };

  const handleOpenDuffle = (duffleId: string) => {
      // Simulate rewards
      const rewardCash = Math.floor(Math.random() * 500) + 100;
      
      // Random chance to unlock visualizer
      let newVisualizer: VisualizerType | undefined;
      const roll = Math.random();
      if (roll > 0.7 && !user.unlockedVisualizers?.includes('Wave')) newVisualizer = 'Wave';
      else if (roll > 0.9 && !user.unlockedVisualizers?.includes('Orb')) newVisualizer = 'Orb';

      handleEarnCoins(rewardCash);
      
      // Remove duffle and update items
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
