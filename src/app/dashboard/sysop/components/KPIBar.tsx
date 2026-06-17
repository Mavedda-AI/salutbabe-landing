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
  Image01Icon,
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
    <div className="flex flex-col gap-0.5 text-xs whitespace-nowrap text-gray-600 dark:text-white/60 font-medium">
      <div className="flex gap-1">
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
    case 'under_review': return 'İncelemede';
    case 'draft': return 'Taslak';
    case 'shared_for_payment': return 'Ödeme Linki Paylaşıldı';
    default: return status;
  }
};

function ReportListAccordion({ token }: { token: string }) {
  const router = useRouter();
  const { data, isLoading } = useSWR(token ? [apiUrl('/admin/reports?status=pending'), token] : null, ([url, t]) => fetcher(url, t));
  const reports = data?.payload?.reports || [];

  if (isLoading) return <div className="p-6 text-center text-gray-500 dark:text-white/40 text-sm animate-pulse">Şikayetler Yükleniyor...</div>;

  return (
    <div className="bg-white dark:bg-[#0A0A0B] border-t border-gray-200 dark:border-white/10 p-6">
      <div className="flex items-center gap-3 mb-6">
        <CheckmarkBadge01Icon size={18} className="text-red-500" />
        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">İncelenmeyi Bekleyen Şikayetler</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-gray-500 dark:text-white/40 border-b border-gray-200 dark:border-white/10">
              <th className="pb-3 font-medium">Şikayet Eden</th>
              <th className="pb-3 font-medium">Tip / Hedef</th>
              <th className="pb-3 font-medium">Sebep</th>
              <th className="pb-3 font-medium text-right">Tarih</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
               <tr><td colSpan={4} className="py-4 text-center text-gray-500">Şikayet bulunmuyor. Harika!</td></tr>
            ) : reports.map((r: any, idx: number) => (
              <tr key={idx} className="border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer">
                <td className="py-3 text-gray-900 dark:text-white font-medium">
                  {r.reporter?.userName || 'Bilinmiyor'} {r.reporter?.userSurname || ''}
                </td>
                <td className="py-3 text-gray-500 dark:text-white/60">
                  <span className="uppercase text-xs font-bold text-gray-400">{r.targetType}</span>
                  <div className="text-[10px] truncate max-w-[150px]">{r.listing?.title || r.targetID}</div>
                </td>
                <td className="py-3 text-red-500 font-medium">{r.reason}</td>
                <td className="py-3 text-gray-400 dark:text-white/40 text-right">{formatDateAndTime(r.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function WithdrawalListAccordion({ token }: { token: string }) {
  const router = useRouter();
  const { data, isLoading } = useSWR(token ? [apiUrl('/admin/withdrawals'), token] : null, ([url, t]) => fetcher(url, t));
  const withdrawals = data?.payload?.withdrawals || [];

  if (isLoading) return <div className="p-6 text-center text-gray-500 dark:text-white/40 text-sm animate-pulse">Para Çekme Talepleri Yükleniyor...</div>;

  return (
    <div className="bg-white dark:bg-[#0A0A0B] border-t border-gray-200 dark:border-white/10 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Wallet01Icon size={18} className="text-emerald-500" />
        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Bekleyen Para Çekme Talepleri</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-gray-500 dark:text-white/40 border-b border-gray-200 dark:border-white/10">
              <th className="pb-3 font-medium">Kullanıcı</th>
              <th className="pb-3 font-medium">Tutar</th>
              <th className="pb-3 font-medium">Durum</th>
              <th className="pb-3 font-medium text-right">Tarih</th>
            </tr>
          </thead>
          <tbody>
            {withdrawals.length === 0 ? (
               <tr><td colSpan={4} className="py-4 text-center text-gray-500">Bekleyen talep yok.</td></tr>
            ) : withdrawals.map((w: any, idx: number) => (
              <tr key={idx} className="border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer">
                <td className="py-3 text-gray-900 dark:text-white font-medium">
                  {w.user?.userName || 'Bilinmiyor'} {w.user?.userSurname || ''}
                </td>
                <td className="py-3 text-gray-900 dark:text-white font-bold">{w.amount} ₺</td>
                <td className="py-3 text-amber-500 font-medium">Ödeme Bekliyor</td>
                <td className="py-3 text-gray-400 dark:text-white/40 text-right">{formatDateAndTime(w.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SupportTicketListAccordion({ token }: { token: string }) {
  const router = useRouter();
  const { data, isLoading } = useSWR(token ? [apiUrl('/admin/support-tickets?status=open'), token] : null, ([url, t]) => fetcher(url, t));
  const tickets = data?.payload?.tickets || [];

  if (isLoading) return <div className="p-6 text-center text-gray-500 dark:text-white/40 text-sm animate-pulse">Destek Talepleri Yükleniyor...</div>;

  return (
    <div className="bg-white dark:bg-[#0A0A0B] border-t border-gray-200 dark:border-white/10 p-6">
      <div className="flex items-center gap-3 mb-6">
        <UserGroupIcon size={18} className="text-blue-500" />
        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Açık Destek Talepleri</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-gray-500 dark:text-white/40 border-b border-gray-200 dark:border-white/10">
              <th className="pb-3 font-medium">Kullanıcı</th>
              <th className="pb-3 font-medium">Kategori</th>
              <th className="pb-3 font-medium">Konu</th>
              <th className="pb-3 font-medium text-right">Tarih</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length === 0 ? (
               <tr><td colSpan={4} className="py-4 text-center text-gray-500">Tüm talepler yanıtlanmış. Mükemmel!</td></tr>
            ) : tickets.map((t: any, idx: number) => (
              <tr key={idx} className="border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer">
                <td className="py-3 text-gray-900 dark:text-white font-medium">
                  {t.owner?.userName || 'Bilinmiyor'} {t.owner?.userSurname || ''}
                </td>
                <td className="py-3 text-gray-500 dark:text-white/60">{t.ticketCategory}</td>
                <td className="py-3 text-gray-900 dark:text-white font-medium">{t.ticketTitle}</td>
                <td className="py-3 text-gray-400 dark:text-white/40 text-right">{formatDateAndTime(t.ticketTime)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UserListAccordion({ token }: { token: string }) {
  const router = useRouter();
  const { data, isLoading } = useSWR(token ? [apiUrl('/admin/users?limit=100'), token] : null, ([url, t]) => fetcher(url, t));
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
                <td className="py-3 text-gray-500 dark:text-white/60">{new Date(user.registrationDate || user.createdAt).toLocaleDateString('tr-TR')}</td>
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
                <td className="py-3">{formatDatesDual(order.orderDate || order.createdAt, order.deliveredAt || order.shippedAt || order.updatedAt, order.status, order.deliveryConfirmedAt)}</td>
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
              <th className="pb-3 font-medium w-full min-w-[200px]">İlan Adı</th>
              <th className="pb-3 font-medium whitespace-nowrap px-4">Fiyat</th>
              <th className="pb-3 font-medium whitespace-nowrap px-4">Durum</th>
              <th className="pb-3 font-medium whitespace-nowrap pl-4">Tarih</th>
            </tr>
          </thead>
          <tbody>
            {listings.slice(0, 10).map((listing: any, idx: number) => (
              <tr 
                key={idx} 
                onClick={() => router.push('/dashboard/sysop/product-approval')}
                className="border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <td className="py-3 text-gray-900 dark:text-white font-medium pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-gray-100 dark:bg-white/5 flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {(() => {
                        const imgUrlRaw = (listing.images && listing.images[0]?.imageUrl) || (listing.photos && (typeof listing.photos[0] === 'string' ? listing.photos[0] : listing.photos[0]?.url)) || listing.image;
                        const finalUrl = imgUrlRaw && imgUrlRaw !== 'null' && imgUrlRaw !== 'undefined' ? (imgUrlRaw.startsWith('http') || imgUrlRaw.startsWith('data:') || imgUrlRaw.startsWith('blob:') ? imgUrlRaw : apiUrl('/media/' + imgUrlRaw)) : null;
                        return finalUrl ? (
                          <img src={finalUrl} alt={listing.title} className="w-full h-full object-cover" />
                        ) : (
                          <Image01Icon size={16} className="text-gray-400" />
                        );
                      })()}
                    </div>
                    <div className="line-clamp-2">{listing.title || 'İsimsiz'}</div>
                  </div>
                </td>
                <td className="py-3 text-gray-500 dark:text-white/60 whitespace-nowrap px-4">{listing.price} ₺</td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${listing.status === 'PENDING' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'}`}>
                    {translateStatus(listing.status)}
                  </span>
                </td>
                <td className="py-3 text-gray-400 dark:text-white/40 whitespace-nowrap pl-4">{formatDateAndTime(listing.updatedAt || listing.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ListingActionToggle({ listingId, currentStatus, token, onUpdate }: { listingId: string, currentStatus: string, token: string, onUpdate: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggle = async (newStatus: string) => {
    setLoading(true);
    try {
      await fetch(apiUrl(`/admin/listings/${listingId}/status`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });
      onUpdate();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  };

  const isActive = currentStatus === 'active';

  if (confirming) {
    return (
      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        <span className="text-xs text-gray-500 font-medium">Emin misiniz?</span>
        <button disabled={loading} onClick={() => handleToggle(isActive ? 'under_review' : 'active')} className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-[10px] rounded font-bold transition-colors">Evet</button>
        <button disabled={loading} onClick={() => setConfirming(false)} className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-[10px] rounded font-bold transition-colors">İptal</button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
      <button 
        onClick={() => setConfirming(true)}
        className={`px-3 py-1 rounded-full text-[10px] font-bold transition-colors ${isActive ? 'bg-red-50 dark:bg-red-500/10 text-red-600 hover:bg-red-100' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 hover:bg-emerald-100'}`}
      >
        {isActive ? 'Pasife Al' : 'Aktif Et'}
      </button>
    </div>
  );
}

function ActiveListingListAccordion({ token }: { token: string }) {
  const router = useRouter();
  const { data, isLoading, mutate } = useSWR(token ? [apiUrl('/admin/listings?status=active'), token] : null, ([url, t]) => fetcher(url, t));
  const listings = data?.payload?.listings || [];

  if (isLoading) return <div className="p-6 text-center text-gray-500 dark:text-white/40 text-sm animate-pulse">Aktif İlanlar Yükleniyor...</div>;

  return (
    <div className="p-6 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#050505]">
      <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Tag01Icon size={18} className="text-blue-500" /> Aktif İlanlar
      </h4>
      {listings.length === 0 ? (
        <div className="text-sm text-gray-500 dark:text-white/40 italic">Şu anda aktif ilan bulunmuyor.</div>
      ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-gray-500 dark:text-white/40 border-b border-gray-200 dark:border-white/10">
              <th className="pb-3 font-medium w-full min-w-[200px]">İlan Adı</th>
              <th className="pb-3 font-medium whitespace-nowrap px-4">Fiyat</th>
              <th className="pb-3 font-medium whitespace-nowrap px-4">Durum</th>
              <th className="pb-3 font-medium whitespace-nowrap pl-4">Tarih</th>
              <th className="pb-3 font-medium whitespace-nowrap pl-4 text-right">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {listings.slice(0, 10).map((listing: any, idx: number) => (
              <tr 
                key={idx} 
                onClick={() => router.push('/dashboard/sysop/product-management')}
                className="border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <td className="py-3 text-gray-900 dark:text-white font-medium pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-gray-100 dark:bg-white/5 flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {(() => {
                        const imgUrl = (listing.images && listing.images[0]?.imageUrl) || (listing.photos && (typeof listing.photos[0] === 'string' ? listing.photos[0] : listing.photos[0]?.url)) || listing.image;
                        return imgUrl && imgUrl !== 'null' && imgUrl !== 'undefined' ? (
                          <img src={imgUrl.startsWith('http') ? imgUrl : `https://via.placeholder.com/150?text=Resim`} alt={listing.title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150?text=Hata'; }} />
                        ) : (
                          <Image01Icon size={16} className="text-gray-400" />
                        );
                      })()}
                    </div>
                    <div className="line-clamp-2">{listing.title || 'İsimsiz'}</div>
                  </div>
                </td>
                <td className="py-3 text-gray-500 dark:text-white/60 whitespace-nowrap px-4">{listing.price} ₺</td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${listing.status === 'active' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400'}`}>
                    {translateStatus(listing.status)}
                  </span>
                </td>
                <td className="py-3 text-gray-400 dark:text-white/40 whitespace-nowrap pl-4">{formatDateAndTime(listing.updatedAt || listing.createdAt)}</td>
                <td className="py-3 whitespace-nowrap pl-4 text-right">
                  <ListingActionToggle listingId={listing.listingID} currentStatus={listing.status} token={token} onUpdate={() => mutate()} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}

function PassiveListingListAccordion({ token }: { token: string }) {
  const router = useRouter();
  const { data, isLoading, mutate } = useSWR(token ? [apiUrl('/admin/listings?status=passive'), token] : null, ([url, t]) => fetcher(url, t));
  const listings = data?.payload?.listings || [];

  if (isLoading) return <div className="p-6 text-center text-gray-500 dark:text-white/40 text-sm animate-pulse">Pasif İlanlar Yükleniyor...</div>;

  return (
    <div className="p-6 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#050505]">
      <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Tag01Icon size={18} className="text-gray-500" /> Pasif İlanlar
      </h4>
      {listings.length === 0 ? (
        <div className="text-sm text-gray-500 dark:text-white/40 italic">Şu anda pasif ilan bulunmuyor.</div>
      ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-gray-500 dark:text-white/40 border-b border-gray-200 dark:border-white/10">
              <th className="pb-3 font-medium w-full min-w-[200px]">İlan Adı</th>
              <th className="pb-3 font-medium whitespace-nowrap px-4">Fiyat</th>
              <th className="pb-3 font-medium whitespace-nowrap px-4">Durum</th>
              <th className="pb-3 font-medium whitespace-nowrap pl-4">Tarih</th>
              <th className="pb-3 font-medium whitespace-nowrap pl-4 text-right">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {listings.slice(0, 10).map((listing: any, idx: number) => (
              <tr 
                key={idx} 
                onClick={() => router.push('/dashboard/sysop/passive-listings')}
                className="border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <td className="py-3 text-gray-900 dark:text-white font-medium pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-gray-100 dark:bg-white/5 flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {(() => {
                        const imgUrl = (listing.images && listing.images[0]?.imageUrl) || (listing.photos && (typeof listing.photos[0] === 'string' ? listing.photos[0] : listing.photos[0]?.url)) || listing.image;
                        return imgUrl && imgUrl !== 'null' && imgUrl !== 'undefined' ? (
                          <img src={imgUrl.startsWith('http') ? imgUrl : `https://via.placeholder.com/150?text=Resim`} alt={listing.title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150?text=Hata'; }} />
                        ) : (
                          <Image01Icon size={16} className="text-gray-400" />
                        );
                      })()}
                    </div>
                    <div className="line-clamp-2">{listing.title || 'İsimsiz'}</div>
                  </div>
                </td>
                <td className="py-3 text-gray-500 dark:text-white/60 whitespace-nowrap px-4">{listing.price} ₺</td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${listing.status === 'active' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400'}`}>
                    {translateStatus(listing.status)}
                  </span>
                </td>
                <td className="py-3 text-gray-400 dark:text-white/40 whitespace-nowrap pl-4">{formatDateAndTime(listing.updatedAt || listing.createdAt)}</td>
                <td className="py-3 whitespace-nowrap pl-4 text-right">
                  <ListingActionToggle listingId={listing.listingID} currentStatus={listing.status} token={token} onUpdate={() => mutate()} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
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
              <th className="pb-3 font-medium">Satıcı</th>
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
                <td className="py-3 text-gray-500 dark:text-white/60">{order.seller?.userName} {order.seller?.userSurname}</td>
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
                <td className="py-3">{formatDatesDual(order.orderDate || order.createdAt, order.deliveredAt || order.shippedAt || order.updatedAt, order.status, order.deliveryConfirmedAt)}</td>
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

  const completedOrders = orders.filter((o: any) => ['delivered', 'completed', 'DELIVERED', 'COMPLETED'].includes(o.status));
  const pendingOrders = orders.filter((o: any) => ['processing', 'pending', 'shipped', 'paid', 'pending_payment', 'PROCESSING', 'PENDING', 'SHIPPED'].includes(o.status));

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
                <td className="py-3 text-gray-500 dark:text-white/60">{order.selectedCargoCompanyName || order.cargoCompany || 'Bilinmeyen Kargo'}</td>
                <td className="py-3 text-amber-600 dark:text-amber-400 font-bold text-right">
                  -{Number(order.items?.reduce((sum: number, item: any) => sum + Number(item.listing?.shippingPrice || 0), 0) || 0).toLocaleString('tr-TR')} ₺
                </td>
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
  const { data, isLoading } = useSWR(token ? [apiUrl('/admin/users?limit=100'), token] : null, ([url, t]) => fetcher(url, t));
  const users = data?.payload?.users || [];
  
  const activeSortedUsers = [...users].sort((a: any, b: any) => {
    const aTime = a.lastSeenAt ? new Date(Number(a.lastSeenAt)).getTime() : 0;
    const bTime = b.lastSeenAt ? new Date(Number(b.lastSeenAt)).getTime() : 0;
    return bTime - aTime;
  });

  const isOnline = (lastSeenAt: any) => {
    if (!lastSeenAt) return false;
    const diff = Date.now() - new Date(Number(lastSeenAt)).getTime();
    return diff < 15 * 60 * 1000; // 15 mins
  };

  const timeAgo = (lastSeenAt: any) => {
    if (!lastSeenAt) return 'Hiç girmedi';
    const date = new Date(Number(lastSeenAt));
    const timeStr = date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return `Şimdi (${timeStr})`;
    if (diffMins < 60) return `${diffMins} dk önce (${timeStr})`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} saat önce (${timeStr})`;
    return `${Math.floor(diffHours / 24)} gün önce (${timeStr})`;
  };

  const formatSessionTime = (seconds?: number) => {
    if (!seconds) return 'Bilinmiyor';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h} sa ${m} dk`;
    return `${m} dk`;
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
              <th className="pb-3 font-medium">Geçirilen Süre</th>
              <th className="pb-3 font-medium text-right">Son Etkileşim</th>
            </tr>
          </thead>
          <tbody>
            {activeSortedUsers.slice(0, 5).map((user: any, idx: number) => {
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
                  <td className="py-3 text-gray-500 dark:text-white/60 font-medium">
                    {formatSessionTime(user.totalAppSessionSeconds)}
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
  
  const { data: ordersData } = useSWR(
    token ? [apiUrl('/admin/orders'), token] : null,
    ([url, token]) => fetcher(url, token)
  );

  const { data: reportsData } = useSWR(
    token ? [apiUrl('/admin/reports'), token] : null,
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
  const calculatedCargoPending = (!useCalculated && payload.totalCargoCost) ? payload.totalCargoCost : activeOrdersArr.reduce((acc: number, order: any) => acc + (order.items?.reduce((sum: number, item: any) => sum + Number(item.listing?.shippingPrice || 0), 0) || 0), 0);

  const reportsCount = reportsData?.payload?.total || reportsData?.payload?.reports?.length || 0;

  const { data: activeListingsData } = useSWR(
    token ? [apiUrl('/admin/listings?status=active&limit=1'), token] : null,
    ([url, t]) => fetcher(url, t)
  );
  const fetchedActiveCount = activeListingsData?.payload?.total || payload.activeListings || 0;

  const { data: passiveListingsData } = useSWR(
    token ? [apiUrl('/admin/listings?status=passive&limit=1'), token] : null,
    ([url, t]) => fetcher(url, t)
  );
  const fetchedPassiveCount = passiveListingsData?.payload?.total || 0;

  const pendingWithdrawalsCount = payload.pendingWithdrawalsCount || 0;
  const openSupportTicketsCount = payload.openSupportTicketsCount || 0;

  const kpis = [
    { id: 'revenue-daily', label: 'Gerçekleşen Ciro', value: calculatedRevenue ? `${formatCompactNumber(calculatedRevenue)} ₺` : '0 ₺', trend: '+%11', status: 'excellent', hasDetails: true },
    { id: 'revenue-pending', label: 'Tahmini Bekleyen Ciro', value: calculatedPendingRevenue ? `${formatCompactNumber(calculatedPendingRevenue)} ₺` : '0 ₺', trend: '+%8', status: 'good', hasDetails: true },
    { id: 'transfer-pending', label: 'Aktarılacak Ödemeler', value: calculatedTransferPending ? `${formatCompactNumber(calculatedTransferPending)} ₺` : '0 ₺', trend: 'Öncelikli', status: 'excellent', hasDetails: true },
    { id: 'withdrawals', label: 'Para Çekme Talepleri', value: pendingWithdrawalsCount ? `${formatCompactNumber(pendingWithdrawalsCount)}` : '0', trend: pendingWithdrawalsCount > 0 ? 'Öncelikli' : 'Yok', status: pendingWithdrawalsCount > 0 ? 'warning' : 'good', hasDetails: true },
    { id: 'cargo-pending', label: 'Kargoya Ödenecek Tutar', value: calculatedCargoPending ? `${formatCompactNumber(calculatedCargoPending)} ₺` : '0 ₺', trend: 'Gider', status: 'warning', hasDetails: true },
    { id: 'commission', label: 'Komisyon', value: calculatedTotalCommission ? `${formatCompactNumber(calculatedTotalCommission)} ₺` : '0 ₺', trend: '+%4', status: 'good', hasDetails: true },
    { id: 'users', label: 'Toplam Kullanıcı', value: calculatedTotalUsers ? `${formatCompactNumber(calculatedTotalUsers)}` : '0', trend: '+%1.2', status: 'good', hasDetails: true },
    { id: 'dau', label: 'Aktif Kullanıcı (DAU)', value: payload.activeUsers ? `${formatCompactNumber(payload.activeUsers)}` : '0', trend: '+%3', status: 'good', hasDetails: true },
    { id: 'pending', label: 'Bekleyen İlanlar', value: payload.pendingListings ? `${formatCompactNumber(payload.pendingListings)}` : '0', trend: '-1', status: 'warning', hasDetails: true },
    { id: 'reports', label: 'Şikayet Edilen Ürünler', value: reportsCount ? `${formatCompactNumber(reportsCount)}` : '0', trend: reportsCount > 0 ? 'İncele' : 'Yok', status: reportsCount > 0 ? 'warning' : 'good', hasDetails: true },
    { id: 'orders', label: 'Toplam Sipariş', value: calculatedTotalOrders ? `${formatCompactNumber(calculatedTotalOrders)}` : '0', trend: '+12', status: 'excellent', hasDetails: true },
    { id: 'active-listings', label: 'Aktif İlanlar', value: fetchedActiveCount ? `${formatCompactNumber(fetchedActiveCount)}` : '0', trend: 'Artışta', status: 'good', hasDetails: true },
    { id: 'passive-listings', label: 'Pasif İlanlar', value: fetchedPassiveCount ? `${formatCompactNumber(fetchedPassiveCount)}` : '0', trend: 'Bekliyor', status: 'warning', hasDetails: true },
    { id: 'support-tickets', label: 'Destek Talepleri', value: openSupportTicketsCount ? `${formatCompactNumber(openSupportTicketsCount)}` : '0', trend: openSupportTicketsCount > 0 ? 'Yanıtla' : 'Yok', status: openSupportTicketsCount > 0 ? 'warning' : 'good', hasDetails: true },
  ];

  return (
    <div className="bg-white dark:bg-[#0A0A0B] rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 mb-10 shadow-sm dark:shadow-xl transition-colors">
      <div className="flex justify-end items-center bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10 px-4 py-2">
        <div className="relative flex items-center bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-lg px-2 shadow-sm transition-colors hover:border-black dark:border-white/50 group cursor-pointer">
          <Calendar01Icon size={14} className="text-gray-400 dark:text-white/40 group-hover:text-[#101516] dark:text-white transition-colors" />
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
          <ArrowDown01Icon size={12} className="absolute right-2 text-gray-400 group-hover:text-[#101516] dark:text-white pointer-events-none transition-colors" />
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
          {expandedKpi === 'dau' && <DAUAccordion token={token || ''} />}
          {expandedKpi === 'reports' && <ReportListAccordion token={token || ''} />}
          {expandedKpi === 'withdrawals' && <WithdrawalListAccordion token={token || ''} />}
          {expandedKpi === 'support-tickets' && <SupportTicketListAccordion token={token || ''} />}
          {expandedKpi === 'orders' && <OrderListAccordion token={token || ''} />}
          {expandedKpi === 'pending' && <ListingListAccordion token={token || ''} />}
          {expandedKpi === 'active-listings' && <ActiveListingListAccordion token={token || ''} />}
          {expandedKpi === 'passive-listings' && <PassiveListingListAccordion token={token || ''} />}
          {expandedKpi === 'revenue-daily' && <RevenueDailyAccordion token={token || ''} />}
          {expandedKpi === 'revenue-pending' && <PendingRevenueAccordion token={token || ''} />}
          {expandedKpi === 'transfer-pending' && <TransferPendingAccordion token={token || ''} />}
          {expandedKpi === 'cargo-pending' && <CargoPendingAccordion token={token || ''} />}
          {expandedKpi === 'commission' && <CommissionAccordion token={token || ''} />}
        </div>
      </div>
    </div>
  );
}
