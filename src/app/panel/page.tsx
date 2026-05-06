"use client";

import React from "react";

export default function PanelDashboard() {
  const stats = [
    { label: "Toplam Kazanç", value: "₺2.450,00", change: "+12%", icon: "M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z M12 18c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z" },
    { label: "Aktif İlanlar", value: "18", change: "+2", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
    { label: "Toplam Satış", value: "42", change: "+5", icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" },
    { label: "Profil İzlenme", value: "1.240", change: "+18%", icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Banner */}
      <div className="bg-primary rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl shadow-primary/20">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
            Merhaba, Mağazanı Büyütmeye Hazır mısın?
          </h1>
          <p className="text-white/80 font-bold text-lg mb-8">
            Bugün harika bir gün! İlanlarını kontrol edebilir veya yeni ürünler ekleyerek satışlarını artırabilirsin.
          </p>
          <button className="bg-white text-primary px-10 py-4 rounded-full font-black text-sm hover:scale-105 transition-transform active:scale-95 shadow-xl shadow-black/10">
            YENİ İLAN OLUŞTUR
          </button>
        </div>
        
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-surface border border-border-color p-8 rounded-[2.5rem] hover:border-primary transition-colors group">
            <div className="w-12 h-12 rounded-2xl bg-background border border-border-color flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
              </svg>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-black uppercase tracking-widest text-text-secondary">{stat.label}</span>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-black text-text-primary">{stat.value}</span>
                <span className="text-[11px] font-black text-green-500 mb-1">{stat.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface border border-border-color rounded-[3rem] p-10">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-text-primary">Son Satışlar</h3>
            <button className="text-xs font-black text-primary hover:underline">TÜMÜNÜ GÖR</button>
          </div>
          
          <div className="space-y-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between p-6 rounded-3xl bg-background border border-border-color/50 hover:border-primary transition-all group">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-surface border border-border-color group-hover:scale-105 transition-transform overflow-hidden">
                    <img 
                      src={`https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=100&h=100`} 
                      className="w-full h-full object-cover" 
                      alt="Product"
                    />
                  </div>
                  <div>
                    <h4 className="font-black text-text-primary">Pamuklu Bebek Takımı</h4>
                    <span className="text-[11px] font-bold text-text-secondary">2 saat önce • #ORD-782{item}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-text-primary">₺350,00</div>
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">HAZIRLANIYOR</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface border border-border-color rounded-[3rem] p-10 flex flex-col items-center text-center justify-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-8 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-2xl font-black text-text-primary mb-4">Hızlı İlan Ver</h3>
          <p className="text-text-secondary font-bold text-sm mb-10 leading-relaxed px-4">
            Eski bebek kıyafetlerini nakde dönüştürmek sadece birkaç dakikanı alır.
          </p>
          <button className="w-full py-5 bg-text-primary text-background rounded-full font-black text-sm hover:scale-[1.02] transition-transform active:scale-95 shadow-xl shadow-black/10">
            HEMEN BAŞLA
          </button>
        </div>
      </div>
    </div>
  );
}
