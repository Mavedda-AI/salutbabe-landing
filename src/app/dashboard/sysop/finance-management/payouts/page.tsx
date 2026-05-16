"use client";
import React, {useState} from 'react';
import LayoutWrapper from '@/components/LayoutWrapper';
import {useRouter} from 'next/navigation';

const payoutData = [
  { id: 'PAY-1201', seller: 'Moda Atölyesi', iban: 'TR12 **** **** **** 4821', amount: '₺18,500', status: 'Beklemede', date: '16 May 2026', orderCount: 12 },
  { id: 'PAY-1200', seller: 'Bebek Dünyası', iban: 'TR34 **** **** **** 9032', amount: '₺42,100', status: 'Onaylandı', date: '15 May 2026', orderCount: 28 },
  { id: 'PAY-1199', seller: 'Ayakkabı Marketi', iban: 'TR56 **** **** **** 1155', amount: '₺95,200', status: 'Beklemede', date: '15 May 2026', orderCount: 45 },
  { id: 'PAY-1198', seller: 'Zen Aksesuar', iban: 'TR78 **** **** **** 3340', amount: '₺8,900', status: 'Ödendi', date: '14 May 2026', orderCount: 6 },
  { id: 'PAY-1197', seller: 'Güzellik Deposu', iban: 'TR90 **** **** **** 5522', amount: '₺34,100', status: 'Beklemede', date: '14 May 2026', orderCount: 19 },
  { id: 'PAY-1196', seller: 'Spor Mağazası', iban: 'TR11 **** **** **** 7788', amount: '₺67,300', status: 'Onaylandı', date: '13 May 2026', orderCount: 34 },
  { id: 'PAY-1195', seller: 'Ev Tekstili Pro', iban: 'TR22 **** **** **** 9900', amount: '₺15,600', status: 'Ödendi', date: '12 May 2026', orderCount: 8 },
  { id: 'PAY-1194', seller: 'Dijital Market', iban: 'TR33 **** **** **** 1122', amount: '₺60,400', status: 'Beklemede', date: '12 May 2026', orderCount: 42 },
];

export default function PayoutsManagement() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'paid'>('all');

  const filtered = payoutData.filter(e => {
    if (filter === 'pending') return e.status === 'Beklemede';
    if (filter === 'approved') return e.status === 'Onaylandı';
    if (filter === 'paid') return e.status === 'Ödendi';
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
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-[28px] md:text-[32px] font-black tracking-tight text-[#111827] mb-2">
                Bekleyen Hakedişler
              </h1>
              <p className="text-[14px] font-medium text-gray-500">Siparişi tamamlanmış, satıcılara ödeme bekleyen hakediş listesi.</p>
            </div>
            <button className="flex items-center gap-2 px-5 py-3 bg-[#111827] text-white rounded-xl text-[13px] font-bold hover:bg-black transition-colors shadow-lg shadow-gray-900/20 whitespace-nowrap">
              Toplu Ödeme Onayla
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Toplam Bekleyen', value: '₺342,100', color: 'text-orange-500', bg: 'bg-orange-50' },
              { label: 'Onaylanan', value: '₺109,400', color: 'text-blue-500', bg: 'bg-blue-50' },
              { label: 'Ödenen (Bu Hafta)', value: '₺24,500', color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Satıcı Sayısı', value: '412', color: 'text-[#111827]', bg: 'bg-white' },
            ].map((c, i) => (
              <div key={i} className={`${c.bg} rounded-2xl p-5 border border-gray-100 shadow-sm`}>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">{c.label}</p>
                <h2 className={`text-[22px] font-black ${c.color}`}>{c.value}</h2>
              </div>
            ))}
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 flex gap-1 mb-6">
            {([['all', 'Tümü'], ['pending', 'Beklemede'], ['approved', 'Onaylandı'], ['paid', 'Ödendi']] as const).map(([key, label]) => (
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
                    {['Hakediş No', 'Satıcı', 'IBAN', 'Tutar', 'Sipariş Adedi', 'Durum', 'Tarih'].map(h => (
                      <th key={h} className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => (
                    <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-[12px] font-black text-[#111827]">{row.id}</td>
                      <td className="px-6 py-4 text-[12px] font-bold text-gray-700">{row.seller}</td>
                      <td className="px-6 py-4 text-[11px] font-medium text-gray-500 font-mono">{row.iban}</td>
                      <td className="px-6 py-4 text-[13px] font-black text-[#111827]">{row.amount}</td>
                      <td className="px-6 py-4 text-[12px] font-bold text-gray-600">{row.orderCount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                          row.status === 'Beklemede' ? 'bg-orange-50 text-orange-600' :
                          row.status === 'Onaylandı' ? 'bg-blue-50 text-blue-600' :
                          'bg-green-50 text-green-600'
                        }`}>{row.status}</span>
                      </td>
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
