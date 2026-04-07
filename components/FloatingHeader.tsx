"use client";

import React, {useEffect, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import CustomToast from "./CustomToast";
import {useCart} from "../context/CartContext";

const FloatingHeader = () => {
  const { cartCount } = useCart();
  const [showToast, setShowToast] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleToast = () => {
    setShowToast(true);
  };
  const handleCloseToast = () => {
    setShowToast(false);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-4 pt-6 flex justify-center pointer-events-none`}>
        <div className={`
          max-w-7xl w-full flex items-center justify-between px-6 py-4 
          transition-all duration-500 pointer-events-auto
          ${scrolled 
            ? "glass-pill rounded-full py-3 shadow-2xl scale-95" 
            : "bg-white/80 rounded-3xl shadow-sm"}
        `}>
          <div className="flex items-center gap-12">
            <Link className="relative flex items-center group" href="/">
              <div className="absolute -inset-4 bg-primary-blue/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Image alt="salutbabe" width={110} height={32} className="relative transition-all duration-500 group-hover:scale-105 active:scale-95" src="/logo-salutbabe.png" />
            </Link>
            
            <nav className="hidden lg:flex items-center gap-1">
              {['Kurumsal', 'Nasıl Çalışır', 'Premium', 'İletişim'].map((item) => (
                <Link 
                  key={item}
                  href={`/${item.toLowerCase().replace(' ', '-')}`} 
                  className="px-5 py-2 rounded-full text-sm font-semibold text-neutral-600 hover:text-primary-blue transition-all duration-300 hover:bg-neutral-50"
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative p-2.5 text-neutral-700 hover:text-primary-pink transition-all duration-300 hover:bg-neutral-50 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-primary-pink text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-lg ring-2 ring-white animate-in zoom-in duration-300">
                  {cartCount}
                </span>
              )}
            </Link>
            
            <button
              className="hidden sm:block px-6 py-2.5 bg-primary-blue text-white rounded-full font-bold text-sm shadow-xl shadow-blue-500/20 hover:bg-primary-pink hover:shadow-pink-500/20 transition-all duration-500 active:scale-95 hover:-translate-y-0.5"
              onClick={handleToast}
            >
              Hemen Başla
            </button>

            <button className="lg:hidden p-2.5 rounded-full bg-neutral-100 text-neutral-900 group" aria-label="Menü">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-180 transition-transform duration-500"><path d="M4 12h16"></path><path d="M4 6h16"></path><path d="M4 18h16"></path></svg>
            </button>
          </div>
        </div>
      </header>
      <CustomToast show={showToast} message="Yakında hizmetinizdeyiz" onClose={handleCloseToast} />
    </>
  );
};

export default FloatingHeader;
