"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const DiscountCards = () => {
  const deals = [
    {
      id: 1,
      title: "Summer Sale",
      subtitle: "Up to 50% Off",
      description: "Get ready for sunny days with our summer essentials.",
      color: "bg-secondary", 
      textColor: "text-white",
      buttonText: "SHOP SALE",
      image: "/images/deals/summer-sale.png",
    },
    {
      id: 2,
      title: "Newborn Essentials",
      subtitle: "Bundle & Save 20%",
      description: "Everything you need for your little one's first days.",
      color: "bg-primary", 
      textColor: "text-white",
      buttonText: "VIEW BUNDLES",
      image: "/images/deals/newborn.png",
    },
    {
      id: 3,
      title: "Eco-Friendly Tech",
      subtitle: "Smart & Green",
      description: "Modern monitors and gadgets with planet-friendly tech.",
      color: "bg-accent", 
      textColor: "text-text-primary",
      buttonText: "EXPLORE",
      image: "/images/deals/eco-tech.png",
    }
  ];

  return (
    <section className="max-w-[1440px] mx-auto px-4 md:px-12 py-6 md:py-12 overflow-hidden">
      <div className="flex flex-row overflow-x-auto snap-x snap-mandatory gap-4 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible pb-4 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {deals.map((deal, index) => (
          <div 
            key={deal.id}
            className={`relative overflow-hidden rounded-2xl md:rounded-3xl p-5 md:p-6 min-h-[140px] md:min-h-[160px] min-w-[85vw] sm:min-w-[320px] md:min-w-0 shrink-0 snap-center flex flex-row md:flex-col justify-between items-center md:items-start md:justify-center group transition-all duration-500 hover:shadow-xl hover:shadow-black/10 ${deal.color}`}
          >
            {/* Background Image using next/image with performance optimizations */}
            <div className="absolute inset-0 opacity-60 transition-transform duration-1000 group-hover:scale-110">
                <Image 
                  src={deal.image} 
                  alt={deal.title} 
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={index === 0}
                  className="object-cover" 
                />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r md:bg-gradient-to-br from-black/40 via-black/10 to-transparent pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col items-start gap-1.5 md:gap-2 md:w-full">
              <span className={`inline-block px-3 md:px-3 py-1 rounded-full bg-white/30 backdrop-blur-md text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] ${deal.textColor}`}>
                {deal.subtitle}
              </span>
              <h3 className={`text-xl md:text-2xl font-black leading-tight tracking-tight drop-shadow-md ${deal.textColor}`}>
                {deal.title}
              </h3>
            </div>

            <div className="relative z-10 shrink-0 mt-0 md:mt-4">
              <Link 
                href="/shop" 
                className={`inline-block px-5 md:px-6 py-2.5 md:py-2.5 rounded-full bg-white text-[#1A1A1A] font-black text-[9px] md:text-[10px] tracking-widest transition-all shadow-md hover:scale-105 active:scale-95`}
              >
                {deal.buttonText}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DiscountCards;
