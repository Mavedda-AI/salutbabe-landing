"use client";
import React from 'react';
import LayoutWrapper from '@/components/LayoutWrapper';
import { useRouter } from 'next/navigation';

export default function PayoutsManagement() {
  const router = useRouter();

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-[#F9FAFB] pt-24 pb-20 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <button 
            onClick={() => router.push('/dashboard/sysop?role=finance')}
            className="flex items-center gap-1.5 text-[13px] font-bold text-gray-400 hover:text-gray-900 transition-colors mb-4"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Finans Paneline Dön
          </button>
          <h1 className="text-[28px] md:text-[32px] font-black tracking-tight text-[#111827] mb-8">
            Bekleyen Hakedişler
          </h1>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-[13px]">Bekleyen satıcı hakedişleri ve toplu ödeme onayı tablosu buraya gelecek.</p>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}
