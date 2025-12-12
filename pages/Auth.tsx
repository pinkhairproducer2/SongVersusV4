import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Zap, Mail, Lock, User, AlertCircle, Mic2, Music } from 'lucide-react';

type RoleType = 'Artist' | 'Producer';

const AuthPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<RoleType>('Artist');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (!username.trim()) {
          setError('Username is required');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        await signUp(email, password, username, role);
      } else {
        await signIn(email, password);
      }
      navigate('/');
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Email already in use');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak');
      } else {
        setError(err.message || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="fixed inset-0 bg-grid-pattern opacity-10 pointer-events-none z-0" />
      <div className="fixed inset-0 bg-vignette pointer-events-none z-0" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="absolute -inset-1 bg-neon-cyan rounded-full blur opacity-50"></div>
              <div className="relative bg-black border border-neon-cyan/50 rounded-full p-3">
                <Zap className="w-8 h-8 text-neon-cyan" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-display font-bold tracking-wider uppercase text-white italic transform -skew-x-6">
            Song<span className="text-neon-pink">Versus</span>
          </h1>
          <p className="text-gray-500 font-mono text-sm mt-2 uppercase tracking-widest">
            {isSignUp ? 'Create Your Account' : 'Access Your Account'}
          </p>
        </div>

        <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-8 shadow-2xl">
          <div className="flex mb-8">
            <button
              onClick={() => { setIsSignUp(false); setError(''); }}
              className={`flex-1 py-3 font-display uppercase tracking-widest text-lg transition-all ${
                !isSignUp 
                  ? 'text-white border-b-2 border-neon-cyan' 
                  : 'text-gray-500 border-b border-white/10 hover:text-gray-300'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsSignUp(true); setError(''); }}
              className={`flex-1 py-3 font-display uppercase tracking-widest text-lg transition-all ${
                isSignUp 
                  ? 'text-white border-b-2 border-neon-pink' 
                  : 'text-gray-500 border-b border-white/10 hover:text-gray-300'
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-mono">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <>
                <div>
                  <label className="block text-gray-400 font-mono text-xs uppercase tracking-wider mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Choose your operative name"
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-neon-cyan/50 transition-colors font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 font-mono text-xs uppercase tracking-wider mb-3">
                    Choose Your Role
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setRole('Artist')}
                      className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                        role === 'Artist'
                          ? 'border-neon-pink bg-neon-pink/10 text-white'
                          : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <Mic2 className={`w-8 h-8 ${role === 'Artist' ? 'text-neon-pink' : ''}`} />
                      <span className="font-display uppercase tracking-wider">Artist</span>
                      <span className="text-[10px] font-mono text-gray-500">Battle other artists</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('Producer')}
                      className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                        role === 'Producer'
                          ? 'border-neon-cyan bg-neon-cyan/10 text-white'
                          : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <Music className={`w-8 h-8 ${role === 'Producer' ? 'text-neon-cyan' : ''}`} />
                      <span className="font-display uppercase tracking-wider">Producer</span>
                      <span className="text-[10px] font-mono text-gray-500">Battle other producers</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-gray-400 font-mono text-xs uppercase tracking-wider mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-neon-cyan/50 transition-colors font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 font-mono text-xs uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSignUp ? 'Create a password (min 6 chars)' : 'Enter your password'}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-neon-cyan/50 transition-colors font-mono"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-lg font-display uppercase tracking-widest text-lg transition-all ${
                isSignUp
                  ? 'bg-gradient-to-r from-neon-pink to-purple-600 hover:from-neon-pink/80 hover:to-purple-600/80'
                  : 'bg-gradient-to-r from-neon-cyan to-blue-600 hover:from-neon-cyan/80 hover:to-blue-600/80'
              } text-white shadow-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 font-mono text-xs mt-6 uppercase tracking-wider">
          Secure Connection Established
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
