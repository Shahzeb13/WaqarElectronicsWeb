'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Loader2, Lock, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

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
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white overflow-hidden">
      {/* Left Panel - Visual Side */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-black">
        {/* Background Image with Overlay */}
        <img 
          src="/login-bg.png" 
          alt="Waqar Electronics" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/40 to-transparent" />
        
        {/* Decorative Circuit Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#f5c800 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />

        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#f5c800] flex items-center justify-center shadow-[0_0_20px_rgba(245,200,0,0.3)]">
              <Zap size={20} className="text-black" />
            </div>
            <span className="text-[18px] font-black text-white tracking-tight uppercase">Waqar Electronics</span>
          </motion.div>

          <div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-6xl font-black text-white leading-[1.1] mb-6">
                Manage your <br />
                <span className="text-[#f5c800]">Electronics Empire</span> <br />
                with precision.
              </h1>
              <p className="text-gray-300 text-[16px] font-medium leading-relaxed max-w-md">
                The ultimate enterprise solution for multi-branch electronics retail. 
                Track inventory, sales, and recoveries in real-time.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-12 flex items-center gap-6"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center text-[10px] font-bold text-white">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-400 font-medium italic">Trusted by managers across 12 branches</p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 1.2 }}
            className="flex items-center gap-6"
          >
            <div className="flex items-center gap-2 text-[11px] font-bold text-white uppercase tracking-widest">
              <Lock size={12} className="text-[#f5c800]" /> Secure Protocol
            </div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-white uppercase tracking-widest">
              <ShieldCheck size={12} className="text-[#f5c800]" /> Layered Access
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form Side */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#fcfcfc]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[400px]"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-[#f5c800] flex items-center justify-center">
              <Zap size={15} className="text-black" />
            </div>
            <span className="text-[14px] font-bold text-gray-800">Waqar Electronics</span>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-2">Portal Login</h2>
            <p className="text-sm text-gray-400 font-medium">Please enter your administrative credentials</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 mb-6 rounded-2xl bg-red-50 border border-red-100 text-red-500 text-[13px] font-semibold"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <input
                  type="email"
                  className="w-full bg-white border border-gray-200 rounded-2xl py-4 px-5 text-[14px] text-gray-700 font-semibold placeholder:text-gray-300 focus:outline-none focus:border-[#f5c800] focus:ring-4 focus:ring-[#f5c800]/10 transition-all shadow-sm group-hover:border-gray-300"
                  placeholder="admin@waqar.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Secure Password</label>
              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full bg-white border border-gray-200 rounded-2xl py-4 px-5 pr-12 text-[14px] text-gray-700 font-semibold placeholder:text-gray-300 focus:outline-none focus:border-[#f5c800] focus:ring-4 focus:ring-[#f5c800]/10 transition-all shadow-sm group-hover:border-gray-300"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-900 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className="relative">
                  <input type="checkbox" className="peer sr-only" />
                  <div className="w-5 h-5 border-2 border-gray-200 rounded-lg peer-checked:bg-[#f5c800] peer-checked:border-[#f5c800] transition-all" />
                  <ArrowRight size={10} className="absolute inset-0 m-auto text-black opacity-0 peer-checked:opacity-100 transition-all" />
                </div>
                <span className="text-[13px] text-gray-400 group-hover:text-gray-600 font-semibold transition-colors">Remember device</span>
              </label>
              <a href="#" className="text-[13px] font-bold text-gray-400 hover:text-black transition-colors">
                Recover access
              </a>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="relative overflow-hidden group bg-[#f5c800] text-black font-black text-[15px] py-4 rounded-2xl shadow-[0_10px_20px_rgba(245,200,0,0.2)] hover:shadow-[0_15px_30px_rgba(245,200,0,0.3)] hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={20} />
                  <span>Verifying...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Sign Into Portal</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-[13px] font-semibold text-gray-400">
            System requires authorization. Contact IT for new accounts.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function Home() {
  return <LoginForm />;
}
