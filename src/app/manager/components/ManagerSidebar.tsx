'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Package,
  UserSquare2,
  TrendingUp,
  History,
  ShieldAlert,
  CreditCard,
  LogOut,
  Store
} from 'lucide-react';

const managerNavItems = [
  { href: '/manager/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/manager/employees', label: 'Employees', icon: Users },
  { href: '/manager/stock', label: 'Stock', icon: Package },
  { href: '/manager/customers', label: 'Customers', icon: UserSquare2 },
  { href: '/manager/sales', label: 'Sales', icon: TrendingUp },
  { href: '/manager/recoveries', label: 'Recoveries', icon: History },
  { href: '/manager/claims', label: 'Claims', icon: ShieldAlert },
  { href: '/manager/expenses', label: 'Expenses', icon: CreditCard },
];

export function ManagerSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <aside
      className="fixed top-0 left-0 h-screen flex flex-col bg-white border-r border-gray-100 z-50"
      style={{ width: 'var(--sidebar-width)' }}
    >
      {/* Brand */}
      <div className="px-6 pt-7 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#f5c800] flex items-center justify-center flex-shrink-0">
            <Store size={18} className="text-black" />
          </div>
          <div className="min-w-0">
            <h2 className="text-[14px] font-bold tracking-tight text-gray-900 leading-tight">Branch Manager</h2>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5 truncate">{user?.branch?.name || 'Assigned Branch'}</p>
          </div>
        </div>
      </div>

      {/* Navigation Label */}
      <div className="px-6 pt-5 pb-2">
        <p className="text-[10px] font-semibold text-gray-300 uppercase tracking-widest">Management</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-0.5">
        {managerNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 group ${
                isActive
                  ? 'bg-[#f5c800] text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <item.icon
                size={17}
                strokeWidth={isActive ? 2.5 : 2}
                className={isActive ? 'text-gray-900 flex-shrink-0' : 'text-gray-400 group-hover:text-gray-600 flex-shrink-0'}
              />
              <span className={`text-[13.5px] font-semibold ${isActive ? 'text-gray-900' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-3 px-2 py-2 rounded-xl hover:bg-gray-50 transition-all cursor-default">
          <div className="w-9 h-9 rounded-xl bg-[#f5c800]/20 border border-[#f5c800]/30 flex items-center justify-center text-gray-700 font-bold text-sm flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-gray-900 truncate leading-tight">{user?.name}</p>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">Branch Manager</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2.5 w-full px-4 py-2.5 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all text-[13px] font-semibold"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
