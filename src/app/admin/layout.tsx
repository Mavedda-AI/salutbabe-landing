"use client";

import React, {useEffect, useState} from "react";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Basic auth check
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    
    if (!token || !userStr) {
      if (pathname !== "/admin/login") {
        router.push("/admin/login");
      }
    } else {
      try {
        const user = JSON.parse(userStr);
        if (!user.userType?.includes("ADMIN") && !user.userType?.includes("SYSOP")) {
          router.push("/");
        } else {
          setIsAuthenticated(true);
        }
      } catch (e) {
        if (pathname !== "/admin/login") {
          router.push("/admin/login");
        }
      }
    }
  }, [pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="font-black text-xl tracking-tight text-white">
            SALUTBABE ADMIN
          </div>
        </div>
        <nav className="flex-1 py-6 flex flex-col gap-2 px-4">
          <Link href="/admin" className={`px-4 py-3 rounded-xl font-bold text-sm transition-colors ${pathname === '/admin' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            Dashboard
          </Link>
          <Link href="/admin/users" className={`px-4 py-3 rounded-xl font-bold text-sm transition-colors ${pathname.startsWith('/admin/users') ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            Users
          </Link>
          <Link href="/admin/orders" className={`px-4 py-3 rounded-xl font-bold text-sm transition-colors ${pathname.startsWith('/admin/orders') ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            Orders
          </Link>
          <Link href="/admin/listings" className={`px-4 py-3 rounded-xl font-bold text-sm transition-colors ${pathname.startsWith('/admin/listings') ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            Listings
          </Link>
        </nav>
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              router.push("/admin/login");
            }}
            className="w-full px-4 py-3 text-left rounded-xl font-bold text-sm text-red-400 hover:bg-white/5 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
