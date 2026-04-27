import React from "react";
import BentoHero from "../components/BentoHero";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      <BentoHero />
      
      {/* Product Showcase Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">Curated for Quality.</h2>
            <p className="text-slate-500 max-w-md text-lg">
              We handpick every product to ensure it meets our rigorous safety and style standards.
            </p>
          </div>
          <Link href="/shop" className="text-sm font-black text-slate-900 border-b-2 border-slate-900 pb-1 hover:text-primary-blue hover:border-primary-blue transition-all duration-300">
            SHOP THE COLLECTION
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: "Eco-Friendly Stroller", price: "₺12,499", category: "Travel" },
            { name: "Smart Sleep Monitor", price: "₺4,250", category: "Tech" },
            { name: "Organic Cotton Onesie", price: "₺450", category: "Clothing" },
            { name: "Silicone Feeding Set", price: "₺890", category: "Dining" },
          ].map((product, i) => (
            <div key={i} className="group cursor-pointer animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="aspect-[4/5] rounded-[2.5rem] bg-white border border-slate-100 overflow-hidden relative mb-6 transition-all duration-500 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] hover:-translate-y-2">
                <div className="absolute inset-0 bg-slate-100/50 flex items-center justify-center">
                   <div className="w-20 h-20 bg-slate-200 rounded-full animate-pulse"></div>
                </div>
                <div className="absolute top-6 right-6 z-10">
                   <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-sm hover:bg-white transition-all duration-300 hover:scale-110">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                   </button>
                </div>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{product.category}</p>
              <h3 className="text-lg font-black text-slate-900 group-hover:text-primary-blue transition-colors duration-300">{product.name}</h3>
              <p className="font-bold text-slate-500 mt-1">{product.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats / Info Section */}
      <section className="bg-white py-24">
         <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
               <div>
                  <h4 className="text-5xl font-black text-slate-900 mb-2">100%</h4>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Safe Payments</p>
               </div>
               <div>
                  <h4 className="text-5xl font-black text-slate-900 mb-2">48K+</h4>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Active Moms</p>
               </div>
               <div>
                  <h4 className="text-5xl font-black text-slate-900 mb-2">24/7</h4>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Expert Support</p>
               </div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-24">
        <div className="rounded-[4rem] bg-slate-900 p-12 md:p-32 text-center relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-blue/20 blur-[120px] rounded-full animate-float"></div>
           <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-pink/10 blur-[120px] rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
           
           <div className="relative z-10 max-w-3xl mx-auto">
             <h2 className="text-4xl md:text-7xl font-black text-white mb-10 leading-[1.1] tracking-tight">
               Join the Modern <br />
               <span className="text-accent-lime">Revolution.</span>
             </h2>
             <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
               <Link href="/register" className="w-full sm:w-auto px-12 py-6 bg-accent-lime text-slate-900 rounded-full font-black text-sm hover:scale-105 transition-all duration-300 shadow-2xl shadow-lime-500/20 active:scale-95">
                 START SHOPPING NOW
               </Link>
               <Link href="/download" className="w-full sm:w-auto px-12 py-6 bg-white/10 backdrop-blur-xl text-white border border-white/10 rounded-full font-black text-sm hover:bg-white/20 transition-all duration-300">
                 DOWNLOAD OUR APP
               </Link>
             </div>
           </div>
        </div>
      </section>
    </main>
  );
}
