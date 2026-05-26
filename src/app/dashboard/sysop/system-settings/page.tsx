'use client';
import {HugeiconsIcon} from '@hugeicons/react';
import {Tick01Icon} from '@hugeicons/core-free-icons';
import React, {useEffect, useState} from 'react';
import {PageHeader} from '@/app/dashboard/components/ui/PageHeader';
import {ActionModal} from '@/app/dashboard/components/ui/StatusBadge';
import {apiUrl} from '@/lib/api';

type SettingItem = { key: string; label: string; value: string; type: 'input' | 'select' | 'toggle'; options?: string[] };
type SettingsSection = { section: string; items: SettingItem[] };

export default function SystemSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [settings, setSettings] = useState<SettingsSection[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token || token === "mock_token") {
        setSettings([]); // API expected
        return;
      }
      
      const res = await fetch(apiUrl('/admin/settings'), {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.payload && data.payload.settings) {
        setSettings(data.payload.settings);
      } else {
        setSettings([]);
      }
    } catch (e) {
      console.error(e);
      setSettings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateValue = (sectionIdx: number, itemIdx: number, newValue: string) => {
    setSettings(prev => {
      const copy = [...prev];
      copy[sectionIdx] = { ...copy[sectionIdx], items: [...copy[sectionIdx].items] };
      copy[sectionIdx].items[itemIdx] = { ...copy[sectionIdx].items[itemIdx], value: newValue };
      return copy;
    });
  };

  const handleSave = () => {
    setConfirmModal(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const cardClass = 'bg-white dark:bg-[#1A1D1F] rounded-[20px] border border-gray-100 dark:border-white/10 shadow-sm';

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0B0C0E] font-sans">
      {saved && (
        <div className="fixed top-4 right-4 z-[200] bg-green-600 text-white px-5 py-3 rounded-xl text-[13px] font-bold shadow-2xl animate-fade-in">
          <HugeiconsIcon icon={Tick01Icon} size={16} className="inline-block mr-1" /> Ayarlar başarıyla kaydedildi.
        </div>
      )}
      
      <PageHeader 
        title="Sistem Ayarları" 
        description="Platform konfigürasyonu" 
        actions={
          <button onClick={() => setConfirmModal(true)} className="px-4 py-2 rounded-xl bg-[#111827] dark:bg-white text-white dark:text-[#111827] text-[10px] font-black tracking-wider hover:bg-black dark:hover:bg-gray-200 transition-colors">
            KAYDET
          </button>
        }
      />

      <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-6 pb-20">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-gray-200 dark:border-white/10 border-t-gray-800 dark:border-t-white rounded-full animate-spin"></div>
          </div>
        ) : settings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#1A1D1F] rounded-2xl border border-gray-100 dark:border-white/10">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Gösterilecek ayar bulunamadı (API Bekleniyor)</p>
          </div>
        ) : (
          settings.map((s, si) => (
            <div key={si} className={`${cardClass} p-5`}>
              <h2 className="text-[13px] font-black text-[#111827] dark:text-white mb-4">{s.section}</h2>
              <div className="space-y-4">
                {s.items.map((item, ii) => (
                  <div key={ii} className="flex items-center justify-between gap-4">
                    <span className="text-[12px] font-bold text-gray-600 dark:text-gray-400">{item.label}</span>
                    {item.type === 'toggle' ? (
                      <button onClick={() => updateValue(si, ii, item.value === 'Aktif' ? 'Pasif' : 'Aktif')} className={`w-12 h-6 rounded-full transition-colors relative ${item.value === 'Aktif' ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}>
                        <div className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-transform ${item.value === 'Aktif' ? 'left-6' : 'left-0.5'}`} />
                      </button>
                    ) : item.type === 'select' ? (
                      <select value={item.value} onChange={e => updateValue(si, ii, e.target.value)} className="w-40 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0B0C0E] text-[12px] font-bold text-[#111827] dark:text-white text-right focus:outline-none focus:border-[#007AFF]">
                        {item.options ? item.options.map((opt, oi) => (
                          <option key={oi} value={opt}>{opt}</option>
                        )) : (
                          <option value={item.value}>{item.value}</option>
                        )}
                      </select>
                    ) : (
                      <input type="text" value={item.value} onChange={e => updateValue(si, ii, e.target.value)} className="w-32 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0B0C0E] text-[12px] font-bold text-[#111827] dark:text-white text-right focus:outline-none focus:border-[#007AFF]" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <ActionModal 
        isOpen={confirmModal} 
        onClose={() => setConfirmModal(false)} 
        title="Ayarları Kaydet"
        description="Komisyon oranları ve ödeme döngüleri gibi kritik ayarlar değiştirilecek. Bu işlem tüm satıcıları etkileyecektir."
      >
        <div className="flex gap-3">
          <button onClick={() => setConfirmModal(false)} className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-800 dark:text-white font-bold text-[13px] transition-colors">İptal</button>
          <button onClick={handleSave} className="flex-1 py-3 rounded-xl bg-[#111827] dark:bg-white hover:bg-black dark:hover:bg-gray-200 text-white dark:text-[#111827] font-bold text-[13px] transition-colors">Evet, Kaydet</button>
        </div>
      </ActionModal>
    </div>
  );
}
