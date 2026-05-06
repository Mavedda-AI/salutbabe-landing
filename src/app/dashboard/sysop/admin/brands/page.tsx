"use client";

import React from "react";

export default function AdminBrandsPage() {
  return (
    <div className="bg-white dark:bg-surface rounded-3xl border border-border-color shadow-sm p-12 text-center">
      <div className="w-20 h-20 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.659A2.25 2.25 0 009.568 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
        </svg>
      </div>
      <h2 className="text-2xl font-black text-text-primary mb-2">Marka Yönetimi</h2>
      <p className="text-text-secondary font-bold text-[14px] max-w-md mx-auto">
        Bu bölüm şu anda yapım aşamasındadır. Yakında markaları buradan yönetebileceksiniz.
      </p>
    </div>
  );
}
