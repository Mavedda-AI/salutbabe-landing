"use client";

import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {Button} from '../ui/Button';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check token on mount
    const token = localStorage.getItem('auth_token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setIsMobileMenuOpen(false);
    router.push('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-bg/80 backdrop-blur-xl border-b border-primary/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform">
            <span className="text-white font-black text-xl">S</span>
          </div>
          <span className="text-2xl font-black tracking-tight text-primary">salutbabe</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-10 text-sm font-bold text-primary/70">
          <Link href="/how-it-works" className="hover:text-primary transition-colors">Nasıl Çalışır?</Link>
          <Link href="/products" className="hover:text-primary transition-colors">Ürünler</Link>
          <Link href="/safety" className="hover:text-primary transition-colors">Güvenlik</Link>
          <Link href="/partner" className="hover:text-primary transition-colors">Partnerlik</Link>
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard/sysop" className="text-sm font-bold text-primary hover:opacity-70 transition-opacity">
                Panel
              </Link>
              <button onClick={handleLogout} className="text-sm font-bold text-red-500 hover:opacity-70 transition-opacity">
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-bold text-primary hover:opacity-70 transition-opacity">
                Giriş Yap
              </Link>
              <Link href="/register">
                <Button size="sm">Hemen Başla</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-primary focus:outline-none p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-brand-bg border-b border-primary/5 shadow-xl px-6 py-6 flex flex-col space-y-5 bg-white">
          <Link href="/how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-primary/80 hover:text-primary">Nasıl Çalışır?</Link>
          <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-primary/80 hover:text-primary">Ürünler</Link>
          <Link href="/safety" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-primary/80 hover:text-primary">Güvenlik</Link>
          <Link href="/partner" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-primary/80 hover:text-primary">Partnerlik</Link>
          
          <div className="pt-5 mt-2 border-t border-primary/10 flex flex-col space-y-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard/sysop" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-primary hover:opacity-70">
                  Panel
                </Link>
                <button onClick={handleLogout} className="text-left text-base font-bold text-red-500 hover:opacity-70">
                  Çıkış Yap
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-primary hover:opacity-70">
                  Giriş Yap
                </Link>
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full">Hemen Başla</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
