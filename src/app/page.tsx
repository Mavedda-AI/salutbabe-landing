import React from "react";
import BentoHero from "../components/BentoHero";
import ProductCard from "../components/ProductCard";
import Link from "next/link";

export default function Home() {
  const featuredProducts = [
    { id: 1, name: "Eco-Friendly Stroller", price: "₺12,499", category: "Travel", image: "/images/stroller.png" },
    { id: 2, name: "Smart Sleep Monitor", price: "₺4,250", category: "Tech", image: "/images/monitor.png" },
    { id: 3, name: "Organic Cotton Onesie", price: "₺450", category: "Clothing", image: null },
    { id: 4, name: "Silicone Feeding Set", price: "₺890", category: "Dining", image: null },
  ];

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
          {featuredProducts.map((product, i) => (
            <ProductCard 
              key={product.id}
              {...product}
              animationDelay={`${i * 100}ms`}
            />
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
      <section className="w-full mt-12 md:mt-24">
        <div className="bg-slate-900 py-20 px-6 md:py-32 text-center relative overflow-hidden group">
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
