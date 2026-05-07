'use client';

import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import {
  Users, Plus, Mail, Phone, Lock, Shield, Store,
  Loader2, CheckCircle2, AlertCircle, Calendar, BadgeCheck,
  User as UserIcon, RefreshCw
} from 'lucide-react';
import api from '@/lib/api';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  branch?: { id: string; name: string } | null;
}

interface Branch {
  id: string;
  name: string;
  managerId: string | null;
}

// Memoized Table Row for performance
const UserRow = memo(({ user, roleColor }: { user: UserRecord; roleColor: (role: string) => string }) => (
  <tr className="hover:bg-gray-50/50 transition-colors">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-sm">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-[13px] font-semibold text-gray-900">{user.name}</p>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${roleColor(user.role)}`}>
            {user.role.replace('_', ' ')}
          </span>
        </div>
      </div>
    </td>
    <td className="px-6 py-4">
      <p className="text-[12px] text-gray-700 font-medium">{user.email}</p>
      {user.phone && <p className="text-[11px] text-gray-400">{user.phone}</p>}
    </td>
    <td className="px-6 py-4">
      <div className="flex items-center gap-1.5 text-[12px] text-gray-700 font-medium">
        <Store size={11} className="text-gray-400" />
        {user.branch?.name || 'Unassigned'}
      </div>
      <p className="text-[11px] text-gray-400 mt-0.5">{new Date(user.createdAt).toLocaleDateString()}</p>
    </td>
    <td className="px-6 py-4">
      <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
        user.isActive ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-500 border border-red-100'
      }`}>
        <span className={`w-1 h-1 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
        {user.isActive ? 'Active' : 'Inactive'}
      </span>
    </td>
  </tr>
));

UserRow.displayName = 'UserRow';

export default function OwnerUsers() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', role: 'BRANCH_MANAGER', branchId: '' });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, branchesRes] = await Promise.all([api.get('/owner/users'), api.get('/owner/branches')]);
      setUsers(usersRes.data.users);
      setBranches(branchesRes.data.branches);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true); setError(''); setSuccess('');
    try {
      await api.post('/owner/users', formData);
      setSuccess(`${formData.role.replace('_', ' ')} created successfully!`);
      setFormData({ name: '', email: '', phone: '', password: '', role: 'BRANCH_MANAGER', branchId: '' });
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) { setError(err.response?.data?.message || 'Failed to create user'); }
    finally { setSubmitting(false); }
  };

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const selectableBranches = useMemo(() => {
    return formData.role === 'BRANCH_MANAGER' ? branches.filter(b => !b.managerId) : branches;
  }, [formData.role, branches]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => filter === 'ALL' || u.role === filter);
  }, [users, filter]);

  const roleColor = useCallback((role: string) => 
    role === 'OWNER' ? 'bg-[#f5c800]/20 text-[#9a7e00]' :
    role === 'BRANCH_MANAGER' ? 'bg-blue-50 text-blue-600' :
    'bg-gray-100 text-gray-500', []);

  return (
    <div className="flex flex-col gap-7 pb-12">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Directory</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage system access for all personnel</p>
        </div>
        <span className="bg-[#f5c800] text-black text-[11px] font-bold px-3 py-1.5 rounded-full">
          {users.length} Users
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Create Form */}
        <div className="lg:col-span-4 sticky top-20">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-[#f5c800] flex items-center justify-center">
                <Plus size={16} className="text-black" />
              </div>
              <h2 className="text-[15px] font-bold text-gray-900">Add Personnel</h2>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Full Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                  placeholder="Enter full name" className="input-field" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                    placeholder="email@waqar.com" className="input-field" required />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Phone</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleInputChange}
                    placeholder="Optional" className="input-field" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Password *</label>
                <input type="password" name="password" value={formData.password} onChange={handleInputChange}
                  placeholder="••••••••" className="input-field" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Role *</label>
                  <select name="role" value={formData.role} onChange={handleInputChange} className="input-field" required>
                    <option value="BRANCH_MANAGER">Manager</option>
                    <option value="EMPLOYEE">Employee</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Branch *</label>
                  <select name="branchId" value={formData.branchId} onChange={handleInputChange} className="input-field" required>
                    <option value="">Select Branch</option>
                    {selectableBranches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              </div>

              {formData.role === 'BRANCH_MANAGER' && selectableBranches.length === 0 && branches.length > 0 && (
                <p className="text-[11px] text-amber-600 font-medium">All branches already have managers.</p>
              )}

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-100 text-red-500 text-[13px] font-medium">
                  <AlertCircle size={14} /> {error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-100 text-green-600 text-[13px] font-medium animate-fade-in">
                  <CheckCircle2 size={14} /> {success}
                </div>
              )}

              <button type="submit"
                disabled={submitting || (formData.role === 'BRANCH_MANAGER' && selectableBranches.length === 0)}
                className="btn-primary w-full mt-1">
                {submitting ? <Loader2 className="animate-spin" size={16} /> : 'Complete Onboarding'}
              </button>
            </form>
          </div>
        </div>

        {/* User Table */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {['ALL', 'BRANCH_MANAGER', 'EMPLOYEE'].map(r => (
                  <button key={r} onClick={() => setFilter(r)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                      filter === r ? 'bg-[#f5c800] text-black' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                    }`}>
                    {r === 'ALL' ? 'All' : r === 'BRANCH_MANAGER' ? 'Managers' : 'Employees'}
                  </button>
                ))}
              </div>
              <button onClick={fetchData} className="p-2 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-all">
                <RefreshCw className={loading ? 'animate-spin' : ''} size={15} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Name</th>
                    <th className="px-6 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Contact</th>
                    <th className="px-6 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Branch</th>
                    <th className="px-6 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading && users.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-16 text-center">
                      <Loader2 className="animate-spin text-gray-300 mx-auto mb-2" size={24} />
                      <p className="text-gray-400 text-sm">Loading personnel...</p>
                    </td></tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-16 text-center">
                      <Users size={32} className="text-gray-200 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">No records found for this filter.</p>
                    </td></tr>
                  ) : filteredUsers.map(user => (
                    <UserRow key={user.id} user={user} roleColor={roleColor} />
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
