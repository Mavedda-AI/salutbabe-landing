"use client";

import React, {useEffect, useState} from "react";
import ProductCard from "../components/ProductCard";
import DiscountCards from "../components/DiscountCards";
import Leaderboard from "../components/Leaderboard";
import Link from "next/link";
import {apiUrl} from "../lib/api";
import {useThemeLanguage} from "../context/ThemeLanguageContext";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useThemeLanguage();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(apiUrl("/listings/get-all-products"), {
          headers: {
            'X-Device-Type': 'web'
          }
        });
        const json = await res.json();
        
        if (json.payload && json.payload.products) {
          setProducts(json.payload.products);
        }
      } catch (err) {
        console.error("Failed to fetch products from backend:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const sections = [
    {
      name: t("home.new_arrivals"),
      description: t("home.new_arrivals_desc"),
      products: products.slice(0, 4) 
    },
    {
      name: t("home.best_sellers"),
      description: t("home.best_sellers_desc"),
      products: products.slice(4, 8)
    }
  ];

  return (
    <main className="min-h-screen">
      {/* Top Discount Section */}
      <DiscountCards />
      
      {/* Category Sections */}
      {loading ? (
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-24 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-text-secondary font-bold animate-pulse uppercase tracking-widest text-xs">
              {t("home.loading")}
            </p>
          </div>
        </div>
      ) : (
        sections.map((cat, idx) => (
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
                {t("home.explore_all")}
                <div className="w-10 h-10 rounded-full border border-border-color flex items-center justify-center group-hover:border-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
              {cat.products.length > 0 ? (
                cat.products.map((product, i) => (
                  <ProductCard 
                    key={product.listingID || product.id}
                    id={product.listingID || product.id}
                    name={product.title}
                    price={`${product.price} ₺`}
                    category={product.category?.name || "Bebek"}
                    image={product.images?.[0]?.imageUrl || null}
                    animationDelay={`${i * 100}ms`}
                  />
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-surface rounded-[2.5rem] border border-dashed border-border-color">
                  <p className="text-text-secondary italic">{t("home.no_products")}</p>
                </div>
              )}
            </div>
          </section>
        ))
      )}

      {/* Stats Section */}
      <section className="py-32 border-y border-border-color/50">
         <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
               <div className="space-y-3">
                  <h4 className="text-3xl md:text-5xl font-black text-text-primary tracking-tighter">100%</h4>
                  <p className="text-text-secondary font-black uppercase tracking-[0.2em] text-[10px]">
                    {t("stats.secure_payments")}
                  </p>
               </div>
               <div className="space-y-3">
                  <h4 className="text-3xl md:text-5xl font-black text-text-primary tracking-tighter">48K+</h4>
                  <p className="text-text-secondary font-black uppercase tracking-[0.2em] text-[10px]">
                    {t("stats.active_members")}
                  </p>
               </div>
               <div className="space-y-3">
                  <h4 className="text-3xl md:text-5xl font-black text-text-primary tracking-tighter">150+</h4>
                  <p className="text-text-secondary font-black uppercase tracking-[0.2em] text-[10px]">
                    {t("stats.curated_brands")}
                  </p>
               </div>
               <div className="space-y-3">
                  <h4 className="text-3xl md:text-5xl font-black text-text-primary tracking-tighter">24/7</h4>
                  <p className="text-text-secondary font-black uppercase tracking-[0.2em] text-[10px]">
                    {t("stats.support_line")}
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* Leaderboard Section */}
      <Leaderboard />

      {/* CTA Section */}
      <section className="w-full">
         <div className="bg-surface py-24 px-6 md:py-40 text-center relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-primary/10 blur-[100px] md:blur-[150px] rounded-full animate-float"></div>
           <div className="absolute bottom-0 left-0 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-secondary/10 blur-[100px] md:blur-[150px] rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
           
           <div className="relative z-10 max-w-4xl mx-auto">
             <h2 className="text-4xl md:text-6xl lg:text-8xl font-black text-text-primary mb-12 leading-[1.1] tracking-tighter">
               {t("home.ready_to_join")}
             </h2>
             <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
               <Link href="/register" className="w-full sm:w-auto px-16 py-7 bg-primary text-white rounded-full font-black text-sm hover:scale-105 transition-all duration-500 shadow-2xl shadow-primary/30 active:scale-95">
                 {t("home.create_account")}
               </Link>
               <Link href="/download" className="w-full sm:w-auto px-16 py-7 bg-background/20 backdrop-blur-3xl text-text-primary border border-border-color rounded-full font-black text-sm hover:bg-surface transition-all duration-500 shadow-sm">
                 {t("home.download_app")}
               </Link>
             </div>
           </div>
        </div>
      </section>
    </main>
  );
}
