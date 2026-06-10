'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiUrl } from '@/lib/api';
import { Package, Truck, CheckCircle, MapPin, Search } from 'lucide-react';

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
          throw new Error('Kargo bulunamadı veya sistemde geçici bir hata oluştu.');
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

  if (!code) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
        <div className="w-20 h-20 bg-[#E31C5F]/10 rounded-full flex items-center justify-center mb-6">
          <Search className="w-10 h-10 text-[#E31C5F]" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Kargo Kodu Gerekli</h1>
        <p className="text-gray-500 max-w-md">Lütfen takip etmek istediğiniz kargonun kodunu bağlantıya ekleyerek tekrar deneyin.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-[#E31C5F]/20 border-t-[#E31C5F] rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium animate-pulse">Kargo durumunuz sorgulanıyor...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <Package className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Kargo Bulunamadı</h1>
        <p className="text-gray-500 max-w-md mb-6">{error || 'Girdiğiniz kargo takip koduna ait bilgi bulunamadı.'}</p>
        <div className="bg-gray-50 px-6 py-3 rounded-xl border border-gray-100 text-sm font-mono text-gray-600">
          Takip Kodu: {code}
        </div>
      </div>
    );
  }

  // Helper to determine icon based on status
  const getStatusIcon = (status: string, index: number, isLast: boolean) => {
    const s = status.toLowerCase();
    if (s.includes('teslim')) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (s.includes('dağıtım')) return <Truck className="w-5 h-5 text-blue-500" />;
    if (isLast) return <MapPin className="w-5 h-5 text-[#E31C5F]" />;
    return <div className="w-3 h-3 bg-gray-300 rounded-full" />;
  };

  const isDelivered = data.status.toLowerCase().includes('teslim');
  const isOutForDelivery = data.status.toLowerCase().includes('dağıtım');

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
      {/* Header Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Truck className="w-48 h-48" />
        </div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold uppercase tracking-wider mb-4">
            <Package className="w-4 h-4" />
            PTT Kargo
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isDelivered ? 'Kargonuz Teslim Edildi' : isOutForDelivery ? 'Kargonuz Dağıtımda' : 'Kargonuz Yolda'}
          </h1>
          
          <p className="text-gray-500 mb-6">
            Takip Kodu: <span className="font-mono font-medium text-gray-900">{data.barno || code}</span>
          </p>

          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <p className="text-sm text-gray-600">
              <strong className="text-gray-900 font-semibold block mb-1">Son Durum</strong>
              {data.description}
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-8">Hareket Dökümü</h2>
        
        {data.history && data.history.length > 0 ? (
          <div className="space-y-0 relative">
            {/* Timeline Line */}
            <div className="absolute top-4 bottom-4 left-6 md:left-[2.1rem] w-px bg-gray-200"></div>

            {[...data.history].reverse().map((event, i) => {
              const isFirstInList = i === 0; // Most recent
              const isLastInList = i === data.history.length - 1; // Oldest
              
              return (
                <div key={i} className="relative flex items-start gap-4 md:gap-6 py-4">
                  <div className={`relative z-10 flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center ${isFirstInList ? 'bg-[#E31C5F]/10' : 'bg-gray-50 border border-gray-100'}`}>
                    {getStatusIcon(event.status, i, isFirstInList)}
                  </div>
                  
                  <div className="flex-1 pt-1 md:pt-2">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 md:gap-4 mb-1">
                      <h3 className={`font-semibold ${isFirstInList ? 'text-[#E31C5F]' : 'text-gray-900'}`}>
                        {event.status}
                      </h3>
                      <span className="text-xs md:text-sm text-gray-500 font-medium whitespace-nowrap">
                        {event.date}
                      </span>
                    </div>
                    
                    {event.location && (
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {event.location}
                      </div>
                    )}
                    
                    {event.description && event.description !== event.status && (
                      <p className="text-sm text-gray-500 leading-relaxed mt-1">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Henüz hareket bilgisi girilmemiş veya kargo bekleniyor.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackingPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Navbar Minimal */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-center">
          <div className="text-[#E31C5F] font-black text-2xl tracking-tighter">salutbabe.</div>
        </div>
      </header>

      <main>
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <div className="w-12 h-12 border-4 border-[#E31C5F]/20 border-t-[#E31C5F] rounded-full animate-spin mb-4"></div>
          </div>
        }>
          <TrackingContent />
        </Suspense>
      </main>
    </div>
  );
}
