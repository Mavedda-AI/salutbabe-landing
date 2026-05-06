"use client";

import React, {useEffect, useState} from "react";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {useThemeLanguage} from "../../context/ThemeLanguageContext";
import {API_BASE_URL} from "../../lib/api";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme, t } = useThemeLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return;
      const res = await fetch(apiUrl("/notifications?page=1&limit=20"), {
        headers: { "Authorization": `Bearer ${token}`, "X-Device-Type": "web" }
      });
      const data = await res.json();
      if (data.request?.requestResult) {
        const rows = data.payload?.notifications || data.payload?.rows || [];
        setNotifications(rows);
        const unreadRows = rows.filter((n: any) => !n.isRead).length;
        setUnreadCount(data.payload?.unreadCount ?? unreadRows);
      }
    } catch (e) {
      console.error("Notifications fetch failed:", e);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      await fetch(apiUrl("/notifications/read-all"), {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}`, "X-Device-Type": "web" }
      });
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error(e);
    }
  };

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

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

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
    { label: t('dashboard.nav_dashboard'), href: '/panel', desc: t('dashboard.nav_dashboard_desc') },
    { label: t('dashboard.nav_customers'), href: '/panel/customers', desc: t('dashboard.nav_customers_desc') },
    { label: t('dashboard.nav_products'), href: '/panel/products', desc: t('dashboard.nav_products_desc') },
    { label: t('dashboard.nav_orders'), href: '/panel/orders', desc: t('dashboard.nav_orders_desc') },
  ];

  const adminNav = [
    { label: t('dashboard.nav_admin_users'), href: '/panel/admin/users', desc: t('dashboard.nav_admin_users_desc') },
    { label: t('dashboard.nav_admin_products'), href: '/panel/admin/products', desc: t('dashboard.nav_admin_products_desc') },
    { label: t('dashboard.nav_admin_complaints'), href: '/panel/admin/complaints', desc: t('dashboard.nav_admin_complaints_desc') },
    { label: t('dashboard.nav_admin_reviews'), href: '/panel/admin/reviews', desc: t('dashboard.nav_admin_reviews_desc') },
    { label: t('dashboard.nav_admin_questions'), href: '/panel/admin/questions', desc: t('dashboard.nav_admin_questions_desc') },
    { label: t('dashboard.nav_admin_settings'), href: '/panel/admin/settings', desc: t('dashboard.nav_admin_settings_desc') },
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
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary/50">{t('dashboard.menu')}</h3>
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
           <p className="text-[12px] font-bold text-text-primary mb-1">{t('dashboard.need_help')}</p>
           <button className="text-[11px] font-black text-primary hover:underline">{t('dashboard.contact_us')}</button>
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

          <div className="flex items-center gap-4 relative">
            <div className="relative">
              <button 
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="p-2 text-text-secondary hover:text-primary relative"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#5FC8C0] text-[9px] font-black text-white rounded-full flex items-center justify-center border-2 border-white dark:border-surface">{unreadCount}</span>
                )}
              </button>

              {isNotificationOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotificationOpen(false)}></div>
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-[#232C41] text-text-primary dark:text-white border border-border-color dark:border-[#3A455C] rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[500px]">
                    <div className="p-4 border-b border-border-color dark:border-[#3A455C] flex items-center justify-between bg-gray-50 dark:bg-[#1B2333]">
                      <div>
                        <h3 className="text-[14px] font-bold text-text-primary dark:text-white">{t('dashboard.notifications_title')}</h3>
                        <p className="text-[11px] text-text-secondary dark:text-gray-400 mt-0.5">{t('dashboard.notifications_unread').replace('{count}', unreadCount.toString())}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={handleMarkAllAsRead} className="text-[11px] font-bold text-[#5FC8C0] hover:underline">
                          {t('dashboard.notifications_mark_read')}
                        </button>
                        <button onClick={() => setIsNotificationOpen(false)} className="text-text-secondary hover:text-text-primary dark:text-gray-400 dark:hover:text-white">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto bg-white dark:bg-[#232C41]">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-[12px] text-text-secondary dark:text-gray-400">{t('dashboard.notifications_empty')}</div>
                      ) : (
                        notifications.map((notif: any) => (
                          <div key={notif.userNotificationID || notif.id || Math.random()} className="p-4 border-b border-border-color dark:border-[#3A455C] hover:bg-black/5 dark:hover:bg-[#2A354E] transition-colors relative cursor-pointer">
                            <div className="flex gap-3">
                              <div className="mt-1 flex-shrink-0">
                                <div className={`w-2 h-2 rounded-full ${!notif.isRead ? 'bg-[#5FC8C0]' : 'bg-transparent'}`}></div>
                              </div>
                              <div>
                                <h4 className="text-[13px] font-bold text-text-primary dark:text-white mb-1">{notif.title || 'Bildirim'}</h4>
                                <p className="text-[12px] text-text-secondary dark:text-gray-300 leading-snug mb-2">{notif.body || notif.message}</p>
                                <span className="text-[10px] font-bold text-text-secondary/80 dark:text-gray-500">
                                  {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : ''}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    
                    <div className="p-3 border-t border-border-color dark:border-[#3A455C] bg-gray-50 dark:bg-[#1B2333]">
                      <button onClick={() => setIsNotificationOpen(false)} className="w-full py-2 text-center text-[12px] font-bold text-text-secondary hover:text-text-primary hover:bg-black/5 dark:text-white dark:hover:bg-[#2A354E] rounded-lg transition-colors">
                        {t('dashboard.notifications_close')}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="relative group">
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-black text-[13px] shadow-lg shadow-primary/20 cursor-pointer hover:scale-105 transition-transform overflow-hidden peer">
                 {user?.profilePhotoUrl ? (
                   <img 
                     src={user.profilePhotoUrl.startsWith('http') ? user.profilePhotoUrl : `${API_BASE_URL}/uploads/profiles/${user.profilePhotoUrl}`} 
                     alt="Profile" 
                     className="w-full h-full object-cover" 
                     onError={(e) => {
                       // Fallback in case image fails to load
                       const target = e.target as HTMLImageElement;
                       target.style.display = 'none';
                       target.parentElement!.innerHTML = `<span>${user?.userName?.[0] || 'U'}${user?.userSurname?.[0] || ''}</span>`;
                     }}
                   />
                 ) : (
                   <span>{user?.userName?.[0]}{user?.userSurname?.[0]}</span>
                 )}
              </div>
              
              {/* Profile Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-surface border border-border-color rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100 z-[110]">
                 <div className="p-4 border-b border-border-color">
                    <p className="text-[12px] font-black text-text-primary truncate">{user?.userName} {user?.userSurname}</p>
                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-tighter">{t('dashboard.seller_account')}</p>
                 </div>
                 <div className="p-2">
                   <Link href="/panel/settings" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[12px] font-bold text-text-secondary hover:bg-primary/5 hover:text-primary transition-all">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      {t('dashboard.profile_settings')}
                   </Link>
                   <button 
                     onClick={handleLogout}
                     className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[12px] font-bold text-red-500 hover:bg-red-500/5 transition-all text-left"
                   >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      {t('dashboard.logout')}
                   </button>
                 </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-8 animate-fade-in relative z-0 overflow-y-auto">
          {children}
        </main>

        {/* Mini Footer */}
        <footer className="py-3 px-6 border-t border-border-color bg-white dark:bg-surface sticky bottom-0 z-50">
          <div className="flex items-center justify-center relative">
            <div className="text-[10px] font-bold text-text-secondary/60 lowercase tracking-wider text-center">
              {t('dashboard.developed_by')} <span className="text-transparent bg-clip-text font-black text-[12px] bg-[linear-gradient(110deg,#FF007A_0%,#00B2FF_50%,#FF007A_100%)] bg-[length:200%_auto] animate-[brandShift_5.2s_ease-in-out_infinite]" style={{ WebkitTextStroke: "0.05em transparent" }}>salutbabe</span> {t('dashboard.all_rights')}
            </div>
            <div className="absolute right-0 group flex items-center">
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
