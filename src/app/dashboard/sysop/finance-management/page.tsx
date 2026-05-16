"use client";

import React, {useEffect, useState} from 'react';
import LayoutWrapper from '@/components/LayoutWrapper';
import {useRouter} from 'next/navigation';

export function FinanceView() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'payouts' | 'invoices' | 'failed'>('payouts');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [warnModal, setWarnModal] = useState(false);
  const [actionDone, setActionDone] = useState<string | null>(null);

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
        <button onClick={() => setWarnModal(true)} className="whitespace-nowrap px-4 py-2 bg-[#111827] hover:bg-black text-white text-[11px] font-bold tracking-wide rounded-xl transition-colors">
          LİSTEYİ GÖR & UYAR
        </button>
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div onClick={() => setExpandedCard(expandedCard === 'escrow' ? null : 'escrow')} className={`bg-white rounded-2xl p-5 border shadow-sm relative overflow-hidden cursor-pointer transition-all ${expandedCard === 'escrow' ? 'border-gray-900 ring-1 ring-gray-900' : 'border-gray-100 hover:border-gray-300'}`}>
          <div className="flex items-center mb-1 gap-2">
            <h3 className="text-[11px] font-bold text-gray-500">HAVUZ (EMANET) HESAP</h3>
            <svg className={`w-3.5 h-3.5 text-gray-400 ml-auto transition-transform ${expandedCard === 'escrow' ? 'rotate-180 text-gray-900' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </div>
          <h2 className="text-[24px] font-black text-[#111827] tracking-tight">₺1,248,500</h2>
          
          {expandedCard === 'escrow' && (
            <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in" onClick={(e) => e.stopPropagation()}>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center"><span className="text-[11px] font-bold text-gray-500">Bloke Süresi</span><span className="text-[12px] font-black text-gray-900">14 Gün</span></div>
                <div className="flex justify-between items-center"><span className="text-[11px] font-bold text-gray-500">Ort. Çözülme</span><span className="text-[12px] font-black text-green-600">3.2 Gün</span></div>
              </div>
              <button onClick={() => router.push('/dashboard/sysop/finance-management/escrow')} className="w-full py-2.5 rounded-[10px] bg-[#111827] text-white text-[10px] font-black tracking-widest hover:bg-black transition-colors">
                DETAYLARI GÖRÜNTÜLE
              </button>
            </div>
          )}
          
          <div className="absolute top-0 right-0 p-5 opacity-5 pointer-events-none">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
          </div>
        </div>
        
        <div onClick={() => setExpandedCard(expandedCard === 'payouts' ? null : 'payouts')} className={`bg-white rounded-2xl p-5 border shadow-sm relative overflow-hidden cursor-pointer transition-all ${expandedCard === 'payouts' ? 'border-gray-900 ring-1 ring-gray-900' : 'border-gray-100 hover:border-gray-300'}`}>
          <div className="flex items-center mb-1 gap-2">
            <h3 className="text-[11px] font-bold text-gray-500">BEKLEYEN HAKEDİŞLER</h3>
            <svg className={`w-3.5 h-3.5 text-gray-400 ml-auto transition-transform ${expandedCard === 'payouts' ? 'rotate-180 text-gray-900' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </div>
          <div className="flex items-baseline gap-2">
             <h2 className="text-[24px] font-black text-orange-500 tracking-tight">₺342,100</h2>
          </div>
          <p className="text-[10px] font-bold text-gray-400 mt-1">Siparişi tamamlanmış, ödeme bekleyen</p>

          {expandedCard === 'payouts' && (
            <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in" onClick={(e) => e.stopPropagation()}>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center"><span className="text-[11px] font-bold text-gray-500">Satıcı Sayısı</span><span className="text-[12px] font-black text-gray-900">412</span></div>
                <div className="flex justify-between items-center"><span className="text-[11px] font-bold text-gray-500">Kilitli (Dispute)</span><span className="text-[12px] font-black text-[#FF383C]">₺12,500</span></div>
              </div>
              <button onClick={() => router.push('/dashboard/sysop/finance-management/payouts')} className="w-full py-2.5 rounded-[10px] bg-[#111827] text-white text-[10px] font-black tracking-widest hover:bg-black transition-colors">
                DETAYLARI GÖRÜNTÜLE
              </button>
            </div>
          )}
        </div>

        <div onClick={() => setExpandedCard(expandedCard === 'failed' ? null : 'failed')} className={`bg-white rounded-2xl p-5 border shadow-sm relative overflow-hidden cursor-pointer transition-all ${expandedCard === 'failed' ? 'border-gray-900 ring-1 ring-gray-900' : 'border-gray-100 hover:border-gray-300'}`}>
          <div className="flex items-center mb-1 gap-2">
            <h3 className="text-[11px] font-bold text-gray-500">BAŞARISIZ ÖDEMELER</h3>
            <svg className={`w-3.5 h-3.5 text-gray-400 ml-auto transition-transform ${expandedCard === 'failed' ? 'rotate-180 text-gray-900' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </div>
          <div className="flex items-baseline gap-2">
             <h2 className="text-[24px] font-black text-red-500 tracking-tight">₺18,450</h2>
             <span className="text-[11px] font-bold bg-red-50 text-red-600 px-1.5 py-0.5 rounded">14 Kişi</span>
          </div>
          <p className="text-[10px] font-bold text-gray-400 mt-1">IBAN hatası nedeniyle dönen EFT'ler</p>

          {expandedCard === 'failed' && (
            <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in" onClick={(e) => e.stopPropagation()}>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center"><span className="text-[11px] font-bold text-gray-500">En Sık Hata</span><span className="text-[12px] font-black text-gray-900">İsim Uyuşmazlığı</span></div>
              </div>
              <button onClick={() => router.push('/dashboard/sysop/finance-management/failed-payouts')} className="w-full py-2.5 rounded-[10px] bg-red-500 text-white text-[10px] font-black tracking-widest hover:bg-red-600 transition-colors">
                MÜDAHALE ET
              </button>
            </div>
          )}
        </div>

        <div onClick={() => setExpandedCard(expandedCard === 'invoices' ? null : 'invoices')} className={`bg-white rounded-2xl p-5 border shadow-sm relative overflow-hidden cursor-pointer transition-all ${expandedCard === 'invoices' ? 'border-gray-900 ring-1 ring-gray-900' : 'border-gray-100 hover:border-gray-300'}`}>
          <div className="flex items-center mb-1 gap-2">
            <h3 className="text-[11px] font-bold text-gray-500">GİB FATURA KUYRUĞU</h3>
            <svg className={`w-3.5 h-3.5 text-gray-400 ml-auto transition-transform ${expandedCard === 'invoices' ? 'rotate-180 text-gray-900' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </div>
          <h2 className="text-[24px] font-black text-[#111827] tracking-tight">32 Bekleyen</h2>
          <p className="text-[10px] font-bold text-gray-400 mt-1">Hata veren (1300 dönmeyen): <span className="text-red-500">2</span></p>

          {expandedCard === 'invoices' && (
            <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in" onClick={(e) => e.stopPropagation()}>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center"><span className="text-[11px] font-bold text-gray-500">Riskli (&lt; 7 Gün)</span><span className="text-[12px] font-black text-[#FF383C]">1 Fatura</span></div>
              </div>
              <button onClick={() => router.push('/dashboard/sysop/finance-management/invoices')} className="w-full py-2.5 rounded-[10px] bg-[#111827] text-white text-[10px] font-black tracking-widest hover:bg-black transition-colors">
                DETAYLARI GÖRÜNTÜLE
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {actionDone && <div className="fixed top-4 right-4 z-[200] bg-[#111827] text-white px-5 py-3 rounded-xl text-[13px] font-bold shadow-2xl animate-fade-in">✅ {actionDone}</div>}

      {/* Warn Modal */}
      {warnModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setWarnModal(false)}>
          <div onClick={e => e.stopPropagation()} className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-red-50"><h3 className="text-[16px] font-black text-red-700">⚠️ Mali Eşik Uyarısı — 350.000 TL</h3></div>
            <div className="p-6 space-y-3">
              {[{name: 'Elif Boutique', total: '₺312,400', pct: '%89'}, {name: 'Urban Style TR', total: '₺298,000', pct: '%85'}, {name: 'Bella Moda', total: '₺295,500', pct: '%84'}].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div><p className="text-[13px] font-bold text-gray-900">{s.name}</p><p className="text-[10px] text-gray-500">Yıllık Satış: {s.total}</p></div>
                  <span className="text-[12px] font-black text-red-600">{s.pct}</span>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button onClick={() => setWarnModal(false)} className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-800 font-bold text-[12px]">Kapat</button>
              <button onClick={() => { setWarnModal(false); setActionDone('Satıcılara uyarı bildirimi gönderildi.'); setTimeout(() => setActionDone(null), 2500); }} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold text-[12px]">Toplu Uyarı Gönder</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FinanceManagement() {
  const router = useRouter();
  const [eftDone, setEftDone] = useState<string | null>(null);

  return (
    <LayoutWrapper>
      {eftDone && <div className="fixed top-4 right-4 z-[200] bg-[#111827] text-white px-5 py-3 rounded-xl text-[13px] font-bold shadow-2xl animate-fade-in">✅ {eftDone}</div>}
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
               <button onClick={() => { setEftDone('EFT dosyası hazırlanıyor...'); setTimeout(() => setEftDone(null), 2500); }} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-[13px] font-bold hover:bg-gray-50 transition-colors shadow-sm">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                 EFT Dosyası İndir
               </button>
               <button onClick={() => router.push('/dashboard/sysop/finance-management/payouts')} className="flex items-center gap-2 px-4 py-2 bg-[#111827] text-white rounded-xl text-[13px] font-bold hover:bg-black transition-colors shadow-lg shadow-gray-900/20">
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
