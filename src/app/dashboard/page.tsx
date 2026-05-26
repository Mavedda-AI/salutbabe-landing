"use client";

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check local storage for user data
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const userType = user?.userType || [];
        const adminCheck = Array.isArray(userType)
          ? (userType.includes("SYSOP") || userType.includes("ADMIN"))
          : (userType === "SYSOP" || userType === "ADMIN");
        
        setIsAdmin(adminCheck);

        if (adminCheck) {
          router.push('/dashboard/sysop');
        } else {
          setLoading(false); // Show seller dashboard
        }
      } catch (e) {
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  if (loading || isAdmin) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#FAFAFA' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #EAEAEA', borderTopColor: '#A3E635', animation: 'spin 1s linear infinite' }} />
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}} />
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'var(--font-family)' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '24px', color: '#111' }}>Satıcı Paneli</h1>
      
      <div style={{ background: '#FFF', borderRadius: '24px', padding: '40px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1px solid #EAEAEA', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '32px', background: 'rgba(163, 230, 53, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#A3E635" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px', color: '#111' }}>Satıcı Paneline Hoş Geldiniz</h2>
        <p style={{ color: '#666', fontSize: '16px', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>
          Mağazanızın yönetim paneli şu anda yapım aşamasındadır. Çok yakında buradan ürünlerinizi ekleyebilecek, siparişlerinizi yönetebilecek ve kazançlarınızı takip edebileceksiniz.
        </p>
      </div>
    </div>
  );
}
