"use client";

import React, { useEffect, useState } from "react";
import { apiUrl } from "../../../../lib/api";
import { UserMultiple02Icon, Share01Icon, LinkSquare01Icon, Search01Icon } from "hugeicons-react";

export default function PartnerManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      // Fetch users with a high limit to get referral info
      const res = await fetch(apiUrl("/admin/users?limit=500"), {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Device-Type": "web",
        },
      });
      const data = await res.json();
      if (data.request?.requestResult) {
        setUsers(data.payload?.users || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${user.userName || ""} ${user.userSurname || ""}`.toLowerCase();
    const referrerName = user.referrer ? `${user.referrer.userName || ""} ${user.referrer.userSurname || ""}`.toLowerCase() : "";
    return (
      fullName.includes(searchLower) ||
      (user.eMail || "").toLowerCase().includes(searchLower) ||
      (user.referralCode || "").toLowerCase().includes(searchLower) ||
      referrerName.includes(searchLower) ||
      (user.referrer?.referralCode || "").toLowerCase().includes(searchLower)
    );
  });

  // Calculate some stats
  const totalPartners = users.filter(u => u.referralCode).length;
  const totalReferred = users.filter(u => u.referredBy).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Partner & Referans Yönetimi</h1>
        <p className="text-gray-500 dark:text-white/60 mt-1">
          Kullanıcıların hangi referans kodlarıyla geldiğini ve partner ağını takip edin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#050505] rounded-xl border border-gray-200 dark:border-white/10 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <UserMultiple02Icon size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-white/60 font-medium">Toplam Kullanıcı</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#050505] rounded-xl border border-gray-200 dark:border-white/10 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Share01Icon size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-white/60 font-medium">Referans Kodu Alanlar</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalPartners}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#050505] rounded-xl border border-gray-200 dark:border-white/10 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <LinkSquare01Icon size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-white/60 font-medium">Davetle Gelenler</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalReferred}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#050505] rounded-xl border border-gray-200 dark:border-white/10 shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Referans Ağı Tablosu</h2>
          <div className="relative">
            <Search01Icon size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="İsim, email veya kod ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-80 pl-10 pr-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Yükleniyor...</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#0a0a0a] text-gray-500 dark:text-white/40 border-b border-gray-200 dark:border-white/10">
                  <th className="p-4 font-medium">Kullanıcı</th>
                  <th className="p-4 font-medium">Kişisel Ref. Kodu</th>
                  <th className="p-4 font-medium">Davet Eden (Referrer)</th>
                  <th className="p-4 font-medium">Kayıt Tarihi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {filteredUsers.map((user) => (
                  <tr key={user.userID} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {user.profilePhotoUrl ? (
                            <img src={user.profilePhotoUrl} alt="avatar" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-gray-500 dark:text-white/40 font-medium">
                              {(user.userName?.[0] || user.eMail?.[0] || '?').toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {user.userName} {user.userSurname}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-white/60">{user.eMail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {user.referralCode ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                          {user.referralCode}
                        </span>
                      ) : (
                        <span className="text-gray-400 dark:text-white/30 text-xs">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      {user.referrer ? (
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-xs">
                            {user.referrer.userName} {user.referrer.userSurname}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                              {user.referrer.referralCode || 'Kod Yok'}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/60">
                          Organik (Kayıt)
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-gray-500 dark:text-white/60">
                      {new Date(Number(user.registrationDate) || Date.now()).toLocaleDateString("tr-TR", {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
                
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500 dark:text-white/40">
                      Sonuç bulunamadı
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
