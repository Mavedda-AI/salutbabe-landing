import React from 'react';
import {useThemeLanguage} from '../../../../../context/ThemeLanguageContext';

export interface TabItem {
  id: string;
  label: React.ReactNode;
}

interface FilterTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
}

export function FilterTabs({ tabs, activeTab, onChange }: FilterTabsProps) {
  const { theme } = useThemeLanguage();
  const isDark = theme === 'dark';

  return (
    <div className={`p-2 flex items-center gap-1 overflow-x-auto no-scrollbar rounded-[20px] border transition-all duration-300 ${isDark ? 'bg-[#121214] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-none px-4 py-2.5 rounded-xl text-[13px] md:text-[14px] font-bold transition-all whitespace-nowrap
            ${activeTab === tab.id 
              ? (isDark ? 'bg-[#2E2E3A] text-white shadow-md' : 'bg-[#111827] text-white shadow-md') 
              : (isDark ? 'text-gray-500 hover:bg-white/5 hover:text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900')}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = "Ara..." }: SearchInputProps) {
  const { theme } = useThemeLanguage();
  const isDark = theme === 'dark';

  return (
    <div className={`p-2 rounded-[20px] border transition-all duration-300 ${isDark ? 'bg-[#121214] border-white/5' : 'bg-white border-gray-100 shadow-sm'} w-full md:w-80 shrink-0 flex items-center gap-3`}>
      <svg className={`w-5 h-5 ml-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input 
        type="text" 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        placeholder={placeholder} 
        className="w-full bg-transparent border-none outline-none text-[14px] font-medium placeholder:text-gray-400 text-inherit"
      />
    </div>
  );
}
