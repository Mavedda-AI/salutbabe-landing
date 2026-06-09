import React, {useState} from 'react';
import useSWR from 'swr';
import {useRouter} from 'next/navigation';
import {apiUrl} from '../../../../lib/api';
import {useAuthStore} from '../../../../store/useAuthStore';
import {
  ArrowDown01Icon,
  BankIcon,
  CheckmarkBadge01Icon,
  PercentCircleIcon,
  ShoppingCart01Icon,
  Tag01Icon,
  UserCircleIcon,
  UserGroupIcon,
  Wallet01Icon
} from 'hugeicons-react';

const fetcher = (url: string, token: string) => fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json());

function UserListAccordion({ token }: { token: string }) {
  const router = useRouter();
  const { data, isLoading } = useSWR(token ? [apiUrl('/admin/users'), token] : null, ([url, t]) => fetcher(url, t));
  const users = data?.payload?.users || [];

  if (isLoading) return <div className="p-6 text-center text-gray-500 dark:text-white/40 text-sm animate-pulse">Kullanıcılar Yükleniyor...</div>;

  return (
    <div className="p-6 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#050505]">
      <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <UserCircleIcon size={18} className="text-blue-500" /> Son Kayıt Olan Kullanıcılar
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-gray-500 dark:text-white/40 border-b border-gray-200 dark:border-white/10">
              <th className="pb-3 font-medium">Kullanıcı</th>
              <th className="pb-3 font-medium">Email</th>
              <th className="pb-3 font-medium">Rol</th>
              <th className="pb-3 font-medium">Kayıt Tarihi</th>
            </tr>
          </thead>
          <tbody>
            {users.slice(0, 10).map((user: any, idx: number) => (
              <tr 
                key={idx} 
                onClick={() => router.push('/dashboard/sysop/user-management')}
                className="border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <td className="py-3 text-gray-900 dark:text-white font-medium flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px] font-bold">
                    {user.userName ? user.userName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  {user.userName} {user.userSurname}
                  {user.isEmailVerified && <CheckmarkBadge01Icon size={14} className="text-blue-500" />}
                </td>
                <td className="py-3 text-gray-500 dark:text-white/60">{user.userEmail}</td>
                <td className="py-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${user.role === 'ADMIN' ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400' : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/60'}`}>
                    {user.role || 'USER'}
                  </span>
                </td>
                <td className="py-3 text-gray-400 dark:text-white/40">{new Date(user.createdAt).toLocaleDateString('tr-TR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrderListAccordion({ token }: { token: string }) {
  const router = useRouter();
  const { data, isLoading } = useSWR(token ? [apiUrl('/admin/orders'), token] : null, ([url, t]) => fetcher(url, t));
  const orders = data?.payload?.orders || [];

  if (isLoading) return <div className="p-6 text-center text-gray-500 dark:text-white/40 text-sm animate-pulse">Siparişler Yükleniyor...</div>;

  return (
    <div className="p-6 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#050505]">
      <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <ShoppingCart01Icon size={18} className="text-emerald-500" /> Son Siparişler
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-gray-500 dark:text-white/40 border-b border-gray-200 dark:border-white/10">
              <th className="pb-3 font-medium">Sipariş ID</th>
              <th className="pb-3 font-medium">Tutar</th>
              <th className="pb-3 font-medium">Durum</th>
              <th className="pb-3 font-medium">Tarih</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 10).map((order: any, idx: number) => (
              <tr 
                key={idx} 
                onClick={() => router.push('/dashboard/sysop/order-management')}
                className="border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <td className="py-3 text-gray-900 dark:text-white font-medium">#{order.orderID?.split('-')[0] || order.id || 'Bilinmiyor'}</td>
                <td className="py-3 text-emerald-600 dark:text-emerald-400 font-bold">{order.totalAmount} ₺</td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/60">
                    {order.status}
                  </span>
                </td>
                <td className="py-3 text-gray-400 dark:text-white/40">{new Date(order.orderDate || order.createdAt).toLocaleDateString('tr-TR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ListingListAccordion({ token }: { token: string }) {
  const router = useRouter();
  const { data, isLoading } = useSWR(token ? [apiUrl('/admin/listings'), token] : null, ([url, t]) => fetcher(url, t));
  const listings = data?.payload?.listings || [];

  if (isLoading) return <div className="p-6 text-center text-gray-500 dark:text-white/40 text-sm animate-pulse">İlanlar Yükleniyor...</div>;

  return (
    <div className="p-6 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#050505]">
      <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Tag01Icon size={18} className="text-amber-500" /> Son İlanlar
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-gray-500 dark:text-white/40 border-b border-gray-200 dark:border-white/10">
              <th className="pb-3 font-medium">İlan Adı</th>
              <th className="pb-3 font-medium">Fiyat</th>
              <th className="pb-3 font-medium">Durum</th>
              <th className="pb-3 font-medium">Tarih</th>
            </tr>
          </thead>
          <tbody>
            {listings.slice(0, 10).map((listing: any, idx: number) => (
              <tr 
                key={idx} 
                onClick={() => router.push('/dashboard/sysop/product-approval')}
                className="border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <td className="py-3 text-gray-900 dark:text-white font-medium">{listing.title || 'İsimsiz'}</td>
                <td className="py-3 text-gray-500 dark:text-white/60">{listing.price} ₺</td>
                <td className="py-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${listing.status === 'PENDING' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'}`}>
                    {listing.status}
                  </span>
                </td>
                <td className="py-3 text-gray-400 dark:text-white/40">{new Date(listing.createdAt).toLocaleDateString('tr-TR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RevenueDailyAccordion({ token }: { token: string }) {
  const router = useRouter();
  const { data, isLoading } = useSWR(token ? [apiUrl('/admin/orders'), token] : null, ([url, t]) => fetcher(url, t));
  const orders = data?.payload?.orders || [];

  if (isLoading) return <div className="p-6 text-center text-gray-500 dark:text-white/40 text-sm animate-pulse">Bugünkü İşlemler Yükleniyor...</div>;

  return (
    <div className="p-6 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#050505]">
      <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Wallet01Icon size={18} className="text-emerald-500" /> Bugünkü Ciroya Etki Eden İşlemler
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-gray-500 dark:text-white/40 border-b border-gray-200 dark:border-white/10">
              <th className="pb-3 font-medium">İşlem ID</th>
              <th className="pb-3 font-medium">Alıcı</th>
              <th className="pb-3 font-medium text-right">İşlem Tutarı</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map((order: any, idx: number) => (
              <tr 
                key={idx} 
                onClick={() => router.push('/dashboard/sysop/order-management')}
                className="border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <td className="py-3 text-gray-900 dark:text-white font-medium">#{order.orderID?.split('-')[0] || order.id || 'Bilinmiyor'}</td>
                <td className="py-3 text-gray-500 dark:text-white/60">{order.buyer?.userName} {order.buyer?.userSurname}</td>
                <td className="py-3 text-emerald-600 dark:text-emerald-400 font-bold text-right">+{order.totalAmount} ₺</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PendingRevenueAccordion({ token }: { token: string }) {
  const router = useRouter();
  const { data, isLoading } = useSWR(token ? [apiUrl('/admin/orders'), token] : null, ([url, t]) => fetcher(url, t));
  const orders = data?.payload?.orders || [];

  if (isLoading) return <div className="p-6 text-center text-gray-500 dark:text-white/40 text-sm animate-pulse">Bekleyen İşlemler Yükleniyor...</div>;

  return (
    <div className="p-6 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#050505]">
      <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <BankIcon size={18} className="text-blue-500" /> Tahsil Edilmeyi Bekleyen İşlemler
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-gray-500 dark:text-white/40 border-b border-gray-200 dark:border-white/10">
              <th className="pb-3 font-medium">İşlem Tarihi</th>
              <th className="pb-3 font-medium">Satıcı İşlemi</th>
              <th className="pb-3 font-medium text-right">Bekleyen Hacim</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map((order: any, idx: number) => (
              <tr 
                key={idx} 
                onClick={() => router.push('/dashboard/sysop/order-management')}
                className="border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <td className="py-3 text-gray-400 dark:text-white/40">{new Date(order.orderDate || order.createdAt).toLocaleDateString('tr-TR')}</td>
                <td className="py-3 text-gray-900 dark:text-white font-medium">{order.seller?.userName || 'Sistem İşlemi'}</td>
                <td className="py-3 text-blue-600 dark:text-blue-400 font-bold text-right">{order.totalAmount} ₺</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PendingCommissionAccordion({ token }: { token: string }) {
  const router = useRouter();
  const { data, isLoading } = useSWR(token ? [apiUrl('/admin/orders'), token] : null, ([url, t]) => fetcher(url, t));
  const orders = data?.payload?.orders || [];

  if (isLoading) return <div className="p-6 text-center text-gray-500 dark:text-white/40 text-sm animate-pulse">Komisyon Detayları Yükleniyor...</div>;

  return (
    <div className="p-6 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#050505]">
      <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <PercentCircleIcon size={18} className="text-fuchsia-500" /> Bekleyen Komisyon Kesintileri
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-gray-500 dark:text-white/40 border-b border-gray-200 dark:border-white/10">
              <th className="pb-3 font-medium">Satış ID</th>
              <th className="pb-3 font-medium">Toplam Tutar</th>
              <th className="pb-3 font-medium">Komisyon Oranı</th>
              <th className="pb-3 font-medium text-right">Net Platform Karı</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map((order: any, idx: number) => (
              <tr 
                key={idx} 
                onClick={() => router.push('/dashboard/sysop/order-management')}
                className="border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <td className="py-3 text-gray-900 dark:text-white font-medium">#{order.orderID?.split('-')[0] || order.id || 'Bilinmiyor'}</td>
                <td className="py-3 text-gray-500 dark:text-white/60">{order.totalAmount} ₺</td>
                <td className="py-3 text-gray-400 dark:text-white/40">%10</td>
                <td className="py-3 text-fuchsia-600 dark:text-fuchsia-400 font-bold text-right">+{Math.round(order.totalAmount * 0.10)} ₺</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DAUAccordion({ token }: { token: string }) {
  const router = useRouter();
  const { data, isLoading } = useSWR(token ? [apiUrl('/admin/users?sort=lastSeenAt'), token] : null, ([url, t]) => fetcher(url, t));
  const users = data?.payload?.users || [];

  const isOnline = (lastSeenAt: any) => {
    if (!lastSeenAt) return false;
    const diff = Date.now() - new Date(Number(lastSeenAt)).getTime();
    return diff < 15 * 60 * 1000; // 15 mins
  };

  const timeAgo = (lastSeenAt: any) => {
    if (!lastSeenAt) return 'Hiç girmedi';
    const diffMs = Date.now() - new Date(Number(lastSeenAt)).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Şimdi';
    if (diffMins < 60) return `${diffMins} dk önce`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} saat önce`;
    return `${Math.floor(diffHours / 24)} gün önce`;
  };

  if (isLoading) return <div className="p-6 text-center text-gray-500 dark:text-white/40 text-sm animate-pulse">Aktif Kullanıcılar Yükleniyor...</div>;

  return (
    <div className="p-6 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#050505]">
      <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <UserGroupIcon size={18} className="text-blue-500" /> Son 24 Saatte Aktif Olan Kullanıcılar (DAU)
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-gray-500 dark:text-white/40 border-b border-gray-200 dark:border-white/10">
              <th className="pb-3 font-medium">Kullanıcı Adı</th>
              <th className="pb-3 font-medium">Durum</th>
              <th className="pb-3 font-medium text-right">Son Etkileşim</th>
            </tr>
          </thead>
          <tbody>
            {users.slice(0, 5).map((user: any, idx: number) => {
              const online = isOnline(user.lastSeenAt);
              return (
                <tr 
                  key={idx} 
                  onClick={() => router.push('/dashboard/sysop/user-management')}
                  className="border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <td className="py-3 text-gray-900 dark:text-white font-medium flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${online ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300 dark:bg-white/20'}`}></div>
                    {user.userName} {user.userSurname}
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${online ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white/40'}`}>
                      {online ? 'Çevrimiçi' : 'Uygulama Dışı'}
                    </span>
                  </td>
                  <td className="py-3 text-gray-400 dark:text-white/40 text-right">{timeAgo(user.lastSeenAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function KPIBar() {
  const token = useAuthStore((state) => state.token);
  const { data, isLoading } = useSWR(
    token ? [apiUrl('/admin/dashboard'), token] : null,
    ([url, token]) => fetcher(url, token)
  );

  const [expandedKpi, setExpandedKpi] = useState<string | null>(null);

  const kpis = [
    { id: 'revenue-daily', label: 'Gerçekleşen Ciro', value: data?.payload?.totalRevenue ? `${data.payload.totalRevenue.toLocaleString()} ₺` : '0 ₺', trend: '+%11', status: 'excellent', hasDetails: true },
    { id: 'revenue-pending', label: 'Tahmini Bekleyen Ciro', value: data?.payload?.pendingRevenue ? `${data.payload.pendingRevenue.toLocaleString()} ₺` : '0 ₺', trend: '+%8', status: 'good', hasDetails: true },
    { id: 'commission-pending', label: 'Bekleyen Komisyon', value: data?.payload?.pendingCommission ? `${data.payload.pendingCommission.toLocaleString()} ₺` : '0 ₺', trend: '+%4', status: 'good', hasDetails: true },
    { id: 'users', label: 'Toplam Kullanıcı', value: data?.payload?.totalUsers ? `${data.payload.totalUsers.toLocaleString()}` : '0', trend: '+%1.2', status: 'good', hasDetails: true },
    { id: 'dau', label: 'Aktif Kullanıcı (DAU)', value: data?.payload?.activeUsers ? `${data.payload.activeUsers.toLocaleString()}` : '0', trend: '+%3', status: 'good', hasDetails: true },
    { id: 'pending', label: 'Bekleyen İlanlar', value: data?.payload?.pendingListings ? `${data.payload.pendingListings}` : '0', trend: '-1', status: 'warning', hasDetails: true },
    { id: 'orders', label: 'Toplam Sipariş', value: data?.payload?.totalOrders ? `${data.payload.totalOrders.toLocaleString()}` : '0', trend: '+12', status: 'excellent', hasDetails: true },
  ];

  return (
    <div className="bg-white dark:bg-[#0A0A0B] rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 mb-10 shadow-sm dark:shadow-xl transition-colors">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-px bg-gray-200 dark:bg-white/10">
        {kpis.map((kpi) => (
          <div 
            key={kpi.id} 
            onClick={() => kpi.hasDetails ? setExpandedKpi(expandedKpi === kpi.id ? null : kpi.id) : null}
            className={`bg-white dark:bg-[#0A0A0B] p-5 flex flex-col justify-between group transition-colors relative ${kpi.hasDetails ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-[#121214]' : ''}`}
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-bold text-gray-500 dark:text-white/40 uppercase tracking-widest">
                {kpi.label}
              </span>
              {kpi.hasDetails && (
                <ArrowDown01Icon size={14} className={`text-gray-400 dark:text-white/30 transition-transform ${expandedKpi === kpi.id ? 'rotate-180 text-blue-500' : ''}`} />
              )}
            </div>
            
            {isLoading ? (
              <div className="h-8 bg-gray-100 dark:bg-white/5 rounded w-full animate-pulse"></div>
            ) : (
              <div className="flex items-end justify-between">
                <span className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{kpi.value}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                  kpi.status === 'excellent' ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-400/10' :
                  kpi.status === 'good' ? 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-400/10' :
                  kpi.status === 'warning' ? 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-400/10' :
                  'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-400/10'
                }`}>
                  {kpi.trend}
                </span>
              </div>
            )}
            
            {/* Active Highlight Line */}
            {expandedKpi === kpi.id && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500" />
            )}
          </div>
        ))}
      </div>
      
      {/* Expanded Accordion Area */}
      <div className={`grid transition-all duration-500 ease-in-out ${expandedKpi ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          {expandedKpi === 'users' && <UserListAccordion token={token} />}
          {expandedKpi === 'orders' && <OrderListAccordion token={token} />}
          {expandedKpi === 'pending' && <ListingListAccordion token={token} />}
          {expandedKpi === 'revenue-daily' && <RevenueDailyAccordion token={token} />}
          {expandedKpi === 'revenue-pending' && <PendingRevenueAccordion token={token} />}
          {expandedKpi === 'commission-pending' && <PendingCommissionAccordion token={token} />}
          {expandedKpi === 'dau' && <DAUAccordion token={token} />}
        </div>
      </div>
    </div>
  );
}
