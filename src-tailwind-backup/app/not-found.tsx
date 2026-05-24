"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("auth_token") : null;
    const userStr = typeof window !== 'undefined' ? localStorage.getItem("user") : null;
    
    if (token) {
      try {
        const user = userStr ? JSON.parse(userStr) : null;
        const userType = user?.userType || [];
        const isAdmin = Array.isArray(userType) 
          ? (userType.includes("SYSOP") || userType.includes("ADMIN")) 
          : (userType === "SYSOP" || userType === "ADMIN");

        if (isAdmin) {
          router.replace("/dashboard/sysop");
        } else {
          // Default to sysop dashboard for now if that's the only one, 
          // or home if we aren't sure. 
          // Based on the layout, even normal users seem to use /dashboard/sysop
          router.replace("/dashboard/sysop");
        }
      } catch (e) {
        router.replace("/");
      }
    } else {
      router.replace("/");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-white/40 font-black tracking-widest text-sm uppercase animate-pulse">Redirecting...</p>
      </div>
    </div>
  );
}
