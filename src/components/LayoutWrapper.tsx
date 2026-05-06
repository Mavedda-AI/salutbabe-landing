"use client";

import React from "react";
import {usePathname} from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin");

  return (
    <>
      {!isDashboard && <Header />}
      <div className={isDashboard ? "" : "relative pt-32"}>
        {children}
      </div>
      {!isDashboard && <Footer />}
    </>
  );
}
