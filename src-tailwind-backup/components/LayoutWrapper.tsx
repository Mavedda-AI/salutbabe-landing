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

  const isStandalone = pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin") || pathname?.startsWith("/register");

  if (!mounted) return <>{children}</>;

  return (
    <>
      {!isStandalone && <MobileAppBanner />}
      {!isStandalone && <Header />}
      <div className={isStandalone ? "" : "relative pt-32"}>
        {children}
      </div>
      {!isStandalone && <Footer />}
    </>
  );
}
