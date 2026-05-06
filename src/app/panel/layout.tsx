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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("auth_token");
    window.location.href = "/";
  };

  if (!isAuthenticated) return null;

  const userType = user?.userType || [];
  console.log("Logged in User Role:", userType);
  const isAdmin = Array.isArray(userType) ? (userType.includes("SYSOP") || userType.includes("ADMIN")) : (userType === "SYSOP" || userType === "ADMIN");

  const normalUserNav = [
    { label: 'Dashboard', href: '/panel', desc: 'Mağaza özetiniz ve istatistikler' },
    { label: 'Müşteri Yönetimi', href: '/panel/customers', desc: 'Müşterileriniz ve iletişim geçmişi' },
    { label: 'Ürün Yönetimi', href: '/panel/products', desc: 'Ürün ekleme ve stok yönetimi' },
    { label: 'Sipariş Yönetimi', href: '/panel/orders', desc: 'Siparişler, kargo ve iadeler' },
  ];

  const adminNav = [
    { label: 'Kullanıcı Yönetimi', href: '/panel/admin/users', desc: 'Sistem kullanıcıları ve yetkilendirme' },
    { label: 'Ürün Yönetimi', href: '/panel/admin/products', desc: 'Tüm ürünler ve onay süreçleri' },
    { label: 'Ürün Şikayetleri', href: '/panel/admin/complaints', desc: 'Şikayet inceleme ve çözümleri' },
    { label: 'Yorum Yönetimi', href: '/panel/admin/reviews', desc: 'Müşteri yorumları ve moderasyon' },
    { label: 'Ürün Soruları', href: '/panel/admin/questions', desc: 'Satıcılara sorulan soruların takibi' },
    { label: 'Sistem Ayarları', href: '/panel/admin/settings', desc: 'Komisyon oranları ve genel ayarlar' },
  ];

  const activeNav = isAdmin ? adminNav : normalUserNav;
  const activeMenu = activeNav.find(item => pathname === item.href) || activeNav[0];


  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-background text-text-primary flex transition-colors duration-300 font-sans selection:bg-primary/20">
      
      {/* Main Sidebar */}
      <aside className={`w-[280px] bg-[#FDFDFF] dark:bg-surface/50 border-r border-border-color fixed inset-y-0 left-0 z-50 hidden lg:flex flex-col transition-all duration-300 ${isSidebarCollapsed ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>
        <div className="p-6 pt-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20">s</div>
            <h3 className="text-[13px] font-black uppercase tracking-[0.2em] text-text-primary">SALUTBABE</h3>
          </div>
          <button onClick={toggleTheme} className="text-text-secondary hover:text-primary transition-colors">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>

        <div className="px-6 mt-4 mb-2">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary/50">MENÜ</h3>
        </div>

        <nav className="px-3 space-y-1">
          {activeNav.map((item, idx) => (
            <Link 
              key={idx} 
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-xl font-bold text-[13px] transition-all ${pathname === item.href ? 'bg-white dark:bg-surface text-text-primary shadow-sm' : 'text-text-secondary hover:bg-black/5 hover:text-text-primary'}`}
            >
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>



        <div className="mt-auto p-6 bg-primary/5 mx-3 mb-6 rounded-2xl border border-primary/10">
           <p className="text-[12px] font-bold text-text-primary mb-1">Yardım mı lazım?</p>
           <button className="text-[11px] font-black text-primary hover:underline">Bize Yazın</button>
        </div>
      </aside>

      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'lg:pl-0' : 'lg:pl-[280px]'} pl-0 min-h-screen relative`}>
        
        {/* Header */}
        <header className="h-20 bg-white/95 dark:bg-surface/95 backdrop-blur-md border-b border-border-color sticky top-0 z-[100] px-8 flex items-center justify-between w-full">
          <div className="flex flex-col justify-center">
             <h1 className="text-xl font-black text-text-primary leading-tight">{activeMenu?.label || "Dashboard"}</h1>
             <p className="text-[12px] font-bold text-text-secondary">{activeMenu?.desc || "Genel istatistikler ve özetler"}</p>
          </div>

          <div className="flex-1"></div>

          <div className="flex items-center gap-4 relative group">
            <button className="p-2 text-text-secondary hover:text-primary relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary text-[9px] font-black text-white rounded-full flex items-center justify-center border-2 border-white dark:border-surface">32</span>
            </button>
            
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-black text-[13px] shadow-lg shadow-primary/20 cursor-pointer hover:scale-105 transition-transform overflow-hidden peer">
                 {user?.profilePhotoUrl ? (
                   <img src={user.profilePhotoUrl} alt="Profile" className="w-full h-full object-cover" />
                 ) : (
                   <span>{user?.userName?.[0]}{user?.userSurname?.[0]}</span>
                 )}
              </div>
              
              {/* Profile Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-surface border border-border-color rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100 z-[110]">
                 <div className="p-4 border-b border-border-color">
                    <p className="text-[12px] font-black text-text-primary truncate">{user?.userName} {user?.userSurname}</p>
                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-tighter">Satıcı Hesabı</p>
                 </div>
                 <div className="p-2">
                   <Link href="/panel/settings" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[12px] font-bold text-text-secondary hover:bg-primary/5 hover:text-primary transition-all">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      Profil Ayarları
                   </Link>
                   <button 
                     onClick={handleLogout}
                     className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[12px] font-bold text-red-500 hover:bg-red-500/5 transition-all text-left"
                   >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Çıkış Yap
                   </button>
                 </div>
              </div>
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
            <div className="text-[10px] font-bold text-text-secondary/60 uppercase tracking-wider">
              developed by <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#7b61ff] font-black lowercase text-[12px]">salutbabe</span> . All rights reserved.
            </div>
            <div className="relative group flex items-center">
              <svg className="w-4 h-4 text-text-secondary/40 hover:text-primary transition-colors cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-text-primary text-background text-[10px] font-black rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap shadow-lg">
                Build v0.1.0
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
