'use client';

import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import {
  TrendingUp, Users, Package, Store, DollarSign, Wallet,
  CreditCard, History, ShieldAlert, Building2, Users2,
  Loader2, Activity, RefreshCw, Sparkles, LayoutGrid
} from 'lucide-react';
import api from '@/lib/api';
import { motion } from 'framer-motion';

interface DashboardData {
  totalBranches: number;
  totalBranchManagers: number;
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
  branchWiseSummary: Array<{
    branchId: string;
    branchName: string;
    totalCustomers: number;
    totalSalesAmount: number;
    totalRecoveryAmount: number;
    totalPendingAmount: number;
    totalExpensesAmount: number;
    stockQuantity: number;
  }>;
}

const BranchRow = memo(({ branch, formatPKR }: { branch: any; formatPKR: (val: number) => string }) => (
  <tr className="hover:bg-gray-50/70 transition-colors">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#f5c800]/20 flex items-center justify-center flex-shrink-0">
          <Building2 size={14} className="text-[#c9a200]" />
        </div>
        <span className="text-[13px] font-semibold text-gray-900">{branch.branchName}</span>
      </div>
    </td>
    <td className="px-6 py-4 text-[13px] text-gray-700 font-medium">{branch.totalCustomers}</td>
    <td className="px-6 py-4 text-[13px] font-semibold text-gray-900">{formatPKR(branch.totalSalesAmount)}</td>
    <td className="px-6 py-4 text-[13px] font-medium text-green-600">{formatPKR(branch.totalRecoveryAmount)}</td>
    <td className="px-6 py-4">
      <span className={`text-[12px] font-semibold px-2.5 py-1 rounded-full ${
        branch.totalPendingAmount > 0 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'
      }`}>
        {formatPKR(branch.totalPendingAmount)}
      </span>
    </td>
    <td className="px-6 py-4 text-[13px] text-gray-500 font-medium">{formatPKR(branch.totalExpensesAmount)}</td>
    <td className="px-6 py-4 text-[13px] text-gray-700 font-medium">{branch.stockQuantity} units</td>
  </tr>
));

BranchRow.displayName = 'BranchRow';

export default function OwnerDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
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
      const res = await api.get('/dashboard/stats');
      setData(res.data);
    } catch {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  const statCards = useMemo(() => {
    if (!data) return [];
    return [
      { label: 'Total Branches',    value: data.totalBranches,                    icon: Store,     accent: false },
      { label: 'Branch Managers',   value: data.totalBranchManagers,              icon: Building2, accent: false },
      { label: 'Employees',         value: data.totalEmployees,                   icon: Users2,    accent: false },
      { label: 'Customers',         value: data.totalCustomers,                   icon: Users,     accent: false },
      { label: 'Total Sales',       value: formatPKR(data.totalSalesAmount),      icon: TrendingUp, accent: true  },
      { label: 'Cash Sales',        value: formatPKR(data.totalCashSalesAmount),  icon: Wallet,    accent: false },
      { label: 'Installment Sales', value: formatPKR(data.totalInstallmentSalesAmount), icon: CreditCard, accent: false },
      { label: 'Recovery Collected',value: formatPKR(data.totalRecoveryAmount),   icon: History,   accent: false },
      { label: 'Total Pending',     value: formatPKR(data.totalPendingAmount),    icon: DollarSign, accent: false },
      { label: 'Stock Units',       value: data.totalStockQuantity,               icon: Package,   accent: false },
      { label: 'Expenses',          value: formatPKR(data.totalExpensesAmount),   icon: DollarSign, accent: false },
      { label: 'Pending Claims',    value: data.pendingClaimsCount,               icon: ShieldAlert, accent: data.pendingClaimsCount > 0 },
    ];
  }, [data, formatPKR]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#f5c800] animate-spin" />
          <p className="text-gray-400 text-sm font-medium">Synchronizing enterprise data...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-3">{error}</p>
          <button onClick={fetchDashboardData} className="btn-primary px-8">Retry Connection</button>
        </div>
      </div>
    );
  }

  const isFreshSystem = data.totalBranches === 0;

  return (
    <div className="flex flex-col gap-7 pb-12 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Executive Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">Enterprise-wide analytics and performance tracking</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 text-sm font-medium transition-all"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {isFreshSystem ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[32px] border border-gray-100 p-20 flex flex-col items-center justify-center text-center shadow-sm"
        >
          <div className="w-24 h-24 bg-[#f5c800]/10 rounded-[32px] flex items-center justify-center mb-8 rotate-3">
            <Sparkles size={48} className="text-[#f5c800]" />
          </div>
          <div className="max-w-md">
            <h2 className="text-3xl font-black text-gray-900 mb-3">Enterprise Ready</h2>
            <p className="text-gray-500 text-[15px] font-medium leading-relaxed mb-8">
              Your Waqar Electronics management system is initialized. To start seeing real-time analytics, begin by creating your first branch and onboarding your regional managers.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button className="px-8 py-3.5 bg-[#f5c800] text-black font-black rounded-2xl shadow-[0_10px_20px_rgba(245,200,0,0.15)] hover:-translate-y-0.5 transition-all">
                Create First Branch
              </button>
              <button className="px-8 py-3.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all">
                Invite Staff
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Yellow Highlight Banner */}
          <div className="bg-[#f5c800] rounded-[24px] px-8 py-6 flex items-center justify-between shadow-[0_10px_30px_rgba(245,200,0,0.1)]">
            <div>
              <p className="text-[13px] font-bold text-black/40 uppercase tracking-widest mb-1">Live Network Status</p>
              <p className="text-2xl font-black text-black">
                {data.totalBranches} Branches · {data.totalBranchManagers + data.totalEmployees} Active Staff · {data.totalCustomers} Registered Customers
              </p>
            </div>
            <Activity size={32} className="text-black/20" />
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {statCards.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`bg-white rounded-[24px] border p-6 transition-all hover:shadow-md ${
                  stat.accent ? 'border-[#f5c800] ring-1 ring-[#f5c800]/30' : 'border-gray-100'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    stat.accent ? 'bg-[#f5c800]' : 'bg-gray-50'
                  }`}>
                    <stat.icon size={18} className={stat.accent ? 'text-black' : 'text-gray-400'} />
                  </div>
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-xl font-black text-gray-900">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Branch Performance Table */}
          <div className="bg-white rounded-[28px] border border-gray-100 overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                  <LayoutGrid size={18} className="text-gray-400" />
                </div>
                <div>
                  <h2 className="text-[16px] font-black text-gray-900">Branch Matrix</h2>
                  <p className="text-xs text-gray-400 font-medium">Aggregated operational metrics across regions</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#c9a200] bg-[#f5c800]/10 border border-[#f5c800]/20 px-4 py-1.5 rounded-full uppercase tracking-wide">
                {data.branchWiseSummary.length} Active Nodes
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Branch Name</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Client Base</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gross Revenue</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recoveries</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Receivables</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Op-Expenses</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.branchWiseSummary.map((branch) => (
                    <BranchRow key={branch.branchId} branch={branch} formatPKR={formatPKR} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
