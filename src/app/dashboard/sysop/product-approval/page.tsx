"use client";

import React from "react";
import {useThemeLanguage} from "../../../../context/ThemeLanguageContext";

export default function ProductApprovalPage() {
  const { t } = useThemeLanguage();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-black text-text-primary tracking-tight uppercase">
          {t('dashboard.sysop.nav_product_approval') || 'İlan Onaylama'}
        </h2>
        <p className="text-[13px] font-bold text-text-secondary">
          Kullanıcılar tarafından yüklenen ürün ilanlarını inceleyip onaylayın veya reddedin.
        </p>
      </div>

      <div className="p-12 text-center border-2 border-dashed border-border-color rounded-2xl">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-black text-text-primary mb-2">Onay Bekleyen İlan Yok</h3>
        <p className="text-[13px] text-text-secondary font-medium">Şu anda onayınızı bekleyen yeni bir ürün ilanı bulunmuyor.</p>
      </div>
    </div>
  );
}
