"use client";

import React, {useEffect, useState} from "react";
import {usePathname} from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import MobileAppBanner from "./MobileAppBanner";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDashboard = pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin");

  if (!mounted) return <>{children}</>;

  return (
    <>
      {!isDashboard && <MobileAppBanner />}
      {!isDashboard && <Header />}
      <div className={isDashboard ? "" : "relative pt-32"}>
        {children}
      </div>
      {!isDashboard && <Footer />}
    </>
  );
}
