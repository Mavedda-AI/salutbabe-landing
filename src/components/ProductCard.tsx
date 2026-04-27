"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  id: string | number;
  name: string;
  price: string;
  category: string;
  image?: string | null;
  animationDelay?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  id, 
  name, 
  price, 
  category, 
  image, 
  animationDelay = "0ms" 
}) => {
  return (
    <Link 
      href={`/product/${id}`} 
      className="group animate-fade-in-up block" 
      style={{ animationDelay }}
    >
      <div className="aspect-[4/5] rounded-[2.5rem] bg-white border border-slate-50 overflow-hidden relative mb-6 transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] hover:-translate-y-3">
        {/* Product Image Area */}
        <div className="absolute inset-0 bg-slate-100/30 flex items-center justify-center p-8">
          {image ? (
            <div className="relative w-full h-full">
              <Image 
                src={image} 
                alt={name} 
                fill 
                className="object-contain p-4 group-hover:scale-110 transition-transform duration-700" 
              />
            </div>
          ) : (
            <div className="w-24 h-24 bg-slate-200 rounded-full animate-pulse"></div>
          )}
        </div>

        {/* Action Button */}
        <div className="absolute top-8 right-8 z-10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
          <button className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300 hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14m-7-7 7 7-7 7"/>
            </svg>
          </button>
        </div>

        {/* Favorite Button (Visible by default) */}
        <div className="absolute top-8 left-8 z-10">
           <button className="w-10 h-10 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-sm hover:bg-white transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
           </button>
        </div>
      </div>

      <div className="px-4">
        <div className="flex justify-between items-start mb-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{category}</p>
        </div>
        <h3 className="text-lg font-black text-slate-900 group-hover:text-primary-blue transition-colors duration-300 leading-tight">
          {name}
        </h3>
        <p className="text-base font-bold text-slate-500 mt-2">{price}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
