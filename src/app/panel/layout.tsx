"use client";

import React, {useEffect, useState} from "react";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {useThemeLanguage} from "../../context/ThemeLanguageContext";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme, t } = useThemeLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    
    if (!token || !userStr) {
      router.push("/login");
    } else {
      try {
        const parsedUser = JSON.parse(userStr);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (e) {
        router.push("/login");
      }
    }
  }, [router]);

  if (!isAuthenticated) return null;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', href: '/panel' },
    { id: 'listings', label: 'Ürünlerim', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', href: '/panel/listings' },
    { id: 'sales', label: 'Satışlarım', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', href: '/panel/sales' },
    { id: 'wallet', label: 'Cüzdan', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', href: '/panel/wallet' },
    { id: 'settings', label: 'Ayarlar', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', href: '/panel/settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("auth_token");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background text-text-primary flex transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-72 bg-surface border-r border-border-color hidden md:flex flex-col fixed inset-y-0 z-50">
        <div className="p-8">
          <Link href="/" className="text-2xl font-black tracking-tighter hover:opacity-80 transition-opacity">
            salutbabe
          </Link>
          <div className="mt-2 text-[10px] font-black uppercase tracking-widest text-primary/60 px-0.5">
            SELLER PANEL
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-4 px-6 py-4 rounded-[2rem] font-bold text-sm transition-all duration-300 ${
                pathname === item.href 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-text-secondary hover:bg-background hover:text-primary'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-border-color space-y-4">
          <button 
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-6 py-4 rounded-[2rem] bg-background border border-border-color font-bold text-xs hover:border-primary transition-all"
          >
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-[2rem] text-red-500 font-bold text-sm hover:bg-red-500/5 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-72 min-h-screen">
        {/* Header */}
        <header className="h-20 bg-background/80 backdrop-blur-md border-b border-border-color sticky top-0 z-40 px-6 md:px-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <button className="md:hidden text-text-primary">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
               </svg>
             </button>
             <h2 className="text-xl font-black text-text-primary">
               {menuItems.find(item => item.href === pathname)?.label || 'Panel'}
             </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-black text-text-primary">{user?.userName} {user?.userSurname}</span>
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-tighter">
                {user?.userType?.[0] || 'Member'}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-surface border border-border-color overflow-hidden flex items-center justify-center">
              {user?.profilePhotoUrl ? (
                <img src={user.profilePhotoUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg font-black text-primary">{user?.userName?.[0]}</span>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 md:p-10 animate-fade-in">
          {children}
        </main>

        {/* Mini Footer */}
        <footer className="py-6 px-10 border-t border-border-color bg-surface/30">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-[11px] font-bold text-text-secondary">
              &copy; 2026 salutbabe. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <Link href="/terms" className="text-[11px] font-bold text-text-secondary hover:text-primary transition-colors">Kullanım Şartları</Link>
              <Link href="/privacy" className="text-[11px] font-bold text-text-secondary hover:text-primary transition-colors">Gizlilik Politikası</Link>
              <Link href="/contact" className="text-[11px] font-bold text-text-secondary hover:text-primary transition-colors">Yardım Merkezi</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
