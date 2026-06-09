"use client";

import React, {useEffect} from 'react';
import {useAuthStore} from "../../../store/useAuthStore";
import {useRouter} from "next/navigation";
import FounderSummary from './components/FounderSummary';
import AlertCenter from './components/AlertCenter';
import KPIBar from './components/KPIBar';
import ExecutiveAccordion from './components/ExecutiveAccordion';
import TaskCenter from './components/TaskCenter';

export default function FounderOS() {
  const router = useRouter();

  // Protect the route
  useEffect(() => {
    const state = useAuthStore.getState();
    const userType = state.user?.userType;
    const isSysop = Array.isArray(userType) ? userType.includes("SYSOP") : userType === "SYSOP";
    
    if (!state.isAuthenticated || !isSysop) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-white font-sans overflow-x-hidden transition-colors">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-3xl border-b border-gray-200 dark:border-white/5 h-16 flex items-center px-6 lg:px-12 justify-between">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-500 to-blue-500 flex items-center justify-center font-black text-white text-xs">
            SB
          </div>
          <h1 className="text-sm font-bold tracking-widest uppercase text-gray-900 dark:text-white/90">Kurucu İşletim Sistemi <span className="text-gray-500 dark:text-white/30 font-medium">v1.0</span></h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse" />
          <span className="text-[10px] font-bold text-gray-500 dark:text-white/40 uppercase tracking-widest">Sistem Çevrimiçi</span>
        </div>
      </header>

      {/* Main Command Center */}
      <main className="max-w-[1600px] mx-auto p-4 lg:p-8 xl:p-12">
        
        {/* Layer 1: Top Level Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2">
            <FounderSummary />
            <AlertCenter />
          </div>
          <div className="lg:col-span-1">
            <TaskCenter />
          </div>
        </div>

        {/* Executive KPI Bar */}
        <KPIBar />

        {/* Layer 2-10: Domains via Accordion */}
        <div className="max-w-5xl mx-auto">
          <ExecutiveAccordion />
        </div>

      </main>

    </div>
  );
}
