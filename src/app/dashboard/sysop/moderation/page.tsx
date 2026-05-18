'use client';
import React, {useCallback, useState} from "react";

type FeedbackOption = { id: string; label: string; emoji: string };
type Product = {
  id: string;
  name: string;
  category: string;
  seller: string;
  price: string;
  image: string;
  date: string;
  description: string;
};

const feedbackOptions: FeedbackOption[] = [
  { id: 'photo', label: 'Fotoğraf eksik/bulanık', emoji: '📷' },
  { id: 'desc', label: 'Açıklama yetersiz', emoji: '📝' },
  { id: 'price', label: 'Fiyat uygunsuz', emoji: '💰' },
  { id: 'category', label: 'Yanlış kategori', emoji: '🏷️' },
  { id: 'cert', label: 'Sertifika/belge gerekli', emoji: '📋' },
  { id: 'safety', label: 'Güvenlik riski', emoji: '⚠️' },
  { id: 'duplicate', label: 'Mükerrer ilan', emoji: '♻️' },
  { id: 'prohibited', label: 'Yasaklı ürün', emoji: '🚫' },
];

const mockProducts: Product[] = [
  { id: 'PRD-9921', name: 'Ev Yapımı Köy Salçası (1kg)', category: 'Organik & Doğal Gıda', seller: 'Ayşe Teyze', price: '₺250', image: 'https://images.unsplash.com/photo-1608570515752-2457e514ca7b?w=400&h=400&fit=crop', date: '10 dk önce', description: 'Tamamıyla doğal, katkısız, ev yapımı biber salçası. Antep biberi kullanılmıştır.' },
  { id: 'PRD-9922', name: 'Amigurumi Uyku Arkadaşı Tavşan', category: 'El Emeği & Kişiye Özel', seller: 'Zeynep H.', price: '₺450', image: 'https://images.unsplash.com/photo-1535572290543-960a8046f5af?w=400&h=400&fit=crop', date: '25 dk önce', description: 'El örgüsü, anti-alerjik iplik ile örülmüş bebek uyku arkadaşı.' },
  { id: 'PRD-9923', name: 'Organik Çam Balı (500g)', category: 'Organik & Doğal Gıda', seller: 'Fatma A.', price: '₺380', image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=400&fit=crop', date: '42 dk önce', description: 'Muğla yöresi, saf çam balı. Hiçbir katkı maddesi içermez.' },
  { id: 'PRD-9924', name: 'Bebek Tulum Takımı (0-3 Ay)', category: 'Bebek & Çocuk Giyim', seller: 'Elif K.', price: '₺180', image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400&h=400&fit=crop', date: '1 saat önce', description: '%100 organik pamuk, yenidoğan için özel dikilmiş tulum seti.' },
  { id: 'PRD-9925', name: 'El Yapımı Makrome Emzik Askısı', category: 'El Emeği & Kişiye Özel', seller: 'Merve T.', price: '₺120', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop', date: '1.5 saat önce', description: 'Doğal ahşap boncuklu, istenilen renkte özel üretim emzik askısı.' },
  { id: 'PRD-9926', name: 'Doğal Keçi Sütü Sabunu (3lü Set)', category: 'Banyo & Bebek Bakım', seller: 'Hatice B.', price: '₺95', image: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=400&h=400&fit=crop', date: '2 saat önce', description: 'Bebek cildine uygun, parfümsüz, el yapımı keçi sütü sabunu.' },
  { id: 'PRD-9927', name: 'Köy Yumurtası (30lu)', category: 'Organik & Doğal Gıda', seller: 'Süheyla D.', price: '₺210', image: 'https://images.unsplash.com/photo-1498654077810-12c21d4d6dc3?w=400&h=400&fit=crop', date: '3 saat önce', description: 'Gezen tavuk yumurtası, günlük toplanan, doğal beslenen tavuklardan.' },
  { id: 'PRD-9928', name: 'İsme Özel Nakışlı Battaniye', category: 'El Emeği & Kişiye Özel', seller: 'Gülşah M.', price: '₺550', image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop', date: '4 saat önce', description: 'Bebek ismi nakışlı, %100 pamuk, el işi battaniye. Renk seçeneği mevcuttur.' },
];

export function ModerationView() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedFeedbacks, setSelectedFeedbacks] = useState<string[]>([]);
  const [customNote, setCustomNote] = useState('');
  const [animation, setAnimation] = useState<'none' | 'approve' | 'reject'>('none');
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [lastAction, setLastAction] = useState<{ type: string; name: string } | null>(null);

  const current = products[currentIndex];
  const remaining = products.length - currentIndex;

  const goNext = useCallback(() => {
    setTimeout(() => {
      setAnimation('none');
      setCurrentIndex(prev => prev + 1);
      setShowFeedback(false);
      setSelectedFeedbacks([]);
      setCustomNote('');
    }, 300);
  }, []);

  const handleApprove = useCallback(() => {
    if (!current) return;
    setAnimation('approve');
    setApprovedCount(c => c + 1);
    setLastAction({ type: 'approve', name: current.name });
    goNext();
  }, [current, goNext]);

  const handleReject = useCallback(() => {
    if (!current || selectedFeedbacks.length === 0) {
      setShowFeedback(true);
      return;
    }
    setAnimation('reject');
    setRejectedCount(c => c + 1);
    setLastAction({ type: 'reject', name: current.name });
    goNext();
  }, [current, selectedFeedbacks, goNext]);

  const toggleFeedback = (id: string) => {
    setSelectedFeedbacks(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  // All done state
  if (!current) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in">
        <div className="text-[60px] mb-4">🎉</div>
        <h2 className="text-[22px] font-black text-[#111827] mb-2">Tebrikler!</h2>
        <p className="text-[13px] text-gray-500 font-medium mb-6">Bekleyen tüm ilanları inceldiniz.</p>
        <div className="flex gap-6 mb-8">
          <div className="text-center">
            <p className="text-[28px] font-black text-green-600">{approvedCount}</p>
            <p className="text-[11px] font-bold text-gray-400">Onaylandı</p>
          </div>
          <div className="w-px bg-gray-200"></div>
          <div className="text-center">
            <p className="text-[28px] font-black text-red-500">{rejectedCount}</p>
            <p className="text-[11px] font-bold text-gray-400">Reddedildi</p>
          </div>
        </div>
        <button onClick={() => { setCurrentIndex(0); setApprovedCount(0); setRejectedCount(0); }} className="px-6 py-3 rounded-2xl bg-[#111827] text-white text-[12px] font-black tracking-wider hover:bg-black transition-colors">
          YENİDEN BAŞLA
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[480px] mx-auto space-y-4 animate-fade-in pb-8">

      {/* Top Stats Bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1.5 rounded-full">
            <span className="text-[11px] font-black">✓ {approvedCount}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-red-50 text-red-500 px-3 py-1.5 rounded-full">
            <span className="text-[11px] font-black">✕ {rejectedCount}</span>
          </div>
        </div>
        <div className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
          <span className="text-[11px] font-black">{remaining} bekliyor</span>
        </div>
      </div>

      {/* Last Action Toast */}
      {lastAction && (
        <div className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[11px] font-bold animate-fade-in ${
          lastAction.type === 'approve' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
        }`}>
          <span>{lastAction.type === 'approve' ? '✓' : '✕'}</span>
          <span className="truncate">{lastAction.name}</span>
          <span className="ml-auto shrink-0">{lastAction.type === 'approve' ? 'onaylandı' : 'reddedildi'}</span>
        </div>
      )}

      {/* Product Card */}
      <div className={`bg-white rounded-[24px] border border-gray-100 shadow-lg overflow-hidden transition-all duration-300 ${
        animation === 'approve' ? 'translate-x-[120%] rotate-12 opacity-0' :
        animation === 'reject' ? '-translate-x-[120%] -rotate-12 opacity-0' : ''
      }`}>

        {/* Product Image */}
        <div className="relative w-full aspect-square bg-gray-100">
          <img
            src={current.image}
            alt={current.name}
            className="w-full h-full object-cover"
          />
          {/* Category Badge */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/50">
            <span className="text-[10px] font-black text-gray-700">{current.category}</span>
          </div>
          {/* Price Badge */}
          <div className="absolute top-4 right-4 bg-[#111827]/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <span className="text-[13px] font-black text-white">{current.price}</span>
          </div>
          {/* ID & Time */}
          <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <span className="text-[10px] font-bold text-white/90">{current.id} • {current.date}</span>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-5">
          <h3 className="text-[16px] font-black text-[#111827] leading-tight mb-1">{current.name}</h3>
          <p className="text-[12px] font-bold text-gray-400 mb-3">Satıcı: <span className="text-gray-600">{current.seller}</span></p>
          <p className="text-[12px] font-medium text-gray-500 leading-relaxed">{current.description}</p>
        </div>
      </div>

      {/* Feedback Panel (slides up when rejecting) */}
      {showFeedback && (
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-lg p-5 animate-fade-in">
          <h4 className="text-[13px] font-black text-[#111827] mb-1">Satıcıya Geri Bildirim</h4>
          <p className="text-[10px] font-bold text-gray-400 mb-4">Reddetmek için en az 1 neden seçin</p>

          <div className="grid grid-cols-2 gap-2 mb-4">
            {feedbackOptions.map(opt => (
              <button
                key={opt.id}
                onClick={() => toggleFeedback(opt.id)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all text-[11px] font-bold border ${
                  selectedFeedbacks.includes(opt.id)
                    ? 'bg-red-50 border-red-200 text-red-700'
                    : 'bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="text-[14px]">{opt.emoji}</span>
                <span className="leading-tight">{opt.label}</span>
              </button>
            ))}
          </div>

          {/* Custom Note */}
          <textarea
            value={customNote}
            onChange={e => setCustomNote(e.target.value)}
            placeholder="Ek not ekleyin (opsiyonel)..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-[12px] font-medium text-gray-700 resize-none focus:outline-none focus:border-gray-400 placeholder:text-gray-400"
            rows={2}
          />
        </div>
      )}

      {/* Action Buttons - Always Visible & Big */}
      <div className="flex items-center gap-3 px-1">
        {/* Reject */}
        <button
          onClick={handleReject}
          className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-[14px] transition-all active:scale-95 ${
            showFeedback && selectedFeedbacks.length > 0
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 hover:bg-red-600'
              : 'bg-red-50 text-red-500 border-2 border-red-100 hover:bg-red-100'
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          {showFeedback ? (selectedFeedbacks.length > 0 ? `Reddet (${selectedFeedbacks.length})` : 'Sebep Seçin') : 'Reddet'}
        </button>

        {/* Approve */}
        <button
          onClick={handleApprove}
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-green-500 text-white font-black text-[14px] shadow-lg shadow-green-500/30 hover:bg-green-600 transition-all active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          Onayla
        </button>
      </div>

      {/* Skip / Close Feedback */}
      {showFeedback && (
        <button
          onClick={() => { setShowFeedback(false); setSelectedFeedbacks([]); setCustomNote(''); }}
          className="w-full py-3 text-[12px] font-bold text-gray-400 hover:text-gray-600 transition-colors"
        >
          Vazgeç
        </button>
      )}
    </div>
  );
}

export default function Page() {
  return <ModerationView />;
}
