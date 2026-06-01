"use client";

import React, {createContext, useContext, useEffect, useState} from 'react';
import {usePathname, useRouter} from 'next/navigation';
import {API_BASE_URL} from '@/lib/api';
import {useThemeLanguage} from '@/context/ThemeLanguageContext';

interface ServerHealthContextProps {
  isServerDown: boolean;
}

const ServerHealthContext = createContext<ServerHealthContextProps>({ isServerDown: false });

export const useServerHealth = () => useContext(ServerHealthContext);

export const ServerHealthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isServerDown, setIsServerDown] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useThemeLanguage();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const checkServer = async () => {
      try {
        await fetch(`${API_BASE_URL}/health`, { method: 'GET', cache: 'no-store', mode: 'no-cors' });
        setIsServerDown(false);
      } catch (err) {
        setIsServerDown(true);
      }
    };

    checkServer();
    interval = setInterval(checkServer, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isServerDown) {
      const isDashboard = pathname.startsWith('/dashboard');
      const isLanding = pathname === '/';
      const isAuth = pathname === '/login' || pathname === '/register';
      
      if (!isDashboard && !isLanding && !isAuth) {
        router.push('/');
      }
    }
  }, [isServerDown, pathname, router]);

  return (
    <ServerHealthContext.Provider value={{ isServerDown }}>
      {isServerDown && pathname === '/' && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md px-6">
          <div className="bg-white dark:bg-[#09090B] rounded-[2rem] p-10 max-w-xl w-full shadow-2xl relative overflow-hidden transition-all duration-300 scale-100 opacity-100 border border-black/10 dark:border-white/10">
             
             {/* Gradient top bar */}
             <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-[#FF007A] via-[#B800FF] to-[#00B2FF]"></div>
             
             <div className="flex flex-col items-center text-center mt-2">
                <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-[1.5rem] flex items-center justify-center mb-6 border border-red-100 dark:border-red-500/20 shadow-sm">
                   <svg className="w-10 h-10 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                   </svg>
                </div>
                
                <h2 className="text-[24px] font-black text-[#111] dark:text-white mb-3 leading-tight tracking-tight">
                  {t('maintenance.title')}
                </h2>
                <p className="text-[14px] text-gray-500 dark:text-gray-400 mb-8 font-medium leading-relaxed px-4">
                  {t('maintenance.desc')}
                </p>

                <div className="w-full bg-gray-50 dark:bg-white/5 rounded-[1.5rem] p-6 text-left border border-gray-100 dark:border-white/10">
                  <h3 className="text-[14px] font-black text-[#111] dark:text-white mb-5 flex items-center gap-3">
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00B2FF] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00B2FF]"></span>
                    </span>
                    {t('maintenance.while_waiting')}
                  </h3>
                  
                  <ul className="space-y-4">
                    <li className="flex items-start gap-4">
                       <div className="mt-0.5 bg-[#00B2FF]/10 p-1.5 rounded-full text-[#00B2FF] shrink-0">
                         <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                       </div>
                       <p className="text-[13px] font-bold text-gray-700 dark:text-gray-300 leading-snug">
                         {t('maintenance.feature_1')}
                       </p>
                    </li>
                    <li className="flex items-start gap-4">
                       <div className="mt-0.5 bg-[#00B2FF]/10 p-1.5 rounded-full text-[#00B2FF] shrink-0">
                         <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                       </div>
                       <p className="text-[13px] font-bold text-gray-700 dark:text-gray-300 leading-snug">
                         {t('maintenance.feature_2')}
                       </p>
                    </li>
                    <li className="flex items-start gap-4">
                       <div className="mt-0.5 bg-[#00B2FF]/10 p-1.5 rounded-full text-[#00B2FF] shrink-0">
                         <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                       </div>
                       <p className="text-[13px] font-bold text-gray-700 dark:text-gray-300 leading-snug">
                         {t('maintenance.feature_3')}
                       </p>
                    </li>
                    <li className="flex items-start gap-4">
                       <div className="mt-0.5 bg-[#00B2FF]/10 p-1.5 rounded-full text-[#00B2FF] shrink-0">
                         <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                       </div>
                       <p className="text-[13px] font-bold text-gray-700 dark:text-gray-300 leading-snug">
                         {t('maintenance.feature_4')}
                       </p>
                    </li>
                  </ul>
                </div>
                
                <div className="mt-8 flex items-center justify-center gap-2.5 text-[11px] font-black text-gray-400 tracking-wider uppercase">
                   <svg className="w-4.5 h-4.5 animate-spin text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                   {t('maintenance.scanning')}
                </div>
             </div>
          </div>
        </div>
      )}
      {children}
    </ServerHealthContext.Provider>
  );
};
