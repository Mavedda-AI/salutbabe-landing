"use client";

import React from 'react';
import { useAuthStore } from "@/store/useAuthStore";
import { useThemeLanguage } from "@/context/ThemeLanguageContext";

export default function UserDashboard() {
  const { user } = useAuthStore();
  const { t } = useThemeLanguage();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Hoş Geldiniz, {user?.displayName || user?.firstName || "Kullanıcı"}!</h1>
      <p className="text-gray-600 dark:text-gray-300">
        Bu panel şu anda yapım aşamasındadır. Siparişlerinizi ve hesap ayarlarınızı yakında buradan yönetebileceksiniz.
      </p>
    </div>
  );
}
