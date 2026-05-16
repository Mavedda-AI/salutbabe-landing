"use client";
import React, {useState} from 'react';
import LayoutWrapper from '@/components/LayoutWrapper';
import {useRouter} from 'next/navigation';

const escrowData = [
  { id: 'ESC-4821', seller: 'Moda Atölyesi', amount: 42500, order: '#SP-8412', status: 'Blokeli' as const, daysLeft: 8, date: '08 May 2026', reason: 'İade süreci devam ediyor', buyer: 'Ahmet Yılmaz' },
  { id: 'ESC-4820', seller: 'Bebek Dünyası', amount: 18200, order: '#SP-8390', status: 'Blokeli' as const, daysLeft: 12, date: '04 May 2026', reason: 'Kargo hasarı inceleniyor', buyer: 'Fatma Demir' },
  { id: 'ESC-4819', seller: 'Ayakkabı Marketi', amount: 95000, order: '#SP-8355', status: 'Uyuşmazlık' as const, daysLeft: 3, date: '13 May 2026', reason: 'Ürün açıklamasıyla uyuşmuyor', buyer: 'Elif Arslan' },
  { id: 'ESC-4818', seller: 'Zen Aksesuar', amount: 12800, order: '#SP-8340', status: 'Serbest' as const, daysLeft: 0, date: '14 May 2026', reason: 'Süre doldu, otomatik serbest', buyer: 'Zeynep Çelik' },
  { id: 'ESC-4817', seller: 'Güzellik Deposu', amount: 34100, order: '#SP-8322', status: 'Blokeli' as const, daysLeft: 6, date: '10 May 2026', reason: 'Alıcı şikâyet açtı', buyer: 'Ali Öztürk' },
  { id: 'ESC-4816', seller: 'Spor Mağazası', amount: 67300, order: '#SP-8301', status: 'Uyuşmazlık' as const, daysLeft: 1, date: '15 May 2026', reason: 'Eksik ürün teslim edildi', buyer: 'Mehmet Kaya' },
  { id: 'ESC-4815', seller: 'Ev Tekstili Pro', amount: 28900, order: '#SP-8280', status: 'Serbest' as const, daysLeft: 0, date: '16 May 2026', reason: 'Alıcı onayladı', buyer: 'Ayşe Koç' },
  { id: 'ESC-4814', seller: 'Dijital Market', amount: 156000, order: '#SP-8250', status: 'Blokeli' as const, daysLeft: 14, date: '02 May 2026', reason: 'Dolandırıcılık şüphesi', buyer: 'Mustafa Şahin' },
];

type ModalType = null | { type: 'release'; item: typeof escrowData[0] } | { type: 'refund'; item: typeof escrowData[0] } | { type: 'escalate'; item: typeof escrowData[0] } | { type: 'detail'; item: typeof escrowData[0] };

