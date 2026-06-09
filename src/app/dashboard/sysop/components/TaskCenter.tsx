import React, {useState} from 'react';
import {ArrowRight01Icon, Task01Icon} from 'hugeicons-react';
import {useRouter} from 'next/navigation';
import useSWR from 'swr';
import {apiUrl} from '../../../../lib/api';
import {useAuthStore} from '../../../../store/useAuthStore';

const fetcher = (url: string, token: string) => fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json());

// Tasks will be generated dynamically

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

  const payload = data?.payload || {};
  const kpis = payload.kpis || {};
  const orderStatuses = payload.charts?.orderStatuses || [];
  
  // Calculate dynamic data
  const calculateTotalRevenue = () => kpis.revenue || 0;
  
  // SWR for orders to get accurate pending
  const { data: ordersData } = useSWR(token ? [apiUrl('/admin/orders'), token] : null, ([url, t]) => fetcher(url, t));
  const orders = ordersData?.payload?.orders || [];
  const activeOrdersArr = orders.filter((o: any) => { const s = o.status?.toLowerCase(); return s === 'processing' || s === 'pending_payment' || s === 'shipped' || s === 'paid'; });
  const calculatedPendingRevenue = activeOrdersArr.reduce((acc: number, order: any) => acc + Number(order.totalAmount || 0), 0);
  
  // Generate real tasks based on actual data
  const dynamicTasks = [];
  
  if (calculateTotalRevenue() > 0 || calculatedPendingRevenue > 0) {
    dynamicTasks.push({
      id: 'transfer',
      title: 'Aktarılacak ödemeler',
      impact: 'Kritik',
      area: 'Finans',
      domain: 'financial'
    });
  }
  
  if (activeOrdersArr.length > 0) {
    dynamicTasks.push({
      id: 'cargo',
      title: 'Kargoya ödenecek tutar',
      impact: 'Orta',
      area: 'Operasyon',
      domain: 'marketplace'
    });
  }
  
  if (kpis.pendingApprovals > 0) {
    dynamicTasks.push({
      id: 'approval',
      title: 'Onay bekleyen ilanlar',
      impact: 'Yüksek',
      area: 'Pazaryeri',
      domain: 'marketplace'
    });
  }

  const invoiceOrders = orders.filter((o: any) => o.status !== 'cancelled' && o.status !== 'refunded' && o.status !== 'invalid' && o.status !== 'pending_payment');
  if (invoiceOrders.length > 0) {
    dynamicTasks.push({
      id: 'invoice',
      title: 'Bekleyen faturaları kes',
      impact: 'Yüksek',
      area: 'Muhasebe',
      domain: 'accounting'
    });
  }

  const failedOrders = orders.filter((o: any) => o.status === 'invalid' || o.status === 'failed' || o.status === 'pending_payment');
  const failedRevenue = failedOrders.reduce((acc: number, order: any) => acc + Number(order.totalAmount || 0), 0);
  if (failedOrders.length > 0) {
    dynamicTasks.push({
      id: 'failed_payments',
      title: 'Başarısız / Bekleyen Ödemeler',
      impact: 'Orta',
      area: 'Finans',
      domain: 'financial'
    });
  }

  const cancelledOrders = orders.filter((o: any) => o.status === 'cancelled' || o.status === 'refunded');
  const cancelledRevenue = cancelledOrders.reduce((acc: number, order: any) => acc + Number(order.totalAmount || 0), 0);
  if (cancelledOrders.length > 0) {
    dynamicTasks.push({
      id: 'cancellations',
      title: 'İptal ve İadeleri İncele',
      impact: 'Yüksek',
      area: 'Operasyon',
      domain: 'marketplace'
    });
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4 px-1 lg:px-0">
        <div className="p-2 bg-fuchsia-50 dark:bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 rounded-lg">
          <Task01Icon size={16} />
        </div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Görev Listesi</h3>
      </div>
      
      <div className="flex flex-col gap-2 flex-1">
        {dynamicTasks.map((task, idx) => (
          <div key={task.id} className="flex flex-col bg-white dark:bg-[#121214] border border-gray-200 dark:border-white/5 shadow-sm rounded-xl transition-colors group">
            <div 
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-[#1A1D27] rounded-xl"
              onClick={() => setExpandedTask(expandedTask === idx ? null : idx)}
            >
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-gray-900 dark:text-white/90">
                  {task.title}
                  {task.id === 'approval' && kpis.pendingApprovals !== undefined && (
                    <span className="text-amber-500 ml-1">({kpis.pendingApprovals})</span>
                  )}
                  {task.id === 'invoice' && (
                    <span className="text-blue-500 ml-1">({invoiceOrders.length})</span>
                  )}
                  {task.id === 'failed_payments' && (
                    <span className="text-red-500 ml-1">({failedOrders.length})</span>
                  )}
                  {task.id === 'cancellations' && (
                    <span className="text-amber-500 ml-1">({cancelledOrders.length})</span>
                  )}
                  {task.id === 'transfer' && (
                    <span className="text-emerald-500 ml-2">
                      {formatCompactNumber(((calculateTotalRevenue() + calculatedPendingRevenue) * 0.85) || 0)} ₺
                    </span>
                  )}
                  {task.id === 'cargo' && (
                    <span className="text-indigo-500 ml-2">
                      {formatCompactNumber(activeOrdersArr.reduce((acc: number, o: any) => acc + Number(o.shippingPrice || o.shippingCost || 0), 0))} ₺
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[8px] uppercase font-black tracking-wider px-2 py-0.5 rounded border ${
                    task.impact === 'Yüksek' || task.impact === 'Kritik' ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-100 dark:border-transparent' :
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
                {task.id === 'transfer' ? (
                  <div className="flex flex-col gap-1.5 mt-1">
                    <span className="font-bold text-gray-900 dark:text-white mb-1">Ödeme Bekleyen Kalemler:</span>
                    <div className="flex justify-between items-center bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1.5 rounded">
                      <span className="text-emerald-700 dark:text-emerald-400">Satıcı Hakedişleri</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCompactNumber((calculateTotalRevenue() + calculatedPendingRevenue) * 0.85)} ₺</span>
                    </div>
                    <div className="flex justify-between items-center bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1.5 rounded">
                      <span className="text-indigo-700 dark:text-indigo-400">Kargo Firması Ödemeleri</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{formatCompactNumber(activeOrdersArr.length * 85)} ₺</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{formatCompactNumber(activeOrdersArr.reduce((acc: number, o: any) => acc + Number(o.shippingPrice || o.shippingCost || 0), 0))} ₺</span>
                    </div>
                    <div className="flex justify-between items-center bg-gray-100 dark:bg-white/10 px-2 py-1.5 rounded mt-1 border border-gray-200 dark:border-white/20">
                      <span className="font-bold text-gray-900 dark:text-white">TOPLAM ÇIKIŞ HAKEDİŞİ</span>
                      <span className="font-black text-gray-900 dark:text-white">{formatCompactNumber(((calculateTotalRevenue() + calculatedPendingRevenue) * 0.85) || 0)} ₺</span>
                    </div>
                    <span className="text-[9px] mt-1 text-gray-400">Sistemdeki toplam cirodan (satışlar) platform komisyonu (%15) düşüldükten sonra satıcıların cüzdanlarına ve firmalara aktarılması bekleyen tahmini net tutardır.</span>
                  </div>
                ) : task.id === 'cargo' ? (
                  <div className="flex flex-col gap-1.5 mt-1">
                    <span className="font-bold text-gray-900 dark:text-white mb-1">Kargo Operasyon Raporu:</span>
                    {activeOrdersArr.length > 0 ? (() => {
                      const splits: Record<string, number> = {};
                      activeOrdersArr.forEach((o: any) => {
                         const company = o.shippingCompany || o.shippingProvider || 'Diğer Kargo';
                         splits[company] = (splits[company] || 0) + Number(o.shippingPrice || o.shippingCost || 0);
                      });
                      const totalCargo = Object.values(splits).reduce((a,b) => a+b, 0);
                      return (
                        <>
                          {Object.entries(splits).map(([company, amount], i) => (
                            <div key={i} className="flex justify-between items-center bg-gray-50 dark:bg-white/5 px-2 py-1.5 rounded border border-gray-100 dark:border-white/10">
                              <div className="flex flex-col">
                                <span className="text-gray-700 dark:text-gray-300 font-bold">{company}</span>
                                {totalCargo > 0 && <span className="text-[9px] text-gray-500/70">% {Math.round((amount / totalCargo) * 100)} Hacim</span>}
                              </div>
                              <span className="font-bold text-indigo-600 dark:text-indigo-400">{formatCompactNumber(amount)} ₺</span>
                            </div>
                          ))}
                          <div className="flex justify-between items-center mt-1 pt-1.5 border-t border-gray-200 dark:border-white/10">
                            <span className="font-bold text-gray-900 dark:text-white">TOPLAM LOJİSTİK GİDERİ</span>
                            <span className="font-black text-gray-900 dark:text-white">{formatCompactNumber(totalCargo)} ₺</span>
                          </div>
                        </>
                      );
                    })() : (
                       <div className="text-gray-400 dark:text-white/40 italic py-2">Kargo işlemi bulunmuyor.</div>
                    )}
                    <span className="text-[9px] mt-1 text-gray-400">Bu tutar, aktif siparişlerin desi hesaplamaları üzerinden tahmini olarak belirlenmiş olup kargo firmalarıyla yapılacak mutabakat sonrası netleşecektir.</span>
                  </div>
                ) : task.id === 'approval' ? (
                  <div className="flex flex-col gap-1.5 mt-1">
                    <span className="font-bold text-gray-900 dark:text-white mb-1">Onay Bekleyen İlanlar:</span>
                    <span className="text-gray-700 dark:text-gray-300">Sistemde onayınızı bekleyen {kpis.pendingApprovals} adet ürün var. Kullanıcı deneyimini hızlandırmak için 24 saat içinde onaylanması tavsiye edilir.</span>
                  </div>
                ) : task.id === 'invoice' ? (
                  <div className="flex flex-col gap-1.5 mt-1">
                    <span className="font-bold text-gray-900 dark:text-white mb-1">Bekleyen Fatura İşlemleri:</span>
                    {orderStatuses
                      .filter((s: any) => !['İptal', 'İade'].includes(s.name))
                      .map((s: any, i: number) => (
                      <div key={i} className="flex justify-between items-center bg-gray-100 dark:bg-white/5 px-2 py-1.5 rounded border border-gray-200 dark:border-white/5">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{s.name}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] text-gray-500 w-12 text-right">{s.value} adet</span>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between items-center mt-1 pt-1.5 border-t border-gray-200 dark:border-white/10">
                      <span className="font-bold text-gray-900 dark:text-white">TOPLAM FATURALANACAK</span>
                      <span className="font-black text-blue-600 dark:text-blue-400">{invoiceOrders.length} Sipariş</span>
                    </div>
                    <span className="text-[9px] mt-1 text-gray-400">Satıcı komisyonları veya hizmet bedelleri için kesilmesi gereken faturalardır. İptal ve İade edilen siparişler fatura kuyruğuna dahil edilmez.</span>
                  </div>
                ) : task.id === 'failed_payments' ? (
                  <div className="flex flex-col gap-1.5 mt-1">
                    <span className="font-bold text-gray-900 dark:text-white mb-1">Başarısız İşlem Analizi:</span>
                    <div className="flex items-center justify-between bg-red-50 dark:bg-red-500/10 px-2 py-1.5 rounded border border-red-100 dark:border-red-500/20">
                      <div className="flex flex-col">
                        <span className="font-bold text-red-600 dark:text-red-400">Yarıda Kalan Ödemeler</span>
                        <span className="text-[9px] text-red-500/80">{failedOrders.length} İşlem</span>
                      </div>
                      <span className="font-bold text-red-700 dark:text-red-300">{formatCompactNumber(failedRevenue)} ₺</span>
                    </div>
                    <span className="text-[9px] mt-1 text-gray-400">Ödemesi alınamamış veya banka/sistem tarafından askıda kalmış siparişler. Sepet terki oranını etkilediği için müşterilere hatırlatma yapılabilir.</span>
                  </div>
                ) : task.id === 'cancellations' ? (
                  <div className="flex flex-col gap-1.5 mt-1">
                    <span className="font-bold text-gray-900 dark:text-white mb-1">İade/İptal Kaybı Raporu:</span>
                    <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-500/10 px-2 py-1.5 rounded border border-amber-100 dark:border-amber-500/20">
                      <div className="flex flex-col">
                        <span className="font-bold text-amber-600 dark:text-amber-400">İptal/İade Edilen Siparişler</span>
                        <span className="text-[9px] text-amber-500/80">{cancelledOrders.length} İşlem</span>
                      </div>
                      <span className="font-bold text-amber-700 dark:text-amber-300">{formatCompactNumber(cancelledRevenue)} ₺</span>
                    </div>
                    <span className="text-[9px] mt-1 text-gray-400">Müşteriler veya satıcılar tarafından iptal edilen, operasyonel yük oluşturan başarısız siparişlerin ciroya etkisi.</span>
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
        {dynamicTasks.length === 0 && (
          <div className="text-xs text-gray-400 text-center py-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
            Şu an ilgilenmeniz gereken acil bir operasyonel görev bulunmuyor. Her şey yolunda!
          </div>
        )}
      </div>
    </div>
  );
}
