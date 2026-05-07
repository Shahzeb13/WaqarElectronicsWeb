'use client';

import { useState, useEffect } from 'react';
import { Store, Plus, MapPin, Phone, Loader2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import api from '@/lib/api';

interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  manager?: { id: string; name: string; email: string } | null;
  isActive: boolean;
  createdAt: string;
  _count?: { users: number; stockItems: number };
}

export default function OwnerBranches() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({ name: '', address: '', phone: '' });

  const fetchBranches = async () => {
    try { setLoading(true); const res = await api.get('/owner/branches'); setBranches(res.data.branches); }
    catch (err: any) { setError(err.response?.data?.message || 'Failed to fetch branches'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBranches(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true); setError(''); setSuccess('');
    try {
      await api.post('/owner/branches', formData);
      setSuccess('Branch created successfully!');
      setFormData({ name: '', address: '', phone: '' });
      fetchBranches();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) { setError(err.response?.data?.message || 'Failed to create branch'); }
    finally { setSubmitting(false); }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="flex flex-col gap-7 pb-12">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Branch Management</h1>
          <p className="text-sm text-gray-400 mt-0.5">Create and manage enterprise locations</p>
        </div>
        <span className="bg-[#f5c800] text-black text-[11px] font-bold px-3 py-1.5 rounded-full">
          {branches.length} Branches
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
              <h2 className="text-[15px] font-bold text-gray-900">New Branch</h2>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Branch Name *</label>
                <input
                  type="text" name="name" value={formData.name}
                  onChange={handleInputChange} placeholder="e.g. Main Street Branch"
                  className="input-field" required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Address *</label>
                <input
                  type="text" name="address" value={formData.address}
                  onChange={handleInputChange} placeholder="Street, City, Area"
                  className="input-field" required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Phone (Optional)</label>
                <input
                  type="text" name="phone" value={formData.phone}
                  onChange={handleInputChange} placeholder="+92 300 0000000"
                  className="input-field"
                />
              </div>

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

              <button type="submit" disabled={submitting} className="btn-primary w-full mt-1">
                {submitting ? <Loader2 className="animate-spin" size={16} /> : 'Create Branch'}
              </button>
            </form>
          </div>
        </div>

        {/* Branch Table */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-[15px] font-bold text-gray-900">All Branches</h2>
              <button onClick={fetchBranches} className="p-2 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-all">
                <RefreshCw className={loading ? 'animate-spin' : ''} size={15} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Branch</th>
                    <th className="px-6 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Manager</th>
                    <th className="px-6 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Staff / Stock</th>
                    <th className="px-6 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading && branches.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-16 text-center">
                      <Loader2 className="animate-spin text-gray-300 mx-auto mb-2" size={24} />
                      <p className="text-gray-400 text-sm">Loading branches...</p>
                    </td></tr>
                  ) : branches.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-16 text-center">
                      <Store size={32} className="text-gray-200 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">No branches yet. Create your first one.</p>
                    </td></tr>
                  ) : branches.map((branch) => (
                    <tr key={branch.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-[13px] font-semibold text-gray-900">{branch.name}</p>
                        <div className="flex items-center gap-1 mt-0.5 text-[11px] text-gray-400">
                          <MapPin size={10} />
                          <span className="truncate max-w-[180px]">{branch.address}</span>
                        </div>
                        {branch.phone && (
                          <div className="flex items-center gap-1 mt-0.5 text-[11px] text-gray-400">
                            <Phone size={10} /> {branch.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {branch.manager ? (
                          <div>
                            <p className="text-[13px] font-semibold text-gray-800">{branch.manager.name}</p>
                            <p className="text-[11px] text-gray-400">{branch.manager.email}</p>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-500 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                            <AlertCircle size={10} /> Unassigned
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-4">
                          <div>
                            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Staff</p>
                            <p className="text-[13px] font-bold text-gray-800">{branch._count?.users || 0}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Stock</p>
                            <p className="text-[13px] font-bold text-gray-800">{branch._count?.stockItems || 0}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                          branch.isActive ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-500 border border-red-100'
                        }`}>
                          <span className={`w-1 h-1 rounded-full ${branch.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                          {branch.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                    </tr>
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
