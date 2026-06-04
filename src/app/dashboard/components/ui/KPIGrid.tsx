import React from 'react';
import {useThemeLanguage} from "@/context/ThemeLanguageContext";

export interface KPIItem {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass: string;
}

interface KPIGridProps {
  items: KPIItem[];
}

export function KPIGrid({ items }: KPIGridProps) {
  const { theme } = useThemeLanguage();
  const isDark = theme === 'dark';

  const cardClass = `rounded-[24px] border transition-all duration-300 ${isDark ? 'bg-[#121214] border-white/5 shadow-2xl' : 'bg-white border-gray-100 shadow-sm'}`;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((k, i) => (
        <div key={i} className={`${cardClass} py-8 px-4 flex flex-col items-center justify-center text-center group hover:scale-[1.02]`}>
          <span className="mb-3 opacity-80 group-hover:opacity-100 transition-opacity">
            {k.icon}
          </span>
          <p className={`text-[11px] md:text-[12px] font-black uppercase tracking-widest mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {k.label}
          </p>
          <p className={`text-[28px] md:text-[32px] font-black ${k.colorClass}`}>
            {k.value}
          </p>
        </div>
      ))}
    </div>
  );
}