export default function EscrowManagement() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'blocked' | 'dispute' | 'free'>('all');
  const [selected, setSelected] = useState<string[]>([]);
  const [modal, setModal] = useState<ModalType>(null);
  const [actionNote, setActionNote] = useState('');

  const filtered = escrowData.filter(e => {
    if (filter === 'blocked') return e.status === 'Blokeli';
    if (filter === 'dispute') return e.status === 'Uyuşmazlık';
    if (filter === 'free') return e.status === 'Serbest';
    return true;
  });

  const toggleSelect = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map(r => r.id));

  const totalBlocked = escrowData.filter(e => e.status === 'Blokeli').reduce((s, e) => s + e.amount, 0);
  const totalDispute = escrowData.filter(e => e.status === 'Uyuşmazlık').reduce((s, e) => s + e.amount, 0);
  const totalFree = escrowData.filter(e => e.status === 'Serbest').reduce((s, e) => s + e.amount, 0);
  const totalAll = escrowData.reduce((s, e) => s + e.amount, 0);

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
              <h1 className="text-[28px] md:text-[32px] font-black tracking-tight text-[#111827] mb-2">Havuz (Emanet) Hesap Detayları</h1>
              <p className="text-[14px] font-medium text-gray-500">Siparişe bağlı bloke edilen tutarlar, uyuşmazlıklar ve çözüm süreçleri.</p>
            </div>
            <div className="flex items-center gap-3">
              {selected.length > 0 && (
                <>
                  <span className="text-[11px] font-bold text-gray-500">{selected.length} seçili</span>
                  <button onClick={() => alert('Seçili emanetler toplu serbest bırakılıyor...')} className="px-4 py-2.5 bg-green-600 text-white rounded-xl text-[12px] font-bold hover:bg-green-700 transition-colors">Toplu Serbest Bırak</button>
                  <button onClick={() => alert('Seçili emanetler toplu iade ediliyor...')} className="px-4 py-2.5 bg-red-500 text-white rounded-xl text-[12px] font-bold hover:bg-red-600 transition-colors">Toplu İade Et</button>
                </>
              )}
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Toplam Emanet', value: `₺${totalAll.toLocaleString('tr-TR')}`, color: 'text-[#111827]', bg: 'bg-white', count: escrowData.length },
              { label: 'Blokeli Tutar', value: `₺${totalBlocked.toLocaleString('tr-TR')}`, color: 'text-orange-500', bg: 'bg-orange-50', count: escrowData.filter(e=>e.status==='Blokeli').length },
              { label: 'Uyuşmazlık', value: `₺${totalDispute.toLocaleString('tr-TR')}`, color: 'text-red-500', bg: 'bg-red-50', count: escrowData.filter(e=>e.status==='Uyuşmazlık').length },
              { label: 'Serbest Bırakılan', value: `₺${totalFree.toLocaleString('tr-TR')}`, color: 'text-green-600', bg: 'bg-green-50', count: escrowData.filter(e=>e.status==='Serbest').length },
            ].map((c, i) => (
              <div key={i} className={`${c.bg} rounded-2xl p-5 border border-gray-100 shadow-sm`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{c.label}</p>
                  <span className="text-[10px] font-black text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{c.count}</span>
                </div>
                <h2 className={`text-[22px] font-black ${c.color}`}>{c.value}</h2>
              </div>
            ))}
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 flex gap-1 mb-6">
            {([['all','Tümü'],['blocked','Blokeli'],['dispute','Uyuşmazlık'],['free','Serbest']] as const).map(([key, label]) => (
              <button key={key} onClick={() => { setFilter(key); setSelected([]); }} className={`flex-1 px-3 py-2.5 rounded-xl text-[11px] font-bold transition-all ${filter === key ? 'bg-[#111827] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>{label}</button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pl-6 py-4 w-10"><input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="w-4 h-4 rounded border-gray-300 accent-[#111827]" /></th>
                    {['Emanet No','Satıcı / Alıcı','Tutar','Sipariş','Durum','Kalan Gün','Sebep','Aksiyon'].map(h => (
                      <th key={h} className="text-left px-4 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(row => (
                    <tr key={row.id} className={`border-b border-gray-50 transition-colors ${selected.includes(row.id) ? 'bg-blue-50/50' : 'hover:bg-gray-50/50'}`}>
                      <td className="pl-6 py-4"><input type="checkbox" checked={selected.includes(row.id)} onChange={() => toggleSelect(row.id)} className="w-4 h-4 rounded border-gray-300 accent-[#111827]" /></td>
                      <td className="px-4 py-4 text-[12px] font-black text-[#111827]">{row.id}</td>
                      <td className="px-4 py-4">
                        <p className="text-[12px] font-bold text-gray-800">{row.seller}</p>
                        <p className="text-[10px] text-gray-400">Alıcı: {row.buyer}</p>
                      </td>
                      <td className="px-4 py-4 text-[13px] font-black text-[#111827]">₺{row.amount.toLocaleString('tr-TR')}</td>
                      <td className="px-4 py-4 text-[11px] font-medium text-gray-500">{row.order}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${
                          row.status === 'Blokeli' ? 'bg-orange-50 text-orange-600' :
                          row.status === 'Uyuşmazlık' ? 'bg-red-50 text-red-600' :
                          'bg-green-50 text-green-600'
                        }`}>{row.status}</span>
                      </td>
                      <td className="px-4 py-4 text-[12px] font-black text-gray-700">{row.daysLeft > 0 ? `${row.daysLeft} gün` : '—'}</td>
                      <td className="px-4 py-4 text-[10px] font-medium text-gray-500 max-w-[140px] truncate">{row.reason}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setModal({ type: 'detail', item: row })} className="px-2 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-[10px] font-bold hover:bg-gray-200 transition-colors" title="Detay">📋</button>
                          {row.status !== 'Serbest' && (
                            <>
                              <button onClick={() => setModal({ type: 'release', item: row })} className="px-2 py-1.5 bg-green-50 text-green-700 rounded-lg text-[10px] font-bold hover:bg-green-100 transition-colors" title="Serbest Bırak">✅</button>
                              <button onClick={() => setModal({ type: 'refund', item: row })} className="px-2 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-[10px] font-bold hover:bg-orange-100 transition-colors" title="İade Et">↩️</button>
                              <button onClick={() => setModal({ type: 'escalate', item: row })} className="px-2 py-1.5 bg-red-50 text-red-700 rounded-lg text-[10px] font-bold hover:bg-red-100 transition-colors" title="Eskalasyon">⚠️</button>
                            </>
                          )}
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

      {/* Action Modal */}
      {modal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => { setModal(null); setActionNote(''); }}>
          <div className="w-full max-w-md bg-white rounded-[24px] p-6 shadow-2xl border border-gray-100" onClick={e => e.stopPropagation()}>
            <h3 className="text-[18px] font-black text-[#111827] mb-1">
              {modal.type === 'release' && '💰 Emaneti Serbest Bırak'}
              {modal.type === 'refund' && '↩️ Alıcıya İade Et'}
              {modal.type === 'escalate' && '⚠️ Eskalasyona Yükselt'}
              {modal.type === 'detail' && '📋 Emanet Detayı'}
            </h3>
            <p className="text-[12px] text-gray-500 mb-5">
              {modal.type === 'detail' ? `${modal.item.id} numaralı emanet kaydı` : `${modal.item.id} için işlem onayı`}
            </p>

            <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-2">
              <div className="flex justify-between"><span className="text-[11px] font-bold text-gray-500">Satıcı</span><span className="text-[12px] font-black text-gray-900">{modal.item.seller}</span></div>
              <div className="flex justify-between"><span className="text-[11px] font-bold text-gray-500">Alıcı</span><span className="text-[12px] font-black text-gray-900">{modal.item.buyer}</span></div>
              <div className="flex justify-between"><span className="text-[11px] font-bold text-gray-500">Tutar</span><span className="text-[12px] font-black text-green-600">₺{modal.item.amount.toLocaleString('tr-TR')}</span></div>
              <div className="flex justify-between"><span className="text-[11px] font-bold text-gray-500">Sipariş</span><span className="text-[12px] font-black text-gray-900">{modal.item.order}</span></div>
              <div className="flex justify-between"><span className="text-[11px] font-bold text-gray-500">Sebep</span><span className="text-[12px] font-bold text-gray-700">{modal.item.reason}</span></div>
              <div className="flex justify-between"><span className="text-[11px] font-bold text-gray-500">Kalan Süre</span><span className="text-[12px] font-black text-orange-500">{modal.item.daysLeft > 0 ? `${modal.item.daysLeft} gün` : 'Süre doldu'}</span></div>
            </div>

            {modal.type !== 'detail' && (
              <div className="mb-5">
                <label className="block text-[11px] font-bold uppercase text-gray-400 mb-2">İşlem Notu (Zorunlu)</label>
                <textarea value={actionNote} onChange={e => setActionNote(e.target.value)} rows={3} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[13px] font-medium focus:border-[#111827] focus:ring-1 focus:ring-[#111827] outline-none transition-colors resize-none" placeholder="İşlem sebebini açıklayın..." />
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => { setModal(null); setActionNote(''); }} className="flex-1 py-3 rounded-xl font-bold text-[13px] bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors">
                {modal.type === 'detail' ? 'Kapat' : 'İptal'}
              </button>
              {modal.type !== 'detail' && (
                <button onClick={() => { alert(`${modal.type === 'release' ? 'Serbest bırakma' : modal.type === 'refund' ? 'İade' : 'Eskalasyon'} işlemi başlatıldı.\nNot: ${actionNote}`); setModal(null); setActionNote(''); }}
                  disabled={!actionNote.trim()}
                  className={`flex-1 py-3 rounded-xl font-bold text-[13px] text-white transition-colors ${
                    !actionNote.trim() ? 'bg-gray-300 cursor-not-allowed' :
                    modal.type === 'release' ? 'bg-green-600 hover:bg-green-700' :
                    modal.type === 'refund' ? 'bg-orange-500 hover:bg-orange-600' :
                    'bg-red-500 hover:bg-red-600'
                  }`}>
                  {modal.type === 'release' && 'Serbest Bırak'}
                  {modal.type === 'refund' && 'İade Et'}
                  {modal.type === 'escalate' && 'Eskalasyona Yükselt'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </LayoutWrapper>
  );
}
