'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Cpu,
  Store,
  Package,
  TrendingUp,
  Menu,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/branches', label: 'Branches', icon: Store },
  { href: '/dashboard/inventory', label: 'Inventory', icon: Package },
  { href: '/dashboard/sales', label: 'Sales', icon: TrendingUp },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

function DashboardSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <aside
      className="fixed top-0 left-0 h-screen flex flex-col bg-[#050508] z-50 border-r border-white/[0.03]"
      style={{ width: 'var(--sidebar-width)' }}
    >
      <div className="px-8 py-10">
        <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
          Waqar SaaS
        </h2>
      </div>

      <nav className="flex-1 flex flex-col">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-8 py-4 transition-all duration-200 group ${
                isActive ? 'nav-item-active' : 'text-slate-500 hover:text-white'
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[15px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-8 border-t border-white/[0.03]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold truncate">{user?.name}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              {user?.role?.replace('_', ' ')}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 text-red-500 font-bold text-sm hover:text-red-400 transition-colors cursor-pointer"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return null;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      <DashboardSidebar />
      <header className="fixed top-0 right-0 z-40 bg-[#050508]/80 backdrop-blur-md border-b border-white/[0.03]"
        style={{ left: 'var(--sidebar-width)', height: '70px' }}>
        <div className="h-full flex items-center px-8">
          <Menu className="text-slate-400 cursor-pointer" size={20} />
        </div>
      </header>
      <main style={{ marginLeft: 'var(--sidebar-width)', paddingTop: '100px', paddingLeft: '40px', paddingRight: '40px' }}>
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardContent>{children}</DashboardContent>
    </AuthProvider>
  );
}
