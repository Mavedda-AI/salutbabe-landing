"use client";

import React, {useEffect, useState} from "react";

import {
  Alert01Icon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  BulbIcon,
  Cancel01Icon,
  CheckmarkBadge01Icon,
  DashboardCircleIcon,
  GlobalIcon,
  InboxIcon,
  InformationCircleIcon,
  Logout01Icon,
  Menu01Icon,
  Moon01Icon,
  Notification03Icon,
  PencilEdit01Icon,
  RefreshIcon,
  Settings01Icon,
  ShoppingCart01Icon,
  Store01Icon,
  Sun01Icon,
  TickDouble01Icon,
  UserGroupIcon
} from 'hugeicons-react';

import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {useThemeLanguage} from "../../context/ThemeLanguageContext";
import {API_BASE_URL, apiUrl} from "../../lib/api";
import {useAuthStore} from "../../store/useAuthStore";
import {useAdminStore} from "../../store/useAdminStore";

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
  const pendingListingCount = useAdminStore(state => state.pendingListingCount);
  const layoutMode = useAdminStore(state => state.layoutMode);
  const setLayoutMode = useAdminStore(state => state.setLayoutMode);

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
        }).catch(() => null),
        fetch(apiUrl("/notifications/unread-count"), {
          headers: { "Authorization": `Bearer ${token}`, "X-Device-Type": "web" }
        }).catch(() => null)
      ]);

      if (!listRes || !countRes) return; // Silent return if backend is unreachable

      let data: any = {};
      let countData: any = {};

      if (listRes.ok && listRes.headers.get('content-type')?.includes('application/json')) {
        data = await listRes.json();
      }
      if (countRes.ok && countRes.headers.get('content-type')?.includes('application/json')) {
        countData = await countRes.json();
      }

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
  const isAdminRole = Array.isArray(userType) ? (userType.includes("SYSOP") || userType.includes("ADMIN")) : (userType === "SYSOP" || userType === "ADMIN");
  const allowedEmails = ["mustafamavedda@gmail.com", "cansumavedda@gmail.com", "hidirektor@gmail.com"];
  const userEmail = user?.email || user?.eMail || "";
  const isWhitelisted = allowedEmails.includes(userEmail.toLowerCase());
  const isAdmin = isAdminRole || isWhitelisted;
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
      return;
    }

    // Automatically close the mobile sidebar upon successful navigation
    if (window.innerWidth < 1024) { // 1024px is the lg breakpoint
      setIsMobileSidebarOpen(false);
    } else {
      // Just in case it's open
      setIsMobileSidebarOpen(false);
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
        <DashboardCircleIcon size={24} />
      )
    },
    {
      label: t('dashboard.sysop.nav_product_approval') || 'Product Approval',
      href: '/dashboard/sysop/product-approval',
      icon: (
        <CheckmarkBadge01Icon size={24} />
      )
    },
    { 
      label: t('dashboard.sysop.nav_users') || 'Users', 
      icon: (
        <UserGroupIcon size={24} />
      ),
      submenus: [
        { label: t('dashboard.sysop.nav_user_mgmt') || 'User Management', href: '/dashboard/sysop/user-management' },
        { label: t('dashboard.sysop.nav_store_mgmt') || 'Store Management', href: '/dashboard/sysop/store-management' }
      ] 
    },
    { 
      label: t('dashboard.sysop.nav_orders') || 'Orders', 
      icon: (
        <ShoppingCart01Icon size={24} />
      ),
      submenus: [
        { label: t('dashboard.sysop.nav_order_mgmt') || 'Order Management', href: '/dashboard/sysop/order-management' },
        { label: t('dashboard.sysop.nav_shipping_cos') || 'Shipping Providers', href: '/dashboard/sysop/shipping-management' }
      ] 
    },
    { 
      label: t('dashboard.sysop.nav_products') || 'Products', 
      icon: (
        <Store01Icon size={24} />
      ),
      submenus: [
        { label: t('dashboard.sysop.nav_products') || 'Product Management', href: '/dashboard/sysop/product-management' },
        { label: t('dashboard.sysop.nav_categories') || 'Categories', href: '/dashboard/sysop/category-management' },
        { label: t('dashboard.sysop.nav_brands') || 'Brands', href: '/dashboard/sysop/brand-management' }
      ] 
    },
    { 
      label: t('dashboard.sysop.nav_settings') || 'Settings', 
      href: '/dashboard/sysop/system-settings',
      icon: (
        <Settings01Icon size={24} />
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
          <div className="w-12 h-12 border-4 border-[#54E6D4]/30 border-t-[#54E6D4] rounded-full animate-spin"></div>
          <span className="text-white/70 font-medium tracking-widest uppercase text-sm animate-pulse">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-[#FEFEFE] dark:bg-[#0B0C10] text-[#101516] dark:text-[#E2E8F0] flex transition-colors duration-500 font-sans selection:bg-black/10 dark:selection:bg-white/10">
      
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
          bg-[#FEFEFE] dark:bg-[#12141C] border-r border-gray-200 dark:border-white/5 shadow-[0_0_40px_rgba(0,0,0,0.03)] dark:shadow-none`}
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
                className="absolute top-4 right-4 w-6 h-6 bg-white dark:bg-[#1A1D27] border border-gray-200 dark:border-gray-800 rounded-md flex items-center justify-center text-gray-400 hover:text-[#54E6D4] shadow-sm transition-all hover:scale-110 hidden lg:flex"
                title="Daralt"
              >
                <ArrowLeft01Icon size={14} />
              </button>
              {/* Mobile Close Button */}
              <button 
                onClick={() => setIsMobileSidebarOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white lg:hidden p-1 rounded-md"
              >
                <Cancel01Icon size={24} />
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
                 <ArrowRight01Icon size={20} className="text-gray-700 dark:text-white drop-shadow-md translate-x-1 group-hover/expand:translate-x-0 transition-transform" />
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
            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative outline-none focus:outline-none focus:ring-0
              ${pathname === dashboardItem.href 
                ? 'bg-white dark:bg-[#1A1D27] shadow-sm'
                : 'hover:bg-white/50 dark:hover:bg-white/5'
              }`}
          >
            {/* Active Glow Gradient */}
            {pathname === dashboardItem.href && (
              <div className="absolute inset-0 rounded-2xl bg-black/5 dark:bg-white/5 pointer-events-none"></div>
            )}
            {/* Active Left Indicator */}
            {pathname === dashboardItem.href && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-black dark:bg-white rounded-r-full"></div>
            )}

            <div className={`flex-shrink-0 ${isSidebarCollapsed ? 'mx-auto' : ''}`}>
              <div className={`w-6 h-6 rounded flex items-center justify-center transition-transform duration-300 group-hover:scale-110 
                ${pathname === dashboardItem.href ? 'text-black dark:text-white' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`}>
                {dashboardItem.icon || (
                  <Menu01Icon className="w-full h-full" />
                )}
              </div>
            </div>
            {!isSidebarCollapsed && (
              <span className={`font-bold text-[14px] whitespace-nowrap overflow-hidden text-ellipsis transition-colors
                ${pathname === dashboardItem.href ? 'text-[#101516] dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
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
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group relative outline-none focus:outline-none focus:ring-0
                        ${isActive && !isExpanded
                          ? 'bg-white dark:bg-[#1A1D27] shadow-sm'
                          : 'hover:bg-white/50 dark:hover:bg-white/5'
                        }`}
                    >
                      {isActive && !isExpanded && (
                        <div className="absolute inset-0 rounded-2xl bg-black/5 dark:bg-white/5 pointer-events-none"></div>
                      )}
                      {isActive && !isExpanded && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-black dark:bg-white rounded-r-full"></div>
                      )}

                      <div className="flex items-center gap-4">
                        <div className={`flex-shrink-0 ${isSidebarCollapsed ? 'mx-auto' : ''}`}>
                          <div className={`w-6 h-6 rounded flex items-center justify-center transition-transform duration-300 group-hover:scale-110 
                            ${isActive ? 'text-black dark:text-white' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`}>
                            {item.icon}
                          </div>
                        </div>
                        {!isSidebarCollapsed && (
                          <span className={`font-bold text-[14px] whitespace-nowrap transition-colors ${isActive ? 'text-[#101516] dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                            {item.label}
                          </span>
                        )}
                      </div>
                      {!isSidebarCollapsed && (
                        <ArrowDown01Icon size={16} className={`text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                      )}
                    </button>
                    
                    {!isSidebarCollapsed && (
                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="pl-7 py-2 space-y-1 relative">
                          {/* Left guide line */}
                          <div className="absolute left-7 top-0 bottom-2 w-px bg-gray-200 dark:bg-gray-800"></div>
                          
                          {item.submenus?.map((sub, sIdx) => {
                            const isSubActive = pathname === sub.href;
                            return (
                              <Link 
                                key={sIdx}
                                href={sub.href}
                                onClick={(e) => handleNavClick(e, sub.href || '#')}
                                className={`block relative pl-6 py-2 text-[13px] font-bold transition-all duration-200 rounded-xl hover:bg-white/40 dark:hover:bg-white/5 outline-none focus:outline-none focus:ring-0
                                  ${isSubActive ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                              >
                                {/* Active Dot indicator */}
                                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 transition-all duration-300
                                  ${isSubActive ? 'bg-black dark:bg-white border-black dark:border-white -ml-[3.5px]' : 'bg-white dark:bg-[#12141C] border-gray-300 dark:border-gray-700 -ml-[3.5px]'}`}></div>
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
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative outline-none focus:outline-none focus:ring-0
                      ${isActive 
                        ? 'bg-white dark:bg-[#1A1D27] shadow-sm'
                        : 'hover:bg-white/50 dark:hover:bg-white/5'
                      }`}
                  >
                    {isActive && (
                      <div className="absolute inset-0 rounded-2xl bg-black/5 dark:bg-white/5 pointer-events-none"></div>
                    )}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-black dark:bg-white rounded-r-full"></div>
                    )}
                    <div className={`flex-shrink-0 ${isSidebarCollapsed ? 'mx-auto' : ''}`}>
                      <div className={`w-6 h-6 rounded flex items-center justify-center transition-transform duration-300 group-hover:scale-110 
                        ${isActive ? 'text-black dark:text-white' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`}>
                        {item.icon}
                      </div>
                    </div>
                    {!isSidebarCollapsed && (
                      <span className={`font-bold text-[14px] whitespace-nowrap overflow-hidden text-ellipsis transition-colors
                        ${isActive ? 'text-[#101516] dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
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
              className={`flex items-center ${isSidebarCollapsed ? 'justify-center p-3' : 'px-4 py-3'} w-full rounded-xl hover:bg-white dark:hover:bg-[#222533] text-gray-600 dark:text-gray-300 hover:text-[#54E6D4] transition-all group`}
              title="Toggle Theme"
            >
              <div className="flex-shrink-0 group-hover:rotate-12 transition-transform duration-300">
                {theme === 'dark' ? (
                  <Sun01Icon size={20} />
                ) : (
                  <Moon01Icon size={20} />
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
                <GlobalIcon size={20} />
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
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#54E6D4]/20 to-transparent"></div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-[#1A1D27] shadow-sm text-gray-600 dark:text-gray-300 hover:text-[#54E6D4] transition-colors"
            >
              <Menu01Icon size={24} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-10 bg-gradient-to-b from-[#54E6D4] to-[#5FC8C0] rounded-full hidden sm:block shadow-[0_0_10px_rgba(255,107,0,0.3)]"></div>
              <div className="flex flex-col justify-center relative">
                 <div className="flex items-center gap-3">
                   <h1 className="text-xl lg:text-2xl font-black text-[#101516] dark:text-white leading-tight tracking-tight relative z-10">{activeMenu?.label || t('dashboard.nav_dashboard')}</h1>
                   {pathname === '/dashboard/sysop/product-approval' && pendingListingCount !== null && pendingListingCount > 0 && (
                     <div className="flex items-center justify-center h-6 px-2.5 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-[13px] font-black z-10">
                       {pendingListingCount}
                     </div>
                   )}
                   
                   {/* Layout Switcher for Product Approval */}
                   {pathname === '/dashboard/sysop/product-approval' && (
                     <button
                       onClick={() => {
                         if (layoutMode === 'single') setLayoutMode('double');
                         else if (layoutMode === 'double') setLayoutMode('grid');
                         else setLayoutMode('single');
                       }}
                       className="flex items-center justify-center w-9 h-9 ml-2 sm:ml-4 rounded-xl bg-white dark:bg-[#1A1D27] shadow-sm border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 transition-all hover:shadow-md hover:text-[#54E6D4] hover:-translate-y-0.5"
                       title="Görünümü Değiştir"
                     >
                       {layoutMode === 'grid' && (
                         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>
                       )}
                       {layoutMode === 'double' && (
                         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="6" height="16" rx="1.5"/><rect x="14" y="4" width="6" height="16" rx="1.5"/></svg>
                       )}
                       {layoutMode === 'single' && (
                         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="12" height="16" rx="2"/></svg>
                       )}
                     </button>
                   )}
                 </div>
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
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-[#12141C] shadow-inner peer-checked:after:translate-x-full peer-checked:after:border-transparent after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#54E6D4] peer-checked:to-[#FF8B30] peer-checked:border-none"></div>
              </label>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative w-11 h-11 flex items-center justify-center rounded-xl bg-white dark:bg-[#1A1D27] shadow-sm border border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-[#54E6D4] transition-all hover:shadow-md hover:-translate-y-0.5 group"
              >
                <Notification03Icon size={22} className={`transition-transform origin-top ${unreadCount > 0 ? 'animate-[bell_2s_ease-in-out_infinite]' : 'group-hover:rotate-12'}`} />
                {unreadCount > 0 && (
                  <>
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-br from-[#54E6D4] to-[#FF3B30] text-[10px] font-black text-white rounded-full flex items-center justify-center border-2 border-white dark:border-[#1A1D27] shadow-sm z-10">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#54E6D4] rounded-full animate-ping opacity-75"></span>
                  </>
                )}
              </button>

              {isNotificationOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotificationOpen(false)}></div>
                  <div className="absolute right-0 top-[calc(100%+12px)] w-80 bg-white dark:bg-[#12141C] border border-gray-100 dark:border-gray-800 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-50 overflow-hidden flex flex-col max-h-[450px] animate-in slide-in-from-top-4 fade-in duration-300">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-black/20">
                      <div>
                        <h3 className="text-[15px] font-black text-[#101516] dark:text-white">{t('dashboard.notifications_title') || 'Bildirimler'}</h3>
                        <p className="text-[12px] font-medium text-gray-500 mt-0.5">{unreadCount} Okunmamış</p>
                      </div>
                      <button onClick={handleMarkAllAsRead} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-[#54E6D4] transition-colors" title="Tümünü Okundu İşaretle">
                        <CheckmarkBadge01Icon size={16} />
                      </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto">
                      {(() => {
                        const unreadNotifs = notifications.filter((n: any) => !n.isRead);
                        if (unreadNotifs.length === 0) {
                          return (
                            <div className="p-8 text-center flex flex-col items-center justify-center">
                              <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mb-3">
                                <InboxIcon size={32} className="text-gray-300 dark:text-gray-600" />
                              </div>
                              <span className="text-[13px] font-bold text-gray-400">Okunmamış bildirim bulunmuyor</span>
                            </div>
                          );
                        }
                        return unreadNotifs.map((notif: any) => (
                          <div 
                            key={notif.userNotificationID || notif.id || Math.random()} 
                            onClick={() => !notif.isRead && handleMarkAsRead(notif.userNotificationID || notif.id)}
                            className="p-4 border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors relative cursor-pointer flex gap-4 group"
                          >
                            <div className="flex-shrink-0 mt-1">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${!notif.isRead ? 'bg-gradient-to-br from-[#54E6D4] to-[#FF9EBE] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                                <ArrowRight01Icon size={20} />
                              </div>
                            </div>
                            <div>
                              <h4 className={`text-[13px] font-bold mb-0.5 ${!notif.isRead ? 'text-[#101516] dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                {notif.title || notif.notification?.notificationTitle || notif.notification?.title || 'Bildirim'}
                              </h4>
                              <p className="text-[12px] text-gray-500 leading-snug mb-1.5">{notif.body || notif.message || notif.notification?.notificationContent || notif.notification?.body || ''}</p>
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wide">
                                {(notif.sentDate || notif.createdAt) ? new Date(notif.sentDate || notif.createdAt).toLocaleString(language === 'tr' ? 'tr-TR' : language === 'fr' ? 'fr-FR' : 'en-US') : ''}
                              </span>
                            </div>
                            {!notif.isRead && (
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#54E6D4] rounded-full shadow-[0_0_8px_rgba(255,107,0,0.6)]"></div>
                            )}
                          </div>
                        ));
                      })()}
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
                  <span className="text-[13px] font-black text-[#101516] dark:text-white leading-tight">{user?.userName || user?.name || 'User'} {user?.userSurname || ''}</span>
                  <span className="text-[11px] font-bold text-gray-400">{isAdmin ? 'Admin' : 'Member'}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#54E6D4] to-[#5FC8C0] p-[2px] shadow-sm">
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
                 
                 <div className="relative p-6 bg-gradient-to-br from-[#54E6D4]/10 to-[#5FC8C0]/10 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4">
                    <div className="min-w-0">
                      <p className="text-[16px] font-black text-[#101516] dark:text-white truncate relative z-10">{user?.userName || user?.name} {user?.userSurname || ''}</p>
                      <p className="text-[12px] font-bold text-gray-500 truncate mt-1 relative z-10">{user?.eMail || user?.userEmail || user?.email || user?.accountCredentials?.eMail || 'demo@salutbabe.com'}</p>
                    </div>
                 </div>
                 
                 <div className="p-2">
                   <Link href="/dashboard/common/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-[#54E6D4] dark:hover:text-white transition-all group">
                      <PencilEdit01Icon size={20} className="text-gray-400 group-hover:text-[#54E6D4] dark:group-hover:text-white" />
                      {t('dashboard.edit_profile') || 'Edit Profile'}
                   </Link>
                   
                   <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-[#54E6D4] dark:hover:text-white transition-all group text-left">
                      <RefreshIcon size={20} className="text-gray-400 group-hover:text-[#54E6D4] dark:group-hover:text-white" />
                      {t('dashboard.restart_walkthrough') || 'Restart Walkthrough'}
                   </button>

                   <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-[#54E6D4] dark:hover:text-white transition-all group text-left">
                      <BulbIcon size={20} className="text-gray-400 group-hover:text-[#54E6D4] dark:group-hover:text-white" />
                      {t('dashboard.whats_new') || "What's New"}
                   </button>

                   <div className="h-px bg-gray-200 dark:bg-white/10 my-2 mx-2"></div>

                   <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-red-500 dark:hover:text-white transition-all group text-left">
                      <Logout01Icon size={20} className="text-gray-400 group-hover:text-red-500 dark:group-hover:text-white" />
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
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#54E6D4]/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
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
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#54E6D4] via-[#FF9EBE] to-[#5FC8C0] bg-[length:200%_auto] animate-[brandShift_3s_ease-in-out_infinite] font-black text-[13px] lowercase tracking-normal drop-shadow-sm">
                salutbabe
              </span>
            </div>
            
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
              <div className="group relative ml-2">
                <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-[#54E6D4] hover:bg-[#54E6D4]/10 transition-all cursor-help">
                  <InformationCircleIcon size={14} />
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
               ? 'bg-[#54E6D4]/ dark:bg-[#2A1F16]/90 border-[#54E6D4] dark:border-[#54E6D4]/ text-[#54E6D4] dark:text-[#54E6D4] shadow-orange-500/10' 
               : 'bg-green-50/90 dark:bg-[#162A1F]/90 border-green-200 dark:border-green-500/20 text-green-800 dark:text-green-400 shadow-green-500/10'
             }`}>
             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm
               ${toast.type === 'warning' ? 'bg-[#54E6D4] text-white' : 'bg-green-500 text-white'}`}>
               {toast.type === 'warning' ? (
                 <Alert01Icon size={24} />
               ) : (
                 <TickDouble01Icon size={24} />
               )}
             </div>
             <div className="flex-1 pr-4">
                <p className="text-[13px] font-black leading-tight uppercase tracking-widest">{toast.type === 'warning' ? (t('dashboard.toast_warning') || 'Uyarı') : (t('dashboard.toast_success') || 'Başarılı')}</p>
                <p className="text-[13px] font-medium opacity-90 mt-1">{toast.message}</p>
             </div>
             <button onClick={() => setToast(prev => ({ ...prev, visible: false }))} className="w-8 h-8 rounded-full flex items-center justify-center text-inherit opacity-50 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-all">
                <Cancel01Icon size={16} />
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
