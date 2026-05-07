'use client';

import { LucideIcon, Store } from 'lucide-react';

interface PlaceholderProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export function ManagerPagePlaceholder({ title, description, icon: Icon }: PlaceholderProps) {
  return (
    <div className="flex flex-col gap-7 animate-fade-in">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-400 mt-0.5">{description}</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-20 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center mb-8 rotate-3">
          <Icon size={48} className="text-[#f5c800]" />
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-black text-gray-900">{title} Module</h2>
          <p className="text-gray-500 max-w-sm mx-auto font-medium">
            This workspace is currently being prepared for your branch operations. Stay tuned for real-time data integration.
          </p>
        </div>
        
        <div className="mt-12 flex items-center gap-3 px-5 py-2.5 bg-[#f5c800]/10 border border-[#f5c800]/20 rounded-full">
          <Store size={14} className="text-[#c9a200]" />
          <span className="text-[11px] font-bold text-[#c9a200] uppercase tracking-widest">Branch Access Only</span>
        </div>
      </div>
    </div>
  );
}
