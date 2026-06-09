"use client";

import React, {use} from 'react';
import Link from 'next/link';
import {AnalyticsUpIcon, ArrowLeft01Icon, Download01Icon} from 'hugeicons-react';
import useSWR from 'swr';
import {apiUrl} from '../../../../lib/api';
import {useAuthStore} from '../../../../store/useAuthStore';

// Domain Definitions
const domainDetails: Record<string, { title: string, desc: string, kpis: {l: string, v: string, t: string}[] }> = {
  financial: { title: 'Finansal Kontrol Merkezi', desc: 'Tüm nakit akışı, ciro, kar ve finansal sağlığın derin analizi.', kpis: [] },
  accounting: { title: 'Muhasebe ve Vergi', desc: 'Bekleyen faturalar, KDV ödemeleri ve muhasebe defterleri.', kpis: [] },
  growth: { title: 'Büyüme Merkezi', desc: 'Kullanıcı kazanımı, aktif kullanıcılar (MAU/DAU) ve yaşam boyu değer (LTV).', kpis: [] },
  community: { title: 'Topluluk Merkezi', desc: 'Platform içi etkileşim, gönderiler ve moderasyon kuyruğu raporları.', kpis: [] },
  marketplace: { title: 'Pazaryeri Operasyonları', desc: 'Siparişler, iadeler, satıcı analizleri ve ürün performansları.', kpis: [] },
  creator: { title: 'İçerik Üretici ve Uzman Merkezi', desc: 'Influencer ödemeleri, uzman danışmanlık seansları ve performanslar.', kpis: [] },
  infrastructure: { title: 'Altyapı Merkezi', desc: 'Sunucu sağlığı, veritabanı yanıt süreleri ve güvenlik alarmları.', kpis: [] },
  map: { title: 'Küresel Harita', desc: 'Kullanıcıların ve siparişlerin coğrafi ve bölgesel dağılımı.', kpis: [] },
  ai: { title: 'Yapay Zeka Operasyonları', desc: 'LLM kullanım oranları, maliyet analizi ve yapay zeka başarı metrikleri.', kpis: [] }
};

const fetcher = (url: string, token: string) => fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json());

export default function DomainDetailPage({ params }: { params: Promise<{ domain: string }> }) {
  const unwrappedParams = use(params);
  const domainKey = unwrappedParams.domain as string;
  console.log("REQUESTED DOMAIN:", domainKey);
  const staticData = domainDetails[domainKey];

  const token = useAuthStore((state) => state.token);
  const { data, isLoading } = useSWR(
    token ? [apiUrl(`/admin/analytics/domain/${domainKey}`), token] : null,
    ([url, token]) => fetcher(url, token)
  );

  const kpis = data?.payload?.stats?.kpis || staticData?.kpis || [];
  const columns = data?.payload?.stats?.columns || [];
  const details = data?.payload?.stats?.details || [];

  if (!staticData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#050505] flex items-center justify-center text-gray-900 dark:text-white font-sans transition-colors">
        <div className="text-center">
          <h1 className="text-3xl font-black mb-4">Modül Bulunamadı</h1>
          <p className="text-gray-500 dark:text-white/40 mb-8">Bu sistem modülü henüz aktif değil veya geçersiz bir bağlantı.</p>
          <Link href="/dashboard/sysop" className="px-6 py-3 rounded-xl bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 transition-colors font-bold text-sm">
            Kontrol Merkezine Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-white font-sans p-6 lg:p-12 transition-colors">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-6">
          <Link href="/dashboard/sysop" className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center group hover:bg-gray-100 dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none">
            <ArrowLeft01Icon size={20} className="text-gray-500 dark:text-white/60 group-hover:text-gray-900 dark:group-hover:text-white" />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">{staticData.title}</h1>
            <p className="text-xs font-medium text-gray-500 dark:text-white/40 mt-0.5">{staticData.desc}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-10 px-4 rounded-xl border border-gray-200 dark:border-white/10 flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors bg-white dark:bg-transparent shadow-sm dark:shadow-none">
            <Download01Icon size={16} /> Rapor İndir
          </button>
          <button className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 text-xs font-bold transition-colors shadow-lg shadow-blue-500/20">
            <AnalyticsUpIcon size={16} /> AI Optimize Et
          </button>
        </div>
      </div>
      
      <div className="max-w-7xl">
        
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="bg-white dark:bg-[#0A0A0B] border border-gray-200 dark:border-white/5 rounded-3xl p-8 h-32 animate-pulse shadow-sm dark:shadow-none" />
            ))
          ) : (
            kpis.map((kpi: any, idx: number) => (
              <div key={idx} className="bg-white dark:bg-[#0A0A0B] border border-gray-200 dark:border-white/5 rounded-3xl p-8 flex flex-col gap-4 relative overflow-hidden group hover:border-gray-300 dark:hover:border-white/10 transition-colors shadow-sm dark:shadow-none">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-100 dark:bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-xs font-bold text-gray-400 dark:text-white/40 uppercase tracking-widest">{kpi.l}</span>
                <div className="flex items-end justify-between z-10">
                  <span className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white">{kpi.v}</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-400/10 border border-emerald-100 dark:border-transparent px-3 py-1 rounded-lg">{kpi.t}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Big Chart Area / Data Table */}
        {details.length > 0 ? (
          <div className="flex-1 bg-white dark:bg-[#0A0A0B] border border-gray-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/40 font-medium">
                    {columns.map((col: string, i: number) => (
                      <th key={i} className="px-6 py-4">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {details.map((row: any, i: number) => (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group cursor-pointer">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{row.col1}</td>
                      <td className="px-6 py-4 text-gray-500 dark:text-white/60">{row.col2}</td>
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{row.col3}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/60">
                          {row.col4}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 dark:text-white/40 text-right">{row.col5}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex-1 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-white/20 py-20">
            <AnalyticsUpIcon size={48} className="mb-4 opacity-50" />
            <span className="font-bold uppercase tracking-widest text-sm">Grafik Verileri Yükleniyor...</span>
            <span className="text-xs mt-2 max-w-sm text-center">Bu alan Recharts kullanılarak gerçek zamanlı veya mock verilerle doldurulacaktır. İlgili alana ait Trendler, Anomali Tespitleri ve Tahminlemeler (Forecast) burada gösterilecektir.</span>
          </div>
        )}
      </div>

    </div>
  );
}
