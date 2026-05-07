'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { OwnerSidebar } from './components/OwnerSidebar';
import { Bell, Search, Loader2 } from 'lucide-react';

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) router.push('/');
      else if (user?.role !== 'OWNER') router.push('/dashboard');
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-7 h-7 text-[#f5c800] animate-spin" />
          <p className="text-gray-400 text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'OWNER') return null;

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <OwnerSidebar />

      {/* Top Header */}
      <header
        className="fixed top-0 right-0 z-40 bg-white border-b border-gray-100"
        style={{ left: 'var(--sidebar-width)', height: '72px' }}
      >
        <div className="h-full flex items-center justify-between px-10">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={15} />
            <input
              type="text"
              placeholder="Search..."
              className="bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-5 text-[13px] text-gray-700 font-medium placeholder:text-gray-400 focus:outline-none focus:border-[#f5c800] focus:ring-2 focus:ring-[#f5c800]/20 transition-all w-72"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-2 bg-green-50 border border-green-100 rounded-xl">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[12px] font-semibold text-green-600 tracking-tight">System Live</span>
            </div>
            <button className="relative p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#f5c800] rounded-full"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          marginLeft: 'var(--sidebar-width)',
          paddingTop: '72px',
          minHeight: '100vh',
        }}
      >
        <div className="p-10 max-w-[1400px] animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
