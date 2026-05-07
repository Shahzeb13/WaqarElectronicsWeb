'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Users, Package, TrendingUp, History, ShieldAlert, 
  CreditCard, Store, Clock, Loader2, DollarSign, 
  Wallet, RefreshCw, Sparkles, Building2
} from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface ManagerDashboardData {
  totalEmployees: number;
  totalCustomers: number;
  totalStockItems: number;
  totalStockQuantity: number;
  totalSalesAmount: number;
  totalCashSalesAmount: number;
  totalInstallmentSalesAmount: number;
  totalRecoveryAmount: number;
  totalPendingAmount: number;
  totalExpensesAmount: number;
  pendingClaimsCount: number;
}

export default function ManagerDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<ManagerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const formatPKR = useCallback((amount: number) => {
    if (amount >= 1_000_000) return `PKR ${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000) return `PKR ${(amount / 1_000).toFixed(0)}K`;
    return `PKR ${amount.toLocaleString()}`;
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/dashboard/manager/stats');
      setData(res.data);
    } catch {
      setError('Failed to load branch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  const statCards = useMemo(() => {
    if (!data) return [];
    return [
      { label: 'Staff Members',   value: data.totalEmployees,                   icon: Users,      accent: false },
      { label: 'Total Customers', value: data.totalCustomers,                   icon: Building2,  accent: false },
      { label: 'Inventory Units', value: data.totalStockQuantity,               icon: Package,    accent: false },
      { label: 'Total Sales',     value: formatPKR(data.totalSalesAmount),      icon: TrendingUp, accent: true  },
      { label: 'Cash Sales',      value: formatPKR(data.totalCashSalesAmount),  icon: Wallet,     accent: false },
      { label: 'Installments',    value: formatPKR(data.totalInstallmentSalesAmount), icon: CreditCard, accent: false },
      { label: 'Recoveries',      value: formatPKR(data.totalRecoveryAmount),   icon: History,    accent: false },
      { label: 'Pending Balance', value: formatPKR(data.totalPendingAmount),    icon: DollarSign, accent: data.totalPendingAmount > 100000 },
      { label: 'Expenses',        value: formatPKR(data.totalExpensesAmount),   icon: DollarSign, accent: false },
      { label: 'Open Claims',     value: data.pendingClaimsCount,               icon: ShieldAlert, accent: data.pendingClaimsCount > 0 },
    ];
  }, [data, formatPKR]);

  // Logic to determine if there is "no data"
  const hasNoData = useMemo(() => {
    if (!data) return true;
    return (
      data.totalEmployees === 0 &&
      data.totalCustomers === 0 &&
      data.totalStockQuantity === 0 &&
      data.totalSalesAmount === 0
    );
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#f5c800] animate-spin" />
          <p className="text-gray-400 text-sm font-medium">Synchronizing branch data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-3">{error}</p>
          <button onClick={fetchDashboardData} className="btn-primary px-6">Retry Connection</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-7 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Branch Overview</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manager Console: {user?.branch?.name || 'Local Branch'}</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 text-sm font-medium transition-all"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {hasNoData ? (
        <div className="bg-white rounded-[32px] border border-gray-100 p-20 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-24 h-24 bg-[#f5c800]/10 rounded-[32px] flex items-center justify-center mb-8 rotate-3">
            <Sparkles size={48} className="text-[#f5c800]" />
          </div>
          <div className="max-w-md">
            <h2 className="text-3xl font-black text-gray-900 mb-3">Welcome to your new Branch!</h2>
            <p className="text-gray-500 text-[15px] font-medium leading-relaxed mb-8">
              Everything is set up and ready for operation. To see analytics here, start by onboarding your staff, adding inventory, or recording your first sale.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button className="px-6 py-3 bg-[#f5c800] text-black font-bold rounded-2xl shadow-[0_10px_20px_rgba(245,200,0,0.15)] hover:-translate-y-0.5 transition-all">
                Add Stock
              </button>
              <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all">
                View Staff
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {statCards.map((stat, i) => (
              <div
                key={i}
                className={`bg-white rounded-2xl border p-5 transition-all hover:shadow-md ${
                  stat.accent ? 'border-[#f5c800] ring-1 ring-[#f5c800]/30' : 'border-gray-100'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    stat.accent ? 'bg-[#f5c800]' : 'bg-gray-50'
                  }`}>
                    <stat.icon size={17} className={stat.accent ? 'text-black' : 'text-gray-400'} />
                  </div>
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-lg font-black text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions / Recent Activity Placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
            <div className="bg-white rounded-[24px] border border-gray-100 p-8">
              <h3 className="text-[15px] font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp size={18} className="text-[#f5c800]" />
                Recent Branch Activity
              </h3>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center">
                        <Clock size={16} className="text-gray-300" />
                      </div>
                      <div>
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-1" />
                        <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
                      </div>
                    </div>
                    <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#f5c800] rounded-[24px] p-8 relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-[15px] font-bold text-black mb-2 uppercase tracking-widest opacity-60">Manager Tip</h3>
                <h2 className="text-2xl font-black text-black leading-tight mb-6">
                  Maintain high recovery rates to boost your branch ranking.
                </h2>
                <button className="px-6 py-3 bg-black text-white font-bold rounded-2xl hover:scale-105 transition-all">
                  Check Recovery Status
                </button>
              </div>
              <Building2 size={120} className="absolute -bottom-6 -right-6 text-black/5 group-hover:scale-110 transition-transform duration-500" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
