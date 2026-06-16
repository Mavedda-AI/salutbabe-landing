import React from 'react';
import useSWR from 'swr';
import {apiUrl} from '../../../../lib/api';
import {useAuthStore} from '../../../../store/useAuthStore';

const fetcher = (url: string, token: string) => fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json());

export default function FounderSummary() {
  const token = useAuthStore((state) => state.token);
  const { data: dashboardData, error, isLoading } = useSWR(
    token ? [apiUrl('/admin/dashboard'), token] : null,
    ([url, token]) => fetcher(url, token)
  );

  const { data: ordersData } = useSWR(
    token ? [apiUrl('/admin/orders'), token] : null,
    ([url, token]) => fetcher(url, token)
  );

  const { data: usersData } = useSWR(
    token ? [apiUrl('/admin/users'), token] : null,
    ([url, token]) => fetcher(url, token)
  );

  const data = dashboardData;

  const users = usersData?.payload?.users || [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const newUsersToday = users.filter((u: any) => new Date(u.createdAt) >= today).length;

  const orders = ordersData?.payload?.orders || [];
  const completedOrders = orders.filter((o: any) => { const s = o.status?.toLowerCase(); return s === 'delivered' || s === 'completed'; });
  const activeOrdersArr = orders.filter((o: any) => { const s = o.status?.toLowerCase(); return s === 'processing' || s === 'pending_payment' || s === 'shipped' || s === 'paid'; });
  
  const payloadTotalRevenue = data?.payload?.totalRevenue || 0;
  const calculatedRevenue = payloadTotalRevenue > 0 ? payloadTotalRevenue : completedOrders.reduce((acc: number, order: any) => acc + Number(order.totalAmount || 0), 0);
  
  const payloadPendingRevenue = data?.payload?.pendingRevenue || 0;
  const calculatedPendingRevenue = payloadPendingRevenue > 0 ? payloadPendingRevenue : activeOrdersArr.reduce((acc: number, order: any) => acc + Number(order.totalAmount || 0), 0);
  const calculatedTransferPending = (calculatedRevenue + calculatedPendingRevenue) * 0.85;

  const totalUsers = data?.payload?.totalUsers || users.length || 0;
  const activeUsers = data?.payload?.activeUsers || 0;
  const pendingListings = data?.payload?.pendingListings || 0;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#0C0C0E] border border-gray-200 dark:border-white/5 shadow-sm p-5 lg:p-6 mb-4 isolate group transition-colors">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-fuchsia-500/10 blur-[100px] rounded-full pointer-events-none transition-all duration-1000 group-hover:bg-fuchsia-500/20" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none transition-all duration-1000 group-hover:bg-blue-500/20" />
      
      <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center relative z-10">

        
        <div className="flex-1">
          <h2 className="text-xs font-bold text-gray-500 dark:text-white/50 uppercase tracking-widest mb-2">Sistem Raporu</h2>
          {isLoading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-white/10 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 dark:bg-white/10 rounded w-1/2"></div>
            </div>
          ) : error || !data?.payload ? (
            <p className="text-xl font-medium text-gray-500 dark:text-white/50">Sistem verilerine şu anda ulaşılamıyor. Lütfen veritabanı bağlantısını kontrol edin.</p>
          ) : (
            <p className="text-sm md:text-base font-medium leading-relaxed text-gray-700 dark:text-white/90">
              Platformda <span className="text-gray-900 dark:text-white font-black">toplam {totalUsers} kullanıcı</span> kayıtlı (Bugün katılan: <span className="text-blue-600 dark:text-blue-400 font-bold">{newUsersToday}</span>). 
              Toplam gerçekleşen ciro <span className="text-emerald-600 dark:text-green-400 font-bold">{calculatedRevenue.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺</span> seviyesinde ve anlık <span className="text-emerald-600 dark:text-green-400 font-bold">{activeUsers}</span> kullanıcı aktif (DAU). 
              İncelenmesi gereken <span className="text-amber-600 dark:text-[#101516] dark:text-white font-bold">{pendingListings} ilan</span> ve satıcılara aktarılması bekleyen <span className="text-indigo-600 dark:text-indigo-400 font-bold">{calculatedTransferPending.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺</span> hakediş bulunuyor. 
              <span className="text-blue-600 dark:text-blue-400 font-bold"> Sisteminiz sorunsuz çalışıyor.</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
