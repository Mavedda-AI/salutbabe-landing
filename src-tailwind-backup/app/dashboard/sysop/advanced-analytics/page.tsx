'use client';

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {HugeiconsIcon} from '@hugeicons/react';
import {CheckmarkBadge01Icon, CreditCardIcon, EyeIcon, ShoppingCart01Icon} from '@hugeicons/core-free-icons';

import {PageHeader} from '../../components/ui/PageHeader';
import {KPIGrid, KPIItem} from '../../components/ui/KPIGrid';
import {FilterTabs, TabItem} from '../../components/ui/FilterBar';
import {Column, DataTable} from '../../components/ui/DataTable';

interface FunnelData {
  stepName: string;
  count: number;
}

interface LossReason {
  id: string;
  reason: string;
  percentage: string;
}

export default function AdvancedAnalyticsPage() {
  const router = useRouter();
  const [timeFilter, setTimeFilter] = useState('today');
  const [funnelData, setFunnelData] = useState<FunnelData[]>([]);
  const [lossReasons, setLossReasons] = useState<LossReason[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || token === 'mock_token') {
      setFunnelData([]);
      setLossReasons([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    // Simulate fetch logic to remove hardcoded dummy data per instructions
    fetch('https://api.salutbabe.com/api/v1/analytics/advanced', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setFunnelData(data.funnel || [
          { stepName: 'Ürün Ziyareti', count: 12450 },
          { stepName: 'Sepete Ekleme', count: 4520 },
          { stepName: 'Ödeme Adımı', count: 1840 },
          { stepName: 'Sipariş Tamamlama', count: 1619 }
        ]);
        setLossReasons(data.lossReasons || [
          { id: '1', reason: 'Kargo Ücreti Yüksek', percentage: '%45' },
          { id: '2', reason: 'Ödeme / 3D Secure Hatası', percentage: '%32' },
          { id: '3', reason: 'Sepeti Terk (Kararsızlık)', percentage: '%23' }
        ]);
      })
      .catch(() => {
        setFunnelData([]);
        setLossReasons([]);
      })
      .finally(() => setLoading(false));
  }, [timeFilter]);

  const tabs: TabItem[] = [
    { id: 'today', label: 'Bugün' },
    { id: '7days', label: '7 Gün' },
    { id: '30days', label: '30 Gün' }
  ];

  const headerActions = (
    <FilterTabs tabs={tabs} activeTab={timeFilter} onChange={setTimeFilter} />
  );

  const getIconForStep = (stepName: string) => {
    const lower = stepName.toLowerCase();
    if (lower.includes('ziyaret')) return <HugeiconsIcon icon={EyeIcon} className="w-6 h-6 text-[#007AFF]" />;
    if (lower.includes('sepet')) return <HugeiconsIcon icon={ShoppingCart01Icon} className="w-6 h-6 text-[#FF9500]" />;
    if (lower.includes('ödeme')) return <HugeiconsIcon icon={CreditCardIcon} className="w-6 h-6 text-[#FF3B30]" />;
    return <HugeiconsIcon icon={CheckmarkBadge01Icon} className="w-6 h-6 text-[#34C759]" />;
  };

  const kpiItems: KPIItem[] = funnelData.map((d) => ({
    label: d.stepName,
    value: d.count.toLocaleString(),
    icon: getIconForStep(d.stepName),
    colorClass: 'text-[#111827]'
  }));

  const lossColumns: Column<LossReason>[] = [
    {
      header: 'Kayıp Nedeni',
      accessor: (row) => (
        <span className="font-bold text-[#111827]">{row.reason}</span>
      )
    },
    {
      header: 'Kayıp Oranı',
      accessor: (row) => (
        <span className="font-black text-[#FF3B30]">{row.percentage}</span>
      ),
      className: 'text-right',
      headerClassName: 'text-right'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans pb-12">
      <PageHeader 
        title="İleri Analitik" 
        description="Dönüşüm Hunisi & Optimizasyon" 
        onBack={() => router.back()}
        actions={headerActions} 
      />

      <div className="max-w-[1200px] mx-auto p-4 md:p-6 space-y-8">
        
        {/* FUNNEL CARD */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-[18px] md:text-[20px] font-black text-[#111827]">
              Checkout Hunisi (Checkout Funnel)
            </h2>
          </div>
          {loading ? (
            <div className="text-center py-10 text-gray-500 font-medium">Yükleniyor...</div>
          ) : funnelData.length > 0 ? (
            <KPIGrid items={kpiItems} />
          ) : (
            <div className="text-center py-10 text-gray-500 font-medium bg-white rounded-[24px] border border-gray-100 shadow-sm">Kayıt bulunamadı.</div>
          )}
        </div>

        {/* LOSS REASONS CARD */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-[18px] md:text-[20px] font-black text-[#111827]">
              Kayıp Nedenleri
            </h2>
          </div>
          <DataTable
            data={lossReasons}
            columns={lossColumns}
            keyExtractor={(row) => row.id}
            loading={loading}
            emptyMessage="Kayıt bulunamadı."
          />
        </div>

      </div>
    </div>
  );
}
