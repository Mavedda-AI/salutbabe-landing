'use client';

import React, {useEffect, useState} from 'react';
import {useParams} from 'next/navigation';
import {useCart} from '../../../context/CartContext';
import Image from 'next/image';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated fetch for demo
    const mockProduct = {
      id: id,
      title: "Eco-Friendly Premium Stroller",
      price: 12499,
      description: "Designed for the modern parent, this stroller combines safety with high-end aesthetics. Crafted from sustainable materials and featuring rose gold accents.",
      primaryImage: "/images/stroller.png",
      category: { name: "Travel" },
      brand: { name: "SalutBabe Elite" },
      seller: { userNickname: "PremiumSeller" }
    };
    
    const timer = setTimeout(() => {
      setProduct(mockProduct);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-primary-blue rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <main className="min-h-screen pt-12 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: Images */}
          <div className="animate-fade-in-up">
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-slate-50 border border-slate-100 relative group">
              <Image 
                src={product.primaryImage} 
                alt={product.title}
                fill
                className="object-contain p-12 transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute top-8 left-8">
                <span className="glass-pill px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {product.category?.name}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Info */}
          <div className="lg:sticky lg:top-32 space-y-12 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div>
              <div className="text-[10px] font-black text-primary-pink uppercase tracking-[0.4em] mb-4">
                {product.brand?.name}
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tight">
                {product.title}
              </h1>
              
              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-4xl font-black text-slate-900">
                  ₺{product.price.toLocaleString('tr-TR')}
                </span>
              </div>

              <p className="text-lg text-slate-500 leading-relaxed max-w-xl">
                {product.description}
              </p>
            </div>

            <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 space-y-8">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-lg font-black text-primary-blue border border-slate-100">
                    {product.seller?.userNickname?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">VERIFIED SELLER</div>
                    <div className="font-black text-slate-900">{product.seller?.userNickname}</div>
                  </div>
               </div>

               <div className="flex gap-4">
                  <button 
                    onClick={() => addToCart(product)}
                    className="flex-[2] py-5 bg-slate-900 text-white rounded-full font-black text-sm hover:bg-slate-800 hover:shadow-2xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-3"
                  >
                    ADD TO CART
                  </button>
                  <button className="w-16 h-16 border-2 border-slate-200 rounded-full flex items-center justify-center hover:bg-white hover:text-primary-pink hover:border-primary-pink transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               {[
                 { label: 'DELIVERY', value: '2-3 Business Days', icon: '🚚' },
                 { label: 'AUTHENTICITY', value: 'Verified Product', icon: '🛡️' }
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-4 p-6 rounded-[2rem] bg-white border border-slate-50 shadow-sm">
                   <div className="text-2xl">{item.icon}</div>
                   <div>
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.label}</div>
                      <div className="text-xs font-black text-slate-900">{item.value}</div>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetailPage;
