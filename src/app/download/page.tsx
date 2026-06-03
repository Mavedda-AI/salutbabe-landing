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
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-black text-center tracking-tight mb-8 leading-[1.1]">
          Sürdürülebilir bebek <br />
          <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">
            modasına katılın.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 text-center max-w-2xl mx-auto mb-16 font-light leading-relaxed">
          SalutBabe ile kullanmadığınız bebek eşyalarına ikinci bir şans verin veya ihtiyacınız olanları güvenle keşfedin. iOS ve Android'de yayında.
        </p>

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
