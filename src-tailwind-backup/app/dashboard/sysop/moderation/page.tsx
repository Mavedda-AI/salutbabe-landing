'use client';
import React, {useState} from "react";

import {HugeiconsIcon} from '@hugeicons/react';
import {
    ArrowLeft01Icon,
    ArrowRight01Icon,
    ArrowTurnBackwardIcon,
    Camera01Icon,
    Cancel01Icon,
    Cards01Icon,
    CheckmarkCircle01Icon,
    DashboardSquare01Icon,
    DocumentAttachmentIcon,
    Grid02Icon,
    ListViewIcon,
    Message01Icon,
    Money01Icon,
    PencilEdit01Icon,
    RulerIcon,
    Tag01Icon,
    Tick01Icon
} from '@hugeicons/core-free-icons';

type QuickReply = { id: string; label: string; icon: any };
type Product = { id: string; name: string; category: string; seller: string; price: string; image: string; date: string; desc: string; status: 'pending' | 'approved' | 'notified' | 'rejected'; notifications?: string[] };

const quickReplies: QuickReply[] = [
  { id: 'photo', label: 'Fotoğrafını iyileştirebilirsin', icon: Camera01Icon },
  { id: 'desc', label: 'Açıklamanı zenginleştirebilirsin', icon: PencilEdit01Icon },
  { id: 'price', label: 'Fiyatını gözden geçirebilirsin', icon: Money01Icon },
  { id: 'category', label: 'Kategorini güncelleyebilirsin', icon: Tag01Icon },
  { id: 'cert', label: 'Orijinallik belgesi yükleyebilirsin', icon: DocumentAttachmentIcon },
  { id: 'size', label: 'Beden bilgisini netleştirebilirsin', icon: RulerIcon },
];

const initialProducts: Product[] = [
  { id: 'PRD-9921', name: 'Ev Yapımı Köy Salçası (1kg)', category: 'Organik', seller: 'Ayşe T.', price: '₺250', image: 'https://picsum.photos/seed/salca/400/500', date: '10dk', desc: 'Doğal, katkısız ev yapımı biber salçası.', status: 'pending' },
  { id: 'PRD-9922', name: 'Amigurumi Tavşan', category: 'El Yapımı', seller: 'Zeynep H.', price: '₺450', image: 'https://picsum.photos/seed/tavsan/400/500', date: '25dk', desc: 'Anti-alerjik iplik ile örülmüş uyku arkadaşı.', status: 'pending' },
  { id: 'PRD-9923', name: 'Organik Çam Balı (500g)', category: 'Organik', seller: 'Fatma A.', price: '₺380', image: 'https://picsum.photos/seed/bal/400/500', date: '42dk', desc: 'Muğla yöresi saf çam balı.', status: 'pending' },
  { id: 'PRD-9924', name: 'Bebek Tulum Takımı 0-3 Ay', category: 'Giyim', seller: 'Elif K.', price: '₺180', image: 'https://picsum.photos/seed/tulum/400/500', date: '1sa', desc: '%100 organik pamuk tulum seti.', status: 'pending' },
  { id: 'PRD-9925', name: 'Makrome Emzik Askısı', category: 'El Yapımı', seller: 'Merve T.', price: '₺120', image: 'https://picsum.photos/seed/makrome/400/500', date: '1.5sa', desc: 'Ahşap boncuklu özel üretim emzik askısı.', status: 'pending' },
  { id: 'PRD-9926', name: 'Keçi Sütü Sabunu 3lü', category: 'Bakım', seller: 'Hatice B.', price: '₺95', image: 'https://picsum.photos/seed/sabun/400/500', date: '2sa', desc: 'Bebek cildine uygun parfümsüz sabun.', status: 'pending' },
  { id: 'PRD-9927', name: 'Köy Yumurtası (30lu)', category: 'Organik', seller: 'Süheyla D.', price: '₺210', image: 'https://picsum.photos/seed/yumurta/400/500', date: '3sa', desc: 'Gezen tavuk, günlük toplanan yumurta.', status: 'pending' },
  { id: 'PRD-9928', name: 'Nakışlı Battaniye', category: 'El Yapımı', seller: 'Gülşah M.', price: '₺550', image: 'https://picsum.photos/seed/battaniye/400/500', date: '4sa', desc: 'İsme özel %100 pamuk el işi battaniye.', status: 'pending' },
  { id: 'PRD-9929', name: 'Bebek Şampuanı Doğal', category: 'Bakım', seller: 'Seda Y.', price: '₺85', image: 'https://picsum.photos/seed/sampuan/400/500', date: '4.5sa', desc: 'Göz yakmayan doğal bebek şampuanı.', status: 'pending' },
  { id: 'PRD-9930', name: 'Ahşap Diş Kaşıyıcı', category: 'El Yapımı', seller: 'Büşra K.', price: '₺75', image: 'https://picsum.photos/seed/dis/400/500', date: '5sa', desc: 'Doğal kayın ağacından güvenli diş kaşıyıcı.', status: 'pending' },
];

