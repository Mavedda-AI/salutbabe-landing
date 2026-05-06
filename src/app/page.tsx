import React from "react";
import BentoHero from "../components/BentoHero";
import ProductCard from "../components/ProductCard";
import DiscountCards from "../components/DiscountCards";
import Link from "next/link";

export default function Home() {
  const categories = [
    {
      name: "New Arrivals",
      description: "Be the first to get our latest handpicked items.",
      products: [
        { id: 1, name: "Eco-Friendly Stroller", price: "₺12,499", category: "Travel", image: null },
        { id: 2, name: "Smart Sleep Monitor", price: "₺4,250", category: "Tech", image: null },
        { id: 3, name: "Organic Cotton Onesie", price: "₺450", category: "Clothing", image: null },
        { id: 4, name: "Silicone Feeding Set", price: "₺890", category: "Dining", image: null },
      ]
    },
    {
      name: "Best Sellers",
      description: "Our community's most-loved essentials.",
      products: [
        { id: 5, name: "Natural Wood Teether", price: "₺350", category: "Toys", image: null },
        { id: 6, name: "Ergonomic Baby Carrier", price: "₺3,150", category: "Travel", image: null },
        { id: 7, name: "Noise Cancelling Lullaby Hub", price: "₺1,890", category: "Tech", image: null },
        { id: 8, name: "Bamboo Diaper Set", price: "₺1,200", category: "Care", image: null },
      ]
    }
  ];

  return (
    <main className="min-h-screen">
      {/* Top Discount Section */}
      <DiscountCards />
      
      {/* Hero Section */}
      <BentoHero />
      
      {/* Category Sections */}
      {categories.map((cat, idx) => (
        <section key={cat.name} className={`max-w-[1440px] mx-auto px-6 md:px-12 py-24 ${idx % 2 === 0 ? "" : "bg-surface/30"}`}>
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="animate-fade-in-up">
              <span className="text-primary font-black text-[11px] uppercase tracking-[0.3em] mb-4 block">
                {cat.name.toUpperCase()}
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-text-primary mb-6 leading-[1.1] tracking-tight">
                {cat.name}.
              </h2>
              <p className="text-text-secondary max-w-md text-lg leading-relaxed">
                {cat.description}
              </p>
            </div>
            <Link 
              href="/shop" 
              className="group flex items-center gap-3 text-sm font-black text-text-primary hover:text-primary transition-all duration-300"
            >
              EXPLORE ALL
              <div className="w-10 h-10 rounded-full border border-border-color flex items-center justify-center group-hover:border-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {cat.products.map((product, i) => (
              <ProductCard 
                key={product.id}
                {...product}
                animationDelay={`${i * 100}ms`}
              />
            ))}
          </div>
        </section>
      ))}

      {/* Stats Section */}
      <section className="py-32 border-y border-border-color/50">
         <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
               <div className="space-y-3">
                  <h4 className="text-5xl font-black text-text-primary tracking-tighter">100%</h4>
                  <p className="text-text-secondary font-black uppercase tracking-[0.2em] text-[10px]">Secure Payments</p>
               </div>
               <div className="space-y-3">
                  <h4 className="text-5xl font-black text-text-primary tracking-tighter">48K+</h4>
                  <p className="text-text-secondary font-black uppercase tracking-[0.2em] text-[10px]">Active Members</p>
               </div>
               <div className="space-y-3">
                  <h4 className="text-5xl font-black text-text-primary tracking-tighter">150+</h4>
                  <p className="text-text-secondary font-black uppercase tracking-[0.2em] text-[10px]">Curated Brands</p>
               </div>
               <div className="space-y-3">
                  <h4 className="text-5xl font-black text-text-primary tracking-tighter">24/7</h4>
                  <p className="text-text-secondary font-black uppercase tracking-[0.2em] text-[10px]">Support Line</p>
               </div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="w-full">
        <div className="bg-surface py-24 px-6 md:py-40 text-center relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full animate-float"></div>
           <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/10 blur-[150px] rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
           
           <div className="relative z-10 max-w-4xl mx-auto">
             <h2 className="text-5xl md:text-8xl font-black text-text-primary mb-12 leading-[1] tracking-tighter">
               Ready to Join the <br />
               <span className="text-secondary italic">SalutBabe</span> Family?
             </h2>
             <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
               <Link href="/register" className="w-full sm:w-auto px-16 py-7 bg-primary text-white rounded-full font-black text-sm hover:scale-105 transition-all duration-500 shadow-2xl shadow-primary/30 active:scale-95">
                 CREATE FREE ACCOUNT
               </Link>
               <Link href="/download" className="w-full sm:w-auto px-16 py-7 bg-background/20 backdrop-blur-3xl text-text-primary border border-border-color rounded-full font-black text-sm hover:bg-surface transition-all duration-500 shadow-sm">
                 DOWNLOAD OUR APP
               </Link>
             </div>
           </div>
        </div>
      </section>
    </main>
  );
}
