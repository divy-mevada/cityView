import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, User, Lock, ShieldCheck, Globe, Zap } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { role } = useParams<{ role: 'citizen' | 'government' }>();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    setError('');
    const success = await login(username, password, role!);

    if (success) {
      navigate(role === 'government' ? '/government' : '/citizen');
    } else {
      setError(role === 'government'
        ? 'Invalid credentials. Hint: divy / 1234'
        : 'Invalid credentials. Hint: tirth / 1234');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-8 overflow-hidden bg-[#f0f7ff]">
      {/* --- AESTHETIC BACKGROUND LAYER --- */}
      <div className="absolute inset-0 z-0">
        {/* Animated Gradient Blobs */}
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-blue-400/20 blur-[100px] animate-blob" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-indigo-400/20 blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-sky-300/20 blur-[80px] animate-blob animation-delay-4000" />
        
        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="group flex items-center text-blue-600/70 hover:text-blue-700 transition-all mb-8 font-bold"
        >
          <div className="p-2 rounded-xl bg-white/50 backdrop-blur-md group-hover:bg-white transition-all mr-3 shadow-sm border border-white/50">
            <ArrowLeft size={18} />
          </div>
          <span className="text-sm tracking-wide">Back to Home</span>
        </button>

        {/* --- LOGIN CARD --- */}
        <div className="bg-white/40 backdrop-blur-3xl rounded-[3rem] border border-white/60 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-700 hover:shadow-[0_40px_80px_-16px_rgba(59,130,246,0.15)]">
          
          {/* Top Header */}
          <div className="px-8 pt-12 pb-8 text-center relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
            
            <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
              <div className="absolute inset-0 bg-blue-600 rounded-[2rem] rotate-6 opacity-20 animate-pulse"></div>
              <div className="relative w-full h-full rounded-[1.8rem] bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-2xl flex items-center justify-center transform transition-transform hover:scale-105">
                <ShieldCheck size={38} strokeWidth={1.5} />
              </div>
            </div>

            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
              {role === 'government' ? 'Official' : 'Resident'} Login
            </h1>
            <div className="flex items-center justify-center gap-2">
              <span className="h-px w-4 bg-blue-200"></span>
              <p className="text-blue-600/60 font-black text-[10px] uppercase tracking-[0.3em]">
                {role === 'government' ? 'Secured Network' : 'City Access'}
              </p>
              <span className="h-px w-4 bg-blue-200"></span>
            </div>
          </div>

          <div className="px-10 pb-12">
            <div className="space-y-6">
              {/* Identity Field */}
              <div className="group">
                <div className="flex justify-between mb-2 px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">User Identity</label>
                  <Globe size={12} className="text-slate-300 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={role === 'government' ? 'Enter Admin ID' : 'Enter Resident ID'}
                    className="w-full pl-12 pr-6 py-4.5 bg-white/60 border border-white rounded-[1.5rem] text-slate-900 placeholder-slate-400 transition-all focus:outline-none focus:bg-white focus:ring-[6px] focus:ring-blue-500/5 focus:border-blue-400 shadow-sm font-semibold"
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="group">
                <div className="flex justify-between mb-2 px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Security Key</label>
                  <Zap size={12} className="text-slate-300 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-6 py-4.5 bg-white/60 border border-white rounded-[1.5rem] text-slate-900 placeholder-slate-400 transition-all focus:outline-none focus:bg-white focus:ring-[6px] focus:ring-blue-500/5 focus:border-blue-400 shadow-sm font-semibold"
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  />
                </div>
              </div>

              {error && (
                <div className="px-5 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl animate-shake">
                  <p className="text-[11px] font-bold text-red-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_red]" />
                    {error}
                  </p>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full group relative py-5 bg-slate-900 text-white font-black rounded-[1.5rem] overflow-hidden transition-all shadow-xl active:scale-[0.98] disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative z-10 flex items-center justify-center gap-3 tracking-widest uppercase text-xs">
                  {loading ? (
                    <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Establish Link <Zap size={16} fill="white" /> </>
                  )}
                </span>
              </button>

              <div className="flex flex-col gap-4 items-center">
                <div className="px-4 py-2 bg-blue-500/5 rounded-xl border border-blue-500/10">
                   <p className="text-[10px] font-bold text-blue-600/60 uppercase tracking-tighter italic">
                     Demo System: {role === 'government' ? 'divy' : 'tirth'} / 1234
                   </p>
                </div>
                
                <p className="text-sm font-bold text-slate-400">
                  New user?{' '}
                  <button
                    onClick={() => navigate(`/register/${role}`)}
                    className="text-blue-600 hover:text-indigo-600 transition-colors underline decoration-2 underline-offset-4"
                  >
                    Register Identity
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- SYSTEM FOOTER --- */}
        <div className="mt-12 flex flex-col items-center gap-4">
            <div className="flex gap-8">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] opacity-50">v4.0.2 Stable</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] opacity-50">AES-256 Encrypted</span>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-emerald-600/70 uppercase tracking-widest">All City Systems Operational</span>
            </div>
        </div>
      </div>
    </div>
  );
};