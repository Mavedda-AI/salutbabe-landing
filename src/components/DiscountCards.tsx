"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const DiscountCards = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const deals = [
    {
      id: 1,
      title: "Yaz İndirimi",
      subtitle: "%50'YE VARAN İNDİRİM",
      bgClass: "bg-gradient-to-br from-[#FEF2F2] to-[#FEE2E2]", 
      titleColor: "text-[#DC2626]",
      subtitleClass: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20",
      buttonText: "HEMEN AL",
      buttonClass: "bg-[#EF4444] text-white hover:bg-[#DC2626]",
      image: "/images/deals/summer-sale.png",
      floatClass: "animate-[float_4s_ease-in-out_infinite]",
      shadowClass: "shadow-[#EF4444]/20",
      decorations: (
        <>
          {/* Rotating Dotted Circle */}
          <svg className="absolute -top-10 -right-10 w-40 h-40 opacity-20 animate-[spin_20s_linear_infinite]" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="4 8" />
            <circle cx="50" cy="50" r="20" fill="none" stroke="#EF4444" strokeWidth="1" strokeDasharray="2 4" />
          </svg>
          {/* Floating Dots */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#EF4444] rounded-full opacity-30 animate-[ping_3s_ease-in-out_infinite]"></div>
          <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-[#EF4444] rounded-full opacity-20 animate-[pulse_2s_ease-in-out_infinite]"></div>
        </>
      )
    },
    {
      id: 2,
      title: "Yenidoğan Seti",
      subtitle: "BUNDLE AL & %20 KAZAN",
      bgClass: "bg-gradient-to-br from-[#FFF7ED] to-[#FFEDD5]", 
      titleColor: "text-[#EA580C]",
      subtitleClass: "bg-[#F97316]/10 text-[#F97316] border-[#F97316]/20",
      buttonText: "SETLERİ GÖR",
      buttonClass: "bg-[#F97316] text-white hover:bg-[#EA580C]",
      image: "/images/deals/newborn.png",
      floatClass: "animate-[float_3.5s_ease-in-out_infinite_0.5s]",
      shadowClass: "shadow-[#F97316]/20",
      decorations: (
        <>
          {/* Pulsing Bubbles */}
          <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-[#F97316]/10 rounded-full animate-[pulse_4s_ease-in-out_infinite]"></div>
          <div className="absolute top-1/2 right-10 w-12 h-12 bg-[#F97316]/10 rounded-full animate-[pulse_3s_ease-in-out_infinite_1s]"></div>
          {/* Wave Graphic */}
          <svg className="absolute bottom-0 left-0 w-full opacity-10" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="#F97316" d="M0,160L48,176C96,192,192,224,288,218.7C384,213,480,171,576,149.3C672,128,768,128,864,149.3C960,171,1056,213,1152,213.3C1248,213,1344,171,1392,149.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </>
      )
    },
    {
      id: 3,
      title: "Eco-Tech Ürünler",
      subtitle: "AKILLI VE DOĞA DOSTU",
      bgClass: "bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE]", 
      titleColor: "text-[#2563EB]",
      subtitleClass: "bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20",
      buttonText: "KEŞFET",
      buttonClass: "bg-[#3B82F6] text-white hover:bg-[#2563EB]",
      image: "/images/deals/eco-tech.png",
      floatClass: "animate-[float_4.5s_ease-in-out_infinite_1s]",
      shadowClass: "shadow-[#3B82F6]/20",
      decorations: (
        <>
          {/* Expanding Sound Rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] aspect-square rounded-full border border-[#3B82F6]/20 animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] aspect-square rounded-full border border-[#3B82F6]/10 animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite_1s]"></div>
          {/* Plus Signs */}
          <div className="absolute top-4 right-8 text-[#3B82F6]/30 text-2xl font-black rotate-45 animate-pulse">+</div>
          <div className="absolute bottom-6 left-12 text-[#3B82F6]/30 text-xl font-black rotate-12 animate-pulse">+</div>
        </>
      )
    }
  ];

  return (
    <section className="max-w-[1440px] mx-auto px-4 md:px-12 pt-1 pb-4 md:pt-4 md:pb-8 overflow-hidden">
      
      {/* Dynamic Keyframes injected safely */}
      {mounted && (
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes float {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-12px) rotate(2deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }
        `}} />
      )}

      <div className="flex flex-row overflow-x-auto snap-x snap-mandatory gap-4 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible pb-4 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {deals.map((deal, index) => (
          <div 
            key={deal.id}
            className={`relative overflow-hidden rounded-[24px] p-6 md:p-8 min-h-[200px] md:min-h-[220px] min-w-[85vw] sm:min-w-[320px] md:min-w-0 shrink-0 snap-center flex flex-col justify-between items-start group transition-transform duration-500 hover:-translate-y-2 hover:shadow-2xl ${deal.shadowClass} ${deal.bgClass}`}
          >
            {/* Abstract Background Decorations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
               {deal.decorations}
            </div>

            {/* Content (Z-10) */}
            <div className="relative z-10 w-[60%] flex flex-col items-start gap-2">
              <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border backdrop-blur-sm ${deal.subtitleClass}`}>
                {deal.subtitle}
              </span>
              <h3 className={`text-2xl md:text-[28px] font-black leading-tight tracking-tight ${deal.titleColor}`}>
                {deal.title}
              </h3>
            </div>

            {/* Button (Z-10) */}
            <div className="relative z-10 mt-6">
              <Link 
                href="/shop" 
                className={`inline-block px-6 py-2.5 rounded-full ${deal.buttonClass} font-black text-[10px] tracking-widest transition-all shadow-md hover:scale-105 active:scale-95`}
              >
                {deal.buttonText}
              </Link>
            </div>

            {/* Product Image Wrapper with continuous floating */}
            <div className={`absolute right-[-10%] md:right-[-5%] top-[15%] md:top-[10%] w-[55%] md:w-[60%] h-[120%] pointer-events-none z-20 ${deal.floatClass}`}>
               {/* Soft glow behind the image to make it pop, updated to light theme */}
               <div className="absolute inset-0 bg-white/50 blur-[30px] rounded-full scale-75 mix-blend-overlay"></div>
               
               <div className="relative w-full h-full">
                 <Image 
                   src={deal.image} 
                   alt={deal.title} 
                   fill
                   sizes="(max-width: 768px) 50vw, 20vw"
                   priority={index === 0}
                   className="object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform duration-700 ease-out"
                   onError={(e) => {
                     // Fallback image handling
                     e.currentTarget.src = "/logo-favicon.png";
                     e.currentTarget.classList.add("opacity-50", "scale-50");
                   }}
                 />
               </div>
            </div>
            
          </div>
        ))}
      </div>
    </section>
  );
};

export default DiscountCards;
