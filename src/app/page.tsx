'use client';

import { useState } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Cpu, Eye, EyeOff, Loader2, Lock, ShieldCheck } from 'lucide-react';

function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'radial-gradient(circle at center, #0f0f1a 0%, #050508 100%)' }}
    >
      {/* Circuit pattern background overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '30px 30px' }}
      />

      {/* Login Card */}
      <div className="glass rounded-[32px] p-10 w-full max-w-md relative animate-slide-up"
        style={{ boxShadow: '0 40px 100px rgba(0,0,0,0.6)' }}
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', boxShadow: '0 0 30px rgba(99, 102, 241, 0.4)' }}
          >
            <Cpu size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Waqar Electronics</h1>
          <p className="text-[11px] font-bold tracking-[0.3em] text-indigo-400 uppercase">
            Enterprise Solutions
          </p>
        </div>

        {error && <div className="alert-error mb-6 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            type="email"
            className="input-field"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="input-field"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500" />
              <span className="text-sm text-slate-400 group-hover:text-slate-300">Remember me</span>
            </label>
            <a href="#" className="text-sm font-medium text-indigo-400 hover:text-indigo-300">Forgot password?</a>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg">
            {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-10 text-sm text-slate-400">
          New to Waqar? <a href="#" className="font-bold text-white hover:underline">Create an account</a>
        </p>
      </div>

      {/* Footer Badges */}
      <div className="flex gap-8 mt-12 animate-fade-in opacity-40">
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
          <Lock size={12} /> End-to-end Encrypted
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
          <ShieldCheck size={12} /> SSO Enabled
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
}
