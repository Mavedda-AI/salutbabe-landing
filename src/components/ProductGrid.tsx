'use client';

import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import {Product, useCart} from '../context/CartContext';

const ProductGrid = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const fetchProducts = async (pageNum: number, isInitial: boolean = false) => {
    if (isInitial) {
      setLoading(true);
      setError(null);
    } else {
      setIsFetchingMore(true);
    }
    
    try {
      // Small delay to feel the "premium" transition
      if (isInitial) await new Promise(r => setTimeout(r, 800));

      const response = await fetch(`https://api.salutbabe.com/v1/listings/get-all-products?limit=20&page=${pageNum}`, {
        headers: {
          'X-Device-Type': 'web',
          'Accept': 'application/json',
          'X-Accept-Language': 'tr'
        }
      });

      if (!response.ok) {
        throw new Error('Ürünler şu an yüklenemiyor. Sunucuyla bağlantı kurulamadı.');
      }

      const data = await response.json();
      const newProducts = data.payload.products || [];
      
      if (newProducts.length < 20) {
        setHasMore(false);
      }
      
      if (isInitial) {
        setProducts(newProducts);
      } else {
        setProducts(prev => [...prev, ...newProducts]);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      if (isInitial) {
        setError('Ürünler yüklenirken bir sorun oluştu. Lütfen bağlantınızı kontrol edip tekrar deneyin.');
      }
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    fetchProducts(1, true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 400 >= 
        document.documentElement.offsetHeight
      ) {
        if (!loading && !isFetchingMore && hasMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchProducts(nextPage);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, isFetchingMore, hasMore, page]);

  const ProductSkeleton = () => (
    <div className="space-y-4 animate-pulse">
      <div className="aspect-[4/5] bg-neutral-100 rounded-3xl"></div>
      <div className="h-4 bg-neutral-100 rounded-full w-2/3"></div>
      <div className="h-6 bg-neutral-100 rounded-full w-1/2"></div>
    </div>
  );

  if (loading && page === 1) {
    return (
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <div className="h-10 bg-neutral-50 rounded-full w-48 mb-4"></div>
            <div className="h-6 bg-neutral-50 rounded-full w-96"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-red-50 rounded-[2.5rem] p-12 text-center border border-red-100">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">Eyvah, bir sorun var!</h3>
            <p className="text-neutral-600 mb-8 max-w-md mx-auto">{error}</p>
            <button 
              onClick={() => fetchProducts(1, true)}
              className="px-8 py-3 bg-neutral-900 text-white font-bold rounded-full hover:bg-primary-blue transition-all duration-300"
            >
              Tekrar Deneyin
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="animate-fade-in-up">
            <h2 className="text-4xl font-extrabold text-neutral-900 mb-4 tracking-tight">Ebeveynlerin Favorileri</h2>
            <p className="text-lg text-neutral-500 max-w-xl">En çok beğenilen ve özenle seçilmiş bebek ürünlerini keşfedin.</p>
          </div>
          <div className="flex gap-2">
             <button className="px-6 py-2.5 rounded-full border border-neutral-100 font-bold text-sm hover:bg-neutral-50 transition-all">En Yeniler</button>
             <button className="px-6 py-2.5 rounded-full bg-neutral-900 text-white font-bold text-sm hover:shadow-xl transition-all">Hepsini Gör</button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
          {products.map((product, idx) => (
            <div key={product.listingID} className="group animate-fade-in-up" style={{ animationDelay: `${idx * 0.05}s` }}>
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-neutral-50 mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-700">
                {product.primaryImage ? (
                  <img
                    src={product.primaryImage}
                    alt={product.title}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-1000"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-200">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                
                {/* Overlay Controls */}
                <div className="absolute inset-0 bg-neutral-900/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-5 translate-y-4 group-hover:translate-y-0">
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full bg-white text-neutral-900 font-bold py-3.5 rounded-2xl shadow-xl hover:bg-primary-blue hover:text-white transition-all duration-300 active:scale-95 mb-2"
                  >
                    Sepete Ekle
                  </button>
                  <Link 
                    href={`/product/${product.listingID}`}
                    className="w-full bg-white/20 backdrop-blur-md text-white border border-white/20 font-bold py-3.5 rounded-2xl hover:bg-white/30 transition-all duration-300 text-center"
                  >
                    Detaylar
                  </Link>
                </div>

                {product.originalPrice && (
                  <span className="absolute top-5 left-5 bg-white/90 backdrop-blur-md text-primary-pink text-[11px] font-black px-3 py-1.5 rounded-full shadow-sm uppercase tracking-tighter ring-1 ring-black/5">
                    %-{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)} İNDİRİM
                  </span>
                )}
              </div>
              
              <div className="px-1 space-y-2">
                <div className="flex justify-between items-start gap-2">
                   <div className="text-[11px] font-black text-primary-blue uppercase tracking-widest opacity-60">
                     {product.brand?.name || 'GENEL'}
                   </div>
                   <div className="text-[11px] font-black text-neutral-400 bg-neutral-50 px-2 py-0.5 rounded-md">
                     {product.category?.name || 'Bebek'}
                   </div>
                </div>
                
                <h3 className="font-bold text-neutral-800 text-lg line-clamp-1 group-hover:text-primary-blue transition-colors duration-300">
                  {product.title}
                </h3>
                
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-neutral-900">{product.price.toLocaleString('tr-TR')} ₺</span>
                  {product.originalPrice && (
                    <span className="text-sm font-medium text-neutral-400 line-through opacity-50">{product.originalPrice.toLocaleString('tr-TR')} ₺</span>
                  )}
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-neutral-100 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-linear-to-tr from-blue-100 to-pink-100 flex items-center justify-center text-[10px] font-black text-neutral-600">
                      {product.seller?.userNickname?.charAt(0).toUpperCase() || 'S'}
                    </div>
                    <span className="text-xs font-bold text-neutral-500">{product.seller?.userNickname || 'Güvenli Satıcı'}</span>
                  </div>
                  <div className="flex gap-1">
                     <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                     <div className="w-1.5 h-1.5 rounded-full bg-green-500 opacity-40"></div>
                     <div className="w-1.5 h-1.5 rounded-full bg-green-500 opacity-20"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isFetchingMore && (
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        )}
        
        {!hasMore && products.length > 0 && (
          <div className="mt-32 text-center">
            <div className="inline-block px-12 py-4 bg-neutral-50 text-neutral-400 rounded-full font-black text-sm uppercase tracking-widest border border-neutral-100">
              Maceranın Sonu • Tüm Ürünleri Gördünüz
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
