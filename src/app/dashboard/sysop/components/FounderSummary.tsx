import React from 'react';
import {SparklesIcon} from 'hugeicons-react';
import useSWR from 'swr';
import {apiUrl} from '../../../../lib/api';
import {useAuthStore} from '../../../../store/useAuthStore';

const fetcher = (url: string, token: string) => fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json());

export default function FounderSummary() {
  const token = useAuthStore((state) => state.token);
  const { data, error, isLoading } = useSWR(
    token ? [apiUrl('/admin/dashboard'), token] : null,
    ([url, token]) => fetcher(url, token)
  );

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-[#0C0C0E] border border-gray-200 dark:border-white/5 shadow-xl dark:shadow-2xl p-8 lg:p-10 mb-8 isolate group transition-colors">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-fuchsia-500/10 blur-[100px] rounded-full pointer-events-none transition-all duration-1000 group-hover:bg-fuchsia-500/20" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none transition-all duration-1000 group-hover:bg-blue-500/20" />
      
      <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center relative z-10">
        <div className="w-16 h-16 rounded-3xl bg-gray-100 dark:bg-gradient-to-br dark:from-white/10 dark:to-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center shrink-0 shadow-sm dark:shadow-lg backdrop-blur-xl transition-colors">
          <SparklesIcon size={28} className="text-gray-900 dark:text-white" />
        </div>
        
        <div className="flex-1">
          <h2 className="text-sm font-bold text-gray-500 dark:text-white/50 uppercase tracking-[0.2em] mb-3">Yapay Zeka Kurucu Özeti</h2>
          {isLoading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-white/10 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 dark:bg-white/10 rounded w-1/2"></div>
            </div>
          ) : error || !data?.payload ? (
            <p className="text-xl font-medium text-gray-500 dark:text-white/50">Sistem verilerine şu anda ulaşılamıyor. Lütfen veritabanı bağlantısını kontrol edin.</p>
          ) : (
            <p className="text-xl md:text-2xl lg:text-[28px] font-medium leading-relaxed text-gray-700 dark:text-white/90">
              <span className="text-gray-900 dark:text-white font-black">Toplam {data.payload.totalUsers || 0} kullanıcı</span> platformda kayıtlı.
              Toplam ciro <span className="text-emerald-600 dark:text-green-400 font-bold">{(data.payload.totalRevenue || 0).toLocaleString()} ₺</span> seviyesinde ve anlık <span className="text-emerald-600 dark:text-green-400 font-bold">{data.payload.activeUsers || 0}</span> kullanıcı aktif (DAU). 
              İncelenmesi gereken <span className="text-amber-600 dark:text-orange-400 font-bold">{data.payload.pendingListings || 0} ilan</span> var. 
              <span className="text-blue-600 dark:text-blue-400 font-bold"> Sisteminiz sorunsuz çalışıyor.</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
