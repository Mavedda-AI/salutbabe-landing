'use client';

import React, {Suspense, useEffect, useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {apiUrl} from '@/lib/api';
import {ArrowLeft, MapPin, MoreHorizontal, Package, Phone, Share} from 'lucide-react';

interface TrackingEvent {
  status: string;
  location: string;
  date: string;
  description: string;
}

interface TrackingData {
  barno?: string;
  status: string;
  description: string;
  history: TrackingEvent[];
  timestamp: string;
  alici?: string;
  gonderen?: string;
  destination?: string;
  weight?: string;
}

function parseDateTime(dateStr: string) {
  // Try to split "DD/MM/YYYY HH:mm:ss" or similar
  if (!dateStr) return { date: '', time: '' };
  const parts = dateStr.split(' ');
  if (parts.length >= 2) {
    // parts[0] = DD/MM/YYYY
    // parts[1] = HH:mm:ss
    const dateParts = parts[0].split('/');
    let formattedDate = parts[0];
    if (dateParts.length === 3) {
      const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
      const mIndex = parseInt(dateParts[1], 10) - 1;
      formattedDate = `${parseInt(dateParts[0], 10)} ${months[mIndex]}`;
    }
    const timeParts = parts[1].split(':');
    const formattedTime = timeParts.length >= 2 ? `${timeParts[0]}:${timeParts[1]}` : parts[1];
    return { date: formattedDate, time: formattedTime };
  }
  return { date: dateStr, time: '' };
}

function TrackingContent() {
  const searchParams = useSearchParams();
  const trackingNumber = searchParams.get('trackingNumber') || searchParams.get('code');
  const company = searchParams.get('company') || 'ptt'; // defaulting to ptt for backward compatibility
  
  const [data, setData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!trackingNumber) {
      setLoading(false);
      return;
    }

    const fetchTracking = async () => {
      try {
        const response = await fetch(apiUrl(`/order/public-tracking/${trackingNumber}`));
        if (!response.ok) {
          throw new Error('Kargo bilgisi bulunamadı.');
        }
        const result = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Kargo bilgisi alınamadı.');
      } finally {
        setLoading(false);
      }
    };

    fetchTracking();
  }, [trackingNumber, company]);

  if (!trackingNumber || error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8F9FA] p-4 text-center">
        <Package className="w-16 h-16 text-gray-300 mb-4" />
        <h1 className="text-xl font-bold text-gray-900 mb-2">Kargo Bulunamadı</h1>
        <p className="text-gray-500 max-w-sm">
          {error || 'Lütfen geçerli bir kargo takip numarası girin.'}
        </p>
      </div>
    );
  }

  const isDelivered = data.status.toLowerCase().includes('teslim');
  const isOutForDelivery = data.status.toLowerCase().includes('dağıtım');
  
  let statusColor = 'text-[#8854C0]'; // Default purple
  let statusText = 'İşlemde';
  
  if (isDelivered) {
    statusColor = 'text-emerald-500';
    statusText = 'Teslim Edildi';
  } else if (isOutForDelivery) {
    statusColor = 'text-blue-500';
    statusText = 'Dağıtımda';
  }

  // Generate fake estimated delivery based on first event if we don't have one
  let estimatedDelivery = 'Belirsiz';
  if (data.history && data.history.length > 0) {
     const lastEventDate = data.history[data.history.length - 1].date;
     const parsed = parseDateTime(lastEventDate);
     if (parsed.date) {
         estimatedDelivery = parsed.date; // Use the date of the latest event or similar
     }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] relative flex flex-col font-sans items-center">
      
      {/* Top Navigation */}
      <div className="w-full max-w-xl flex justify-between items-center px-4 pt-6 z-10">
         <button className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors">
            <ArrowLeft className="w-5 h-5" />
         </button>
         <h2 className="font-bold text-gray-900">Kargo Takibi</h2>
         <button className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors">
            <MoreHorizontal className="w-5 h-5" />
         </button>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-xl bg-white rounded-3xl mt-6 flex-1 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 px-6 pt-8 pb-12 mb-8">

        {/* Header Section */}
        <div className="flex items-center justify-between mb-8 mt-2">
          <div className="flex items-center gap-4">
             {/* Logo Box */}
             <div className="w-14 h-14 bg-[#FDE68A] rounded-2xl flex items-center justify-center shadow-sm">
                <span className="font-black text-[#92400E] text-xl tracking-tighter">{company.toUpperCase()}</span>
             </div>
             <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">#{data.barno || trackingNumber}</h1>
                <p className="text-sm text-gray-500 font-medium mt-0.5">{company.toUpperCase()} Kargo</p>
             </div>
          </div>
          
          <div className="flex gap-2">
             <button className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
                <Share className="w-4 h-4" />
             </button>
             <button className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
                <Phone className="w-4 h-4" />
             </button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
           <div>
              <p className="text-xs text-gray-400 font-medium mb-1.5">Gönderen</p>
              <p className="text-sm font-bold text-gray-900 truncate" title={data.gonderen || 'Bilinmiyor'}>{data.gonderen || 'Bilinmiyor'}</p>
           </div>
           <div>
              <p className="text-xs text-gray-400 font-medium mb-1.5">Alıcı</p>
              <p className="text-sm font-bold text-gray-900 truncate" title={data.alici || 'Bilinmiyor'}>{data.alici || 'Bilinmiyor'}</p>
           </div>
           <div>
              <p className="text-xs text-gray-400 font-medium mb-1.5">Varış Merkezi</p>
              <p className="text-sm font-bold text-gray-900 truncate" title={data.destination || 'Belirsiz'}>{data.destination || 'Belirsiz'}</p>
           </div>
           <div>
              <p className="text-xs text-gray-400 font-medium mb-1.5">Ağırlık / Desi</p>
              <p className="text-sm font-bold text-gray-900">{data.weight || '-'}</p>
           </div>
           <div>
              <p className="text-xs text-gray-400 font-medium mb-1.5">Tahmini Teslimat</p>
              <p className="text-sm font-bold text-[#8854C0]">{estimatedDelivery}</p>
           </div>
           <div>
              <p className="text-xs text-gray-400 font-medium mb-1.5">Durum</p>
              <p className={`text-sm font-bold ${statusColor}`}>{statusText}</p>
           </div>
        </div>

        <div className="h-px bg-gray-100 w-full mb-8"></div>

        {/* Delivery History Timeline */}
        <h2 className="text-lg font-bold text-gray-900 mb-6">Hareket Dökümü</h2>
        
        <div className="relative">
           {data.history && data.history.length > 0 ? (
              <div className="flex flex-col">
                 {[...data.history].reverse().map((event, i) => {
                    const isFirst = i === 0;
                    const isLast = i === data.history.length - 1;
                    const parsed = parseDateTime(event.date);
                    
                    const textContent = event.status || event.description || 'Kargo Hareketi';
                    const hasDetail = event.description && event.description !== event.status;
                    
                    return (
                       <div key={i} className="flex relative min-h-[5rem]">
                          {/* Date & Time Left Column */}
                          <div className="w-16 flex flex-col items-start pt-1 pr-4 shrink-0">
                             <span className="text-sm font-bold text-gray-900 leading-tight">{parsed.date}</span>
                             <span className="text-xs text-gray-400 font-medium mt-1">{parsed.time}</span>
                          </div>
                          
                          {/* Timeline Line & Dot */}
                          <div className="flex flex-col items-center relative mr-5">
                             <div className={`w-4 h-4 rounded-full border-2 bg-white flex-shrink-0 z-10 ${isFirst ? 'border-[#8854C0] ring-4 ring-[#8854C0]/20' : 'border-[#D1D5DB]'}`}>
                                {isFirst && <div className="w-2 h-2 bg-[#8854C0] rounded-full m-0.5"></div>}
                             </div>
                             {!isLast && (
                                <div className={`w-0.5 h-full absolute top-4 ${isFirst ? 'bg-[#8854C0]' : 'bg-[#E5E7EB]'}`}></div>
                             )}
                          </div>
                          
                          {/* Content Right Column */}
                          <div className="flex-1 pt-0.5 pb-8">
                             <p className={`text-sm ${isFirst ? 'font-semibold text-gray-900' : 'font-medium text-gray-600'}`}>
                                {textContent}
                             </p>
                             {event.location && (
                                <p className="text-xs text-gray-400 font-medium mt-1.5 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {event.location}
                                </p>
                             )}
                             {hasDetail && (
                                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed bg-gray-50 p-2 rounded-lg border border-gray-100">
                                   {event.description}
                                </p>
                             )}
                          </div>
                       </div>
                    );
                 })}
              </div>
           ) : (
              <p className="text-sm text-gray-500 text-center py-4">Kargo hareketleri bekleniyor.</p>
           )}
        </div>

      </div>
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
         <div className="w-10 h-10 border-4 border-gray-200 border-t-[#8854C0] rounded-full animate-spin"></div>
      </div>
    }>
      <div className="absolute top-0 left-0 w-full p-6 z-30 flex justify-center pointer-events-none">
        <img src="/logo-text.png" alt="salutbabe" className="h-6 object-contain opacity-90 filter drop-shadow-sm" />
      </div>
      <TrackingContent />
    </Suspense>
  );
}
