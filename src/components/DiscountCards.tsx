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
      color: "bg-[#FF9EBE]", 
      textColor: "text-white",
      buttonText: "SHOP SALE",
      image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 2,
      title: "Newborn Essentials",
      subtitle: "Bundle & Save 20%",
      description: "Everything you need for your little one's first days.",
      color: "bg-[#5FC8C0]", 
      textColor: "text-white",
      buttonText: "VIEW BUNDLES",
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 3,
      title: "Eco-Friendly Tech",
      subtitle: "Smart & Green",
      description: "Modern monitors and gadgets with planet-friendly tech.",
      color: "bg-[#7EDB9E]", 
      textColor: "text-[#1A1A1A]",
      buttonText: "EXPLORE",
      image: "https://images.unsplash.com/photo-1555252333-978fead067f3?auto=format&fit=crop&q=80&w=800",
    }
  ];

  return (
    <section className="max-w-[1440px] mx-auto px-6 md:px-12 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {deals.map((deal, index) => (
          <div 
            key={deal.id}
            className={`relative overflow-hidden rounded-[3rem] p-10 min-h-[400px] flex flex-col justify-between group transition-all duration-500 hover:shadow-2xl hover:shadow-black/10 ${deal.color}`}
          >
            {/* Background Image using next/image with performance optimizations */}
            <div className="absolute inset-0 opacity-40 transition-transform duration-1000 group-hover:scale-110">
                <Image 
                  src={deal.image} 
                  alt={deal.title} 
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={index === 0} // Priority for the first card (above the fold)
                  className="object-cover mix-blend-multiply" 
                />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-transparent pointer-events-none"></div>
            
            <div className="relative z-10">
              <span className={`inline-block px-5 py-2 rounded-full bg-white/30 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.2em] mb-6 ${deal.textColor}`}>
                {deal.subtitle}
              </span>
              <h3 className={`text-4xl font-black mb-4 leading-tight tracking-tight ${deal.textColor}`}>
                {deal.title}
              </h3>
              <p className={`text-base font-semibold opacity-90 max-w-[240px] leading-relaxed ${deal.textColor}`}>
                {deal.description.replace(/\s+/g, ' ').trim()}
              </p>
            </div>

            <div className="relative z-10">
              <Link 
                href="/shop" 
                className={`inline-block px-10 py-4 rounded-full bg-white text-[#1A1A1A] font-black text-[12px] tracking-widest transition-all shadow-xl shadow-black/5 hover:scale-105 active:scale-95`}
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
