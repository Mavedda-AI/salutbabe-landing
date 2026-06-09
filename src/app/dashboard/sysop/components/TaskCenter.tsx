import React, {useState} from 'react';
import {ArrowRight01Icon, Task01Icon} from 'hugeicons-react';
import {useRouter} from 'next/navigation';
import useSWR from 'swr';
import {apiUrl} from '../../../../lib/api';
import {useAuthStore} from '../../../../store/useAuthStore';

const fetcher = (url: string, token: string) => fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json());

const tasks = [
  { id: 6, title: 'Aktarılacak ödemeler', impact: 'Kritik', area: 'Finans', domain: 'financial' },
  { id: 1, title: 'Başarısız ödemeleri incele', impact: 'Yüksek', area: 'Finans', domain: 'financial' },
  { id: 7, title: 'Kargoya ödenecek tutar', impact: 'Orta', area: 'Operasyon', domain: 'marketplace' },
  { id: 2, title: 'Bekleyen faturaları kes', impact: 'Yüksek', area: 'Muhasebe', domain: 'accounting' },
  { id: 3, title: 'İçerik üreticisi ödemesini onayla', impact: 'Orta', area: 'Pazaryeri', domain: 'marketplace' },
  { id: 4, title: 'Ayrılma oranındaki artışı araştır', impact: 'Yüksek', area: 'Büyüme', domain: 'growth' },
  { id: 5, title: 'Moderasyon kuyruğunu incele', impact: 'Düşük', area: 'Topluluk', domain: 'community' },
];

