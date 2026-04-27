"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const BentoHero = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="bento-grid min-h-[800px]">
        {/* Main Hero Card */}
        <div className="col-span-12 lg:col-span-8 bento-item bg-white p-12 flex flex-col justify-between group">
          <div className="max-w-md">
            <span className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-[10px] font-black tracking-widest text-slate-500 mb-6 uppercase">
              ✨ Premium Collection
            </span>
            <h1 className="text-6xl font-black text-slate-900 leading-[1.1] mb-6">
              Modern Baby <br />
              <span className="text-primary-blue">Excellence.</span>
            </h1>
            <p className="text-slate-500 text-lg mb-8 leading-relaxed">
              Discover the next generation of baby care. Designed for safety, 
              crafted for comfort, and built for modern families.
            </p>
            <Link 
              href="/shop"
              className="inline-flex items-center gap-4 bg-accent-lime px-8 py-4 rounded-full font-black text-sm hover:scale-105 transition-transform duration-300"
            >
              View All Products
              <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 7l10 10M17 7H7v10" transform="rotate(45 12 12)"/>
                </svg>
              </div>
            </Link>
          </div>

          <div className="relative h-[400px] w-full flex items-center justify-center">
            <div className="relative w-full h-full animate-float">
               <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10"></div>
               <Image 
                src="/images/stroller.png" 
                alt="Premium Stroller" 
                fill 
                className="object-contain"
                priority
               />
            </div>
          </div>

          <div className="flex gap-6 mt-8">
             {['Twitter', 'Instagram', 'LinkedIn'].map(social => (
               <button key={social} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors">
                 <div className="w-4 h-4 bg-slate-300 rounded-sm"></div>
               </button>
             ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="bento-item bg-white p-8 flex-1 glass-card">
            <h3 className="text-sm font-black text-slate-900 mb-6 tracking-tight">Popular Colors</h3>
            <div className="flex gap-3">
               {['#3b82f6', '#f472b6', '#22c55e', '#ef4444', '#06b6d4'].map(color => (
                 <div key={color} className="w-8 h-8 rounded-full cursor-pointer hover:scale-110 transition-all style={{ backgroundColor: color }}" />
               ))}
            </div>
          </div>

          <div className="bento-item bg-white p-8 h-[300px] relative group overflow-hidden glass-card">
             <div className="relative z-10">
               <h3 className="text-sm font-black text-slate-900 mb-2">New Generation</h3>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Smart Monitors</p>
             </div>
             <div className="absolute right-[-20px] bottom-[-20px] w-[200px] h-[200px] group-hover:scale-110 transition-transform duration-500">
               <Image src="/images/monitor.png" alt="Monitor" fill className="object-contain" />
             </div>
          </div>

          <div className="bento-item bg-slate-900 h-[400px] relative group overflow-hidden">
             <Image src="/images/chair.png" alt="Chair" fill className="object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000" />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
             <div className="absolute bottom-8 left-8 right-8">
               <h3 className="text-2xl font-black text-white mb-2 leading-tight">Designer <br />Furniture</h3>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BentoHero;
