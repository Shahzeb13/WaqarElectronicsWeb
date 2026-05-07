'use client';

import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import {
  Package, Plus, Search, Filter, Loader2, 
  CheckCircle2, AlertCircle, RefreshCw,
  Camera, Tag, Hash, DollarSign, AlertTriangle
} from 'lucide-react';
import api from '@/lib/api';
import { motion } from 'framer-motion';

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
}

const StockRow = memo(({ item }: { item: StockItem }) => (
  <tr className="hover:bg-gray-50/50 transition-colors border-b border-gray-50">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-gray-100 border border-gray-100" />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
            <Package size={20} />
          </div>
        )}
        <div>
          <p className="text-[13px] font-bold text-gray-900 leading-tight">{item.name}</p>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.category}</span>
        </div>
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="flex flex-col">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Sell Price</span>
        <span className="text-[13px] font-black text-gray-900">PKR {item.salePrice.toLocaleString()}</span>
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="flex items-center gap-2">
        <span className={`text-[14px] font-black ${item.quantity <= item.lowStockThreshold ? 'text-red-500' : 'text-gray-900'}`}>
          {item.quantity}
        </span>
        {item.quantity <= item.lowStockThreshold && (
          <div className="p-1 rounded-full bg-red-50 text-red-500">
            <AlertTriangle size={12} />
          </div>
        )}
      </div>
    </td>
    <td className="px-6 py-4">
      <p className="text-[11px] text-gray-400 font-medium">Updated {new Date(item.updatedAt).toLocaleDateString()}</p>
    </td>
  </tr>
));

StockRow.displayName = 'StockRow';

export default function ManagerStock() {
  const [stock, setStock] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    purchasePrice: '',
    salePrice: '',
    quantity: '',
    lowStockThreshold: '5',
    image: null as File | null
  });

  const fetchStock = async () => {
    try {
      setLoading(true);
      const res = await api.get('/manager/stock');
      setStock(res.data.stock);
    } catch (err: any) {
      setError('Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStock(); }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) data.append(key, value);
    });

    try {
      await api.post('/manager/stock', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess('Product added to inventory!');
      setFormData({
        name: '', category: '', description: '', 
        purchasePrice: '', salePrice: '', quantity: '', 
        lowStockThreshold: '5', image: null
      });
      setImagePreview(null);
      fetchStock();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-7 pb-12 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-sm text-gray-400 mt-0.5">Track and manage product stock at this location</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-[#f5c800]/10 border border-[#f5c800]/20 rounded-xl">
          <Package size={16} className="text-[#c9a200]" />
          <span className="text-[13px] font-bold text-[#c9a200]">{stock.length} SKU Items</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Add Product Form */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-[#f5c800] flex items-center justify-center shadow-lg shadow-[#f5c800]/20">
                <Plus size={20} className="text-black" />
              </div>
              <h2 className="text-[17px] font-black text-gray-900">New Product</h2>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Image Upload Area */}
              <div className="relative group h-40 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center transition-all hover:border-[#f5c800]/50 overflow-hidden">
                {imagePreview ? (
                  <>
                    <img src={imagePreview} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera size={24} className="text-white" />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-gray-300 group-hover:text-[#f5c800] transition-colors">
                    <Camera size={32} className="mb-2" />
                    <span className="text-[11px] font-bold uppercase tracking-widest">Upload Photo</span>
                  </div>
                )}
                <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Product Name</label>
                  <input type="text" name="name" className="input-field" placeholder="iPhone 15 Pro" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Category</label>
                  <input type="text" name="category" className="input-field" placeholder="Mobile Phones" value={formData.category} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Buy Price (PKR)</label>
                  <input type="number" name="purchasePrice" className="input-field" placeholder="150000" value={formData.purchasePrice} onChange={handleInputChange} required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Sell Price (PKR)</label>
                  <input type="number" name="salePrice" className="input-field" placeholder="185000" value={formData.salePrice} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Initial Qty</label>
                  <input type="number" name="quantity" className="input-field" placeholder="10" value={formData.quantity} onChange={handleInputChange} required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Low Stock Alert</label>
                  <input type="number" name="lowStockThreshold" className="input-field" placeholder="5" value={formData.lowStockThreshold} onChange={handleInputChange} />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-50 text-red-500 text-[12px] font-bold border border-red-100">
                  <AlertCircle size={14} /> {error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 p-3.5 rounded-xl bg-green-50 text-green-600 text-[12px] font-bold border border-green-100">
                  <CheckCircle2 size={14} /> {success}
                </div>
              )}

              <button disabled={submitting} type="submit" className="btn-primary w-full py-4 mt-2">
                {submitting ? <Loader2 className="animate-spin" size={18} /> : 'Register Product'}
              </button>
            </form>
          </div>
        </div>

        {/* Inventory List */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                  <Search size={16} className="text-gray-300" />
                </div>
                <h3 className="text-[16px] font-black text-gray-900">Current Inventory</h3>
              </div>
              <button onClick={fetchStock} className="p-2.5 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all text-gray-400 hover:text-[#f5c800]">
                <RefreshCw className={loading ? 'animate-spin' : ''} size={16} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product Details</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pricing</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stock</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Last Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading && stock.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-32 text-center">
                        <Loader2 className="w-8 h-8 text-[#f5c800] animate-spin mx-auto mb-4" />
                        <p className="text-gray-400 text-sm font-medium">Scanning inventory...</p>
                      </td>
                    </tr>
                  ) : stock.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-32 text-center">
                        <Package size={48} className="text-gray-100 mx-auto mb-4" />
                        <p className="text-gray-400 text-sm font-medium">No products found in this branch.</p>
                      </td>
                    </tr>
                  ) : stock.map(item => (
                    <StockRow key={item.id} item={item} />
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
