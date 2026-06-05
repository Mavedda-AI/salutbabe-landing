"use client";

import React from "react";
import {useThemeLanguage} from "../../../../context/ThemeLanguageContext";

export default function AdminBrandsPage() {
  const { t, theme } = useThemeLanguage();

  return (
    <div className={`rounded-[3rem] border shadow-sm p-12 text-center transition-all bg-white border-border-color dark:bg-[#12141C] dark:border-white/5`}>
      <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary dark:shadow-[0_0_30px_rgba(95,200,192,0.1)]`}>
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.659A2.25 2.25 0 009.568 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
        </svg>
      </div>
      <h2 className="text-3xl font-black text-text-primary mb-3 tracking-tight">{t('dashboard.sysop.nav_brand_mgmt')}</h2>
      <p className="text-text-secondary font-bold text-[15px] max-w-md mx-auto leading-relaxed">
        {t('dashboard.sysop.under_construction')}
      </p>
    </div>
  );
}
