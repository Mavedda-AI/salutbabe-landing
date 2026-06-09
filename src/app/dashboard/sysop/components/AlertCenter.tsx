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
          <div key={idx} className="bg-white dark:bg-[#0A0A0B] border border-gray-200 dark:border-white/5 rounded-3xl p-6 group relative overflow-hidden flex flex-col gap-4 hover:border-gray-300 dark:hover:border-white/10 transition-colors">
            {/* Glow */}
            <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 pointer-events-none rounded-full ${alert.type === 'CRITICAL' ? 'bg-red-500' : 'bg-orange-500'}`} />
            
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${alert.type === 'CRITICAL' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-orange-500/10 border-orange-500/20 text-orange-500'}`}>
                  <Alert02Icon size={20} />
                </div>
                <h4 className="text-base font-bold text-gray-900 dark:text-white">{alert.text}</h4>
              </div>
              <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${alert.type === 'CRITICAL' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-orange-500/10 border-orange-500/20 text-orange-500'}`}>
                {alert.badge || alert.type}
              </span>
            </div>

            <div className="space-y-3 z-10 text-sm mt-2">
              <div className="flex flex-col gap-1">
                <span className="text-gray-500 dark:text-white/40 text-[10px] uppercase font-bold tracking-wider">Durum</span>
                <span className="text-gray-900 dark:text-white/90 font-medium">Bu otomatik bir sistem uyarısıdır.</span>
              </div>
            </div>

            <button className="w-full mt-2 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white font-bold text-sm transition-colors border border-gray-200 dark:border-white/5 flex items-center justify-center gap-2 z-10">
              Aksiyon Al <ArrowRight02Icon size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
