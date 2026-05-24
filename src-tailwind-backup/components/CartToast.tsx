'use client';

import React from 'react';
import {useCart} from '../context/CartContext';
import {usePathname} from 'next/navigation';

const CartToast = () => {
  const { showToast, toastProduct, setShowToast } = useCart();
  const pathname = usePathname();

  if (!toastProduct || pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin')) return null;

  return (
    <div 
      className={`fixed top-24 right-6 z-[100] transition-all duration-500 transform ${
        showToast ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div className="bg-white/80 backdrop-blur-2xl border border-white/20 p-4 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center gap-4 min-w-[320px] ring-1 ring-black/5">
        <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-neutral-100 flex-shrink-0">
          <img 
            src={toastProduct.primaryImage} 
            alt={toastProduct.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1 pr-4">
          <div className="text-[10px] font-black text-primary-pink uppercase tracking-widest mb-1">
            SEPETE EKLENDİ
          </div>
          <h4 className="text-sm font-bold text-neutral-800 line-clamp-1 mb-0.5">
            {toastProduct.title}
          </h4>
          <div className="text-sm font-black text-neutral-900">
            {toastProduct.price.toLocaleString('tr-TR')} ₺
          </div>
        </div>

        <button 
          onClick={() => setShowToast(false)}
          className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 hover:bg-neutral-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        {/* Small Progress Bar */}
        <div className="absolute bottom-0 left-6 right-6 h-1 bg-neutral-100 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-primary-blue transition-all duration-[4000ms] linear ${showToast ? 'w-full' : 'w-0'}`}
          />
        </div>
      </div>
    </div>
  );
};

export default CartToast;
