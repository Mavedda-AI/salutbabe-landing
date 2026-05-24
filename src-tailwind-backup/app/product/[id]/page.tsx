'use client';

import React, {useEffect, useState} from 'react';
import {useParams} from 'next/navigation';
import {Product, useCart} from '../../../context/CartContext';
import Link from 'next/link';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://api.salutbabe.com/v1/listings/get-product-details/${id}`, {
          headers: {
            'X-Device-Type': 'web',
            'Accept': 'application/json',
            'X-Accept-Language': 'tr'
          }
        });

        if (!response.ok) throw new Error('Ürün bulunamadı.');

        const data = await response.json();
        setProduct(data.payload.product || data.payload);
      } catch (err) {
        setError('Ürün bilgileri yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-neutral-100 border-t-primary-blue rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center px-6 text-center">
        <h2 className="text-3xl font-black text-neutral-900 mb-4 tracking-tighter italic uppercase">Eyvah!</h2>
        <p className="text-neutral-500 mb-8">{error || 'Ürün bulunamadı.'}</p>
        <Link href="/" className="px-8 py-3 bg-neutral-900 text-white rounded-full font-bold hover:bg-primary-blue transition-all">
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: Images */}
          <div className="space-y-6">
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-neutral-50 shadow-2xl relative group">
              <img 
                src={product.primaryImage} 
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute top-8 left-8">
                <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ring-1 ring-black/5">
                  {product.category?.name || 'Koleksiyon'}
                </span>
              </div>
            </div>
            
            {/* Additional images placeholder or gallery could go here */}
          </div>

          {/* Right: Info */}
          <div className="lg:sticky lg:top-32 space-y-10 animate-fade-in-up">
            <div>
              <div className="text-xs font-black text-primary-pink uppercase tracking-[0.3em] mb-4 opacity-70">
                {product.brand?.name || 'Özel Seri'}
              </div>
              <h1 className="text-5xl font-extrabold text-neutral-900 leading-[1.1] tracking-tighter mb-6">
                {product.title}
              </h1>
              
              <div className="flex items-end gap-4 mb-8">
                <span className="text-4xl font-black text-neutral-900">
                  {product.price.toLocaleString('tr-TR')} ₺
                </span>
                {product.originalPrice && (
                  <span className="text-xl font-bold text-neutral-300 line-through mb-1">
                    {product.originalPrice.toLocaleString('tr-TR')} ₺
                  </span>
                )}
              </div>

              <p className="text-lg text-neutral-500 leading-relaxed max-w-xl">
                 Bu özenle seçilmiş ürün, bebeğinizin konforu ve şıklığı için tasarlandı. 
                 Sürdürülebilir moda anlayışımızla hem doğayı hem de bütçenizi koruyoruz.
              </p>
            </div>

            <div className="p-8 bg-neutral-50 rounded-[2.5rem] border border-neutral-100/50 space-y-6">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-lg font-black text-primary-blue ring-1 ring-black/5">
                    {product.seller?.userNickname?.charAt(0).toUpperCase() || 'S'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-0.5">SATICI</div>
                    <div className="font-bold text-neutral-900">{product.seller?.userNickname || 'Güvenilir Satıcı'}</div>
                  </div>
               </div>

               <div className="flex gap-4">
                  <button 
                    onClick={() => addToCart(product)}
                    className="flex-[2] py-5 bg-neutral-900 text-white rounded-[1.5rem] font-black text-lg hover:bg-primary-blue hover:shadow-[0_20px_40px_rgba(37,99,235,0.2)] transition-all active:scale-95 flex items-center justify-center gap-3"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                    Sepete Ekle
                  </button>
                  <button className="flex-1 py-5 border-2 border-neutral-200 rounded-[1.5rem] font-bold text-neutral-400 hover:bg-white hover:text-primary-pink hover:border-primary-pink transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 rounded-3xl bg-white border border-neutral-100">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-primary-blue">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
                </div>
                <div>
                   <div className="text-xs font-bold text-neutral-400 uppercase tracking-tighter">TEMİZLİK</div>
                   <div className="text-sm font-bold text-neutral-800">Sterilize Edildi</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-3xl bg-white border border-neutral-100">
                <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                </div>
                <div>
                   <div className="text-xs font-bold text-neutral-400 uppercase tracking-tighter">İADE</div>
                   <div className="text-sm font-bold text-neutral-800">Güvenli Ödeme</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
