'use client';
import {HugeiconsIcon} from '@hugeicons/react';
import {BankIcon, BarChartIcon, MoneyBag01Icon, Tick01Icon, Timer02Icon} from '@hugeicons/core-free-icons';
import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {PageHeader} from '../../components/ui/PageHeader';
import {KPIGrid, KPIItem} from '../../components/ui/KPIGrid';
import {FilterTabs} from '../../components/ui/FilterBar';
import {Column, DataTable} from '../../components/ui/DataTable';
import {ActionModal, StatusBadge} from '../../components/ui/StatusBadge';

export default function PayoutManagementPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedPayouts, setSelectedPayouts] = useState<string[]>([]);
  const [actionDone, setActionDone] = useState<string | null>(null);

  const [pendingData, setPendingData] = useState<any[]>([]);
  const [completedData, setCompletedData] = useState<any[]>([]);
  const [kpiData, setKpiData] = useState<KPIItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (!token || token === 'mock_token') {
      setPendingData([]);
      setCompletedData([]);
      setKpiData([
        { label: 'Havuzdaki Bakiye', value: '₺0', colorClass: 'text-[#007AFF]', icon: <HugeiconsIcon icon={BankIcon} size={18} /> },
        { label: 'Bu Hafta Onaylanan', value: '₺0', colorClass: 'text-green-600', icon: <HugeiconsIcon icon={Tick01Icon} size={18} /> },
        { label: 'Toplam Komisyon', value: '₺0', colorClass: 'text-purple-600', icon: <HugeiconsIcon icon={MoneyBag01Icon} size={18} /> },
        { label: 'Ort. Ödeme Süresi', value: '0 gün', colorClass: 'text-[#111827]', icon: <HugeiconsIcon icon={Timer02Icon} size={24} /> },
      ]);
    } else {
      setPendingData([]);
      setCompletedData([]);
      setKpiData([
        { label: 'Havuzdaki Bakiye', value: '₺0', colorClass: 'text-[#007AFF]', icon: <HugeiconsIcon icon={BankIcon} size={18} /> },
        { label: 'Bu Hafta Onaylanan', value: '₺0', colorClass: 'text-green-600', icon: <HugeiconsIcon icon={Tick01Icon} size={18} /> },
        { label: 'Toplam Komisyon', value: '₺0', colorClass: 'text-purple-600', icon: <HugeiconsIcon icon={MoneyBag01Icon} size={18} /> },
        { label: 'Ort. Ödeme Süresi', value: '0 gün', colorClass: 'text-[#111827]', icon: <HugeiconsIcon icon={Timer02Icon} size={24} /> },
      ]);
    }
    setLoading(false);
  }, []);

  const tabs = [
    { id: 'overview', label: <div className="flex items-center gap-1.5"><HugeiconsIcon icon={BarChartIcon} size={16} /> Genel Bakış</div> },
    { id: 'pending', label: <div className="flex items-center gap-1.5"><HugeiconsIcon icon={Timer02Icon} size={16} /> Bekleyenler</div> },
    { id: 'completed', label: <div className="flex items-center gap-1.5"><HugeiconsIcon icon={Tick01Icon} size={16} /> Tamamlanan</div> }
  ];

  const pendingColumns: Column<any>[] = [
    {
      header: 'Mağaza',
      accessor: (item) => (
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-bold text-[#111827]">{item.store}</span>
          <StatusBadge status={item.tier} type={item.tier === 'Platinum' ? 'info' : item.tier === 'Gold' ? 'warning' : 'neutral'} />
        </div>
      )
    },
    {
      header: 'Detay',
      accessor: (item) => <span className="text-[10px] text-gray-500">{item.orders} sipariş · {item.days} gündür bekliyor</span>
    },
    {
      header: 'Tutar',
      accessor: (item) => <span className="text-[14px] font-black text-green-600">{item.amount}</span>
    },
    {
      header: 'İşlem',
      accessor: (item) => (
        <button 
          onClick={(e) => { e.stopPropagation(); setActionDone(`${item.store} ödemesi onaylandı.`); setTimeout(() => setActionDone(null), 2500); }} 
          className="text-[9px] font-black px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          ONAYLA
        </button>
      ),
      className: 'text-right',
      headerClassName: 'text-right'
    }
  ];

  const completedColumns: Column<any>[] = [
    {
      header: 'Mağaza',
      accessor: (item) => <span className="text-[12px] font-bold text-[#111827]">{item.store}</span>
    },
    {
      header: 'Tarih',
      accessor: (item) => <span className="text-[10px] text-gray-500">{item.date} · {item.method}</span>
    },
    {
      header: 'Tutar',
      accessor: (item) => <span className="text-[13px] font-black text-[#111827]">{item.amount}</span>
    },
    {
      header: 'Durum',
      accessor: (item) => <StatusBadge status={item.status} type="success" />
    }
  ];

  const weeklyTrend = [
    { week: 'H1', paid: 0, pending: 0 },
    { week: 'H2', paid: 0, pending: 0 },
    { week: 'H3', paid: 0, pending: 0 },
    { week: 'H4', paid: 0, pending: 0 },
  ];

  const cardClass = 'bg-white rounded-[20px] border border-gray-100 shadow-sm';

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      <PageHeader 
        title="Finans & Hak Ediş" 
        description="Satıcı ödemeleri ve komisyon yönetimi" 
        onBack={() => router.back()}
        actions={
          <button onClick={() => setShowApproveModal(true)} className="px-4 py-2 rounded-xl bg-green-500 text-white text-[10px] font-black tracking-wider hover:bg-green-600 transition-colors">
            + TOPLU ONAYLA
          </button>
        }
      />

      <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-6 pb-20">
        <KPIGrid items={kpiData} />

        <FilterTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === 'overview' && (
          <>
            <div className={`${cardClass} p-5`}>
              <h2 className="text-[13px] font-black text-[#111827] mb-1">Haftalık Ödeme Trendi</h2>
              <p className="text-[10px] font-medium text-gray-400 mb-5">Ödenen vs Bekleyen (₺K)</p>
              <div className="flex items-end justify-between gap-4 h-32">
                {weeklyTrend.map((w, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[9px] font-black text-gray-600">₺{w.paid}K</span>
                    <div className="w-full flex flex-col gap-1">
                      <div className="w-full rounded-t-lg bg-green-400" style={{ height: `${w.paid > 0 ? (w.paid / 400) * 100 : 0}px` }} />
                      <div className="w-full rounded-b-lg bg-orange-300" style={{ height: `${w.pending > 0 ? (w.pending / 400) * 60 : 0}px` }} />
                    </div>
                    <span className="text-[9px] font-bold text-gray-400">{w.week}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-3 justify-center">
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-green-400" /><span className="text-[9px] font-bold text-gray-500">Ödenen</span></div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-orange-300" /><span className="text-[9px] font-bold text-gray-500">Bekleyen</span></div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Komisyon Oranı', value: '%0', color: 'text-purple-600' },
                { label: 'İade Kesintisi', value: '₺0', color: 'text-red-500' },
                { label: 'Net Take Rate', value: '%0', color: 'text-green-600' },
              ].map((m, i) => (
                <div key={i} className={`${cardClass} p-4 text-center`}>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">{m.label}</p>
                  <p className={`text-[22px] font-black ${m.color}`}>{m.value}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'pending' && (
          <div className="space-y-3">
            {selectedPayouts.length > 0 && (
              <div className="flex justify-end px-1">
                <button onClick={() => { setActionDone(`${selectedPayouts.length} ödeme onaylandı.`); setSelectedPayouts([]); setTimeout(() => setActionDone(null), 2500); }} className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-[10px] font-bold">
                  {selectedPayouts.length} Seçili — Toplu Onayla
                </button>
              </div>
            )}
            <DataTable
              data={pendingData}
              columns={pendingColumns}
              keyExtractor={(item: any) => item.store || Math.random().toString()}
              loading={loading}
              emptyMessage="Bekleyen ödeme bulunamadı."
              selectedIds={selectedPayouts}
              onToggleSelect={(id) => {
                 setSelectedPayouts(prev => prev.includes(id as string) ? prev.filter(x => x !== id) : [...prev, id as string]);
              }}
              onToggleAll={() => {
                 setSelectedPayouts(selectedPayouts.length === pendingData.length ? [] : pendingData.map(d => d.store));
              }}
            />
          </div>
        )}

        {activeTab === 'completed' && (
          <div className="space-y-3">
            <DataTable
              data={completedData}
              columns={completedColumns}
              keyExtractor={(item: any) => item.store || Math.random().toString()}
              loading={loading}
              emptyMessage="Tamamlanan ödeme bulunamadı."
            />
          </div>
        )}

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[20px] border border-blue-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            <h2 className="text-[13px] font-black text-blue-700">AI Aksiyonlar</h2>
          </div>
          <div className="space-y-3">
            {[
              { title: 'Platinum satıcılara T+1 ödeme geçişi', desc: '12 Platinum satıcıya hızlı ödeme sunarak bağlılığı artır. Churn riski %0 a düşer.', impact: 'Önerilen' },
              { title: 'Bella Moda 5 gündür bekliyor', desc: 'Bronze satıcı olmasına rağmen 5 gün bekleme riski taşıyor. Manuel onay gerekebilir.', impact: 'Acil' },
            ].map((a, i) => (
              <div key={i} className="bg-white/80 backdrop-blur rounded-xl p-4 border border-blue-100/50">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[12px] font-bold text-[#111827]">{a.title}</p>
                    <p className="text-[10px] text-gray-500 mt-1">{a.desc}</p>
                  </div>
                  <StatusBadge status={a.impact} type={a.impact === 'Acil' ? 'danger' : 'success'} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ActionModal 
        isOpen={showApproveModal} 
        onClose={() => setShowApproveModal(false)}
        title="Toplu Onay İşlemi"
      >
        <div className="text-center">
          <p className="text-[13px] mb-6 text-gray-500">Havuzda bekleyen <strong>{pendingData.length} adet</strong> hak ediş talebini onaylayıp tutarları satıcı cüzdanlarına aktarmak istiyor musunuz?</p>
          <div className="flex gap-3">
            <button onClick={() => setShowApproveModal(false)} className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold transition-colors">İptal</button>
            <button onClick={() => { setActionDone(`${pendingData.length} ödeme onaylandı.`); setShowApproveModal(false); setTimeout(() => setActionDone(null), 2500); }} className="flex-1 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold transition-colors">Evet, Onayla</button>
          </div>
        </div>
      </ActionModal>

      {/* Toast */}
      {actionDone && (
        <div className="fixed top-4 right-4 z-[200] bg-[#111827] text-white px-5 py-3 rounded-xl text-[13px] font-bold shadow-2xl animate-fade-in flex items-center gap-1">
          <HugeiconsIcon icon={Tick01Icon} size={16} /> {actionDone}
        </div>
      )}
    </div>
  );
}
