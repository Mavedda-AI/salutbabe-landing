"use client";

import React, {useEffect} from 'react';
import {useAuthStore} from "../../../store/useAuthStore";
import {useRouter} from "next/navigation";
import FounderSummary from './components/FounderSummary';
import AlertCenter from './components/AlertCenter';
import KPIBar from './components/KPIBar';
import DashboardCharts from './components/DashboardCharts';
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

        {/* Real-time Recharts Analytics */}
        <DashboardCharts />

        {/* Layer 2-10: Domains via Accordion */}
        <div className="max-w-5xl mx-auto">
          <ExecutiveAccordion />
        </div>

      </main>

    </div>
  );
}
