"use client";

import React from "react";
import ProductCard from "../../components/ProductCard";

const ShopPage = () => {
  const categories = ["All", "Travel", "Tech", "Clothing", "Dining", "Nursery"];
  const products = [
    { id: 0, name: "Eco-Friendly Stroller", price: "₺12,499", category: "Travel", image: "/images/stroller.png" },
    { id: 1, name: "Smart Sleep Monitor", price: "₺4,250", category: "Tech", image: "/images/monitor.png" },
    { id: 2, name: "Organic Cotton Onesie", price: "₺450", category: "Clothing", image: null },
    { id: 3, name: "Silicone Feeding Set", price: "₺890", category: "Dining", image: null },
    { id: 4, name: "Designer High Chair", price: "₺3,750", category: "Dining", image: "/images/chair.png" },
    { id: 5, name: "Minimalist Crib", price: "₺8,990", category: "Nursery", image: null },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 animate-fade-in-up">
        <div>
          <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">Our Shop.</h1>
          <p className="text-slate-500 font-medium">Curated products for the modern parent.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button 
              key={cat}
              className={`px-6 py-3 rounded-full text-xs font-black tracking-widest transition-all duration-300 ${cat === 'All' ? 'bg-slate-900 text-white' : 'bg-white text-slate-400 hover:text-slate-900 hover:bg-slate-50 border border-slate-100 shadow-sm'}`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {products.map((product, i) => (
          <ProductCard 
            key={product.id}
            {...product}
            animationDelay={`${i * 100}ms`}
          />
        ))}
      </div>
    </main>
  );
};

export default ShopPage;
