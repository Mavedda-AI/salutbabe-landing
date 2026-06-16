"use client";

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../../../store/useAuthStore';
import { Notification03Icon, SentIcon, Search01Icon, LinkSquare02Icon, InformationCircleIcon, Cancel01Icon } from 'hugeicons-react';
import { useToast } from '../../../../context/ToastContext';
import { apiUrl, API_BASE_URL } from '../../../../lib/api';

export default function NotificationsPage() {
  const { user } = useAuthStore();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'public' | 'private'>('private');
  
  // Form States
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [link, setLink] = useState('');
  const [targetUser, setTargetUser] = useState('');
  const [isSending, setIsSending] = useState(false);

  // User Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{username: string, name: string, id: string, avatar: string} | null>(null);

  const [searchResults, setSearchResults] = useState<{username: string, name: string, id: string, avatar: string}[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!searchQuery.trim() || searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const token = localStorage.getItem("auth_token");
        const res = await fetch(apiUrl(`/admin/users?search=${encodeURIComponent(searchQuery)}&limit=5`), {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'X-Device-Type': 'web'
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.payload?.users) {
            // Deduplicate by userName, preferring the one with a photo
            const uniqueUsersMap = new Map();
            
            data.payload.users.forEach((u: any) => {
              let photo = u.profilePhotoUrl;
              if (photo && !photo.startsWith('http')) {
                photo = `${API_BASE_URL}/uploads/profiles/${photo}`;
              }
              
              const existing = uniqueUsersMap.get(u.userID);
              const hasRealPhoto = !!photo;
              const existingHasRealPhoto = existing && !existing.avatar.includes('ui-avatars.com');
              
              const displayUsername = u.userNickname || u.userName;
              
              if (!existing || (hasRealPhoto && !existingHasRealPhoto)) {
                uniqueUsersMap.set(u.userID, {
                  id: u.userID,
                  username: displayUsername,
                  name: `${u.userName} ${u.userSurname || ''}`.trim(),
                  avatar: photo || `https://ui-avatars.com/api/?name=${displayUsername}&background=random`
                });
              }
            });
            
            setSearchResults(Array.from(uniqueUsersMap.values()));
          }
        }
      } catch (e) {
        console.error("User search error:", e);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(fetchUsers, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const filteredUsers = searchResults;

  // Time for Preview
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000 * 60);
    return () => clearInterval(interval);
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) {
      showToast("Lütfen başlık ve mesaj alanlarını doldurun.", "error");
      return;
    }
    if (activeTab === 'private' && !targetUser) {
      showToast("Lütfen bildirim gönderilecek kullanıcıyı seçin.", "error");
      return;
    }

    setIsSending(true);

    try {
      const token = localStorage.getItem("auth_token");
      
      const response = await fetch(apiUrl('/admin/notifications/send'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Device-Type': 'web'
        },
        body: JSON.stringify({
          title,
          message,
          targetType: activeTab,
          targetUser: selectedUser?.id || targetUser,
          link
        })
      });

      if (!response.ok) {
        throw new Error('Bildirim gönderilirken bir hata oluştu');
      }

      // Dispatch local event so UI updates instantly
      const mockNotification = {
        id: Math.random().toString(36).substring(7),
        userNotificationID: Math.random().toString(36).substring(7),
        title: title,
        message: message,
        type: activeTab === 'public' ? 'ANNOUNCEMENT' : 'DIRECT_MESSAGE',
        isRead: false,
        createdAt: new Date().toISOString(),
        actionUrl: link || null
      };

      window.dispatchEvent(new CustomEvent('new-local-notification', { detail: mockNotification }));

      showToast("Bildirim başarıyla gönderildi!", "success");
      setTitle('');
      setMessage('');
      setLink('');
      setTargetUser('');
      setSelectedUser(null);
      setSearchQuery('');
    } catch (error: any) {
      console.error(error);
      showToast(error.message || "Bildirim gönderilemedi.", "error");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 lg:px-8 py-8 pb-32">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Configuration Form */}
        <div className="w-full lg:w-2/3 flex flex-col gap-8">
          <div className="bg-white dark:bg-[#1A1D27] rounded-3xl p-6 lg:p-8 border border-gray-100 dark:border-gray-800/60 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-gray-900 to-gray-500 dark:from-gray-100 dark:to-gray-500 opacity-50" />
            
            <div className="mb-8">
              <h1 className="text-2xl font-black text-[#101516] dark:text-white mb-2">Bildirim Merkezi</h1>
              <p className="text-[14px] text-gray-500 font-medium">
                Kullanıcılarınıza anlık (push) ve sistem içi bildirimler gönderin. Depop ve Vinted tarzı etkileşimli bildirimlerle dönüşümleri artırın.
              </p>
            </div>

            {/* Tabs */}
            <div className="flex bg-gray-50 dark:bg-[#12141C] rounded-2xl p-2 mb-8 border border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setActiveTab('private')}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-[13px] transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'private'
                    ? "bg-white dark:bg-[#1A1D27] text-[#101516] dark:text-white shadow-sm border border-gray-200 dark:border-gray-700"
                    : "text-gray-500 hover:text-[#101516] dark:hover:text-white"
                }`}
              >
                Özel Bildirim (Kişiye Özel)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('public')}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-[13px] transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'public'
                    ? "bg-white dark:bg-[#1A1D27] text-[#101516] dark:text-white shadow-sm border border-gray-200 dark:border-gray-700"
                    : "text-gray-500 hover:text-[#101516] dark:hover:text-white"
                }`}
              >
                Genel Bildirim (Herkese)
              </button>
            </div>

            <form onSubmit={handleSend} className="space-y-6">
              
              {activeTab === 'private' && (
                <div className="space-y-2 animate-fade-in-up relative z-50">
                  <label className="text-[13px] font-bold text-[#101516] dark:text-white">Hedef Kullanıcı (Kullanıcı Adı veya ID)</label>
                  
                  {selectedUser ? (
                    <div className="w-full h-12 px-4 rounded-xl border border-[#101516] dark:border-white bg-gray-50 dark:bg-[#12141C] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img 
                          src={selectedUser.avatar} 
                          alt={selectedUser.name} 
                          className="w-6 h-6 rounded-full object-cover shrink-0" 
                          onError={(e) => { 
                            e.currentTarget.onerror = null; 
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${selectedUser.username}&background=random`; 
                          }}
                        />
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-[13px] font-bold text-[#101516] dark:text-white leading-none truncate">@{selectedUser.username}</span>
                          <span className="text-[10px] font-medium text-gray-500 leading-none mt-1 truncate">{selectedUser.name}</span>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => {
                          setSelectedUser(null);
                          setTargetUser('');
                          setSearchQuery('');
                          setIsDropdownOpen(true);
                        }}
                        className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-[#101516] dark:hover:text-white transition-colors"
                      >
                        <Cancel01Icon size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setIsDropdownOpen(true);
                        }}
                        onFocus={() => setIsDropdownOpen(true)}
                        placeholder="Kullanıcı ara... Örn: @mustafamavedda"
                        className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#12141C] text-[14px] font-bold text-[#101516] dark:text-white outline-none focus:border-black dark:focus:border-white transition-all"
                      />
                      <Search01Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      
                      {/* Dropdown Results */}
                      {isDropdownOpen && searchQuery.length > 0 && (
                        <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-[#1A1D27] border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden z-50 animate-fade-in-up">
                          {filteredUsers.length > 0 ? (
                            <div className="max-h-60 overflow-y-auto no-scrollbar py-2">
                              {filteredUsers.map(u => (
                                <button
                                  key={u.id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedUser(u);
                                    setTargetUser(u.username);
                                    setIsDropdownOpen(false);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left"
                                >
                                  <img 
                                    src={u.avatar} 
                                    alt={u.name} 
                                    className="w-8 h-8 rounded-full object-cover shrink-0" 
                                    onError={(e) => { 
                                      e.currentTarget.onerror = null; 
                                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${u.username}&background=random`; 
                                    }}
                                  />
                                  <div className="flex flex-col overflow-hidden">
                                    <span className="text-[13px] font-bold text-[#101516] dark:text-white truncate">@{u.username}</span>
                                    <span className="text-[11px] font-medium text-gray-500 truncate">{u.name}</span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 text-center text-[12px] font-medium text-gray-500">
                              Kullanıcı bulunamadı.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[13px] font-bold text-[#101516] dark:text-white">Bildirim Başlığı</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Örn: Yeni Sezon İndirimi Başladı!"
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#12141C] text-[14px] font-bold text-[#101516] dark:text-white outline-none focus:border-black dark:focus:border-white transition-all"
                  maxLength={50}
                />
                <div className="text-right text-[11px] font-bold text-gray-400">{title.length}/50</div>
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-bold text-[#101516] dark:text-white">Bildirim Mesajı</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Kullanıcıları harekete geçirecek çarpıcı bir mesaj yazın..."
                  className="w-full h-32 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#12141C] text-[14px] font-medium text-[#101516] dark:text-gray-300 outline-none focus:border-black dark:focus:border-white transition-all resize-none leading-relaxed"
                  maxLength={150}
                />
                <div className="text-right text-[11px] font-bold text-gray-400">{message.length}/150</div>
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-bold text-[#101516] dark:text-white">Yönlendirme Linki (Opsiyonel)</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="Örn: /campaigns/summer-sale"
                    className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#12141C] text-[14px] font-bold text-[#101516] dark:text-white outline-none focus:border-black dark:focus:border-white transition-all"
                  />
                  <LinkSquare02Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                <p className="text-[11px] text-gray-500 font-medium">Kullanıcı bildirime tıkladığında uygulamanın veya web sitesinin neresine gideceğini belirleyin.</p>
              </div>

              <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="submit"
                  disabled={isSending || !title || !message || (activeTab === 'private' && !targetUser)}
                  className="w-full h-14 bg-[#101516] dark:bg-white text-white dark:text-[#101516] rounded-2xl font-black text-[15px] flex items-center justify-center gap-2 hover:-translate-y-1 hover:shadow-xl transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                  {isSending ? (
                    <>
                      <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Gönderiliyor...</span>
                    </>
                  ) : (
                    <>
                      <SentIcon className="w-5 h-5" />
                      <span>{activeTab === 'public' ? 'Tüm Kullanıcılara Gönder' : 'Bildirimi Gönder'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Live Mobile Preview */}
        <div className="w-full lg:w-1/3 flex flex-col items-center sticky top-24">
          <div className="mb-4 w-full text-center">
            <h3 className="text-[12px] font-black tracking-widest uppercase text-gray-400">Canlı Önizleme</h3>
          </div>
          
          {/* Smartphone Mockup */}
          <div className="relative w-[320px] h-[650px] bg-black rounded-[3rem] border-[10px] border-black shadow-[0_30px_60px_rgba(0,0,0,0.3)] overflow-hidden">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-[1.2rem] z-20"></div>
            
            {/* Wallpaper Screen */}
            <div className="relative w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
              {/* Header Status Bar */}
              <div className="absolute top-0 w-full h-12 flex items-center justify-between px-6 pt-1 z-10 text-white">
                <span className="text-[14px] font-semibold">{currentTime || '09:41'}</span>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21L23 5C22.2882 4.39805 17.8525 1 12 1C6.14751 1 1.71181 4.39805 1 5L12 21Z"/></svg>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20 20H4V4H20V20ZM18 18V6H6V18H18Z"/></svg>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M16 4H8V20H16V4Z"/></svg>
                </div>
              </div>

              {/* Notification Overlay Area */}
              <div className="absolute top-0 left-0 w-full h-full flex flex-col pt-20 px-3 z-10">
                {/* Push Notification Card iOS Style */}
                <div className="w-full bg-[#f4f4f4]/90 dark:bg-[#1a1a1a]/80 backdrop-blur-xl rounded-[1.5rem] p-4 shadow-[0_15px_40px_rgba(0,0,0,0.2)] transform transition-all duration-500 scale-100 hover:scale-[1.02] cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-black text-white flex items-center justify-center font-bold text-[10px] tracking-tighter">sb</div>
                      <span className="text-[12px] font-medium text-gray-600 dark:text-gray-300">salutbabe</span>
                    </div>
                    <span className="text-[11px] font-medium text-gray-500">şimdi</span>
                  </div>
                  
                  <div className="flex flex-col gap-1 pr-4">
                    <h4 className="text-[14px] font-bold text-black dark:text-white leading-snug">
                      {title || 'Bildirim Başlığı'}
                    </h4>
                    <p className="text-[13px] font-medium text-gray-600 dark:text-gray-300 leading-snug line-clamp-3">
                      {message || 'Kullanıcıları harekete geçirecek çarpıcı bir mesaj yazın...'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Home Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/50 rounded-full z-20"></div>
          </div>

          <div className="mt-8 flex items-center gap-2 text-gray-400 dark:text-gray-500 justify-center">
            <InformationCircleIcon size={16} />
            <p className="text-[12px] font-medium">Bu tasarım iOS Push Notification standartlarına göredir.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
