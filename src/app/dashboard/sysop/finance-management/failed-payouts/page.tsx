"use client";
import React, {useState} from 'react';
import LayoutWrapper from '@/components/LayoutWrapper';
import {useRouter} from 'next/navigation';

const failedData = [
  { id: 'FP-301', seller: 'Moda Atölyesi', iban: 'TR12 **** **** **** 4821', amount: '₺4,200', error: 'İsim Uyuşmazlığı', attempts: 2, date: '16 May 2026' },
  { id: 'FP-300', seller: 'Zen Aksesuar', iban: 'TR78 **** **** **** 3340', amount: '₺1,800', error: 'IBAN Geçersiz', attempts: 3, date: '15 May 2026' },
  { id: 'FP-299', seller: 'Bebek Dünyası', iban: 'TR34 **** **** **** 9032', amount: '₺2,500', error: 'Hesap Kapalı', attempts: 1, date: '15 May 2026' },
  { id: 'FP-298', seller: 'Güzellik Deposu', iban: 'TR90 **** **** **** 5522', amount: '₺3,100', error: 'İsim Uyuşmazlığı', attempts: 2, date: '14 May 2026' },
  { id: 'FP-297', seller: 'Spor Mağazası', iban: 'TR11 **** **** **** 7788', amount: '₺950', error: 'Banka Zaman Aşımı', attempts: 4, date: '13 May 2026' },
  { id: 'FP-296', seller: 'Ev Tekstili Pro', iban: 'TR22 **** **** **** 9900', amount: '₺5,900', error: 'IBAN Geçersiz', attempts: 1, date: '12 May 2026' },
];

export default function FailedPayoutsManagement() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'iban' | 'name' | 'other'>('all');

  const filtered = failedData.filter(e => {
    if (filter === 'iban') return e.error === 'IBAN Geçersiz';
    if (filter === 'name') return e.error === 'İsim Uyuşmazlığı';
    if (filter === 'other') return e.error !== 'IBAN Geçersiz' && e.error !== 'İsim Uyuşmazlığı';
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
            Başarısız Ödemeler (EFT Dönüşleri)
          </h1>
          <p className="text-[14px] font-medium text-gray-500 mb-8">IBAN veya isim uyuşmazlığı nedeniyle bankadan dönen EFT işlemleri.</p>

          {/* Alert */}
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5 flex items-start gap-3 mb-8">
            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div>
              <h3 className="text-[13px] font-black text-red-800">Toplam ₺18,450 tutarında ödeme başarısız oldu</h3>
              <p className="text-[11px] text-red-600 mt-0.5">14 satıcı etkilendi. Satıcılarla iletişime geçerek IBAN bilgilerini güncellemelerini sağlayın.</p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Toplam Başarısız', value: '₺18,450', color: 'text-red-500' },
              { label: 'En Sık Hata', value: 'İsim Uyuşmazlığı', color: 'text-[#111827]' },
              { label: 'Etkilenen Satıcı', value: '14', color: 'text-orange-500' },
            ].map((c, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">{c.label}</p>
                <h2 className={`text-[20px] font-black ${c.color}`}>{c.value}</h2>
              </div>
            ))}
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 flex gap-1 mb-6">
            {([['all', 'Tümü'], ['iban', 'IBAN Hatası'], ['name', 'İsim Uyuşmazlığı'], ['other', 'Diğer']] as const).map(([key, label]) => (
              <button key={key} onClick={() => setFilter(key)} className={`flex-1 px-3 py-2 rounded-lg text-[11px] font-bold transition-all ${filter === key ? 'bg-red-500 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
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
                    {['Hata No', 'Satıcı', 'IBAN', 'Tutar', 'Hata Sebebi', 'Deneme', 'Tarih', 'Aksiyon'].map(h => (
                      <th key={h} className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => (
                    <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-[12px] font-black text-red-500">{row.id}</td>
                      <td className="px-6 py-4 text-[12px] font-bold text-gray-700">{row.seller}</td>
                      <td className="px-6 py-4 text-[11px] font-medium text-gray-500 font-mono">{row.iban}</td>
                      <td className="px-6 py-4 text-[13px] font-black text-[#111827]">{row.amount}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-black">{row.error}</span>
                      </td>
                      <td className="px-6 py-4 text-[12px] font-bold text-gray-600">{row.attempts}x</td>
                      <td className="px-6 py-4 text-[11px] font-medium text-gray-500">{row.date}</td>
                      <td className="px-6 py-4">
                        <button className="px-3 py-1.5 bg-[#111827] text-white rounded-lg text-[10px] font-black hover:bg-black transition-colors">
                          Yeniden Dene
                        </button>
                      </td>
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