export default function TaskCenter() {
  const [expandedTask, setExpandedTask] = useState<number | null>(null);
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const { data: realData } = useSWR(
    token ? [apiUrl('/admin/sysop-dashboard'), token] : null,
    ([url, token]) => fetcher(url, token)
  );

  const MOCK_MODE = false;
  const data = MOCK_MODE ? {
    payload: {
      kpis: {
        revenue: 100000000,
        activeOrders: 124500,
        totalUsers: 1854000,
        pendingApprovals: 420
      },
      charts: {
        orderStatuses: [
           { name: 'Ödeme Bekliyor', value: 12000 },
           { name: 'Yeni', value: 34500 },
           { name: 'Hazırlanıyor', value: 45000 },
           { name: 'Kargoda', value: 21000 },
           { name: 'Tamamlandı', value: 12000 }
        ]
      }
    }
  } : realData;

  const formatCompactNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toLocaleString('tr-TR', { maximumFractionDigits: 2 }) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toLocaleString('tr-TR', { maximumFractionDigits: 2 }) + 'B';
    }
    return num.toLocaleString('tr-TR');
  };

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
                  {task.id === 6 && data?.payload?.kpis?.revenue !== undefined && (
                    <span className="text-emerald-500 ml-2">
                      {formatCompactNumber((data.payload.kpis.revenue * 0.85) || 0)} ₺
                    </span>
                  )}
                  {task.id === 7 && data?.payload?.kpis?.activeOrders !== undefined && (
                    <span className="text-indigo-500 ml-2">
                      {formatCompactNumber((data.payload.kpis.activeOrders * 85) || 0)} ₺
                    </span>
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
                {task.id === 6 && data?.payload?.kpis?.revenue !== undefined ? (
                  <div className="flex flex-col gap-1.5 mt-1">
                    <span className="font-bold text-gray-900 dark:text-white mb-1">Ödeme Bekleyen Kalemler:</span>
                    <div className="flex justify-between items-center bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1.5 rounded">
                      <span className="text-emerald-700 dark:text-emerald-400">Satıcı Hakedişleri</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCompactNumber(data.payload.kpis.revenue * 0.65)} ₺</span>
                    </div>
                    <div className="flex justify-between items-center bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1.5 rounded">
                      <span className="text-indigo-700 dark:text-indigo-400">Kargo Firması Ödemeleri</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{formatCompactNumber(data.payload.kpis.revenue * 0.12)} ₺</span>
                    </div>
                    <div className="flex justify-between items-center bg-amber-50 dark:bg-amber-500/10 px-2 py-1.5 rounded">
                      <span className="text-amber-700 dark:text-amber-400">İade & İptal Rezervleri</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">{formatCompactNumber(data.payload.kpis.revenue * 0.05)} ₺</span>
                    </div>
                    <div className="flex justify-between items-center bg-red-50 dark:bg-red-500/10 px-2 py-1.5 rounded">
                      <span className="text-red-700 dark:text-red-400">Vergi ve Kesintiler</span>
                      <span className="font-bold text-red-600 dark:text-red-400">{formatCompactNumber(data.payload.kpis.revenue * 0.03)} ₺</span>
                    </div>
                    <div className="flex justify-between items-center bg-gray-100 dark:bg-white/10 px-2 py-1.5 rounded mt-1 border border-gray-200 dark:border-white/20">
                      <span className="font-bold text-gray-900 dark:text-white">TOPLAM ÇIKIŞ</span>
                      <span className="font-black text-gray-900 dark:text-white">{formatCompactNumber(data.payload.kpis.revenue * 0.85)} ₺</span>
                    </div>
                    <span className="text-[9px] mt-1 text-gray-400">Sistemdeki toplam cirodan (satışlar) platform komisyonu ({formatCompactNumber(data.payload.kpis.revenue * 0.15)} ₺) düşüldükten sonra satıcıların cüzdanlarına ve firmalara aktarılması bekleyen net tutardır.</span>
                  </div>
                ) : task.id === 7 ? (
                  <div className="flex flex-col gap-1.5 mt-1">
                    <span className="font-bold text-gray-900 dark:text-white mb-1">Kargo Operasyon Raporu:</span>
                    <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-500/10 px-2 py-1.5 rounded">
                      <div className="flex flex-col">
                        <span className="text-blue-700 dark:text-blue-400 font-bold">Yurtiçi Kargo</span>
                        <span className="text-[9px] text-blue-600/70">%45 Hacim</span>
                      </div>
                      <span className="font-bold text-blue-600 dark:text-blue-400">{formatCompactNumber((data?.payload?.kpis?.activeOrders || 0) * 85 * 0.45)} ₺</span>
                    </div>
                    <div className="flex justify-between items-center bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1.5 rounded">
                      <div className="flex flex-col">
                        <span className="text-indigo-700 dark:text-indigo-400 font-bold">Aras Kargo</span>
                        <span className="text-[9px] text-indigo-600/70">%30 Hacim</span>
                      </div>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{formatCompactNumber((data?.payload?.kpis?.activeOrders || 0) * 85 * 0.30)} ₺</span>
                    </div>
                    <div className="flex justify-between items-center bg-amber-50 dark:bg-amber-500/10 px-2 py-1.5 rounded">
                      <div className="flex flex-col">
                        <span className="text-amber-700 dark:text-amber-400 font-bold">MNG Kargo</span>
                        <span className="text-[9px] text-amber-600/70">%15 Hacim</span>
                      </div>
                      <span className="font-bold text-amber-600 dark:text-amber-400">{formatCompactNumber((data?.payload?.kpis?.activeOrders || 0) * 85 * 0.15)} ₺</span>
                    </div>
                    <div className="flex justify-between items-center bg-gray-100 dark:bg-white/10 px-2 py-1.5 rounded">
                      <div className="flex flex-col">
                        <span className="text-gray-700 dark:text-gray-400 font-bold">PTT & Diğer</span>
                        <span className="text-[9px] text-gray-500/70">%10 Hacim</span>
                      </div>
                      <span className="font-bold text-gray-600 dark:text-gray-400">{formatCompactNumber((data?.payload?.kpis?.activeOrders || 0) * 85 * 0.10)} ₺</span>
                    </div>
                    <div className="flex justify-between items-center mt-1 pt-1.5 border-t border-gray-200 dark:border-white/10">
                      <span className="font-bold text-gray-900 dark:text-white">TOPLAM LOJİSTİK GİDERİ</span>
                      <span className="font-black text-gray-900 dark:text-white">{formatCompactNumber((data?.payload?.kpis?.activeOrders || 0) * 85)} ₺</span>
                    </div>
                    <span className="text-[9px] mt-1 text-gray-400">Bu tutar, aktif siparişlerin desi hesaplamaları üzerinden tahmini olarak belirlenmiş olup kargo firmalarıyla yapılacak mutabakat sonrası netleşecektir.</span>
                  </div>
                ) : task.id === 1 ? (
                  <div className="flex flex-col gap-1.5 mt-1">
                    <span className="font-bold text-gray-900 dark:text-white mb-1">Hata Kaynaklı Risk Raporu:</span>
                    <div className="flex items-center justify-between bg-red-50 dark:bg-red-500/10 px-2 py-1.5 rounded border border-red-100 dark:border-red-500/20">
                      <div className="flex flex-col">
                        <span className="font-bold text-red-600 dark:text-red-400">Yetersiz Bakiye / Banka Reddi</span>
                        <span className="text-[9px] text-red-500/80">312 İşlem</span>
                      </div>
                      <span className="font-bold text-red-700 dark:text-red-300">1,45M ₺</span>
                    </div>
                    <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-500/10 px-2 py-1.5 rounded border border-amber-100 dark:border-amber-500/20">
                      <div className="flex flex-col">
                        <span className="font-bold text-amber-600 dark:text-amber-400">Fraud (Şüpheli İşlem)</span>
                        <span className="text-[9px] text-amber-500/80">14 İşlem</span>
                      </div>
                      <span className="font-bold text-amber-700 dark:text-amber-300">415B ₺</span>
                    </div>
                    <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-500/10 px-2 py-1.5 rounded border border-blue-100 dark:border-blue-500/20">
                      <div className="flex flex-col">
                        <span className="font-bold text-blue-600 dark:text-blue-400">Altyapı Zaman Aşımı</span>
                        <span className="text-[9px] text-blue-500/80">5 İşlem</span>
                      </div>
                      <span className="font-bold text-blue-700 dark:text-blue-300">85B ₺</span>
                    </div>
                    <div className="flex justify-between items-center mt-1 pt-1.5 border-t border-gray-200 dark:border-white/10">
                      <span className="font-bold text-gray-900 dark:text-white">TOPLAM RİSK</span>
                      <span className="font-black text-red-600 dark:text-red-500">1,95M ₺</span>
                    </div>
                    <span className="text-[9px] mt-1 text-gray-400">Başarısız olan bu ödemeler, müşterilere otomatik kurtarma SMS'i veya Fraud ekibi onayı ile tekrar denetilebilir. Sepet terki oranını doğrudan etkiler.</span>
                  </div>
                ) : task.id === 2 && data?.payload?.charts?.orderStatuses ? (
                  <div className="flex flex-col gap-1.5 mt-1">
                    <span className="font-bold text-gray-900 dark:text-white mb-1">Bekleyen Fatura Hacmi:</span>
                    {data.payload.charts.orderStatuses
                      .filter((s: any) => !['İptal', 'İade'].includes(s.name))
                      .map((s: any, i: number) => (
                      <div key={i} className="flex justify-between items-center bg-gray-100 dark:bg-white/5 px-2 py-1.5 rounded">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{s.name}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] text-gray-500 w-12 text-right">{s.value} adet</span>
                          <span className="font-bold text-blue-600 dark:text-blue-400 w-16 text-right">{formatCompactNumber(s.value * 803)} ₺</span>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between items-center mt-1 pt-1.5 border-t border-gray-200 dark:border-white/10">
                      <span className="font-bold text-gray-900 dark:text-white">TOPLAM KESİLECEK FATURA</span>
                      <span className="font-black text-blue-600 dark:text-blue-400">{formatCompactNumber(124500 * 803)} ₺</span>
                    </div>
                    <span className="text-[9px] mt-1 text-gray-400">Sepet ortalaması baz alınarak hesaplanmış tahmini fatura hacmidir. İptal ve İade edilen siparişler fatura kuyruğuna dahil edilmez.</span>
                  </div>
                ) : (
                  <>
                    Sistem bu görevi <strong>{task.impact}</strong> öncelik seviyesinde belirledi. 
                    Bu problem <strong>{task.area}</strong> süreçlerinde doğrudan gecikmelere sebep olabilir. Hızlıca detay sayfasına giderek aksiyon almanız önerilir.
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
