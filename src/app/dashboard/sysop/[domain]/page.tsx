"use client";

import React, {use, useEffect, useState} from 'react';
import Link from 'next/link';
import {AnalyticsUpIcon, ArrowLeft01Icon, Download01Icon, Search01Icon} from 'hugeicons-react';
import useSWR from 'swr';
import {apiUrl} from '../../../../lib/api';
import {useAuthStore} from '../../../../store/useAuthStore';

// Domain Definitions
const domainDetails: Record<string, { title: string, desc: string, kpis: {l: string, v: string, t: string}[] }> = {
  financial: { title: 'Finansal Kontrol Merkezi', desc: 'Tüm nakit akışı, ciro, kar ve finansal sağlığın derin analizi.', kpis: [] },
  risk: { title: 'Risk ve İhlal Kontrol Merkezi', desc: 'Başarısız ödemeler, fraud şüpheleri ve anomali tespitleri.', kpis: [] },
  accounting: { title: 'Muhasebe ve Vergi', desc: 'Bekleyen faturalar, KDV ödemeleri ve muhasebe defterleri.', kpis: [] },
  growth: { title: 'Büyüme Merkezi', desc: 'Kullanıcı kazanımı, aktif kullanıcılar (MAU/DAU) ve yaşam boyu değer (LTV).', kpis: [] },
  community: { title: 'Topluluk Merkezi', desc: 'Platform içi etkileşim, gönderiler ve moderasyon kuyruğu raporları.', kpis: [] },
  marketplace: { title: 'Pazaryeri Operasyonları', desc: 'Siparişler, iadeler, satıcı analizleri ve ürün performansları.', kpis: [] },
  creator: { title: 'İçerik Üretici ve Uzman Merkezi', desc: 'Influencer ödemeleri, uzman danışmanlık seansları ve performanslar.', kpis: [] },
  infrastructure: { title: 'Altyapı Merkezi', desc: 'Sunucu sağlığı, veritabanı yanıt süreleri ve güvenlik alarmları.', kpis: [] },
  map: { title: 'Küresel Harita', desc: 'Kullanıcıların ve siparişlerin coğrafi ve bölgesel dağılımı.', kpis: [] },
  ai: { title: 'Yapay Zeka Operasyonları', desc: 'LLM kullanım oranları, maliyet analizi ve yapay zeka başarı metrikleri.', kpis: [] }
};

const fetcher = (url: string, token: string) => fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json());

