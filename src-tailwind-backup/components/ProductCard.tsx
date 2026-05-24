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
      <div className="aspect-[4/5] rounded-[1.5rem] md:rounded-[2.5rem] bg-surface border border-border-color overflow-hidden relative mb-4 md:mb-6 transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] hover:-translate-y-3">
        {/* Product Image Area */}
        <div className="absolute inset-0 bg-surface/30">
          {image ? (
            <Image 
              src={image} 
              alt={name} 
              fill 
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover group-hover:scale-110 transition-transform duration-700" 
            />
          ) : (
            <div className="w-full h-full bg-border-color animate-pulse flex items-center justify-center">
               <div className="w-12 h-12 rounded-full bg-text-secondary/20"></div>
            </div>
          )}
        </div>

        {/* Action Button */}
        {/* Action Button */}
        <div className="absolute top-4 right-4 md:top-8 md:right-8 z-10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 hidden md:block">
          <button className="w-12 h-12 rounded-full bg-surface/90 backdrop-blur-md flex items-center justify-center shadow-lg hover:bg-surface transition-all duration-300 hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-primary">
              <path d="M5 12h14m-7-7 7 7-7 7"/>
            </svg>
          </button>
        </div>

        {/* Favorite Button (Visible by default) */}
        <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10">
           <button className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-surface/40 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-sm hover:bg-surface transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary md:w-[18px] md:h-[18px]">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
           </button>
        </div>
      </div>

      <div className="px-2 md:px-4">
        <div className="flex justify-between items-start mb-1 md:mb-2">
          <p className="text-[9px] md:text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] line-clamp-1">{category}</p>
        </div>
        <h3 className="text-sm md:text-lg font-black text-text-primary group-hover:text-primary transition-colors duration-300 leading-tight line-clamp-2 md:line-clamp-none">
          {name}
        </h3>
        <p className="text-xs md:text-base font-bold text-text-secondary mt-1 md:mt-2">{price}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
