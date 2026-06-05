"use client";

import React from "react";
import { useAuthStore } from "../../../store/useAuthStore";
import { useThemeLanguage } from "../../../context/ThemeLanguageContext";

export default function SysopDashboard() {
  const { user } = useAuthStore();
  const { t } = useThemeLanguage();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FF6B00] to-[#FF9EBE] p-8 text-white shadow-lg">
        <div className="relative z-10">
          <h1 className="text-3xl font-black mb-2">
            Hoş Geldiniz, {user?.userName || user?.name || 'Yönetici'} 👋
          </h1>
          <p className="text-white/80 font-medium max-w-lg leading-relaxed">
            Sistemin genel durumu, özet istatistikler ve bekleyen onay işlemleri bu alanda görüntülenecektir. Lütfen sol menüden yönetmek istediğiniz modülü seçin.
          </p>
        </div>
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      {/* Placeholder Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Toplam Kullanıcı', value: '---', color: 'from-blue-500 to-cyan-400' },
          { label: 'Aktif Siparişler', value: '---', color: 'from-green-500 to-emerald-400' },
          { label: 'Bekleyen Ürün Onayları', value: '---', color: 'from-orange-500 to-amber-400' },
          { label: 'Aylık Gelir', value: '---', color: 'from-purple-500 to-fuchsia-400' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-[#1A1D27] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
             <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.color} opacity-10 rounded-bl-full group-hover:scale-110 transition-transform duration-500`}></div>
             <p className="text-[13px] font-bold text-gray-500 dark:text-gray-400 mb-2">{item.label}</p>
             <h3 className="text-3xl font-black text-gray-900 dark:text-white">{item.value}</h3>
          </div>
        ))}
      </div>
      
      {/* Empty State for Upcoming Features */}
      <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-[#1A1D27] border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm mt-6">
        <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-5">
          <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Gereksiz Yapılar Temizlendi ✨</h3>
        <p className="text-[14px] font-medium text-gray-500 dark:text-gray-400 text-center max-w-lg leading-relaxed">
          Eski 206KB boyutundaki hardcoded (iç içe geçmiş, monolitik) dashboard mockup yapısı tamamen silindi.
          Kullanılmayan haritalar, inline SVG'ler ve redundant sayfalar kaldırıldı. İlerleyen süreçte gerçek component'ler buraya entegre edilecektir.
        </p>
      </div>
    </div>
  );
}
