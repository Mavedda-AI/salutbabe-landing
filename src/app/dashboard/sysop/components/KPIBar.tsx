import React, {useState} from 'react';
import useSWR from 'swr';
import {useRouter} from 'next/navigation';
import {apiUrl} from '../../../../lib/api';
import {useAuthStore} from '../../../../store/useAuthStore';
import {
  ArrowDown01Icon,
  BankIcon,
  Calendar01Icon,
  CheckmarkBadge01Icon,
  PercentCircleIcon,
  ShoppingCart01Icon,
  Tag01Icon,
  UserCircleIcon,
  UserGroupIcon,
  Wallet01Icon
} from 'hugeicons-react';

const fetcher = (url: string, token: string) => fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json());

const formatDatesDual = (createdAt: any, updatedAt: any, status?: string, deliveryConfirmedAt?: any) => {
  if (!createdAt) return '-';
  const createdDate = new Date(createdAt);
  const updatedDate = updatedAt ? new Date(updatedAt) : null;
  const isDelivered = status?.toLowerCase() === 'delivered';
  
  return (
    <div className="flex flex-col gap-0.5 text-[10px] whitespace-nowrap">
      <div className="opacity-60 flex gap-1">
        <span>Sipariş:</span>
        <span>{createdDate.toLocaleDateString('tr-TR')} {createdDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      {updatedDate && Math.abs(createdDate.getTime() - updatedDate.getTime()) > 60000 && (
      <div className={`flex gap-1 ${isDelivered ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-blue-600 dark:text-blue-400 font-medium'}`}>
        <span>{isDelivered ? 'Teslim:' : 'Güncel:'}</span>
        <span>{updatedDate.toLocaleDateString('tr-TR')} {updatedDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      )}
      {deliveryConfirmedAt ? (
      <div className="flex gap-1 text-gray-900 dark:text-white font-medium">
        <span>Alıcı Onay:</span>
        <span>{new Date(Number(deliveryConfirmedAt)).toLocaleDateString('tr-TR')} {new Date(Number(deliveryConfirmedAt)).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      ) : status?.toLowerCase() === 'completed' ? (
      <div className="flex gap-1 text-gray-900 dark:text-white font-medium">
        <span>Alıcı Onay:</span>
        <span className="opacity-60 italic">Otomatik / Sistem</span>
      </div>
      ) : isDelivered ? (
      <div className="flex gap-1 text-gray-900 dark:text-white font-medium">
        <span>Alıcı Onay:</span>
        <span className="opacity-60 italic">Bekleniyor</span>
      </div>
      ) : null}
    </div>
  );
};

const formatDateAndTime = (dateInput: any) => {
  if (!dateInput) return '-';
  const date = new Date(dateInput);
  return (
    <div className="flex flex-col whitespace-nowrap">
      <span>{date.toLocaleDateString('tr-TR')}</span>
      <span className="text-[10px] opacity-60 mt-0.5">{date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
    </div>
  );
};

const translateStatus = (status: string) => {
  if (!status) return 'BİLİNMİYOR';
  switch (status.toLowerCase()) {
    case 'processing': return 'İşleniyor';
    case 'delivered': return 'Teslim Edildi';
    case 'shipped': return 'Kargoya Verildi';
    case 'completed': return 'Tamamlandı';
    case 'cancelled': return 'İptal Edildi';
    case 'pending_payment': return 'Ödeme Bekleniyor';
    case 'paid': return 'Ödendi';
    case 'refunded': return 'İade Edildi';
    case 'pending': return 'Bekliyor';
    case 'approved': return 'Onaylandı';
    case 'rejected': return 'Reddedildi';
    case 'active': return 'Aktif';
    default: return status;
  }
};

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
                    {translateStatus(order.status)}
                  </span>
                </td>
                <td className="py-3 text-gray-400 dark:text-white/40">{formatDatesDual(order.orderDate || order.createdAt, order.deliveredAt || order.shippedAt || order.updatedAt, order.status, order.deliveryConfirmedAt)}</td>
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
                    {translateStatus(listing.status)}
                  </span>
                </td>
                <td className="py-3 text-gray-400 dark:text-white/40">{formatDateAndTime(listing.updatedAt || listing.createdAt)}</td>
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
                <td className="py-3 text-gray-400 dark:text-white/40">{formatDatesDual(order.orderDate || order.createdAt, order.deliveredAt || order.shippedAt || order.updatedAt, order.status, order.deliveryConfirmedAt)}</td>
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

function CommissionAccordion({ token }: { token: string }) {
  const router = useRouter();
  const { data, isLoading } = useSWR(token ? [apiUrl('/admin/orders'), token] : null, ([url, t]) => fetcher(url, t));
  const orders = data?.payload?.orders || [];

  if (isLoading) return <div className="p-6 text-center text-gray-500 dark:text-white/40 text-sm animate-pulse">Komisyon Detayları Yükleniyor...</div>;

  const completedOrders = orders.filter((o: any) => o.status === 'DELIVERED' || o.status === 'COMPLETED');
  const pendingOrders = orders.filter((o: any) => o.status === 'PROCESSING' || o.status === 'PENDING' || o.status === 'SHIPPED');

  const formatCompactNumber = (num: number) => num.toLocaleString('tr-TR', { maximumFractionDigits: 2 });

  const renderTable = (orderList: any[], title: string, iconColor: string) => (
    <div className="mb-6 last:mb-0">
      <h5 className={`text-xs font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wider flex items-center gap-2 ${iconColor}`}>
        {title}
      </h5>
      {orderList.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-500 dark:text-white/40 border-b border-gray-200 dark:border-white/10">
                <th className="pb-3 font-medium">Satış ID</th>
                <th className="pb-3 font-medium">Toplam Tutar</th>
                <th className="pb-3 font-medium text-right">Platform Karı (%15)</th>
              </tr>
            </thead>
            <tbody>
              {orderList.slice(0, 5).map((order: any, idx: number) => (
                <tr 
                  key={idx} 
                  onClick={() => router.push('/dashboard/sysop/order-management')}
                  className="border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <td className="py-3 text-gray-900 dark:text-white font-medium">#{order.orderID?.split('-')[0] || order.id || 'Bilinmiyor'}</td>
                  <td className="py-3 text-gray-500 dark:text-white/60">{order.totalAmount} ₺</td>
                  <td className="py-3 text-fuchsia-600 dark:text-fuchsia-400 font-bold text-right">+{formatCompactNumber(order.totalAmount * 0.15)} ₺</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-xs text-gray-500 dark:text-white/40 italic">Bu kategoride işlem bulunmuyor.</div>
      )}
    </div>
  );

  return (
    <div className="p-6 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#050505]">
      <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <PercentCircleIcon size={18} className="text-fuchsia-500" /> Platform Komisyon Analizi
      </h4>
      
      {renderTable(completedOrders, 'Gerçekleşen (İçerideki) Komisyonlar', 'text-emerald-500')}
      {renderTable(pendingOrders, 'Tahsil Edilmeyi Bekleyen Komisyonlar', 'text-amber-500')}

    </div>
  );
}

function TransferPendingAccordion({ token }: { token: string }) {
  const router = useRouter();
  const { data, isLoading } = useSWR(token ? [apiUrl('/admin/orders'), token] : null, ([url, t]) => fetcher(url, t));
  const orders = data?.payload?.orders || [];

  if (isLoading) return <div className="p-6 text-center text-gray-500 dark:text-white/40 text-sm animate-pulse">Aktarılacak Ödemeler Yükleniyor...</div>;

  return (
    <div className="p-6 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#050505]">
      <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Wallet01Icon size={18} className="text-blue-500" /> Satıcılara Aktarılacak Ödemeler (Hakedişler)
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-gray-500 dark:text-white/40 border-b border-gray-200 dark:border-white/10">
              <th className="pb-3 font-medium">Satış ID</th>
              <th className="pb-3 font-medium">Satıcı</th>
              <th className="pb-3 font-medium text-right">Aktarılacak Tutar (%85)</th>
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
                <td className="py-3 text-gray-500 dark:text-white/60">{order.seller?.userName || 'Bilinmeyen Satıcı'}</td>
                <td className="py-3 text-blue-600 dark:text-blue-400 font-bold text-right">+{Math.round(order.totalAmount * 0.85)} ₺</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CargoPendingAccordion({ token }: { token: string }) {
  const router = useRouter();
  const { data, isLoading } = useSWR(token ? [apiUrl('/admin/orders'), token] : null, ([url, t]) => fetcher(url, t));
  const orders = data?.payload?.orders || [];
  const activeOrdersArr = orders.filter((o: any) => { const s = o.status?.toLowerCase(); return s === 'processing' || s === 'pending_payment' || s === 'shipped' || s === 'paid'; });

  if (isLoading) return <div className="p-6 text-center text-gray-500 dark:text-white/40 text-sm animate-pulse">Kargo Bekleyenler Yükleniyor...</div>;

  return (
    <div className="p-6 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#050505]">
      <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <ShoppingCart01Icon size={18} className="text-amber-500" /> Kargo Firmalarına Ödenecek Giderler
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-gray-500 dark:text-white/40 border-b border-gray-200 dark:border-white/10">
              <th className="pb-3 font-medium">Satış ID</th>
              <th className="pb-3 font-medium">Tahmini Kargo Firması</th>
              <th className="pb-3 font-medium text-right">Kargo Gideri (₺)</th>
            </tr>
          </thead>
          <tbody>
            {activeOrdersArr.slice(0, 5).map((order: any, idx: number) => (
              <tr 
                key={idx} 
                onClick={() => router.push('/dashboard/sysop/shipping-management')}
                className="border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <td className="py-3 text-gray-900 dark:text-white font-medium">#{order.orderID?.split('-')[0] || order.id || 'Bilinmiyor'}</td>
                <td className="py-3 text-gray-500 dark:text-white/60">{order.shippingCompany || order.shippingProvider || 'Bilinmeyen Kargo'}</td>
                <td className="py-3 text-amber-600 dark:text-amber-400 font-bold text-right">-{Number(order.shippingPrice || order.shippingCost || 0).toLocaleString('tr-TR')} ₺</td>
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
  const { data: realData, isLoading } = useSWR(
    token ? [apiUrl('/admin/dashboard'), token] : null,
    ([url, token]) => fetcher(url, token)
  );
  
  // Fetch orders specifically to compute financial stats if they are missing
  const { data: ordersData } = useSWR(
    token ? [apiUrl('/admin/orders'), token] : null,
    ([url, token]) => fetcher(url, token)
  );

  const MOCK_MODE = false;
  const data = MOCK_MODE ? {
    payload: {
      totalRevenue: 100000000,
      pendingRevenue: 15000000,
      pendingCommission: 2250000,
      totalUsers: 1854000,
      activeUsers: 34000,
      pendingListings: 420,
      totalOrders: 412500,
      users: realData?.payload?.users || [],
      orders: realData?.payload?.orders || [],
      listings: realData?.payload?.listings || []
    }
  } : realData;

  const [expandedKpi, setExpandedKpi] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<string>("Tümü");

  const formatCompactNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toLocaleString('tr-TR', { maximumFractionDigits: 2 }) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toLocaleString('tr-TR', { maximumFractionDigits: 2 }) + 'B';
    }
    return num.toLocaleString('tr-TR', { maximumFractionDigits: 2 }); // Added fraction digits for exact order amounts
  };

  // Compute dynamic fallbacks if the backend doesn't provide aggregated KPIs
  const payload = data?.payload || {};
  const rawOrders = payload.orders || ordersData?.payload?.orders || [];
  const rawUsers = payload.users || [];
  const rawListings = payload.listings || [];

  const filterByTimeframe = (items: any[], dateField1: string, dateField2?: string) => {
    if (timeframe === 'Tümü') return items;
    const now = new Date();
    return items.filter(item => {
      const dateVal = item[dateField1] || (dateField2 ? item[dateField2] : null);
      if (!dateVal) return false;
      const itemDate = new Date(dateVal);
      const diffDays = (now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24);
      if (timeframe === 'Günlük') return diffDays <= 1;
      if (timeframe === 'Haftalık') return diffDays <= 7;
      if (timeframe === 'Aylık') return diffDays <= 30;
      if (timeframe === 'Yıllık') return diffDays <= 365;
      return true;
    });
  };

  const orders = filterByTimeframe(rawOrders, 'orderDate', 'createdAt');
  const users = filterByTimeframe(rawUsers, 'createdAt');
  const listings = filterByTimeframe(rawListings, 'createdAt');

  // Sadece tamamlanmış siparişler gerçekleşen ciroya yansır
  const completedOrders = orders.filter((o: any) => { const s = o.status?.toLowerCase(); return s === 'delivered' || s === 'completed'; });
  const activeOrdersArr = orders.filter((o: any) => { const s = o.status?.toLowerCase(); return s === 'processing' || s === 'pending_payment' || s === 'shipped' || s === 'paid'; });
  
  const useCalculated = timeframe !== 'Tümü' || !payload.totalRevenue;

  const calculatedRevenue = (!useCalculated && payload.totalRevenue) ? payload.totalRevenue : completedOrders.reduce((acc: number, order: any) => acc + Number(order.totalAmount || 0), 0);
  const calculatedPendingRevenue = (!useCalculated && payload.pendingRevenue) ? payload.pendingRevenue : activeOrdersArr.reduce((acc: number, order: any) => acc + Number(order.totalAmount || 0), 0);
  
  const calculatedRealizedCommission = calculatedRevenue * 0.15; // 15% commission rate
  const calculatedPendingCommission = calculatedPendingRevenue * 0.15;
  const calculatedTotalCommission = (!useCalculated && payload.totalCommission) ? payload.totalCommission : (calculatedRealizedCommission + calculatedPendingCommission);
  
  const calculatedTransferPending = (calculatedRevenue + calculatedPendingRevenue) * 0.85; // Aktarılacak ödemeler toplamı
  const calculatedActiveOrders = (!useCalculated && payload.activeOrders) ? payload.activeOrders : activeOrdersArr.length;
  const calculatedTotalOrders = (!useCalculated && payload.totalOrders) ? payload.totalOrders : orders.length;
  const calculatedTotalUsers = (!useCalculated && payload.totalUsers) ? payload.totalUsers : (users.length || payload.users?.length || 0);
  const calculatedCargoPending = (!useCalculated && payload.totalCargoCost) ? payload.totalCargoCost : activeOrdersArr.reduce((acc: number, order: any) => acc + Number(order.shippingPrice || order.shippingCost || 0), 0);

  const kpis = [
    { id: 'revenue-daily', label: 'Gerçekleşen Ciro', value: calculatedRevenue ? `${formatCompactNumber(calculatedRevenue)} ₺` : '0 ₺', trend: '+%11', status: 'excellent', hasDetails: true },
    { id: 'revenue-pending', label: 'Tahmini Bekleyen Ciro', value: calculatedPendingRevenue ? `${formatCompactNumber(calculatedPendingRevenue)} ₺` : '0 ₺', trend: '+%8', status: 'good', hasDetails: true },
    { id: 'transfer-pending', label: 'Aktarılacak Ödemeler', value: calculatedTransferPending ? `${formatCompactNumber(calculatedTransferPending)} ₺` : '0 ₺', trend: 'Öncelikli', status: 'excellent', hasDetails: true },
    { id: 'cargo-pending', label: 'Kargoya Ödenecek Tutar', value: calculatedCargoPending ? `${formatCompactNumber(calculatedCargoPending)} ₺` : '0 ₺', trend: 'Gider', status: 'warning', hasDetails: true },
    { id: 'commission', label: 'Komisyon', value: calculatedTotalCommission ? `${formatCompactNumber(calculatedTotalCommission)} ₺` : '0 ₺', trend: '+%4', status: 'good', hasDetails: true },
    { id: 'users', label: 'Toplam Kullanıcı', value: calculatedTotalUsers ? `${formatCompactNumber(calculatedTotalUsers)}` : '0', trend: '+%1.2', status: 'good', hasDetails: true },
    { id: 'dau', label: 'Aktif Kullanıcı (DAU)', value: payload.activeUsers ? `${formatCompactNumber(payload.activeUsers)}` : '0', trend: '+%3', status: 'good', hasDetails: true },
    { id: 'pending', label: 'Bekleyen İlanlar', value: payload.pendingListings ? `${formatCompactNumber(payload.pendingListings)}` : '0', trend: '-1', status: 'warning', hasDetails: true },
    { id: 'orders', label: 'Toplam Sipariş', value: calculatedTotalOrders ? `${formatCompactNumber(calculatedTotalOrders)}` : '0', trend: '+12', status: 'excellent', hasDetails: true },
    { id: 'active-listings', label: 'Aktif İlanlar', value: payload.activeListings ? `${formatCompactNumber(payload.activeListings)}` : '0', trend: 'Artışta', status: 'good', hasDetails: false },
  ];

  return (
    <div className="bg-white dark:bg-[#0A0A0B] rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 mb-10 shadow-sm dark:shadow-xl transition-colors">
      <div className="flex justify-end items-center bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10 px-4 py-2">
        <div className="relative flex items-center bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-lg px-2 shadow-sm transition-colors hover:border-[#54E6D4]/50 group cursor-pointer">
          <Calendar01Icon size={14} className="text-gray-400 dark:text-white/40 group-hover:text-[#54E6D4] transition-colors" />
          <select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value)}
            className="appearance-none bg-transparent pl-2 pr-6 py-1.5 text-xs font-bold text-gray-700 dark:text-white/80 focus:outline-none cursor-pointer"
          >
            <option value="Tümü">Tümü</option>
            <option value="Yıllık">Yıllık</option>
            <option value="Aylık">Aylık</option>
            <option value="Haftalık">Haftalık</option>
            <option value="Günlük">Günlük</option>
          </select>
          <ArrowDown01Icon size={12} className="absolute right-2 text-gray-400 group-hover:text-[#54E6D4] pointer-events-none transition-colors" />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-px bg-gray-200 dark:bg-white/10">
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
          {expandedKpi === 'users' && <UserListAccordion token={token || ''} />}
          {expandedKpi === 'orders' && <OrderListAccordion token={token || ''} />}
          {expandedKpi === 'pending' && <ListingListAccordion token={token || ''} />}
          {expandedKpi === 'revenue-daily' && <RevenueDailyAccordion token={token || ''} />}
          {expandedKpi === 'revenue-pending' && <PendingRevenueAccordion token={token || ''} />}
          {expandedKpi === 'transfer-pending' && <TransferPendingAccordion token={token || ''} />}
          {expandedKpi === 'cargo-pending' && <CargoPendingAccordion token={token || ''} />}
          {expandedKpi === 'commission' && <CommissionAccordion token={token || ''} />}
          {expandedKpi === 'dau' && <DAUAccordion token={token || ''} />}
        </div>
      </div>
    </div>
  );
}
