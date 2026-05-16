"use client";
import React, {useState} from 'react';
import LayoutWrapper from '@/components/LayoutWrapper';
import {useRouter} from 'next/navigation';

const payoutData = [
  { id: 'PAY-1201', seller: 'Moda Atölyesi', iban: 'TR12 0006 4000 0011 2345 6789 00', amount: 18500, status: 'Beklemede' as const, date: '16 May 2026', orderCount: 12, commission: 2775 },
  { id: 'PAY-1200', seller: 'Bebek Dünyası', iban: 'TR34 0001 2009 0088 7654 3210 01', amount: 42100, status: 'Onaylandı' as const, date: '15 May 2026', orderCount: 28, commission: 6315 },
  { id: 'PAY-1199', seller: 'Ayakkabı Marketi', iban: 'TR56 0004 6006 1611 0000 1234 56', amount: 95200, status: 'Beklemede' as const, date: '15 May 2026', orderCount: 45, commission: 14280 },
  { id: 'PAY-1198', seller: 'Zen Aksesuar', iban: 'TR78 0006 7010 0000 0012 3456 78', amount: 8900, status: 'Ödendi' as const, date: '14 May 2026', orderCount: 6, commission: 1335 },
  { id: 'PAY-1197', seller: 'Güzellik Deposu', iban: 'TR90 0001 0009 0544 4444 5555 00', amount: 34100, status: 'Beklemede' as const, date: '14 May 2026', orderCount: 19, commission: 5115 },
  { id: 'PAY-1196', seller: 'Spor Mağazası', iban: 'TR11 0006 2000 1230 0006 2988 88', amount: 67300, status: 'Onaylandı' as const, date: '13 May 2026', orderCount: 34, commission: 10095 },
  { id: 'PAY-1195', seller: 'Ev Tekstili Pro', iban: 'TR22 0001 5001 5800 7294 9311 01', amount: 15600, status: 'Ödendi' as const, date: '12 May 2026', orderCount: 8, commission: 2340 },
  { id: 'PAY-1194', seller: 'Dijital Market', iban: 'TR33 0011 1000 0000 0012 3456 78', amount: 60400, status: 'Beklemede' as const, date: '12 May 2026', orderCount: 42, commission: 9060 },
];

type ModalType = null | 'pay' | 'bulk_pay' | { type: 'detail'; item: typeof payoutData[0] };

