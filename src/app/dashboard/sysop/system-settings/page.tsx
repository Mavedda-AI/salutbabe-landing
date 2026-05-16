'use client';
import React, {useState} from 'react';
import {useRouter} from 'next/navigation';

type SettingItem = { key: string; label: string; value: string; type: 'input' | 'select' | 'toggle' };
type SettingsSection = { section: string; items: SettingItem[] };

export default function SystemSettingsPage() {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [settings, setSettings] = useState<SettingsSection[]>([
    { section: 'Komisyon Ayarları', items: [
      { key: 'default_comm', label: 'Varsayılan Komisyon Oranı', value: '%12.8', type: 'input' },
      { key: 'platinum_comm', label: 'Platinum Satıcı Komisyonu', value: '%8.5', type: 'input' },
      { key: 'gold_comm', label: 'Gold Satıcı Komisyonu', value: '%10.0', type: 'input' },
    ]},
    { section: 'Kargo Ayarları', items: [
      { key: 'free_threshold', label: 'Ücretsiz Kargo Eşiği', value: '₺250', type: 'input' },
      { key: 'default_carrier', label: 'Varsayılan Kargo Firması', value: 'Yurtiçi Kargo', type: 'select' },
      { key: 'max_delivery', label: 'Maksimum Teslim Süresi (gün)', value: '5', type: 'input' },
    ]},
    { section: 'Ödeme Ayarları', items: [
      { key: 'payment_cycle', label: 'Ödeme Döngüsü', value: 'T+3', type: 'select' },
      { key: 'min_payout', label: 'Minimum Hak Ediş Tutarı', value: '₺100', type: 'input' },
      { key: 'auto_limit', label: 'Otomatik Onay Limiti', value: '₺50,000', type: 'input' },
      { key: 'min_order', label: 'Minimum Sipariş Tutarı', value: '₺50', type: 'input' },
    ]},
    { section: 'Sipariş & İade Ayarları', items: [
      { key: 'return_days', label: 'İade Süresi (gün)', value: '14', type: 'input' },
      { key: 'return_policy', label: 'İade Politikası', value: 'Koşulsuz İade', type: 'select' },
    ]},
    { section: 'Bildirim Ayarları', items: [
      { key: 'push', label: 'Push Bildirim', value: 'Aktif', type: 'toggle' },
      { key: 'email', label: 'E-posta Bildirimi', value: 'Aktif', type: 'toggle' },
      { key: 'sms', label: 'SMS Bildirimi', value: 'Pasif', type: 'toggle' },
    ]},
    { section: 'Platform Durumu', items: [
      { key: 'maintenance', label: 'Bakım Modu', value: 'Pasif', type: 'toggle' },
    ]},
  ]);

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

  const cardClass = 'bg-white rounded-[20px] border border-gray-100 shadow-sm';

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      {saved && <div className="fixed top-4 right-4 z-[200] bg-green-600 text-white px-5 py-3 rounded-xl text-[13px] font-bold shadow-2xl animate-fade-in">✅ Ayarlar başarıyla kaydedildi.</div>}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"><svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg></button>
          <div><h1 className="text-[18px] font-black text-[#111827]">Sistem Ayarları</h1><p className="text-[11px] font-medium text-gray-400">Platform konfigürasyonu</p></div>
          <button onClick={() => setConfirmModal(true)} className="ml-auto px-4 py-2 rounded-xl bg-[#111827] text-white text-[10px] font-black tracking-wider hover:bg-black transition-colors">
            KAYDET
          </button>
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-6 pb-20">
        {settings.map((s, si) => (
          <div key={si} className={`${cardClass} p-5`}>
            <h2 className="text-[13px] font-black text-[#111827] mb-4">{s.section}</h2>
            <div className="space-y-4">
              {s.items.map((item, ii) => (
                <div key={ii} className="flex items-center justify-between gap-4">
                  <span className="text-[12px] font-bold text-gray-600">{item.label}</span>
                  {item.type === 'toggle' ? (
                    <button onClick={() => updateValue(si, ii, item.value === 'Aktif' ? 'Pasif' : 'Aktif')} className={`w-12 h-6 rounded-full transition-colors relative ${item.value === 'Aktif' ? 'bg-green-500' : 'bg-gray-300'}`}>
                      <div className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-transform ${item.value === 'Aktif' ? 'left-6' : 'left-0.5'}`} />
                    </button>
                  ) : item.type === 'select' ? (
                    <select value={item.value} onChange={e => updateValue(si, ii, e.target.value)} className="w-40 px-3 py-2 rounded-lg border border-gray-200 text-[12px] font-bold text-[#111827] text-right focus:outline-none focus:border-[#007AFF]">
                      {item.key === 'default_carrier' && <><option>Yurtiçi Kargo</option><option>PTT Kargo</option><option>MNG Kargo</option><option>Aras Kargo</option></>}
                      {item.key === 'payment_cycle' && <><option>T+1</option><option>T+3</option><option>T+5</option><option>T+7</option></>}
                      {item.key === 'return_policy' && <><option>Koşulsuz İade</option><option>Koşullu İade</option><option>Değişim</option></>}
                    </select>
                  ) : (
                    <input type="text" value={item.value} onChange={e => updateValue(si, ii, e.target.value)} className="w-32 px-3 py-2 rounded-lg border border-gray-200 text-[12px] font-bold text-[#111827] text-right focus:outline-none focus:border-[#007AFF]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setConfirmModal(false)}>
          <div onClick={e => e.stopPropagation()} className="w-full max-w-md p-6 rounded-2xl shadow-2xl bg-white border border-gray-200 text-center">
            <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="text-[18px] font-black text-gray-900 mb-2">Ayarları Kaydet</h3>
            <p className="text-[13px] text-gray-500 mb-6">Komisyon oranları ve ödeme döngüleri gibi kritik ayarlar değiştirilecek. Bu işlem tüm satıcıları etkileyecektir.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmModal(false)} className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-[13px] transition-colors">İptal</button>
              <button onClick={handleSave} className="flex-1 py-3 rounded-xl bg-[#111827] hover:bg-black text-white font-bold text-[13px] transition-colors">Evet, Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