export function ModerationView() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [tab, setTab] = useState<'pending' | 'approved' | 'notified' | 'rejected'>('pending');
  const [openReply, setOpenReply] = useState<string | null>(null);
  const [detail, setDetail] = useState<Product | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'green' | 'blue' | 'orange' | 'red' } | null>(null);
  const [viewMode, setViewMode] = useState<'swipe' | 'list' | 'grid2' | 'grid4'>('list');
  const [selectedNotifs, setSelectedNotifs] = useState<{ [productId: string]: string[] }>({});
  const [swipeIndex, setSwipeIndex] = useState(0);

  React.useEffect(() => { setSwipeIndex(0); }, [tab, viewMode]);

  const show = (msg: string, type: 'green' | 'blue' | 'orange' | 'red') => { setToast({ msg, type }); setTimeout(() => setToast(null), 2000); };

  const pending = products.filter(p => p.status === 'pending');
  const approved = products.filter(p => p.status === 'approved');
  const notified = products.filter(p => p.status === 'notified');
  const rejected = products.filter(p => p.status === 'rejected');

  const toggleNotif = (productId: string, label: string) => {
    setSelectedNotifs(prev => {
      const current = prev[productId] || [];
      if (current.includes(label)) return { ...prev, [productId]: current.filter(l => l !== label) };
      return { ...prev, [productId]: [...current, label] };
    });
  };

  const updateStatus = (id: string, status: Product['status'], notifs?: string[]) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status, notifications: notifs || p.notifications } : p));
  };

  const handleApprove = (p: Product) => { 
    const notifs = selectedNotifs[p.id] || [];
    updateStatus(p.id, 'approved', [...(p.notifications || []), ...notifs]); 
    show(notifs.length > 0 ? `✓ ${p.name} onaylandı ve bildirimler iletildi` : `✓ ${p.name} onaylandı`, 'green'); 
    setSelectedNotifs(prev => { const next = {...prev}; delete next[p.id]; return next; });
  };
  
  const handleReject = (p: Product) => { 
    const notifs = selectedNotifs[p.id] || [];
    updateStatus(p.id, 'rejected', [...(p.notifications || []), ...notifs]); 
    show(notifs.length > 0 ? `✕ ${p.name} reddedildi ve bildirimler iletildi` : `✕ ${p.name} reddedildi`, 'red'); 
    setSelectedNotifs(prev => { const next = {...prev}; delete next[p.id]; return next; });
  };
  
  const handleUndo = (p: Product) => { updateStatus(p.id, 'pending', []); show(`↩ ${p.name} tekrar beklemeye alındı`, 'orange'); };
  const handleApproveAll = () => { setProducts(prev => prev.map(p => p.status === 'pending' ? { ...p, status: 'approved' } : p)); show(`✓ ${pending.length} ilan toplu onaylandı`, 'green'); };

  const currentList = tab === 'pending' ? pending : tab === 'approved' ? approved : tab === 'notified' ? notified : rejected;

  return (
    <div className={`mx-auto pb-24 animate-fade-in ${viewMode === 'grid4' ? 'max-w-[900px]' : 'max-w-[600px]'}`}>
      {toast && <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[200] px-5 py-3 rounded-2xl text-[12px] font-bold shadow-2xl animate-fade-in ${toast.type === 'green' ? 'bg-green-600 text-white' : toast.type === 'blue' ? 'bg-blue-600 text-white' : toast.type === 'red' ? 'bg-red-600 text-white' : 'bg-orange-500 text-white'}`}>{toast.msg}</div>}

      {/* Detail Modal */}
      {detail && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setDetail(null)}>
          <div onClick={e => e.stopPropagation()} className="w-full max-w-[480px] bg-white rounded-t-[28px] md:rounded-[28px] overflow-hidden shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="relative w-full h-[240px] shrink-0">
              <img src={detail.image} alt={detail.name} className="w-full h-full object-cover" />
            </div>
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
              
              {detail.status === 'pending' && (
                <div className="grid grid-cols-3 gap-1.5 mt-3">
                  {quickReplies.map(r => {
                    const isSelected = (selectedNotifs[detail.id] || []).includes(r.label);
                    return (
                      <button key={r.id} onClick={() => toggleNotif(detail.id, r.label)} className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-lg text-[9px] font-bold border active:scale-95 transition-all text-center leading-tight ${isSelected ? 'bg-blue-100 text-blue-700 border-blue-300 shadow-inner' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'}`}>
                        <HugeiconsIcon icon={r.icon} size={14} className="text-current shrink-0" />
                        <span className="w-full truncate sm:whitespace-normal">{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="flex gap-2 mt-4">
                {detail.status === 'pending' && (
                  <>
                    <button onClick={() => { handleReject(detail); setDetail(null); }} className="flex-1 py-3 flex items-center justify-center gap-2 rounded-2xl bg-[#FF3B30] text-white font-black text-[13px] active:scale-95 transition-all"><HugeiconsIcon icon={Cancel01Icon} size={16} /> Reddet</button>
                    <button onClick={() => { handleApprove(detail); setDetail(null); }} className="flex-1 py-3 flex items-center justify-center gap-2 rounded-2xl bg-[#00D65B] text-white font-black text-[13px] active:scale-95 transition-all"><HugeiconsIcon icon={Tick01Icon} size={16} /> Onayla</button>
                  </>
                )}
                {detail.status !== 'pending' && <button onClick={() => { handleUndo(detail); setDetail(null); }} className="flex-1 py-3 flex items-center justify-center gap-2 rounded-2xl bg-orange-500 text-white font-black text-[13px] active:scale-95 transition-all"><HugeiconsIcon icon={ArrowTurnBackwardIcon} size={16} /> Geri Al</button>}
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
            <div className="bg-green-50 text-green-600 px-2.5 py-1 rounded-full border border-green-100 hidden sm:flex items-center gap-1"><HugeiconsIcon icon={Tick01Icon} size={12} /><span className="text-[10px] font-black">{approved.length}</span></div>
            <div className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full border border-blue-100 hidden sm:flex items-center gap-1"><HugeiconsIcon icon={Message01Icon} size={12} /><span className="text-[10px] font-black">{notified.length}</span></div>
            <div className="bg-red-50 text-red-600 px-2.5 py-1 rounded-full border border-red-100 hidden sm:flex items-center gap-1"><HugeiconsIcon icon={Cancel01Icon} size={12} /><span className="text-[10px] font-black">{rejected.length}</span></div>
            <div className="flex items-center bg-white rounded-xl border border-gray-200 p-0.5 ml-1">
              <button onClick={() => setViewMode('swipe')} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${viewMode === 'swipe' ? 'bg-[#111827] text-white' : 'text-gray-400 hover:text-gray-700'}`} title="Kaydırmalı (Tinder)">
                <HugeiconsIcon icon={Cards01Icon} size={16} />
              </button>
              <button onClick={() => setViewMode('list')} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${viewMode === 'list' ? 'bg-[#111827] text-white' : 'text-gray-400 hover:text-gray-700'}`} title="Liste">
                <HugeiconsIcon icon={ListViewIcon} size={16} />
              </button>
              <button onClick={() => setViewMode('grid2')} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${viewMode === 'grid2' ? 'bg-[#111827] text-white' : 'text-gray-400 hover:text-gray-700'}`} title="2'li Grid">
                <HugeiconsIcon icon={Grid02Icon} size={16} />
              </button>
              <button onClick={() => setViewMode('grid4')} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${viewMode === 'grid4' ? 'bg-[#111827] text-white' : 'text-gray-400 hover:text-gray-700'}`} title="4'lü Grid">
                <HugeiconsIcon icon={DashboardSquare01Icon} size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex bg-white rounded-2xl border border-gray-200 p-1 mb-3 overflow-x-auto hide-scrollbar">
          <button onClick={() => setTab('pending')} className={`px-3 py-2.5 whitespace-nowrap rounded-xl text-[11px] font-black transition-all flex-1 ${tab === 'pending' ? 'bg-[#111827] text-white' : 'text-gray-500'}`}>Bekleyen ({pending.length})</button>
          <button onClick={() => setTab('approved')} className={`px-3 py-2.5 whitespace-nowrap rounded-xl text-[11px] font-black transition-all flex-1 ${tab === 'approved' ? 'bg-green-500 text-white' : 'text-gray-500'}`}>Onaylanan ({approved.length})</button>
          <button onClick={() => setTab('notified')} className={`px-3 py-2.5 whitespace-nowrap rounded-xl text-[11px] font-black transition-all flex-1 ${tab === 'notified' ? 'bg-blue-500 text-white' : 'text-gray-500'}`}>Bildirim ({notified.length})</button>
          <button onClick={() => setTab('rejected')} className={`px-3 py-2.5 whitespace-nowrap rounded-xl text-[11px] font-black transition-all flex-1 ${tab === 'rejected' ? 'bg-red-500 text-white' : 'text-gray-500'}`}>Reddedilen ({rejected.length})</button>
        </div>

        {tab === 'pending' && pending.length > 1 && (
          <button onClick={handleApproveAll} className="w-full py-3 rounded-[20px] bg-[#00D65B] text-white text-[12px] flex items-center justify-center gap-2 font-black shadow-lg shadow-[#00D65B]/20 hover:bg-[#00B54C] active:scale-[0.98] transition-all">
            <HugeiconsIcon icon={Tick01Icon} size={16} /> Tümünü Onayla ({pending.length})
          </button>
        )}
      </div>

      {/* List */}
      {currentList.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[30vh] text-center">
          <div className="flex justify-center mb-2 text-gray-300">
            {tab === 'pending' ? <HugeiconsIcon icon={CheckmarkCircle01Icon} size={48} /> : 
             tab === 'approved' ? <HugeiconsIcon icon={Tick01Icon} size={48} /> : 
             tab === 'notified' ? <HugeiconsIcon icon={Message01Icon} size={48} /> : 
             <HugeiconsIcon icon={Cancel01Icon} size={48} />}
          </div>
          <p className="text-[13px] font-bold text-gray-400">{tab === 'pending' ? 'Bekleyen ilan yok!' : tab === 'approved' ? 'Henüz onaylanan ilan yok.' : tab === 'notified' ? 'Bildirim gönderilen ilan yok.' : 'Reddedilen ilan yok.'}</p>
        </div>
      ) : viewMode === 'swipe' ? (() => {
        const activeIndex = Math.min(swipeIndex, Math.max(0, currentList.length - 1));
        const currentItem = currentList[activeIndex];
        if (!currentItem) return null;

        return (
        <div className="flex flex-col items-center mt-2">
          <div className="w-full max-w-[400px] bg-white rounded-[32px] border border-gray-100 shadow-2xl overflow-hidden relative animate-fade-in" key={currentItem.id}>
            <div onClick={() => setDetail(currentItem)} className="relative cursor-pointer active:scale-[0.98] transition-transform">
              <img src={currentItem.image} alt={currentItem.name} className="w-full aspect-[4/3] object-cover" />
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full"><span className="text-[14px] font-black text-white">{currentItem.price}</span></div>
            </div>
            
            <div className="p-4">
              <h3 className="text-[20px] font-black text-[#111827] mb-1 leading-tight">{currentItem.name}</h3>
              <p className="text-[13px] font-bold text-gray-400 mb-2">{currentItem.seller} • <span className="text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">{currentItem.category}</span></p>
              <p className="text-[13px] text-gray-600 line-clamp-2 leading-relaxed mb-3">{currentItem.desc}</p>
              
              {tab === 'pending' && (
                <div className="grid grid-cols-3 gap-1.5 mb-4">
                  {quickReplies.map(r => {
                    const isSelected = (selectedNotifs[currentItem.id] || []).includes(r.label);
                    return (
                      <button key={r.id} onClick={() => toggleNotif(currentItem.id, r.label)} className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-lg text-[9px] font-bold border active:scale-95 transition-all text-center leading-tight ${isSelected ? 'bg-blue-100 text-blue-700 border-blue-300 shadow-inner' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'}`}>
                        <HugeiconsIcon icon={r.icon} size={14} className="text-current shrink-0" />
                        <span className="w-full truncate sm:whitespace-normal">{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="flex justify-center gap-16 items-center mt-2">
                {tab === 'pending' ? (
                  <>
                    <button onClick={() => handleReject(currentItem)} className="w-[72px] h-[72px] flex items-center justify-center rounded-full bg-red-50 text-red-500 shadow-sm border border-red-100 active:scale-90 transition-all hover:bg-red-500 hover:text-white" title="Reddet">
                      <HugeiconsIcon icon={Cancel01Icon} size={36} />
                    </button>
                    <button onClick={() => handleApprove(currentItem)} className="w-[72px] h-[72px] flex items-center justify-center rounded-full bg-[#00D65B] text-white shadow-sm border border-[#00D65B]/20 active:scale-90 transition-all hover:bg-[#00C853]" title="Onayla">
                      <HugeiconsIcon icon={Tick01Icon} size={36} />
                    </button>
                  </>
                ) : (
                  <button onClick={() => handleUndo(currentItem)} className="w-[240px] h-[64px] flex items-center justify-center gap-2 rounded-full bg-orange-50 text-orange-600 font-black shadow-sm border border-orange-100 active:scale-90 transition-all hover:bg-orange-500 hover:text-white" title="Geri Al">
                    <HugeiconsIcon icon={ArrowTurnBackwardIcon} size={28} /> Geri Al
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6 mt-6">
            <button 
              disabled={activeIndex === 0} 
              onClick={() => setSwipeIndex(s => Math.max(0, s - 1))}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all text-[#111827]"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
            </button>
            <p className="text-[13px] font-black text-gray-400 w-24 text-center">İlan: <span className="text-[#111827]">{activeIndex + 1}</span> / {currentList.length}</p>
            <button 
              disabled={activeIndex >= currentList.length - 1} 
              onClick={() => setSwipeIndex(s => Math.min(currentList.length - 1, s + 1))}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all text-[#111827]"
            >
              <HugeiconsIcon icon={ArrowRight01Icon} size={20} />
            </button>
          </div>
        </div>
        );
      })() : (
        <div className={`mt-3 ${viewMode === 'list' ? 'space-y-3' : viewMode === 'grid2' ? 'grid grid-cols-2 gap-3' : 'grid grid-cols-4 gap-3'}`}>
          {currentList.map(product => {
            const isOpen = openReply === product.id;

            {/* GRID VIEW (grid2 / grid4) */}
            if (viewMode !== 'list') return (
              <div key={product.id} className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                <div onClick={() => setDetail(product)} className="relative cursor-pointer active:scale-[0.98] transition-transform">
                  <img src={product.image} alt={product.name} className={`w-full object-cover ${viewMode === 'grid4' ? 'aspect-square' : 'aspect-[4/3]'}`} />
                  <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full"><span className="text-[10px] font-black text-white">{product.price}</span></div>
                </div>
                <div className="p-3 flex-1 flex flex-col">
                  <h4 className={`font-black text-[#111827] leading-tight truncate ${viewMode === 'grid4' ? 'text-[11px]' : 'text-[12px]'}`}>{product.name}</h4>
                  <p className="text-[9px] font-bold text-gray-400 mt-0.5 truncate">{product.seller} • {product.category}</p>
                  
                  {product.notifications && product.notifications.length > 0 && tab !== 'pending' && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {product.notifications.map((n, i) => <span key={i} className="text-[8px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded flex items-center gap-0.5"><HugeiconsIcon icon={Message01Icon} size={8} /> {n}</span>)}
                    </div>
                  )}

                  <div className={`flex gap-1.5 mt-auto pt-2 ${viewMode === 'grid4' ? 'flex-col' : ''}`}>
                    {tab === 'pending' ? (<>
                      <button onClick={() => handleReject(product)} className={`flex-1 flex items-center justify-center gap-1 rounded-full bg-[#FF3B30] text-white font-black active:scale-90 transition-all ${viewMode === 'grid4' ? 'py-1.5 text-[10px]' : 'py-1.5 text-[11px]'}`}>
                        <HugeiconsIcon icon={Cancel01Icon} size={14} />{viewMode !== 'grid4' && "Reddet"}
                      </button>
                      <button onClick={() => setOpenReply(isOpen ? null : product.id)} className={`flex-1 flex items-center justify-center gap-1 rounded-full border active:scale-90 transition-all ${isOpen ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-200 text-gray-500 bg-white hover:bg-gray-50'} ${viewMode === 'grid4' ? 'py-1.5 text-[10px]' : 'py-1.5 text-[11px]'}`}>
                        <HugeiconsIcon icon={Message01Icon} size={14} />{viewMode !== 'grid4' && "Bildirim"}
                      </button>
                      <button onClick={() => handleApprove(product)} className={`flex-1 flex items-center justify-center gap-1 rounded-full bg-[#00D65B] text-white font-black active:scale-90 transition-all ${viewMode === 'grid4' ? 'py-1.5 text-[10px]' : 'py-1.5 text-[11px]'}`}>
                        <HugeiconsIcon icon={Tick01Icon} size={14} />{viewMode !== 'grid4' && "Onayla"}
                      </button>
                    </>) : (
                      <button onClick={() => handleUndo(product)} className={`flex-1 flex items-center justify-center gap-1 rounded-full bg-orange-500 text-white font-black active:scale-90 transition-all ${viewMode === 'grid4' ? 'py-1.5 text-[10px]' : 'py-1.5 text-[11px]'}`}>
                        <HugeiconsIcon icon={ArrowTurnBackwardIcon} size={14} />Geri Al
                      </button>
                    )}
                  </div>
                </div>
                
                {isOpen && tab === 'pending' && (
                  <div className="px-3 pb-3 animate-fade-in border-t border-gray-100 pt-2 bg-gray-50">
                    <div className={`grid gap-1.5 ${viewMode === 'grid4' ? 'grid-cols-1' : 'grid-cols-2'}`}>
                      {quickReplies.map(r => {
                        const isSelected = (selectedNotifs[product.id] || []).includes(r.label);
                        return (
                          <button key={r.id} onClick={() => toggleNotif(product.id, r.label)} className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-lg text-[9px] font-bold border active:scale-95 transition-all text-center leading-tight ${isSelected ? 'bg-blue-100 text-blue-700 border-blue-300 shadow-inner' : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:text-blue-600'}`}>
                            <HugeiconsIcon icon={r.icon} size={12} className="text-current shrink-0" />
                            <span className="w-full truncate sm:whitespace-normal text-left">{r.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
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
                      <button onClick={() => handleReject(product)} className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-[#FF3B30] text-white shadow-sm shadow-[#FF3B30]/20 active:scale-90 transition-all">
                        <HugeiconsIcon icon={Cancel01Icon} size={18} />
                      </button>
                      <button onClick={() => setOpenReply(isOpen ? null : product.id)} className={`w-[40px] h-[40px] flex items-center justify-center rounded-full border active:scale-90 transition-all ${isOpen ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-400 border-gray-200'}`}>
                        <HugeiconsIcon icon={Message01Icon} size={18} />
                      </button>
                      <button onClick={() => handleApprove(product)} className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-[#00D65B] text-white shadow-sm shadow-[#00D65B]/20 active:scale-90 transition-all">
                        <HugeiconsIcon icon={Tick01Icon} size={18} />
                      </button>
                    </>) : (
                      <button onClick={() => handleUndo(product)} className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-orange-500 text-white shadow-md shadow-orange-500/20 active:scale-90 transition-all" title="Geri Al">
                        <HugeiconsIcon icon={ArrowTurnBackwardIcon} size={20} />
                      </button>
                    )}
                  </div>
                </div>
                {product.notifications && product.notifications.length > 0 && tab !== 'pending' && (
                  <div className="px-3 pb-2"><div className="flex flex-wrap gap-1">{product.notifications.map((n, i) => <span key={i} className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md flex items-center gap-1"><HugeiconsIcon icon={Message01Icon} size={10} /> {n}</span>)}</div></div>
                )}
                {isOpen && tab === 'pending' && (
                  <div className="px-3 pb-3 animate-fade-in">
                    <div className="h-px bg-gray-100 mb-2"></div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {quickReplies.map(r => {
                        const isSelected = (selectedNotifs[product.id] || []).includes(r.label);
                        return (
                          <button key={r.id} onClick={() => toggleNotif(product.id, r.label)} className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-lg text-[9px] font-bold border active:scale-95 transition-all text-center leading-tight ${isSelected ? 'bg-blue-100 text-blue-700 border-blue-300 shadow-inner' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-blue-50 hover:text-blue-600'}`}>
                            <HugeiconsIcon icon={r.icon} size={14} className="text-current shrink-0" />
                            <span className="w-full truncate sm:whitespace-normal">{r.label}</span>
                          </button>
                        );
                      })}
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
