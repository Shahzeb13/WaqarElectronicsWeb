'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import {
  Building2,
  UserCog,
  Users,
  Plus,
  Loader2,
  CheckCircle,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  Shield,
} from 'lucide-react';

/* ─── Types ─── */
interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  managerId: string | null;
  isActive: boolean;
  manager: { id: string; name: string; email: string } | null;
  _count: { users: number };
}

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  branchId: string | null;
  isActive: boolean;
  phone: string | null;
  branch: { id: string; name: string } | null;
}

type Tab = 'branches' | 'managers' | 'employees';

/* ─── Toast ─── */
function Toast({ type, message }: { type: 'success' | 'error'; message: string }) {
  return (
    <div className={`${type === 'success' ? 'alert-success' : 'alert-error'} mb-5 animate-slide-up flex items-center gap-2`}>
      {type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      {message}
    </div>
  );
}

/* ─── Branches Tab ─── */
function BranchesTab() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [form, setForm] = useState({ name: '', address: '', phone: '' });

  const fetchBranches = useCallback(async () => {
    try {
      const res = await api.get('/branches');
      setBranches(res.data.branches);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBranches(); }, [fetchBranches]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setToast(null);
    try {
      await api.post('/branches', form);
      setToast({ type: 'success', message: 'Branch created successfully!' });
      setForm({ name: '', address: '', phone: '' });
      fetchBranches();
    } catch (err: any) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to create branch' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {toast && <Toast {...toast} />}

      {/* Create Form */}
      <div className="card p-6 mb-6">
        <h3 className="text-base font-semibold mb-5 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Plus size={18} style={{ color: 'var(--accent)' }} />
          Create New Branch
        </h3>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Branch Name *</label>
            <input
              className="input-field"
              placeholder="e.g. Main Branch"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">Address *</label>
            <input
              className="input-field"
              placeholder="e.g. 123 Mall Road, Lahore"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">Phone</label>
            <div className="flex gap-3">
              <input
                className="input-field flex-1"
                placeholder="e.g. 0300-1234567"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <button type="submit" disabled={saving} className="btn-primary flex-shrink-0">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                Add
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={24} className="animate-spin" style={{ color: 'var(--accent)' }} />
        </div>
      ) : branches.length === 0 ? (
        <div className="card p-12 text-center">
          <Building2 size={40} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p style={{ color: 'var(--text-muted)' }}>No branches yet. Create your first branch above.</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Branch</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Manager</th>
                <th>Employees</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((b) => (
                <tr key={b.id}>
                  <td className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    <div className="flex items-center gap-2">
                      <Building2 size={14} style={{ color: 'var(--accent)' }} />
                      {b.name}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={12} style={{ color: 'var(--text-muted)' }} />
                      {b.address}
                    </div>
                  </td>
                  <td>
                    {b.phone ? (
                      <div className="flex items-center gap-1.5">
                        <Phone size={12} style={{ color: 'var(--text-muted)' }} />
                        {b.phone}
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>—</span>
                    )}
                  </td>
                  <td>
                    {b.manager ? (
                      <span className="badge badge-manager">{b.manager.name}</span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Not assigned</span>
                    )}
                  </td>
                  <td>{b._count.users}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─── Create User Tab (for managers / employees) ─── */
function CreateUserTab({ role }: { role: 'BRANCH_MANAGER' | 'EMPLOYEE' }) {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', branchId: '' });

  // For manager assignment
  const [assignForm, setAssignForm] = useState({ managerId: '', branchId: '' });
  const [assigning, setAssigning] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [usersRes, branchesRes] = await Promise.all([
        api.get('/auth/users'),
        api.get('/branches'),
      ]);
      setUsers(usersRes.data.users.filter((u: UserItem) => u.role === role));
      setBranches(branchesRes.data.branches);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setToast(null);
    try {
      await api.post('/auth/create-user', {
        ...form,
        role,
        branchId: form.branchId || undefined,
      });
      setToast({ type: 'success', message: `${role === 'BRANCH_MANAGER' ? 'Branch Manager' : 'Employee'} created successfully!` });
      setForm({ name: '', email: '', password: '', phone: '', branchId: '' });
      fetchData();
    } catch (err: any) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to create user' });
    } finally {
      setSaving(false);
    }
  };

  const handleAssignManager = async (e: React.FormEvent) => {
    e.preventDefault();
    setAssigning(true);
    setToast(null);
    try {
      await api.post('/branches/assign-manager', assignForm);
      setToast({ type: 'success', message: 'Manager assigned to branch successfully!' });
      setAssignForm({ managerId: '', branchId: '' });
      fetchData();
    } catch (err: any) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to assign manager' });
    } finally {
      setAssigning(false);
    }
  };

  const unassignedManagers = users.filter((u) => !u.branchId);
  const unassignedBranches = branches.filter((b) => !b.managerId);

  return (
    <div className="animate-fade-in">
      {toast && <Toast {...toast} />}

      {/* Create Form */}
      <div className="card p-6 mb-6">
        <h3 className="text-base font-semibold mb-5 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Plus size={18} style={{ color: 'var(--accent)' }} />
          Create {role === 'BRANCH_MANAGER' ? 'Branch Manager' : 'Employee'} Account
        </h3>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="label">Full Name *</label>
            <input
              className="input-field"
              placeholder="e.g. Ahmed Khan"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">Email *</label>
            <input
              className="input-field"
              type="email"
              placeholder="e.g. ahmed@waqarelectronics.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">Password *</label>
            <input
              className="input-field"
              type="password"
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">Phone</label>
            <input
              className="input-field"
              placeholder="e.g. 0300-1234567"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Assign to Branch</label>
            <select
              className="input-field"
              value={form.branchId}
              onChange={(e) => setForm({ ...form, branchId: e.target.value })}
            >
              <option value="">No branch (assign later)</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button type="submit" disabled={saving} className="btn-primary w-full">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              Create Account
            </button>
          </div>
        </form>
      </div>

      {/* Assign Manager to Branch (only for managers tab) */}
      {role === 'BRANCH_MANAGER' && unassignedManagers.length > 0 && unassignedBranches.length > 0 && (
        <div className="card p-6 mb-6" style={{ borderColor: 'rgba(0, 214, 143, 0.2)' }}>
          <h3 className="text-base font-semibold mb-5 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Shield size={18} style={{ color: 'var(--success)' }} />
            Assign Manager to Branch
          </h3>
          <form onSubmit={handleAssignManager} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Select Manager</label>
              <select
                className="input-field"
                value={assignForm.managerId}
                onChange={(e) => setAssignForm({ ...assignForm, managerId: e.target.value })}
                required
              >
                <option value="">Choose a manager...</option>
                {unassignedManagers.map((u) => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Select Branch</label>
              <select
                className="input-field"
                value={assignForm.branchId}
                onChange={(e) => setAssignForm({ ...assignForm, branchId: e.target.value })}
                required
              >
                <option value="">Choose a branch...</option>
                {unassignedBranches.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button type="submit" disabled={assigning} className="btn-primary w-full"
                style={{ background: 'linear-gradient(135deg, #00d68f, #00e6a0)' }}
              >
                {assigning ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}
                Assign
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={24} className="animate-spin" style={{ color: 'var(--accent)' }} />
        </div>
      ) : users.length === 0 ? (
        <div className="card p-12 text-center">
          <Users size={40} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p style={{ color: 'var(--text-muted)' }}>
            No {role === 'BRANCH_MANAGER' ? 'branch managers' : 'employees'} yet. Create your first one above.
          </p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Branch</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                        style={{
                          background: role === 'BRANCH_MANAGER'
                            ? 'rgba(0,214,143,0.15)'
                            : 'rgba(0,180,216,0.15)',
                          color: role === 'BRANCH_MANAGER' ? 'var(--success)' : 'var(--info)',
                        }}
                      >
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      {u.name}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <Mail size={12} style={{ color: 'var(--text-muted)' }} />
                      {u.email}
                    </div>
                  </td>
                  <td>{u.phone || <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                  <td>
                    {u.branch ? (
                      <span className="badge badge-manager">{u.branch.name}</span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Not assigned</span>
                    )}
                  </td>
                  <td>
                    <span className="inline-flex items-center gap-1 text-xs font-medium"
                      style={{ color: u.isActive ? 'var(--success)' : 'var(--danger)' }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: u.isActive ? 'var(--success)' : 'var(--danger)' }} />
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─── Main Settings Page ─── */
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('branches');

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'branches', label: 'Branches', icon: Building2 },
    { id: 'managers', label: 'Branch Managers', icon: UserCog },
    { id: 'employees', label: 'Employees', icon: Users },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Settings
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Manage branches, branch managers, and employee accounts
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 p-1 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`tab flex items-center gap-2 ${activeTab === t.id ? 'tab-active' : ''}`}
          >
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'branches' && <BranchesTab />}
      {activeTab === 'managers' && <CreateUserTab role="BRANCH_MANAGER" />}
      {activeTab === 'employees' && <CreateUserTab role="EMPLOYEE" />}
    </div>
  );
}
