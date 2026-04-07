'use client';

import React, {useEffect, useState} from 'react';
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
    } else {
      setIsFetchingMore(true);
    }
    
    try {
      const response = await fetch(`https://api.salutbabe.com/v1/listings/get-all-products?limit=20&page=${pageNum}`, {
        headers: {
          'X-Device-Type': 'web'
        }
      });
      if (!response.ok) {
        throw new Error('Ürünler yüklenirken bir hata oluştu');
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
      console.error(err);
      if (isInitial) {
        setError('Ürünler şu an yüklenemiyor, lütfen daha sonra tekrar deneyiniz.');
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
      // Near bottom (400px)
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

  if (loading && page === 1) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-neutral-500">Ürünler Yükleniyor...</p>
        </div>
      </section>
    );
  }

  if (error || (products.length === 0 && !loading)) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-neutral-500">{error || 'Henüz ürün bulunmamaktadır.'}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white pb-32">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-neutral-800 mb-2">Öne Çıkan Ürünler</h2>
            <p className="text-neutral-600">En son eklenen ve anneler tarafından beğenilen bebek kıyafetleri.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.listingID} className="group relative">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-100 mb-4 shadow-sm group-hover:shadow-md transition">
                {product.primaryImage ? (
                  <img
                    src={product.primaryImage}
                    alt={product.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full bg-white text-neutral-900 font-bold py-2.5 rounded-xl shadow-lg transform translate-y-2 group-hover:translate-y-0 transition duration-300 hover:bg-pink-600 hover:text-white"
                  >
                    Sepete Ekle
                  </button>
                </div>
                {product.originalPrice && (
                  <span className="absolute top-4 left-4 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    İndirim
                  </span>
                )}
              </div>
              
              <div className="space-y-1">
                <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                  {product.brand?.name || 'Markasız'}
                </div>
                <h3 className="font-bold text-neutral-800 text-lg line-clamp-1">{product.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-neutral-900">{product.price} TL</span>
                  {product.originalPrice && (
                    <span className="text-sm text-neutral-400 line-through">{product.originalPrice} TL</span>
                  )}
                </div>
                <div className="pt-2 flex items-center text-sm text-neutral-500">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] mr-1.5 font-bold">
                    {product.seller?.userNickname?.charAt(0).toUpperCase() || 'S'}
                  </span>
                  {product.seller?.userNickname || 'Satıcı'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {isFetchingMore && (
          <div className="mt-16 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-pink-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-neutral-500 font-medium">Yeni ürünler yükleniyor...</p>
          </div>
        )}
        
        {!hasMore && products.length > 0 && (
          <div className="mt-16 text-center text-neutral-400 font-medium italic">
            Daha fazla ürün bulunamadı.
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
