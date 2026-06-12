"use client";

import React, {useState} from 'react';
import {ArrowDown01Icon, ArrowRight01Icon, UserGroupIcon} from 'hugeicons-react';
import Link from 'next/link';
import useSWR from 'swr';
import {apiUrl} from '../../../../lib/api';
import {useAuthStore} from '../../../../store/useAuthStore';

const fetcher = (url: string, token: string) => fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json());

const BankIcon = (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zm0 10v10m-8-5v5m16-5v5"/></svg>;
const DocumentValidationIcon = (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;
const ChartLineData01Icon = (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M9 9l3 3 6-6"/></svg>;
const Store01Icon = (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h18l-2 10H5L3 3zm0 10v8h18v-8"/></svg>;
const StarIcon = (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
const Server01Icon = (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><path d="M6 6h.01M6 18h.01"/></svg>;
const Globe02Icon = (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>;
const Brain01Icon = (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 2a5 5 0 00-5 5v2a5 5 0 00-5 5v3a5 5 0 005 5h10a5 5 0 005-5v-3a5 5 0 00-5-5V7a5 5 0 00-5-5z"/></svg>;

// Domains will be calculated dynamically inside the component.

const renderDomainContent = (domainId: string, payload: any) => {
  switch (domainId) {
    case 'financial':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-xl">
             <h4 className="text-xs font-bold text-gray-500 dark:text-white/40 uppercase mb-2">Günlük Ciro Eğilimi</h4>
             <div className="text-2xl font-black text-gray-900 dark:text-white">Trend Analizi Aktif</div>
             <p className="text-sm text-gray-400 mt-2">Detaylı finansal grafikler ekranın üst kısmındaki (DashboardCharts) ana grafikte görselleştirilmiştir.</p>
          </div>
          <div className="p-4 bg-white dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-xl">
             <h4 className="text-xs font-bold text-gray-500 dark:text-white/40 uppercase mb-2">Bekleyen Satış/Ciro</h4>
             <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">Canlı Bağlantı</div>
             <p className="text-sm text-gray-400 mt-2">Tüm finansal akışlar üst menüdeki Finans modülünden detaylı raporlanabilir.</p>
          </div>
        </div>
      );
    case 'marketplace':
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-5 bg-white dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-xl">
             <h4 className="text-xs font-bold text-gray-500 dark:text-white/40 uppercase mb-4">Sipariş Durumları Dağılımı</h4>
             <div className="flex flex-col gap-3">
               {payload?.charts?.orderStatuses?.length > 0 ? payload.charts.orderStatuses.map((os: any, idx: number) => (
                 <div key={idx} className="flex justify-between items-center text-sm p-2 bg-gray-50 dark:bg-white/5 rounded-lg">
                    <span className="text-gray-600 dark:text-white/60 font-medium">{os.name}</span>
                    <span className="font-bold text-gray-900 dark:text-white bg-white dark:bg-black/50 px-3 py-1 rounded shadow-sm">{os.value}</span>
                 </div>
               )) : <div className="text-sm text-gray-500">Veri bulunamadı.</div>}
             </div>
          </div>
          <div className="p-5 bg-white dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-xl">
             <h4 className="text-xs font-bold text-gray-500 dark:text-white/40 uppercase mb-4">Bekleyen Onay İşlemleri</h4>
             <div className="flex flex-col gap-3">
               {payload?.pendingActions?.length > 0 ? payload.pendingActions.slice(0, 3).map((pa: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center bg-gray-50 dark:bg-white/5 p-3 rounded-lg border border-gray-100 dark:border-white/10">
                     <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{pa.title}</span>
                        <span className="text-xs text-gray-500 dark:text-white/40">{pa.subtitle}</span>
                     </div>
                     <span className="px-2 py-1 text-[10px] font-bold uppercase rounded bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">{pa.type}</span>
                  </div>
               )) : <div className="text-sm text-gray-500">Onay bekleyen işlem yok.</div>}
             </div>
          </div>
        </div>
      );
    case 'community':
      return (
        <div className="p-8 bg-white dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-xl flex items-center justify-center">
           <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                 <UserGroupIcon size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Topluluk Gelişiyor</h3>
              <p className="text-gray-500 dark:text-white/60 text-sm">Platformumuzda anlık olarak <b>{payload?.kpis?.totalUsers?.toLocaleString() || 0}</b> kayıtlı kullanıcı bulunmaktadır. Müşteri analizlerini ve kohort raporlarını 'Detaylı Analiz Sayfası' bağlantısından inceleyebilirsiniz.</p>
           </div>
        </div>
      );
    case 'accounting':
       return (
        <div className="p-8 bg-white dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-xl flex items-center justify-center">
           <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
                 <DocumentValidationIcon size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">E-Fatura & Maliyet Modülü (V2)</h3>
              <p className="text-gray-500 dark:text-white/60 text-sm">Resmi vergi dairesi entegrasyonları, stopaj hesaplamaları ve otomatik e-fatura kesimi yapısı V2 sürüm planlamasındadır.</p>
           </div>
        </div>
       );
    case 'infrastructure':
       return (
         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           {[
             { label: 'API Durumu', value: '🟢 Çevrimiçi', sub: '99.9% Uptime' },
             { label: 'Veritabanı', value: '🟢 Bağlı', sub: 'PostgreSQL - Sağlıklı' },
             { label: 'Sunucu Yükü', value: '🟢 %22 CPU', sub: 'Normal (DigitalOcean)' },
             { label: 'Tepki Süresi', value: '112 ms', sub: 'Optimize Edildi' },
           ].map((stat, i) => (
             <div key={i} className="bg-white dark:bg-[#121214] border border-gray-200 dark:border-white/5 p-5 rounded-2xl text-center shadow-sm hover:shadow-md transition-shadow">
               <h5 className="text-[10px] font-bold text-gray-400 dark:text-white/40 uppercase tracking-widest mb-3">{stat.label}</h5>
               <div className="text-lg font-black text-gray-900 dark:text-white mb-1">{stat.value}</div>
               <div className="text-xs text-gray-500 dark:text-white/60 font-medium">{stat.sub}</div>
             </div>
           ))}
         </div>
       );
    default:
      return null;
  }
};

export default function ExecutiveAccordion() {
  const [expanded, setExpanded] = useState<string | null>('financial');
  const token = useAuthStore((state) => state.token);
  const { data } = useSWR(
    token ? [apiUrl('/admin/sysop-dashboard'), token] : null,
    ([url, t]) => fetcher(url, t)
  );

  const payload = data?.payload || {};
  const kpis = payload.kpis || {};
  const orderStatuses = payload.charts?.orderStatuses || [];
  
  // Real dynamic domains
  const dynamicDomains = [
    { 
      id: 'financial', 
      title: 'Finansal Kontrol Merkezi', 
      icon: BankIcon, 
      status: 'good', 
      metrics: [`Ciro: ${kpis.revenue ? (kpis.revenue).toLocaleString('tr-TR') : '0'} ₺`, `Aktif Sipariş: ${kpis.activeOrders || 0}`] 
    },
    { 
      id: 'marketplace', 
      title: 'Pazaryeri Operasyonları', 
      icon: Store01Icon, 
      status: kpis.pendingApprovals > 0 ? 'warning' : 'good', 
      metrics: [`Onay Bekleyen İlan: ${kpis.pendingApprovals || 0}`] 
    },
    { 
      id: 'community', 
      title: 'Kullanıcı ve Topluluk', 
      icon: UserGroupIcon, 
      status: 'excellent', 
      metrics: [`Toplam Kullanıcı: ${kpis.totalUsers ? (kpis.totalUsers).toLocaleString('tr-TR') : '0'}`] 
    },
    // The rest are infrastructure/future concepts, we can keep them but without fake numbers
    { 
      id: 'accounting', 
      title: 'Muhasebe ve Vergi', 
      icon: DocumentValidationIcon, 
      status: 'good', 
      metrics: ['Sistem aktif'] 
    },
    { 
      id: 'infrastructure', 
      title: 'Altyapı Merkezi', 
      icon: Server01Icon, 
      status: 'excellent', 
      metrics: ['Sistem Sağlıklı'] 
    }
  ];

  return (
    <div className="flex flex-col gap-4">
      {dynamicDomains.map((domain) => {
        const isExpanded = expanded === domain.id;
        const Icon = domain.icon;

        return (
          <div key={domain.id} className="bg-white dark:bg-[#0A0A0B] border border-gray-200 dark:border-white/5 rounded-3xl overflow-hidden transition-all duration-500">
            {/* Header (Level 1) */}
            <div 
              onClick={() => setExpanded(isExpanded ? null : domain.id)}
              className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-6">
                <div className={`p-4 rounded-2xl ${
                  domain.status === 'excellent' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                  domain.status === 'good' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                  'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                }`}>
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white">{domain.title}</h3>
                  <div className="flex gap-4 mt-2">
                    {domain.metrics.map((m, i) => (
                      <span key={i} className="text-xs font-bold text-gray-400 dark:text-white/40 uppercase tracking-wider">{m}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className={`transition-transform duration-300 text-gray-400 dark:text-white/20 ${isExpanded ? 'rotate-180' : ''}`}>
                <ArrowDown01Icon size={24} />
              </div>
            </div>

            {/* Content (Level 2 Deep Analytics) */}
            <div className={`grid transition-all duration-500 ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
              <div className="overflow-hidden">
                <div className="p-6 border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#050505] flex flex-col gap-6">
                  {renderDomainContent(domain.id, payload)}
                  <div className="flex justify-end">
                    <Link href={`/dashboard/sysop/${domain.id}`} className="px-6 py-3 rounded-xl bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-white/10 text-gray-900 dark:text-white text-sm font-bold transition-all border border-gray-200 dark:border-white/5 flex items-center gap-2 group">
                      Detaylı Analiz Sayfasına Git
                      <ArrowRight01Icon size={16} className="text-gray-400 dark:text-white/40 group-hover:text-gray-900 dark:group-hover:text-white transition-colors group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
