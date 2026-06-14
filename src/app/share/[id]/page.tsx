'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function SharedPaymentPage() {
  const { id } = useParams();
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const [submitting, setSubmitting] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:2805';
  const API_VER = process.env.NEXT_PUBLIC_API_BASE_VERSION || 'v1';

  useEffect(() => {
    if (!id) return;

    fetch(`${API_URL}/${API_VER}/common/shared-link/get-share-data/${id}`)
      .then((res) => res.json())
      .then((res) => {
        const header = res.requestHeader || res.request;
        if (!header || !header.requestResult) {
          throw new Error(header?.resultMessage || 'Link bulunamadı veya süresi dolmuş.');
        }
        setData(res.payload);
        if (res.payload.orders) {
          setSelectedOrders(res.payload.orders.map((o: any) => o.orderID));
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, API_URL, API_VER]);

  const toggleOrder = (orderID: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderID) ? prev.filter((oId) => oId !== orderID) : [...prev, orderID]
    );
  };

  const handlePayment = async () => {
    if (selectedOrders.length === 0) {
      alert('Lütfen ödemek istediğiniz en az bir siparişi seçin.');
      return;
    }
    if (!cardHolder || !cardNumber || !expiry || !cvv) {
      alert('Lütfen kart bilgilerini eksiksiz doldurun.');
      return;
    }

    const [expireMonth, expireYear] = expiry.split('/');
    if (!expireMonth || !expireYear) {
      alert('Geçerli bir SKT (AA/YY) girin.');
      return;
    }

    let parsedYear = parseInt(expireYear, 10);
    if (parsedYear < 100) parsedYear += 2000;

    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/${API_VER}/order/shared-payment/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shareID: id,
          orderIDs: selectedOrders,
          card: {
            holderName: cardHolder,
            number: cardNumber.replace(/\s/g, ''),
            expireMonth: parseInt(expireMonth, 10),
            expireYear: parsedYear,
            cvv,
          },
          messageToRecipient: message,
        }),
      });

      const resData = await response.json();
      const header = resData.requestHeader || resData.request;
      if (!header || !header.requestResult) {
        throw new Error(header?.resultMessage || 'Ödeme başlatılamadı');
      }

      const params = resData.payload.params;
      const gateUrl = resData.payload.gateUrl;

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = gateUrl;

      Object.keys(params).forEach((key) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = params[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err: any) {
      alert(err.message);
      setSubmitting(false);
    }
  };

  const formatCardNumber = (val: string) => val.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ').trim();

  const formatExpiry = (val: string) => {
    const clean = val.replace(/\D/g, '');
    if (clean.length >= 3) return `${clean.slice(0, 2)}/${clean.slice(2, 4)}`;
    return clean;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#121212] via-[#1A1A2E] to-[#121212]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-t-2 border-secondary animate-spin-reverse"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] p-4 text-white">
        <div className="max-w-md w-full backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-3xl p-8 text-center animate-fade-in-up">
          <div className="w-20 h-20 mx-auto bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(239,68,68,0.3)]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-3 tracking-tight text-white">Hata Oluştu</h2>
          <p className="text-gray-400 leading-relaxed">{error || 'Bağlantı bulunamadı veya süresi dolmuş.'}</p>
          <button 
            onClick={() => router.push('/')}
            className="mt-8 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all font-medium border border-white/5 w-full"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  const { products, orders, senderName } = data;
  const isPaid = orders && orders.every((o: any) => o.status === 'paid' || o.status === 'processing');

  if (isPaid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] p-4 text-white">
        <div className="max-w-md w-full backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-3xl p-8 text-center animate-fade-in-up">
          <div className="w-24 h-24 mx-auto bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(34,197,94,0.3)]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">Ödeme Tamamlandı!</h2>
          <p className="text-gray-400 text-lg">Bu link üzerinden ödeme yapılmış, desteğiniz için çok teşekkür ederiz.</p>
        </div>
      </div>
    );
  }

  const totalSelectedAmount = orders
    ? orders.filter((o: any) => selectedOrders.includes(o.orderID)).reduce((sum: number, o: any) => sum + parseFloat(o.totalAmount), 0)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] py-16 px-4 font-sans text-white selection:bg-pink-500/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-down">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
            {senderName ? `${senderName} sana bir hediye seçti!` : 'Özel Hediye Sepeti'}
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Bu özel sepetin ödemesini tamamlayarak onu mutlu edebilirsin.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column - Order Items */}
          <div className="lg:col-span-7 space-y-6">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl transition-all hover:bg-white/[0.07]">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="bg-pink-500/20 text-pink-400 p-2 rounded-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  </span>
                  Sepet Özeti
                </h2>
                <span className="px-4 py-1.5 rounded-full bg-white/10 text-sm font-medium text-gray-300">
                  {orders ? orders.length : (products ? products.length : 0)} Ürün
                </span>
              </div>

              <div className="space-y-4">
                {orders && orders.map((order: any, idx: number) => {
                  const isSelected = selectedOrders.includes(order.orderID);
                  return (
                    <div 
                      key={order.orderID} 
                      onClick={() => toggleOrder(order.orderID)}
                      className={`relative overflow-hidden group border rounded-2xl p-5 cursor-pointer transition-all duration-300 flex items-center gap-5
                        ${isSelected ? 'border-pink-500/50 bg-pink-500/10 shadow-[0_0_30px_rgba(236,72,153,0.15)]' : 'border-white/10 hover:border-white/20 bg-white/5 opacity-80 hover:opacity-100'}
                      `}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'border-pink-400 bg-pink-400' : 'border-gray-500'}`}>
                        {isSelected && <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-white group-hover:text-pink-300 transition-colors">Paket #{idx + 1}</h3>
                        <p className="text-sm text-gray-400 mt-1 line-clamp-1">Kıyafet, ayakkabı ve daha fazlası</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-white">{parseFloat(order.totalAmount).toLocaleString('tr-TR')} <span className="text-sm text-pink-400">TL</span></div>
                      </div>
                    </div>
                  );
                })}

                {!orders && products && products.map((product: any) => (
                  <div key={product.listingID} className="flex gap-5 border border-white/10 rounded-2xl p-4 bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="w-20 h-20 rounded-xl bg-black/40 overflow-hidden shrink-0 shadow-inner">
                      <img src={product.images?.[0]?.imageUrl || ''} alt={product.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="font-medium text-base text-gray-200 line-clamp-2 leading-snug">{product.title}</h3>
                      <div className="text-pink-400 font-bold text-lg mt-2">{product.price} TL</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-8"></div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3 ml-1">Kişisel Mesajın (İsteğe Bağlı)</label>
                <div className="relative">
                  <textarea
                    className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-transparent transition-all resize-none h-28"
                    placeholder="Seni çok seviyorum..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Form */}
          <div className="lg:col-span-5">
            <div className="backdrop-blur-2xl bg-[#0f172a]/80 border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] sticky top-8">
              
              <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 flex justify-between items-center shadow-inner">
                <span className="text-gray-300 font-medium">Ödenecek Tutar</span>
                <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                  {totalSelectedAmount.toLocaleString('tr-TR')} <span className="text-lg text-pink-400">TL</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                Kart Bilgileri
              </h3>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-1">Kart Üzerindeki İsim</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                    placeholder="AD SOYAD"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-1">Kart Numarası</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-mono tracking-widest text-lg"
                      maxLength={19}
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                      <div className="w-6 h-4 bg-white/20 rounded-sm"></div>
                      <div className="w-6 h-4 bg-white/10 rounded-sm"></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-1">Son K. Tarihi</label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-mono text-lg"
                      placeholder="AA/YY"
                      maxLength={5}
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-1">CVV</label>
                    <input
                      type="password"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-mono text-lg tracking-widest"
                      maxLength={4}
                      placeholder="•••"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                </div>
              </div>

              <button
                className={`mt-10 w-full py-4 rounded-2xl font-bold text-lg text-white shadow-xl transition-all duration-300 relative overflow-hidden group
                  ${submitting || selectedOrders.length === 0 ? 'bg-white/10 cursor-not-allowed text-gray-500' : 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:-translate-y-1'}
                `}
                disabled={submitting || selectedOrders.length === 0}
                onClick={handlePayment}
              >
                {!submitting && selectedOrders.length > 0 && (
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                )}
                <span className="relative flex items-center justify-center gap-2">
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      İşleniyor...
                    </>
                  ) : (
                    <>
                      Ödemeyi Tamamla
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </>
                  )}
                </span>
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                256-bit SSL Güvencesiyle
              </div>
            </div>
          </div>

        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fadeInDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
    </div>
  );
}
