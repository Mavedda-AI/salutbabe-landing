"use client";
import React, {useState, useEffect} from "react";
import {useThemeLanguage} from "../../../../context/ThemeLanguageContext";

export default function UserManagementPage() {
  const { theme } = useThemeLanguage();
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const isDark = theme === 'dark';

  useEffect(() => { setTimeout(() => setLoading(false), 500); }, []);
  const cardClass = `rounded-[20px] border transition-all duration-300 ${isDark ? 'bg-[#121214] border-white/5 shadow-2xl' : 'bg-white border-gray-100 shadow-sm'}`;

  return (
    <div className="space-y-6 animate-fade-in max-w-[1400px] mx-auto pb-12 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
         <div>
           <h1 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`}>Kullanıcı Yönetimi</h1>
           <p className={`text-[13px] font-medium mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Platform üyelerini, askıya alma ve KVKK silme taleplerini yönetin.</p>
         </div>
         <div className="flex gap-2">
            <div className={`relative flex items-center w-64 h-10 rounded-xl border ${isDark ? 'bg-[#1A1D1F] border-white/10' : 'bg-gray-50 border-gray-200'}`}>
               <input type="text" placeholder="E-posta veya isim ara..." className="w-full h-full bg-transparent border-none px-4 text-[12px]" />
            </div>
         </div>
      </div>

      <div className={`${cardClass} overflow-x-auto`}>
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className={isDark ? 'bg-[#1A1D1F]' : 'bg-gray-50/80'}>
              <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Kullanıcı</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Rol / Katılım</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Durum</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {loading ? <tr><td colSpan={4} className="p-8 text-center text-[12px] text-gray-500">Yükleniyor...</td></tr> : (
              [1,2,3].map(i => (
                <tr key={i} className={`transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50/50'}`}>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className={`text-[13px] font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Kullanıcı {i}</span>
                      <span className={`text-[11px] mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>user{i}@example.com</span>
                    </div>
                  </td>
                  <td className="px-6 py-5"><span className={`text-[14px] font-bold ${isDark ? 'text-gray-300' : 'text-[#4B5563]'}`}>Normal Üye</span></td>
                  <td className="px-6 py-5"><span className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider ${isDark ? 'bg-green-500/10 text-green-500' : 'bg-[#E8F8F0] text-[#00C48C]'}`}>AKTİF</span></td>
                  <td className="px-6 py-5 text-right">
                    <button onClick={(e) => { e.stopPropagation(); setSelectedUserId(i); }} className={`px-5 py-2 rounded-xl text-[12px] font-bold uppercase tracking-wider border-2 transition-colors ${isDark ? 'bg-[#1A1D1F] border-blue-500 text-white hover:bg-blue-500/10' : 'bg-[#F3F4F6] border-[#0066FF] text-[#111827] hover:bg-gray-200'}`}>DETAY</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mock Modal for User Details */}
      {selectedUserId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-lg p-6 rounded-2xl shadow-2xl relative ${isDark ? 'bg-[#1A1D1F] border border-white/10' : 'bg-white border border-gray-200'}`}>
            <button onClick={() => setSelectedUserId(null)} className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className={`text-xl font-black mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Kullanıcı {selectedUserId} Detayları</h3>
            <div className={`p-4 rounded-xl mb-4 ${isDark ? 'bg-[#121214]' : 'bg-gray-50'}`}>
              <p className={`text-[12px] font-bold mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>KULLANICI BİLGİLERİ</p>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between"><span className={isDark ? 'text-gray-300' : 'text-gray-600'}>E-posta:</span><span className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>user{selectedUserId}@example.com</span></div>
                <div className="flex justify-between"><span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Kayıt Tarihi:</span><span className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>12 Mayıs 2026</span></div>
                <div className="flex justify-between"><span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Son Giriş:</span><span className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>Bugün 14:30</span></div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setSelectedUserId(null)} className={`flex-1 py-3 rounded-xl font-bold transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}>Kapat</button>
              <button onClick={() => { alert('Askıya alma işlemi backend\'e iletilecek.'); setSelectedUserId(null); }} className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-colors">Hesabı Askıya Al</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
