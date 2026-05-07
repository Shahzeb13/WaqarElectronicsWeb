'use client';

import { LucideIcon } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export function PlaceholderPage({ title, description, icon: Icon }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 text-indigo-400 mb-2">
          <Icon size={24} />
          <span className="text-xs font-black uppercase tracking-[0.3em]">Module Foundation</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-white">{title}</h1>
        <p className="text-slate-400 max-w-2xl text-lg font-medium leading-relaxed">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass rounded-[24px] p-8 border border-white/[0.03] flex flex-col gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center text-slate-500">
              <Icon size={20} />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-24 bg-white/[0.05] rounded-full animate-pulse"></div>
              <div className="h-3 w-40 bg-white/[0.02] rounded-full animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass rounded-[32px] p-12 border border-white/[0.03] flex flex-col items-center justify-center text-center gap-6 min-h-[400px]">
        <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-2">
          <Icon size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">System Ready</h2>
          <p className="text-slate-500 max-w-md mx-auto">
            The {title.toLowerCase()} infrastructure is initialized. Connect your business logic to start managing data.
          </p>
        </div>
        <button className="btn-primary mt-4 px-10">
          Initialize Data Source
        </button>
      </div>
    </div>
  );
}
