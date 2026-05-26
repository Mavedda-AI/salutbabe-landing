import React from 'react';
import {useRouter} from 'next/navigation';
import {useThemeLanguage} from '@/context/ThemeLanguageContext';

interface PageHeaderProps {
  title: string;
  description: string;
  onBack?: () => void;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, onBack, actions }: PageHeaderProps) {
  const router = useRouter();
  const { theme } = useThemeLanguage();
  const isDark = theme === 'dark';

  const handleBack = onBack || (() => router.back());

  return (
    <div className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-300 ${isDark ? 'bg-[#0B0C0E]/80 border-white/5' : 'bg-white/80 border-gray-100'}`}>
      <div className="max-w-[1400px] mx-auto px-4 py-5 flex items-center gap-4">
        <button 
          onClick={handleBack} 
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors shrink-0 ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className={`text-[20px] md:text-[24px] font-black tracking-tight ${isDark ? 'text-white' : 'text-[#111827]'}`}>
            {title}
          </h1>
          <p className={`text-[12px] md:text-[13px] font-medium mt-0.5 md:mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {description}
          </p>
        </div>
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
