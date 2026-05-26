'use client';

import React, {useEffect, useState} from 'react';
import {HugeiconsIcon} from '@hugeicons/react';
import {Idea01Icon} from '@hugeicons/core-free-icons';
import {useRouter} from 'next/navigation';

import {PageHeader} from '@/app/dashboard/components/ui/PageHeader';
import {KPIGrid, KPIItem} from '@/app/dashboard/components/ui/KPIGrid';
import {Column, DataTable} from '@/app/dashboard/components/ui/DataTable';

interface CategoryPerf {
  name: string;
  orders: number;
  aov: string;
  margin: string;
  trend: string;
}

export default function UnitEconomicsPage() {
  const router = useRouter();

  const [metrics, setMetrics] = useState<KPIItem[]>([]);
  const [costBreakdown, setCostBreakdown] = useState<any[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<any[]>([]);
  const [categoryPerformance, setCategoryPerformance] = useState<CategoryPerf[]>([]);
  const [keyRatios, setKeyRatios] = useState<KPIItem[]>([]);
  const [aiActions, setAiActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const token = storedToken || 'mock_token';

    if (token === 'mock_token' || !token) {
      setMetrics([]);
      setCostBreakdown([]);
      setMonthlyTrend([]);
      setCategoryPerformance([]);
      setKeyRatios([]);
      setAiActions([]);
      setLoading(false);
    } else {
      // Fetch real data
      setLoading(false);
    }
  }, []);

  const columns: Column<CategoryPerf>[] = [
    {
      header: 'Kategori',
      accessor: (item) => <span className="text-[12px] font-bold text-[#111827]">{item.name}</span>,
    },
    {
      header: 'Sipariş',
      accessor: (item) => <span className="text-[12px] font-black text-[#111827]">{item.orders.toLocaleString()}</span>,
    },
    {
      header: 'AOV',
      accessor: (item) => <span className="text-[12px] font-bold text-gray-600">{item.aov}</span>,
    },
    {
      header: 'Marj',
      accessor: (item) => (
        <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${parseFloat(item.margin.replace('%','')) > 35 ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
          {item.margin}
        </span>
      ),
    },
    {
      header: 'Trend',
      accessor: (item) => (
        <span className={`text-[14px] font-black ${item.trend === '↗' ? 'text-green-500' : item.trend === '↘' ? 'text-red-500' : 'text-gray-400'}`}>
          {item.trend}
        </span>
      ),
    },
  ];

  const maxProfit = monthlyTrend.length > 0 ? Math.max(...monthlyTrend.map(m => m.profit)) : 1;

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      <PageHeader 
        title="Birim Ekonomisi" 
        description="Son 30 Gün · Tüm Kategoriler" 
        actions={
          <div className="ml-auto px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-[10px] font-black tracking-wider">
            FOUNDER ONLY
          </div>
        }
      />

      <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-6 pb-20">

        {/* KPI Cards */}
        {metrics.length > 0 && <KPIGrid items={metrics} />}

        {/* Profitability Trend */}
        <div className="bg-white rounded-[20px] border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[13px] font-black text-[#111827]">Kârlılık Trendi</h2>
              <p className="text-[10px] font-medium text-gray-400 mt-0.5">Sipariş başı net kâr (₺)</p>
            </div>
            {monthlyTrend.length > 0 && (
              <div className="flex items-center gap-1 bg-green-50 text-green-600 px-2 py-1 rounded-full text-[10px] font-black">
                ↗ %51.2 büyüme
              </div>
            )}
          </div>
          
          <div className="flex items-end justify-between gap-2 h-32">
            {monthlyTrend.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] font-black text-gray-700">₺{m.profit}</span>
                <div 
                  className="w-full rounded-t-lg bg-gradient-to-t from-purple-500 to-purple-400 transition-all duration-500 hover:from-purple-600 hover:to-purple-500"
                  style={{ height: `${(m.profit / maxProfit) * 100}%`, minHeight: '8px' }}
                />
                <span className="text-[9px] font-bold text-gray-400">{m.month}</span>
              </div>
            ))}
            {monthlyTrend.length === 0 && (
              <div className="w-full flex items-center justify-center text-sm text-gray-400 h-full">
                Veri bulunamadı
              </div>
            )}
          </div>
        </div>

        {/* Revenue Waterfall / Cost Breakdown */}
        <div className="bg-white rounded-[20px] border border-gray-100 p-5 shadow-sm">
          <h2 className="text-[13px] font-black text-[#111827] mb-1">Gelir-Maliyet Dağılımı</h2>
          <p className="text-[10px] font-medium text-gray-400 mb-5">Sipariş başı gelir akışı</p>
          
          {costBreakdown.length > 0 ? (
            <div className="space-y-3">
              {costBreakdown.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-gray-500 w-36 shrink-0">{item.label}</span>
                  <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full transition-all duration-700`} style={{ width: `${item.pct}%` }} />
                  </div>
                  <span className={`text-[12px] font-black w-24 text-right ${item.value.startsWith('-') ? 'text-red-500' : 'text-[#111827]'}`}>{item.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center text-sm text-gray-400 border border-dashed border-gray-200 rounded-lg">
              Maliyet dağılımı verisi bulunamadı.
            </div>
          )}

          {/* Net margin highlight */}
          {costBreakdown.length > 0 && (
            <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-green-600 uppercase">Net Kâr Marjı</p>
                <p className="text-[28px] font-black text-green-600">%57.3</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Aylık Net Kâr</p>
                <p className="text-[24px] font-black text-[#111827]">₺619,906</p>
              </div>
            </div>
          )}
        </div>

        {/* Category Performance */}
        <div className="bg-white rounded-[20px] border border-gray-100 p-5 shadow-sm">
          <h2 className="text-[13px] font-black text-[#111827] mb-1">Kategori Bazlı Performans</h2>
          <p className="text-[10px] font-medium text-gray-400 mb-4">Hangi kategori en çok kâr getiriyor?</p>
          
          <DataTable 
            data={categoryPerformance}
            columns={columns}
            keyExtractor={(item) => item.name}
            loading={loading}
            emptyMessage="Kategori verisi bulunamadı."
          />
        </div>

        {/* Key Ratios */}
        {keyRatios.length > 0 && <KPIGrid items={keyRatios} />}

        {/* AI Recommendations */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-[20px] border border-purple-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <HugeiconsIcon icon={Idea01Icon} className="text-purple-500" size={20} />
            <h2 className="text-[13px] font-black text-purple-700">AI Aksiyonlar</h2>
          </div>

          {aiActions.length > 0 ? (
            <div className="space-y-3">
              {aiActions.map((action, i) => (
                <div key={i} className="bg-white/80 backdrop-blur rounded-xl p-4 border border-purple-100/50">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[12px] font-bold text-[#111827]">{action.title}</p>
                      <p className="text-[10px] text-gray-500 mt-1">{action.desc}</p>
                    </div>
                    <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-full shrink-0 whitespace-nowrap">{action.impact}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center text-sm text-purple-400/80 border border-dashed border-purple-200 rounded-lg">
              Öneri bulunamadı.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
