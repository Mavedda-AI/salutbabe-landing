'use client';
import React, {useState} from "react";

type QuickReply = { id: string; label: string; emoji: string };
type Product = { id: string; name: string; category: string; seller: string; price: string; image: string; date: string; desc: string; status: 'pending' | 'approved' | 'notified'; notifications?: string[] };

const quickReplies: QuickReply[] = [
  { id: 'photo', label: 'Fotoğrafı değiştir', emoji: '📷' },
  { id: 'desc', label: 'Açıklama ekle', emoji: '📝' },
  { id: 'price', label: 'Fiyatı güncelle', emoji: '💰' },
  { id: 'category', label: 'Kategoriyi düzelt', emoji: '🏷️' },
  { id: 'cert', label: 'Belge yükle', emoji: '📋' },
  { id: 'size', label: 'Beden bilgisi ekle', emoji: '📏' },
];

const initialProducts: Product[] = [
  { id: 'PRD-9921', name: 'Ev Yapımı Köy Salçası (1kg)', category: 'Organik', seller: 'Ayşe T.', price: '₺250', image: 'https://images.unsplash.com/photo-1608570515752-2457e514ca7b?w=300&h=300&fit=crop', date: '10dk', desc: 'Doğal, katkısız ev yapımı biber salçası.', status: 'pending' },
  { id: 'PRD-9922', name: 'Amigurumi Tavşan', category: 'El Yapımı', seller: 'Zeynep H.', price: '₺450', image: 'https://images.unsplash.com/photo-1535572290543-960a8046f5af?w=300&h=300&fit=crop', date: '25dk', desc: 'Anti-alerjik iplik ile örülmüş uyku arkadaşı.', status: 'pending' },
  { id: 'PRD-9923', name: 'Organik Çam Balı (500g)', category: 'Organik', seller: 'Fatma A.', price: '₺380', image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=300&h=300&fit=crop', date: '42dk', desc: 'Muğla yöresi saf çam balı.', status: 'pending' },
  { id: 'PRD-9924', name: 'Bebek Tulum Takımı 0-3 Ay', category: 'Giyim', seller: 'Elif K.', price: '₺180', image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=300&h=300&fit=crop', date: '1sa', desc: '%100 organik pamuk tulum seti.', status: 'pending' },
  { id: 'PRD-9925', name: 'Makrome Emzik Askısı', category: 'El Yapımı', seller: 'Merve T.', price: '₺120', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&h=300&fit=crop', date: '1.5sa', desc: 'Ahşap boncuklu özel üretim emzik askısı.', status: 'pending' },
  { id: 'PRD-9926', name: 'Keçi Sütü Sabunu 3lü', category: 'Bakım', seller: 'Hatice B.', price: '₺95', image: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=300&h=300&fit=crop', date: '2sa', desc: 'Bebek cildine uygun parfümsüz sabun.', status: 'pending' },
  { id: 'PRD-9927', name: 'Köy Yumurtası (30lu)', category: 'Organik', seller: 'Süheyla D.', price: '₺210', image: 'https://images.unsplash.com/photo-1498654077810-12c21d4d6dc3?w=300&h=300&fit=crop', date: '3sa', desc: 'Gezen tavuk, günlük toplanan yumurta.', status: 'pending' },
  { id: 'PRD-9928', name: 'Nakışlı Battaniye', category: 'El Yapımı', seller: 'Gülşah M.', price: '₺550', image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=300&h=300&fit=crop', date: '4sa', desc: 'İsme özel %100 pamuk el işi battaniye.', status: 'pending' },
  { id: 'PRD-9929', name: 'Bebek Şampuanı Doğal', category: 'Bakım', seller: 'Seda Y.', price: '₺85', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop', date: '4.5sa', desc: 'Göz yakmayan doğal bebek şampuanı.', status: 'pending' },
  { id: 'PRD-9930', name: 'Ahşap Diş Kaşıyıcı', category: 'El Yapımı', seller: 'Büşra K.', price: '₺75', image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=300&h=300&fit=crop', date: '5sa', desc: 'Doğal kayın ağacından güvenli diş kaşıyıcı.', status: 'pending' },
];

export function ModerationView() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [tab, setTab] = useState<'pending' | 'approved' | 'notified'>('pending');
  const [openReply, setOpenReply] = useState<string | null>(null);
  const [detail, setDetail] = useState<Product | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'green' | 'blue' | 'orange' } | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid2' | 'grid4'>('list');

  const show = (msg: string, type: 'green' | 'blue' | 'orange') => { setToast({ msg, type }); setTimeout(() => setToast(null), 2000); };

  const pending = products.filter(p => p.status === 'pending');
  const approved = products.filter(p => p.status === 'approved');
  const notified = products.filter(p => p.status === 'notified');

  const updateStatus = (id: string, status: Product['status'], notifs?: string[]) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status, notifications: notifs || p.notifications } : p));
  };

  const handleApprove = (p: Product) => { updateStatus(p.id, 'approved'); show(`✓ ${p.name} onaylandı`, 'green'); };
  const handleNotify = (p: Product, reply: QuickReply) => {
    const existing = p.notifications || [];
    updateStatus(p.id, 'notified', [...existing, reply.label]);
    show(`${reply.emoji} ${p.seller}'ye bildirim gönderildi`, 'blue');
  };
  const handleUndo = (p: Product) => { updateStatus(p.id, 'pending', []); show(`↩ ${p.name} tekrar beklemeye alındı`, 'orange'); };
  const handleApproveAll = () => { setProducts(prev => prev.map(p => p.status === 'pending' ? { ...p, status: 'approved' } : p)); show(`✓ ${pending.length} ilan toplu onaylandı`, 'green'); };

  const currentList = tab === 'pending' ? pending : tab === 'approved' ? approved : notified;

  return (
    <div className={`mx-auto pb-24 animate-fade-in ${viewMode === 'grid4' ? 'max-w-[900px]' : 'max-w-[600px]'}`}>
      {toast && <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[200] px-5 py-3 rounded-2xl text-[12px] font-bold shadow-2xl animate-fade-in ${toast.type === 'green' ? 'bg-green-600 text-white' : toast.type === 'blue' ? 'bg-blue-600 text-white' : 'bg-orange-500 text-white'}`}>{toast.msg}</div>}

      {/* Detail Modal */}
      {detail && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setDetail(null)}>
          <div onClick={e => e.stopPropagation()} className="w-full max-w-[480px] bg-white rounded-t-[28px] md:rounded-[28px] overflow-hidden shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <img src={detail.image} alt={detail.name} className="w-full aspect-square object-cover" />
            <div className="p-5">
              <h3 className="text-[18px] font-black text-[#111827] mb-1">{detail.name}</h3>
              <p className="text-[12px] font-bold text-gray-400 mb-2">Satıcı: <span className="text-gray-600">{detail.seller}</span> • {detail.price} • {detail.date}</p>
              <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-1 rounded-md">{detail.category}</span>
              <p className="text-[13px] text-gray-600 mt-3 leading-relaxed">{detail.desc}</p>
              {detail.notifications && detail.notifications.length > 0 && (
                <div className="mt-3 p-3 bg-blue-50 rounded-xl">
                  <p className="text-[10px] font-black text-blue-600 mb-1">Gönderilen Bildirimler:</p>
                  {detail.notifications.map((n, i) => <p key={i} className="text-[11px] text-blue-700 font-bold">• {n}</p>)}
                </div>
              )}
              <div className="flex gap-2 mt-4">
                {detail.status === 'pending' && <button onClick={() => { handleApprove(detail); setDetail(null); }} className="flex-1 py-3 rounded-2xl bg-green-500 text-white font-black text-[13px] active:scale-95 transition-all">✓ Onayla</button>}
                {detail.status !== 'pending' && <button onClick={() => { handleUndo(detail); setDetail(null); }} className="flex-1 py-3 rounded-2xl bg-orange-500 text-white font-black text-[13px] active:scale-95 transition-all">↩ Geri Al</button>}
                <button onClick={() => setDetail(null)} className="flex-1 py-3 rounded-2xl bg-gray-100 text-gray-600 font-black text-[13px]">Kapat</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-[#F8F9FA]/95 backdrop-blur-xl pb-3 pt-1">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[18px] font-black text-[#111827]">İlan Onay</h2>
          <div className="flex items-center gap-2">
            <div className="bg-green-50 text-green-600 px-2.5 py-1 rounded-full border border-green-100"><span className="text-[10px] font-black">✓{approved.length}</span></div>
            <div className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full border border-blue-100"><span className="text-[10px] font-black">💬{notified.length}</span></div>
            <div className="flex items-center bg-white rounded-xl border border-gray-200 p-0.5 ml-1">
              <button onClick={() => setViewMode('list')} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${viewMode === 'list' ? 'bg-[#111827] text-white' : 'text-gray-400 hover:text-gray-700'}`} title="Liste">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <button onClick={() => setViewMode('grid2')} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${viewMode === 'grid2' ? 'bg-[#111827] text-white' : 'text-gray-400 hover:text-gray-700'}`} title="2'li Grid">
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="6" height="6" rx="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5"/><rect x="1" y="9" width="6" height="6" rx="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5"/></svg>
              </button>
              <button onClick={() => setViewMode('grid4')} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${viewMode === 'grid4' ? 'bg-[#111827] text-white' : 'text-gray-400 hover:text-gray-700'}`} title="4'lü Grid">
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><rect x="0.5" y="0.5" width="3" height="3" rx="0.75"/><rect x="4.5" y="0.5" width="3" height="3" rx="0.75"/><rect x="8.5" y="0.5" width="3" height="3" rx="0.75"/><rect x="12.5" y="0.5" width="3" height="3" rx="0.75"/><rect x="0.5" y="4.5" width="3" height="3" rx="0.75"/><rect x="4.5" y="4.5" width="3" height="3" rx="0.75"/><rect x="8.5" y="4.5" width="3" height="3" rx="0.75"/><rect x="12.5" y="4.5" width="3" height="3" rx="0.75"/></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-2xl border border-gray-200 p-1 mb-3">
          <button onClick={() => setTab('pending')} className={`flex-1 py-2.5 rounded-xl text-[11px] font-black transition-all ${tab === 'pending' ? 'bg-[#111827] text-white' : 'text-gray-500'}`}>Bekleyenler ({pending.length})</button>
          <button onClick={() => setTab('approved')} className={`flex-1 py-2.5 rounded-xl text-[11px] font-black transition-all ${tab === 'approved' ? 'bg-green-500 text-white' : 'text-gray-500'}`}>Onaylananlar ({approved.length})</button>
          <button onClick={() => setTab('notified')} className={`flex-1 py-2.5 rounded-xl text-[11px] font-black transition-all ${tab === 'notified' ? 'bg-blue-500 text-white' : 'text-gray-500'}`}>Bildirim ({notified.length})</button>
        </div>

        {tab === 'pending' && pending.length > 1 && (
          <button onClick={handleApproveAll} className="w-full py-3 rounded-2xl bg-green-500 text-white text-[12px] font-black shadow-lg shadow-green-500/20 hover:bg-green-600 active:scale-[0.98] transition-all">✓ Tümünü Onayla ({pending.length})</button>
        )}
      </div>

      {/* List */}
      {currentList.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[30vh] text-center">
          <div className="text-[40px] mb-2">{tab === 'pending' ? '🎉' : tab === 'approved' ? '📦' : '💬'}</div>
          <p className="text-[13px] font-bold text-gray-400">{tab === 'pending' ? 'Bekleyen ilan yok!' : tab === 'approved' ? 'Henüz onaylanan ilan yok.' : 'Bildirim gönderilen ilan yok.'}</p>
        </div>
      ) : (
        <div className={`mt-3 ${viewMode === 'list' ? 'space-y-3' : viewMode === 'grid2' ? 'grid grid-cols-2 gap-3' : 'grid grid-cols-4 gap-3'}`}>
          {currentList.map(product => {
            const isOpen = openReply === product.id;

            {/* GRID VIEW (grid2 / grid4) */}
            if (viewMode !== 'list') return (
              <div key={product.id} className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
                <div onClick={() => setDetail(product)} className="relative cursor-pointer active:scale-[0.98] transition-transform">
                  <img src={product.image} alt={product.name} className={`w-full object-cover ${viewMode === 'grid4' ? 'aspect-square' : 'aspect-[4/3]'}`} />
                  <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full"><span className="text-[10px] font-black text-white">{product.price}</span></div>
                </div>
                <div className="p-3">
                  <h4 className={`font-black text-[#111827] leading-tight truncate ${viewMode === 'grid4' ? 'text-[11px]' : 'text-[12px]'}`}>{product.name}</h4>
                  <p className="text-[9px] font-bold text-gray-400 mt-0.5 truncate">{product.seller} • {product.category}</p>
                  <div className={`flex gap-1.5 mt-2 ${viewMode === 'grid4' ? 'flex-col' : ''}`}>
                    {tab === 'pending' ? (<>
                      <button onClick={() => handleApprove(product)} className={`flex-1 flex items-center justify-center gap-1 rounded-xl bg-green-500 text-white font-black active:scale-90 transition-all ${viewMode === 'grid4' ? 'py-2 text-[9px]' : 'py-2.5 text-[10px]'}`}>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Onayla
                      </button>
                      <button onClick={() => { setOpenReply(isOpen ? null : product.id); setDetail(product); }} className={`flex-1 flex items-center justify-center gap-1 rounded-xl border-2 border-gray-200 text-gray-500 font-black active:scale-90 transition-all ${viewMode === 'grid4' ? 'py-2 text-[9px]' : 'py-2.5 text-[10px]'}`}>
                        💬 Bildirim
                      </button>
                    </>) : (
                      <button onClick={() => handleUndo(product)} className={`flex-1 flex items-center justify-center gap-1 rounded-xl bg-orange-500 text-white font-black active:scale-90 transition-all ${viewMode === 'grid4' ? 'py-2 text-[9px]' : 'py-2.5 text-[10px]'}`}>
                        ↩ Geri Al
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );

            {/* LIST VIEW */}
            return (
              <div key={product.id} className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex gap-3 p-3">
                  <div onClick={() => setDetail(product)} className="w-[80px] h-[80px] rounded-2xl overflow-hidden shrink-0 bg-gray-100 cursor-pointer active:scale-95 transition-transform">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5" onClick={() => setDetail(product)}>
                    <div>
                      <h4 className="text-[13px] font-black text-[#111827] leading-tight truncate cursor-pointer">{product.name}</h4>
                      <p className="text-[10px] font-bold text-gray-400 mt-0.5">{product.seller} • {product.date}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">{product.category}</span>
                      <span className="text-[12px] font-black text-[#111827]">{product.price}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0 justify-center">
                    {tab === 'pending' ? (<>
                      <button onClick={() => handleApprove(product)} className="w-[42px] h-[42px] flex items-center justify-center rounded-xl bg-green-500 text-white shadow-md shadow-green-500/30 active:scale-90 transition-all">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </button>
                      <button onClick={() => setOpenReply(isOpen ? null : product.id)} className={`w-[42px] h-[42px] flex items-center justify-center rounded-xl border-2 active:scale-90 transition-all ${isOpen ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-400 border-gray-200'}`}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                      </button>
                    </>) : (
                      <button onClick={() => handleUndo(product)} className="w-[42px] h-[42px] flex items-center justify-center rounded-xl bg-orange-500 text-white shadow-md shadow-orange-500/30 active:scale-90 transition-all" title="Geri Al">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a5 5 0 015 5v2M3 10l4-4M3 10l4 4" /></svg>
                      </button>
                    )}
                  </div>
                </div>
                {product.notifications && product.notifications.length > 0 && tab !== 'pending' && (
                  <div className="px-3 pb-2"><div className="flex flex-wrap gap-1">{product.notifications.map((n, i) => <span key={i} className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">💬 {n}</span>)}</div></div>
                )}
                {isOpen && tab === 'pending' && (
                  <div className="px-3 pb-3 animate-fade-in">
                    <div className="h-px bg-gray-100 mb-2"></div>
                    <div className="flex flex-wrap gap-1.5">
                      {quickReplies.map(r => (
                        <button key={r.id} onClick={() => handleNotify(product, r)} className="flex items-center gap-1 px-2.5 py-2 rounded-xl text-[10px] font-bold bg-gray-50 text-gray-700 border border-gray-200 hover:bg-blue-50 hover:text-blue-600 active:scale-95 transition-all">
                          <span className="text-[12px]">{r.emoji}</span>{r.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Page() { return <ModerationView />; }
