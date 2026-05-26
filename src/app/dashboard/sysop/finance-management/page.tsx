'use client';
import {HugeiconsIcon} from '@hugeicons/react';
import {Cancel01Icon, Invoice01Icon, Money01Icon, Tick01Icon, Wallet01Icon} from '@hugeicons/core-free-icons';
import React, {useEffect, useState} from 'react';
import LayoutWrapper from '@/components/LayoutWrapper';
import {useRouter} from 'next/navigation';
import {PageHeader} from '@/app/dashboard/components/ui/PageHeader';
import {KPIGrid, KPIItem} from '@/app/dashboard/components/ui/KPIGrid';
import {FilterTabs} from '@/app/dashboard/components/ui/FilterBar';
import {ActionModal} from '@/app/dashboard/components/ui/StatusBadge';

export function FinanceView() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [warnModal, setWarnModal] = useState(false);
  const [actionDone, setActionDone] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const isMock = token === "mock_token" || !token;

  const warnedSellers: any[] = []; 

  const kpiItems: KPIItem[] = [
    {
      label: 'HAVUZ (EMANET) HESAP',
      value: isMock ? '₺0' : '₺1,248,500',
      icon: <HugeiconsIcon icon={Wallet01Icon} size={24} />,
      colorClass: 'text-gray-900'
    },
    {
      label: 'BEKLEYEN HAKEDİŞLER',
      value: isMock ? '₺0' : '₺342,100',
      icon: <HugeiconsIcon icon={Money01Icon} size={24} />,
      colorClass: 'text-orange-500'
    },
    {
      label: 'BAŞARISIZ ÖDEMELER',
      value: isMock ? '₺0' : '₺18,450',
      icon: <HugeiconsIcon icon={Cancel01Icon} size={24} />,
      colorClass: 'text-red-500'
    },
    {
      label: 'GİB FATURA KUYRUĞU',
      value: isMock ? '0 Bekleyen' : '32 Bekleyen',
      icon: <HugeiconsIcon icon={Invoice01Icon} size={24} />,
      colorClass: 'text-gray-900'
    }
  ];

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
              <span className="font-bold text-[#FF383C]">{warnedSellers.length} satıcının</span> yıllık satış hacmi "Esnaf Muaflığı" sınırını (%85 oranında) aşmak üzere. Olası vergi cezalarını önlemek için satıcıları uyarın.
            </p>
          </div>
        </div>
        <button onClick={() => setWarnModal(true)} className="whitespace-nowrap px-4 py-2 bg-[#111827] hover:bg-black text-white text-[11px] font-bold tracking-wide rounded-xl transition-colors">
          LİSTEYİ GÖR & UYAR
        </button>
      </div>

      {/* METRICS CARDS */}
      <KPIGrid items={kpiItems} />

      {/* Toast */}
      {actionDone && <div className="fixed top-4 right-4 z-[200] bg-[#111827] text-white px-5 py-3 rounded-xl text-[13px] font-bold shadow-2xl animate-fade-in"><HugeiconsIcon icon={Tick01Icon} size={16} className="inline-block mr-1" /> {actionDone}</div>}

      {/* Warn Modal */}
      <ActionModal
        isOpen={warnModal}
        onClose={() => setWarnModal(false)}
        title="Mali Eşik Uyarısı — 350.000 TL"
      >
        <div className="space-y-3">
          {warnedSellers.map((s, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div><p className="text-[13px] font-bold text-gray-900">{s.name}</p><p className="text-[10px] text-gray-500">Yıllık Satış: {s.total}</p></div>
              <span className="text-[12px] font-black text-red-600">{s.pct}</span>
            </div>
          ))}
          {warnedSellers.length === 0 && (
            <div className="p-3 bg-gray-50 rounded-xl text-center text-[13px] text-gray-500">
              Uyarı sınırında satıcı bulunmamaktadır.
            </div>
          )}
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={() => setWarnModal(false)} className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-800 font-bold text-[12px]">Kapat</button>
          <button 
            disabled={warnedSellers.length === 0}
            onClick={() => { setWarnModal(false); setActionDone('Satıcılara uyarı bildirimi gönderildi.'); setTimeout(() => setActionDone(null), 2500); }} 
            className={`flex-1 py-2.5 rounded-xl font-bold text-[12px] ${warnedSellers.length === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600'}`}
          >
            Toplu Uyarı Gönder
          </button>
        </div>
      </ActionModal>
    </div>
  );
}

export default function FinanceManagement() {
  const router = useRouter();
  const [eftDone, setEftDone] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState('Son 1 Ay');

  return (
    <LayoutWrapper>
      {eftDone && <div className="fixed top-4 right-4 z-[200] bg-[#111827] text-white px-5 py-3 rounded-xl text-[13px] font-bold shadow-2xl animate-fade-in"><HugeiconsIcon icon={Tick01Icon} size={16} className="inline-block mr-1" /> {eftDone}</div>}
      <div className="min-h-screen bg-[#F9FAFB] pt-24 pb-20 md:pb-12">
        <PageHeader
          title="Finans ve Muhasebe"
          description="Emanet hesap, satıcı hakedişleri ve GİB fatura durumları."
          onBack={() => router.push('/dashboard/sysop')}
          actions={
            <>
              <button onClick={() => { setEftDone('EFT dosyası hazırlanıyor...'); setTimeout(() => setEftDone(null), 2500); }} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-[13px] font-bold hover:bg-gray-50 transition-colors shadow-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                EFT Dosyası İndir
              </button>
              <button onClick={() => router.push('/dashboard/sysop/finance-management/payouts')} className="flex items-center gap-2 px-4 py-2 bg-[#111827] text-white rounded-xl text-[13px] font-bold hover:bg-black transition-colors shadow-lg shadow-gray-900/20">
                Toplu Ödeme Yap
              </button>
            </>
          }
        />
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-8">
          
          <div className="mb-6">
            <FilterTabs
              tabs={['Bugün', 'Son 3 Gün', 'Son 1 Hafta', 'Son 1 Ay', 'Son 3 Ay', 'Bu Yıl'].map(f => ({ id: f, label: f }))}
              activeTab={dateFilter}
              onChange={setDateFilter}
            />
          </div>

          <FinanceView />

        </div>
      </div>
    </LayoutWrapper>
  );
}
