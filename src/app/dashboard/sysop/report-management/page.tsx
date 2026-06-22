"use client";

import React, {useEffect, useState} from "react";
import {useThemeLanguage} from "../../../../context/ThemeLanguageContext";
import {useToast} from "../../../../context/ToastContext";
import {apiUrl} from "../../../../lib/api";
import {Alert01Icon, ArrowRight02Icon, Cancel01Icon} from "hugeicons-react";

export default function ReportManagementPage() {
  const { t } = useThemeLanguage();
  const { showToast } = useToast();
  
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<'pending' | 'resolved'>('pending');

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token");
      const res = await fetch(apiUrl("/admin/reports?page=1&limit=50"), {
        headers: {
          "Authorization": `Bearer ${token}`,
          "X-Device-Type": "web"
        }
      }).catch(() => null);
      
      if (!res) return;
      
      const data = await res.json();
      if (data.request?.requestResult) {
        setReports(data.payload?.reports || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDismiss = async (reportID: string) => {
    // In actual implementation, we would call an API like /admin/reports/:id/status
    // For now we will just hide it from the UI locally
    setReports(prev => prev.filter(r => r.reportID !== reportID));
    showToast("Şikayet kapatıldı.", "success");
  };

  const filteredReports = reports.filter(r => {
    const status = (r.status || '').toLowerCase();
    return currentTab === 'pending' ? status === 'pending' : status !== 'pending';
  });

  return (
    <div className="flex flex-col h-full overflow-hidden relative pb-20">
      <div className="absolute top-0 inset-x-0 h-[250px] bg-gradient-to-b from-gray-50/50 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none -z-10" />
      
      <div className="px-6 lg:px-8 py-8 md:py-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shrink-0 relative z-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white mb-2">
            Şikayet Yönetimi
          </h1>
          <p className="text-sm md:text-base font-medium text-gray-500 dark:text-white/60 max-w-xl">
            Kullanıcılar tarafından rapor edilen ilan, yorum ve profilleri inceleyip karar verebilirsiniz.
          </p>
        </div>
      </div>

      <div className="px-6 lg:px-8 mb-6">
        <div className="inline-flex bg-gray-100/50 dark:bg-white/5 p-1 rounded-2xl backdrop-blur-md border border-gray-200/50 dark:border-white/10 shadow-sm relative z-10 overflow-x-auto max-w-full">
          <button 
            onClick={() => setCurrentTab('pending')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${currentTab === 'pending' ? 'bg-white dark:bg-[#1A1E1F] text-gray-900 dark:text-white shadow-sm ring-1 ring-gray-200/50 dark:ring-white/10' : 'text-gray-500 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/80'}`}
          >
            Bekleyen Şikayetler
          </button>
          <button 
            onClick={() => setCurrentTab('resolved')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${currentTab === 'resolved' ? 'bg-white dark:bg-[#1A1E1F] text-gray-900 dark:text-white shadow-sm ring-1 ring-gray-200/50 dark:ring-white/10' : 'text-gray-500 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/80'}`}
          >
            İncelenenler
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 lg:px-8 pb-20 custom-scrollbar relative z-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-gray-100/50 dark:bg-white/5 rounded-3xl h-[280px] animate-pulse border border-gray-200/50 dark:border-white/10" />
            ))}
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <div className="w-24 h-24 mb-6 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center text-gray-300 dark:text-white/20">
              <Alert01Icon size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Herhangi bir şikayet bulunamadı.</h3>
            <p className="text-sm text-gray-500 dark:text-white/40 max-w-sm">
              Bu kategoride incelenmesi gereken bir kullanıcı şikayeti bulunmuyor.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <div key={report.reportID} className="group flex flex-col bg-white dark:bg-[#101516] rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-red-500/30 transition-all duration-300">
                <div className="p-6 pb-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/20 overflow-hidden shrink-0">
                        {report.reporter?.profilePhoto ? (
                          <img src={report.reporter.profilePhoto} alt="User" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-xs text-gray-400">
                            {report.reporter?.userName?.[0] || 'U'}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900 dark:text-white line-clamp-1">
                          {report.reporter?.userName} {report.reporter?.userSurname}
                        </div>
                        <div className="text-[10px] font-medium text-gray-500 dark:text-white/40 uppercase tracking-widest mt-0.5">
                          Şikayet Eden
                        </div>
                      </div>
                    </div>
                    <span className="shrink-0 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-500 border border-red-500/20">
                      {report.targetType === 'listing' ? 'İLAN' : report.targetType}
                    </span>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-base font-bold text-gray-900 dark:text-white line-clamp-1 mb-1">
                      Sebep: {report.reason}
                    </h4>
                    {report.description && (
                      <p className="text-sm text-gray-600 dark:text-white/60 line-clamp-2">
                        {report.description}
                      </p>
                    )}
                  </div>

                  {report.targetType === 'listing' && report.listing && (
                    <div className="mt-auto flex items-center gap-4 p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                      <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-white/10 overflow-hidden shrink-0">
                        {report.listing.images?.[0]?.imageUrl && (
                          <img src={report.listing.images[0].imageUrl} alt="Listing" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-gray-900 dark:text-white truncate">
                          {report.listing.title || 'İsimsiz İlan'}
                        </div>
                        <div className="text-[10px] text-gray-500 dark:text-white/40 uppercase tracking-wider mt-1 truncate">
                          İlan ID: {report.listing.listingID?.substring(0,8)}...
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 border-t border-gray-100 dark:border-white/10">
                  <button 
                    onClick={() => handleDismiss(report.reportID)}
                    className="flex items-center justify-center gap-2 p-4 text-sm font-bold text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <Cancel01Icon size={18} />
                    <span>Kapat</span>
                  </button>
                  <button 
                    className="flex items-center justify-center gap-2 p-4 text-sm font-bold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors border-l border-gray-100 dark:border-white/10"
                  >
                    <span>İncele</span>
                    <ArrowRight02Icon size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
