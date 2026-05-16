"use client";
import React, {useState} from 'react';
import LayoutWrapper from '@/components/LayoutWrapper';
import {useRouter} from 'next/navigation';

const invoiceData = [
  { id: 'INV-9501', seller: 'Moda Atölyesi', buyer: 'Ahmet Yılmaz', buyerVkn: '12345678901', amount: 2450, type: 'e-Fatura' as const, saleType: 'Ticari Satış' as const, status: 'Başarılı' as const, gibCode: '1300', date: '16 May 2026' },
  { id: 'INV-9500', seller: 'Bebek Dünyası', buyer: 'Fatma Demir', buyerVkn: '-', amount: 890, type: 'e-Arşiv' as const, saleType: 'Bireysel Satış' as const, status: 'Beklemede' as const, gibCode: '-', date: '16 May 2026' },
  { id: 'INV-9499', seller: 'Zen Aksesuar', buyer: 'Kaya İnşaat A.Ş.', buyerVkn: '9876543210', amount: 3200, type: 'e-Fatura' as const, saleType: 'Ticari Satış' as const, status: 'Hatalı' as const, gibCode: 'Zaman Aşımı', date: '15 May 2026' },
  { id: 'INV-9498', seller: 'Ayakkabı Marketi', buyer: 'Elif Arslan', buyerVkn: '-', amount: 1550, type: 'e-Arşiv' as const, saleType: 'Bireysel Satış' as const, status: 'Başarılı' as const, gibCode: '1300', date: '15 May 2026' },
  { id: 'INV-9497', seller: 'Güzellik Deposu', buyer: 'ABC Kozmetik Ltd.', buyerVkn: '5432109876', amount: 4800, type: 'e-Fatura' as const, saleType: 'Ticari Satış' as const, status: 'Beklemede' as const, gibCode: '-', date: '15 May 2026' },
  { id: 'INV-9496', seller: 'Spor Mağazası', buyer: 'Ali Öztürk', buyerVkn: '-', amount: 720, type: 'e-Arşiv' as const, saleType: 'Bireysel Satış' as const, status: 'Başarılı' as const, gibCode: '1300', date: '14 May 2026' },
  { id: 'INV-9495', seller: 'Ev Tekstili Pro', buyer: 'DEF Mobilya A.Ş.', buyerVkn: '1122334455', amount: 6100, type: 'e-Fatura' as const, saleType: 'Ticari Satış' as const, status: 'Hatalı' as const, gibCode: 'VKN Hatası', date: '14 May 2026' },
  { id: 'INV-9494', seller: 'Dijital Market', buyer: 'Mustafa Şahin', buyerVkn: '-', amount: 1200, type: 'e-Arşiv' as const, saleType: 'Bireysel Satış' as const, status: 'Başarılı' as const, gibCode: '1300', date: '13 May 2026' },
];

type ModalType = null | 'bulk_send' | { type: 'detail'; item: typeof invoiceData[0] };

