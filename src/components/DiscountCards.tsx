"use client";

import React from "react";
import Link from "next/link";

const DiscountCards = () => {
  const deals = [
    {
      id: 1,
      title: "Summer Sale",
      subtitle: "Up to 50% Off",
      description: "Get ready for sunny days with our summer essentials.",
      color: "bg-primary",
      textColor: "text-white",
      buttonText: "SHOP SALE",
      image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: 2,
      title: "Newborn Essentials",
      subtitle: "Bundle & Save 20%",
      description: "Everything you need for your little one's first days.",
      color: "bg-secondary",
      textColor: "text-white",
      buttonText: "VIEW BUNDLES",
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: 3,
      title: "Eco-Friendly Tech",
      subtitle: "Smart & Green",
      description: "Modern monitors and gadgets with planet-friendly tech.",
      color: "bg-accent",
      textColor: "text-text-primary",
      buttonText: "EXPLORE",
      image: "https://images.unsplash.com/photo-1555252333-978fead067f3?auto=format&fit=crop&q=80&w=600",
    }
  ];

  return (
    <section className="max-w-[1440px] mx-auto px-6 md:px-12 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {deals.map((deal) => (
          <div 
            key={deal.id}
            className={`relative overflow-hidden rounded-[2.5rem] p-8 min-h-[320px] flex flex-col justify-between group ${deal.color}`}
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 opacity-40 mix-blend-overlay">
                <img 
                  src={deal.image} 
                  alt={deal.title} 
                  className="w-full h-full object-cover grayscale" 
                />
            </div>
            
            <div className="relative z-10">
              <span className={`inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-widest mb-4 ${deal.textColor}`}>
                {deal.subtitle}
              </span>
              <h3 className={`text-3xl font-black mb-3 leading-tight ${deal.textColor}`}>
                {deal.title}
              </h3>
              <p className={`text-sm opacity-80 max-w-[200px] leading-relaxed ${deal.textColor}`}>
                {deal.description}
              </p>
            </div>

            <div className="relative z-10">
              <Link 
                href="/shop" 
                className={`inline-block px-8 py-3 rounded-full bg-white text-[#1A1A1A] font-black text-[11px] tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/5`}
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
