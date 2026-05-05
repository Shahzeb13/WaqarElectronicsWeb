'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  ArrowUpRight,
  MoreVertical,
  Cpu,
  Monitor,
  Wifi,
  Loader2,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
} from 'recharts';

const salesData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
];

interface DashboardStats {
  branchCount: number;
  userCount: number;
  stockCount: number;
  saleCount: number;
  totalAssetsValue: number;
  revenue: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setStats(res.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-indigo-500" size={40} />
      </div>
    );
  }

  const kpiStats = [
    { label: 'Total Revenue', value: `Rs ${stats?.revenue.toLocaleString()}`, icon: DollarSign, color: '#6366f1' },
    { label: 'Total Sales', value: stats?.saleCount.toString() || '0', icon: ShoppingCart, color: '#ec4899' },
    { label: 'Stock Items', value: stats?.stockCount.toString() || '0', icon: Package, color: '#f59e0b' },
    { label: 'Active Staff', value: stats?.userCount.toString() || '0', icon: Users, color: '#10b981' },
  ];

  return (
    <div className="animate-fade-in flex gap-8">
      {/* Main Content Area */}
      <div className="flex-1">
        <div className="mb-10">
          <h1 className="text-4xl font-black mb-2">Branches Manager</h1>
          <p className="text-slate-500 max-w-xl text-lg">
            Oversee electronic retail outlet performance across the region.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="glass p-10 rounded-[32px]">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Global Reach</p>
            <h3 className="text-5xl font-black mb-2">{stats?.branchCount} Operating Hubs</h3>
          </div>
          <div className="glass p-10 rounded-[32px]">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Total Assets</p>
            <h3 className="text-5xl font-black text-emerald-400 mb-2">
              Rs {stats?.totalAssetsValue.toLocaleString()}
            </h3>
          </div>
        </div>

        {/* Branch List Section */}
        <div className="glass rounded-[32px] p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Branch Performance</h3>
            <MoreVertical size={20} className="text-slate-600" />
          </div>
          
          <div className="space-y-4">
            {[
              { name: 'Corporate HQ', icon: Monitor, color: 'bg-indigo-500/10 text-indigo-400' },
              { name: 'East Side Hub', icon: Wifi, color: 'bg-emerald-500/10 text-emerald-400' },
              { name: 'Logistics Center', icon: Cpu, color: 'bg-rose-500/10 text-rose-400' },
            ].map((branch, i) => (
              <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.04] transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${branch.color}`}>
                    <branch.icon size={24} />
                  </div>
                  <div>
                    <p className="font-bold">{branch.name}</p>
                    <p className="text-xs text-slate-500 font-medium">Last active: 2 mins ago</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-indigo-400">Rs 0</p>
                  <p className="text-[10px] font-bold text-emerald-400 flex items-center justify-end gap-1">
                    <ArrowUpRight size={10} /> +0%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar Stats */}
      <div className="w-80 flex flex-col gap-6">
        {kpiStats.map((stat, i) => (
          <div key={i} className="glass p-6 rounded-3xl relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{stat.label}</p>
              <stat.icon size={16} className="text-slate-600" />
            </div>
            <h3 className="text-3xl font-black mb-2">{stat.value}</h3>
            
            <div className="h-12 -mx-6 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <Area type="monotone" dataKey="value" stroke={stat.color} fill={stat.color} fillOpacity={0.1} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}

        <div className="glass p-6 rounded-3xl bg-indigo-600 shadow-xl shadow-indigo-500/20">
           <h3 className="text-xl font-bold mb-2">Inventory Alert</h3>
           <p className="text-sm text-indigo-100 mb-4 opacity-80">Check critical stock levels across branches.</p>
           <button className="w-full py-3 bg-white text-indigo-600 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors">Manage Stock</button>
        </div>
      </div>
    </div>
  );
}
