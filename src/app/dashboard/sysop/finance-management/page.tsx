"use client";

import React, { useState, useEffect } from 'react';
import LayoutWrapper from '@/components/LayoutWrapper';
import { useRouter } from 'next/navigation';

export function FinanceView() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'payouts' | 'invoices' | 'failed'>('payouts');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      
      {/* ALERTS & RISKS */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-2 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-red-50 text-[#FF383C] rounded-full flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <div>
            <h3 className="text-[13px] font-black text-[#111827]">Mali Eşik Uyarısı: 350.000 TL Limitine Yaklaşan Satıcılar</h3>
            <p className="text-[11px] font-medium text-gray-500 mt-0.5">
              <span className="font-bold text-[#FF383C]">3 satıcının</span> yıllık satış hacmi "Esnaf Muaflığı" sınırını (%85 oranında) aşmak üzere. Olası vergi cezalarını önlemek için satıcıları uyarın.
            </p>
          </div>
        </div>
        <button className="whitespace-nowrap px-4 py-2 bg-[#111827] hover:bg-black text-white text-[11px] font-bold tracking-wide rounded-xl transition-colors">
          LİSTEYİ GÖR & UYAR
        </button>
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden">
          <h3 className="text-[11px] font-bold text-gray-500 mb-1">HAVUZ (EMANET) HESAP</h3>
          <h2 className="text-[24px] font-black text-[#111827] tracking-tight">₺1,248,500</h2>
          <div className="absolute top-0 right-0 p-5 opacity-10">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden">
          <h3 className="text-[11px] font-bold text-gray-500 mb-1">BEKLEYEN HAKEDİŞLER</h3>
          <div className="flex items-baseline gap-2">
             <h2 className="text-[24px] font-black text-orange-500 tracking-tight">₺342,100</h2>
          </div>
          <p className="text-[10px] font-bold text-gray-400 mt-1">Siparişi tamamlanmış, ödeme bekleyen</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden">
          <h3 className="text-[11px] font-bold text-gray-500 mb-1">BAŞARISIZ ÖDEMELER</h3>
          <div className="flex items-baseline gap-2">
             <h2 className="text-[24px] font-black text-red-500 tracking-tight">₺18,450</h2>
             <span className="text-[11px] font-bold bg-red-50 text-red-600 px-1.5 py-0.5 rounded">14 Kişi</span>
          </div>
          <p className="text-[10px] font-bold text-gray-400 mt-1">IBAN hatası nedeniyle dönen EFT'ler</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden">
          <h3 className="text-[11px] font-bold text-gray-500 mb-1">GİB FATURA KUYRUĞU</h3>
          <h2 className="text-[24px] font-black text-[#111827] tracking-tight">32 Bekleyen</h2>
          <p className="text-[10px] font-bold text-gray-400 mt-1">Hata veren (1300 dönmeyen): <span className="text-red-500">2</span></p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-px">
        <button 
          onClick={() => setActiveTab('payouts')}
          className={`px-4 py-2.5 text-[13px] font-bold border-b-2 transition-colors ${activeTab === 'payouts' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Hakedişler (Payouts)
        </button>
        <button 
          onClick={() => setActiveTab('failed')}
          className={`px-4 py-2.5 text-[13px] font-bold border-b-2 transition-colors ${activeTab === 'failed' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Başarısız Ödemeler
        </button>
        <button 
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2.5 text-[13px] font-bold border-b-2 transition-colors ${activeTab === 'invoices' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          e-Fatura Yönetimi
        </button>
      </div>

      {/* TAB CONTENTS */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        
        {activeTab === 'payouts' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-wider">Satıcı / IBAN Adı</th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-wider">Tutar</th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-wider">Sipariş / Komisyon</th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-wider">Statü</th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-wider text-right">Aksiyon</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-[13px] font-bold text-gray-900">Zeynep Yılmaz</div>
                    <div className="text-[11px] font-medium text-gray-500 mt-0.5">TR12 0006 2000 0001 2345 6789 01</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[14px] font-black text-gray-900">₺1,450.00</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[12px] font-bold text-gray-700">ORD-10492</div>
                    <div className="text-[11px] font-medium text-green-600 mt-0.5">Komisyon: ₺150.00 (Fatura Kesildi)</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-orange-100 text-orange-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                      BEKLİYOR
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11px] font-bold rounded-lg transition-colors">
                       Öde
                     </button>
                  </td>
                </tr>
                
                <tr className="hover:bg-gray-50/50 transition-colors opacity-75">
                  <td className="px-6 py-4">
                    <div className="text-[13px] font-bold text-gray-900">Elif Şahin</div>
                    <div className="text-[11px] font-medium text-gray-500 mt-0.5">TR99 0006 2000 0001 2345 6789 01</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[14px] font-black text-gray-900">₺850.00</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[12px] font-bold text-gray-700">ORD-10493</div>
                    <div className="text-[11px] font-medium text-red-500 mt-0.5">Kısmi İade Uygulandı</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-red-50 text-red-700 border border-red-200">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      KİLİTLİ (DISPUTE)
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <button disabled className="px-3 py-1.5 bg-gray-50 text-gray-400 text-[11px] font-bold rounded-lg cursor-not-allowed">
                       Öde
                     </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'failed' && (
          <div className="overflow-x-auto">
            <div className="px-6 py-4 bg-red-50 border-b border-red-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white text-red-500 rounded-full flex items-center justify-center shadow-sm">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <h3 className="text-[13px] font-black text-red-900">14 Adet Hatalı Ödeme Tespit Edildi</h3>
                  <p className="text-[11px] font-medium text-red-700">Bankadan dönen bakiyeler havuz hesaba aktarıldı. Satıcı TCKN ve IBAN uyuşmazlığı.</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold rounded-lg transition-colors shadow-sm">
                Toplu Uyarı Maili Gönder
              </button>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-wider">Satıcı / IBAN Adı</th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-wider">Tutar</th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-wider">Banka Yanıtı</th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-wider text-right">Aksiyon</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-[13px] font-bold text-gray-900">Fatma Öztürk</div>
                    <div className="text-[11px] font-medium text-gray-500 mt-0.5">TR44 0006 2000 0001 2345 6789 01</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[14px] font-black text-gray-900">₺2,100.00</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[12px] font-bold text-red-600">İsim Uyuşmazlığı (İade)</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <button className="px-3 py-1.5 bg-gray-900 hover:bg-black text-white text-[11px] font-bold rounded-lg transition-colors">
                       Yeniden Dene (Retry)
                     </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-wider">Fatura No</th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-wider">Müşteri</th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-wider">Tür / Tutar</th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-wider">GİB Zarf Durumu</th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-wider text-right">Aksiyon</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50/50 transition-colors bg-red-50/30">
                  <td className="px-6 py-4">
                    <div className="text-[13px] font-bold text-gray-900">SLT202400000142</div>
                    <div className="text-[11px] font-black text-red-500 mt-0.5">GÜN 6 (KRİTİK RİSK)</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[13px] font-bold text-gray-900">Ayşe Demir</div>
                    <div className="text-[11px] font-medium text-gray-500 mt-0.5">12345678901</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[12px] font-bold text-gray-700">Komisyon Bedeli</div>
                    <div className="text-[13px] font-black text-gray-900 mt-0.5">₺240.00 <span className="text-[10px] text-gray-400 font-medium">+ %20 KDV</span></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-red-100 text-red-700 w-fit">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        HATA: TCKN GEÇERSİZ
                      </span>
                      <span className="text-[10px] font-bold text-gray-500 ml-1">Otomatik Retry: 2/3</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <button className="px-3 py-1.5 bg-gray-900 hover:bg-black text-white text-[11px] font-bold rounded-lg transition-colors">
                       Zorla Yeniden Dene
                     </button>
                  </td>
                </tr>
                
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-[13px] font-bold text-gray-900">SLT202400000143</div>
                    <div className="text-[11px] font-medium text-gray-500 mt-0.5">Bugün, 15:45</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[13px] font-bold text-gray-900">Merve Can</div>
                    <div className="text-[11px] font-medium text-gray-500 mt-0.5">22233344455</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[12px] font-bold text-gray-700">Komisyon Bedeli</div>
                    <div className="text-[13px] font-black text-gray-900 mt-0.5">₺180.00 <span className="text-[10px] text-gray-400 font-medium">+ %20 KDV</span></div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-100">
                      <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      GİB'E İLETİLİYOR
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <button disabled className="px-3 py-1.5 bg-gray-50 text-gray-400 text-[11px] font-bold rounded-lg cursor-not-allowed">
                       Bekleniyor
                     </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        
      </div>
    </div>
  );
}

export default function FinanceManagement() {
  const router = useRouter();

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-[#F9FAFB] pt-24 pb-20 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <button 
                onClick={() => router.push('/dashboard/sysop')}
                className="flex items-center gap-1.5 text-[13px] font-bold text-gray-400 hover:text-gray-900 transition-colors mb-3"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Geri Dön
              </button>
              <h1 className="text-[28px] md:text-[32px] font-black tracking-tight text-[#111827]">
                Finans ve Muhasebe
              </h1>
              <p className="text-[14px] font-medium text-gray-500 mt-1">
                Emanet hesap, satıcı hakedişleri ve GİB fatura durumları.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
               <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-[13px] font-bold hover:bg-gray-50 transition-colors shadow-sm">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                 EFT Dosyası İndir
               </button>
               <button className="flex items-center gap-2 px-4 py-2 bg-[#111827] text-white rounded-xl text-[13px] font-bold hover:bg-black transition-colors shadow-lg shadow-gray-900/20">
                 Toplu Ödeme Yap
               </button>
            </div>
          </div>

          <FinanceView />

        </div>
      </div>
    </LayoutWrapper>
  );
}
