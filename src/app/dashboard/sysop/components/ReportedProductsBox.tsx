import React from 'react';
import useSWR from 'swr';
import {Alert02Icon, ArrowRight01Icon, UserIcon} from 'hugeicons-react';
import {apiUrl} from '../../../../lib/api';
import {useAuthStore} from '../../../../store/useAuthStore';

const fetcher = (url: string, token: string) => fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json());

export default function ReportedProductsBox() {
  const token = useAuthStore((state) => state.token);
  const { data, isLoading } = useSWR(
    token ? [apiUrl('/admin/reports'), token] : null,
    ([url, token]) => fetcher(url, token)
  );

  const reports = data?.payload?.reports || [];

  // Group reports by product (targetID)
  const groupedReports = reports.reduce((acc: any, report: any) => {
    const id = report.targetID;
    if (!acc[id]) {
      acc[id] = {
        ...report,
        previousReports: []
      };
    } else {
      // If already exists, add to previous reports
      acc[id].previousReports.push(report);
    }
    return acc;
  }, {});

  const displayReports = Object.values(groupedReports);

  if (displayReports.length === 0) {
    return null; 
  }

  return (
    <div className="mb-10 mt-6">
      <div className="flex items-center gap-2 mb-4 px-2">
        <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500">
          <Alert02Icon size={16} />
        </div>
        <h3 className="text-xs font-black text-gray-900/40 dark:text-white/40 uppercase tracking-[0.2em]">Şikayet Edilen Ürünler</h3>
        <span className="ml-auto bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm shadow-red-500/30">
          {reports.length} TOPLAM ŞİKAYET
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2 pb-4 custom-scrollbar">
        {displayReports.map((report: any) => {
          const listing = report.listing;
          const reporter = report.reporter;
          const image = listing?.images?.[0]?.imageUrl || 'https://via.placeholder.com/150';
          const previousCount = report.previousReports?.length || 0;

          return (
            <div key={report.reportID} className="bg-white dark:bg-[#121214] border border-gray-100 dark:border-white/5 rounded-2xl p-3 flex gap-3 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
              
              {/* Product Image */}
              <div className="w-20 h-20 rounded-xl bg-gray-100 dark:bg-white/5 overflow-hidden shrink-0 relative">
                <img 
                  src={image} 
                  alt={listing?.title || 'Ürün görseli'} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-1.5">
                  <span className="text-[9px] font-bold text-white truncate w-full" title={listing?.title}>
                    {listing?.title || 'Silinmiş Ürün'}
                  </span>
                </div>
                {previousCount > 0 && (
                  <div className="absolute top-1 right-1 bg-black/80 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md backdrop-blur-sm">
                    +{previousCount} ŞİKAYET
                  </div>
                )}
              </div>

              {/* Report Details */}
              <div className="flex flex-col flex-1 min-w-0 py-1">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-black text-red-500 uppercase tracking-wider line-clamp-1">
                    NEDEN: {report.reason}
                  </span>
                </div>
                
                {report.description ? (
                  <span className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2 leading-tight">
                    "{report.description}"
                  </span>
                ) : (
                  <span className="text-xs text-gray-400 dark:text-gray-500 italic mb-2 leading-tight">
                    Açıklama girilmedi
                  </span>
                )}

                {/* Reporter Info */}
                <div className="mt-auto flex items-center gap-1.5 pt-2 border-t border-gray-50 dark:border-white/5">
                  <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden flex items-center justify-center shrink-0">
                    {reporter?.profilePhoto ? (
                      <img src={reporter.profilePhoto} alt={reporter.userName} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon size={10} className="text-gray-500" />
                    )}
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                      <span className="font-medium text-gray-900 dark:text-white">{reporter?.userName} {reporter?.userSurname}</span> bildirdi
                    </span>
                    {previousCount > 0 && (
                      <span className="text-[8px] text-amber-500 font-bold truncate">
                        ve {previousCount} kişi daha şikayet etti
                      </span>
                    )}
                  </div>
                  <button className="w-5 h-5 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors" title="Detayları İncele">
                    <ArrowRight01Icon size={12} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
