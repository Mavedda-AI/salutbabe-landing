"use client";

import React, {useEffect, useState} from "react";
import Link from "next/link";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const leftNav = [
    { label: "SHOP", href: "/shop" },
    { label: "MEN", href: "/category/men" },
    { label: "WOMEN", href: "/category/women" },
    { label: "TRENDING", href: "/category/trending" },
  ];

  const rightNav = [
    { label: "SEASONAL", href: "/category/seasonal" },
    { label: "ACCESSORIES", href: "/category/accessories" },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ease-in-out px-4 py-4 md:px-8 flex justify-center`}
    >
      <div 
        className={`
          max-w-7xl w-full bento-item glass-panel flex items-center justify-between px-8 py-3
          transition-all duration-700 ease-in-out
          ${scrolled ? "rounded-full py-2 scale-[0.98] mt-2 shadow-2xl" : "rounded-[2.5rem] mt-4"}
        `}
      >
        {/* Left Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {leftNav.map((item) => (
            <Link 
              key={item.label}
              href={item.href}
              className="text-[11px] tracking-widest font-black text-slate-800 hover:text-primary-blue transition-colors duration-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Centered Logo */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
          <Link href="/" className="relative group">
            <div className="absolute -inset-4 bg-primary-blue/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative font-black text-2xl tracking-tight text-slate-900 group-hover:scale-105 transition-transform duration-500">
              SALUTBABE
            </div>
          </Link>
        </div>

        {/* Right Navigation & Auth */}
        <div className="flex items-center gap-8">
          <nav className="hidden xl:flex items-center gap-8">
            {rightNav.map((item) => (
              <Link 
                key={item.label}
                href={item.href}
                className="text-[11px] tracking-widest font-black text-slate-800 hover:text-primary-blue transition-colors duration-300"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link 
              href="/login"
              className="px-6 py-2 bg-slate-900 text-white rounded-full text-[11px] font-black tracking-widest hover:bg-slate-800 transition-all duration-300 active:scale-95"
            >
              SIGN IN / UP
            </Link>
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100/50 hover:bg-white transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-900">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
