'use client';
import React, {useState} from "react";

type QuickReply = { id: string; label: string; emoji: string };
type Product = {
  id: string;
  name: string;
  category: string;
  seller: string;
  price: string;
  image: string;
  date: string;
};

const quickReplies: QuickReply[] = [
  { id: 'photo', label: 'Fotoğrafı değiştir', emoji: '📷' },
  { id: 'desc', label: 'Açıklama ekle', emoji: '📝' },
  { id: 'price', label: 'Fiyatı güncelle', emoji: '💰' },
  { id: 'category', label: 'Kategoriyi düzelt', emoji: '🏷️' },
  { id: 'cert', label: 'Belge yükle', emoji: '📋' },
  { id: 'size', label: 'Beden bilgisi ekle', emoji: '📏' },
];

const allProducts: Product[] = [
  { id: 'PRD-9921', name: 'Ev Yapımı Köy Salçası (1kg)', category: 'Organik', seller: 'Ayşe T.', price: '₺250', image: 'https://images.unsplash.com/photo-1608570515752-2457e514ca7b?w=300&h=300&fit=crop', date: '10dk' },
  { id: 'PRD-9922', name: 'Amigurumi Tavşan', category: 'El Yapımı', seller: 'Zeynep H.', price: '₺450', image: 'https://images.unsplash.com/photo-1535572290543-960a8046f5af?w=300&h=300&fit=crop', date: '25dk' },
  { id: 'PRD-9923', name: 'Organik Çam Balı (500g)', category: 'Organik', seller: 'Fatma A.', price: '₺380', image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=300&h=300&fit=crop', date: '42dk' },
  { id: 'PRD-9924', name: 'Bebek Tulum Takımı 0-3 Ay', category: 'Giyim', seller: 'Elif K.', price: '₺180', image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=300&h=300&fit=crop', date: '1sa' },
  { id: 'PRD-9925', name: 'Makrome Emzik Askısı', category: 'El Yapımı', seller: 'Merve T.', price: '₺120', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&h=300&fit=crop', date: '1.5sa' },
  { id: 'PRD-9926', name: 'Keçi Sütü Sabunu 3lü', category: 'Bakım', seller: 'Hatice B.', price: '₺95', image: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=300&h=300&fit=crop', date: '2sa' },
  { id: 'PRD-9927', name: 'Köy Yumurtası (30lu)', category: 'Organik', seller: 'Süheyla D.', price: '₺210', image: 'https://images.unsplash.com/photo-1498654077810-12c21d4d6dc3?w=300&h=300&fit=crop', date: '3sa' },
  { id: 'PRD-9928', name: 'Nakışlı Battaniye', category: 'El Yapımı', seller: 'Gülşah M.', price: '₺550', image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=300&h=300&fit=crop', date: '4sa' },
  { id: 'PRD-9929', name: 'Bebek Şampuanı Doğal', category: 'Bakım', seller: 'Seda Y.', price: '₺85', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop', date: '4.5sa' },
  { id: 'PRD-9930', name: 'Ahşap Diş Kaşıyıcı', category: 'El Yapımı', seller: 'Büşra K.', price: '₺75', image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=300&h=300&fit=crop', date: '5sa' },
  { id: 'PRD-9931', name: 'Tarhana (500g)', category: 'Organik', seller: 'Nuriye Ö.', price: '₺160', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=300&fit=crop', date: '5.5sa' },
  { id: 'PRD-9932', name: '1 Yaş Doğum Günü Elbise', category: 'Giyim', seller: 'Gamze S.', price: '₺320', image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=300&h=300&fit=crop', date: '6sa' },
];

export function ModerationView() {
  const [products, setProducts] = useState(allProducts);
  const [openReply, setOpenReply] = useState<string | null>(null);
  const [sentMessages, setSentMessages] = useState<Record<string, string[]>>({});
  const [approvedIds, setApprovedIds] = useState<string[]>([]);
  const [toast, setToast] = useState<{ msg: string; type: 'green' | 'blue' } | null>(null);
  const [approvedCount, setApprovedCount] = useState(0);
  const [notifiedCount, setNotifiedCount] = useState(0);

  const showToast = (msg: string, type: 'green' | 'blue') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2000);
  };

  const handleApprove = (id: string, name: string) => {
    setApprovedIds(prev => [...prev, id]);
    setApprovedCount(c => c + 1);
    showToast(`✓ ${name} onaylandı`, 'green');
    // Remove after animation
    setTimeout(() => {
      setProducts(prev => prev.filter(p => p.id !== id));
      setApprovedIds(prev => prev.filter(i => i !== id));
    }, 400);
  };

  const handleSendReply = (id: string, reply: QuickReply, sellerName: string) => {
    setSentMessages(prev => ({
      ...prev,
      [id]: [...(prev[id] || []), reply.id]
    }));
    setNotifiedCount(c => c + 1);
    showToast(`${reply.emoji} "${reply.label}" → ${sellerName}'ye bildirim gönderildi`, 'blue');
  };

  const handleApproveAll = () => {
    const count = products.length;
    setApprovedCount(c => c + count);
    showToast(`✓ ${count} ilan toplu onaylandı!`, 'green');
    setProducts([]);
  };

  const pending = products.filter(p => !approvedIds.includes(p.id));

  return (
    <div className="max-w-[600px] mx-auto pb-24 animate-fade-in">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[200] px-5 py-3 rounded-2xl text-[12px] font-bold shadow-2xl animate-fade-in ${
          toast.type === 'green' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#F8F9FA]/95 backdrop-blur-xl pb-3 pt-1">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-[18px] font-black text-[#111827]">İlan Onay</h2>
            <p className="text-[11px] font-bold text-gray-400">{pending.length} ilan bekliyor</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1.5 rounded-full border border-green-100">
              <span className="text-[11px] font-black">✓ {approvedCount}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full border border-blue-100">
              <span className="text-[11px] font-black">💬 {notifiedCount}</span>
            </div>
          </div>
        </div>

        {/* Approve All */}
        {pending.length > 1 && (
          <button
            onClick={handleApproveAll}
            className="w-full py-3 rounded-2xl bg-green-500 text-white text-[12px] font-black tracking-wide shadow-lg shadow-green-500/20 hover:bg-green-600 active:scale-[0.98] transition-all"
          >
            ✓ Tümünü Onayla ({pending.length} ilan)
          </button>
        )}
      </div>

      {/* Product List */}
      {pending.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center px-4">
          <div className="text-[50px] mb-3">🎉</div>
          <h3 className="text-[18px] font-black text-[#111827] mb-1">Tebrikler!</h3>
          <p className="text-[12px] text-gray-500 font-medium">Bekleyen ilan kalmadı.</p>
        </div>
      ) : (
        <div className="space-y-3 mt-3">
          {pending.map((product) => {
            const isOpen = openReply === product.id;
            const sent = sentMessages[product.id] || [];

            return (
              <div
                key={product.id}
                className={`bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 ${
                  approvedIds.includes(product.id) ? 'translate-x-[110%] opacity-0 scale-95' : ''
                }`}
              >
                {/* Product Row */}
                <div className="flex gap-3 p-3">
                  {/* Image */}
                  <div className="w-[90px] h-[90px] rounded-2xl overflow-hidden shrink-0 bg-gray-100">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <h4 className="text-[13px] font-black text-[#111827] leading-tight truncate">{product.name}</h4>
                      <p className="text-[10px] font-bold text-gray-400 mt-0.5">{product.seller} • {product.date}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">{product.category}</span>
                      <span className="text-[12px] font-black text-[#111827]">{product.price}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-1.5 shrink-0 justify-center">
                    <button
                      onClick={() => handleApprove(product.id, product.name)}
                      className="w-[44px] h-[44px] flex items-center justify-center rounded-xl bg-green-500 text-white shadow-md shadow-green-500/30 hover:bg-green-600 active:scale-90 transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </button>
                    <button
                      onClick={() => setOpenReply(isOpen ? null : product.id)}
                      className={`w-[44px] h-[44px] flex items-center justify-center rounded-xl border-2 transition-all active:scale-90 ${
                        isOpen ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-400 border-gray-200 hover:border-blue-300 hover:text-blue-500'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    </button>
                  </div>
                </div>

                {/* Quick Reply Chips */}
                {isOpen && (
                  <div className="px-3 pb-3 animate-fade-in">
                    <div className="h-px bg-gray-100 mb-3"></div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Hızlı Bildirim Gönder</p>
                    <div className="flex flex-wrap gap-1.5">
                      {quickReplies.map(reply => {
                        const alreadySent = sent.includes(reply.id);
                        return (
                          <button
                            key={reply.id}
                            disabled={alreadySent}
                            onClick={() => handleSendReply(product.id, reply, product.seller)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold transition-all active:scale-95 ${
                              alreadySent
                                ? 'bg-blue-50 text-blue-400 border border-blue-100 opacity-60 cursor-not-allowed'
                                : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600'
                            }`}
                          >
                            <span className="text-[13px]">{reply.emoji}</span>
                            {reply.label}
                            {alreadySent && <span className="text-[9px]">✓</span>}
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

export default function Page() {
  return <ModerationView />;
}
