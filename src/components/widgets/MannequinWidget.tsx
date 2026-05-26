"use client";

import React, {useCallback, useState} from 'react';
import {useThemeLanguage} from '@/context/ThemeLanguageContext';
import {useCart} from '@/context/CartContext';
import {useToast} from '@/context/ToastContext';
import {ArrowLeft01Icon, ArrowRight01Icon, ShoppingBasketAdd01Icon} from 'hugeicons-react';

// ── Types ──
interface OutfitItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  type: 'top' | 'bottom' | 'shoes' | 'accessory';
}

interface OutfitSet {
  name: string;
  tagline: string;
  items: OutfitItem[];
}

// ── Data ──
const BABY_OUTFITS: Record<number, OutfitSet[]> = {
  100: [{
    name: 'Sevimli Günlük', tagline: '100 TL ile gün boyu rahatlık',
    items: [
      { id: 'b1-1', name: 'Ayıcıklı Sweat', price: 35, originalPrice: 120, image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=200&h=200&fit=crop', type: 'top' },
      { id: 'b1-2', name: 'Örme Eşofman Altı', price: 40, originalPrice: 150, image: 'https://images.unsplash.com/photo-1604006852748-903fccbc4019?w=200&h=200&fit=crop', type: 'bottom' },
      { id: 'b1-3', name: 'Cırt Cırtlı Sneaker', price: 15, originalPrice: 60, image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200&h=200&fit=crop', type: 'shoes' },
      { id: 'b1-4', name: 'Sırt Çantası', price: 10, originalPrice: 40, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200&h=200&fit=crop', type: 'accessory' },
    ],
  }],
  200: [{
    name: 'Tilki Temalı Set', tagline: '200 TL ile doğadan ilham alan stil',
    items: [
      { id: 'b2-1', name: 'Tilki İşlemeli Kazak', price: 65, originalPrice: 250, image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=200&h=200&fit=crop', type: 'top' },
      { id: 'b2-2', name: 'Yeşil Pantolon', price: 75, originalPrice: 280, image: 'https://images.unsplash.com/photo-1604006852748-903fccbc4019?w=200&h=200&fit=crop', type: 'bottom' },
      { id: 'b2-3', name: 'Kışlık Bot', price: 40, originalPrice: 150, image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200&h=200&fit=crop', type: 'shoes' },
      { id: 'b2-4', name: 'Bere', price: 20, originalPrice: 80, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200&h=200&fit=crop', type: 'accessory' },
    ],
  }],
  500: [{
    name: 'Klasik Tarz', tagline: '500 TL ile zamansız şıklık',
    items: [
      { id: 'b5-1', name: 'Gri Triko', price: 180, originalPrice: 650, image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=200&h=200&fit=crop', type: 'top' },
      { id: 'b5-2', name: 'Keten Pantolon', price: 150, originalPrice: 550, image: 'https://images.unsplash.com/photo-1604006852748-903fccbc4019?w=200&h=200&fit=crop', type: 'bottom' },
      { id: 'b5-3', name: 'Deri Slip-on', price: 110, originalPrice: 450, image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200&h=200&fit=crop', type: 'shoes' },
      { id: 'b5-4', name: 'Kasket', price: 60, originalPrice: 250, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200&h=200&fit=crop', type: 'accessory' },
    ],
  }],
  1000: [{
    name: 'Sokak Modası', tagline: '1000 TL ile Hypebeast stili',
    items: [
      { id: 'b1k-1', name: 'Tasarımcı Hoodie', price: 350, originalPrice: 1500, image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=200&h=200&fit=crop', type: 'top' },
      { id: 'b1k-2', name: 'Premium Eşofman Altı', price: 300, originalPrice: 1200, image: 'https://images.unsplash.com/photo-1604006852748-903fccbc4019?w=200&h=200&fit=crop', type: 'bottom' },
      { id: 'b1k-3', name: 'Trend Sneaker', price: 250, originalPrice: 950, image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200&h=200&fit=crop', type: 'shoes' },
      { id: 'b1k-4', name: 'Çapraz Çanta & Bere', price: 100, originalPrice: 400, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200&h=200&fit=crop', type: 'accessory' },
    ],
  }],
};

const CHILD_OUTFITS: Record<number, OutfitSet[]> = {
  100: [{
    name: 'Prenses Stili', tagline: '100 TL ile rüya gibi bir elbise',
    items: [
      { id: 'c1-1', name: 'Tüllü Elbise', price: 60, originalPrice: 200, image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=200&h=200&fit=crop', type: 'top' },
      { id: 'c1-2', name: 'İnce Külotlu Çorap', price: 15, originalPrice: 50, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop', type: 'bottom' },
      { id: 'c1-3', name: 'Beyaz Sneaker', price: 20, originalPrice: 120, image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=200&h=200&fit=crop', type: 'shoes' },
      { id: 'c1-4', name: 'Saç Tokası Seti', price: 5, originalPrice: 20, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200&h=200&fit=crop', type: 'accessory' },
    ],
  }],
  200: [{
    name: 'Sevimli Tilki', tagline: '200 TL ile detaylarda şıklık',
    items: [
      { id: 'c2-1', name: 'İşlemeli Bluz', price: 70, originalPrice: 280, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&h=200&fit=crop', type: 'top' },
      { id: 'c2-2', name: 'Pembe Jogger', price: 60, originalPrice: 250, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop', type: 'bottom' },
      { id: 'c2-3', name: 'Cırtlı Kışlık Bot', price: 50, originalPrice: 220, image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=200&h=200&fit=crop', type: 'shoes' },
      { id: 'c2-4', name: 'Peluş Oyuncak/Aksesuar', price: 20, originalPrice: 100, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200&h=200&fit=crop', type: 'accessory' },
    ],
  }],
  500: [{
    name: 'Zarif Sonbahar', tagline: '500 TL ile şık elbise kombini',
    items: [
      { id: 'c5-1', name: 'Örme Kazak Elbise', price: 250, originalPrice: 850, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&h=200&fit=crop', type: 'top' },
      { id: 'c5-2', name: 'Dantelli Külotlu Çorap', price: 50, originalPrice: 150, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop', type: 'bottom' },
      { id: 'c5-3', name: 'Yüksek Sneaker', price: 130, originalPrice: 480, image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=200&h=200&fit=crop', type: 'shoes' },
      { id: 'c5-4', name: 'Mini Çanta', price: 70, originalPrice: 250, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200&h=200&fit=crop', type: 'accessory' },
    ],
  }],
  1000: [{
    name: 'Hype Görünüm', tagline: '1000 TL ile trendlerin öncüsü',
    items: [
      { id: 'c1k-1', name: 'Markalı Hoodie', price: 380, originalPrice: 1600, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&h=200&fit=crop', type: 'top' },
      { id: 'c1k-2', name: 'Siyah Eşofman Altı', price: 250, originalPrice: 1100, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop', type: 'bottom' },
      { id: 'c1k-3', name: 'Lüks Deri Çizme', price: 270, originalPrice: 1250, image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=200&h=200&fit=crop', type: 'shoes' },
      { id: 'c1k-4', name: 'Tasarım Güneş Gözlüğü', price: 100, originalPrice: 550, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200&h=200&fit=crop', type: 'accessory' },
    ],
  }],
};

// Mannequin background images mapped to prices
const MANNEQUIN_IMAGES: Record<number, string> = {
  100: '/mannequins/m1.png',
  200: '/mannequins/m2.png',
  500: '/mannequins/m4.png',
  1000: '/mannequins/m3.png',
};

export default function MannequinWidget() {
  const { t } = useThemeLanguage();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  
  const [activeType, setActiveType] = useState<'baby' | 'child'>('baby');
  const [selectedPrice, setSelectedPrice] = useState<number>(100);
  const [currentOutfit, setCurrentOutfit] = useState<OutfitSet>(BABY_OUTFITS[100][0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(0);

  const PRICES = [100, 200, 500, 1000];

  const selectPrice = useCallback((price: number, type: 'baby' | 'child' = activeType) => {
    setIsAnimating(true);
    setSelectedPrice(price);
    
    setTimeout(() => {
      const outfits = type === 'baby' ? BABY_OUTFITS[price] : CHILD_OUTFITS[price];
      const randomIndex = Math.floor(Math.random() * outfits.length);
      setCurrentOutfit(outfits[randomIndex]);
      setIsAnimating(false);
    }, 400);
  }, [activeType]);

  const switchType = (type: 'baby' | 'child') => {
    if (type === activeType) return;
    setActiveType(type);
    selectPrice(selectedPrice, type);
  };

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      const newType = diff > 0 ? 'child' : 'baby';
      switchType(newType);
    }
  };

  const handleAddAllToCart = () => {
    currentOutfit.items.forEach(item => {
      addToCart({
        listingID: item.id,
        title: item.name,
        price: item.price,
        originalPrice: item.originalPrice,
        primaryImage: item.image,
        brand: { name: 'Salutbabe' },
      });
    });
    showToast('Tüm kombin sepete eklendi!', 'success');
  };

  const totalPrice = currentOutfit.items.reduce((sum, item) => sum + item.price, 0);
  const totalOriginal = currentOutfit.items.reduce((sum, item) => sum + item.originalPrice, 0);
  const savingsPercent = Math.round((1 - totalPrice / totalOriginal) * 100);

  return (
    <div style={{ margin: '40px 16px', position: 'relative' }}>
      <style>{`
        @keyframes imageFade { from { opacity: 0.6; filter: blur(10px); } to { opacity: 1; filter: blur(0); } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{
        background: '#FFF',
        borderRadius: '28px',
        overflow: 'hidden',
        boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
        border: '1px solid #F0ECE8',
      }}>
        
        {/* ── Mannequin Image Display Area ── */}
        <div 
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{ 
            height: '400px', 
            position: 'relative', 
            background: '#F5F3F0',
            overflow: 'hidden'
          }}
        >
          {/* Swiping Indicator */}
          <div style={{
            position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)',
            padding: '6px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)', zIndex: 10
          }}>
            <button onClick={() => switchType('baby')} style={{ background: 'none', border: 'none', color: activeType === 'baby' ? '#14342B' : '#CCC', fontWeight: activeType === 'baby' ? 800 : 500, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
               Bebek
            </button>
            <div style={{ display: 'flex', color: '#CCC' }}>
              <ArrowLeft01Icon size={12} />
              <ArrowRight01Icon size={12} />
            </div>
            <button onClick={() => switchType('child')} style={{ background: 'none', border: 'none', color: activeType === 'child' ? '#14342B' : '#CCC', fontWeight: activeType === 'child' ? 800 : 500, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
               Çocuk
            </button>
          </div>

          {/* Realistic Mannequin Photo */}
          <img 
            key={MANNEQUIN_IMAGES[selectedPrice]}
            src={MANNEQUIN_IMAGES[selectedPrice]} 
            alt="Styled Mannequin" 
            style={{
              width: '100%', height: '100%', 
              objectFit: 'cover',
              /* Crucial trick: Pan left for baby, right for child */
              objectPosition: activeType === 'baby' ? 'left center' : 'right center',
              transition: 'object-position 0.6s cubic-bezier(0.25, 1, 0.5, 1), filter 0.4s',
              animation: 'imageFade 0.6s ease-out forwards',
              filter: isAnimating ? 'blur(8px) brightness(0.9)' : 'blur(0) brightness(1)',
            }}
          />

          {/* Gradient Overlay for text readability at bottom */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '160px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)',
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '24px',
          }}>
            <h2 style={{ color: '#FFF', fontSize: '24px', fontWeight: 900, margin: '0 0 4px', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
              {currentOutfit.name}
            </h2>
            <p style={{ color: '#E0E0E0', fontSize: '14px', margin: 0, fontWeight: 500, textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
              {currentOutfit.tagline}
            </p>
          </div>
        </div>

        {/* ── Budgets & Interaction ── */}
        <div style={{ padding: '20px 16px', background: '#FFF' }}>
          
          {/* Prices */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '24px' }}>
            {PRICES.map(price => (
              <button
                key={price}
                onClick={() => selectPrice(price)}
                style={{
                  flex: 1, padding: '12px 4px', borderRadius: '16px',
                  border: '1px solid', borderColor: selectedPrice === price ? '#14342B' : '#E8E4E0',
                  background: selectedPrice === price ? '#14342B' : '#F8F6F3',
                  color: selectedPrice === price ? '#FFF' : '#333',
                  fontWeight: 800, fontSize: '14px',
                  transition: 'all 0.2s',
                  boxShadow: selectedPrice === price ? '0 4px 12px rgba(20,52,43,0.2)' : 'none',
                }}
              >
                {price} ₺
              </button>
            ))}
          </div>

          {/* Product Cards Grid */}
          <div style={{
             animation: isAnimating ? 'none' : 'slideInUp 0.4s ease-out',
             opacity: isAnimating ? 0 : 1, transition: 'opacity 0.3s'
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 12px', color: '#111' }}>
              Kombindeki Ürünler
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
              {currentOutfit.items.map((item, index) => (
                <div key={item.id} style={{
                  display: 'flex', alignItems: 'center', gap: '10px', background: '#FFF',
                  border: '1px solid #F0ECE8', borderRadius: '12px', padding: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                }}>
                  <img src={item.image} alt={item.name} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div>
                    <p style={{ fontSize: '11px', fontWeight: 700, margin: '0 0 2px', color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80px' }}>
                      {item.name}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 900, color: '#14342B' }}>{item.price}₺</span>
                      <span style={{ fontSize: '10px', color: '#999', textDecoration: 'line-through' }}>{item.originalPrice}₺</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Savings & Add to Cart */}
            <div style={{ background: '#F8F6F3', borderRadius: '20px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '11px', color: '#666', margin: '0 0 2px' }}>Piyasa Değeri</p>
                  <p style={{ fontSize: '15px', fontWeight: 600, textDecoration: 'line-through', color: '#999', margin: 0 }}>{totalOriginal} ₺</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '11px', color: '#14342B', fontWeight: 800, margin: '0 0 2px' }}>Salutbabe Fiyatı</p>
                  <p style={{ fontSize: '24px', fontWeight: 900, color: '#14342B', margin: 0 }}>{totalPrice} ₺</p>
                </div>
              </div>
              
              <button
                onClick={handleAddAllToCart}
                style={{
                  width: '100%', padding: '14px', borderRadius: '14px', border: 'none',
                  background: '#C9A96E', color: '#14342B', fontWeight: 900, fontSize: '15px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 12px rgba(201,169,110,0.3)',
                }}
              >
                <ShoppingBasketAdd01Icon size={20} />
                Tüm Kombini Sepete Ekle
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
