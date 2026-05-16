"use client";
import React, {useState} from 'react';
import LayoutWrapper from '@/components/LayoutWrapper';
import {useRouter} from 'next/navigation';

const failedData = [
  { id: 'FP-301', seller: 'Moda Atölyesi', iban: 'TR12 0006 4000 0011 2345 6789 00', amount: 4200, error: 'İsim Uyuşmazlığı' as const, attempts: 2, date: '16 May 2026', email: 'moda@atolye.com', phone: '0532 *** 45 67' },
  { id: 'FP-300', seller: 'Zen Aksesuar', iban: 'TR78 0006 7010 0000 0012 3456 78', amount: 1800, error: 'IBAN Geçersiz' as const, attempts: 3, date: '15 May 2026', email: 'info@zenaksesuar.com', phone: '0544 *** 89 01' },
  { id: 'FP-299', seller: 'Bebek Dünyası', iban: 'TR34 0001 2009 0088 7654 3210 01', amount: 2500, error: 'Hesap Kapalı' as const, attempts: 1, date: '15 May 2026', email: 'satici@bebekdunyasi.com', phone: '0555 *** 23 45' },
  { id: 'FP-298', seller: 'Güzellik Deposu', iban: 'TR90 0001 0009 0544 4444 5555 00', amount: 3100, error: 'İsim Uyuşmazlığı' as const, attempts: 2, date: '14 May 2026', email: 'destek@guzellik.com', phone: '0533 *** 67 89' },
  { id: 'FP-297', seller: 'Spor Mağazası', iban: 'TR11 0006 2000 1230 0006 2988 88', amount: 950, error: 'Banka Zaman Aşımı' as const, attempts: 4, date: '13 May 2026', email: 'spor@magaza.com', phone: '0541 *** 01 23' },
  { id: 'FP-296', seller: 'Ev Tekstili Pro', iban: 'TR22 0001 5001 5800 7294 9311 01', amount: 5900, error: 'IBAN Geçersiz' as const, attempts: 1, date: '12 May 2026', email: 'ev@tekstilpro.com', phone: '0546 *** 45 67' },
];

type ModalType = null | { type: 'notify'; item: typeof failedData[0] } | { type: 'detail'; item: typeof failedData[0] };

