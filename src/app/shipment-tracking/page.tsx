'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiUrl } from '@/lib/api';
import { Share, Phone, MapPin, Package, ArrowLeft, MoreHorizontal } from 'lucide-react';

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
  const code = searchParams.get('code');
  const [data, setData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!code) {
      setLoading(false);
      return;
    }

    const fetchTracking = async () => {
      try {
        const response = await fetch(apiUrl(`/order/public-tracking/${code}`));
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
  }, [code]);

  if (!code || error || !data) {
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
    <div className="min-h-screen bg-[#F0F2F5] relative flex flex-col font-sans">
      
      {/* Map Placeholder Background */}
      <div className="absolute top-0 left-0 right-0 h-[45vh] bg-[#E8EAEE] overflow-hidden">
        {/* Fake Map Pattern */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#9CA3AF 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        
        {/* Nav Buttons over map */}
        <div className="absolute top-6 left-4 right-4 flex justify-between z-10">
           <button className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-700">
              <ArrowLeft className="w-5 h-5" />
           </button>
           <button className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-700">
              <MoreHorizontal className="w-5 h-5" />
           </button>
        </div>

        {/* Fake Map Route Line */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm h-32">
          <svg width="100%" height="100%" viewBox="0 0 200 100" preserveAspectRatio="none">
             <path d="M 40,80 Q 100,20 160,40" fill="none" stroke="#8854C0" strokeWidth="2" strokeDasharray="4,4" />
             <circle cx="40" cy="80" r="4" fill="#8854C0" />
             <circle cx="160" cy="40" r="4" fill="#60A5FA" />
          </svg>
        </div>
      </div>

      {/* Main Card (Pull up over map) */}
      <div className="relative z-20 mt-[35vh] bg-white rounded-t-[2.5rem] flex-1 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] px-6 pt-8 pb-12">
        
        {/* Handle bar for bottom sheet look */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-gray-200 rounded-full"></div>

        {/* Header Section */}
        <div className="flex items-center justify-between mb-8 mt-2">
          <div className="flex items-center gap-4">
             {/* Logo Box */}
             <div className="w-14 h-14 bg-[#FDE68A] rounded-2xl flex items-center justify-center shadow-sm">
                <span className="font-black text-[#92400E] text-xl tracking-tighter">PTT</span>
             </div>
             <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">#{data.barno || code}</h1>
                <p className="text-sm text-gray-500 font-medium mt-0.5">PTT Kargo</p>
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
              <p className="text-xs text-gray-400 font-medium mb-1.5">Tahmini Teslimat</p>
              <p className="text-sm font-bold text-gray-900">{estimatedDelivery}</p>
           </div>
           <div>
              <p className="text-xs text-gray-400 font-medium mb-1.5">Durum</p>
              <p className={`text-sm font-bold ${statusColor}`}>{statusText}</p>
           </div>
           {/* In public API we don't have sender/receiver addresses, so we skip From/To to keep it clean, or put placeholders. Let's omit them to keep real data only. */}
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
