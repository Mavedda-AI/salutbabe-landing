'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function UserReviewManagementPage() {
  const router = useRouter();
  const reviews = [
    { reviewer: 'Büşra K.', target: 'Ahmet Y.', rating: 1, text: 'Ürünü hasarlı gönderdi, iletişime geçmiyor.', date: '3 saat önce', type: 'Satıcı' },
    { reviewer: 'Cansu D.', target: 'Fashion Palace', rating: 2, text: 'Sahte ürün gönderildi, güvenilmez.', date: '6 saat önce', type: 'Mağaza' },
    { reviewer: 'Elif Ş.', target: 'Merve Ç.', rating: 5, text: 'Çok ilgili, hızlı kargo.', date: '1 gün önce', type: 'Satıcı' },
    { reviewer: 'Zeynep K.', target: 'Urban Style TR', rating: 4, text: 'Güzel ürünler, fiyat biraz yüksek.', date: '2 gün önce', type: 'Mağaza' },
  ];
  const cardClass = 'bg-white rounded-[20px] border border-gray-100 shadow-sm';

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div><h1 className="text-[18px] font-black text-[#111827]">Kullanıcı Değerlendirmeleri</h1><p className="text-[11px] font-medium text-gray-400">Kullanıcıdan kullanıcıya & mağazaya yorumlar</p></div>
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-4 pb-20">
        <div className="grid grid-cols-3 gap-3">
          {[{label:'Toplam (30g)',value:'1,420',icon:'💬'},{label:'Ort. Puan',value:'4.3',icon:'⭐'},{label:'Düşük Puan (<3)',value:'86',icon:'⚠️'}].map((k,i)=>(<div key={i} className={`${cardClass} p-4 text-center`}><span className="text-[20px]">{k.icon}</span><p className="text-[10px] font-bold text-gray-400 uppercase mt-2 mb-1">{k.label}</p><p className="text-[22px] font-black text-[#111827]">{k.value}</p></div>))}
        </div>
        {reviews.map((r, i) => (
          <div key={i} className={`${cardClass} p-4 ${r.rating <= 2 ? 'border-l-4 border-l-red-400' : ''}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-bold text-[#111827]">{r.reviewer}</span>
                  <span className="text-[10px] text-gray-400">→</span>
                  <span className="text-[12px] font-bold text-[#007AFF]">{r.target}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600">{r.type}</span>
                </div>
                <p className="text-yellow-400 text-[12px] mt-1">{'⭐'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</p>
                <p className="text-[12px] text-gray-700 mt-1">{r.text}</p>
                <span className="text-[10px] text-gray-400 mt-1 block">{r.date}</span>
              </div>
              <div className="flex gap-2 shrink-0">
                <button className="text-[9px] font-black px-3 py-2 bg-green-500 text-white rounded-lg">ONAYLA</button>
                <button className="text-[9px] font-black px-3 py-2 bg-red-50 text-red-600 rounded-lg border border-red-100">KALDIR</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
