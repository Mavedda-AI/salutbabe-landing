import React from 'react';
import Link from 'next/link';
import {Button} from '../ui/Button';

export const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-bg/80 backdrop-blur-xl border-b border-primary/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform">
            <span className="text-white font-black text-xl">S</span>
          </div>
          <span className="text-2xl font-black tracking-tight text-primary">salutbabe</span>
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
