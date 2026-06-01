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
        <div className="bg-red-600 text-white text-center py-2 px-4 text-[13px] font-bold w-full sticky top-0 z-[9999]">
          Sunucu bağlantısı sağlanamadı. Sistemlerimizde geçici bir bakım çalışması yapılmaktadır. Lütfen daha sonra tekrar deneyiniz.
        </div>
      )}
      {children}
    </ServerHealthContext.Provider>
  );
};
