'use client';

import React from 'react';
import Link from 'next/link';
import {useCart} from '../../context/CartContext';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <main className="min-h-screen pt-32 pb-16 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-neutral-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-neutral-800 mb-4">Sepetin Henüz Boş</h1>
          <p className="text-neutral-500 mb-8 max-w-md mx-auto">Beğendiğin ürünleri hemen sepetine ekle, kaçırmadan satın al!</p>
          <Link href="/" className="inline-block px-8 py-3 bg-pink-600 text-white rounded-full font-bold shadow-lg hover:bg-blue-600 transition">
            Alışverişe Başla
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-16 bg-neutral-50">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-neutral-800 mb-8">Sepetim ({cart.length} Ürün)</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side: Cart Items */}
          <div className="flex-1 space-y-4">
            {cart.map((item) => (
              <div key={item.listingID} className="bg-white p-4 rounded-2xl shadow-sm flex gap-6 group hover:shadow-md transition duration-300">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0">
                  <img src={item.primaryImage} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                </div>
                
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">{item.brand?.name || 'Markasız'}</span>
                        <h3 className="font-bold text-neutral-800 text-lg sm:text-xl line-clamp-1">{item.title}</h3>
                        <p className="text-xs text-neutral-500 flex items-center gap-1">
                          Satıcı: <span className="font-medium text-neutral-700">{item.seller?.userNickname || 'Satıcı'}</span>
                        </p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.listingID)}
                        className="text-neutral-400 hover:text-red-500 p-1 transition"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-end mt-4">
                    <div className="flex items-center bg-neutral-100 rounded-lg p-1">
                      <button 
                        onClick={() => updateQuantity(item.listingID, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition text-neutral-600"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-bold text-neutral-800">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.listingID, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition text-neutral-600"
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xl font-bold text-neutral-900">{item.price} TL</div>
                      {item.originalPrice && (
                        <div className="text-xs text-neutral-400 line-through">{item.originalPrice} TL</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Right Side: Order Summary */}
          <div className="w-full lg:w-80">
            <div className="bg-white p-6 rounded-3xl shadow-sm sticky top-32">
              <h2 className="text-xl font-bold text-neutral-800 mb-6 font-primary uppercase tracking-tight">Sipariş Özeti</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-neutral-600">
                  <span>Ürün Toplamı</span>
                  <span>{cartTotal} TL</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Kargo Ücreti</span>
                  <span className="text-green-600 font-medium">Bedava</span>
                </div>
                <div className="h-px bg-neutral-100 my-2"></div>
                <div className="flex justify-between items-end">
                  <span className="font-bold text-neutral-800">Toplam</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-pink-600">{cartTotal} TL</span>
                    <p className="text-[10px] text-neutral-400 mt-1 uppercase font-bold tracking-wider">KDV Dahil</p>
                  </div>
                </div>
              </div>
              
              <Link href="/checkout" className="block w-full text-center py-4 bg-pink-600 text-white rounded-2xl font-bold shadow-xl shadow-pink-200 hover:bg-blue-600 hover:shadow-blue-200 transition duration-300 transform active:scale-[0.98]">
                Satın Almayı Tamamla
              </Link>
              
              <button 
                onClick={async () => {
                  try {
                    const response = await fetch('https://api.salutbabe.com/v1/common/shared-link/create-shared-link', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', 'X-Device-Type': 'web' },
                      body: JSON.stringify({
                        type: 'cart',
                        listingIDs: cart.map(item => item.listingID)
                      })
                    });
                    if (!response.ok) throw new Error('Link oluşturulamadı');
                    const json = await response.json();
                    const link = `https://salutbabe.com/share/${json.payload.shareID}`;
                    
                    if (navigator.share) {
                      await navigator.share({
                        title: 'SalutBabe Sepetim',
                        text: 'Beğendiğim ürünleri seçtim, ödemeyi senin için bıraktım! ❤️',
                        url: link
                      });
                    } else {
                      await navigator.clipboard.writeText(link);
                      alert('Paylaşma linki kopyalandı! ❤️');
                    }
                  } catch (err) {
                    console.error(err);
                    alert('Hata: Link oluşturulamadı.');
                  }
                }}
                className="mt-4 w-full flex items-center justify-center gap-2 py-3 border-2 border-pink-100 text-pink-600 rounded-2xl font-bold hover:bg-pink-50 transition duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                Kocam Ödesin (Link Paylaş)
              </button>
              
              <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                  Güvenli Ödeme
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                   <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                  24 Saatte Kargoda
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
