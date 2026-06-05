"use client";

import React, {useEffect, useState} from "react";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {useThemeLanguage} from "../../context/ThemeLanguageContext";
import {API_BASE_URL, apiUrl} from "../../lib/api";
import {useAuthStore} from "../../store/useAuthStore";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme, t, language, setLanguage } = useThemeLanguage();
  
  // -- Auth & Session --
  const { isAuthenticated, user, hydrateStore, logout } = useAuthStore();
  const [authChecked, setAuthChecked] = useState(false);

  // -- UI States --
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string, visible: boolean, type: 'warning' | 'success' | 'error' }>({
    message: '',
    visible: false,
    type: 'warning'
  });
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const showToast = (message: string, type: 'warning' | 'success' | 'error' = 'warning') => {
    setToast({ message, visible: true, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 4000);
  };

  // Hydrate store on mount to pull token/user from localStorage
  useEffect(() => {
    hydrateStore();
    setAuthChecked(true);
  }, [hydrateStore]);

  useEffect(() => {
    if (authChecked && !isAuthenticated) {
      router.push("/login");
    }
  }, [authChecked, isAuthenticated, router]);

  // Notifications
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return;
      
      const [listRes, countRes] = await Promise.all([
        fetch(apiUrl("/notifications?page=1&limit=20"), {
          headers: { "Authorization": `Bearer ${token}`, "X-Device-Type": "web" }
        }),
        fetch(apiUrl("/notifications/unread-count"), {
          headers: { "Authorization": `Bearer ${token}`, "X-Device-Type": "web" }
        })
      ]);

      const data = await listRes.json();
      const countData = await countRes.json();

      if (data.request?.requestResult) {
        const rows = data.payload?.notifications || data.payload?.rows || [];
        setNotifications(rows);
      }
      
      if (countData.request?.requestResult) {
        setUnreadCount(countData.payload?.count || 0);
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
    if (isAuthenticated) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Global Auto Refresh Event Emitter
  useEffect(() => {
    let interval: any;
    if (autoRefresh) {
      interval = setInterval(() => {
        window.dispatchEvent(new CustomEvent('auto-refresh-triggered'));
      }, 10000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (token) {
        await fetch(apiUrl("/auth/sign-out"), {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ closeAllSessions: false })
        });
      }
    } catch (e) {
      console.error("Logout request failed:", e);
    } finally {
      logout();
      window.location.href = "/";
    }
  };

  interface NavItem {
    label: string;
    href?: string;
    desc?: string;
    icon?: React.ReactNode;
    submenus?: { label: string; href: string }[];
  }

  const userType = user?.userType || [];
  const isAdmin = Array.isArray(userType) ? (userType.includes("SYSOP") || userType.includes("ADMIN")) : (userType === "SYSOP" || userType === "ADMIN");

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev => 
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    const implementedRoutes = [
      '/dashboard/sysop',
      '/dashboard/sysop/user-management',
      '/dashboard/sysop/order-management',
      '/dashboard/sysop/shipping-management',
      '/dashboard/sysop/store-management',
      '/dashboard/sysop/product-management',
      '/dashboard/sysop/product-approval',
      '/dashboard/sysop/category-management',
      '/dashboard/sysop/brand-management',
      '/dashboard/sysop/system-settings',
      '/dashboard/common/profile'
    ];

    if (!implementedRoutes.includes(href)) {
      e.preventDefault();
      showToast(t('dashboard.under_construction') || "Bu özellik yapım aşamasındadır.", 'warning');
    }
  };

  const normalUserNav: NavItem[] = [
    { label: t('dashboard.nav_dashboard') || 'Dashboard', href: '/dashboard/common', desc: 'Panelinize hoş geldiniz' },
    { label: t('dashboard.nav_orders') || 'Orders', href: '/dashboard/common/orders', desc: 'Siparişleriniz' },
  ];

  const adminNav: NavItem[] = [
    { 
      label: t('dashboard.nav_dashboard') || 'Overview', 
      href: '/dashboard/sysop', 
      desc: t('dashboard.nav_dashboard_desc') || 'Genel Bakış',
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
      label: t('dashboard.sysop.nav_users') || 'Users', 
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
        { label: t('dashboard.sysop.nav_user_mgmt') || 'User Management', href: '/dashboard/sysop/user-management' },
        { label: t('dashboard.sysop.nav_store_mgmt') || 'Store Management', href: '/dashboard/sysop/store-management' }
      ] 
    },
    { 
      label: t('dashboard.sysop.nav_orders') || 'Orders', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M3 8.5C3 7.11929 4.11929 6 5.5 6H18.5C19.8807 6 21 7.11929 21 8.5V17.5C21 19.9853 18.9853 22 16.5 22H7.5C5.01472 22 3 19.9853 3 17.5V8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 6V4.5C8 3.11929 9.11929 2 10.5 2H13.5C14.8807 2 16 3.11929 16 4.5V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 10H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      submenus: [
        { label: t('dashboard.sysop.nav_order_mgmt') || 'Order Management', href: '/dashboard/sysop/order-management' },
        { label: t('dashboard.sysop.nav_shipping_cos') || 'Shipping Providers', href: '/dashboard/sysop/shipping-management' }
      ] 
    },
    { 
      label: t('dashboard.sysop.nav_products') || 'Products', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 22V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 7L12 12L3 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      submenus: [
        { label: t('dashboard.sysop.nav_products') || 'Product Management', href: '/dashboard/sysop/product-management' },
        { label: t('dashboard.sysop.nav_product_approval') || 'Product Approval', href: '/dashboard/sysop/product-approval' },
        { label: t('dashboard.sysop.nav_categories') || 'Categories', href: '/dashboard/sysop/category-management' },
        { label: t('dashboard.sysop.nav_brands') || 'Brands', href: '/dashboard/sysop/brand-management' }
      ] 
    },
    { 
      label: t('dashboard.sysop.nav_settings') || 'Settings', 
      href: '/dashboard/sysop/system-settings',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19.6224 10.3954L18.4568 8.37738C17.6708 7.01599 17.2778 6.33529 17.5549 5.44781C17.8321 4.56034 18.4727 3.99042 19.7538 2.8506M4.37756 13.6046L5.54316 15.6226C6.3292 16.984 6.72222 6.44505 18.5522C6.16789 19.4397 5.52731 20.0096 4.24615 21.1494M13.6046 4.37756L15.6226 5.54316C16.984 6.3292 17.6647 6.72222 18.5522 6.44505C19.4397 6.16789 20.0096 5.52731 21.1494 4.24615M10.3954 19.6224L8.37738 18.4568C7.01599 17.6708 6.33529 17.2778 5.44781 17.5549C4.56034 17.8321 3.99042 18.4727 2.8506 19.7538M10.3954 4.37756L8.37738 5.54316C7.01599 6.3292 6.33529 6.72222 5.44781 6.44505C4.56034 6.16789 3.99042 5.52731 2.8506 4.24615M13.6046 19.6224L15.6226 18.4568C16.984 17.6708 17.6647 17.2778 18.5522 17.5549C19.4397 17.8321 20.0096 18.4727 21.1494 19.7538M4.37756 10.3954L5.54316 8.37738C6.3292 7.01599 6.72222 6.33529 6.44505 5.44781C6.16789 4.56034 5.52731 3.99042 4.24615 2.8506M19.6224 13.6046L18.4568 15.6226C17.6708 16.984 17.2778 17.6647 17.5549 18.5522C17.8321 19.4397 18.4727 20.0096 19.7538 21.1494" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
  ];

  const activeNav: NavItem[] = isAdmin ? adminNav : normalUserNav;
  const dashboardItem = activeNav[0];
  const otherItems = activeNav.slice(1);
  
  const findActiveMenu = (items: NavItem[]): NavItem => {
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

  // Loading or unauthenticated fallback
  if (!authChecked || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#171923] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#FF6B00]/30 border-t-[#FF6B00] rounded-full animate-spin"></div>
          <span className="text-white/70 font-medium tracking-widest uppercase text-sm animate-pulse">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-[#F5F7FA] dark:bg-[#0B0C10] text-[#1A2332] dark:text-[#E2E8F0] flex transition-colors duration-500 font-sans selection:bg-[#FF6B00]/20">
      
      {/* Mobile Sidebar Backdrop */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-[#0B0C10]/80 backdrop-blur-sm z-[150] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Main Sidebar (Glassmorphism & Glow Effects) */}
      <aside 
        className={`fixed inset-y-0 left-0 z-[200] flex flex-col transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] lg:translate-x-0 ${isMobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} ${isSidebarCollapsed ? 'lg:w-[88px]' : 'lg:w-[280px] w-[280px]'}
          bg-white/70 dark:bg-[#12141C]/80 backdrop-blur-3xl border-r border-white/20 dark:border-white/5 shadow-[0_0_40px_rgba(0,0,0,0.03)] dark:shadow-none`}
      >
        {/* Sidebar Header / Logo */}
        <div className="relative flex items-center justify-center h-24 p-6 shrink-0 group/logo">
          {!isSidebarCollapsed ? (
            <>
              <Link href={dashboardItem.href || '#'} className="flex items-center justify-center group">
                 <img src="/logo-text.png" alt="Logo" className="h-8 w-auto transition-transform duration-300 group-hover:scale-105 brightness-0 dark:brightness-0 dark:invert" />
              </Link>
              <button 
                onClick={() => setIsSidebarCollapsed(true)}
                className="absolute top-4 right-4 w-6 h-6 bg-white dark:bg-[#1A1D27] border border-gray-200 dark:border-gray-800 rounded-md flex items-center justify-center text-gray-400 hover:text-[#FF6B00] shadow-sm transition-all hover:scale-110 hidden lg:flex"
                title="Daralt"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>
              {/* Mobile Close Button */}
              <button 
                onClick={() => setIsMobileSidebarOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white lg:hidden p-1 rounded-md"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsSidebarCollapsed(false)}
              className="relative w-12 h-12 flex items-center justify-center group/expand rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors overflow-hidden"
              title="Genişlet"
            >
              <img 
                src={theme === 'light' ? "/logo-favicon-dark.png" : "/logo-favicon.png"} 
                alt="Logo" 
                className="w-8 h-8 rounded-md object-contain transition-all duration-300 group-hover/expand:scale-110 group-hover/expand:opacity-30" 
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/expand:opacity-100 transition-all duration-300 bg-black/10 dark:bg-white/10 backdrop-blur-[2px]">
                 <svg className="w-5 h-5 text-gray-700 dark:text-white drop-shadow-md translate-x-1 group-hover/expand:translate-x-0 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </div>
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="px-6 mb-4">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent opacity-50"></div>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-1 px-4 pb-4">
          
          {/* Dashboard Item */}
          <Link 
            href={dashboardItem.href || '#'}
            onClick={(e) => handleNavClick(e, dashboardItem.href || '#')}
            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden
              ${pathname === dashboardItem.href 
                ? 'bg-white dark:bg-[#1A1D27] shadow-sm'
                : 'hover:bg-white/50 dark:hover:bg-white/5'
              }`}
          >
            {/* Active Glow Gradient */}
            {pathname === dashboardItem.href && (
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B00]/10 via-[#FF9EBE]/5 to-transparent pointer-events-none"></div>
            )}
            {/* Active Left Indicator */}
            {pathname === dashboardItem.href && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#FF6B00] to-[#5FC8C0] rounded-r-full shadow-[0_0_10px_rgba(255,107,0,0.5)]"></div>
            )}

            <div className={`flex-shrink-0 ${isSidebarCollapsed ? 'mx-auto' : ''}`}>
              <div className={`w-6 h-6 rounded flex items-center justify-center transition-transform duration-300 group-hover:scale-110 
                ${pathname === dashboardItem.href ? 'text-[#FF6B00] drop-shadow-[0_0_8px_rgba(255,107,0,0.3)]' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`}>
                {dashboardItem.icon || (
                  <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
                )}
              </div>
            </div>
            {!isSidebarCollapsed && (
              <span className={`font-bold text-[14px] whitespace-nowrap overflow-hidden text-ellipsis transition-colors
                ${pathname === dashboardItem.href ? 'text-[#1A2332] dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                {dashboardItem.label}
              </span>
            )}
          </Link>

          {/* Sub Items */}
          {otherItems.map((item, idx) => {
            const hasSubmenus = !!item.submenus;
            const isExpanded = expandedMenus.includes(item.label);
            const isActive = item.href === pathname || (item.submenus?.some(sub => sub.href === pathname));
            
            return (
              <div key={idx} className="space-y-1 mt-1">
                {hasSubmenus ? (
                  <>
                    <button 
                      onClick={() => toggleMenu(item.label)}
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden
                        ${isActive && !isExpanded
                          ? 'bg-white dark:bg-[#1A1D27] shadow-sm'
                          : 'hover:bg-white/50 dark:hover:bg-white/5'
                        }`}
                    >
                      {isActive && !isExpanded && (
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B00]/10 via-[#FF9EBE]/5 to-transparent pointer-events-none"></div>
                      )}
                      {isActive && !isExpanded && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#FF6B00] to-[#5FC8C0] rounded-r-full shadow-[0_0_10px_rgba(255,107,0,0.5)]"></div>
                      )}

                      <div className="flex items-center gap-4">
                        <div className={`flex-shrink-0 ${isSidebarCollapsed ? 'mx-auto' : ''}`}>
                          <div className={`w-6 h-6 rounded flex items-center justify-center transition-transform duration-300 group-hover:scale-110 
                            ${isActive ? 'text-[#FF6B00] drop-shadow-[0_0_8px_rgba(255,107,0,0.3)]' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`}>
                            {item.icon}
                          </div>
                        </div>
                        {!isSidebarCollapsed && (
                          <span className={`font-bold text-[14px] whitespace-nowrap transition-colors ${isActive ? 'text-[#1A2332] dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                            {item.label}
                          </span>
                        )}
                      </div>
                      {!isSidebarCollapsed && (
                        <svg className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </button>
                    
                    {!isSidebarCollapsed && (
                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="pl-13 py-2 space-y-1 relative">
                          {/* Left guide line */}
                          <div className="absolute left-7 top-0 bottom-2 w-px bg-gray-200 dark:bg-gray-800"></div>
                          
                          {item.submenus?.map((sub, sIdx) => {
                            const isSubActive = pathname === sub.href;
                            return (
                              <Link 
                                key={sIdx}
                                href={sub.href}
                                onClick={(e) => handleNavClick(e, sub.href || '#')}
                                className={`block relative pl-6 py-2 text-[13px] font-bold transition-all duration-200 rounded-xl hover:bg-white/40 dark:hover:bg-white/5
                                  ${isSubActive ? 'text-[#FF6B00]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                              >
                                {/* Active Dot indicator */}
                                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 transition-all duration-300
                                  ${isSubActive ? 'bg-[#FF6B00] border-[#FF6B00] -ml-[3px] shadow-[0_0_8px_rgba(255,107,0,0.5)]' : 'bg-white dark:bg-[#12141C] border-gray-300 dark:border-gray-700 -ml-[3px]'}`}></div>
                                {sub.label}
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link 
                    href={item.href || '#'}
                    onClick={(e) => handleNavClick(e, item.href || '#')}
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden
                      ${isActive 
                        ? 'bg-white dark:bg-[#1A1D27] shadow-sm'
                        : 'hover:bg-white/50 dark:hover:bg-white/5'
                      }`}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B00]/10 via-[#FF9EBE]/5 to-transparent pointer-events-none"></div>
                    )}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#FF6B00] to-[#5FC8C0] rounded-r-full shadow-[0_0_10px_rgba(255,107,0,0.5)]"></div>
                    )}
                    <div className={`flex-shrink-0 ${isSidebarCollapsed ? 'mx-auto' : ''}`}>
                      <div className={`w-6 h-6 rounded flex items-center justify-center transition-transform duration-300 group-hover:scale-110 
                        ${isActive ? 'text-[#FF6B00] drop-shadow-[0_0_8px_rgba(255,107,0,0.3)]' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`}>
                        {item.icon}
                      </div>
                    </div>
                    {!isSidebarCollapsed && (
                      <span className={`font-bold text-[14px] whitespace-nowrap overflow-hidden text-ellipsis transition-colors
                        ${isActive ? 'text-[#1A2332] dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                        {item.label}
                      </span>
                    )}
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer Actions */}
        <div className="p-4 mt-auto">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent opacity-50 mb-4"></div>
          
          <div className="flex flex-col gap-1 bg-[#F5F7FA] dark:bg-[#1A1D27]/50 rounded-2xl p-2">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className={`flex items-center ${isSidebarCollapsed ? 'justify-center p-3' : 'px-4 py-3'} w-full rounded-xl hover:bg-white dark:hover:bg-[#222533] text-gray-600 dark:text-gray-300 hover:text-[#FF6B00] transition-all group`}
              title="Toggle Theme"
            >
              <div className="flex-shrink-0 group-hover:rotate-12 transition-transform duration-300">
                {theme === 'dark' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                )}
              </div>
              {!isSidebarCollapsed && (
                <span className="ml-3 text-[14px] font-medium">{theme === 'dark' ? 'Light' : 'Dark'}</span>
              )}
            </button>

            {/* Language Toggle */}
            <button 
              onClick={() => {
                const langs: ('tr' | 'en' | 'fr' | 'de')[] = ['tr', 'en', 'fr', 'de'];
                const nextIdx = (langs.indexOf(language) + 1) % langs.length;
                setLanguage(langs[nextIdx]);
              }}
              className={`flex items-center ${isSidebarCollapsed ? 'justify-center p-3' : 'px-4 py-3'} w-full rounded-xl hover:bg-white dark:hover:bg-[#222533] text-gray-600 dark:text-gray-300 hover:text-[#5FC8C0] transition-all group`}
              title="Toggle Language"
            >
              <div className="flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
              </div>
              {!isSidebarCollapsed && (
                <span className="ml-3 text-[14px] font-medium">
                  {language === 'tr' ? 'Türkçe' : language === 'en' ? 'English' : language === 'fr' ? 'Français' : 'Deutsch'}
                </span>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className={`flex-1 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${isSidebarCollapsed ? 'lg:pl-[88px]' : 'lg:pl-[280px]'} pl-0 h-screen relative w-full overflow-hidden`}>
        
        {/* Dynamic Header */}
        <header className="shrink-0 h-20 bg-white/70 dark:bg-[#12141C]/70 backdrop-blur-2xl border-b border-gray-200/50 dark:border-white/5 relative z-[100] px-4 lg:px-8 flex items-center justify-between w-full shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF6B00]/20 to-transparent"></div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-[#1A1D27] shadow-sm text-gray-600 dark:text-gray-300 hover:text-[#FF6B00] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-10 bg-gradient-to-b from-[#FF6B00] to-[#5FC8C0] rounded-full hidden sm:block shadow-[0_0_10px_rgba(255,107,0,0.3)]"></div>
              <div className="flex flex-col justify-center relative">
                 <h1 className="text-xl lg:text-2xl font-black text-[#1A2332] dark:text-white leading-tight tracking-tight relative z-10">{activeMenu?.label || t('dashboard.nav_dashboard')}</h1>
                 <p className="text-[12px] font-bold text-gray-500 dark:text-gray-400 hidden sm:block relative z-10">{activeMenu?.desc || t('dashboard.sysop.default_desc')}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5 relative">
            {/* Auto Refresh Switch */}
            <div className="hidden sm:flex items-center gap-3 mr-2 bg-white dark:bg-[#1A1D27] h-11 px-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md hover:-translate-y-0.5 group">
              <span className="text-[13px] font-bold text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">Oto Yenile</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-[#12141C] shadow-inner peer-checked:after:translate-x-full peer-checked:after:border-transparent after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#FF6B00] peer-checked:to-[#FF8B30] peer-checked:border-none"></div>
              </label>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative w-11 h-11 flex items-center justify-center rounded-xl bg-white dark:bg-[#1A1D27] shadow-sm border border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-[#FF6B00] transition-all hover:shadow-md hover:-translate-y-0.5 group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className={`transition-transform origin-top ${unreadCount > 0 ? 'animate-[bell_2s_ease-in-out_infinite]' : 'group-hover:rotate-12'}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                {unreadCount > 0 && (
                  <>
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-br from-[#FF6B00] to-[#FF3B30] text-[10px] font-black text-white rounded-full flex items-center justify-center border-2 border-white dark:border-[#1A1D27] shadow-sm z-10">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#FF6B00] rounded-full animate-ping opacity-75"></span>
                  </>
                )}
              </button>

              {isNotificationOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotificationOpen(false)}></div>
                  <div className="absolute right-0 top-[calc(100%+12px)] w-80 bg-white dark:bg-[#12141C] border border-gray-100 dark:border-gray-800 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-50 overflow-hidden flex flex-col max-h-[450px] animate-in slide-in-from-top-4 fade-in duration-300">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-black/20">
                      <div>
                        <h3 className="text-[15px] font-black text-[#1A2332] dark:text-white">{t('dashboard.notifications_title') || 'Bildirimler'}</h3>
                        <p className="text-[12px] font-medium text-gray-500 mt-0.5">{unreadCount} Okunmamış</p>
                      </div>
                      <button onClick={handleMarkAllAsRead} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-[#FF6B00] transition-colors" title="Tümünü Okundu İşaretle">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center flex flex-col items-center justify-center">
                          <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mb-3">
                            <svg className="w-8 h-8 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                          </div>
                          <span className="text-[13px] font-bold text-gray-400">Bildirim bulunmuyor</span>
                        </div>
                      ) : (
                        notifications.map((notif: any) => (
                          <div 
                            key={notif.userNotificationID || notif.id || Math.random()} 
                            onClick={() => !notif.isRead && handleMarkAsRead(notif.userNotificationID || notif.id)}
                            className="p-4 border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors relative cursor-pointer flex gap-4 group"
                          >
                            <div className="flex-shrink-0 mt-1">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${!notif.isRead ? 'bg-gradient-to-br from-[#FF6B00] to-[#FF9EBE] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                              </div>
                            </div>
                            <div>
                              <h4 className={`text-[13px] font-bold mb-0.5 ${!notif.isRead ? 'text-[#1A2332] dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                {notif.title || notif.notification?.notificationTitle || notif.notification?.title || 'Bildirim'}
                              </h4>
                              <p className="text-[12px] text-gray-500 leading-snug mb-1.5">{notif.body || notif.message || notif.notification?.notificationContent || notif.notification?.body || ''}</p>
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wide">
                                {(notif.sentDate || notif.createdAt) ? new Date(notif.sentDate || notif.createdAt).toLocaleString(language === 'tr' ? 'tr-TR' : language === 'fr' ? 'fr-FR' : 'en-US') : ''}
                              </span>
                            </div>
                            {!notif.isRead && (
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#FF6B00] rounded-full shadow-[0_0_8px_rgba(255,107,0,0.6)]"></div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* User Profile */}
            <div className="relative group">
              <div 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-3 cursor-pointer p-1.5 rounded-full hover:bg-white dark:hover:bg-[#1A1D27] transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-800"
              >
                <div className="hidden md:flex flex-col items-end mr-1">
                  <span className="text-[13px] font-black text-[#1A2332] dark:text-white leading-tight">{user?.userName || user?.name || 'User'} {user?.userSurname || ''}</span>
                  <span className="text-[11px] font-bold text-gray-400">{isAdmin ? 'Admin' : 'Member'}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF6B00] to-[#5FC8C0] p-[2px] shadow-sm">
                   <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-black border-2 border-white dark:border-[#12141C]">
                     {user?.profilePhotoUrl || user?.profilePhoto || user?.avatar ? (
                       <img 
                         src={(user.profilePhotoUrl || user.profilePhoto || user.avatar)?.startsWith('http') ? (user.profilePhotoUrl || user.profilePhoto || user.avatar) : `${API_BASE_URL}/uploads/profiles/${user.profilePhotoUrl || user.profilePhoto || user.avatar}`} 
                         alt="Profile" 
                         className="w-full h-full object-cover" 
                         onError={(e) => {
                           const target = e.target as HTMLImageElement;
                           target.src = "/logo-favicon.png";
                         }}
                       />
                     ) : (
                       <img src="/logo-favicon.png" alt="Profile" className="w-full h-full object-contain p-1" />
                     )}
                   </div>
                </div>
              </div>
              
              {/* Profile Dropdown */}
              <div className={`absolute right-0 top-[calc(100%+8px)] w-64 bg-white dark:bg-[#1A1D27] border border-gray-100 dark:border-gray-800 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all duration-300 transform origin-top-right z-[110] overflow-hidden 
                ${isProfileMenuOpen ? 'opacity-100 visible scale-100 translate-y-0' : 'opacity-0 invisible scale-95 -translate-y-2'}`}>
                 
                 <div className="relative p-6 bg-gradient-to-br from-[#FF6B00]/10 to-[#5FC8C0]/10 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white dark:border-[#12141C] shadow-sm bg-white dark:bg-[#1A1D27]">
                       {user?.profilePhotoUrl || user?.profilePhoto || user?.avatar ? (
                         <img 
                           src={(user.profilePhotoUrl || user.profilePhoto || user.avatar)?.startsWith('http') ? (user.profilePhotoUrl || user.profilePhoto || user.avatar) : `${API_BASE_URL}/uploads/profiles/${user.profilePhotoUrl || user.profilePhoto || user.avatar}`} 
                           alt="Profile" 
                           className="w-full h-full object-cover" 
                           onError={(e) => {
                             const target = e.target as HTMLImageElement;
                             target.src = "/logo-favicon.png";
                           }}
                         />
                       ) : (
                         <img src="/logo-favicon.png" alt="Profile" className="w-full h-full object-contain p-1" />
                       )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[16px] font-black text-[#1A2332] dark:text-white truncate relative z-10">{user?.userName || user?.name} {user?.userSurname || ''}</p>
                      <p className="text-[12px] font-bold text-gray-500 truncate mt-1 relative z-10">{user?.eMail || user?.userEmail || user?.email || user?.accountCredentials?.eMail || 'demo@salutbabe.com'}</p>
                    </div>
                 </div>
                 
                 <div className="p-2">
                   <Link href="/dashboard/common/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-[#FF6B00] dark:hover:text-white transition-all group">
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-[#FF6B00] dark:group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      {t('dashboard.edit_profile') || 'Edit Profile'}
                   </Link>
                   
                   <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-[#FF6B00] dark:hover:text-white transition-all group text-left">
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-[#FF6B00] dark:group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      {t('dashboard.restart_walkthrough') || 'Restart Walkthrough'}
                   </button>

                   <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-[#FF6B00] dark:hover:text-white transition-all group text-left">
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-[#FF6B00] dark:group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                      {t('dashboard.whats_new') || "What's New"}
                   </button>

                   <div className="h-px bg-gray-200 dark:bg-white/10 my-2 mx-2"></div>

                   <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-red-500 dark:hover:text-white transition-all group text-left">
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-red-500 dark:group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      {t('dashboard.logout') || 'Çıkış Yap'}
                   </button>

                   <div className="h-px bg-gray-200 dark:bg-white/10 my-2 mx-2"></div>

                   <div className="py-2">
                     <p className="text-center text-[12px] font-bold text-gray-500 dark:text-gray-400 mb-3">{t('dashboard.follow_us') || 'Follow Us'}</p>
                     <div className="flex items-center justify-center gap-3">
                       <a href="#" className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#252B3C] border border-transparent dark:border-white/5 flex items-center justify-center text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-[#323644] transition-all shadow-sm">
                         <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                       </a>
                       <a href="#" className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#252B3C] border border-transparent dark:border-white/5 flex items-center justify-center text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-[#323644] transition-all shadow-sm">
                         <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
                       </a>
                       <a href="#" className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#252B3C] border border-transparent dark:border-white/5 flex items-center justify-center text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-[#323644] transition-all shadow-sm">
                         <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                       </a>
                       <a href="#" className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#252B3C] border border-transparent dark:border-white/5 flex items-center justify-center text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-[#323644] transition-all shadow-sm">
                         <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                       </a>
                     </div>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Main Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-8 animate-in slide-in-from-bottom-4 fade-in duration-500 relative z-0 w-full">
          <div className="max-w-[1600px] mx-auto w-full h-full relative">
            {/* Background Glows for Aesthetic */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#FF6B00]/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
            <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#5FC8C0]/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
            
            {/* Content Render */}
            <div className="relative z-10">
              {children}
            </div>
          </div>
        </main>

        {/* Sleek Mini Footer */}
        <footer className="shrink-0 py-2.5 px-6 border-t border-gray-200/50 dark:border-white/5 bg-white/50 dark:bg-[#12141C]/50 backdrop-blur-md relative z-50">
          <div className="flex items-center justify-center max-w-[1600px] mx-auto relative h-6">
            <div className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-[#FF9EBE] to-[#5FC8C0] bg-[length:200%_auto] animate-[brandShift_3s_ease-in-out_infinite] font-black text-[13px] lowercase tracking-normal drop-shadow-sm">
                salutbabe
              </span>
            </div>
            
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
              <div className="group relative ml-2">
                <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-[#FF6B00] hover:bg-[#FF6B00]/10 transition-all cursor-help">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div className="absolute bottom-full right-0 mb-3 px-3 py-2 bg-gray-900 text-white text-[11px] font-bold rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap shadow-xl transform group-hover:-translate-y-1">
                  Dashboard Build v2.0 <br/>
                  <span className="text-gray-400 font-normal">Animated Layout</span>
                  <div className="absolute -bottom-1.5 right-2 w-3 h-3 bg-gray-900 rotate-45"></div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Custom Toast */}
      {toast.visible && (
        <div className="fixed bottom-10 right-10 z-[999] animate-in slide-in-from-right-10 fade-in duration-300">
           <div className={`flex items-center gap-4 px-6 py-4 rounded-3xl border shadow-2xl backdrop-blur-xl min-w-[320px] max-w-md
             ${toast.type === 'warning' 
               ? 'bg-orange-50/90 dark:bg-[#2A1F16]/90 border-orange-200 dark:border-orange-500/20 text-orange-800 dark:text-orange-400 shadow-orange-500/10' 
               : 'bg-green-50/90 dark:bg-[#162A1F]/90 border-green-200 dark:border-green-500/20 text-green-800 dark:text-green-400 shadow-green-500/10'
             }`}>
             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm
               ${toast.type === 'warning' ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'}`}>
               {toast.type === 'warning' ? (
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
               ) : (
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
               )}
             </div>
             <div className="flex-1 pr-4">
                <p className="text-[13px] font-black leading-tight uppercase tracking-widest">{toast.type === 'warning' ? (t('dashboard.toast_warning') || 'Uyarı') : (t('dashboard.toast_success') || 'Başarılı')}</p>
                <p className="text-[13px] font-medium opacity-90 mt-1">{toast.message}</p>
             </div>
             <button onClick={() => setToast(prev => ({ ...prev, visible: false }))} className="w-8 h-8 rounded-full flex items-center justify-center text-inherit opacity-50 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
           </div>
        </div>
      )}

      {/* Global Style for Keyframes */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes brandShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes bell {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(15deg); }
          40% { transform: rotate(-10deg); }
          60% { transform: rotate(5deg); }
          80% { transform: rotate(-5deg); }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