export default function InvoicesManagement() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'success' | 'pending' | 'error'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'efatura' | 'earsiv'>('all');
  const [selected, setSelected] = useState<string[]>([]);
  const [modal, setModal] = useState<ModalType>(null);

  const filtered = invoiceData.filter(e => {
    const statusOk = filter === 'all' || (filter === 'success' && e.status === 'Başarılı') || (filter === 'pending' && e.status === 'Beklemede') || (filter === 'error' && e.status === 'Hatalı');
    const typeOk = typeFilter === 'all' || (typeFilter === 'efatura' && e.type === 'e-Fatura') || (typeFilter === 'earsiv' && e.type === 'e-Arşiv');
    return statusOk && typeOk;
  });

  const toggleSelect = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map(r => r.id));
  const selectedItems = invoiceData.filter(p => selected.includes(p.id));

  const totalAmount = invoiceData.reduce((s, e) => s + e.amount, 0);

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
              <h1 className="text-[28px] md:text-[32px] font-black tracking-tight text-[#111827] mb-2">GİB e-Fatura Kuyruğu</h1>
              <p className="text-[14px] font-medium text-gray-500">GİB&apos;e iletilen e-Fatura ve e-Arşiv faturalarının durumları ve yönetimi.</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {selected.length > 0 && (
                <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2">
                  <span className="text-[11px] font-black text-blue-700">{selected.length} fatura seçili</span>
                  <button onClick={() => setModal('bulk_send')} className="px-4 py-2 bg-[#111827] text-white rounded-lg text-[11px] font-bold hover:bg-black transition-colors">Toplu GİB&apos;e Gönder</button>
                  <button onClick={() => { alert(`${selected.length} fatura toplu yeniden deneniyor...`); setSelected([]); }} className="px-4 py-2 bg-orange-500 text-white rounded-lg text-[11px] font-bold hover:bg-orange-600 transition-colors">Toplu Yeniden Dene</button>
                </div>
              )}
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-[12px] font-bold hover:bg-gray-50 transition-colors shadow-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Fatura Raporu İndir
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[
              { label: 'Toplam Fatura', value: `₺${totalAmount.toLocaleString('tr-TR')}`, color: 'text-[#111827]', count: invoiceData.length },
              { label: 'Başarılı', value: `${invoiceData.filter(e=>e.status==='Başarılı').length}`, color: 'text-green-600', count: null },
              { label: 'Beklemede', value: `${invoiceData.filter(e=>e.status==='Beklemede').length}`, color: 'text-orange-500', count: null },
              { label: 'Hatalı', value: `${invoiceData.filter(e=>e.status==='Hatalı').length}`, color: 'text-red-500', count: null },
              { label: 'Ticari / Bireysel', value: `${invoiceData.filter(e=>e.saleType==='Ticari Satış').length} / ${invoiceData.filter(e=>e.saleType==='Bireysel Satış').length}`, color: 'text-blue-600', count: null },
            ].map((c, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{c.label}</p>
                  {c.count !== null && <span className="text-[10px] font-black text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{c.count}</span>}
                </div>
                <h2 className={`text-[22px] font-black ${c.color}`}>{c.value}</h2>
              </div>
            ))}
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 flex gap-1 flex-1">
              {([['all','Tümü'],['success','Başarılı'],['pending','Beklemede'],['error','Hatalı']] as const).map(([key, label]) => (
                <button key={key} onClick={() => { setFilter(key); setSelected([]); }} className={`flex-1 px-3 py-2.5 rounded-xl text-[11px] font-bold transition-all ${filter === key ? 'bg-[#111827] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>{label}</button>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 flex gap-1">
              {([['all','Tüm Türler'],['efatura','e-Fatura'],['earsiv','e-Arşiv']] as const).map(([key, label]) => (
                <button key={key} onClick={() => { setTypeFilter(key); setSelected([]); }} className={`px-4 py-2.5 rounded-xl text-[11px] font-bold transition-all ${typeFilter === key ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>{label}</button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pl-6 py-4 w-10"><input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="w-4 h-4 rounded border-gray-300 accent-[#111827]" /></th>
                    {['Fatura No','Satıcı','Alıcı / VKN','Tutar','Tür','Satış Tipi','Durum','GİB Kodu','Tarih','Aksiyon'].map(h => (
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
                      <td className="px-3 py-4">
                        <p className="text-[12px] font-medium text-gray-700">{row.buyer}</p>
                        {row.buyerVkn !== '-' && <p className="text-[10px] text-gray-400">VKN: {row.buyerVkn}</p>}
                      </td>
                      <td className="px-3 py-4 text-[13px] font-black text-[#111827]">₺{row.amount.toLocaleString('tr-TR')}</td>
                      <td className="px-3 py-4">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black ${row.type === 'e-Fatura' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>{row.type}</span>
                      </td>
                      <td className="px-3 py-4">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${row.saleType === 'Ticari Satış' ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}>{row.saleType}</span>
                      </td>
                      <td className="px-3 py-4">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${
                          row.status === 'Başarılı' ? 'bg-green-50 text-green-600' :
                          row.status === 'Beklemede' ? 'bg-orange-50 text-orange-600' :
                          'bg-red-50 text-red-600'
                        }`}>{row.status}</span>
                      </td>
                      <td className="px-3 py-4 text-[11px] font-medium text-gray-500">{row.gibCode}</td>
                      <td className="px-3 py-4 text-[11px] font-medium text-gray-500">{row.date}</td>
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setModal({ type: 'detail', item: row })} className="px-2.5 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-[10px] font-bold hover:bg-gray-200 transition-colors">Detay</button>
                          {row.status === 'Hatalı' && (
                            <button onClick={() => alert(`${row.id} GİB'e yeniden gönderiliyor...`)} className="px-2.5 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-bold hover:bg-blue-100 transition-colors">Yeniden Gönder</button>
                          )}
                          {row.status === 'Beklemede' && (
                            <button onClick={() => alert(`${row.id} GİB'e gönderiliyor...`)} className="px-2.5 py-1.5 bg-[#111827] text-white rounded-lg text-[10px] font-bold hover:bg-black transition-colors">Gönder</button>
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

      {/* Bulk Send Modal */}
      {modal === 'bulk_send' && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setModal(null)}>
          <div className="w-full max-w-lg bg-white rounded-[24px] p-6 shadow-2xl border border-gray-100" onClick={e => e.stopPropagation()}>
            <h3 className="text-[18px] font-black text-[#111827] mb-1">📤 Toplu GİB Gönderimi</h3>
            <p className="text-[12px] text-gray-500 mb-5">{selectedItems.length} fatura GİB sistemine toplu olarak gönderilecek.</p>
            <div className="bg-gray-50 rounded-xl p-4 mb-5 max-h-[200px] overflow-y-auto space-y-2">
              {selectedItems.map(inv => (
                <div key={inv.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-black ${inv.type === 'e-Fatura' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>{inv.type}</span>
                    <span className="text-[12px] font-bold text-gray-800">{inv.id}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${inv.saleType === 'Ticari Satış' ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>{inv.saleType}</span>
                  </div>
                  <span className="text-[12px] font-black text-[#111827]">₺{inv.amount.toLocaleString('tr-TR')}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setModal(null)} className="flex-1 py-3 rounded-xl font-bold text-[13px] bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors">İptal</button>
              <button onClick={() => { alert('Toplu GİB gönderimi başlatıldı!'); setModal(null); setSelected([]); }} className="flex-1 py-3 rounded-xl font-bold text-[13px] bg-[#111827] hover:bg-black text-white transition-colors">Gönderimi Başlat</button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {modal && typeof modal === 'object' && modal.type === 'detail' && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setModal(null)}>
          <div className="w-full max-w-md bg-white rounded-[24px] p-6 shadow-2xl border border-gray-100" onClick={e => e.stopPropagation()}>
            <h3 className="text-[18px] font-black text-[#111827] mb-4">📄 Fatura Detayı</h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 mb-5">
              <div className="flex justify-between"><span className="text-[11px] font-bold text-gray-500">Fatura No</span><span className="text-[12px] font-black">{modal.item.id}</span></div>
              <div className="flex justify-between"><span className="text-[11px] font-bold text-gray-500">Satıcı</span><span className="text-[12px] font-black">{modal.item.seller}</span></div>
              <div className="flex justify-between"><span className="text-[11px] font-bold text-gray-500">Alıcı</span><span className="text-[12px] font-black">{modal.item.buyer}</span></div>
              {modal.item.buyerVkn !== '-' && <div className="flex justify-between"><span className="text-[11px] font-bold text-gray-500">VKN</span><span className="text-[12px] font-mono font-medium">{modal.item.buyerVkn}</span></div>}
              <div className="flex justify-between"><span className="text-[11px] font-bold text-gray-500">Tutar</span><span className="text-[12px] font-black text-[#111827]">₺{modal.item.amount.toLocaleString('tr-TR')}</span></div>
              <div className="flex justify-between"><span className="text-[11px] font-bold text-gray-500">Fatura Türü</span><span className={`text-[11px] font-black px-2 py-0.5 rounded ${modal.item.type === 'e-Fatura' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>{modal.item.type}</span></div>
              <div className="flex justify-between"><span className="text-[11px] font-bold text-gray-500">Satış Tipi</span><span className={`text-[11px] font-bold px-2 py-0.5 rounded ${modal.item.saleType === 'Ticari Satış' ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}>{modal.item.saleType}</span></div>
              <div className="flex justify-between"><span className="text-[11px] font-bold text-gray-500">GİB Kodu</span><span className="text-[12px] font-black">{modal.item.gibCode}</span></div>
              <div className="flex justify-between"><span className="text-[11px] font-bold text-gray-500">Durum</span><span className={`text-[11px] font-black px-2 py-0.5 rounded ${modal.item.status === 'Başarılı' ? 'bg-green-50 text-green-600' : modal.item.status === 'Beklemede' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'}`}>{modal.item.status}</span></div>
            </div>
            <button onClick={() => setModal(null)} className="w-full py-3 rounded-xl font-bold text-[13px] bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors">Kapat</button>
          </div>
        </div>
      )}
    </LayoutWrapper>
  );
}
