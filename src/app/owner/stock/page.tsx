'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Package, Search, Filter, Loader2, 
  RefreshCw, AlertTriangle, Building2,
  DollarSign, BarChart3, Plus, Edit2, Trash2,
  X, Camera, Save, ArrowUpRight, CheckCircle2,
  History, User, Tag, Hash, FileText
} from 'lucide-react';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

interface StockItem {
  id: string;
  name: string;
  category: string;
  description: string | null;
  purchasePrice: number;
  salePrice: number;
  quantity: number;
  lowStockThreshold: number;
  imageUrl: string | null;
  updatedAt: string;
  branch: {
    id: string;
    name: string;
  };
  createdBy: {
    name: string;
  };
}

interface Branch {
  id: string;
  name: string;
}

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all group">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-2xl ${color.bg} ${color.text} group-hover:scale-110 transition-transform`}>
        <Icon size={22} />
      </div>
    </div>
    <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">{title}</p>
    <h3 className="text-2xl font-black text-gray-900 mt-1">{value}</h3>
  </div>
);

export default function OwnerStock() {
  const [stock, setStock] = useState<StockItem[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isAddingStock, setIsAddingStock] = useState(false);
  const [stockItemToAdjust, setStockItemToAdjust] = useState<StockItem | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    purchasePrice: '',
    salePrice: '',
    quantity: '0',
    lowStockThreshold: '5',
    branchId: '',
    image: null as File | null
  });

  const [stockAdjustment, setStockAdjustment] = useState({
    quantity: '',
    supplier: '',
    notes: ''
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError('');

    // Fetch branches separately so it doesn't fail if stock fails
    api.get('/owner/branches')
      .then(res => setBranches(res.data.branches))
      .catch(err => console.error('Failed to fetch branches:', err));

    try {
      const stockRes = await api.get('/owner/stock');
      setStock(stockRes.data.stock);
    } catch (err: any) {
      setError('Failed to fetch inventory data');
      console.error('Stock fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', category: '', description: '', 
      purchasePrice: '', salePrice: '', quantity: '0', 
      lowStockThreshold: '5', branchId: '', image: null
    });
    setImagePreview(null);
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) data.append(key, value);
    });

    try {
      if (editingItem) {
        await api.put(`/owner/stock/${editingItem.id}`, data);
        setSuccess('Product updated successfully!');
      } else {
        await api.post('/owner/stock', data);
        setSuccess('Product registered successfully!');
      }
      setIsModalOpen(false);
      resetForm();
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Stock submission error:', err);
      const msg = err.response?.data?.message || 'Action failed';
      const details = err.response?.data?.error || err.response?.data?.details;
      setError(details ? `${msg}: ${JSON.stringify(details)}` : msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setIsSubmitting(true);
    try {
      await api.delete(`/owner/stock/${itemToDelete}`);
      setSuccess('Item deleted successfully');
      setIsDeleting(false);
      setItemToDelete(null);
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockItemToAdjust) return;
    setIsSubmitting(true);
    try {
      await api.patch(`/owner/stock/${stockItemToAdjust.id}/add-quantity`, stockAdjustment);
      setSuccess('Stock quantity updated!');
      setIsAddingStock(false);
      setStockAdjustment({ quantity: '', supplier: '', notes: '' });
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError('Failed to update stock');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (item: StockItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      description: item.description || '',
      purchasePrice: item.purchasePrice.toString(),
      salePrice: item.salePrice.toString(),
      quantity: item.quantity.toString(),
      lowStockThreshold: item.lowStockThreshold.toString(),
      branchId: item.branch.id,
      image: null
    });
    setImagePreview(item.imageUrl);
    setIsModalOpen(true);
  };

  const filteredStock = useMemo(() => {
    return stock.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBranch = selectedBranch === 'all' || item.branch.id === selectedBranch;
      return matchesSearch && matchesBranch;
    });
  }, [stock, searchQuery, selectedBranch]);

  const stats = useMemo(() => {
    const totalSKU = filteredStock.length;
    const totalQty = filteredStock.reduce((acc, item) => acc + item.quantity, 0);
    const totalValue = filteredStock.reduce((acc, item) => acc + (Number(item.purchasePrice) * item.quantity), 0);
    const lowStock = filteredStock.filter(item => item.quantity <= item.lowStockThreshold).length;
    return { totalSKU, totalQty, totalValue, lowStock };
  }, [filteredStock]);

  return (
    <div className="flex flex-col gap-8 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Inventory Console</h1>
          <p className="text-gray-400 font-medium mt-1">Manage and monitor stock levels across all branches</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchData}
            className="p-3 bg-white border border-gray-200 rounded-2xl text-gray-400 hover:text-[#f5c800] hover:border-[#f5c800] transition-all shadow-sm"
          >
            <RefreshCw className={loading ? 'animate-spin' : ''} size={20} />
          </button>
          <button 
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="btn-primary flex items-center gap-2 px-6 py-3.5 shadow-lg shadow-[#f5c800]/20"
          >
            <Plus size={18} />
            Add New Product
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Global SKU" value={stats.totalSKU} icon={Package} color={{ bg: 'bg-blue-50', text: 'text-blue-500' }} />
        <StatCard title="Total Units" value={stats.totalQty.toLocaleString()} icon={BarChart3} color={{ bg: 'bg-amber-50', text: 'text-amber-500' }} />
        <StatCard title="Assets Value" value={`PKR ${stats.totalValue.toLocaleString()}`} icon={DollarSign} color={{ bg: 'bg-emerald-50', text: 'text-emerald-500' }} />
        <StatCard title="Stock Alerts" value={stats.lowStock} icon={AlertTriangle} color={{ bg: 'bg-rose-50', text: 'text-rose-500' }} />
      </div>

      {/* Filters & Alerts */}
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, category or model..." 
            className="w-full bg-white border border-gray-100 rounded-[20px] py-4 pl-12 pr-6 text-[15px] font-medium focus:outline-none focus:ring-4 focus:ring-[#f5c800]/5 transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select 
              className="w-full bg-white border border-gray-100 rounded-[20px] py-4 pl-12 pr-10 text-[14px] font-bold text-gray-700 appearance-none focus:outline-none shadow-sm cursor-pointer"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              <option value="all">All Locations</option>
              {branches.map(branch => (
                <option key={branch.id} value={branch.id}>{branch.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {success && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-50 border border-emerald-100 text-emerald-600 p-4 rounded-2xl flex items-center gap-3 font-bold text-sm">
          <CheckCircle2 size={18} /> {success}
        </motion.div>
      )}

      {/* Main Table */}
      <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Item Information</th>
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Location</th>
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Valuation</th>
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Inventory</th>
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="px-8 py-32 text-center"><Loader2 className="w-10 h-10 text-[#f5c800] animate-spin mx-auto mb-4" /><p className="text-gray-500 font-bold">Synchronizing Stock...</p></td></tr>
              ) : filteredStock.length === 0 ? (
                <tr><td colSpan={5} className="px-8 py-32 text-center"><Package size={48} className="mx-auto mb-4 opacity-10" /><p className="font-bold text-lg text-gray-400">No Inventory Found</p></td></tr>
              ) : (
                filteredStock.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
                          {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" /> : <Package size={24} className="m-auto absolute inset-0 text-gray-300" />}
                        </div>
                        <div>
                          <p className="text-[15px] font-black text-gray-900 leading-tight">{item.name}</p>
                          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1">{item.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl w-fit border border-gray-100">
                        <Building2 size={13} className="text-[#f5c800]" />
                        <span className="text-[13px] font-bold text-gray-700">{item.branch.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-[15px] font-black text-gray-900">PKR {item.salePrice.toLocaleString()}</span>
                        <span className="text-[11px] font-bold text-gray-400">Cost: PKR {item.purchasePrice.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between w-32">
                          <span className={`text-[16px] font-black ${item.quantity <= item.lowStockThreshold ? 'text-red-500' : 'text-gray-900'}`}>{item.quantity} Units</span>
                          {item.quantity <= item.lowStockThreshold && <AlertTriangle size={14} className="text-red-500 animate-pulse" />}
                        </div>
                        <div className="h-1.5 w-32 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-700 ${item.quantity <= item.lowStockThreshold ? 'bg-red-500' : 'bg-[#f5c800]'}`} style={{ width: `${Math.min((item.quantity / 20) * 100, 100)}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setStockItemToAdjust(item); setIsAddingStock(true); }} className="p-2.5 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 transition-all shadow-sm" title="Add Stock">
                          <Plus size={16} />
                        </button>
                        <button onClick={() => openEditModal(item)} className="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all shadow-sm" title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => { setItemToDelete(item.id); setIsDeleting(true); }} className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all shadow-sm" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CRUD MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#f5c800] flex items-center justify-center shadow-lg shadow-[#f5c800]/20">
                    {editingItem ? <Edit2 size={22} className="text-black" /> : <Plus size={22} className="text-black" />}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900">{editingItem ? 'Update Product' : 'Register New Product'}</h2>
                    <p className="text-[13px] text-gray-400 font-medium">Fill in the technical specifications below</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 rounded-2xl hover:bg-white hover:shadow-md transition-all text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left: Image & Category */}
                  <div className="space-y-6">
                    <div className="relative group h-48 bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-[#f5c800]/50">
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} className="absolute inset-0 w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Camera size={32} className="text-white" />
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center text-gray-300 group-hover:text-[#f5c800] transition-colors">
                          <Camera size={40} className="mb-2" />
                          <span className="text-[11px] font-black uppercase tracking-widest">Upload Photo</span>
                        </div>
                      )}
                      <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1"><Building2 size={12} /> Assign Branch</label>
                      <select name="branchId" value={formData.branchId} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 text-[14px] font-bold focus:outline-none focus:border-[#f5c800] transition-all" required>
                        <option value="">Select Branch</option>
                        {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Right: Technical Details */}
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1"><Package size={12} /> Product Name</label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Dawlance Refrigerator" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 text-[14px] font-bold focus:outline-none focus:border-[#f5c800] transition-all" required />
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1"><Tag size={12} /> Brand Name </label>
                      <input type="text" name="category" value={formData.category} onChange={handleInputChange} placeholder="e.g. Home Appliances" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 text-[14px] font-bold focus:outline-none focus:border-[#f5c800] transition-all" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Buy Price</label>
                        <input type="number" name="purchasePrice" value={formData.purchasePrice} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 text-[14px] font-bold focus:outline-none focus:border-[#f5c800] transition-all" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Sell Price</label>
                        <input type="number" name="salePrice" value={formData.salePrice} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 text-[14px] font-bold focus:outline-none focus:border-[#f5c800] transition-all" required />
                      </div>
                    </div>
                    {!editingItem && (
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Initial Quantity</label>
                        <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 text-[14px] font-bold focus:outline-none focus:border-[#f5c800] transition-all" />
                      </div>
                    )}
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Low Stock Warning</label>
                      <input type="number" name="lowStockThreshold" value={formData.lowStockThreshold} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 text-[14px] font-bold focus:outline-none focus:border-[#f5c800] transition-all" />
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <label className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2"><FileText size={12} /> Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 text-[14px] font-bold focus:outline-none focus:border-[#f5c800] transition-all resize-none" placeholder="Technical specifications and details..." />
                </div>

                {error && <p className="mt-4 text-red-500 text-xs font-bold bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}

                <div className="mt-8 flex gap-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-2xl border border-gray-100 font-black text-gray-500 hover:bg-gray-50 transition-all">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex-[2] btn-primary py-4 shadow-xl shadow-[#f5c800]/20 flex items-center justify-center gap-2">
                    {isSubmitting ? <Loader2 className="animate-spin" /> : editingItem ? <><Save size={18} /> Update Item</> : <><Plus size={18} /> Register Item</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD STOCK MODAL */}
      <AnimatePresence>
        {isAddingStock && stockItemToAdjust && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddingStock(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <ArrowUpRight size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900">Add Stock</h2>
                  <p className="text-[13px] text-gray-400 font-medium">Restocking {stockItemToAdjust.name}</p>
                </div>
              </div>

              <form onSubmit={handleAddStock} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Quantity to Add</label>
                  <input type="number" required value={stockAdjustment.quantity} onChange={(e) => setStockAdjustment({...stockAdjustment, quantity: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 text-[14px] font-bold focus:outline-none focus:border-[#f5c800]" placeholder="10" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Supplier Name</label>
                  <input type="text" value={stockAdjustment.supplier} onChange={(e) => setStockAdjustment({...stockAdjustment, supplier: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 text-[14px] font-bold focus:outline-none focus:border-[#f5c800]" placeholder="ABC Distribution" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Reference/Notes</label>
                  <textarea rows={2} value={stockAdjustment.notes} onChange={(e) => setStockAdjustment({...stockAdjustment, notes: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 text-[14px] font-bold focus:outline-none focus:border-[#f5c800] resize-none" placeholder="Invoice #12345" />
                </div>

                <div className="flex gap-4 mt-8">
                  <button type="button" onClick={() => setIsAddingStock(false)} className="flex-1 py-4 font-black text-gray-400">Back</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 btn-primary py-4 shadow-lg shadow-[#f5c800]/20 flex items-center justify-center gap-2">
                    {isSubmitting ? <Loader2 className="animate-spin" /> : 'Confirm Add'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION */}
      <AnimatePresence>
        {isDeleting && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleting(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-sm bg-white rounded-[32px] shadow-2xl p-8 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={32} />
              </div>
              <h2 className="text-xl font-black text-gray-900 mb-2">Are you sure?</h2>
              <p className="text-gray-400 font-medium mb-8 text-sm">This action will permanently delete the item from global inventory. This cannot be undone.</p>
              <div className="flex gap-4">
                <button onClick={() => setIsDeleting(false)} className="flex-1 py-3.5 font-bold text-gray-400">Cancel</button>
                <button onClick={handleDelete} disabled={isSubmitting} className="flex-1 bg-red-500 text-white font-black py-3.5 rounded-2xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/20">
                  {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : 'Yes, Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
