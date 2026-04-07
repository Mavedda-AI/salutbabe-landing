'use client';

import React, {use, useEffect, useState} from 'react';
import {Product, useCart} from '../../../context/CartContext';
import Link from 'next/link';

interface SharedData {
  type: 'cart' | 'product';
  product?: any;
  products?: any[];
  metadata?: {
    flavor?: string;
  };
}

export default function SharedPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { addToCart } = useCart();
  const [data, setData] = useState<SharedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSharedData = async () => {
      try {
        const response = await fetch(`https://api.salutbabe.com/v1/common/shared-link/get-share-data/${id}`, {
          headers: { 'X-Device-Type': 'web' }
        });
        if (!response.ok) throw new Error('Paylaşım verisi bulunamadı');
        const json = await response.json();
        setData(json.payload);
      } catch (err) {
        console.error(err);
        setError('Bu paylaşım linki artık geçerli olmayabilir.');
      } finally {
        setLoading(false);
      }
    };
    fetchSharedData();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen pt-32 pb-16 bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-pink-500 border-r-transparent mb-4"></div>
          <p className="text-neutral-500 font-medium">Paylaşım Yükleniyor...</p>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen pt-32 pb-16 bg-neutral-50 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="text-pink-500 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-neutral-800 mb-4">{error}</h1>
          <Link href="/" className="inline-block px-8 py-3 bg-pink-600 text-white rounded-full font-bold shadow-lg hover:bg-blue-600 transition">
            Anasayfaya Dön
          </Link>
        </div>
      </main>
    );
  }

  const renderProduct = (p: any) => {
    const formattedProduct: Product = {
      listingID: p.listingID,
      title: p.title,
      price: p.price,
      originalPrice: p.originalPrice,
      primaryImage: p.images?.find((img: any) => img.isPrimary)?.imageUrl || p.images?.[0]?.imageUrl || '',
      brand: p.brand,
      seller: p.seller,
    };

    return (
      <div key={p.listingID} className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition duration-300">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-80 aspect-square rounded-2xl overflow-hidden bg-neutral-100 flex-shrink-0">
            <img src={formattedProduct.primaryImage} alt={p.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <span className="text-sm font-bold text-blue-700 uppercase tracking-widest">{formattedProduct.brand?.name || 'Markasız'}</span>
              <h2 className="text-3xl font-bold text-neutral-800 mt-2 mb-4 leading-tight">{p.title}</h2>
              <p className="text-neutral-600 mb-6 line-clamp-4">{p.description}</p>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="text-4xl font-black text-neutral-900">{p.price} TL</div>
                {p.originalPrice && (
                  <div className="text-xl text-neutral-400 line-through">{p.originalPrice} TL</div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => addToCart(formattedProduct)}
                className="flex-1 bg-pink-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-pink-100 hover:bg-blue-600 hover:shadow-blue-100 transition duration-300 transform active:scale-[0.98] text-lg"
              >
                Sepete Ekle & Satın Al
              </button>
              <Link 
                href="/" 
                className="flex-1 border-2 border-neutral-200 text-neutral-600 font-bold py-4 rounded-2xl hover:bg-neutral-50 transition duration-300 text-center text-lg"
              >
                Diğer Ürünlere Bak
              </Link>
            </div>
            
            <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
                  {p.seller?.userNickname?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Satıcı</p>
                  <p className="font-bold text-neutral-800">{p.seller?.userNickname}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                SATIŞA UYGUN
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCart = (products: any[]) => {
    const isHusbandPays = data?.metadata?.flavor === 'husband-pays';

    return (
      <div className="space-y-8">
        <div className={`p-10 rounded-[2.5rem] text-center mb-12 shadow-2xl relative overflow-hidden ${isHusbandPays ? 'bg-neutral-900 text-white' : 'bg-pink-50 text-neutral-800 border-2 border-dashed border-pink-200'}`}>
          {isHusbandPays && (
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </div>
          )}
          <div className={`${isHusbandPays ? 'bg-pink-500' : 'bg-white'} w-20 h-20 rounded-3xl rotate-12 flex items-center justify-center mx-auto mb-6 shadow-xl text-${isHusbandPays ? 'white' : 'pink-500'}`}>
             <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </div>
          <h2 className="text-4xl font-black mb-3 tracking-tight">
            {isHusbandPays ? 'Kocam Ödesin ✨' : 'Beğenilen Ürünler Paketi'}
          </h2>
          <p className={`text-lg max-w-lg mx-auto font-medium ${isHusbandPays ? 'text-neutral-400' : 'text-neutral-500'}`}>
            {isHusbandPays 
              ? 'Mükemmel seçimler yapıldı, en şıkları bir araya getirildi... Şimdi bu muhteşem paketi onaylama zamanı!' 
              : 'Bu ürünler sizin için seçildi. Hemen sepetinize ekleyip alışverişi tamamlayabilirsiniz.'}
          </p>
          {isHusbandPays && (
            <div className="mt-6 inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-bold text-pink-400 border border-white/5 uppercase tracking-widest">
              Özel Seçim Paketi
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map(p => {
            const formattedProduct: Product = {
              listingID: p.listingID,
              title: p.title,
              price: p.price,
              originalPrice: p.originalPrice,
              primaryImage: p.images?.find((img: any) => img.isPrimary)?.imageUrl || p.images?.[0]?.imageUrl || '',
              brand: p.brand,
              seller: p.seller,
            };
            return (
              <div key={p.listingID} className="bg-white p-4 rounded-2xl shadow-sm flex gap-4 group">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0">
                  <img src={formattedProduct.primaryImage} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-neutral-800 line-clamp-1">{p.title}</h3>
                    <p className="text-xs text-neutral-400 mt-1">{p.seller?.userNickname} tarafından</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="font-bold text-pink-600">{p.price} TL</div>
                    <button 
                      onClick={() => addToCart(formattedProduct)}
                      className="text-xs bg-neutral-900 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-pink-600 transition"
                    >
                      Ekle
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-white p-8 rounded-3xl shadow-xl border border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-1">Toplam Tutar</p>
            <p className="text-4xl font-black text-neutral-900">
              {products.reduce((acc, p) => acc + (parseFloat(p.price) || 0), 0)} TL
            </p>
          </div>
          <button 
            onClick={() => {
              products.forEach(p => {
                const formattedProduct: Product = {
                  listingID: p.listingID,
                  title: p.title,
                  price: p.price,
                  originalPrice: p.originalPrice,
                  primaryImage: p.images?.find((img: any) => img.isPrimary)?.imageUrl || p.images?.[0]?.imageUrl || '',
                  brand: p.brand,
                  seller: p.seller,
                };
                addToCart(formattedProduct);
              });
              window.location.href = '/cart';
            }}
            className="w-full sm:w-auto bg-pink-600 text-white font-bold px-12 py-5 rounded-2xl shadow-xl shadow-pink-100 hover:bg-blue-600 hover:shadow-blue-100 transition duration-300 text-xl"
          >
            Hepsini Sepete Ekle & Öde
          </button>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen pt-32 pb-24 bg-neutral-50 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-neutral-500 hover:text-pink-500 font-bold mb-8 transition group">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:-translate-x-1 transition"><path d="m15 18-6-6 6-6"/></svg>
          Anasayfaya Dön
        </Link>

        {data.type === 'product' && data.product && renderProduct(data.product)}
        {data.type === 'cart' && data.products && renderCart(data.products)}
      </div>
    </main>
  );
}
