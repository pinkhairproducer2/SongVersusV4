import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import LandingPage from './pages/Landing';
import BattleListPage from './pages/BattleList';
import BattleDetailPage from './pages/BattleDetail';
import UploadPage from './pages/Upload';
import ProfilePage from './pages/Profile';
import LeaderboardPage from './pages/Leaderboard';
import ShopPage from './pages/Shop';
import TimelinePage from './pages/Timeline';
import AuthPage from './pages/Auth';
import { User, VisualizerType } from './types';
import { updateUserCoins } from './services/firebase';

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

const AppContent: React.FC = () => {
  const { user, loading, setUser, signOut } = useAuth();

  const currentUser = user || DEFAULT_USER;

  const handleSpendCoins = async (amount: number) => {
    if (user?.id) {
      await updateUserCoins(user.id, -amount);
      setUser(prev => prev ? { ...prev, coins: Math.max(0, prev.coins - amount) } : null);
    }
  };

  const handleEarnCoins = async (amount: number) => {
    if (user?.id) {
      await updateUserCoins(user.id, amount);
      setUser(prev => prev ? { ...prev, coins: prev.coins + amount } : null);
    }
  };

  const handleOpenDuffle = (duffleId: string) => {
    if (!user) return;
    
    const rewardCash = Math.floor(Math.random() * 500) + 100;
    
    let newVisualizer: VisualizerType | undefined;
    const roll = Math.random();
    if (roll > 0.7 && !user.unlockedVisualizers?.includes('Wave')) newVisualizer = 'Wave';
    else if (roll > 0.9 && !user.unlockedVisualizers?.includes('Orb')) newVisualizer = 'Orb';

    handleEarnCoins(rewardCash);
    
    setUser(prev => prev ? {
        ...prev,
        duffles: prev.duffles.filter(d => d.id !== duffleId),
        unlockedVisualizers: newVisualizer ? [...(prev.unlockedVisualizers || []), newVisualizer] : prev.unlockedVisualizers
    } : null);

    let message = `DUFFLE UNZIPPED!\n\nRewards:\n+ $${rewardCash}`;
    if (newVisualizer) message += `\n+ NEW VISUALIZER: ${newVisualizer}`;
    alert(message);
  };

  const handleCreateGang = (name: string) => {
    setUser(prev => prev ? { ...prev, crew: name } : null);
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
    <Routes>
      <Route path="/auth" element={user ? <Navigate to="/" replace /> : <AuthPage />} />
      <Route
        path="/*"
        element={
          <Layout user={currentUser} onOpenDuffle={handleOpenDuffle} onSignOut={signOut} isAuthenticated={!!user}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/battles" element={<BattleListPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/timeline" element={<TimelinePage user={currentUser} onCreateGang={handleCreateGang} />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/battle/:id" element={<BattleDetailPage user={currentUser} onVote={() => handleEarnCoins(10)} />} />
              <Route path="/upload" element={user ? <UploadPage user={currentUser} onPublish={() => handleSpendCoins(500)} /> : <Navigate to="/auth" replace />} />
              <Route path="/profile" element={user ? <ProfilePage currentUser={currentUser} /> : <Navigate to="/auth" replace />} />
              <Route path="/profile/:id" element={<ProfilePage currentUser={currentUser} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        }
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
