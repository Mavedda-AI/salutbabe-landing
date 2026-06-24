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
    <div className="mt-2 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {displayReports.map((report: any) => {
          const listing = report.listing;
          const reporter = report.reporter;
          const image = listing?.images?.[0]?.imageUrl || 'https://via.placeholder.com/150';
          const previousCount = report.previousReports?.length || 0;

          return (
            <div key={report.reportID} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-3 flex gap-4 hover:border-gray-200 dark:hover:border-white/20 transition-colors group">
              
              {/* Minimalist Product Image */}
              <div className="w-16 h-20 rounded-lg bg-gray-100 dark:bg-black/50 overflow-hidden shrink-0 relative">
                <img 
                  src={image} 
                  alt={listing?.title || 'Ürün görseli'} 
                  className="w-full h-full object-cover"
                />
                {previousCount > 0 && (
                  <div className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    +{previousCount}
                  </div>
                )}
              </div>

              {/* Minimalist Report Details */}
              <div className="flex flex-col flex-1 justify-center min-w-0">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate mb-1" title={listing?.title}>
                  {listing?.title || 'Silinmiş Ürün'}
                </h4>
                
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-1 truncate">
                  {report.reason}
                </span>
                
                <div className="flex items-center gap-2 mt-auto">
                  <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden flex items-center justify-center shrink-0">
                    {reporter?.profilePhotoUrl ? (
                      <img src={reporter.profilePhotoUrl} alt={reporter.userName} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon size={10} className="text-gray-500" />
                    )}
                  </div>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                    {reporter?.userName} {reporter?.userSurname}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-center pr-2">
                <ArrowRight01Icon size={16} className="text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-white transition-colors" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
