'use client';

import React, {useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';

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

  useEffect(() => {
    if (!id) return;
    
    fetch(`https://api.salutbabe.com/v1/common/shared-link/get-share-data/${id}`)
      .then(res => res.json())
      .then(res => {
        const header = res.requestHeader || res.request;
        if (!header || !header.requestResult) {
          throw new Error(header?.resultMessage || 'Link bulunamadı');
        }
        setData(res.payload);
        if (res.payload.orders) {
          // Select all by default
          setSelectedOrders(res.payload.orders.map((o: any) => o.orderID));
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleOrder = (orderID: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderID) 
        ? prev.filter(id => id !== orderID) 
        : [...prev, orderID]
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
      const response = await fetch(`https://api.salutbabe.com/v1/order/shared-payment/initiate`, {
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
            cvv
          },
          messageToRecipient: message
        })
      });

      const resData = await response.json();
      const header = resData.requestHeader || resData.request;
      if (!header || !header.requestResult) {
        throw new Error(header?.resultMessage || 'Ödeme başlatılamadı');
      }

      // Redirect to 3D Secure
      const params = resData.payload.params;
      const gateUrl = resData.payload.gateUrl;
      
      // Create a form and submit to 3D secure endpoint
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = gateUrl;

      Object.keys(params).forEach(key => {
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

  const formatCardNumber = (val: string) => {
    return val.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val: string) => {
    const clean = val.replace(/\D/g, '');
    if (clean.length >= 3) {
      return `${clean.slice(0, 2)}/${clean.slice(2, 4)}`;
    }
    return clean;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
        <div className="alert alert-error max-w-md shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{error || 'Sipariş bulunamadı veya süresi dolmuş.'}</span>
        </div>
      </div>
    );
  }

  const { products, orders } = data;
  const isPaid = orders && orders.every((o: any) => o.status === 'paid' || o.status === 'processing');

  if (isPaid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
        <div className="card w-full max-w-md bg-base-100 shadow-xl text-center p-8">
          <div className="text-success mx-auto mb-4 text-6xl">
             ✓
          </div>
          <h2 className="text-2xl font-bold mb-2">Bu Sipariş Ödenmiş!</h2>
          <p className="text-base-content/70">Bu link üzerinden ödeme yapılmış, destek olduğunuz için teşekkürler.</p>
        </div>
      </div>
    );
  }

  const totalSelectedAmount = orders 
    ? orders.filter((o: any) => selectedOrders.includes(o.orderID)).reduce((sum: number, o: any) => sum + parseFloat(o.totalAmount), 0)
    : 0;

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4">
      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Col - Products & Message */}
        <div className="space-y-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">Sepetteki Ürünler</h2>
              
              {orders && orders.map((order: any, idx: number) => {
                const isSelected = selectedOrders.includes(order.orderID);
                return (
                  <div key={order.orderID} className={`border rounded-xl p-4 mb-3 transition-colors ${isSelected ? 'border-primary bg-primary/5' : 'border-base-300 opacity-60'}`}>
                    <label className="flex items-center cursor-pointer gap-4">
                      <input 
                        type="checkbox" 
                        className="checkbox checkbox-primary" 
                        checked={isSelected}
                        onChange={() => toggleOrder(order.orderID)}
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-sm">Paket #{idx + 1}</div>
                        <div className="text-xs text-base-content/60">Tutar: {parseFloat(order.totalAmount).toLocaleString('tr-TR')} TL</div>
                      </div>
                    </label>
                  </div>
                );
              })}

              {!orders && products && products.map((product: any) => (
                <div key={product.listingID} className="flex gap-4 border-b border-base-200 pb-4 mb-4">
                  <div className="w-16 h-16 rounded-lg bg-base-300 overflow-hidden shrink-0">
                    <img src={product.images?.[0]?.imageUrl || ''} alt={product.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm line-clamp-2">{product.title}</div>
                    <div className="text-primary font-bold mt-1">{product.price} TL</div>
                  </div>
                </div>
              ))}

              <div className="divider"></div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Alıcıya Özel Mesajınız (İsteğe Bağlı)</span>
                </label>
                <textarea 
                  className="textarea textarea-bordered h-24 w-full" 
                  placeholder="Sevgilerimle..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col - Payment Form */}
        <div>
          <div className="card bg-base-100 shadow-xl sticky top-6">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">Ödeme Bilgileri</h2>
              
              <div className="bg-primary/10 text-primary rounded-xl p-4 mb-6 flex justify-between items-center font-bold text-lg">
                <span>Ödenecek Tutar</span>
                <span>{totalSelectedAmount.toLocaleString('tr-TR')} TL</span>
              </div>

              <div className="space-y-4">
                <div className="form-control">
                  <label className="label"><span className="label-text">Kart Üzerindeki İsim</span></label>
                  <input 
                    type="text" 
                    className="input input-bordered w-full" 
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                  />
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text">Kart Numarası</span></label>
                  <input 
                    type="text" 
                    className="input input-bordered w-full" 
                    maxLength={19}
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label"><span className="label-text">Son K. Tarihi</span></label>
                    <input 
                      type="text" 
                      className="input input-bordered w-full" 
                      placeholder="AA/YY"
                      maxLength={5}
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label"><span className="label-text">CVV</span></label>
                    <input 
                      type="password" 
                      className="input input-bordered w-full" 
                      maxLength={4}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button 
                  className="btn btn-primary w-full btn-lg"
                  disabled={submitting || selectedOrders.length === 0}
                  onClick={handlePayment}
                >
                  {submitting ? <span className="loading loading-spinner"></span> : 'Ödemeyi Tamamla'}
                </button>
              </div>

              <div className="text-center mt-4 text-xs text-base-content/50 flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                256-bit SSL ile güvence altındadır
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
