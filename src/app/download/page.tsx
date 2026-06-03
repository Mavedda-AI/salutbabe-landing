import React from 'react';
import {AppleIcon, PlayStoreIcon, QrCodeIcon, SmartPhone01Icon, StarIcon} from 'hugeicons-react';

export const metadata = {
  title: 'Download SalutBabe App | App Store & Google Play',
  description: 'Download the SalutBabe mobile app to buy and sell pre-loved baby items with ease.',
};

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] font-[family-name:var(--font-inter)] overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-primary)] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-float" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--color-secondary)] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-float" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto max-w-6xl px-4 py-16 lg:py-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">
          
          {/* Content Left */}
          <div className="flex-1 text-center lg:text-left animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold text-sm mb-6 border border-[var(--color-primary)]/20">
              <StarIcon size={16} className="fill-current" />
              <span>4.9 / 5 on the App Store</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[var(--color-text-primary)] mb-6 leading-tight">
              Her Şey Bebekler<br />İçin, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">Tek Bir Yerde.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-[var(--color-text-secondary)] mb-10 max-w-2xl mx-auto lg:mx-0">
              SalutBabe uygulamasını hemen indirin; kullanmadığınız bebek ve çocuk eşyalarını satın veya güvenle ikinci el ürünler alın. Aile bütçenize katkı sağlayın!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
              {/* App Store Button */}
              <a 
                href="#" 
                className="flex items-center gap-3 bg-black hover:bg-gray-900 text-white px-6 py-3.5 rounded-2xl shadow-[var(--shadow-soft)] transition-transform hover:scale-105 active:scale-95 w-full sm:w-auto justify-center group"
              >
                <AppleIcon size={32} className="text-white group-hover:text-gray-200 transition-colors" />
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wider font-semibold opacity-80 leading-none mb-1">Download on the</div>
                  <div className="text-xl font-bold leading-none tracking-tight">App Store</div>
                </div>
              </a>

              {/* Google Play Button */}
              <a 
                href="#" 
                className="flex items-center gap-3 bg-black hover:bg-gray-900 text-white px-6 py-3.5 rounded-2xl shadow-[var(--shadow-soft)] transition-transform hover:scale-105 active:scale-95 w-full sm:w-auto justify-center group"
              >
                <PlayStoreIcon size={32} className="text-white group-hover:text-gray-200 transition-colors" />
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wider font-semibold opacity-80 leading-none mb-1">GET IT ON</div>
                  <div className="text-xl font-bold leading-none tracking-tight">Google Play</div>
                </div>
              </a>
            </div>

            {/* QR Code Section */}
            <div className="flex items-center justify-center lg:justify-start gap-6 bg-white/60 backdrop-blur-md p-4 rounded-3xl border border-white shadow-sm w-fit mx-auto lg:mx-0">
              <div className="bg-white p-2 rounded-2xl shadow-sm">
                <QrCodeIcon size={64} className="text-[var(--color-text-primary)]" />
              </div>
              <div className="text-left">
                <p className="font-bold text-[var(--color-text-primary)]">Tara ve İndir</p>
                <p className="text-sm text-[var(--color-text-secondary)]">Kameranızı kullanarak<br/>hemen indirin.</p>
              </div>
            </div>
          </div>

          {/* Image Right (Mockup) */}
          <div className="flex-1 relative w-full max-w-md mx-auto lg:max-w-none animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative z-10 bg-white p-3 rounded-[40px] shadow-2xl border-4 border-gray-100 rotate-[-2deg] hover:rotate-0 transition-transform duration-500 mx-auto w-fit">
              <div className="bg-gray-50 rounded-[32px] overflow-hidden w-[280px] h-[600px] border border-gray-100 relative flex flex-col items-center justify-center">
                {/* Mockup screen content */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-3xl z-20"></div>
                <div className="w-full h-full bg-gradient-to-br from-[var(--color-baby-blue)] to-[var(--color-secondary)]/20 p-6 flex flex-col justify-center items-center text-center">
                  <SmartPhone01Icon size={80} className="text-[var(--color-primary)] mb-6 animate-float" />
                  <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">SalutBabe</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] font-medium">Bebek ikinci elinin<br/>en güvenilir adresi.</p>
                </div>
              </div>
            </div>
            
            {/* Decorative elements around mockup */}
            <div className="absolute top-10 -right-10 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 animate-float" style={{ animationDelay: '1s' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">✓</div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Güvenli Ödeme</p>
                  <p className="text-xs text-gray-500">Iyzico Güvencesi</p>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-20 -left-8 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 animate-float" style={{ animationDelay: '2.5s' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-secondary)]/20 flex items-center justify-center text-[var(--color-secondary)] font-bold">♥</div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Binlerce Ürün</p>
                  <p className="text-xs text-gray-500">Her gün yenilenir</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
