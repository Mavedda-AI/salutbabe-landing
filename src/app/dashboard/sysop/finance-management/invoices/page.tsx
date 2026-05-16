"use client";
import React, {useState} from 'react';
import LayoutWrapper from '@/components/LayoutWrapper';
import {useRouter} from 'next/navigation';

const invoiceData = [
  { id: 'INV-9501', seller: 'Moda Atölyesi', buyer: 'Ahmet Yılmaz', amount: '₺2,450', type: 'e-Fatura', status: 'Başarılı', gibCode: '1300', date: '16 May 2026' },
  { id: 'INV-9500', seller: 'Bebek Dünyası', buyer: 'Fatma Demir', amount: '₺890', type: 'e-Arşiv', status: 'Beklemede', gibCode: '-', date: '16 May 2026' },
  { id: 'INV-9499', seller: 'Zen Aksesuar', buyer: 'Mehmet Kaya', amount: '₺3,200', type: 'e-Fatura', status: 'Hatalı', gibCode: 'Zaman Aşımı', date: '15 May 2026' },
  { id: 'INV-9498', seller: 'Ayakkabı Marketi', buyer: 'Elif Arslan', amount: '₺1,550', type: 'e-Arşiv', status: 'Başarılı', gibCode: '1300', date: '15 May 2026' },
  { id: 'INV-9497', seller: 'Güzellik Deposu', buyer: 'Zeynep Çelik', amount: '₺4,800', type: 'e-Fatura', status: 'Beklemede', gibCode: '-', date: '15 May 2026' },
  { id: 'INV-9496', seller: 'Spor Mağazası', buyer: 'Ali Öztürk', amount: '₺720', type: 'e-Arşiv', status: 'Başarılı', gibCode: '1300', date: '14 May 2026' },
  { id: 'INV-9495', seller: 'Ev Tekstili Pro', buyer: 'Ayşe Koç', amount: '₺6,100', type: 'e-Fatura', status: 'Hatalı', gibCode: 'VKN Hatası', date: '14 May 2026' },
  { id: 'INV-9494', seller: 'Dijital Market', buyer: 'Mustafa Şahin', amount: '₺1,200', type: 'e-Arşiv', status: 'Başarılı', gibCode: '1300', date: '13 May 2026' },
];

export default function InvoicesManagement() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'success' | 'pending' | 'error'>('all');

  const filtered = invoiceData.filter(e => {
    if (filter === 'success') return e.status === 'Başarılı';
    if (filter === 'pending') return e.status === 'Beklemede';
    if (filter === 'error') return e.status === 'Hatalı';
    return true;
  });

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-[#F9FAFB] pt-24 pb-20 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <button 
            onClick={() => router.push('/dashboard/sysop/finance-management')}
            className="flex items-center gap-1.5 text-[13px] font-bold text-gray-400 hover:text-gray-900 transition-colors mb-4"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Finans Paneline Dön
          </button>
          <h1 className="text-[28px] md:text-[32px] font-black tracking-tight text-[#111827] mb-2">
            GİB e-Fatura Kuyruğu
          </h1>
          <p className="text-[14px] font-medium text-gray-500 mb-8">GİB&apos;e iletilen e-Fatura ve e-Arşiv faturalarının durumları.</p>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Toplam Kuyruk', value: '32', color: 'text-[#111827]', bg: 'bg-white' },
              { label: 'Başarılı', value: '28', color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Beklemede', value: '2', color: 'text-orange-500', bg: 'bg-orange-50' },
              { label: 'Hatalı', value: '2', color: 'text-red-500', bg: 'bg-red-50' },
            ].map((c, i) => (
              <div key={i} className={`${c.bg} rounded-2xl p-5 border border-gray-100 shadow-sm`}>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">{c.label}</p>
                <h2 className={`text-[22px] font-black ${c.color}`}>{c.value}</h2>
              </div>
            ))}
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 flex gap-1 mb-6">
            {([['all', 'Tümü'], ['success', 'Başarılı'], ['pending', 'Beklemede'], ['error', 'Hatalı']] as const).map(([key, label]) => (
              <button key={key} onClick={() => setFilter(key)} className={`flex-1 px-3 py-2 rounded-lg text-[11px] font-bold transition-all ${filter === key ? 'bg-[#111827] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                {label}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Fatura No', 'Satıcı', 'Alıcı', 'Tutar', 'Tür', 'Durum', 'GİB Kodu', 'Tarih'].map(h => (
                      <th key={h} className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => (
                    <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-[12px] font-black text-[#111827]">{row.id}</td>
                      <td className="px-6 py-4 text-[12px] font-bold text-gray-700">{row.seller}</td>
                      <td className="px-6 py-4 text-[12px] font-medium text-gray-600">{row.buyer}</td>
                      <td className="px-6 py-4 text-[13px] font-black text-[#111827]">{row.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black ${row.type === 'e-Fatura' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>{row.type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                          row.status === 'Başarılı' ? 'bg-green-50 text-green-600' :
                          row.status === 'Beklemede' ? 'bg-orange-50 text-orange-600' :
                          'bg-red-50 text-red-600'
                        }`}>{row.status}</span>
                      </td>
                      <td className="px-6 py-4 text-[11px] font-medium text-gray-500">{row.gibCode}</td>
                      <td className="px-6 py-4 text-[11px] font-medium text-gray-500">{row.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}
