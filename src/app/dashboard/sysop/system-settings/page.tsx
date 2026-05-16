'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SystemSettingsPage() {
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  const settings = [
    { section: 'Komisyon Ayarları', items: [
      { label: 'Varsayılan Komisyon Oranı', value: '%12.8', type: 'input' },
      { label: 'Platinum Satıcı Komisyonu', value: '%8.5', type: 'input' },
      { label: 'Gold Satıcı Komisyonu', value: '%10.0', type: 'input' },
    ]},
    { section: 'Kargo Ayarları', items: [
      { label: 'Ücretsiz Kargo Eşiği', value: '₺250', type: 'input' },
      { label: 'Varsayılan Kargo Firması', value: 'Yurtiçi Kargo', type: 'select' },
      { label: 'Maksimum Teslim Süresi (gün)', value: '5', type: 'input' },
    ]},
    { section: 'Ödeme Ayarları', items: [
      { label: 'Ödeme Döngüsü', value: 'T+3', type: 'select' },
      { label: 'Minimum Hak Ediş Tutarı', value: '₺100', type: 'input' },
      { label: 'Otomatik Onay Limiti', value: '₺50,000', type: 'input' },
    ]},
    { section: 'Bildirim Ayarları', items: [
      { label: 'Push Bildirim', value: 'Aktif', type: 'toggle' },
      { label: 'E-posta Bildirimi', value: 'Aktif', type: 'toggle' },
      { label: 'SMS Bildirimi', value: 'Pasif', type: 'toggle' },
    ]},
  ];

  const cardClass = 'bg-white rounded-[20px] border border-gray-100 shadow-sm';

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div><h1 className="text-[18px] font-black text-[#111827]">Sistem Ayarları</h1><p className="text-[11px] font-medium text-gray-400">Platform konfigürasyonu</p></div>
          <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }} className={`ml-auto px-4 py-2 rounded-xl text-[10px] font-black tracking-wider transition-colors ${saved ? 'bg-green-500 text-white' : 'bg-[#111827] text-white hover:bg-black'}`}>
            {saved ? '✅ KAYDEDİLDİ' : 'KAYDET'}
          </button>
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-6 pb-20">
        {settings.map((s, si) => (
          <div key={si} className={`${cardClass} p-5`}>
            <h2 className="text-[13px] font-black text-[#111827] mb-4">{s.section}</h2>
            <div className="space-y-4">
              {s.items.map((item, ii) => (
                <div key={ii} className="flex items-center justify-between gap-4">
                  <span className="text-[12px] font-bold text-gray-600">{item.label}</span>
                  {item.type === 'toggle' ? (
                    <div className={`w-12 h-6 rounded-full cursor-pointer transition-colors ${item.value === 'Aktif' ? 'bg-green-500' : 'bg-gray-300'}`}>
                      <div className={`w-5 h-5 rounded-full bg-white shadow-md mt-0.5 transition-transform ${item.value === 'Aktif' ? 'translate-x-6 ml-0.5' : 'translate-x-0.5'}`} />
                    </div>
                  ) : (
                    <input type="text" defaultValue={item.value} className="w-32 px-3 py-2 rounded-lg border border-gray-200 text-[12px] font-bold text-[#111827] text-right focus:outline-none focus:border-[#007AFF]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
