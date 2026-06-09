import React, {useState} from 'react';
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
  const [expandedAlert, setExpandedAlert] = useState<number | null>(null);

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
          <div key={idx} className="bg-white dark:bg-[#0C0C0E] border border-gray-200 dark:border-white/5 rounded-2xl group relative overflow-hidden flex flex-col transition-colors shadow-sm">
            {/* Glow */}
            <div className={`absolute top-0 right-0 w-24 h-24 blur-[40px] opacity-10 pointer-events-none rounded-full ${alert.type === 'CRITICAL' ? 'bg-red-500' : 'bg-orange-500'}`} />
            
            <div 
              className="p-3 flex items-center justify-between gap-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer z-10"
              onClick={() => setExpandedAlert(expandedAlert === idx ? null : idx)}
            >
              <div className={`w-6 h-6 rounded flex items-center justify-center border shrink-0 ${alert.type === 'CRITICAL' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-orange-500/10 border-orange-500/20 text-orange-500'}`}>
                <Alert02Icon size={12} />
              </div>
              <div className="flex flex-col truncate flex-1">
                <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">{alert.text}</h4>
                <span className="text-[9px] font-medium text-gray-500 dark:text-white/40 truncate mt-0.5">Sistem otomatik uyarısı</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`hidden sm:inline-flex text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${alert.type === 'CRITICAL' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-orange-500/10 border-orange-500/20 text-orange-500'}`}>
                  {alert.badge || alert.type}
                </span>
                <div className="w-6 h-6 rounded flex items-center justify-center text-gray-400 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <ArrowRight02Icon size={14} className={`transform transition-transform ${expandedAlert === idx ? 'rotate-90' : ''}`} />
                </div>
              </div>
            </div>

            {/* Accordion Dropdown Content */}
            {expandedAlert === idx && (
              <div className="px-4 pb-4 pt-2 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20 text-sm z-10 relative">
                <div className="mt-2 text-gray-600 dark:text-white/70 leading-relaxed mb-4">
                  Bu anomali, sistemdeki yapay zeka analiz motoru tarafından otomatik olarak tespit edilmiştir. İlgili modülde potansiyel bir risk veya performans düşüklüğü gözlemleniyor. Lütfen sorunu çözmek için detaylı inceleme yapın.
                </div>
                <div className="flex items-center gap-3">
                  <button className="h-9 px-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold rounded-lg shadow-md hover:scale-105 transition-transform">
                    Detaylı Rapor
                  </button>
                  <button 
                    className="h-9 px-4 bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white/80 text-xs font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-white/20 transition-colors"
                    onClick={(e) => { e.stopPropagation(); setExpandedAlert(null); }}
                  >
                    Kapat
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
