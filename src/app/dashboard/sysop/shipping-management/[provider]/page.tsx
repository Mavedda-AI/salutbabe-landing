'use client';
import {HugeiconsIcon} from '@hugeicons/react';
import {Alert02Icon, Package01Icon, Tick01Icon, Timer02Icon, TruckIcon} from '@hugeicons/core-free-icons';
import React, {useMemo, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';

const allShipmentsData: Record<string, { id: string; buyer: string; city: string; amount: string; status: 'teslim' | 'yolda' | 'gecikme' | 'hasar'; date: string; days: number; trackingNo: string }[]> = {
  'Yurtiçi Kargo': Array.from({ length: 48 }, (_, i) => {
    const statuses: ('teslim' | 'yolda' | 'gecikme' | 'hasar')[] = ['teslim', 'yolda', 'gecikme', 'hasar'];
    const cities = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Konya', 'Adana', 'Gaziantep'];
    const names = ['Ayşe Yıldız', 'Mehmet Öz', 'Fatma Kara', 'Ali Demir', 'Zehra Aksoy', 'Can Yılmaz', 'Seda Koç', 'Burak Tan', 'Elif Şahin', 'Kemal Aydın', 'Derya Polat', 'Emre Güneş'];
    return { id: `SHP-${5001 + i}`, buyer: names[i % names.length], city: cities[i % cities.length], amount: `₺${(Math.floor(Math.random() * 900) + 100).toLocaleString()}`, status: statuses[i % 4], date: `${10 + (i % 8)} May`, days: 1 + (i % 7), trackingNo: `YK${100000000 + i}` };
  }),
  'Aras Kargo': Array.from({ length: 36 }, (_, i) => {
    const statuses: ('teslim' | 'yolda' | 'gecikme' | 'hasar')[] = ['teslim', 'yolda', 'gecikme', 'hasar'];
    const cities = ['İstanbul', 'Ankara', 'Trabzon', 'Samsun', 'Erzurum', 'Konya'];
    const names = ['Selin Taş', 'Emre Koç', 'Nilüfer Ay', 'Burak Şen', 'Deniz Kurt', 'Hülya Çelik', 'Oğuz Han', 'Pınar Duran'];
    return { id: `SHP-${5101 + i}`, buyer: names[i % names.length], city: cities[i % cities.length], amount: `₺${(Math.floor(Math.random() * 900) + 100).toLocaleString()}`, status: statuses[i % 4], date: `${10 + (i % 8)} May`, days: 1 + (i % 7), trackingNo: `AR${200000000 + i}` };
  }),
  'MNG Kargo': Array.from({ length: 22 }, (_, i) => {
    const statuses: ('teslim' | 'yolda' | 'gecikme' | 'hasar')[] = ['teslim', 'yolda', 'gecikme', 'hasar'];
    const cities = ['İstanbul', 'Ankara', 'Bursa', 'Antalya', 'Mersin'];
    const names = ['Gül Öztürk', 'Murat Polat', 'Ece Duran', 'Hasan Avcı', 'Aylin Kaya', 'Serkan Demir'];
    return { id: `SHP-${5201 + i}`, buyer: names[i % names.length], city: cities[i % cities.length], amount: `₺${(Math.floor(Math.random() * 900) + 100).toLocaleString()}`, status: statuses[i % 4], date: `${10 + (i % 8)} May`, days: 1 + (i % 7), trackingNo: `MN${300000000 + i}` };
  }),
  'PTT Kargo': Array.from({ length: 18 }, (_, i) => {
    const statuses: ('teslim' | 'yolda' | 'gecikme' | 'hasar')[] = ['teslim', 'gecikme', 'gecikme', 'hasar'];
    const cities = ['İstanbul', 'Samsun', 'Diyarbakır', 'Erzurum', 'Mersin', 'Van'];
    const names = ['Büşra Kaya', 'Kemal Akın', 'Ayça Yıldırım', 'Okan Erdem', 'Pelin Arslan', 'Tuğçe Bal'];
    return { id: `SHP-${5301 + i}`, buyer: names[i % names.length], city: cities[i % cities.length], amount: `₺${(Math.floor(Math.random() * 900) + 100).toLocaleString()}`, status: statuses[i % 4], date: `${10 + (i % 8)} May`, days: 1 + (i % 7), trackingNo: `PT${400000000 + i}` };
  }),
};

const providerStats: Record<string, { shipments: number; onTime: number; avgDays: number; cost: string; trend: string }> = {
  'Yurtiçi Kargo': { shipments: 4820, onTime: 94.2, avgDays: 1.8, cost: '₺28.50', trend: '↗' },
  'Aras Kargo': { shipments: 3640, onTime: 92.1, avgDays: 2.1, cost: '₺26.80', trend: '→' },
  'MNG Kargo': { shipments: 2180, onTime: 89.5, avgDays: 2.6, cost: '₺24.20', trend: '↘' },
  'PTT Kargo': { shipments: 1840, onTime: 82.4, avgDays: 3.8, cost: '₺18.50', trend: '↘' },
};

export default function ProviderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const providerName = decodeURIComponent(params.provider as string);
  const stats = providerStats[providerName] || { shipments: 0, onTime: 0, avgDays: 0, cost: '₺0', trend: '→' };
  const shipments = allShipmentsData[providerName] || [];

  const [statusFilter, setStatusFilter] = useState('Tümü');
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [complaintOpen, setComplaintOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const perPage = 10;

  const filtered = useMemo(() => {
    let result = shipments;
    if (statusFilter !== 'Tümü') result = result.filter(s => s.status === statusFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => s.buyer.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.city.toLowerCase().includes(q) || s.trackingNo.toLowerCase().includes(q));
    }
    return result;
  }, [statusFilter, searchQuery, shipments]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const statusBadge = (s: string) => ({ teslim: 'bg-green-50 text-green-600', yolda: 'bg-blue-50 text-blue-600', gecikme: 'bg-red-50 text-red-600', hasar: 'bg-purple-50 text-purple-600' }[s] || 'bg-gray-50 text-gray-600');
  const statusLabel = (s: string) => ({ teslim: 'Teslim Edildi', yolda: 'Yolda', gecikme: 'Gecikme', hasar: 'Hasarlı' }[s] || s);
  const cardClass = 'bg-white rounded-[20px] border border-gray-100 shadow-sm';

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#111827] flex items-center justify-center">
              <HugeiconsIcon icon={TruckIcon} size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-[18px] font-black text-[#111827]">{providerName}</h1>
              <p className="text-[11px] font-medium text-gray-400">{stats.shipments.toLocaleString()} toplam kargo · Son 30 gün</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => setComplaintOpen(true)} className="text-[11px] font-bold text-red-500 hover:text-red-600 flex items-center gap-1 px-3 py-2 rounded-xl border border-red-200 bg-white">
              <HugeiconsIcon icon={Alert02Icon} size={14} /> Şikayet
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-5 pb-20">
        {/* Summary KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Toplam Kargo', value: stats.shipments.toLocaleString(), color: 'text-[#111827]', icon: <HugeiconsIcon icon={Package01Icon} size={24} className="text-[#111827]" /> },
            { label: 'Zamanında', value: `%${stats.onTime}`, color: stats.onTime > 90 ? 'text-green-600' : 'text-orange-500', icon: <HugeiconsIcon icon={Tick01Icon} size={24} className="text-green-600" /> },
            { label: 'Ort. Süre', value: `${stats.avgDays} gün`, color: 'text-[#007AFF]', icon: <HugeiconsIcon icon={Timer02Icon} size={24} className="text-[#007AFF]" /> },
            { label: 'Birim Maliyet', value: stats.cost, color: 'text-[#111827]', icon: <HugeiconsIcon icon={TruckIcon} size={24} className="text-gray-600" /> },
          ].map((k, i) => (
            <div key={i} className={`${cardClass} p-4 flex items-center gap-3`}>
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">{k.icon}</div>
              <div>
                <p className="text-[9px] font-bold text-gray-400 uppercase">{k.label}</p>
                <p className={`text-[18px] font-black ${k.color}`}>{k.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter & Search Bar */}
        <div className={`${cardClass} p-4 space-y-3`}>
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} placeholder="Alıcı adı, SHP kodu veya takip no ile ara..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-[13px] font-medium focus:ring-2 focus:ring-[#007AFF] outline-none" />
            </div>
            {selected.length > 0 && (
              <button onClick={() => { setComplaintOpen(true); }} className="text-[11px] font-black px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors whitespace-nowrap">
                Seçilenleri Şikayet Et ({selected.length})
              </button>
            )}
          </div>
          <div className="w-full overflow-x-auto no-scrollbar">
            <div className="flex items-center bg-[#F8F9FA] rounded-[16px] p-1.5 min-w-max border border-gray-100">
              {[{ id: 'Tümü', label: `Tümü (${shipments.length})` }, { id: 'teslim', label: `Teslim (${shipments.filter(s => s.status === 'teslim').length})` }, { id: 'yolda', label: `Yolda (${shipments.filter(s => s.status === 'yolda').length})` }, { id: 'gecikme', label: `Gecikme (${shipments.filter(s => s.status === 'gecikme').length})` }, { id: 'hasar', label: `Hasarlı (${shipments.filter(s => s.status === 'hasar').length})` }].map(f => (
                <button key={f.id} onClick={() => { setStatusFilter(f.id); setCurrentPage(1); setSelected([]); }} className={`px-4 py-2 text-[12px] font-bold rounded-[12px] transition-all whitespace-nowrap ${statusFilter === f.id ? 'bg-white text-[#111827] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className={`${cardClass} overflow-hidden`}>
          {/* Select All */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={selected.length === paged.length && paged.length > 0} onChange={e => { if (e.target.checked) setSelected(paged.map(s => s.id)); else setSelected([]); }} className="w-3.5 h-3.5 rounded border-gray-300 text-[#111827]" />
              <span className="text-[11px] font-bold text-gray-500">Tümünü Seç</span>
            </div>
            <span className="text-[11px] font-bold text-gray-400">{filtered.length} sonuç · Sayfa {currentPage}/{totalPages || 1}</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-gray-100">
            {paged.map((s, i) => (
              <div key={i} className={`flex items-center gap-3 px-5 py-3.5 transition-all ${selected.includes(s.id) ? 'bg-blue-50/40' : 'hover:bg-gray-50/50'}`}>
                <input type="checkbox" checked={selected.includes(s.id)} onChange={e => { if (e.target.checked) setSelected([...selected, s.id]); else setSelected(selected.filter(id => id !== s.id)); }} className="w-3.5 h-3.5 rounded border-gray-300 text-[#111827]" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[12px] font-bold text-[#111827]">{s.buyer}</span>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${statusBadge(s.status)}`}>{statusLabel(s.status)}</span>
                    {s.status === 'gecikme' && <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-red-100 text-red-600">{s.days} gün</span>}
                  </div>
                  <p className="text-[10px] text-gray-500 mt-0.5">{s.id} · {s.city} · {s.date} · <span className="text-gray-400">{s.trackingNo}</span></p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[13px] font-black text-[#111827]">{s.amount}</p>
                  <p className="text-[9px] text-gray-400">{s.days} gün</p>
                </div>
              </div>
            ))}
            {paged.length === 0 && <div className="text-center py-12 text-[13px] font-bold text-gray-400">Sonuç bulunamadı.</div>}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 p-4 border-t border-gray-100">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1.5 rounded-lg text-[12px] font-bold text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed">← Önceki</button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let page: number;
                if (totalPages <= 5) page = i + 1;
                else if (currentPage <= 3) page = i + 1;
                else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
                else page = currentPage - 2 + i;
                return (
                  <button key={page} onClick={() => setCurrentPage(page)} className={`w-8 h-8 rounded-lg text-[12px] font-bold transition-all ${currentPage === page ? 'bg-[#111827] text-white' : 'text-gray-500 hover:bg-gray-100'}`}>{page}</button>
                );
              })}
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1.5 rounded-lg text-[12px] font-bold text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed">Sonraki →</button>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-[200] bg-[#111827] text-white px-5 py-3 rounded-xl text-[13px] font-bold shadow-2xl">
          <div className="flex items-center gap-2"><HugeiconsIcon icon={Tick01Icon} size={18} className="text-green-400" />{toast}</div>
        </div>
      )}

      {/* Complaint Modal */}
      {complaintOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setComplaintOpen(false)}>
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-[18px] font-black text-[#111827]">Firma Şikayeti</h2>
                <button onClick={() => setComplaintOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <p className="text-[12px] text-gray-500 font-medium"><strong className="text-[#111827]">{providerName}</strong> için resmi uyarı / şikayet kaydı oluşturulacaktır.{selected.length > 0 && ` (${selected.length} kargo seçili)`}</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1.5">Şikayet Tipi</label>
                <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-medium focus:ring-2 focus:ring-red-500 outline-none">
                  <option>Gecikmeli Teslimat Raporu</option>
                  <option>Kayıp/Hasarlı Ürün</option>
                  <option>Müşteri Memnuniyetsizliği</option>
                  <option>SLA (Hizmet Seviyesi) İhlali</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1.5">Detaylı Açıklama</label>
                <textarea rows={4} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-medium focus:ring-2 focus:ring-red-500 outline-none resize-none" placeholder="Şikayet detaylarını buraya girin..." />
              </div>
            </div>
            <div className="p-4 bg-gray-50 flex gap-2">
              <button onClick={() => setComplaintOpen(false)} className="flex-1 py-3 rounded-xl bg-white border border-gray-200 text-[#111827] font-bold text-[13px]">İptal</button>
              <button onClick={() => { showToast(`${providerName} için şikayet kaydı başarıyla oluşturuldu.`); setComplaintOpen(false); setSelected([]); }} className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-[13px] transition-colors shadow-lg shadow-red-500/20">Şikayet Oluştur</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
