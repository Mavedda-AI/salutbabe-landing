import React from 'react';
import { AppleIcon, PlayStoreIcon, StarIcon, Video01Icon, ShoppingBag01Icon, FavouriteIcon } from 'hugeicons-react';

export const metadata = {
  title: 'Download SalutBabe | App Store & Google Play',
  description: 'Download the SalutBabe mobile app to buy and sell pre-loved baby items with ease.',
};

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] via-[#ffffff] to-[#fff5f7] font-[family-name:var(--font-inter)] overflow-hidden relative flex items-center">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-indigo-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[35vw] h-[35vw] bg-pink-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-50" />

      <div className="container mx-auto max-w-7xl px-6 py-12 lg:py-0 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8 min-h-[85vh]">
          
          {/* Left Column: Typography & CTAs */}
          <div className="flex-1 w-full flex flex-col items-center lg:items-start text-center lg:text-left pt-12 lg:pt-0">
            
            <h1 className="text-5xl md:text-6xl lg:text-[72px] font-extrabold text-gray-900 tracking-tight mb-6 leading-[1.05]">
              Bebek Modasına <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-400">
                Yeni Bir Soluk
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-500 max-w-lg mb-10 font-medium leading-relaxed">
              İkinci el bebek ve çocuk kıyafetlerini alıp satın, canlı yayın odalarıyla yeni nesil alışveriş deneyimini cebinizde yaşayın.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-10">
              <a 
                href="https://apps.apple.com/tr/app/salutbabe/id6759988511" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#111] text-white px-8 py-3.5 rounded-2xl hover:bg-gray-800 transition-transform hover:-translate-y-1 shadow-lg shadow-gray-900/20"
              >
                <AppleIcon size={28} className="text-white" />
                <div className="text-left text-white">
                  <div className="text-[10px] uppercase tracking-wider text-gray-300 font-medium mb-0.5">Download for iOS</div>
                  <div className="text-lg font-bold leading-none tracking-tight">App Store</div>
                </div>
              </a>

              <a 
                href="https://play.google.com/store/apps/details?id=com.salutbabe&hl=tr" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-gray-900 border-2 border-gray-100 px-8 py-3.5 rounded-2xl hover:bg-gray-50 transition-transform hover:-translate-y-1 shadow-lg shadow-gray-200/50"
              >
                <PlayStoreIcon size={28} className="text-gray-900" />
                <div className="text-left text-gray-900">
                  <div className="text-[10px] uppercase tracking-wider text-gray-500 font-medium mb-0.5">Download for Android</div>
                  <div className="text-lg font-bold leading-none tracking-tight">Google Play</div>
                </div>
              </a>
            </div>

            {/* Social Proof Section */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="User 1" />
                <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" alt="User 2" />
                <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="User 3" />
              </div>
              <div className="flex flex-col">
                <div className="text-sm font-bold text-gray-800">100.000+ mutlu anne</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">4.9</span>
                  <div className="flex text-pink-400">
                    <StarIcon size={14} className="fill-current" />
                    <StarIcon size={14} className="fill-current" />
                    <StarIcon size={14} className="fill-current" />
                    <StarIcon size={14} className="fill-current" />
                    <StarIcon size={14} className="fill-current" />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Fantastic Composition */}
          <div className="flex-1 w-full relative flex justify-center lg:justify-end items-center mt-10 lg:mt-0">
            
            {/* The Main Phone Mockup */}
            <div className="relative w-[280px] h-[580px] bg-[#1a1b26] rounded-[40px] shadow-2xl p-2 border-[6px] border-white z-20 mx-auto lg:mr-10">
              <div className="w-full h-full bg-white rounded-[28px] overflow-hidden relative flex flex-col">
                {/* Phone Notch */}
                <div className="absolute top-0 inset-x-0 h-6 bg-[#1a1b26] rounded-b-xl w-32 mx-auto z-30"></div>
                
                {/* App Screen Content: Live Stream Mockup */}
                <div className="flex-1 bg-gray-50 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80" 
                    alt="Live Stream" 
                    className="w-full h-full object-cover"
                  />
                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                  
                  {/* UI Elements inside phone */}
                  <div className="absolute top-8 left-4 right-4 flex justify-between items-center text-white">
                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                      <span className="text-xs font-bold tracking-wide">CANLI</span>
                    </div>
                    <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full text-xs font-medium">
                      👁 1.2k
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-4 right-4">
                    <div className="flex items-center gap-3 mb-4">
                      <img className="w-10 h-10 rounded-full border-2 border-pink-400" src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80" alt="Seller" />
                      <div className="text-white">
                        <p className="text-sm font-bold">Zeynep'in Dolabı</p>
                        <p className="text-xs opacity-80">Zara Kids Tulum Seti</p>
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 flex justify-between items-center border border-white/20">
                      <div>
                        <p className="text-xs text-gray-300">Fiyat</p>
                        <p className="text-lg font-bold text-white">250 TL</p>
                      </div>
                      <button className="bg-pink-500 text-white text-xs font-bold px-4 py-2 rounded-lg">
                        Hemen Al
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Decorative Elements (Out of the phone) */}
            
            {/* Live Indicator Bubble */}
            <div className="absolute top-[10%] lg:top-[15%] right-[5%] lg:-right-4 bg-white p-3 pr-4 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] flex items-center gap-3 z-30 animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="bg-red-50 text-red-500 w-10 h-10 rounded-full flex items-center justify-center relative">
                <Video01Icon size={20} />
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Odalar</p>
                <p className="text-sm font-bold text-gray-800">Canlı Alışveriş</p>
              </div>
            </div>

            {/* Shopping Bag Bubble */}
            <div className="absolute bottom-[20%] left-[0%] lg:-left-12 bg-white p-3 pr-5 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] flex items-center gap-3 z-30 animate-bounce" style={{ animationDuration: '4s' }}>
              <div className="bg-indigo-50 text-indigo-500 w-12 h-12 rounded-xl flex items-center justify-center">
                <ShoppingBag01Icon size={24} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Keşfet</p>
                <p className="text-sm font-bold text-gray-800">Binlerce Ürün</p>
              </div>
            </div>

            {/* Small floating hearts & stars */}
            <div className="absolute top-[30%] left-[5%] lg:left-0 text-pink-400 z-10 animate-pulse">
              <FavouriteIcon size={32} className="rotate-12" />
            </div>
            
            <div className="absolute bottom-[10%] right-[15%] lg:right-4 text-amber-400 z-10 animate-bounce" style={{ animationDuration: '2.5s' }}>
              <StarIcon size={24} variant="solid" className="rotate-[-15deg]" />
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
