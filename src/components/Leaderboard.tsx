"use client";

import React, {useEffect, useState} from "react";
import Image from "next/image";
import {apiUrl} from "../lib/api";
import {useThemeLanguage} from "../context/ThemeLanguageContext";

const Leaderboard = () => {
  const { t } = useThemeLanguage();
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [metric, setMetric] = useState<"earnings" | "sales">("earnings");
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const res = await fetch(apiUrl(`/leaderboard/sellers?timeframe=${timeframe}&metric=${metric}`), {
          headers: {
            'X-Device-Type': 'web'
          }
        });
        const json = await res.json();
        if (json.payload) {
          setSellers(json.payload);
        }
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [timeframe, metric]);

  const getPhotoUrl = (url: string) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('/') || url.startsWith('blob:') || url.startsWith('data:')) {
      return url;
    }
    return `https://api.salutbabe.com/v1/media/salutbabe-users/${url}`;
  };

  const timeframes = [
    { id: "daily", label: t("leaderboard.tf_daily") },
    { id: "weekly", label: t("leaderboard.tf_weekly") },
    { id: "monthly", label: t("leaderboard.tf_monthly") }
  ];

  return (
    <section className="max-w-[1440px] mx-auto px-6 md:px-12 py-24">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div className="animate-fade-in-up">
          <span className="text-secondary font-black text-[11px] uppercase tracking-[0.3em] mb-4 block">
            LEADERBOARD
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-text-primary mb-6 leading-[1.1] tracking-tight">
            {t("leaderboard.title")}<br/>
            <span className="text-primary italic">{t("leaderboard.subtitle_main")}</span> {t("leaderboard.subtitle_sub")}
          </h2>
        </div>

        <div className="flex flex-col gap-4 items-end">
          <div className="flex bg-surface p-1.5 rounded-2xl border border-border-color shadow-sm">
             <button 
               onClick={() => setMetric("earnings")}
               className={`px-6 py-2.5 rounded-xl text-[11px] font-black tracking-widest transition-all ${metric === "earnings" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-text-secondary hover:text-text-primary"}`}
             >
               {t("leaderboard.metric_earnings")}
             </button>
             <button 
               onClick={() => setMetric("sales")}
               className={`px-6 py-2.5 rounded-xl text-[11px] font-black tracking-widest transition-all ${metric === "sales" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-text-secondary hover:text-text-primary"}`}
             >
               {t("leaderboard.metric_sales")}
             </button>
          </div>

          <div className="flex gap-4">
             {timeframes.map((tf) => (
               <button 
                 key={tf.id}
                 onClick={() => setTimeframe(tf.id as any)}
                 className={`text-[11px] font-black tracking-widest pb-1 border-b-2 transition-all ${timeframe === tf.id ? "border-primary text-text-primary" : "border-transparent text-text-secondary hover:text-text-primary"}`}
               >
                 {tf.label}
               </button>
             ))}
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-[3rem] border border-border-color overflow-hidden shadow-2xl shadow-black/5">
        {loading ? (
          <div className="py-40 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-text-secondary font-black text-[10px] tracking-widest uppercase animate-pulse">{t("leaderboard.loading")}</p>
          </div>
        ) : sellers.length > 0 ? (
          <div className="divide-y divide-border-color/50">
            {sellers.map((seller, idx) => (
              <div 
                key={seller.sellerID} 
                className="group flex items-center justify-between p-6 md:p-8 hover:bg-background/50 transition-colors"
              >
                <div className="flex items-center gap-6 md:gap-10">
                  <span className={`text-2xl md:text-3xl font-black italic min-w-[40px] ${idx < 3 ? "text-primary" : "text-text-secondary/30"}`}>
                    #{seller.rank}
                  </span>

                  <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 border-border-color group-hover:border-primary transition-colors bg-background flex items-center justify-center">
                     {!imageErrors[seller.sellerID] && seller.seller.photoUrl ? (
                       <Image 
                         src={getPhotoUrl(seller.seller.photoUrl) || ""} 
                         alt={seller.seller.name} 
                         fill 
                         sizes="(max-width: 768px) 80px, 100px"
                         className="object-cover"
                         onError={() => setImageErrors(prev => ({ ...prev, [seller.sellerID]: true }))}
                       />
                     ) : (
                       <div className="relative w-12 h-12 opacity-40 dark:invert transition-all duration-500 group-hover:opacity-100 group-hover:scale-110">
                         <Image 
                           src="/logo-salutbabe.png" 
                           alt="salutbabe logo" 
                           fill 
                           className="object-contain"
                         />
                       </div>
                     )}
                  </div>

                  <div className="flex flex-col">
                    <h4 className="text-lg md:text-xl font-black text-text-primary group-hover:text-primary transition-colors">
                      {seller.seller.storeName || seller.seller.name}
                    </h4>
                    <p className="text-[11px] md:text-xs font-bold text-text-secondary uppercase tracking-widest mt-1">
                      @{seller.seller.nickname || "salutbabe_member"}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl md:text-3xl font-black text-text-primary tracking-tighter">
                    {metric === "earnings" ? `${seller.stats.earnings.toLocaleString('tr-TR')} ₺` : `${seller.stats.sales} ${t("leaderboard.sales_unit")}`}
                  </p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
                    <span className="text-[10px] font-black text-success uppercase tracking-widest">{t("leaderboard.status_active")}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-40 text-center">
            <p className="text-text-secondary italic">{t("leaderboard.no_data")}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Leaderboard;
