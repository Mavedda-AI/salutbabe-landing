import React from 'react';
import Link from 'next/link';
import {Button} from '../ui/Button';

export const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-bg/80 backdrop-blur-xl border-b border-primary/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 z-10 group">
           <div className="w-[36px] h-[36px] rounded-xl overflow-hidden flex flex-shrink-0 items-center justify-center shadow-sm bg-white border border-gray-100 group-hover:scale-105 transition-transform">
             <img src="/logo-icon.png" alt="SalutBabe" className="w-full h-full object-contain p-0.5" />
           </div>
           <div className="flex flex-col justify-center text-left">
             <span className="text-[18px] md:text-[20px] font-black text-primary leading-none tracking-tight">SalutBabe</span>
             <span className="text-[10px] md:text-[11px] opacity-70 font-bold tracking-wide mt-0.5">Anneden Anneye</span>
           </div>
        </Link>

        <div className="hidden md:flex items-center space-x-10 text-sm font-bold text-primary/70">
          <Link href="/how-it-works" className="hover:text-primary transition-colors">Nasıl Çalışır?</Link>
          <Link href="/products" className="hover:text-primary transition-colors">Ürünler</Link>
          <Link href="/safety" className="hover:text-primary transition-colors">Güvenlik</Link>
          <Link href="/partner" className="hover:text-primary transition-colors">Partnerlik</Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-sm font-bold text-primary hover:opacity-70 transition-opacity">
            Giriş Yap
          </Link>
          <Button size="sm">Hemen Başla</Button>
        </div>
      </div>
    </nav>
  );
};
