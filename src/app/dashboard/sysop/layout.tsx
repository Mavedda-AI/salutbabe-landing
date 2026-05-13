"use client";

import React, {useEffect, useState} from "react";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {useThemeLanguage} from "../../../context/ThemeLanguageContext";
import {API_BASE_URL, apiUrl} from "../../../lib/api";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme, t, language, setLanguage } = useThemeLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string, visible: boolean, type: 'warning' | 'success' | 'error' }>({
    message: '',
    visible: false,
    type: 'warning'
  });

  const showToast = (message: string, type: 'warning' | 'success' | 'error' = 'warning') => {
    setToast({ message, visible: true, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 4000);
  };

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

  interface NavItem {
    label: string;
    href?: string;
    desc?: string;
    icon?: React.ReactNode;
    submenus?: { label: string; href: string }[];
  }

  const userType = user?.userType || [];
  console.log("Logged in User Role:", userType);
  const isAdmin = Array.isArray(userType) ? (userType.includes("SYSOP") || userType.includes("ADMIN")) : (userType === "SYSOP" || userType === "ADMIN");

  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev => 
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    // List of implemented routes
    const implementedRoutes = [
      '/dashboard/sysop',
      '/dashboard/sysop/user-management',
      '/dashboard/sysop/order-management',
      '/dashboard/sysop/shipping-management',
      '/dashboard/sysop/store-management',
      '/dashboard/sysop/product-management',
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
    { label: t('dashboard.nav_dashboard'), href: '/dashboard/sysop', desc: t('dashboard.nav_dashboard_desc') },
    { label: t('dashboard.nav_customers'), href: '/dashboard/sysop/customers', desc: t('dashboard.nav_customers_desc') },
    { label: t('dashboard.nav_products'), href: '/dashboard/sysop/products', desc: t('dashboard.nav_products_desc') },
    { label: t('dashboard.nav_orders'), href: '/dashboard/sysop/orders', desc: t('dashboard.nav_orders_desc') },
  ];

  const adminNav: NavItem[] = [
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
      label: t('dashboard.sysop.nav_users'), 
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
        { label: t('dashboard.sysop.nav_user_mgmt'), href: '/dashboard/sysop/user-management' },
        { label: t('dashboard.sysop.nav_store_mgmt'), href: '/dashboard/sysop/store-management' }
      ] 
    },
    { 
      label: t('dashboard.sysop.nav_orders'), 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M3 8.5C3 7.11929 4.11929 6 5.5 6H18.5C19.8807 6 21 7.11929 21 8.5V17.5C21 19.9853 18.9853 22 16.5 22H7.5C5.01472 22 3 19.9853 3 17.5V8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 6V4.5C8 3.11929 9.11929 2 10.5 2H13.5C14.8807 2 16 3.11929 16 4.5V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 10H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      submenus: [
        { label: t('dashboard.sysop.nav_order_mgmt'), href: '/dashboard/sysop/order-management' },
        { label: t('dashboard.sysop.nav_shipping_cos'), href: '/dashboard/sysop/shipping-management' }
      ] 
    },
    { 
      label: t('dashboard.sysop.nav_reviews'), 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M8 10H16M8 14H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 22H11C13.8284 22 15.2426 22 16.1213 21.1213C17 20.2426 17 18.8284 17 16V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 14V6C21 3.17157 21 1.75736 20.1213 0.87868C19.2426 0 17.8284 0 15 0H7C4.17157 0 2.75736 0 1.87868 0.87868C1 1.75736 1 3.17157 1 6V16C1 18.8284 1 20.2426 1.87868 21.1213C2.75736 22 4.17157 22 7 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      submenus: [
        { label: t('dashboard.sysop.nav_product_reviews'), href: '/dashboard/sysop/review-management' },
        { label: t('dashboard.sysop.nav_product_complaints'), href: '/dashboard/sysop/complaint-management' },
        { label: t('dashboard.sysop.nav_store_complaints'), href: '/dashboard/sysop/store-complaint-management' },
        { label: t('dashboard.sysop.nav_user_reviews'), href: '/dashboard/sysop/user-review-management' }
      ] 
    },
    { 
      label: t('dashboard.sysop.nav_products'), 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 22V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 7L12 12L3 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      submenus: [
        { label: t('dashboard.sysop.nav_products'), href: '/dashboard/sysop/product-management' },
        { label: t('dashboard.sysop.nav_categories'), href: '/dashboard/sysop/category-management' },
        { label: t('dashboard.sysop.nav_brands'), href: '/dashboard/sysop/brand-management' }
      ] 
    },
    { 
      label: t('dashboard.sysop.nav_settings'), 
      href: '/dashboard/sysop/system-settings',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19.6224 10.3954L18.4568 8.37738C17.6708 7.01599 17.2778 6.33529 17.5549 5.44781C17.8321 4.56034 18.4727 3.99042 19.7538 2.8506M4.37756 13.6046L5.54316 15.6226C6.3292 16.984 6.72222 17.6647 6.44505 18.5522C6.16789 19.4397 5.52731 20.0096 4.24615 21.1494M13.6046 4.37756L15.6226 5.54316C16.984 6.3292 17.6647 6.72222 18.5522 6.44505C19.4397 6.16789 20.0096 5.52731 21.1494 4.24615M10.3954 19.6224L8.37738 18.4568C7.01599 17.6708 6.33529 17.2778 5.44781 17.5549C4.56034 17.8321 3.99042 18.4727 2.8506 19.7538M10.3954 4.37756L8.37738 5.54316C7.01599 6.3292 6.33529 6.72222 5.44781 6.44505C4.56034 6.16789 3.99042 5.52731 2.8506 4.24615M13.6046 19.6224L15.6226 18.4568C16.984 17.6708 17.6647 17.2778 18.5522 17.5549C19.4397 17.8321 20.0096 18.4727 21.1494 19.7538M4.37756 10.3954L5.54316 8.37738C6.3292 7.01599 6.72222 6.33529 6.44505 5.44781C6.16789 4.56034 5.52731 3.99042 4.24615 2.8506M19.6224 13.6046L18.4568 15.6226C17.6708 16.984 17.2778 17.6647 17.5549 18.5522C17.8321 19.4397 18.4727 20.0096 19.7538 21.1494" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
  ];

  const activeNav: NavItem[] = isAdmin ? adminNav : normalUserNav;
  const dashboardItem = activeNav[0];
  const otherItems = activeNav.slice(1);
  
  // Find active menu for header title
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

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background text-text-primary flex transition-colors duration-300 font-sans selection:bg-primary/20">
      
      {/* Mobile Backdrop */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out transform 
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
          ${isSidebarCollapsed ? 'w-[80px]' : 'w-[280px]'}
          ${theme === 'light' ? 'bg-white border-r border-border-color shadow-2xl lg:shadow-none' : 'bg-[#09090B] border-r border-white/5 shadow-2xl lg:shadow-none'}`}
      >
        {/* Sidebar Header / Logo */}
        <div className="relative flex items-center justify-center h-24 p-6">
          {!isSidebarCollapsed ? (
            <>
              <Link href="/dashboard/sysop" className="flex items-center justify-center">
                 <img src="/logo-salutbabe.png" alt="Logo" className={`h-7 w-auto ${theme === 'light' ? 'brightness-0' : 'brightness-0 invert'}`} />
              </Link>
              <button 
                onClick={() => setIsSidebarCollapsed(true)}
                className="absolute top-4 right-4 text-white/20 hover:text-white dark:text-white/20 dark:hover:text-white light:text-text-secondary/20 light:hover:text-text-primary transition-colors lg:flex hidden p-1 hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-black/5 rounded-md"
              >
                <img src="/images/icon/collapse.svg" alt="Collapse" className={`w-4 h-4 opacity-40 ${theme === 'light' ? 'brightness-0' : 'brightness-0 invert'}`} />
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsSidebarCollapsed(false)}
              className="relative w-14 h-14 flex items-center justify-center group/expand"
            >
              <img 
                src={theme === 'light' ? "/logo-favicon-dark.png" : "/logo-favicon.png"} 
                alt="Logo" 
                className="w-full h-full rounded-md object-contain transition-all duration-300 group-hover/expand:opacity-0 group-hover/expand:scale-75" 
              />
              <img 
                src="/images/icon/expand.svg" 
                alt="Expand" 
                className={`absolute w-6 h-6 opacity-0 group-hover/expand:opacity-100 transition-all duration-300 transform scale-75 group-hover/expand:scale-110 ${theme === 'light' ? 'brightness-0' : 'brightness-0 invert'}`} 
              />
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="px-6 mb-4">
          <div className={`h-px w-full ${theme === 'light' ? 'bg-border-color' : 'bg-white/10'}`}></div>
        </div>

        {/* Dashboard Link (Separate) */}
        <div className="px-4 mb-4">
          <Link 
            href={dashboardItem.href || '#'}
            onClick={(e) => handleNavClick(e, dashboardItem.href || '#')}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative
              ${pathname === dashboardItem.href 
                ? (theme === 'light' ? 'bg-text-primary text-white' : 'bg-white text-[#1A2332]')
                : (theme === 'light' ? 'text-text-secondary hover:bg-black/5 hover:text-text-primary' : 'text-white/60 hover:bg-white/5 hover:text-white')
              }`}
          >
            <div className={`flex-shrink-0 ${isSidebarCollapsed ? 'mx-auto' : ''}`}>
              <div className={`w-5 h-5 rounded flex items-center justify-center ${pathname === dashboardItem.href ? (theme === 'light' ? 'text-white' : 'text-[#1A2332]') : 'text-inherit'}`}>
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
          <div className={`h-px w-full ${theme === 'light' ? 'bg-border-color' : 'bg-white/10'}`}></div>
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
                          ? (theme === 'light' ? 'bg-black/5 text-text-primary' : 'bg-white/10 text-white shadow-sm')
                          : (theme === 'light' ? 'text-text-secondary hover:bg-black/5 hover:text-text-primary' : 'text-white/60 hover:bg-white/5 hover:text-white')
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
                            onClick={(e) => handleNavClick(e, sub.href || '#')}
                            className={`block py-2 text-[12px] font-bold transition-all
                              ${pathname === sub.href 
                                ? (theme === 'light' ? 'text-text-primary' : 'text-white') 
                                : (theme === 'light' ? 'text-text-secondary/40 hover:text-text-primary' : 'text-white/40 hover:text-white')}`}
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
                    onClick={(e) => handleNavClick(e, item.href || '#')}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative
                      ${pathname === item.href 
                        ? (theme === 'light' ? 'bg-text-primary text-white' : 'bg-white text-[#1A2332]')
                        : (theme === 'light' ? 'text-text-secondary hover:bg-black/5 hover:text-text-primary' : 'text-white/60 hover:bg-white/5 hover:text-white')
                      }`}
                  >
                    <div className={`flex-shrink-0 ${isSidebarCollapsed ? 'mx-auto' : ''}`}>
                      <div className={`w-5 h-5 rounded flex items-center justify-center ${pathname === item.href ? 'text-[#1A2332]' : 'text-inherit'}`}>
                        {item.icon || (
                          <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                          </svg>
                        )}
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
        <div className={`p-4 border-t space-y-3 ${theme === 'light' ? 'border-border-color' : 'border-white/5'}`}>
          {!isSidebarCollapsed && (
            <button className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border text-[12px] font-bold transition-all ${theme === 'light' ? 'border-border-color text-text-secondary hover:bg-black/5 hover:text-text-primary' : 'border-white/10 text-white/60 hover:bg-white/5 hover:text-white'}`}>
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               {t('dashboard.sysop.support_title')}
            </button>
          )}

          {/* Theme & Language Toggles */}
          <div className={`flex ${isSidebarCollapsed ? 'flex-col items-center gap-4' : 'items-center justify-between px-2'} pt-2`}>
            <button 
              onClick={toggleTheme}
              className={`flex items-center gap-3 transition-all group ${theme === 'light' ? 'text-text-secondary hover:text-text-primary' : 'text-white/60 hover:text-white'}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${theme === 'light' ? 'bg-black/5 group-hover:bg-black/10' : 'bg-white/5 group-hover:bg-white/10'}`}>
                {theme === 'dark' ? '☀️' : '🌙'}
              </div>
              {!isSidebarCollapsed && <span className="text-[12px] font-bold">{theme === 'dark' ? (language === 'tr' ? 'Aydınlık' : language === 'fr' ? 'Clair' : 'Light') : (language === 'tr' ? 'Karanlık' : language === 'fr' ? 'Sombre' : 'Dark')}</span>}
            </button>

            <button 
              onClick={() => {
                const langs: ('tr' | 'en' | 'fr')[] = ['tr', 'en', 'fr'];
                const nextIdx = (langs.indexOf(language) + 1) % langs.length;
                setLanguage(langs[nextIdx]);
              }}
              className={`flex items-center gap-3 transition-all group ${theme === 'light' ? 'text-text-secondary hover:text-text-primary' : 'text-white/60 hover:text-white'}`}
            >
               <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${theme === 'light' ? 'bg-black/5 group-hover:bg-black/10' : 'bg-white/5 group-hover:bg-white/10'}`}>
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                   <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                   <path d="M3.6001 9H20.4001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                   <path d="M3.6001 15H20.4001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                   <path d="M12 3C14.5013 5.51164 15.9228 8.6603 16.0001 12C15.9228 15.3397 14.5013 18.4884 12 21C9.49881 18.4884 8.07727 15.3397 8.0001 12C8.07727 8.6603 9.49881 5.51164 12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
               </div>
               {!isSidebarCollapsed && (
                 <span className="text-[12px] font-bold">
                   {language === 'tr' ? 'Türkçe' : language === 'en' ? 'English' : 'Français'}
                 </span>
               )}
            </button>
          </div>
        </div>
      </aside>

      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'lg:pl-[80px]' : 'lg:pl-[280px]'} pl-0 min-h-screen relative`}>
        
        {/* Header */}
        <header className="h-20 bg-white/95 dark:bg-surface/95 backdrop-blur-md border-b border-border-color sticky top-0 z-[40] px-4 md:px-8 flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Open Menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex flex-col justify-center">
               <h1 className="text-xl font-black text-text-primary leading-tight">{activeMenu?.label || t('dashboard.nav_dashboard')}</h1>
               <p className="hidden md:block text-[12px] font-bold text-text-secondary">{activeMenu?.desc || t('dashboard.sysop.default_desc')}</p>
            </div>
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
                                <h4 className="text-[13px] font-bold text-text-primary mb-1">{notif.title || notif.notification?.title || t('dashboard.sysop.notification')}</h4>
                                <p className="text-[12px] text-text-secondary leading-snug mb-2">{notif.body || notif.message || notif.notification?.body || ''}</p>
                                <span className="text-[10px] font-bold text-text-secondary/80">
                                  {(notif.sentDate || notif.createdAt) ? new Date(notif.sentDate || notif.createdAt).toLocaleString(language === 'tr' ? 'tr-TR' : language === 'fr' ? 'fr-FR' : 'en-US') : ''}
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
                   <Link href="/dashboard/common/profile" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[12px] font-bold text-text-secondary hover:bg-primary/5 hover:text-primary transition-all">
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

      {/* Custom Toast */}
      {toast.visible && (
        <div className="fixed bottom-10 right-10 z-[999] animate-in slide-in-from-right-10 fade-in duration-300">
           <div className={`flex items-center gap-4 px-6 py-4 rounded-[1.5rem] border shadow-2xl backdrop-blur-xl min-w-[320px] max-w-md
             ${toast.type === 'warning' 
               ? (theme === 'light' ? 'bg-orange-50 border-orange-200 text-orange-800' : 'bg-orange-500/10 border-orange-500/20 text-orange-400 shadow-orange-500/10') 
               : (theme === 'light' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-green-500/10 border-green-500/20 text-green-400 shadow-green-500/10')
             }`}>
             <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
               ${toast.type === 'warning' ? 'bg-orange-500/20' : 'bg-green-500/20'}`}>
               {toast.type === 'warning' ? (
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
               ) : (
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
               )}
             </div>
             <div className="flex-1 pr-4">
                <p className="text-[13px] font-black leading-tight uppercase tracking-tight">{toast.type === 'warning' ? t('dashboard.toast_warning') : t('dashboard.toast_success')}</p>
                <p className="text-[12px] font-bold opacity-80 mt-0.5">{toast.message}</p>
             </div>
             <button onClick={() => setToast(prev => ({ ...prev, visible: false }))} className="text-inherit opacity-40 hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
           </div>
        </div>
      )}
    </div>
  );
}
