import React from 'react';
import {useThemeLanguage} from '@/context/ThemeLanguageContext';

type StatusType = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface StatusBadgeProps {
  status: string;
  type?: StatusType;
}

export function StatusBadge({ status, type = 'neutral' }: StatusBadgeProps) {
  const { theme } = useThemeLanguage();
  const isDark = theme === 'dark';

  const colorMap: Record<StatusType, string> = {
    success: isDark ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-green-50 text-green-600 border-green-100',
    warning: isDark ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-orange-50 text-orange-600 border-orange-100',
    danger: isDark ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-red-50 text-red-600 border-red-100',
    info: isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-100',
    neutral: isDark ? 'bg-gray-500/10 text-gray-400 border-gray-500/20' : 'bg-gray-50 text-gray-600 border-gray-100',
  };

  return (
    <span className={`px-2.5 py-1 rounded-md text-[9px] md:text-[10px] font-black uppercase tracking-wider border ${colorMap[type]}`}>
      {status}
    </span>
  );
}

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function ActionModal({ isOpen, onClose, title, description, children }: ActionModalProps) {
  const { theme } = useThemeLanguage();
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up" onClick={onClose}>
      <div 
        className={`w-full max-w-lg p-6 rounded-[24px] shadow-2xl border ${isDark ? 'bg-[#1A1D1F] border-white/10' : 'bg-white border-gray-100'}`} 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
          <button onClick={onClose} className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        {description && <p className={`text-[13px] mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{description}</p>}
        
        <div className="flex flex-col gap-3">
          {children}
        </div>
      </div>
    </div>
  );
}