export default function DomainDetailPage({ params }: { params: Promise<{ domain: string }> }) {
  const unwrappedParams = use(params);
  const domainKey = unwrappedParams.domain as string;
  console.log("REQUESTED DOMAIN:", domainKey);
  const staticData = domainDetails[domainKey];

  const token = useAuthStore((state) => state.token);
  const { data, isLoading } = useSWR(
    token ? [apiUrl(`/admin/analytics/domain/${domainKey}`), token] : null,
    ([url, token]) => fetcher(url, token)
  );

  const { data: ordersData } = useSWR(
    token && domainKey === 'accounting' ? [apiUrl('/admin/orders'), token] : null,
    ([url, t]) => fetcher(url, t)
  );

  const MOCK_MODE = false;
  let mockData: any = null;

  if (MOCK_MODE && domainKey === 'financial') {
    mockData = {
      payload: {
        stats: {
          kpis: [
            { l: 'Gerçekleşen Toplam Ciro', v: '100M ₺', t: '+%15 Büyüme' },
            { l: 'Aktarılacak Satıcı Hakedişi', v: '65M ₺', t: 'Öncelikli Onay' },
            { l: 'Platform Komisyon Geliri', v: '15M ₺', t: 'Net Kar' },
          ],
          columns: ['İşlem ID', 'Departman / Tip', 'Tutar', 'Durum', 'Tarih'],
          details: [
            { col1: '#TRX-001', col2: 'Satıcı Ödemeleri (Toplu)', col3: '22,5M ₺', col4: 'BEKLİYOR', col5: 'Bugün 15:30' },
            { col1: '#TRX-002', col2: 'Kargo Firması (Aras Kargo)', col3: '4,2M ₺', col4: 'ONAYLANDI', col5: 'Dün 09:15' },
            { col1: '#TRX-003', col2: 'Kargo Firması (Yurtiçi)', col3: '5,1M ₺', col4: 'BEKLİYOR', col5: 'Bugün 10:00' },
            { col1: '#TRX-004', col2: 'Vergi Kesintileri (Aylık)', col3: '3M ₺', col4: 'TASLAK', col5: '25 Haziran' },
            { col1: '#TRX-005', col2: 'Platform İade Rezervi', col3: '5M ₺', col4: 'ONAYLANDI', col5: 'Dün 14:00' },
          ]
        }
      }
    };
  } else if (MOCK_MODE && domainKey === 'risk') {
    mockData = {
      payload: {
        stats: {
          kpis: [
            { l: 'Toplam Riskteki Ciro', v: '1,95M ₺', t: 'Aksiyon Gerekiyor' },
            { l: 'Başarısız İşlem Sayısı', v: '331 İşlem', t: 'Son 24 Saat' },
            { l: 'Fraud (Şüpheli) Oranı', v: '%4.2', t: 'Normalin Üstünde' },
          ],
          columns: ['İşlem ID', 'Hata Türü', 'Etkilenen Tutar', 'Kullanıcı IP / Skor', 'Tarih'],
          details: [
            { col1: '#ERR-812', col2: 'Yetersiz Bakiye', col3: '4.500 ₺', col4: '192.168.1.1 (Risk: Düşük)', col5: '12 dk önce' },
            { col1: '#ERR-813', col2: 'Banka Reddi (05 Do Not Honor)', col3: '12.450 ₺', col4: '88.241.12.x (Risk: Orta)', col5: '24 dk önce' },
            { col1: '#ERR-814', col2: 'Fraud Şüphesi (Çalıntı Kart)', col3: '85.000 ₺', col4: '45.12.98.x (Risk: ÇOK YÜKSEK)', col5: '1 saat önce' },
            { col1: '#ERR-815', col2: 'Altyapı Zaman Aşımı', col3: '1.200 ₺', col4: 'Sistem Hatası', col5: '2 saat önce' },
            { col1: '#ERR-816', col2: 'Yetersiz Bakiye', col3: '8.900 ₺', col4: '176.45.12.x (Risk: Düşük)', col5: '3 saat önce' },
          ]
        }
      }
    };
  } else if (domainKey === 'accounting') {
    const orders = ordersData?.payload?.orders || [];
    const invoiceOrders = orders.filter((o: any) => { const s = o.status?.toLowerCase(); return s !== 'cancelled' && s !== 'refunded' && s !== 'invalid' && s !== 'pending_payment'; });
    
    let totalKdv = 0;
    let totalBase = 0;
    let totalInvoiceAmount = 0;

    const detailsList: any[] = [];
    
    // Günlük KDV birikimini tutacağımız harita (Zaman Serisi Analizi için)
    const dailyKdvMap: Record<number, number> = {};
    
    invoiceOrders.forEach((o: any) => {
      const orderAmount = Number(o.totalAmount || 0);
      const shippingPrice = Number(o.shippingPrice || o.shippingCost || 0);
      
      const productAmount = Math.max(0, orderAmount - shippingPrice);
      
      // Floating point hatalarını önlemek için değerleri kuruş (integer) cinsinden hesaplıyoruz
      const commissionTotalCents = Math.round(productAmount * 0.15 * 100);
      const kdvRate = 0.20; 
      
      const commBaseAmountCents = Math.round(commissionTotalCents / (1 + kdvRate));
      const commKdvAmountCents = commissionTotalCents - commBaseAmountCents;

      totalKdv += commKdvAmountCents;
      totalBase += commBaseAmountCents;
      totalInvoiceAmount += commissionTotalCents;

      const orderTimestamp = Number(o.orderDate || Date.now());
      const dateObj = new Date(orderTimestamp);
      const dateStr = dateObj.toLocaleDateString('tr-TR');
      const timeStr = dateObj.toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'});
      const dayOfMonth = dateObj.getDate();

      // Günlük KDV toplamını kuruş cinsinden biriktiriyoruz
      dailyKdvMap[dayOfMonth] = (dailyKdvMap[dayOfMonth] || 0) + commKdvAmountCents;

      const tcNo = o.buyer?.tc || o.buyer?.tcKimlikNo || '11111111111';
      const email = o.buyer?.eMail || o.buyer?.email || o.eMail || 'belirtilmemis@email.com';
      
      let addressStr = 'Adres bilgisi yok';
      if (o.shippingAddress) {
         addressStr = `${o.shippingAddress.addressName || ''} ${o.shippingAddress.addressDescription || o.shippingAddress.streetName || ''} ${o.shippingAddress.cityName || ''} ${o.shippingAddress.stateName || ''}`.trim() || 'Adres bilgisi yok';
      } else if (o.shippingAddressSnapshot) {
         addressStr = `${o.shippingAddressSnapshot.addressLine1 || o.shippingAddressSnapshot.streetName || ''} ${o.shippingAddressSnapshot.city || o.shippingAddressSnapshot.cityName || ''} ${o.shippingAddressSnapshot.district || o.shippingAddressSnapshot.stateName || ''}`.trim() || 'Adres bilgisi yok';
      } else if (o.buyer?.address) {
         addressStr = o.buyer.address;
      }
      const address = addressStr;

      detailsList.push({
        col1: `#ORD-${(o.orderID || '000').split('-')[0]} (Komisyon)`,
        col2: { tc: tcNo, email, address },
        col3: `${(commBaseAmountCents / 100).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺`,
        col4: `${(commKdvAmountCents / 100).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺`,
        col5: `${(commissionTotalCents / 100).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺`,
        col6: 'TASLAK',
        col7: `${dateStr} ${timeStr}`,
        orderData: o
      });

      if (shippingPrice > 0) {
        const shippingPayer = o.shippingPayer || 'buyer';
        const shippingPriceCents = Math.round(shippingPrice * 100);
        const shipBaseAmountCents = Math.round(shippingPriceCents / (1 + kdvRate));
        const shipKdvAmountCents = shippingPriceCents - shipBaseAmountCents;

        totalKdv += shipKdvAmountCents;
        totalBase += shipBaseAmountCents;
        totalInvoiceAmount += shippingPriceCents;
        
        dailyKdvMap[dayOfMonth] = (dailyKdvMap[dayOfMonth] || 0) + shipKdvAmountCents;

        const payerText = shippingPayer === 'seller' ? 'Satıcı Öder' : shippingPayer === 'buyer' ? 'Alıcı Öder' : 'Ortak';

        detailsList.push({
          col1: `#SHP-${(o.orderID || '000').split('-')[0]} (Kargo - ${payerText})`,
          col2: { tc: tcNo, email, address },
          col3: `${(shipBaseAmountCents / 100).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺`,
          col4: `${(shipKdvAmountCents / 100).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺`,
          col5: `${(shippingPriceCents / 100).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺`,
          col6: 'TASLAK',
          col7: `${dateStr} ${timeStr}`,
          orderData: o
        });
      }
    });

    const currentDay = new Date().getDate();
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    
    // Analitik Matematik: En Küçük Kareler Yöntemi (Least Squares Linear Regression)
    // Zaman Serisi: x = Gün (1'den currentDay'e kadar), y = O güne kadar Kümülatif KDV Toplamı
    let estimatedKdv = 0;
    
    const xValues: number[] = [];
    const yValues: number[] = [];
    let cumulativeKdvCents = 0;
    
    for (let day = 1; day <= currentDay; day++) {
      cumulativeKdvCents += dailyKdvMap[day] || 0;
      // Sadece KDV olan günleri veya mevcut güne kadar olan tüm günleri hesaba katabiliriz
      // Analitik olarak en sağlıklı sonuç için tüm geçen günleri dahil ediyoruz.
      xValues.push(day);
      yValues.push(cumulativeKdvCents / 100);
    }

    const n = xValues.length;
    if (n > 1 && cumulativeKdvCents > 0) {
      const sumX = xValues.reduce((a, b) => a + b, 0);
      const sumY = yValues.reduce((a, b) => a + b, 0);
      const sumXY = xValues.reduce((sum, x, i) => sum + (x * yValues[i]), 0);
      const sumXX = xValues.reduce((sum, x) => sum + (x * x), 0);

      // Eğim (m) = (n * Σ(xy) - Σx * Σy) / (n * Σ(x^2) - (Σx)^2)
      const m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
      
      // Kesişim (b) = (Σy - m * Σx) / n
      const b = (sumY - m * sumX) / n;

      // Ay sonu projeksiyonu: y = m * x + b (x = daysInMonth)
      const projectedValue = (m * daysInMonth) + b;
      
      // Tahmin mantıklı olmalı (negatif olamaz, mevcut tolamdan küçük olamaz)
      estimatedKdv = Math.max(projectedValue, totalKdv / 100);
    } else {
      // Yeterli veri yoksa basit orantı
      estimatedKdv = totalKdv > 0 ? ((totalKdv / 100) / currentDay) * daysInMonth : 0;
    }

    mockData = {
      payload: {
        stats: {
          estimatedKdv,
          kpis: [
            { l: 'Bekleyen E-Fatura Toplamı', v: `${(totalInvoiceAmount / 100).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺`, t: `${invoiceOrders.length} İşlem` },
            { l: 'Hesaplanan Toplam KDV (%20)', v: `${(totalKdv / 100).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺`, t: 'Ödenecek Vergi' },
            { l: 'Net Hizmet Matrahı', v: `${(totalBase / 100).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺`, t: 'Platform Net Karı' },
          ],
          columns: ['Sipariş ID', 'Müşteri Bilgileri', 'Matrah', 'KDV', 'Fatura Toplamı', 'Durum', 'Sipariş Tarihi'],
          details: detailsList
        }
      }
    };
  }

  const kpis = mockData?.payload?.stats?.kpis || data?.payload?.stats?.kpis || staticData?.kpis || [];
  const columns = mockData?.payload?.stats?.columns || data?.payload?.stats?.columns || [];
  const details = mockData?.payload?.stats?.details || data?.payload?.stats?.details || [];

  const [actionableDetails, setActionableDetails] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("Bekleyenler");

  const filteredDetails = actionableDetails.filter(row => {
    // 1. Sekme (Tab) Filtresi
    if (domainKey === 'accounting') {
      if (activeTab === "Bekleyenler" && row.col6 !== 'TASLAK') return false;
      if (activeTab === "Tamamlananlar" && row.col6 !== 'KESİLDİ') return false;
    } else if (domainKey === 'financial') {
      if (activeTab === "Bekleyenler" && (row.col4 === 'ÖDENDİ' || row.col4 === 'ONAYLANDI')) return false;
      if (activeTab === "Tamamlananlar" && (row.col4 !== 'ÖDENDİ' && row.col4 !== 'ONAYLANDI')) return false;
    }

    // 2. Arama Filtresi
    return Object.values(row).some(val => {
      if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
        return JSON.stringify(val).toLowerCase().includes(searchQuery.toLowerCase());
      }
      return String(val).toLowerCase().includes(searchQuery.toLowerCase());
    });
  });

  useEffect(() => {
    setActionableDetails(details);
    setSelectedRows([]);
  }, [ordersData, data, domainKey]); // JSON.stringify(details) yerine doğrudan API referanslarını dinliyoruz.

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(filteredDetails.map((r: any) => r.col1));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedRows(prev => prev.includes(id) ? prev.filter(idx => idx !== id) : [...prev, id]);
  };

  const handlePay = (id: string) => {
    const isAccounting = domainKey === 'accounting';
    const msg = isAccounting 
        ? "Bu faturayı resmileştirmek (kesmek) istediğinize emin misiniz? Bu işlem yasal olarak bağlayıcıdır ve geri alınamaz." 
        : "Bu işlemi onaylamak/ödemek istediğinize emin misiniz?";
    
    if (!window.confirm(msg)) return;

    const newData = [...actionableDetails];
    const index = newData.findIndex(r => r.col1 === id);
    if (index !== -1) {
      newData[index] = { ...newData[index] };
      if (domainKey === 'accounting') newData[index].col6 = 'KESİLDİ';
      else newData[index].col4 = 'ÖDENDİ';
      setActionableDetails(newData);
    }
  };

  const handlePayAll = () => {
    const isAccounting = domainKey === 'accounting';
    const count = selectedRows.length > 0 
      ? selectedRows.length 
      : actionableDetails.filter(r => isAccounting ? r.col6 === 'TASLAK' : (r.col4 === 'BEKLİYOR' || r.col4 === 'TASLAK')).length;
    
    if (count === 0) return;

    const actionText = isAccounting ? "fatura resmileştirilecektir" : "işlem onaylanacaktır/ödenecektir";
    const msg = `⚠️ DİKKAT!\n\nToplam ${count} adet ${actionText}.\n\nBu işlem geri alınamaz. Onaylıyor musunuz?`;
    
    if (!window.confirm(msg)) return;

    if (selectedRows.length > 0) {
      const newData = actionableDetails.map(item => {
        if (selectedRows.includes(item.col1)) {
          const updatedItem = { ...item };
          if (domainKey === 'accounting') updatedItem.col6 = 'KESİLDİ';
          else updatedItem.col4 = 'ÖDENDİ';
          return updatedItem;
        }
        return item;
      });
      setActionableDetails(newData);
      setSelectedRows([]);
    } else {
      const newData = actionableDetails.map(item => {
        if (domainKey === 'accounting' && item.col6 === 'TASLAK') {
          return { ...item, col6: 'KESİLDİ' };
        }
        if (domainKey !== 'accounting' && (item.col4 === 'BEKLİYOR' || item.col4 === 'TASLAK')) {
          return { ...item, col4: 'ÖDENDİ' };
        }
        return item;
      });
      setActionableDetails(newData);
    }
  };

  if (!staticData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#050505] flex items-center justify-center text-gray-900 dark:text-white font-sans transition-colors">
        <div className="text-center">
          <h1 className="text-3xl font-black mb-4">Modül Bulunamadı</h1>
          <p className="text-gray-500 dark:text-white/40 mb-8">Bu sistem modülü henüz aktif değil veya geçersiz bir bağlantı.</p>
          <Link href="/dashboard/sysop" className="px-6 py-3 rounded-xl bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 transition-colors font-bold text-sm">
            Kontrol Merkezine Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-white font-sans p-2 lg:p-4 transition-colors">
      
      <div className="w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-6">
            <Link href="/dashboard/sysop" className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center group hover:bg-gray-100 dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none">
              <ArrowLeft01Icon size={20} className="text-gray-500 dark:text-white/60 group-hover:text-gray-900 dark:group-hover:text-white" />
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">{staticData.title}</h1>
              <p className="text-xs font-medium text-gray-500 dark:text-white/40 mt-0.5">{staticData.desc}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="h-10 px-4 rounded-xl border border-gray-200 dark:border-white/10 flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors bg-white dark:bg-transparent shadow-sm dark:shadow-none">
              <Download01Icon size={16} /> Rapor İndir
            </button>
            <button 
              className="h-10 px-4 rounded-xl text-white flex items-center gap-2 text-xs font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
              style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
            >
              <AnalyticsUpIcon size={16} /> AI Optimize Et
            </button>
          </div>
        </div>
        
        <div className="w-full">
        
        {domainKey === 'accounting' && mockData?.payload?.stats?.estimatedKdv !== undefined && (
          <div className="mb-4 bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/10 rounded-xl p-3 flex items-center gap-3 text-sm text-blue-800 dark:text-blue-300 shadow-sm dark:shadow-none">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 flex-shrink-0">
              <AnalyticsUpIcon size={16} className="text-blue-600 dark:text-blue-400" />
            </span>
            <p className="leading-snug">
              <strong>Yapay Zeka Projeksiyonu:</strong> Bu ay sonu tahmini KDV yükümlülüğünüz: <strong>{mockData.payload.stats.estimatedKdv.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺</strong>
            </p>
          </div>
        )}

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="bg-white dark:bg-[#0A0A0B] border border-gray-200 dark:border-white/5 rounded-xl p-4 h-24 animate-pulse shadow-sm dark:shadow-none" />
            ))
          ) : (
            kpis.map((kpi: any, idx: number) => (
              <div key={idx} className="bg-white dark:bg-[#0A0A0B] border border-gray-200 dark:border-white/5 rounded-xl p-4 flex flex-col h-full relative overflow-hidden group hover:border-gray-300 dark:hover:border-white/10 transition-colors shadow-sm dark:shadow-none">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-100 dark:bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-xs font-bold text-gray-400 dark:text-white/40 uppercase tracking-widest mb-2 z-10 relative">{kpi.l}</span>
                <div className="flex items-end justify-between gap-4 mt-auto z-10 relative">
                  <span className="text-3xl font-black tracking-tighter text-gray-900 dark:text-white truncate">{kpi.v}</span>
                  <span className="text-[11px] font-bold whitespace-nowrap flex-shrink-0 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-400/10 border border-emerald-100 dark:border-transparent px-2.5 py-1 rounded-md">{kpi.t}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Big Chart Area / Data Table */}
        {details.length > 0 ? (
          <div className="flex-1 bg-white dark:bg-[#0A0A0B] border border-gray-200 dark:border-white/5 rounded-xl overflow-hidden shadow-sm dark:shadow-none mt-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 py-3 border-b border-gray-200 dark:border-white/10">
              <div className="flex items-center gap-4">
                <h3 className="font-bold text-gray-900 dark:text-white">
                  {domainKey === 'financial' ? 'Son Finansal Çıkış İşlemleri' : domainKey === 'risk' ? 'Son Risk ve Hata Kayıtları' : domainKey === 'accounting' ? 'E-Fatura Onay Kuyruğu' : 'Detaylı İşlem Tablosu'}
                </h3>
                {(domainKey === 'accounting' || domainKey === 'financial') && (
                  <div className="flex items-center bg-gray-100 dark:bg-white/5 rounded-lg p-1">
                    <button 
                      onClick={() => setActiveTab('Bekleyenler')} 
                      className={`px-3 py-1.5 text-[11px] font-bold rounded-md transition-all ${activeTab === 'Bekleyenler' ? 'bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/60'}`}
                    >
                      {domainKey === 'accounting' ? 'Taslaklar' : 'Bekleyenler'}
                    </button>
                    <button 
                      onClick={() => setActiveTab('Tamamlananlar')} 
                      className={`px-3 py-1.5 text-[11px] font-bold rounded-md transition-all ${activeTab === 'Tamamlananlar' ? 'bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/60'}`}
                    >
                      {domainKey === 'accounting' ? 'Kesilen Faturalar' : 'Tamamlananlar'}
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search01Icon size={16} />
                  </span>
                  <input
                    type="text"
                    placeholder="Tabloda ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-white"
                  />
                </div>
                {activeTab === 'Bekleyenler' && ((domainKey === 'financial' && actionableDetails.some(r => r.col4 === 'BEKLİYOR' || r.col4 === 'TASLAK')) || (domainKey === 'accounting' && actionableDetails.some(r => r.col6 === 'TASLAK'))) ? (
                  <button 
                    onClick={handlePayAll}
                    className="px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm shadow-emerald-500/20 active:scale-95 whitespace-nowrap"
                    style={{ backgroundColor: '#059669', color: '#ffffff' }}
                  >
                    {selectedRows.length > 0 
                      ? `Seçilenleri ${domainKey === 'accounting' ? 'Resmileştir' : 'Öde / Onayla'} (${selectedRows.length})` 
                      : (domainKey === 'accounting' ? 'Tüm Faturaları Resmileştir' : 'Tümünü Öde / Onayla')}
                  </button>
                ) : null}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/40 font-medium">
                    {(domainKey === 'financial' || domainKey === 'accounting') && (
                      <th className="px-3 py-2 w-8">
                        <input 
                          type="checkbox" 
                          checked={selectedRows.length === filteredDetails.length && filteredDetails.length > 0}
                          onChange={handleSelectAll}
                          className="w-3.5 h-3.5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                      </th>
                    )}
                    {columns.map((col: string, i: number) => (
                      <th key={i} className="px-3 py-2">{col}</th>
                    ))}
                    {domainKey === 'accounting' ? <th className="px-3 py-2 text-right">Aksiyon</th> : domainKey === 'financial' ? <th className="px-3 py-2 text-right">Aksiyon</th> : null}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {filteredDetails.map((row: any, i: number) => (
                    <tr key={row.col1 || i} className={`hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group ${selectedRows.includes(row.col1) ? 'bg-emerald-50/30 dark:bg-emerald-500/5' : ''}`}>
                      {(domainKey === 'financial' || domainKey === 'accounting') && (
                        <td className="px-3 py-1.5">
                          <input 
                            type="checkbox" 
                            checked={selectedRows.includes(row.col1)}
                            onChange={() => handleSelectRow(row.col1)}
                            className="w-3.5 h-3.5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                          />
                        </td>
                      )}
                      <td className="px-3 py-1.5 font-medium text-gray-900 dark:text-white">{row.col1}</td>
                      <td className="px-3 py-1.5 text-gray-500 dark:text-white/60">
                        {typeof row.col2 === 'object' && row.col2 !== null ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-bold text-gray-800 dark:text-gray-200">TC: {row.col2.tc}</span>
                            <span className="text-[9px] truncate w-40" title={row.col2.email}>{row.col2.email}</span>
                            <span className="text-[9px] truncate w-40 text-gray-400" title={row.col2.address}>{row.col2.address}</span>
                          </div>
                        ) : (
                          row.col2
                        )}
                      </td>
                      <td className="px-3 py-1.5 font-bold text-gray-900 dark:text-white">{row.col3}</td>
                      <td className="px-3 py-1.5">
                        {domainKey === 'accounting' ? (
                          <span className="font-black text-gray-900 dark:text-white">{row.col4}</span>
                        ) : (
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            row.col4.includes('ONAYLANDI') || row.col4.includes('ÖDENDİ') || row.col4.includes('Düşük') ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 
                            row.col4.includes('BEKLİYOR') || row.col4.includes('Orta') ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400' : 
                            row.col4.includes('YÜKSEK') ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400' :
                            'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/60'
                          }`}>
                            {row.col4}
                          </span>
                        )}
                      </td>
                      
                      {domainKey === 'accounting' ? (
                        <td className="px-3 py-1.5 font-black text-gray-900 dark:text-white">{row.col5}</td>
                      ) : null}

                      <td className="px-3 py-1.5">
                        {domainKey === 'accounting' ? (
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                            row.col6 === 'KESİLDİ' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400'
                          }`}>
                            {row.col6}
                          </span>
                        ) : (
                          <span className="text-gray-400 dark:text-white/40 text-right">{row.col5}</span>
                        )}
                      </td>
                      {domainKey === 'accounting' ? (
                        <td className="px-3 py-1.5 text-gray-400 dark:text-white/40 text-right">{row.col7}</td>
                      ) : null}
                      
                      {(domainKey === 'financial' || domainKey === 'accounting') && (
                        <td className="px-3 py-1.5 text-right">
                          {(row.col4 === 'BEKLİYOR' || row.col4 === 'TASLAK' || row.col6 === 'TASLAK') ? (
                            <button 
                              onClick={(e) => { e.stopPropagation(); handlePay(row.col1); }}
                              className="px-3 py-1 rounded text-[9px] font-bold transition-all shadow-sm uppercase tracking-wider active:scale-95"
                              style={{ backgroundColor: '#10b981', color: '#ffffff' }}
                            >
                              {domainKey === 'accounting' ? 'Resmileştir' : 'ÖDE'}
                            </button>
                          ) : (
                            <span className="text-[9px] text-emerald-600 dark:text-emerald-500 font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded">Tamamlandı</span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex-1 border border-dashed border-gray-300 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center text-gray-400 dark:text-white/20 py-20 mt-12">
            <AnalyticsUpIcon size={48} className="mb-4 opacity-50" />
            <span className="font-bold uppercase tracking-widest text-sm text-gray-500 dark:text-white/40">Grafik Verileri Yükleniyor...</span>
            <span className="text-xs mt-2 max-w-sm text-center">Bu alan Recharts kullanılarak gerçek zamanlı veya mock verilerle doldurulacaktır. İlgili alana ait Trendler, Anomali Tespitleri ve Tahminlemeler (Forecast) burada gösterilecektir.</span>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
