'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { OwnerSidebar } from '../owner/components/OwnerSidebar';
import { Menu, Bell, Search, Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/');
      } else if (user?.role === 'OWNER') {
        // Redirect owner to their specialized foundation
        router.push('/owner/dashboard');
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role === 'OWNER') {
    return null; 
  }

  // This part is for Branch Managers and Employees (future development)
  return (
    <div className="min-h-screen bg-[#050508] text-white">
      {/* For now, just show a basic layout or similar to owner for other roles */}
      <div className="p-10 flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">Manager/Employee Dashboard</h1>
        <p className="text-slate-400 text-center max-w-md">
          The specialized foundation for your role is under development. 
          Owners should use the /owner foundation.
        </p>
        <button onClick={() => router.push('/')} className="btn-primary">Back to Login</button>
      </div>
    </div>
  );
}
