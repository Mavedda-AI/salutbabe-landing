import React from 'react';
import {Button} from '../ui/Button';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-40 pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-10 z-10">
          <div className="inline-flex items-center space-x-3 bg-secondary/10 px-4 py-2 rounded-full border border-secondary/20">
            <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
            <span className="text-sm font-bold text-secondary uppercase tracking-widest">Türkiye'nin İlk Anne-Bebek Pazaryeri</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black text-primary leading-[1.1] text-balance">
            Bebeğiniz İçin En İyisi, <br />
            <span className="text-secondary underline decoration-8 decoration-secondary/20 underline-offset-8">Sizin İçin En Kolayı.</span>
          </h1>
          
          <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-lg">
            Saniyeler içinde ürün listeleyin, güvenle satın alın veya kiralayın. 
            48 binden fazla anne Salutbabe ile daha akıllı alışveriş yapıyor.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button size="lg">Şimdi Keşfet</Button>
            <Button variant="outline" size="lg">Nasıl Çalışır?</Button>
          </div>
          
          <div className="flex items-center space-x-8 pt-4">
            <div className="flex -space-x-3">
              {[1,2,3,4].map((i) => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-brand-bg bg-gray-200 overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?u=${i}`} alt="User" />
                </div>
              ))}
            </div>
            <div>
              <p className="text-lg font-black text-primary">120K+ Ürün</p>
              <p className="text-sm text-gray-400 font-medium">Mutlu anneler topluluğu</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px]" />
          <div className="absolute top-40 -left-20 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px]" />
          
          <div className="relative glass-card p-4 rounded-[40px] animate-float">
            <img 
              src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800" 
              alt="Baby Product"
              className="rounded-[32px] w-full h-[500px] object-cover shadow-2xl"
            />
            
            <div className="absolute -bottom-10 -right-10 bg-white p-6 rounded-3xl shadow-2xl space-y-2 border border-primary/5">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-tighter">Popüler Kategori</p>
              <p className="text-2xl font-black text-primary">Pusetler</p>
              <div className="flex items-center space-x-1 text-yellow-400">
                {[1,2,3,4,5].map(i => <span key={i}>★</span>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