export default function FailedPayoutsManagement() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'iban' | 'name' | 'other'>('all');
  const [selected, setSelected] = useState<string[]>([]);
  const [modal, setModal] = useState<ModalType>(null);
  const [notifyMsg, setNotifyMsg] = useState('');

  const filtered = failedData.filter(e => {
    if (filter === 'iban') return e.error === 'IBAN Geçersiz';
    if (filter === 'name') return e.error === 'İsim Uyuşmazlığı';
    if (filter === 'other') return e.error !== 'IBAN Geçersiz' && e.error !== 'İsim Uyuşmazlığı';
    return true;
  });

  const toggleSelect = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map(r => r.id));
  const totalFailed = failedData.reduce((s, e) => s + e.amount, 0);

  const getDefaultMsg = (error: string) => {
    if (error === 'İsim Uyuşmazlığı') return 'Sayın Satıcımız, ödemeniz IBAN üzerindeki isim ile hesap isminiz uyuşmadığı için gerçekleştirilemedi. Lütfen IBAN bilgilerinizi kontrol ederek güncelleyiniz.';
    if (error === 'IBAN Geçersiz') return 'Sayın Satıcımız, tanımlı IBAN numaranız geçersiz olduğu için ödemeniz gerçekleştirilemedi. Lütfen geçerli bir IBAN numarası tanımlayınız.';
    if (error === 'Hesap Kapalı') return 'Sayın Satıcımız, tanımlı banka hesabınız kapalı olduğu için ödemeniz gerçekleştirilemedi. Lütfen aktif bir banka hesabı tanımlayınız.';
    return 'Sayın Satıcımız, ödemeniz teknik bir sorun nedeniyle gerçekleştirilemedi. Lütfen banka bilgilerinizi kontrol ediniz.';
  };

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-[#F9FAFB] pt-24 pb-20 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <button onClick={() => router.push('/dashboard/sysop/finance-management')} className="flex items-center gap-1.5 text-[13px] font-bold text-gray-400 hover:text-gray-900 transition-colors mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Finans Paneline Dön
          </button>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-[28px] md:text-[32px] font-black tracking-tight text-[#111827] mb-2">Başarısız Ödemeler</h1>
              <p className="text-[14px] font-medium text-gray-500">IBAN veya isim uyuşmazlığı nedeniyle bankadan dönen EFT işlemleri.</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {selected.length > 0 && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-2">
                  <span className="text-[11px] font-black text-red-700">{selected.length} seçili</span>
                  <button onClick={() => { alert(`${selected.length} satıcıya toplu bildirim gönderildi.`); setSelected([]); }} className="px-4 py-2 bg-orange-500 text-white rounded-lg text-[11px] font-bold hover:bg-orange-600 transition-colors">Toplu Bildirim Gönder</button>
                  <button onClick={() => { alert(`${selected.length} ödeme toplu yeniden deneniyor...`); setSelected([]); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-[11px] font-bold hover:bg-blue-700 transition-colors">Toplu Yeniden Dene</button>
                </div>
              )}
            </div>
          </div>

          {/* Alert */}
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <div>
                <h3 className="text-[13px] font-black text-red-800">Toplam ₺{totalFailed.toLocaleString('tr-TR')} tutarında ödeme başarısız oldu</h3>
                <p className="text-[11px] text-red-600 mt-0.5">{failedData.length} satıcı etkilendi. IBAN bilgilerini güncellemeleri için bildirim gönderin.</p>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Toplam Başarısız', value: `₺${totalFailed.toLocaleString('tr-TR')}`, color: 'text-red-500' },
              { label: 'IBAN Hatası', value: `${failedData.filter(e=>e.error==='IBAN Geçersiz').length}`, color: 'text-orange-500' },
              { label: 'İsim Uyuşmazlığı', value: `${failedData.filter(e=>e.error==='İsim Uyuşmazlığı').length}`, color: 'text-purple-500' },
              { label: 'Diğer Hatalar', value: `${failedData.filter(e=>e.error!=='IBAN Geçersiz'&&e.error!=='İsim Uyuşmazlığı').length}`, color: 'text-gray-600' },
            ].map((c, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">{c.label}</p>
                <h2 className={`text-[22px] font-black ${c.color}`}>{c.value}</h2>
              </div>
            ))}
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 flex gap-1 mb-6">
            {([['all','Tümü'],['iban','IBAN Hatası'],['name','İsim Uyuşmazlığı'],['other','Diğer']] as const).map(([key, label]) => (
              <button key={key} onClick={() => { setFilter(key); setSelected([]); }} className={`flex-1 px-3 py-2.5 rounded-xl text-[11px] font-bold transition-all ${filter === key ? 'bg-red-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>{label}</button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pl-6 py-4 w-10"><input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="w-4 h-4 rounded border-gray-300 accent-red-500" /></th>
                    {['Hata No','Satıcı','IBAN','Tutar','Hata Sebebi','Deneme','Tarih','Aksiyon'].map(h => (
                      <th key={h} className="text-left px-3 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(row => (
                    <tr key={row.id} className={`border-b border-gray-50 transition-colors ${selected.includes(row.id) ? 'bg-red-50/50' : 'hover:bg-gray-50/50'}`}>
                      <td className="pl-6 py-4"><input type="checkbox" checked={selected.includes(row.id)} onChange={() => toggleSelect(row.id)} className="w-4 h-4 rounded border-gray-300 accent-red-500" /></td>
                      <td className="px-3 py-4 text-[12px] font-black text-red-500">{row.id}</td>
                      <td className="px-3 py-4">
                        <p className="text-[12px] font-bold text-gray-800">{row.seller}</p>
                        <p className="text-[10px] text-gray-400">{row.email}</p>
                      </td>
                      <td className="px-3 py-4 text-[10px] font-medium text-gray-500 font-mono max-w-[100px] truncate">{row.iban}</td>
                      <td className="px-3 py-4 text-[13px] font-black text-[#111827]">₺{row.amount.toLocaleString('tr-TR')}</td>
                      <td className="px-3 py-4">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black ${
                          row.error === 'İsim Uyuşmazlığı' ? 'bg-purple-50 text-purple-600' :
                          row.error === 'IBAN Geçersiz' ? 'bg-orange-50 text-orange-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>{row.error}</span>
                      </td>
                      <td className="px-3 py-4 text-[12px] font-bold text-gray-600">{row.attempts}x</td>
                      <td className="px-3 py-4 text-[11px] font-medium text-gray-500">{row.date}</td>
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button onClick={() => alert(`${row.id} yeniden deneniyor...`)} className="px-2.5 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-bold hover:bg-blue-100 transition-colors">Yeniden Dene</button>
                          <button onClick={() => { setNotifyMsg(getDefaultMsg(row.error)); setModal({ type: 'notify', item: row }); }} className="px-2.5 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-[10px] font-bold hover:bg-orange-100 transition-colors">Bildirim Gönder</button>
                          <button onClick={() => setModal({ type: 'detail', item: row })} className="px-2.5 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-[10px] font-bold hover:bg-gray-200 transition-colors">Detay</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Notify Modal */}
      {modal && modal.type === 'notify' && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => { setModal(null); setNotifyMsg(''); }}>
          <div className="w-full max-w-lg bg-white rounded-[24px] p-6 shadow-2xl border border-gray-100" onClick={e => e.stopPropagation()}>
            <h3 className="text-[18px] font-black text-[#111827] mb-1">📩 Satıcıya Bildirim Gönder</h3>
            <p className="text-[12px] text-gray-500 mb-5">{modal.item.seller} — IBAN kontrolü ve güncelleme talebi</p>
            <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-2">
              <div className="flex justify-between"><span className="text-[11px] font-bold text-gray-500">Satıcı</span><span className="text-[12px] font-black">{modal.item.seller}</span></div>
              <div className="flex justify-between"><span className="text-[11px] font-bold text-gray-500">E-posta</span><span className="text-[12px] font-medium text-blue-600">{modal.item.email}</span></div>
              <div className="flex justify-between"><span className="text-[11px] font-bold text-gray-500">Telefon</span><span className="text-[12px] font-medium">{modal.item.phone}</span></div>
              <div className="flex justify-between"><span className="text-[11px] font-bold text-gray-500">Hata</span><span className="text-[12px] font-black text-red-500">{modal.item.error}</span></div>
              <div className="flex justify-between"><span className="text-[11px] font-bold text-gray-500">Tutar</span><span className="text-[12px] font-black text-[#111827]">₺{modal.item.amount.toLocaleString('tr-TR')}</span></div>
            </div>
            <div className="mb-5">
              <label className="block text-[11px] font-bold uppercase text-gray-400 mb-2">Bildirim Mesajı</label>
              <textarea value={notifyMsg} onChange={e => setNotifyMsg(e.target.value)} rows={4} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[13px] font-medium focus:border-[#111827] focus:ring-1 focus:ring-[#111827] outline-none transition-colors resize-none" />
            </div>
            <div className="flex items-center gap-3 mb-5">
              <label className="flex items-center gap-2 text-[11px] font-bold text-gray-600"><input type="checkbox" defaultChecked className="w-4 h-4 accent-[#111827]" /> E-posta</label>
              <label className="flex items-center gap-2 text-[11px] font-bold text-gray-600"><input type="checkbox" defaultChecked className="w-4 h-4 accent-[#111827]" /> Uygulama İçi Bildirim</label>
              <label className="flex items-center gap-2 text-[11px] font-bold text-gray-600"><input type="checkbox" className="w-4 h-4 accent-[#111827]" /> SMS</label>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setModal(null); setNotifyMsg(''); }} className="flex-1 py-3 rounded-xl font-bold text-[13px] bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors">İptal</button>
              <button onClick={() => { alert(`${modal.item.seller} satıcısına bildirim gönderildi.`); setModal(null); setNotifyMsg(''); }} className="flex-1 py-3 rounded-xl font-bold text-[13px] bg-orange-500 hover:bg-orange-600 text-white transition-colors">Bildirimi Gönder</button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {modal && modal.type === 'detail' && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setModal(null)}>
          <div className="w-full max-w-md bg-white rounded-[24px] p-6 shadow-2xl border border-gray-100" onClick={e => e.stopPropagation()}>
            <h3 className="text-[18px] font-black text-[#111827] mb-4">📋 Başarısız Ödeme Detayı</h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 mb-5">
              <div className="flex justify-between"><span className="text-[11px] font-bold text-gray-500">Hata No</span><span className="text-[12px] font-black text-red-500">{modal.item.id}</span></div>
              <div className="flex justify-between"><span className="text-[11px] font-bold text-gray-500">Satıcı</span><span className="text-[12px] font-black">{modal.item.seller}</span></div>
              <div className="flex justify-between"><span className="text-[11px] font-bold text-gray-500">IBAN</span><span className="text-[10px] font-mono font-medium text-gray-600">{modal.item.iban}</span></div>
              <div className="flex justify-between"><span className="text-[11px] font-bold text-gray-500">E-posta</span><span className="text-[12px] font-medium text-blue-600">{modal.item.email}</span></div>
              <div className="flex justify-between"><span className="text-[11px] font-bold text-gray-500">Telefon</span><span className="text-[12px] font-medium">{modal.item.phone}</span></div>
              <div className="flex justify-between"><span className="text-[11px] font-bold text-gray-500">Tutar</span><span className="text-[12px] font-black text-[#111827]">₺{modal.item.amount.toLocaleString('tr-TR')}</span></div>
              <div className="flex justify-between"><span className="text-[11px] font-bold text-gray-500">Hata Sebebi</span><span className="text-[12px] font-black text-red-500">{modal.item.error}</span></div>
              <div className="flex justify-between"><span className="text-[11px] font-bold text-gray-500">Deneme Sayısı</span><span className="text-[12px] font-black">{modal.item.attempts}x</span></div>
            </div>
            <button onClick={() => setModal(null)} className="w-full py-3 rounded-xl font-bold text-[13px] bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors">Kapat</button>
          </div>
        </div>
      )}
    </LayoutWrapper>
  );
}
