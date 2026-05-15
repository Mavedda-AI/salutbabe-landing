"use client";
import React, {useState, useEffect} from "react";
import {useThemeLanguage} from "../../../../context/ThemeLanguageContext";

export default function UserManagementPage() {
  const { theme } = useThemeLanguage();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const isDark = theme === 'dark';

  useEffect(() => { setTimeout(() => setLoading(false), 500); }, []);
  const cardClass = `rounded-[20px] border transition-all duration-300 ${isDark ? 'bg-[#121214] border-white/5 shadow-2xl' : 'bg-white border-gray-100 shadow-sm'}`;

  const mockUsers = [1, 2, 3, 4, 5].map(i => ({
    id: i,
    name: `Kullanıcı ${i}`,
    email: `user${i}@example.com`,
    role: i === 1 ? 'Kurucu' : 'Normal Üye',
    status: i === 3 ? 'PASİF' : 'AKTİF'
  }));

  const filteredUsers = mockUsers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in w-full max-w-[1400px] mx-auto pb-12 overflow-x-hidden md:overflow-visible px-0 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
         <div>
           <h1 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`}>Kullanıcı Yönetimi</h1>
           <p className={`text-[13px] font-medium mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Platform üyelerini, askıya alma ve KVKK silme taleplerini yönetin.</p>
         </div>
         <div className="flex gap-2">
             <div className={`relative flex items-center w-full md:w-64 h-10 rounded-xl border focus-within:border-primary/50 transition-colors ${isDark ? 'bg-[#1A1D1F] border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                <input 
                  type="text" 
                  placeholder="E-posta veya isim ara..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-full bg-transparent border-none outline-none px-4 text-[12px] text-inherit placeholder:text-gray-400" 
                />
             </div>
         </div>
      </div>

      <div className={`${cardClass} overflow-hidden w-full max-w-full`}>
        <div className="overflow-x-auto w-full no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={isDark ? 'bg-[#1A1D1F]' : 'bg-gray-50/80'}>
                <th className="px-4 md:px-6 py-4 md:py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Kullanıcı</th>
                <th className="hidden md:table-cell px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Rol / Katılım</th>
                <th className="px-4 md:px-6 py-4 md:py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center md:text-left">Durum</th>
                <th className="px-4 md:px-6 py-4 md:py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {loading ? <tr><td colSpan={4} className="p-8 text-center text-[12px] text-gray-500">Yükleniyor...</td></tr> : 
               filteredUsers.length === 0 ? <tr><td colSpan={4} className="p-8 text-center text-[12px] text-gray-500">Sonuç bulunamadı.</td></tr> : (
                filteredUsers.map(user => (
                  <tr key={user.id} className={`transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50/50'}`}>
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex flex-col">
                        <span className={`text-[12px] md:text-[13px] font-bold truncate max-w-[100px] md:max-w-none ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.name}</span>
                        <span className={`text-[10px] md:text-[11px] mt-0.5 truncate max-w-[100px] md:max-w-none ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{user.email}</span>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-6 py-5"><span className={`text-[14px] font-bold ${isDark ? 'text-gray-300' : 'text-[#4B5563]'}`}>{user.role}</span></td>
                    <td className="px-4 md:px-6 py-4 text-center md:text-left">
                      <span className={`px-2 py-1 md:px-3 md:py-1.5 rounded-lg text-[9px] md:text-[11px] font-black uppercase tracking-wider ${user.status === 'AKTİF' ? (isDark ? 'bg-green-500/10 text-green-500' : 'bg-[#E8F8F0] text-[#00C48C]') : (isDark ? 'bg-red-500/10 text-red-500' : 'bg-red-50 text-red-600')}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-right">
                      <button onClick={(e) => { e.stopPropagation(); setSelectedUserId(user.id); }} className={`px-3 py-1.5 md:px-5 md:py-2 rounded-xl text-[10px] md:text-[12px] font-bold uppercase tracking-wider border-2 transition-colors ${isDark ? 'bg-[#1A1D1F] border-blue-500 text-white hover:bg-blue-500/10' : 'bg-[#F3F4F6] border-[#0066FF] text-[#111827] hover:bg-gray-200'}`}>DETAY</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
