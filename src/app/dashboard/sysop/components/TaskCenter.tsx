import React, {useState} from 'react';
import {ArrowRight01Icon, Task01Icon} from 'hugeicons-react';
import {useRouter} from 'next/navigation';
import useSWR from 'swr';
import {apiUrl} from '../../../../lib/api';
import {useAuthStore} from '../../../../store/useAuthStore';

const fetcher = (url: string, token: string) => fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json());

const tasks = [
  { id: 1, title: 'Başarısız ödemeleri incele', impact: 'Yüksek', area: 'Finans', domain: 'financial' },
  { id: 2, title: 'Bekleyen faturaları kes', impact: 'Yüksek', area: 'Muhasebe', domain: 'accounting' },
  { id: 3, title: 'İçerik üreticisi ödemesini onayla', impact: 'Orta', area: 'Pazaryeri', domain: 'marketplace' },
  { id: 4, title: 'Ayrılma oranındaki artışı araştır', impact: 'Yüksek', area: 'Büyüme', domain: 'growth' },
  { id: 5, title: 'Moderasyon kuyruğunu incele', impact: 'Düşük', area: 'Topluluk', domain: 'community' },
];

export default function TaskCenter() {
  const [expandedTask, setExpandedTask] = useState<number | null>(null);
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const { data } = useSWR(
    token ? [apiUrl('/admin/sysop-dashboard'), token] : null,
    ([url, token]) => fetcher(url, token)
  );

  return (
    <div className="bg-white dark:bg-[#0C0C0E] border border-gray-200 dark:border-white/5 rounded-2xl p-5 lg:p-6 flex flex-col h-full shadow-sm transition-colors">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-fuchsia-50 dark:bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 rounded-lg">
          <Task01Icon size={16} />
        </div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Görev Listesi</h3>
      </div>
      
      <div className="flex flex-col gap-2 flex-1">
        {tasks.map((task, idx) => (
          <div key={task.id} className="flex flex-col bg-gray-50 dark:bg-[#121214] border border-gray-100 dark:border-white/5 rounded-xl transition-colors group">
            <div 
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-[#1A1D27] rounded-xl"
              onClick={() => setExpandedTask(expandedTask === idx ? null : idx)}
            >
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-gray-900 dark:text-white/90">
                  {task.title}
                  {task.id === 2 && data?.payload?.kpis?.activeOrders !== undefined && (
                    <span className="text-blue-500 ml-1">({data.payload.kpis.activeOrders})</span>
                  )}
                  {task.id === 3 && data?.payload?.kpis?.pendingApprovals !== undefined && (
                    <span className="text-amber-500 ml-1">({data.payload.kpis.pendingApprovals})</span>
                  )}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[8px] uppercase font-black tracking-wider px-2 py-0.5 rounded border ${
                    task.impact === 'Yüksek' ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-100 dark:border-transparent' :
                    task.impact === 'Orta' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-transparent' :
                    'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-transparent'
                  }`}>
                    {task.impact} ETKİ
                  </span>
                  <span className="text-[8px] uppercase font-bold tracking-wider text-gray-400 dark:text-white/40">{task.area}</span>
                </div>
              </div>
              <div 
                className="text-gray-300 dark:text-white/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all p-2 -mr-2"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/dashboard/sysop/${task.domain}`);
                }}
              >
                <ArrowRight01Icon size={16} />
              </div>
            </div>
            
            {/* Accordion Detayı */}
            {expandedTask === idx && (
              <div className="px-3 pb-3 pt-1 text-[11px] text-gray-600 dark:text-white/60 leading-relaxed border-t border-gray-100 dark:border-white/5 mx-1 mt-1">
                Sistem bu görevi <strong>{task.impact}</strong> öncelik seviyesinde belirledi. 
                Bu problem <strong>{task.area}</strong> süreçlerinde doğrudan gecikmelere sebep olabilir. Hızlıca detay sayfasına giderek aksiyon almanız önerilir.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
