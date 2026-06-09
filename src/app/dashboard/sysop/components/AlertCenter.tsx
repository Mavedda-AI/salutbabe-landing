import React from 'react';
import {Alert02Icon, ArrowRight02Icon} from 'hugeicons-react';
import useSWR from 'swr';
import {apiUrl} from '../../../../lib/api';
import {useAuthStore} from '../../../../store/useAuthStore';

const fetcher = (url: string, token: string) => fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json());

export default function AlertCenter() {
  const token = useAuthStore((state) => state.token);
  const { data, isLoading } = useSWR(
    token ? [apiUrl('/admin/dashboard'), token] : null,
    ([url, token]) => fetcher(url, token)
  );

  const alerts = data?.payload?.alerts || [];

  if (isLoading) {
    return (
      <div className="mb-12">
        <h3 className="text-xs font-black text-gray-900/40 dark:text-white/40 uppercase tracking-[0.2em] mb-4 px-2">Akıllı Uyarılar</h3>
        <div className="h-32 bg-gray-100 dark:bg-white/5 animate-pulse rounded-3xl" />
      </div>
    );
  }

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 mb-8">
      <h3 className="text-xs font-black text-gray-900/40 dark:text-white/40 uppercase tracking-[0.2em] mb-2 px-2">Akıllı Uyarılar</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {alerts.map((alert: any, idx: number) => (
          <div key={idx} className="bg-white dark:bg-[#0C0C0E] border border-gray-200 dark:border-white/5 rounded-2xl p-4 group relative overflow-hidden flex items-center justify-between gap-4 hover:border-gray-300 dark:hover:border-white/10 transition-colors shadow-sm">
            {/* Glow */}
            <div className={`absolute top-0 right-0 w-24 h-24 blur-[40px] opacity-10 pointer-events-none rounded-full ${alert.type === 'CRITICAL' ? 'bg-red-500' : 'bg-orange-500'}`} />
            
            <div className="flex items-center gap-3 z-10 flex-1 min-w-0">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${alert.type === 'CRITICAL' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-orange-500/10 border-orange-500/20 text-orange-500'}`}>
                <Alert02Icon size={16} />
              </div>
              <div className="flex flex-col truncate">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{alert.text}</h4>
                <span className="text-[10px] font-medium text-gray-500 dark:text-white/40 truncate">Sistem otomatik uyarısı</span>
              </div>
            </div>

            <div className="flex items-center gap-3 z-10 shrink-0">
              <span className={`hidden sm:inline-flex text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded border ${alert.type === 'CRITICAL' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-orange-500/10 border-orange-500/20 text-orange-500'}`}>
                {alert.badge || alert.type}
              </span>
              <button className="h-8 px-3 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white font-bold text-xs transition-colors border border-gray-200 dark:border-white/5 flex items-center justify-center gap-1.5">
                <span>İncele</span>
                <ArrowRight02Icon size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
