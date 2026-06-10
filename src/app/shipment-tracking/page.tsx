'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiUrl } from '@/lib/api';
import { Package, Truck, CheckCircle, MapPin, Search, Calendar, Info, ShieldCheck, ChevronRight } from 'lucide-react';

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#E31C5F]/20 to-purple-500/20 rounded-full animate-pulse blur-xl"></div>
          <div className="relative w-full h-full bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100">
            <Search className="w-10 h-10 text-[#E31C5F]" />
          </div>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-3">Kargo Kodu Gerekli</h1>
        <p className="text-gray-500 text-lg max-w-md leading-relaxed">
          Siparişinizi takip etmek için lütfen size iletilen kargo kodunu kullanarak tekrar deneyin.
        </p>
      </div>
    );
  }

  if (loading || !mounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-tr from-[#E31C5F]/10 to-blue-500/10 rounded-full blur-3xl"></div>
        <div className="relative flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-gray-100 border-t-[#E31C5F] rounded-full animate-spin mb-6 shadow-sm"></div>
          <p className="text-gray-600 font-medium tracking-wide animate-pulse">Sistemle bağlantı kuruluyor...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 bg-red-500/20 rounded-full animate-pulse blur-xl"></div>
          <div className="relative w-full h-full bg-white rounded-full flex items-center justify-center shadow-lg border border-red-100">
            <Package className="w-10 h-10 text-red-500" />
          </div>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-3">Kargo Bulunamadı</h1>
        <p className="text-gray-500 text-lg max-w-md mb-8 leading-relaxed">
          {error || 'Girdiğiniz kargo takip koduna ait bilgi bulunamadı.'}
        </p>
        <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-200 text-gray-600 flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Takip Kodunuz</span>
          <span className="font-mono font-medium text-gray-900 bg-gray-50 px-2 py-1 rounded-md">{code}</span>
        </div>
      </div>
    );
  }

  // Icon Helper
  const getStatusIcon = (status: string, index: number, isFirst: boolean) => {
    const s = status.toLowerCase();
    if (s.includes('teslim')) return <CheckCircle className={`w-5 h-5 ${isFirst ? 'text-white' : 'text-green-500'}`} />;
    if (s.includes('dağıtım')) return <Truck className={`w-5 h-5 ${isFirst ? 'text-white' : 'text-blue-500'}`} />;
    if (isFirst) return <MapPin className="w-5 h-5 text-white" />;
    return <div className="w-2.5 h-2.5 bg-gray-300 rounded-full" />;
  };

  const isDelivered = data.status.toLowerCase().includes('teslim');
  const isOutForDelivery = data.status.toLowerCase().includes('dağıtım');

  // Gradient based on status
  const statusGradient = isDelivered 
    ? 'from-emerald-500 to-green-400' 
    : isOutForDelivery 
      ? 'from-blue-500 to-cyan-400' 
      : 'from-[#E31C5F] to-pink-500';

  const statusBgSoft = isDelivered 
    ? 'bg-emerald-50' 
    : isOutForDelivery 
      ? 'bg-blue-50' 
      : 'bg-[#E31C5F]/5';

  const statusText = isDelivered 
    ? 'text-emerald-700' 
    : isOutForDelivery 
      ? 'text-blue-700' 
      : 'text-[#E31C5F]';

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 relative z-10">
      
      {/* Dynamic Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#E31C5F]/5 to-transparent pointer-events-none -z-10 blur-3xl"></div>

      {/* Hero / Header Card */}
      <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 mb-8 relative overflow-hidden transition-all duration-500 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)]">
        
        {/* Decorative Graphic */}
        <div className="absolute -right-12 -top-12 opacity-[0.03] pointer-events-none transform rotate-12 transition-transform duration-700 hover:rotate-6 hover:scale-105">
          <Package className="w-96 h-96" />
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${statusBgSoft} ${statusText} text-xs font-bold uppercase tracking-widest`}>
              {isDelivered ? <CheckCircle className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
              PTT Kargo
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-white/60 px-4 py-2 rounded-full border border-gray-100">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span>Güvenli Takip</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r text-gray-900 mb-4 pb-1"
              style={{ backgroundImage: `linear-gradient(to right, #111827, #374151)` }}>
            {isDelivered ? 'Kargonuz Teslim Edildi' : isOutForDelivery ? 'Kargonuz Dağıtımda' : 'Kargonuz Yolda'}
          </h1>
          
          <div className="flex items-center gap-3 mb-8">
            <span className="text-gray-500 font-medium">Takip Kodu:</span>
            <span className="font-mono text-lg font-bold text-gray-900 bg-gray-100/80 px-3 py-1 rounded-lg border border-gray-200/50">
              {data.barno || code}
            </span>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gray-900 text-white p-5 md:p-6 shadow-xl">
            <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${statusGradient}`}></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="flex items-start gap-4 relative z-10">
              <div className="bg-white/10 p-2.5 rounded-xl shrink-0 mt-0.5">
                <Info className="w-5 h-5 text-white/90" />
              </div>
              <div>
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-1.5">Güncel Durum</p>
                <p className="text-white/90 font-medium leading-relaxed">
                  {(!data.description || data.description.trim() === 'PTT:' || data.description.trim() === 'PTT: -') 
                    ? 'Kargonuz yolda, hareket detayları merkezden güncelleniyor.' 
                    : data.description.replace('PTT: ', '')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Hareket Dökümü</h2>
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Son Güncelleme: {new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute:'2-digit' })}</span>
          </div>
        </div>
        
        {data.history && data.history.length > 0 ? (
          <div className="relative pl-4 md:pl-0">
            {/* Main Timeline Line */}
            <div className="absolute top-8 bottom-8 left-[23px] md:left-[39px] w-[2px] bg-gradient-to-b from-gray-200 via-gray-100 to-transparent rounded-full"></div>

            {[...data.history].reverse().map((event, i) => {
              const isFirstInList = i === 0;
              const isLastInList = i === data.history.length - 1;
              
              const statusText = event.status || event.description || 'Kargo Hareketi';
              const showDescription = event.description && event.description !== event.status && event.description.length > 3;
              
              return (
                <div key={i} className={`relative flex items-start gap-6 md:gap-8 ${isLastInList ? 'pb-0' : 'pb-10'} group`}>
                  
                  {/* Timeline Node */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className={`w-12 h-12 md:w-20 md:h-20 rounded-2xl flex items-center justify-center shadow-sm transition-all duration-300 ${
                      isFirstInList 
                        ? `bg-gradient-to-br ${statusGradient} shadow-md scale-110` 
                        : 'bg-white border-2 border-gray-100 group-hover:border-gray-200 group-hover:scale-105'
                    }`}>
                      {isFirstInList && (
                         <div className="absolute -inset-2 bg-gradient-to-br from-[#E31C5F]/20 to-pink-500/20 rounded-3xl blur-md -z-10"></div>
                      )}
                      {getStatusIcon(event.status, i, isFirstInList)}
                    </div>
                  </div>
                  
                  {/* Content Box */}
                  <div className={`flex-1 pt-1 md:pt-3 transition-all duration-300 ${isFirstInList ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                    <div className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                        <h3 className={`font-bold text-lg ${isFirstInList ? 'text-gray-900' : 'text-gray-800'}`}>
                          {statusText}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs md:text-sm font-medium text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg w-fit">
                          <Calendar className="w-3.5 h-3.5" />
                          {event.date}
                        </div>
                      </div>
                      
                      {event.location && (
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2 mt-3">
                          <div className="bg-gray-100 p-1 rounded-md">
                            <MapPin className="w-3.5 h-3.5 text-gray-500" />
                          </div>
                          {event.location}
                        </div>
                      )}
                      
                      {showDescription && (
                        <div className="mt-3 text-sm text-gray-500 leading-relaxed bg-gray-50/50 p-3 rounded-xl border border-gray-100/50">
                          {event.description}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-4">
              <Truck className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Kargo Bekleniyor</h3>
            <p className="text-gray-500 max-w-sm">
              Siparişinize ait hareket bilgileri sisteme yansıdığında burada listelenecektir.
            </p>
          </div>
        )}
      </div>
      
      {/* Footer minimal */}
      <div className="mt-8 text-center flex items-center justify-center gap-2 text-sm text-gray-400 font-medium">
        <span>Powered by</span>
        <span className="text-gray-900 font-bold tracking-tight">salutbabe.</span>
      </div>
    </div>
  );
}

export default function TrackingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-[#E31C5F]/20">
      {/* Premium Navbar */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-center">
          <div className="text-[#E31C5F] font-black text-2xl tracking-tighter hover:scale-105 transition-transform cursor-pointer">
            salutbabe.
          </div>
        </div>
      </header>

      <main className="relative overflow-hidden">
        {/* Subtle background patterns */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
        
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center min-h-[80vh] relative z-10">
            <div className="w-16 h-16 border-4 border-gray-100 border-t-[#E31C5F] rounded-full animate-spin mb-6 shadow-sm"></div>
          </div>
        }>
          <TrackingContent />
        </Suspense>
      </main>
    </div>
  );
}
