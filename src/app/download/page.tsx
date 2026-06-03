import React from 'react';
import { AppleIcon, PlayStoreIcon, QrCodeIcon } from 'hugeicons-react';

export const metadata = {
  title: 'Download SalutBabe | App Store & Google Play',
  description: 'Download the SalutBabe mobile app to buy and sell pre-loved baby items with ease.',
};

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-white font-[family-name:var(--font-inter)] selection:bg-[var(--color-primary)] selection:text-white">
      
      {/* 
        A minimal, refined layout. 
        Focus is purely on typography and the call to action.
      */}
      <div className="container mx-auto max-w-5xl px-6 py-20 lg:py-32 flex flex-col items-center justify-center min-h-[85vh]">
        
        {/* Subtle top pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-50 text-gray-500 text-xs font-medium tracking-wide uppercase mb-12 border border-gray-100">
          Mobile App
        </div>

        {/* Minimal Typography Header */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-black text-center tracking-tight mb-6 leading-[1.15]">
          Bebek ve çocuk modasına <br />
          <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">
            ikinci bir şans.
          </span>
        </h1>

        <p className="text-base md:text-lg text-gray-500 text-center max-w-2xl mx-auto mb-16 font-light leading-relaxed">
          SalutBabe ile kullanmadığınız bebek ve çocuk kıyafetlerini satın, bütçenize katkı sağlayın. <br className="hidden md:block"/> Üstelik canlı yayın odalarına katılarak etkileşimli alışverişin tadını çıkarın.
        </p>

        {/* Features Highlights (Minimal Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mx-auto mb-16">
          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-gray-50 border border-gray-100/50 hover:bg-gray-100 transition-colors">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-gray-800 mb-4 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 10.5 5.5-5.5a2 2 0 0 1 2.8 0l4.2 4.2a2 2 0 0 1 0 2.8l-5.5 5.5a2 2 0 0 1-2.8 0l-4.2-4.2a2 2 0 0 1 0-2.8Z"/><path d="m14 6 5.5 5.5a2 2 0 0 1 0 2.8l-2.5 2.5"/></svg>
            </div>
            <h3 className="text-gray-900 font-semibold mb-2">2. El Kıyafetler</h3>
            <p className="text-sm text-gray-500">Bebek ve çocuk kıyafetlerini güvenle alıp satın.</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-gray-50 border border-gray-100/50 hover:bg-gray-100 transition-colors">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-gray-800 mb-4 shadow-sm relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="M10 9l5 3-5 3v-6Z"/></svg>
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
            </div>
            <h3 className="text-gray-900 font-semibold mb-2">Canlı Odalar</h3>
            <p className="text-sm text-gray-500">Canlı yayınlarda ürünleri anında inceleyip, soru sorun.</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-gray-50 border border-gray-100/50 hover:bg-gray-100 transition-colors">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-gray-800 mb-4 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <h3 className="text-gray-900 font-semibold mb-2">Güvenli Ödeme</h3>
            <p className="text-sm text-gray-500">Tüm alışverişlerinizde %100 güvenli ödeme altyapısı.</p>
          </div>
        </div>

        {/* Action Area: App Store & Play Store */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-xl mx-auto mb-20">
          
          <a 
            href="#" 
            className="w-full sm:w-1/2 flex items-center justify-center gap-4 bg-black text-white px-6 py-4 rounded-xl hover:bg-gray-800 transition-colors duration-300"
          >
            <AppleIcon size={32} className="text-white" variant="solid" />
            <div className="text-left text-white">
              <div className="text-[10px] uppercase tracking-widest text-gray-300 mb-0.5">Download on the</div>
              <div className="text-lg font-semibold leading-none text-white">App Store</div>
            </div>
          </a>

          <a 
            href="#" 
            className="w-full sm:w-1/2 flex items-center justify-center gap-4 bg-gray-50 text-black border border-gray-200 px-6 py-4 rounded-xl hover:bg-gray-100 transition-colors duration-300"
          >
            <PlayStoreIcon size={32} className="text-black" variant="solid" />
            <div className="text-left text-black">
              <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-0.5">GET IT ON</div>
              <div className="text-lg font-semibold leading-none text-black">Google Play</div>
            </div>
          </a>
          
        </div>

        {/* Minimal QR Code Display */}
        <div className="flex flex-col items-center justify-center opacity-80 hover:opacity-100 transition-opacity duration-300">
          <div className="p-4 border border-gray-100 rounded-2xl bg-white shadow-sm mb-4">
            <QrCodeIcon size={80} strokeWidth={1} className="text-gray-800" />
          </div>
          <p className="text-xs text-gray-400 font-medium tracking-wide">
            KAMERAYI OKUTUN
          </p>
        </div>

      </div>

    </div>
  );
}
