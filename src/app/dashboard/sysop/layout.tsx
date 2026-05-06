"use client";

import React, {useEffect, useState} from "react";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {useThemeLanguage} from "../../../context/ThemeLanguageContext";
import {API_BASE_URL, apiUrl} from "../../../lib/api";

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

  const handleMarkAsRead = async (notifId: string) => {
    try {
      const token = localStorage.getItem("auth_token");
      await fetch(apiUrl(`/notifications/${notifId}/read`), {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}`, "X-Device-Type": "web" }
      });
      setNotifications(notifications.map(n => 
        (n.userNotificationID === notifId || n.id === notifId) ? { ...n, isRead: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
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

  const userType = user?.userType || [];
  console.log("Logged in User Role:", userType);
  const isAdmin = Array.isArray(userType) ? (userType.includes("SYSOP") || userType.includes("ADMIN")) : (userType === "SYSOP" || userType === "ADMIN");

  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev => 
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  const normalUserNav = [
    { label: t('dashboard.nav_dashboard'), href: '/dashboard/sysop', desc: t('dashboard.nav_dashboard_desc') },
    { label: t('dashboard.nav_customers'), href: '/dashboard/sysop/customers', desc: t('dashboard.nav_customers_desc') },
    { label: t('dashboard.nav_products'), href: '/dashboard/sysop/products', desc: t('dashboard.nav_products_desc') },
    { label: t('dashboard.nav_orders'), href: '/dashboard/sysop/orders', desc: t('dashboard.nav_orders_desc') },
  ];

  const adminNav = [
    { 
      label: t('dashboard.nav_dashboard'), 
      href: '/dashboard/sysop', 
      desc: t('dashboard.nav_dashboard_desc'),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M10 3H3V10H10V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 3H14V10H21V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 14H14V21H21V14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 14H3V21H10V14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    { 
      label: 'Kullanıcılar', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M17 16V18C17 19.1046 16.1046 20 15 20H5C3.89543 20 3 19.1046 3 18V16C3 13.7909 4.79086 12 7 12H13C15.2091 12 17 13.7909 17 16Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 12C12.2091 12 14 10.2091 14 8C14 5.79086 12.2091 4 10 4C7.79086 4 6 5.79086 6 8C6 10.2091 7.79086 12 10 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 16V18C21 18.5523 20.5523 19 20 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M18 12C19.6569 12 21 13.3431 21 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M15 4.5C16.3807 4.5 17.5 5.61929 17.5 7C17.5 8.38071 16.3807 9.5 15 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      submenus: [
        { label: 'Kullanıcı Yönetimi', href: '/dashboard/sysop/admin/users' },
        { label: 'Mağaza Yönetimi', href: '/dashboard/sysop/admin/stores' }
      ] 
    },
    { 
      label: 'Siparişler', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M3 8.5C3 7.11929 4.11929 6 5.5 6H18.5C19.8807 6 21 7.11929 21 8.5V17.5C21 19.9853 18.9853 22 16.5 22H7.5C5.01472 22 3 19.9853 3 17.5V8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 6V4.5C8 3.11929 9.11929 2 10.5 2H13.5C14.8807 2 16 3.11929 16 4.5V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 10H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      submenus: [
        { label: 'Sipariş Yönetimi', href: '/dashboard/sysop/admin/orders' },
        { label: 'Kargo Şirketleri', href: '/dashboard/sysop/admin/shipping' }
      ] 
    },
    { 
      label: 'Yorumlar', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M8 10H16M8 14H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 22H11C13.8284 22 15.2426 22 16.1213 21.1213C17 20.2426 17 18.8284 17 16V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 14V6C21 3.17157 21 1.75736 20.1213 0.87868C19.2426 0 17.8284 0 15 0H7C4.17157 0 2.75736 0 1.87868 0.87868C1 1.75736 1 3.17157 1 6V16C1 18.8284 1 20.2426 1.87868 21.1213C2.75736 22 4.17157 22 7 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      submenus: [
        { label: 'Ürün Yorumları', href: '/dashboard/sysop/admin/reviews' },
        { label: 'Ürün Şikayetleri', href: '/dashboard/sysop/admin/complaints' },
        { label: 'Mağaza Şikayetleri', href: '/dashboard/sysop/admin/store-complaints' },
        { label: 'Kullanıcı Yorumları', href: '/dashboard/sysop/admin/user-reviews' }
      ] 
    },
    { 
      label: 'Ürünler', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 22V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 7L12 12L3 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      submenus: [
        { label: 'Ürünler', href: '/dashboard/sysop/admin/products' },
        { label: 'Kategoriler', href: '/dashboard/sysop/admin/categories' },
        { label: 'Markalar', href: '/dashboard/sysop/admin/brands' }
      ] 
    },
    { 
      label: 'Sistem Ayarları', 
      href: '/dashboard/sysop/admin/settings',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19.6224 10.3954L18.4568 8.37738C17.6708 7.01599 17.2778 6.33529 17.5549 5.44781C17.8321 4.56034 18.4727 3.99042 19.7538 2.8506C19.7538 2.8506 19.7538 2.8506 19.7538 2.8506" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M12 2V4M12 20V22M4 12H2M22 12H20M5.636 5.636L7.05 7.05M16.95 16.95L18.364 18.364M18.364 5.636L16.95 7.05M7.05 16.95L5.636 18.364" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )
    },
  ];

  const activeNav = isAdmin ? adminNav : normalUserNav;
  const dashboardItem = activeNav[0];
  const otherItems = activeNav.slice(1);
  
  // Find active menu for header title
  const findActiveMenu = (items: any[]): any => {
    for (const item of items) {
      if (item.href === pathname) return item;
      if (item.submenus) {
        const activeSub = item.submenus.find((sub: any) => sub.href === pathname);
        if (activeSub) return activeSub;
      }
    }
    return items[0];
  };

  const activeMenu = findActiveMenu(activeNav);

  useEffect(() => {
    if (activeMenu?.label) {
      document.title = `salutbabe | ${activeMenu.label}`;
    }
  }, [activeMenu?.label]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background text-text-primary flex transition-colors duration-300 font-sans selection:bg-primary/20">
      
      {/* Main Sidebar */}
      <aside 
        className={`bg-[#0F172A] border-r border-white/5 fixed inset-y-0 left-0 z-50 hidden lg:flex flex-col transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-[80px]' : 'w-[280px]'}`}
      >
        {/* Sidebar Header / Logo */}
        <div className="relative flex items-center justify-center h-24 p-6">
          {!isSidebarCollapsed ? (
            <>
              <Link href="/dashboard/sysop" className="flex items-center justify-center">
                 <img src="/logo-salutbabe.png" alt="Logo" className="h-7 w-auto brightness-0 invert" />
              </Link>
              <button 
                onClick={() => setIsSidebarCollapsed(true)}
                className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors lg:flex hidden p-1 hover:bg-white/5 rounded-md"
              >
                <img src="/images/icon/collapse.svg" alt="Collapse" className="w-4 h-4 brightness-0 invert opacity-40" />
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsSidebarCollapsed(false)}
              className="relative w-14 h-14 flex items-center justify-center group/expand"
            >
              <img 
                src="/logo-favicon.png" 
                alt="Logo" 
                className="w-full h-full rounded-md object-contain transition-all duration-300 group-hover/expand:opacity-0 group-hover/expand:scale-75" 
              />
              <img 
                src="/images/icon/expand.svg" 
                alt="Expand" 
                className="absolute w-6 h-6 brightness-0 invert opacity-0 group-hover/expand:opacity-100 transition-all duration-300 transform scale-75 group-hover/expand:scale-110" 
              />
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="px-6 mb-4">
          <div className="h-px bg-white/10 w-full"></div>
        </div>

        {/* Dashboard Link (Separate) */}
        <div className="px-4 mb-4">
          <Link 
            href={dashboardItem.href || '#'}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative
              ${pathname === dashboardItem.href 
                ? 'bg-white text-[#1A2332] shadow-lg shadow-white/10' 
                : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
          >
            <div className={`flex-shrink-0 ${isSidebarCollapsed ? 'mx-auto' : ''}`}>
              <div className={`w-5 h-5 rounded flex items-center justify-center ${pathname === dashboardItem.href ? 'text-[#1A2332]' : 'text-inherit'}`}>
                {dashboardItem.icon || (
                  <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                )}
              </div>
            </div>
            {!isSidebarCollapsed && (
              <span className="font-bold text-[13px] whitespace-nowrap overflow-hidden text-ellipsis">{dashboardItem.label}</span>
            )}
          </Link>
        </div>

        {/* Divider */}
        <div className="px-6 mb-4">
          <div className="h-px bg-white/10 w-full"></div>
        </div>

        {/* Navigation (Other Items with Submenus) */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
          {otherItems.map((item, idx) => {
            const hasSubmenus = !!item.submenus;
            const isExpanded = expandedMenus.includes(item.label);
            const isActive = item.href === pathname || (item.submenus?.some(sub => sub.href === pathname));
            
            return (
              <div key={idx} className="space-y-1">
                {hasSubmenus ? (
                  <>
                    <button 
                      onClick={() => toggleMenu(item.label)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group relative
                        ${isActive && !isExpanded
                          ? 'bg-white/10 text-white shadow-sm' 
                          : 'text-white/60 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`flex-shrink-0 ${isSidebarCollapsed ? 'mx-auto' : ''}`}>
                          <div className="w-5 h-5 rounded flex items-center justify-center text-inherit">
                            {item.icon || (
                              <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                              </svg>
                            )}
                          </div>
                        </div>
                        {!isSidebarCollapsed && (
                          <span className="font-bold text-[13px] whitespace-nowrap">{item.label}</span>
                        )}
                      </div>
                      {!isSidebarCollapsed && (
                        <svg className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </button>
                    
                    {/* Submenus */}
                    {!isSidebarCollapsed && isExpanded && (
                      <div className="pl-12 space-y-1 mt-1 animate-in slide-in-from-top-2 duration-200">
                        {item.submenus?.map((sub, sIdx) => (
                          <Link 
                            key={sIdx}
                            href={sub.href}
                            className={`block py-2 text-[12px] font-bold transition-all hover:text-white
                              ${pathname === sub.href ? 'text-white' : 'text-white/40'}`}
                          >
                            • {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link 
                    href={item.href || '#'}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative
                      ${pathname === item.href 
                        ? 'bg-white text-[#1A2332] shadow-lg shadow-white/10' 
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                  >
                    <div className={`flex-shrink-0 ${isSidebarCollapsed ? 'mx-auto' : ''}`}>
                      <div className={`w-5 h-5 rounded flex items-center justify-center ${pathname === item.href ? 'text-[#1A2332]' : 'text-inherit'}`}>
                        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                      </div>
                    </div>
                    {!isSidebarCollapsed && (
                      <span className="font-bold text-[13px] whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>
                    )}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/5 space-y-3">
          {!isSidebarCollapsed && (
            <>
              <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 hover:text-white text-[12px] font-bold transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                Fleet Overview
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 hover:text-white text-[9px] font-bold transition-all">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Statistik
                </button>
                <button className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 hover:text-white text-[9px] font-bold transition-all">
                   <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   Support
                </button>
              </div>
            </>
          )}

          {/* Theme & Language Toggles */}
          <div className={`flex ${isSidebarCollapsed ? 'flex-col items-center gap-4' : 'items-center justify-between px-2'} pt-2`}>
            <button 
              onClick={toggleTheme}
              className="flex items-center gap-3 text-white/60 hover:text-white transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10">
                {theme === 'dark' ? '☀️' : '🌙'}
              </div>
              {!isSidebarCollapsed && <span className="text-[12px] font-bold">{theme === 'dark' ? 'Heller' : 'Dunkel'}</span>}
            </button>

            <button className="flex items-center gap-3 text-white/60 hover:text-white transition-all group">
               <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5a18.022 18.022 0 01-3.827-5.802m3.37 6.087a19.245 19.245 0 002.046-3.815m3.046 0a21.43 21.43 0 01-1.048-9.5H3m12.048 9.5c.134.754.216 1.525.24 2.308M12 21l6-6m-6 6l-6-6" /></svg>
               </div>
               {!isSidebarCollapsed && <span className="text-[12px] font-bold">Deutsch</span>}
            </button>
          </div>
        </div>
      </aside>

      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'lg:pl-[80px]' : 'lg:pl-[280px]'} pl-0 min-h-screen relative`}>
        
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
                className="p-2.5 text-text-secondary hover:text-primary relative transition-all hover:scale-110 active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-[#FF3B30] text-[10px] font-black text-white rounded-full flex items-center justify-center border-2 border-white dark:border-surface shadow-md">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {isNotificationOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotificationOpen(false)}></div>
                  <div className="absolute right-0 top-full mt-2 w-80 bg-surface text-text-primary dark:text-white border border-border-color rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[500px]">
                    <div className="p-4 border-b border-border-color flex items-center justify-between bg-gray-50 dark:bg-background">
                      <div>
                        <h3 className="text-[14px] font-bold text-text-primary dark:text-white">{t('dashboard.notifications_title')}</h3>
                        <p className="text-[11px] text-text-secondary dark:text-text-secondary mt-0.5">{t('dashboard.notifications_unread').replace('{count}', unreadCount.toString())}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={handleMarkAllAsRead} className="text-[11px] font-bold text-primary hover:underline">
                          {t('dashboard.notifications_mark_read')}
                        </button>
                        <button onClick={() => setIsNotificationOpen(false)} className="text-text-secondary hover:text-text-primary">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto bg-surface">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-[12px] text-text-secondary">{t('dashboard.notifications_empty')}</div>
                      ) : (
                        notifications.map((notif: any) => (
                          <div 
                            key={notif.userNotificationID || notif.id || Math.random()} 
                            onClick={() => !notif.isRead && handleMarkAsRead(notif.userNotificationID || notif.id)}
                            className="p-4 border-b border-border-color hover:bg-black/5 dark:hover:bg-white/5 transition-colors relative cursor-pointer"
                          >
                            <div className="flex gap-3">
                              <div className="mt-1 flex-shrink-0">
                                <div className={`w-2 h-2 rounded-full ${!notif.isRead ? 'bg-primary' : 'bg-transparent'}`}></div>
                              </div>
                              <div>
                                <h4 className="text-[13px] font-bold text-text-primary mb-1">{notif.title || notif.notification?.title || 'Bildirim'}</h4>
                                <p className="text-[12px] text-text-secondary leading-snug mb-2">{notif.body || notif.message || notif.notification?.body || ''}</p>
                                <span className="text-[10px] font-bold text-text-secondary/80">
                                  {(notif.sentDate || notif.createdAt) ? new Date(notif.sentDate || notif.createdAt).toLocaleString() : ''}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    
                    <div className="p-3 border-t border-border-color bg-gray-50 dark:bg-background">
                      <button onClick={() => setIsNotificationOpen(false)} className="w-full py-2 text-center text-[12px] font-bold text-text-secondary hover:text-text-primary hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors">
                        {t('dashboard.notifications_close')}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="relative group">
              <div className="w-11 h-11 rounded-full bg-white dark:bg-surface flex items-center justify-center cursor-pointer hover:scale-105 transition-transform overflow-hidden border-2 border-border-color shadow-sm relative z-10">
                 {user?.profilePhotoUrl ? (
                   <img 
                     src={user.profilePhotoUrl.startsWith('http') ? user.profilePhotoUrl : `${API_BASE_URL}/uploads/profiles/${user.profilePhotoUrl}`} 
                     alt="Profile" 
                     className="w-full h-full object-cover" 
                     onError={(e) => {
                       const target = e.target as HTMLImageElement;
                       target.src = "/logo-favicon.png";
                     }}
                   />
                 ) : (
                   <img src="/logo-favicon.png" alt="Profile" className="w-full h-full object-contain" />
                 )}
              </div>
                     {/* Profile Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-surface border border-border-color rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100 z-[110] overflow-hidden">
                 <div className="p-5 bg-gray-50 dark:bg-white/5 border-b border-border-color">
                    <p className="text-[14px] font-black text-text-primary truncate leading-tight">{user?.userName} {user?.userSurname}</p>
                    <p className="text-[11px] font-medium text-text-secondary truncate mt-0.5">{user?.userEmail || user?.email || 'demo@salutbabe.com'}</p>
                 </div>
                 <div className="p-2">
                   <Link href="/panel/settings" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[12px] font-bold text-text-secondary hover:bg-primary/5 hover:text-primary transition-all">
                      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      {t('dashboard.profile_settings')}
                   </Link>
                   <button 
                     onClick={handleLogout}
                     className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[12px] font-bold text-red-500 hover:bg-red-500/5 transition-all text-left"
                   >
                      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
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
