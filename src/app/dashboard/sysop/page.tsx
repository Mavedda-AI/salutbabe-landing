"use client";

import React from "react";
import {useAuthStore} from "../../../store/useAuthStore";
import {useThemeLanguage} from "../../../context/ThemeLanguageContext";

export default function SysopDashboard() {
  const { user } = useAuthStore();
  const { t } = useThemeLanguage();

  return (
    <div className="space-y-6">

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

    </div>
  );
}
