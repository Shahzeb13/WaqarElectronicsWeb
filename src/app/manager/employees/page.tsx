'use client';

import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import {
  Users, Plus, Mail, Phone, Lock,
  Loader2, CheckCircle2, AlertCircle, RefreshCw,
  User as UserIcon, UserCheck
} from 'lucide-react';
import api from '@/lib/api';
import { motion } from 'framer-motion';

interface EmployeeRecord {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
}

// Memoized Table Row
const EmployeeRow = memo(({ employee }: { employee: EmployeeRecord }) => (
  <tr className="hover:bg-gray-50/50 transition-colors">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-sm">
          {employee.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-[13px] font-semibold text-gray-900">{employee.name}</p>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Field Staff</span>
        </div>
      </div>
    </td>
    <td className="px-6 py-4">
      <p className="text-[12px] text-gray-700 font-medium">{employee.email}</p>
    </td>
    <td className="px-6 py-4">
      <p className="text-[12px] text-gray-500 font-medium">{employee.phone || '—'}</p>
    </td>
    <td className="px-6 py-4">
      <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide border ${
        employee.isActive 
          ? 'bg-green-50 text-green-600 border-green-100' 
          : 'bg-red-50 text-red-500 border-red-100'
      }`}>
        <span className={`w-1 h-1 rounded-full ${employee.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
        {employee.isActive ? 'Active' : 'Suspended'}
      </span>
    </td>
    <td className="px-6 py-4">
      <p className="text-[11px] text-gray-400 font-medium">{new Date(employee.createdAt).toLocaleDateString()}</p>
    </td>
  </tr>
));

EmployeeRow.displayName = 'EmployeeRow';

export default function ManagerEmployees() {
  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await api.get('/manager/employees');
      setEmployees(res.data.employees);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      await api.post('/manager/employees', formData);
      setSuccess('Employee successfully onboarded!');
      setFormData({ name: '', email: '', phone: '', password: '' });
      fetchEmployees();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create employee');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  return (
    <div className="flex flex-col gap-7 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Branch Personnel</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage and onboard staff for your specific location</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f5c800]/10 border border-[#f5c800]/20 rounded-full">
          <UserCheck size={14} className="text-[#c9a200]" />
          <span className="text-[11px] font-bold text-[#c9a200] uppercase tracking-widest">{employees.length} Staff</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Panel */}
        <div className="lg:col-span-4 sticky top-24">
          <div className="bg-white rounded-[24px] border border-gray-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-[#f5c800] flex items-center justify-center shadow-[0_10px_20px_rgba(245,200,0,0.2)]">
                <Plus size={20} className="text-black" />
              </div>
              <h2 className="text-[16px] font-black text-gray-900">New Onboarding</h2>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="input-field"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Access</label>
                <input
                  type="email"
                  name="email"
                  className="input-field"
                  placeholder="john@waqar.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Contact Phone</label>
                <input
                  type="text"
                  name="phone"
                  className="input-field"
                  placeholder="+92 3XX XXXXXXX"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">System Password</label>
                <input
                  type="password"
                  name="password"
                  className="input-field"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-500 text-[12px] font-semibold">
                  <AlertCircle size={14} /> {error}
                </motion.div>
              )}
              
              {success && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 p-3.5 rounded-xl bg-green-50 border border-green-100 text-green-600 text-[12px] font-semibold">
                  <CheckCircle2 size={14} /> {success}
                </motion.div>
              )}

              <button 
                type="submit" 
                disabled={submitting} 
                className="btn-primary w-full py-4 mt-2"
              >
                {submitting ? <Loader2 className="animate-spin" size={18} /> : 'Complete Onboarding'}
              </button>
            </form>
          </div>
        </div>

        {/* List Panel */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-[15px] font-black text-gray-900">Active Branch Staff</h3>
              <button 
                onClick={fetchEmployees}
                className="p-2 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-all"
              >
                <RefreshCw className={loading ? 'animate-spin' : ''} size={16} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Name</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading && employees.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center">
                        <Loader2 className="w-8 h-8 text-[#f5c800] animate-spin mx-auto mb-4" />
                        <p className="text-gray-400 text-sm font-medium">Fetching branch staff...</p>
                      </td>
                    </tr>
                  ) : employees.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center">
                        <Users size={40} className="text-gray-100 mx-auto mb-4" />
                        <p className="text-gray-400 text-sm font-medium">No employees found for this branch.</p>
                      </td>
                    </tr>
                  ) : employees.map(employee => (
                    <EmployeeRow key={employee.id} employee={employee} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
