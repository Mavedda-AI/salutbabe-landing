import React, {useState} from 'react';
import {Alert02Icon, ArrowRight02Icon} from 'hugeicons-react';
import useSWR from 'swr';
import {useRouter} from 'next/navigation';
import {apiUrl} from '../../../../lib/api';
import {useAuthStore} from '../../../../store/useAuthStore';

const fetcher = (url: string, token: string) => fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json());

export default function AlertCenter() {
  const router = useRouter();
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
        <h3 className="text-xs font-black text-gray-900/40 dark:text-white/40 uppercase tracking-[0.2em] mb-4 px-2">Uyarılar</h3>
        <div className="h-32 bg-gray-100 dark:bg-white/5 animate-pulse rounded-3xl" />
      </div>
    );
  }

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-black text-gray-900/40 dark:text-white/40 uppercase tracking-[0.2em] mb-1 px-2">Uyarılar</h3>
      <div className="flex flex-col gap-1">
        {alerts.map((alert: any, idx: number) => (
          <div key={idx} className="group relative overflow-hidden flex flex-col transition-colors border-b border-gray-100 dark:border-white/5 last:border-0">
            
            <div 
              className="py-2 px-1 flex items-center justify-between gap-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer z-10"
              onClick={() => setExpandedAlert(expandedAlert === idx ? null : idx)}
            >
              <div className={`w-6 h-6 rounded flex items-center justify-center border shrink-0 ${alert.type === 'CRITICAL' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-gray-100 dark:bg-white/10 border-black dark:border-white/20 text-[#101516] dark:text-[#101516] dark:text-white'}`}>
                <Alert02Icon size={12} />
              </div>
              <div className="truncate flex-1">
                <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">{alert.text}</h4>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`hidden sm:inline-flex text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${alert.type === 'CRITICAL' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-gray-100 dark:bg-white/10 border-black dark:border-white/20 text-[#101516] dark:text-[#101516] dark:text-white'}`}>
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
                  <button 
                    className="h-9 px-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold rounded-lg shadow-md hover:scale-105 transition-transform"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (alert.text.includes('ilan onay bekliyor')) {
                        router.push('/dashboard/sysop/product-approval');
                      } else if (alert.text.includes('Kargo gecikme')) {
                        router.push('/dashboard/sysop/order-management');
                      } else if (alert.text.includes('şikayet')) {
                        router.push('/dashboard/sysop/report-management');
                      } else {
                        window.alert('Bu modül için detaylı rapor sayfası geliştirme aşamasındadır.');
                      }
                    }}
                  >
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
