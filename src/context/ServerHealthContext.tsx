"use client";

import React, {createContext, useContext, useEffect, useState} from 'react';
import {usePathname, useRouter} from 'next/navigation';
import {API_BASE_URL} from '@/lib/api';

interface ServerHealthContextProps {
  isServerDown: boolean;
}

const ServerHealthContext = createContext<ServerHealthContextProps>({ isServerDown: false });

export const useServerHealth = () => useContext(ServerHealthContext);

export const ServerHealthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isServerDown, setIsServerDown] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const checkServer = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET', cache: 'no-store' });
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
      
      if (!isDashboard && !isLanding) {
        router.push('/');
      }
    }
  }, [isServerDown, pathname, router]);

  return (
    <ServerHealthContext.Provider value={{ isServerDown }}>
      {isServerDown && pathname === '/' && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-[#111] rounded-[2rem] p-8 max-w-lg w-full shadow-2xl relative overflow-hidden transition-all duration-300 scale-100 opacity-100 border border-zinc-200 dark:border-zinc-800">
             {/* Decorative element */}
             <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FF007A] via-[#B800FF] to-[#00B2FF]"></div>
             
             <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-5 border border-red-100 dark:border-red-500/20">
                   <svg className="w-8 h-8 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                   </svg>
                </div>
                <h2 className="text-[20px] font-black text-zinc-900 dark:text-white mb-2 leading-tight">Sunucu Bağlantısı Bekleniyor</h2>
                <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mb-6 font-medium leading-relaxed px-4">Sistemlerimizde geçici bir bakım çalışması yapılmaktadır. Bağlantı arka planda otomatik olarak kontrol ediliyor.</p>

                <div className="w-full bg-zinc-50/80 dark:bg-white/5 rounded-2xl p-5 text-left border border-zinc-100 dark:border-white/10">
                  <h3 className="text-[13px] font-black text-zinc-800 dark:text-white mb-4 flex items-center gap-2.5">
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00B2FF] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00B2FF]"></span>
                    </span>
                    Bağlantı beklenirken Salutbabe:
                  </h3>
                  <ul className="space-y-3.5">
                    <li className="flex items-start gap-3">
                       <div className="mt-0.5 bg-[#00B2FF]/10 p-1 rounded-full text-[#00B2FF] shrink-0">
                         <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                       </div>
                       <p className="text-[12px] font-bold text-zinc-600 dark:text-zinc-300 leading-snug">Anneden anneye doğrudan ve %100 güvenli alışveriş imkanı.</p>
                    </li>
                    <li className="flex items-start gap-3">
                       <div className="mt-0.5 bg-[#00B2FF]/10 p-1 rounded-full text-[#00B2FF] shrink-0">
                         <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                       </div>
                       <p className="text-[12px] font-bold text-zinc-600 dark:text-zinc-300 leading-snug">Sıfır komisyon! Sattığınız ürünün geliri kesintisiz hesabınızda.</p>
                    </li>
                    <li className="flex items-start gap-3">
                       <div className="mt-0.5 bg-[#00B2FF]/10 p-1 rounded-full text-[#00B2FF] shrink-0">
                         <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                       </div>
                       <p className="text-[12px] font-bold text-zinc-600 dark:text-zinc-300 leading-snug">Türkiye'nin her yerine avantajlı PTT Kargo entegrasyonu.</p>
                    </li>
                    <li className="flex items-start gap-3">
                       <div className="mt-0.5 bg-[#00B2FF]/10 p-1 rounded-full text-[#00B2FF] shrink-0">
                         <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                       </div>
                       <p className="text-[12px] font-bold text-zinc-600 dark:text-zinc-300 leading-snug">Bebeğinizin küçülenleriyle aile bütçenize ve doğaya katkı sağlayın.</p>
                    </li>
                  </ul>
                </div>
                
                <div className="mt-6 flex items-center justify-center gap-2 text-[11px] font-black text-zinc-400 tracking-wide uppercase">
                   <svg className="w-4 h-4 animate-spin text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                   Sistem Durumu Taranıyor...
                </div>
             </div>
          </div>
        </div>
      )}
      {children}
    </ServerHealthContext.Provider>
  );
};