export default function PayoutsManagement() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'paid'>('all');
  const [selected, setSelected] = useState<string[]>([]);
  const [modal, setModal] = useState<ModalType>(null);

  const filtered = payoutData.filter(e => {
    if (filter === 'pending') return e.status === 'Beklemede';
    if (filter === 'approved') return e.status === 'Onaylandı';
    if (filter === 'paid') return e.status === 'Ödendi';
    return true;
  });

  const toggleSelect = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map(r => r.id));
  const selectedItems = payoutData.filter(p => selected.includes(p.id));
  const selectedTotal = selectedItems.reduce((s, p) => s + p.amount, 0);

  const totalPending = payoutData.filter(e => e.status === 'Beklemede').reduce((s, e) => s + e.amount, 0);
  const totalApproved = payoutData.filter(e => e.status === 'Onaylandı').reduce((s, e) => s + e.amount, 0);
  const totalPaid = payoutData.filter(e => e.status === 'Ödendi').reduce((s, e) => s + e.amount, 0);

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
              <h1 className="text-[28px] md:text-[32px] font-black tracking-tight text-[#111827] mb-2">Bekleyen Hakedişler</h1>
              <p className="text-[14px] font-medium text-gray-500">Siparişi tamamlanmış, satıcılara ödeme bekleyen hakediş listesi.</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {selected.length > 0 && (
                <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2">
                  <span className="text-[11px] font-black text-blue-700">{selected.length} satıcı seçili</span>
                  <span className="text-[13px] font-black text-blue-900">₺{selectedTotal.toLocaleString('tr-TR')}</span>
                  <button onClick={() => setModal('bulk_pay')} className="px-4 py-2 bg-green-600 text-white rounded-lg text-[11px] font-bold hover:bg-green-700 transition-colors">Toplu Ödeme Yap</button>
                  <button onClick={() => { alert('Seçili satıcılar onaylandı.'); setSelected([]); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-[11px] font-bold hover:bg-blue-700 transition-colors">Toplu Onayla</button>
                </div>
              )}
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-[12px] font-bold hover:bg-gray-50 transition-colors shadow-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                EFT Dosyası İndir
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Beklemede', value: `₺${totalPending.toLocaleString('tr-TR')}`, color: 'text-orange-500', bg: 'bg-orange-50', count: payoutData.filter(e=>e.status==='Beklemede').length },
              { label: 'Onaylanan', value: `₺${totalApproved.toLocaleString('tr-TR')}`, color: 'text-blue-500', bg: 'bg-blue-50', count: payoutData.filter(e=>e.status==='Onaylandı').length },
              { label: 'Ödenen (Bu Hafta)', value: `₺${totalPaid.toLocaleString('tr-TR')}`, color: 'text-green-600', bg: 'bg-green-50', count: payoutData.filter(e=>e.status==='Ödendi').length },
              { label: 'Toplam Satıcı', value: `${payoutData.length}`, color: 'text-[#111827]', bg: 'bg-white', count: payoutData.length },
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
            {([['all','Tümü'],['pending','Beklemede'],['approved','Onaylandı'],['paid','Ödendi']] as const).map(([key, label]) => (
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
                    {['Hakediş No','Satıcı','IBAN','Tutar','Komisyon','Sp. Adedi','Durum','Tarih','Aksiyon'].map(h => (
                      <th key={h} className="text-left px-3 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(row => (
                    <tr key={row.id} className={`border-b border-gray-50 transition-colors ${selected.includes(row.id) ? 'bg-blue-50/50' : 'hover:bg-gray-50/50'}`}>
                      <td className="pl-6 py-4"><input type="checkbox" checked={selected.includes(row.id)} onChange={() => toggleSelect(row.id)} className="w-4 h-4 rounded border-gray-300 accent-[#111827]" /></td>
                      <td className="px-3 py-4 text-[12px] font-black text-[#111827]">{row.id}</td>
                      <td className="px-3 py-4 text-[12px] font-bold text-gray-700">{row.seller}</td>
                      <td className="px-3 py-4 text-[10px] font-medium text-gray-500 font-mono max-w-[120px] truncate">{row.iban}</td>
                      <td className="px-3 py-4 text-[13px] font-black text-[#111827]">₺{row.amount.toLocaleString('tr-TR')}</td>
                      <td className="px-3 py-4 text-[11px] font-bold text-gray-400">₺{row.commission.toLocaleString('tr-TR')}</td>
                      <td className="px-3 py-4 text-[12px] font-bold text-gray-600">{row.orderCount}</td>
                      <td className="px-3 py-4">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${
                          row.status === 'Beklemede' ? 'bg-orange-50 text-orange-600' :
                          row.status === 'Onaylandı' ? 'bg-blue-50 text-blue-600' :
                          'bg-green-50 text-green-600'
                        }`}>{row.status}</span>
                      </td>
                      <td className="px-3 py-4 text-[11px] font-medium text-gray-500">{row.date}</td>
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setModal({ type: 'detail', item: row })} className="px-2.5 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-[10px] font-bold hover:bg-gray-200 transition-colors">Detay</button>
                          {row.status === 'Beklemede' && (
                            <button onClick={() => alert(`${row.id} onaylandı`)} className="px-2.5 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-bold hover:bg-blue-100 transition-colors">Onayla</button>
                          )}
                          {row.status === 'Onaylandı' && (
                            <button onClick={() => alert(`${row.id} ödeme başlatıldı`)} className="px-2.5 py-1.5 bg-green-50 text-green-700 rounded-lg text-[10px] font-bold hover:bg-green-100 transition-colors">Öde</button>
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

      {/* Bulk Pay Modal */}
      {modal === 'bulk_pay' && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setModal(null)}>
          <div className="w-full max-w-lg bg-white rounded-[24px] p-6 shadow-2xl border border-gray-100" onClick={e => e.stopPropagation()}>
            <h3 className="text-[18px] font-black text-[#111827] mb-1">💰 Toplu Ödeme Onayı</h3>
            <p className="text-[12px] text-gray-500 mb-5">Seçilen {selectedItems.length} satıcıya toplam ₺{selectedTotal.toLocaleString('tr-TR')} tutarında ödeme yapılacak.</p>
            <div className="bg-gray-50 rounded-xl p-4 mb-5 max-h-[200px] overflow-y-auto space-y-2">
              {selectedItems.map(p => (
                <div key={p.id} className="flex justify-between items-center">
                  <div>
                    <span className="text-[12px] font-bold text-gray-800">{p.seller}</span>
                    <span className="text-[10px] text-gray-400 ml-2">{p.id}</span>
                  </div>
                  <span className="text-[12px] font-black text-green-600">₺{p.amount.toLocaleString('tr-TR')}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setModal(null)} className="flex-1 py-3 rounded-xl font-bold text-[13px] bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors">İptal</button>
              <button onClick={() => { alert('Toplu ödeme başlatıldı!'); setModal(null); setSelected([]); }} className="flex-1 py-3 rounded-xl font-bold text-[13px] bg-green-600 hover:bg-green-700 text-white transition-colors">Ödemeyi Başlat</button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {modal && typeof modal === 'object' && modal.type === 'detail' && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setModal(null)}>
          <div className="w-full max-w-md bg-white rounded-[24px] p-6 shadow-2xl border border-gray-100" onClick={e => e.stopPropagation()}>
            <h3 className="text-[18px] font-black text-[#111827] mb-4">📋 Hakediş Detayı</h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 mb-5">
              <div className="flex justify-between"><span className="text-[11px] font-bold text-gray-500">Hakediş No</span><span className="text-[12px] font-black">{modal.item.id}</span></div>
              <div className="flex justify-between"><span className="text-[11px] font-bold text-gray-500">Satıcı</span><span className="text-[12px] font-black">{modal.item.seller}</span></div>
              <div className="flex justify-between"><span className="text-[11px] font-bold text-gray-500">IBAN</span><span className="text-[10px] font-mono font-medium text-gray-600">{modal.item.iban}</span></div>
              <div className="flex justify-between"><span className="text-[11px] font-bold text-gray-500">Brüt Tutar</span><span className="text-[12px] font-black text-[#111827]">₺{modal.item.amount.toLocaleString('tr-TR')}</span></div>
              <div className="flex justify-between"><span className="text-[11px] font-bold text-gray-500">Komisyon</span><span className="text-[12px] font-black text-red-500">-₺{modal.item.commission.toLocaleString('tr-TR')}</span></div>
              <div className="h-px bg-gray-200 my-1"></div>
              <div className="flex justify-between"><span className="text-[11px] font-black text-gray-700">Net Ödeme</span><span className="text-[13px] font-black text-green-600">₺{(modal.item.amount - modal.item.commission).toLocaleString('tr-TR')}</span></div>
              <div className="flex justify-between"><span className="text-[11px] font-bold text-gray-500">Sipariş Adedi</span><span className="text-[12px] font-black">{modal.item.orderCount}</span></div>
            </div>
            <button onClick={() => setModal(null)} className="w-full py-3 rounded-xl font-bold text-[13px] bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors">Kapat</button>
          </div>
        </div>
      )}
    </LayoutWrapper>
  );
}
