"use client";
import React, {useState} from 'react';
import LayoutWrapper from '@/components/LayoutWrapper';
import {useRouter} from 'next/navigation';

const escrowData = [
  { id: 'ESC-4821', seller: 'Moda Atölyesi', amount: '₺42,500', order: '#SP-8412', status: 'Blokeli', daysLeft: 8, date: '08 May 2026' },
  { id: 'ESC-4820', seller: 'Bebek Dünyası', amount: '₺18,200', order: '#SP-8390', status: 'Blokeli', daysLeft: 12, date: '04 May 2026' },
  { id: 'ESC-4819', seller: 'Ayakkabı Marketi', amount: '₺95,000', order: '#SP-8355', status: 'Çözülüyor', daysLeft: 3, date: '13 May 2026' },
  { id: 'ESC-4818', seller: 'Zen Aksesuar', amount: '₺12,800', order: '#SP-8340', status: 'Serbest', daysLeft: 0, date: '14 May 2026' },
  { id: 'ESC-4817', seller: 'Güzellik Deposu', amount: '₺34,100', order: '#SP-8322', status: 'Blokeli', daysLeft: 6, date: '10 May 2026' },
  { id: 'ESC-4816', seller: 'Spor Mağazası', amount: '₺67,300', order: '#SP-8301', status: 'Çözülüyor', daysLeft: 1, date: '15 May 2026' },
  { id: 'ESC-4815', seller: 'Ev Tekstili Pro', amount: '₺28,900', order: '#SP-8280', status: 'Serbest', daysLeft: 0, date: '16 May 2026' },
  { id: 'ESC-4814', seller: 'Dijital Market', amount: '₺156,000', order: '#SP-8250', status: 'Blokeli', daysLeft: 14, date: '02 May 2026' },
];

export default function EscrowManagement() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'blocked' | 'releasing' | 'free'>('all');

  const filtered = escrowData.filter(e => {
    if (filter === 'blocked') return e.status === 'Blokeli';
    if (filter === 'releasing') return e.status === 'Çözülüyor';
    if (filter === 'free') return e.status === 'Serbest';
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
            Havuz (Emanet) Hesap Detayları
          </h1>
          <p className="text-[14px] font-medium text-gray-500 mb-8">Siparişe bağlı bloke edilen tutarlar ve çözülme süreçleri.</p>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Toplam Emanet', value: '₺1,248,500', color: 'text-[#111827]', bg: 'bg-white' },
              { label: 'Blokeli Tutar', value: '₺263,600', color: 'text-orange-500', bg: 'bg-orange-50' },
              { label: 'Çözülüyor', value: '₺162,300', color: 'text-blue-500', bg: 'bg-blue-50' },
              { label: 'Serbest Bırakılan', value: '₺41,700', color: 'text-green-600', bg: 'bg-green-50' },
            ].map((c, i) => (
              <div key={i} className={`${c.bg} rounded-2xl p-5 border border-gray-100 shadow-sm`}>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">{c.label}</p>
                <h2 className={`text-[22px] font-black ${c.color}`}>{c.value}</h2>
              </div>
            ))}
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 flex gap-1 mb-6">
            {([['all', 'Tümü'], ['blocked', 'Blokeli'], ['releasing', 'Çözülüyor'], ['free', 'Serbest']] as const).map(([key, label]) => (
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
                    {['Emanet No', 'Satıcı', 'Tutar', 'Sipariş No', 'Durum', 'Kalan Gün', 'Tarih'].map(h => (
                      <th key={h} className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => (
                    <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-[12px] font-black text-[#111827]">{row.id}</td>
                      <td className="px-6 py-4 text-[12px] font-bold text-gray-700">{row.seller}</td>
                      <td className="px-6 py-4 text-[13px] font-black text-[#111827]">{row.amount}</td>
                      <td className="px-6 py-4 text-[11px] font-medium text-gray-500">{row.order}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                          row.status === 'Blokeli' ? 'bg-orange-50 text-orange-600' :
                          row.status === 'Çözülüyor' ? 'bg-blue-50 text-blue-600' :
                          'bg-green-50 text-green-600'
                        }`}>{row.status}</span>
                      </td>
                      <td className="px-6 py-4 text-[12px] font-black text-gray-700">{row.daysLeft > 0 ? `${row.daysLeft} gün` : '—'}</td>
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
