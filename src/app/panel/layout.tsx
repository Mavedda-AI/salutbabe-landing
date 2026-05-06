"use client";

import React, {useEffect, useState} from "react";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {useThemeLanguage} from "../../context/ThemeLanguageContext";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useThemeLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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

  const mainNav = [
    { id: 'home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', href: '/panel' },
    { id: 'orders', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', href: '/panel/orders' },
    { id: 'stats', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', href: '/panel/stats' },
    { id: 'messages', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z', href: '/panel/messages' },
  ];

  const workspaceNav = [
    { label: 'Sipariş Listesi', count: 20, href: '/panel/orders' },
    { label: 'Sevkiyatlar', count: 8, isNew: true, href: '/panel' },
    { label: 'İade & Değişim', count: 4, href: '/panel/returns' },
  ];

  const settingsNav = [
    { label: 'Takip Sayfası', href: '/panel/tracking' },
    { label: 'Kargo Entegrasyonu', href: '/panel/carriers' },
    { label: 'Otomasyonlar', href: '/panel/automation' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-background text-text-primary flex transition-colors duration-300 font-sans selection:bg-primary/20">
      
      {/* 1. Slim Icon Sidebar */}
      <aside className="w-[70px] bg-white dark:bg-surface border-r border-border-color flex flex-col items-center py-6 fixed inset-y-0 z-[60]">
        <div className="mb-8 p-2 bg-primary/10 rounded-xl">
           <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-black text-xl">s</div>
        </div>
        
        <nav className="flex-1 flex flex-col gap-4">
          {mainNav.map((item) => (
            <Link 
              key={item.id} 
              href={item.href}
              className={`p-3 rounded-xl transition-all duration-300 ${pathname === item.href ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' : 'text-text-secondary hover:bg-primary/5 hover:text-primary'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-4">
          <button onClick={toggleTheme} className="p-3 text-text-secondary hover:text-primary transition-colors">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button className="p-3 text-text-secondary hover:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            </svg>
          </button>
        </div>
      </aside>

      {/* 2. Contextual Sidebar */}
      <aside className={`w-[240px] bg-[#FDFDFF] dark:bg-surface/50 border-r border-border-color fixed inset-y-0 left-[70px] z-50 hidden lg:flex flex-col transition-all duration-300 ${isSidebarCollapsed ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>
        <div className="p-6 pt-10 flex items-center justify-between">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-text-secondary/50">WORKSPACE</h3>
          <button className="text-text-secondary hover:text-primary">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
          </button>
        </div>

        <nav className="px-3 space-y-1">
          {workspaceNav.map((item, idx) => (
            <Link 
              key={idx} 
              href={item.href}
              className={`flex items-center justify-between px-4 py-2.5 rounded-xl font-bold text-[13px] transition-all ${pathname === item.href ? 'bg-white dark:bg-surface text-text-primary shadow-sm' : 'text-text-secondary hover:bg-black/5 hover:text-text-primary'}`}
            >
              <div className="flex items-center gap-2">
                <span>{item.label}</span>
                {item.isNew && <span className="bg-primary/10 text-primary text-[9px] px-1.5 py-0.5 rounded-md font-black tracking-tighter">New {item.count}</span>}
              </div>
              {!item.isNew && <span className="opacity-40 text-[11px]">{item.count}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-6 mt-8">
           <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-text-secondary/50 mb-4">SETTINGS</h3>
           <nav className="space-y-1">
             {settingsNav.map((item, idx) => (
               <Link 
                 key={idx} 
                 href={item.href}
                 className="block px-4 py-2 text-[13px] font-bold text-text-secondary hover:text-primary transition-colors"
               >
                 {item.label}
               </Link>
             ))}
           </nav>
        </div>

        <div className="mt-auto p-6 bg-primary/5 mx-3 mb-6 rounded-2xl border border-primary/10">
           <p className="text-[12px] font-bold text-text-primary mb-1">Yardım mı lazım?</p>
           <button className="text-[11px] font-black text-primary hover:underline">Bize Yazın</button>
        </div>
      </aside>

      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'lg:pl-[70px]' : 'lg:pl-[310px]'} pl-[70px] min-h-screen relative`}>
        
        {/* Header */}
        <header className="h-16 bg-white/95 dark:bg-surface/95 backdrop-blur-md border-b border-border-color sticky top-0 z-[100] px-8 flex items-center justify-between w-full">
          <div className="flex items-center gap-4 text-[13px] font-bold text-text-secondary">
             <span className="hover:text-text-primary cursor-pointer transition-colors whitespace-nowrap">{user?.userName}'s Store</span>
             <span className="opacity-30">/</span>
             <span className="text-text-primary font-black">Shipments</span>
          </div>

          <div className="flex-1 max-w-xl px-12">
            <div className="relative group">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4 group-focus-within:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input 
                type="text" 
                placeholder="Search or Press '/' for commands" 
                className="w-full bg-[#F3F5F9] dark:bg-background border border-transparent focus:border-primary focus:bg-white dark:focus:bg-surface outline-none py-2.5 pl-12 pr-4 rounded-xl text-[13px] font-bold transition-all placeholder:text-text-secondary/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-text-secondary hover:text-primary relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary text-[9px] font-black text-white rounded-full flex items-center justify-center border-2 border-white dark:border-surface">32</span>
            </button>
            <button className="p-2 text-text-secondary hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            </button>
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-black text-[13px] shadow-lg shadow-primary/20 cursor-pointer hover:scale-105 transition-transform">
               {user?.userName?.[0]}{user?.userSurname?.[0]}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-8 animate-fade-in relative z-0">
          {children}
        </main>

        {/* Mini Footer */}
        <footer className="py-6 px-10 border-t border-border-color bg-white dark:bg-surface/30">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-black text-text-secondary/40 uppercase tracking-widest">
              &copy; 2026 salutbabe. Cloud Architecture
            </div>
            <div className="flex items-center gap-6 text-[11px] font-bold text-text-secondary/60">
              <Link href="/terms" className="hover:text-primary transition-colors">Şartlar</Link>
              <Link href="/privacy" className="hover:text-primary transition-colors">Gizlilik</Link>
              <Link href="/support" className="hover:text-primary transition-colors">Destek</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
