'use client';

import React, {useState} from 'react';
import Link from 'next/link';
import {useCart} from '../../context/CartContext';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Create orders from cart
      const createResponse = await fetch('https://api.salutbabe.com/v1/order/create-from-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Device-Type': 'web'
          // Auth header missing? Assuming guest or handled by cookies/session
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            listingID: item.listingID,
            quantity: item.quantity
          }))
        })
      });

      if (!createResponse.ok) {
        throw new Error('Sipariş oluşturulamadı. Lütfen tekrar deneyin.');
      }

      const createResult = await createResponse.json();
      const orderIDs = createResult.payload.orders.map((o: any) => o.orderID);

      // 2. Process Tami Payment
      const expiryParts = formData.expiry.split('/');
      if (expiryParts.length !== 2) throw new Error('SKT formatı geçersiz (AA/YY)');

      const month = parseInt(expiryParts[0]);
      const year = 2000 + parseInt(expiryParts[1]);

      const payResponse = await fetch('https://api.salutbabe.com/v1/order/confirm-payment-tami', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Device-Type': 'web'
        },
        body: JSON.stringify({
          orderIDs,
          card: {
            holderName: formData.name,
            number: formData.cardNumber.replace(/\s/g, ''),
            expireMonth: month,
            expireYear: year,
            cvv: formData.cvv
          }
        })
      });

      const payResult = await payResponse.json();

      if (!payResponse.ok || !payResult.request.requestResult) {
        throw new Error(payResult.errorMessage || 'Ödeme tamamlanamadı. Lütfen kart bilgilerinizi kontrol edin.');
      }

      // 3. Success
      setIsSuccess(true);
      clearCart();
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Beklenmedik bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen pt-32 pb-16 bg-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex items-center justify-center opacity-10">
          <svg className="w-96 h-96 text-green-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
        </div>
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h1 className="text-4xl font-black text-neutral-900 mb-4 tracking-tighter">Siparişin Alındı!</h1>
          <p className="text-neutral-500 mb-10 text-lg">Harika bir tercih yaptın. Siparişin en kısa sürede hazırlanıp yola çıkacak. Detaylar e-posta adresine gönderildi.</p>
          <div className="flex flex-col gap-4">
            <Link href="/" className="inline-block px-10 py-4 bg-blue-700 text-white rounded-2xl font-bold shadow-xl shadow-blue-100 hover:bg-pink-600 transition duration-300">
              Alışverişe Devam Et
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-screen pt-32 pb-16 bg-neutral-50">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-neutral-800 mb-4">Sepetin Boş</h1>
          <p className="text-neutral-500 mb-8">Ödeme yapabilmek için sepetine ürün eklemelisin.</p>
          <Link href="/" className="inline-block px-8 py-3 bg-pink-600 text-white rounded-full font-bold">
            Anasayfaya Dön
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-16 bg-neutral-50">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-neutral-800 mb-8 font-primary tracking-tight uppercase">Ödeme Bilgileri</h1>

        <form onSubmit={handleCheckout} className="flex flex-col lg:flex-row gap-8">
          {/* Left Side: Forms */}
          <div className="flex-1 space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl font-bold border border-red-100">
                {error}
              </div>
            )}

            {/* Delivery Address */}
            <div className="bg-white p-6 rounded-3xl shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-sm">1</div>
                <h2 className="text-xl font-bold text-neutral-800">Teslimat Adresi</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-500 ml-1 uppercase">AD SOYAD</label>
                  <input required name="name" value={formData.name} onChange={handleInputChange} type="text" placeholder="Adınız ve Soyadınız" className="w-full bg-neutral-50 border-none rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-pink-500/20 text-neutral-800 transition placeholder:text-neutral-300" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-500 ml-1 uppercase">TELEFON</label>
                  <input required name="phone" value={formData.phone} onChange={handleInputChange} type="tel" placeholder="05XX XXX XX XX" className="w-full bg-neutral-50 border-none rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-pink-500/20 text-neutral-800 transition placeholder:text-neutral-300" />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-neutral-500 ml-1 uppercase">ADRES</label>
                  <textarea required name="address" value={formData.address} onChange={handleInputChange} rows={3} placeholder="Mahalle, sokak, bina ve kapı numarası..." className="w-full bg-neutral-50 border-none rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-pink-500/20 text-neutral-800 transition placeholder:text-neutral-300"></textarea>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white p-6 rounded-3xl shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-sm">2</div>
                <h2 className="text-xl font-bold text-neutral-800">Ödeme Yöntemi</h2>
              </div>

              <div className="space-y-6">
                <div className="p-4 border-2 border-pink-500 rounded-2xl bg-pink-50/30 flex justify-between items-center transition group">
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full border-4 border-pink-500 bg-white shadow-sm ring-2 ring-pink-500/20"></div>
                    <span className="font-bold text-neutral-800">Tami Sanal POS</span>
                  </div>
                  <div className="flex gap-2">
                    <img src="https://img.icons8.com/color/48/000000/visa.png" className="w-8 h-8 object-contain" alt="visa" />
                    <img src="https://img.icons8.com/color/48/000000/mastercard.png" className="w-8 h-8 object-contain" alt="mastercard" />
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-500 ml-1 uppercase">KART NUMARASI</label>
                    <input required name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} type="text" placeholder="XXXX XXXX XXXX XXXX" className="w-full bg-neutral-50 border-none rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-pink-500/20 text-neutral-800 transition" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-500 ml-1 uppercase">SON KULLANIM</label>
                      <input required name="expiry" value={formData.expiry} onChange={handleInputChange} type="text" placeholder="AA / YY" className="w-full bg-neutral-50 border-none rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-pink-500/20 text-neutral-800 transition" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-500 ml-1 uppercase">CVV</label>
                      <input required name="cvv" value={formData.cvv} onChange={handleInputChange} type="text" placeholder="***" className="w-full bg-neutral-50 border-none rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-pink-500/20 text-neutral-800 transition" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Order Summary */}
          <div className="w-full lg:w-96">
            <div className="bg-white p-6 rounded-3xl shadow-sm sticky top-32 overflow-hidden border border-neutral-100/50">
              <h2 className="text-xl font-bold text-neutral-800 mb-6 font-primary uppercase tracking-tight">Sipariş Özeti</h2>

              <div className="space-y-4 mb-8">
                {cart.map(item => (
                  <div key={item.listingID} className="flex justify-between text-sm items-center hover:bg-neutral-50 transition p-2 rounded-lg -mx-2">
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-lg bg-neutral-100 overflow-hidden flex-shrink-0">
                        <img src={item.primaryImage} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-neutral-800 line-clamp-1">{item.title}</span>
                        <span className="text-[10px] text-neutral-400">{item.quantity} Adet</span>
                      </div>
                    </div>
                    <span className="font-bold text-neutral-700">{item.price * item.quantity} TL</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mb-8 pt-6 border-t border-neutral-100">
                <div className="flex justify-between text-neutral-500 font-medium">
                  <span>Ara Toplam</span>
                  <span>{cartTotal} TL</span>
                </div>
                <div className="flex justify-between  text-neutral-500 font-medium">
                  <span>Kargo</span>
                  <span className="text-green-500">Ücretsiz</span>
                </div>
                <div className="flex justify-between items-end pt-4">
                  <span className="font-black text-neutral-800 text-lg uppercase tracking-tighter">Genel Toplam</span>
                  <div className="text-right">
                    <span className="text-3xl font-black text-pink-600 block leading-none">{cartTotal} TL</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-pink-600 text-white rounded-2xl font-bold shadow-xl shadow-pink-100 hover:bg-blue-600 hover:shadow-blue-100 transition duration-300 transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    Güvenli Öde
                  </>
                )}
              </button>

              <div className="mt-6 p-4 bg-blue-50/50 rounded-xl">
                <p className="text-[10px] text-neutral-500 leading-tight">
                  Ödeme yaparak <span className="underline cursor-pointer font-bold">Mesafeli Satış Sözleşmesi</span> ve <span className="underline cursor-pointer font-bold">Kullanım Koşullarını</span> okuduğunuzu ve onayladığınızı kabul etmiş olursunuz.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
