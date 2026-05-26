'use client';

import React, {useEffect, useState} from 'react';
import {HugeiconsIcon} from '@hugeicons/react';
import {Alert02Icon, CrownIcon, NewJobIcon, StarIcon, Tick01Icon} from '@hugeicons/core-free-icons';
import {useRouter} from 'next/navigation';
import {PageHeader} from '@/app/dashboard/components/ui/PageHeader';
import {KPIGrid, KPIItem} from '@/app/dashboard/components/ui/KPIGrid';
import {Column, DataTable} from '@/app/dashboard/components/ui/DataTable';
import {ActionModal, StatusBadge} from '@/app/dashboard/components/ui/StatusBadge';

export default function SellerHealthPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [selectedRiskSeller, setSelectedRiskSeller] = useState<any>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token') || 'mock_token';
    setToken(storedToken);
  }, []);

  const hasValidToken = token && token !== 'mock_token';

  const healthScores: KPIItem[] = hasValidToken ? [
    { label: 'Aktif Satıcı', value: '1,245', colorClass: 'text-[#34C759]', icon: <HugeiconsIcon icon={Tick01Icon} size={18} /> },
    { label: 'İnaktif (>7 Gün)', value: '84', colorClass: 'text-[#FF8D28]', icon: <HugeiconsIcon icon={Alert02Icon} size={24} /> },
    { label: 'Top Satıcı (>15K ₺)', value: '32', colorClass: 'text-[#111827]', icon: <HugeiconsIcon icon={CrownIcon} size={18} /> },
    { label: 'Yeni Satıcı (30g)', value: '67', colorClass: 'text-[#007AFF]', icon: <HugeiconsIcon icon={NewJobIcon} size={18} /> },
  ] : [
    { label: 'Aktif Satıcı', value: '0', colorClass: 'text-[#34C759]', icon: <HugeiconsIcon icon={Tick01Icon} size={18} /> },
    { label: 'İnaktif (>7 Gün)', value: '0', colorClass: 'text-[#FF8D28]', icon: <HugeiconsIcon icon={Alert02Icon} size={24} /> },
    { label: 'Top Satıcı (>15K ₺)', value: '0', colorClass: 'text-[#111827]', icon: <HugeiconsIcon icon={CrownIcon} size={18} /> },
    { label: 'Yeni Satıcı (30g)', value: '0', colorClass: 'text-[#007AFF]', icon: <HugeiconsIcon icon={NewJobIcon} size={18} /> },
  ];

  const topSellers = hasValidToken ? [
    { id: 1, index: 1, name: 'Elif Boutique', gmv: '₺142,500', orders: 842, rating: 4.9, status: 'active', growth: '+18%' },
    { id: 2, index: 2, name: 'Maison de Mode', gmv: '₺98,200', orders: 567, rating: 4.8, status: 'active', growth: '+12%' },
    { id: 3, index: 3, name: 'Urban Style TR', gmv: '₺87,400', orders: 492, rating: 4.7, status: 'active', growth: '+8%' },
    { id: 4, index: 4, name: 'Chic Corner', gmv: '₺76,800', orders: 421, rating: 4.6, status: 'active', growth: '+22%' },
    { id: 5, index: 5, name: 'Trendy Kids', gmv: '₺64,300', orders: 388, rating: 4.8, status: 'active', growth: '+5%' },
  ] : [];

  const topSellersColumns: Column<any>[] = [
    {
      header: 'Satıcı',
      accessor: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-[12px] font-black shrink-0">
            {item.index}
          </div>
          <div>
            <p className="text-[12px] font-bold text-[#111827]">{item.name}</p>
            <p className="text-[10px] text-gray-400">{item.orders} sipariş · <HugeiconsIcon icon={StarIcon} size={12} className="inline-block" /> {item.rating}</p>
          </div>
        </div>
      )
    },
    {
      header: 'GMV',
      accessor: (item) => (
        <div className="text-right">
          <p className="text-[13px] font-black text-[#111827]">{item.gmv}</p>
          <p className="text-[10px] font-bold text-green-500">{item.growth}</p>
        </div>
      )
    },
    {
      header: 'Durum',
      accessor: (item) => (
        <div className="flex justify-end">
          <StatusBadge status={item.status} type="success" />
        </div>
      )
    }
  ];

  const riskSellers = hasValidToken ? [
    { id: 1, name: 'Fashion Palace', gmv: '₺38,200', lastActive: '8 gün önce', reason: 'Giriş yok', risk: 'Yüksek' },
    { id: 2, name: 'Style Hub', gmv: '₺22,100', lastActive: '12 gün önce', reason: 'Ürün güncellemesi yok', risk: 'Kritik' },
    { id: 3, name: 'Bella Moda', gmv: '₺18,700', lastActive: '7 gün önce', reason: 'Sipariş karşılanmadı', risk: 'Orta' },
  ] : [];

  const riskSellersColumns: Column<any>[] = [
    {
      header: 'Satıcı',
      accessor: (item) => (
        <div>
          <div className="flex items-center gap-2">
            <p className="text-[12px] font-bold text-[#111827]">{item.name}</p>
            <StatusBadge 
              status={item.risk} 
              type={item.risk === 'Kritik' ? 'danger' : item.risk === 'Yüksek' ? 'warning' : 'neutral'} 
            />
          </div>
          <p className="text-[10px] text-gray-500 mt-0.5">{item.reason} · {item.lastActive}</p>
        </div>
      )
    },
    {
      header: 'Aylık GMV',
      accessor: (item) => (
        <div className="text-right">
          <p className="text-[12px] font-black text-[#111827]">{item.gmv}</p>
          <p className="text-[9px] text-gray-400">Aylık GMV</p>
        </div>
      )
    },
    {
      header: 'Aksiyon',
      accessor: (item) => (
        <div className="flex justify-end">
          <button 
            onClick={() => setSelectedRiskSeller(item)} 
            className="text-[9px] font-black px-3 py-2 bg-[#FF8D28] text-white rounded-lg shrink-0 hover:bg-[#FF8D28]/80 transition-colors"
          >
            AKSİYON
          </button>
        </div>
      )
    }
  ];

  const sellerTiers = hasValidToken ? [
    { tier: 'Platinum', count: 12, gmvShare: '%34', avgRating: 4.9, color: 'from-gray-200 to-gray-400' },
    { tier: 'Gold', count: 20, gmvShare: '%28', avgRating: 4.7, color: 'from-yellow-300 to-yellow-500' },
    { tier: 'Silver', count: 156, gmvShare: '%24', avgRating: 4.4, color: 'from-gray-300 to-gray-500' },
    { tier: 'Bronze', count: 1057, gmvShare: '%14', avgRating: 4.1, color: 'from-orange-300 to-orange-500' },
  ] : [];

  const monthlyGrowth = hasValidToken ? [
    { month: 'Oca', active: 980, new: 42 },
    { month: 'Şub', active: 1020, new: 48 },
    { month: 'Mar', active: 1085, new: 72 },
    { month: 'Nis', active: 1140, new: 61 },
    { month: 'May', active: 1198, new: 64 },
    { month: 'Haz', active: 1245, new: 67 },
  ] : [];
  const maxActive = monthlyGrowth.length > 0 ? Math.max(...monthlyGrowth.map(m => m.active)) : 0;

  const aiActions = hasValidToken ? [
    { title: 'İnaktif Top Satıcılarla telefon görüşmesi', desc: 'GMV\'si >15K ₺ olan Fashion Palace ve Style Hub\'a direkt arama yapılmalı. Kayıp riski aylık ₺60K.', impact: 'Acil' },
    { title: 'Bronze satıcılara eğitim programı', desc: '1,057 Bronze satıcının %12\'si ürün fotoğraf kalitesi düşük. Otomatik iyileştirme aracı sun.', impact: '+₺45K/ay' },
    { title: 'Gold → Platinum geçiş teşviki', desc: '8 Gold satıcı Platinum eşiğine çok yakın. Komisyon indirimi ile teşvik et.', impact: '+₺28K/ay' },
  ] : [];

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      <PageHeader 
        title="Satıcı Sağlığı" 
        description="Canlı Veriler · Tüm Satıcılar" 
        actions={
          <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black tracking-wider">FOUNDER ONLY</div>
        }
      />

      <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-6 pb-20">
        <KPIGrid items={healthScores} />

        {/* Seller Growth Trend */}
        <div className="bg-white rounded-[20px] border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[13px] font-black text-[#111827]">Satıcı Büyüme Trendi</h2>
              <p className="text-[10px] font-medium text-gray-400 mt-0.5">Aylık aktif satıcı sayısı</p>
            </div>
            {hasValidToken && (
              <div className="flex items-center gap-1 bg-green-50 text-green-600 px-2 py-1 rounded-full text-[10px] font-black">
                ↗ %27 büyüme (6 ay)
              </div>
            )}
          </div>
          
          <div className="flex items-end justify-between gap-2 h-32">
            {monthlyGrowth.length > 0 ? monthlyGrowth.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] font-black text-gray-700">{m.active}</span>
                <div className="w-full flex flex-col gap-0.5">
                  <div 
                    className="w-full rounded-t-lg bg-gradient-to-t from-blue-500 to-blue-400 transition-all"
                    style={{ height: `${(m.active / maxActive) * 100}px`, minHeight: '8px' }}
                  />
                  <div 
                    className="w-full rounded-b-lg bg-gradient-to-t from-green-400 to-green-300"
                    style={{ height: `${(m.new / maxActive) * 30}px`, minHeight: '4px' }}
                  />
                </div>
                <span className="text-[9px] font-bold text-gray-400">{m.month}</span>
              </div>
            )) : (
              <div className="w-full h-full flex items-center justify-center text-[11px] text-gray-400 font-medium">Veri bulunamadı</div>
            )}
          </div>
          {monthlyGrowth.length > 0 && (
            <div className="flex items-center gap-4 mt-3 justify-center">
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-blue-400"></div><span className="text-[9px] font-bold text-gray-500">Aktif Satıcı</span></div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-green-400"></div><span className="text-[9px] font-bold text-gray-500">Yeni Katılım</span></div>
            </div>
          )}
        </div>

        {/* Seller Tiers */}
        <div className="bg-white rounded-[20px] border border-gray-100 p-5 shadow-sm">
          <h2 className="text-[13px] font-black text-[#111827] mb-1">Satıcı Seviyeleri</h2>
          <p className="text-[10px] font-medium text-gray-400 mb-5">GMV bazlı segmentasyon</p>
          
          {sellerTiers.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {sellerTiers.map((t, i) => (
                <div key={i} className={`rounded-2xl p-4 bg-gradient-to-br ${t.color} text-white`}>
                  <p className="text-[18px] font-black">{t.tier}</p>
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between"><span className="text-[10px] opacity-80">Satıcı</span><span className="text-[12px] font-black">{t.count}</span></div>
                    <div className="flex justify-between"><span className="text-[10px] opacity-80">GMV Pay</span><span className="text-[12px] font-black">{t.gmvShare}</span></div>
                    <div className="flex justify-between"><span className="text-[10px] opacity-80">Ort. Puan</span><span className="text-[12px] font-black flex items-center gap-1"><HugeiconsIcon icon={StarIcon} size={12} /> {t.avgRating}</span></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="text-center py-4 text-[11px] text-gray-400 font-medium">Veri bulunamadı</div>
          )}
        </div>

        {/* Top Sellers */}
        <div className="bg-white rounded-[20px] border border-gray-100 p-5 shadow-sm">
          <h2 className="text-[13px] font-black text-[#111827] mb-1">Top Satıcılar</h2>
          <p className="text-[10px] font-medium text-gray-400 mb-4">GMV bazlı ilk 5</p>
          <DataTable 
            data={topSellers} 
            columns={topSellersColumns} 
            keyExtractor={(item) => item.id.toString()}
            emptyMessage="Top satıcı bulunamadı."
          />
        </div>

        {/* Risk Sellers */}
        <div className="bg-white rounded-[20px] border border-[#FF8D28]/20 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-[#FF8D28] animate-ping"></div>
            <h2 className="text-[13px] font-black text-[#FF8D28]">Risk Altındaki Satıcılar</h2>
          </div>
          <p className="text-[10px] font-medium text-gray-400 mb-4">Acil aksiyon gerektirenler</p>
          <DataTable 
            data={riskSellers} 
            columns={riskSellersColumns} 
            keyExtractor={(item) => item.id.toString()}
            emptyMessage="Risk altındaki satıcı bulunamadı."
          />
        </div>

        {/* AI Recommendations */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[20px] border border-blue-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            <h2 className="text-[13px] font-black text-blue-700">AI Aksiyonlar</h2>
          </div>

          {aiActions.length > 0 ? (
            <div className="space-y-3">
              {aiActions.map((action, i) => (
                <div key={i} className="bg-white/80 backdrop-blur rounded-xl p-4 border border-blue-100/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-[12px] font-bold text-[#111827]">{action.title}</p>
                    <p className="text-[10px] text-gray-500 mt-1">{action.desc}</p>
                  </div>
                  <StatusBadge 
                    status={action.impact} 
                    type={action.impact === 'Acil' ? 'danger' : 'success'} 
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-[11px] text-gray-400 font-medium">Veri bulunamadı</div>
          )}
        </div>
      </div>
      
      <ActionModal
        isOpen={!!selectedRiskSeller}
        onClose={() => setSelectedRiskSeller(null)}
        title="Aksiyon Seçenekleri"
        description={`${selectedRiskSeller?.name} için aksiyon seçiniz.`}
      >
        <div className="space-y-3">
           <button onClick={() => router.push('/dashboard/sysop/user-management')} className="w-full px-4 py-2 text-[12px] font-bold bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors">
              Satıcıyı Yönet
           </button>
           <button onClick={() => setSelectedRiskSeller(null)} className="w-full px-4 py-2 text-[12px] font-bold bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors">
              İptal
           </button>
        </div>
      </ActionModal>
    </div>
  );
}

