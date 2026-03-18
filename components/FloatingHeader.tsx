import React from "react";
import Link from "next/link";
import Image from "next/image";

const FloatingHeader = () => (
  <header className="premium-header fixed top-0 left-0 right-0 z-9999 transition-all duration-500 ease-out px-4 md:px-8 py-4 bg-white">
    <div className="mx-auto max-w-7xl transition-all duration-700 ease-in-out border backdrop-blur-3xl flex items-center justify-between px-4 sm:px-6 py-3 rounded-4xl bg-white border-black/5 dark:border-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]">
      <div className="flex items-center gap-4 sm:gap-8 w-full">
        <Link className="relative flex items-center group" href="/">
          <div className="absolute -inset-2 bg-linear-to-r from-red-500/20 to-blue-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <Image alt="salutbabe logo" width={130} height={38} className="relative transition-transform duration-500 group-hover:scale-105" src="/logo-salutbabe.png" style={{ color: "transparent" }} />
        </Link>
        {/* Removed Bireysel/Kurumsal section */}
        <nav className="hidden lg:flex items-center gap-2 flex-1 justify-center">
          <a className="relative group px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 hover:text-pink-600 text-neutral-600" href="/kurumsal">Kurumsal</a>
          <a className="relative group px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 hover:text-pink-600 text-neutral-600" href="/nasilcalisir">Nasıl Çalışır</a>
          <a className="relative group px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 hover:text-pink-600 text-neutral-600" href="/premium">Premium</a>
          <a className="relative group px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 hover:text-pink-600 text-neutral-600" href="/iletisim">İletişim</a>
        </nav>
        <div className="flex items-center gap-2 ml-auto">
          <a href="/acik-artirmalar" className="px-6 py-2 bg-pink-600 text-white rounded-full font-bold text-base shadow-lg hover:bg-blue-600 transition">Hemen Başla</a>
          {/* Mobile Menu Button */}
          <button className="lg:hidden p-2.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white" aria-label="Menüyü aç">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu" aria-hidden="true"><path d="M4 5h16"></path><path d="M4 12h16"></path><path d="M4 19h16"></path></svg>
          </button>
        </div>
      </div>
    </div>
  </header>
);

export default FloatingHeader;
