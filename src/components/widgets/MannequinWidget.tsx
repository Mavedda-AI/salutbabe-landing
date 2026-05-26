"use client";

import React, {useCallback, useState} from 'react';
import {useThemeLanguage} from '@/context/ThemeLanguageContext';
import {useCart} from '@/context/CartContext';
import {useToast} from '@/context/ToastContext';
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  BabyBed01Icon,
  Backpack01Icon,
  ShoppingBasketAdd01Icon,
  ShuffleIcon,
  SparklesIcon
} from 'hugeicons-react';

// ── Product type ──
interface OutfitItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  type: 'top' | 'bottom' | 'shoes' | 'accessory';
  color: string;
}

interface OutfitSet {
  name: string;
  tagline: string;
  items: OutfitItem[];
}

// ── Real product-like outfit sets ──
const BABY_OUTFITS: Record<number, OutfitSet[]> = {
  100: [
    {
      name: 'Günlük Rahatlık',
      tagline: 'Yumuşacık kumaşlarla rahat bir gün',
      items: [
        { id: 'b100-1', name: 'Organik Pamuk Body', price: 25, originalPrice: 89, image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=300&h=300&fit=crop', type: 'top', color: '#F8D7DA' },
        { id: 'b100-2', name: 'Yumuşak Örme Pantolon', price: 30, originalPrice: 79, image: 'https://images.unsplash.com/photo-1604006852748-903fccbc4019?w=300&h=300&fit=crop', type: 'bottom', color: '#D4EDDA' },
        { id: 'b100-3', name: 'Triko Patik', price: 20, originalPrice: 59, image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&h=300&fit=crop', type: 'shoes', color: '#CCE5FF' },
        { id: 'b100-4', name: 'Şirin Bere', price: 15, originalPrice: 45, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=300&fit=crop', type: 'accessory', color: '#FFF3CD' },
      ],
    },
    {
      name: 'Parktaki Prens/Prenses',
      tagline: 'Dışarıda oynamak için ideal',
      items: [
        { id: 'b100-5', name: 'Çizgili Tişört', price: 20, originalPrice: 69, image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=300&h=300&fit=crop', type: 'top', color: '#E2E3F1' },
        { id: 'b100-6', name: 'Eşofman Altı', price: 30, originalPrice: 85, image: 'https://images.unsplash.com/photo-1604006852748-903fccbc4019?w=300&h=300&fit=crop', type: 'bottom', color: '#D6E9F8' },
        { id: 'b100-7', name: 'Bez Ayakkabı', price: 25, originalPrice: 65, image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&h=300&fit=crop', type: 'shoes', color: '#F8D7DA' },
        { id: 'b100-8', name: 'Güneş Şapkası', price: 15, originalPrice: 49, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=300&fit=crop', type: 'accessory', color: '#D4EDDA' },
      ],
    },
  ],
  200: [
    {
      name: 'Şık Davet Kombini',
      tagline: 'Özel günler için harika bir seçim',
      items: [
        { id: 'b200-1', name: 'Fiyonklu Gömlek', price: 45, originalPrice: 149, image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=300&h=300&fit=crop', type: 'top', color: '#E8F4FD' },
        { id: 'b200-2', name: 'Kadife Pantolon', price: 55, originalPrice: 129, image: 'https://images.unsplash.com/photo-1604006852748-903fccbc4019?w=300&h=300&fit=crop', type: 'bottom', color: '#FDE8E8' },
        { id: 'b200-3', name: 'Deri Görünüm Patik', price: 50, originalPrice: 119, image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&h=300&fit=crop', type: 'shoes', color: '#E8E8FD' },
        { id: 'b200-4', name: 'Bandana Set', price: 35, originalPrice: 89, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=300&fit=crop', type: 'accessory', color: '#FDF8E8' },
      ],
    },
  ],
  500: [
    {
      name: 'Premium Kombin',
      tagline: 'Marka kalitesi, uygun fiyat',
      items: [
        { id: 'b500-1', name: 'Merino Yün Hırka', price: 120, originalPrice: 349, image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=300&h=300&fit=crop', type: 'top', color: '#F0E6FF' },
        { id: 'b500-2', name: 'Organik Jean', price: 140, originalPrice: 289, image: 'https://images.unsplash.com/photo-1604006852748-903fccbc4019?w=300&h=300&fit=crop', type: 'bottom', color: '#E6F0FF' },
        { id: 'b500-3', name: 'El Yapımı Bot', price: 130, originalPrice: 329, image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&h=300&fit=crop', type: 'shoes', color: '#FFE6F0' },
        { id: 'b500-4', name: 'Kaşmir Şal', price: 90, originalPrice: 249, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=300&fit=crop', type: 'accessory', color: '#E6FFE6' },
      ],
    },
  ],
  1000: [
    {
      name: 'Lüks Tasarım Seti',
      tagline: 'Tasarımcı markaları ikinci elde',
      items: [
        { id: 'b1k-1', name: 'Tasarımcı Mont', price: 280, originalPrice: 899, image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=300&h=300&fit=crop', type: 'top', color: '#FFF0E6' },
        { id: 'b1k-2', name: 'İtalyan Kumaş Pantolon', price: 250, originalPrice: 699, image: 'https://images.unsplash.com/photo-1604006852748-903fccbc4019?w=300&h=300&fit=crop', type: 'bottom', color: '#E6FFF0' },
        { id: 'b1k-3', name: 'Premium Deri Ayakkabı', price: 300, originalPrice: 799, image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&h=300&fit=crop', type: 'shoes', color: '#F0E6FF' },
        { id: 'b1k-4', name: 'Kaşmir Bere & Atkı', price: 150, originalPrice: 459, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=300&fit=crop', type: 'accessory', color: '#FFE6E6' },
      ],
    },
  ],
};

const CHILD_OUTFITS: Record<number, OutfitSet[]> = {
  100: [
    {
      name: 'Okul Sonrası Stili',
      tagline: 'Enerjik günler için rahat ve şık',
      items: [
        { id: 'c100-1', name: 'Baskılı Tişört', price: 25, originalPrice: 79, image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=300&h=300&fit=crop', type: 'top', color: '#D4EDDA' },
        { id: 'c100-2', name: 'Jogger Pantolon', price: 30, originalPrice: 99, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop', type: 'bottom', color: '#CCE5FF' },
        { id: 'c100-3', name: 'Kanvas Sneaker', price: 30, originalPrice: 89, image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=300&h=300&fit=crop', type: 'shoes', color: '#FFF3CD' },
        { id: 'c100-4', name: 'Spor Şapka', price: 10, originalPrice: 39, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=300&fit=crop', type: 'accessory', color: '#F8D7DA' },
      ],
    },
    {
      name: 'Hafta Sonu Macerası',
      tagline: 'Keşfetmeye hazır küçük kaşifler',
      items: [
        { id: 'c100-5', name: 'Kapüşonlu Sweat', price: 35, originalPrice: 119, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&h=300&fit=crop', type: 'top', color: '#E2E3F1' },
        { id: 'c100-6', name: 'Şort', price: 20, originalPrice: 69, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop', type: 'bottom', color: '#D6E9F8' },
        { id: 'c100-7', name: 'Sandalet', price: 25, originalPrice: 79, image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=300&h=300&fit=crop', type: 'shoes', color: '#F0E6FF' },
        { id: 'c100-8', name: 'Bandana', price: 10, originalPrice: 35, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=300&fit=crop', type: 'accessory', color: '#E6FFF0' },
      ],
    },
  ],
  200: [
    {
      name: 'Cool Kid Kombin',
      tagline: 'Trendleri takip eden minik modacılar',
      items: [
        { id: 'c200-1', name: 'Denim Ceket', price: 65, originalPrice: 199, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&h=300&fit=crop', type: 'top', color: '#CCE5FF' },
        { id: 'c200-2', name: 'Kargo Pantolon', price: 50, originalPrice: 149, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop', type: 'bottom', color: '#D4EDDA' },
        { id: 'c200-3', name: 'Retro Sneaker', price: 55, originalPrice: 169, image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=300&h=300&fit=crop', type: 'shoes', color: '#FFF3CD' },
        { id: 'c200-4', name: 'Sırt Çantası', price: 25, originalPrice: 89, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=300&fit=crop', type: 'accessory', color: '#FDE8E8' },
      ],
    },
  ],
  500: [
    {
      name: 'Mini Fashionista',
      tagline: 'Kaliteden ödün vermeden şıklık',
      items: [
        { id: 'c500-1', name: 'Yün Blazer', price: 150, originalPrice: 449, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&h=300&fit=crop', type: 'top', color: '#E8F4FD' },
        { id: 'c500-2', name: 'Slim Fit Chino', price: 120, originalPrice: 299, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop', type: 'bottom', color: '#F0E6FF' },
        { id: 'c500-3', name: 'Oxford Ayakkabı', price: 130, originalPrice: 379, image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=300&h=300&fit=crop', type: 'shoes', color: '#FFE6F0' },
        { id: 'c500-4', name: 'Papyon & Kemer Set', price: 80, originalPrice: 199, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=300&fit=crop', type: 'accessory', color: '#E6FFE6' },
      ],
    },
  ],
  1000: [
    {
      name: 'Haute Couture Mini',
      tagline: 'Lüks markalar, akıllı fiyatlar',
      items: [
        { id: 'c1k-1', name: 'Kaşe Palto', price: 320, originalPrice: 1199, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&h=300&fit=crop', type: 'top', color: '#FFF0E6' },
        { id: 'c1k-2', name: 'Marka Jean', price: 220, originalPrice: 699, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop', type: 'bottom', color: '#E6FFF0' },
        { id: 'c1k-3', name: 'İtalyan Çizme', price: 280, originalPrice: 899, image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=300&h=300&fit=crop', type: 'shoes', color: '#F0E6FF' },
        { id: 'c1k-4', name: 'Tasarım Atkı', price: 160, originalPrice: 499, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=300&fit=crop', type: 'accessory', color: '#FFE6E6' },
      ],
    },
  ],
};

const PRICE_MESSAGES: Record<number, { title: string; desc: string }> = {
  100: { title: '100 TL\'ye bu kombini alabilirsiniz!', desc: 'Evet, sadece yüz liraya baştan aşağı şık!' },
  200: { title: '200 TL ile özel gün hazırlığı!', desc: 'Davetlere hazır, bütçeye uygun.' },
  500: { title: '500 TL\'ye premium kalite!', desc: 'Marka ürünler, ikinci el avantajıyla.' },
  1000: { title: '1000 TL\'ye lüks markalar!', desc: 'Tasarımcı ürünleri uygun fiyatlarla keşfet.' },
};

export default function MannequinWidget() {
  const { t } = useThemeLanguage();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [activeType, setActiveType] = useState<'baby' | 'child'>('baby');
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [currentOutfit, setCurrentOutfit] = useState<OutfitSet | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(0);

  const PRICES = [100, 200, 500, 1000];

  const selectPrice = useCallback((price: number) => {
    setIsAnimating(true);
    setSelectedPrice(price);

    const outfits = activeType === 'baby' ? BABY_OUTFITS[price] : CHILD_OUTFITS[price];
    const randomIndex = Math.floor(Math.random() * outfits.length);
    
    setTimeout(() => {
      setCurrentOutfit(outfits[randomIndex]);
      setIsAnimating(false);
    }, 350);
  }, [activeType]);

  const shuffleOutfit = () => {
    if (!selectedPrice) return;
    selectPrice(selectedPrice);
  };

  const handleAddAllToCart = () => {
    if (!currentOutfit) return;
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
    showToast(t('home.added_to_cart') || 'Tüm kombin sepete eklendi!', 'success');
  };

  const totalPrice = currentOutfit?.items.reduce((sum, item) => sum + item.price, 0) || 0;
  const totalOriginal = currentOutfit?.items.reduce((sum, item) => sum + item.originalPrice, 0) || 0;
  const savingsPercent = totalOriginal > 0 ? Math.round((1 - totalPrice / totalOriginal) * 100) : 0;

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      const newType = diff > 0 ? 'child' : 'baby';
      setActiveType(newType);
      setCurrentOutfit(null);
      setSelectedPrice(null);
    }
  };

  const switchType = (type: 'baby' | 'child') => {
    setActiveType(type);
    setCurrentOutfit(null);
    setSelectedPrice(null);
  };

  return (
    <div style={{ padding: '0 16px', margin: '28px 0' }}>
      <style>{`
        @keyframes mannequinFadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes mannequinPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
        @keyframes mannequinShine { 0% { left: -100%; } 100% { left: 200%; } }
      `}</style>

      <div style={{
        background: '#FFF',
        borderRadius: '24px',
        border: '1px solid #F0ECE8',
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
      }}>
        {/* ── Header ── */}
        <div style={{
          background: 'linear-gradient(135deg, #14342B 0%, #1a5a45 50%, #14342B 100%)',
          padding: '24px 20px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Shine effect */}
          <div style={{
            position: 'absolute', top: 0, left: '-100%', width: '50%', height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
            animation: 'mannequinShine 4s infinite',
          }} />
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
            <SparklesIcon size={20} color="#C9A96E" />
            <span style={{ color: '#C9A96E', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>
              Salutbabe Özel
            </span>
            <SparklesIcon size={20} color="#C9A96E" />
          </div>
          
          <h2 style={{ color: '#FFF', fontSize: '22px', fontWeight: 900, margin: '0 0 6px', lineHeight: 1.3 }}>
            {activeType === 'baby' ? 'Bebeğinizi Şık Giydirin' : 'Çocuğunuzu Şık Giydirin'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', fontWeight: 500, margin: 0, lineHeight: 1.5 }}>
            İkinci el ürünlerle bütçenizi koruyun, stili yakalayın
          </p>
        </div>

        {/* ── Baby / Child Toggle ── */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{ display: 'flex', gap: '0', margin: '16px 16px 0', background: '#F5F3F0', borderRadius: '16px', padding: '4px', position: 'relative' }}
        >
          <button
            onClick={() => switchType('baby')}
            style={{
              flex: 1, padding: '12px 8px', borderRadius: '13px', border: 'none', cursor: 'pointer',
              background: activeType === 'baby' ? '#FFF' : 'transparent',
              color: activeType === 'baby' ? '#14342B' : '#999',
              fontWeight: activeType === 'baby' ? 800 : 500,
              fontSize: '14px', fontFamily: 'inherit',
              boxShadow: activeType === 'baby' ? '0 2px 10px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            <BabyBed01Icon size={18} color={activeType === 'baby' ? '#14342B' : '#999'} />
            Bebek (0-3 yaş)
          </button>
          <button
            onClick={() => switchType('child')}
            style={{
              flex: 1, padding: '12px 8px', borderRadius: '13px', border: 'none', cursor: 'pointer',
              background: activeType === 'child' ? '#FFF' : 'transparent',
              color: activeType === 'child' ? '#14342B' : '#999',
              fontWeight: activeType === 'child' ? 800 : 500,
              fontSize: '14px', fontFamily: 'inherit',
              boxShadow: activeType === 'child' ? '0 2px 10px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            <Backpack01Icon size={18} color={activeType === 'child' ? '#14342B' : '#999'} />
            Çocuk (3-12 yaş)
          </button>
        </div>

        {/* Swipe hint */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px', padding: '6px 0 0', opacity: 0.4 }}>
          <ArrowLeft01Icon size={12} color="#999" />
          <span style={{ fontSize: '10px', color: '#999' }}>kaydır</span>
          <ArrowRight01Icon size={12} color="#999" />
        </div>

        {/* ── Price Tabs ── */}
        <div style={{ padding: '12px 16px 0' }}>
          <p style={{ textAlign: 'center', fontSize: '13px', fontWeight: 600, color: '#14342B', margin: '0 0 10px' }}>
            Bütçeni seç, kombini gör
          </p>
          <div style={{ display: 'flex', gap: '6px' }}>
            {PRICES.map(price => {
              const isActive = selectedPrice === price;
              return (
                <button
                  key={price}
                  onClick={() => selectPrice(price)}
                  style={{
                    flex: 1, padding: '12px 4px', borderRadius: '14px', border: 'none', cursor: 'pointer',
                    background: isActive ? '#14342B' : '#F8F6F3',
                    color: isActive ? '#FFF' : '#333',
                    fontWeight: 800, fontSize: '15px', fontFamily: 'inherit',
                    boxShadow: isActive ? '0 4px 14px rgba(20,52,43,0.25)' : 'none',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isActive ? 'scale(1.05)' : 'scale(1)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px',
                  }}
                >
                  <span>{price === 1000 ? '1K' : price}</span>
                  <span style={{ fontSize: '9px', fontWeight: 600, opacity: 0.7 }}>TL Altı</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Outfit Display ── */}
        {currentOutfit && selectedPrice && (
          <div style={{
            padding: '16px',
            animation: 'mannequinFadeIn 0.4s ease-out',
            opacity: isAnimating ? 0.3 : 1,
            transition: 'opacity 0.3s ease',
          }}>
            {/* Message */}
            <div style={{
              textAlign: 'center', padding: '16px 12px', marginBottom: '14px',
              background: 'linear-gradient(135deg, #f0faf5 0%, #fdf8f0 100%)',
              borderRadius: '16px', border: '1px solid #e8f5ec',
            }}>
              <p style={{ fontSize: '17px', fontWeight: 900, color: '#14342B', margin: '0 0 4px', lineHeight: 1.3 }}>
                {PRICE_MESSAGES[selectedPrice].title}
              </p>
              <p style={{ fontSize: '12px', color: '#666', margin: 0, fontWeight: 500 }}>
                {PRICE_MESSAGES[selectedPrice].desc}
              </p>
            </div>

            {/* ── Dressed Mannequin ── */}
            <div style={{
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              padding: '8px 0 16px', position: 'relative',
            }}>
              <div style={{
                background: 'radial-gradient(circle, #f8f6f3 0%, transparent 70%)',
                padding: '12px 32px', borderRadius: '50%',
                animation: 'mannequinFadeIn 0.5s ease-out',
              }}>
                {activeType === 'baby' ? (
                  /* Baby Mannequin SVG */
                  <svg viewBox="0 0 180 260" style={{ width: '120px', height: '180px' }}>
                    {/* Hat/Accessory */}
                    {(() => { const acc = currentOutfit.items.find(i => i.type === 'accessory'); return acc ? <ellipse cx="90" cy="22" rx="32" ry="12" fill={acc.color} opacity="0.85" /> : null; })()}
                    {/* Head */}
                    <circle cx="90" cy="40" r="26" fill="#F5E6D3" stroke="#E8DDD2" strokeWidth="1.5" />
                    <circle cx="80" cy="37" r="2.5" fill="#666" />
                    <circle cx="100" cy="37" r="2.5" fill="#666" />
                    <path d="M83 46 Q90 52 97 46" fill="none" stroke="#D4B8A0" strokeWidth="1.5" strokeLinecap="round" />
                    {/* Neck */}
                    <rect x="84" y="66" width="12" height="8" rx="4" fill="#F5E6D3" />
                    {/* Top */}
                    {(() => { const top = currentOutfit.items.find(i => i.type === 'top'); const c = top?.color || '#E8E0D8'; return (
                      <>
                        <path d={`M55 74 Q55 70 65 70 L85 70 L90 66 L95 70 L115 70 Q125 70 125 74 L125 130 Q125 136 120 136 L60 136 Q55 136 55 130 Z`} fill={c} />
                        <path d="M55 74 L38 82 Q34 84 36 88 L45 100 Q48 104 52 100 L55 92" fill={c} />
                        <path d="M125 74 L142 82 Q146 84 144 88 L135 100 Q132 104 128 100 L125 92" fill={c} />
                        {/* Collar detail */}
                        <path d="M80 70 L90 76 L100 70" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" />
                      </>
                    ); })()}
                    {/* Hands */}
                    <circle cx="44" cy="102" r="7" fill="#F5E6D3" stroke="#E8DDD2" strokeWidth="1" />
                    <circle cx="136" cy="102" r="7" fill="#F5E6D3" stroke="#E8DDD2" strokeWidth="1" />
                    {/* Bottom */}
                    {(() => { const bot = currentOutfit.items.find(i => i.type === 'bottom'); const c = bot?.color || '#D5CEC7'; return (
                      <path d={`M60 136 L62 200 Q62 206 68 206 L82 206 Q86 206 86 200 L90 160 L94 200 Q94 206 98 206 L112 206 Q118 206 118 200 L120 136 Z`} fill={c} />
                    ); })()}
                    {/* Shoes */}
                    {(() => { const shoe = currentOutfit.items.find(i => i.type === 'shoes'); const c = shoe?.color || '#C4BBB2'; return (
                      <>
                        <path d="M62 204 L58 210 Q54 218 62 220 L82 220 Q90 220 88 212 L86 204 Z" fill={c} rx="4" />
                        <path d="M118 204 L122 210 Q126 218 118 220 L98 220 Q90 220 92 212 L94 204 Z" fill={c} rx="4" />
                      </>
                    ); })()}
                  </svg>
                ) : (
                  /* Child Mannequin SVG */
                  <svg viewBox="0 0 180 300" style={{ width: '120px', height: '200px' }}>
                    {/* Hat/Accessory */}
                    {(() => { const acc = currentOutfit.items.find(i => i.type === 'accessory'); return acc ? <ellipse cx="90" cy="18" rx="28" ry="10" fill={acc.color} opacity="0.85" /> : null; })()}
                    {/* Head */}
                    <ellipse cx="90" cy="36" rx="22" ry="24" fill="#F5E6D3" stroke="#E8DDD2" strokeWidth="1.5" />
                    <circle cx="82" cy="33" r="2.5" fill="#666" />
                    <circle cx="98" cy="33" r="2.5" fill="#666" />
                    <path d="M84 43 Q90 48 96 43" fill="none" stroke="#D4B8A0" strokeWidth="1.5" strokeLinecap="round" />
                    {/* Neck */}
                    <rect x="84" y="60" width="12" height="10" rx="4" fill="#F5E6D3" />
                    {/* Top */}
                    {(() => { const top = currentOutfit.items.find(i => i.type === 'top'); const c = top?.color || '#E8E0D8'; return (
                      <>
                        <path d={`M55 70 Q52 66 62 66 L82 66 L90 60 L98 66 L118 66 Q128 66 125 70 L122 145 Q122 150 117 150 L63 150 Q58 150 58 145 Z`} fill={c} />
                        <path d="M55 70 L35 80 Q30 82 32 87 L42 108 Q45 112 50 108 L55 95" fill={c} />
                        <path d="M125 70 L145 80 Q150 82 148 87 L138 108 Q135 112 130 108 L125 95" fill={c} />
                        <path d="M78 66 L90 72 L102 66" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" />
                      </>
                    ); })()}
                    {/* Hands */}
                    <circle cx="41" cy="110" r="7" fill="#F5E6D3" stroke="#E8DDD2" strokeWidth="1" />
                    <circle cx="139" cy="110" r="7" fill="#F5E6D3" stroke="#E8DDD2" strokeWidth="1" />
                    {/* Bottom */}
                    {(() => { const bot = currentOutfit.items.find(i => i.type === 'bottom'); const c = bot?.color || '#D5CEC7'; return (
                      <path d={`M63 150 L65 240 Q65 246 70 246 L84 246 Q88 246 88 240 L90 185 L92 240 Q92 246 96 246 L110 246 Q115 246 115 240 L117 150 Z`} fill={c} />
                    ); })()}
                    {/* Shoes */}
                    {(() => { const shoe = currentOutfit.items.find(i => i.type === 'shoes'); const c = shoe?.color || '#C4BBB2'; return (
                      <>
                        <path d="M65 244 L60 252 Q56 260 64 262 L84 262 Q92 262 90 254 L88 244 Z" fill={c} rx="4" />
                        <path d="M115 244 L120 252 Q124 260 116 262 L96 262 Q88 262 90 254 L92 244 Z" fill={c} rx="4" />
                      </>
                    ); })()}
                  </svg>
                )}
              </div>
              {/* Total badge on mannequin */}
              <div style={{
                position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)',
                background: '#14342B', color: '#FFF', padding: '5px 16px',
                borderRadius: '20px', fontSize: '13px', fontWeight: 800,
                boxShadow: '0 4px 12px rgba(20,52,43,0.3)',
              }}>
                {totalPrice} ₺
              </div>
            </div>

            {/* Outfit Name */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <p style={{ fontSize: '16px', fontWeight: 800, color: '#111', margin: '0 0 2px' }}>
                  {currentOutfit.name}
                </p>
                <p style={{ fontSize: '12px', color: '#999', margin: 0, fontWeight: 500 }}>
                  {currentOutfit.tagline}
                </p>
              </div>
              <button
                onClick={shuffleOutfit}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px',
                  borderRadius: '10px', border: '1px solid #E8E4E0', background: '#FFF',
                  cursor: 'pointer', fontSize: '11px', fontWeight: 700, color: '#14342B',
                  fontFamily: 'inherit', transition: 'all 0.2s',
                }}
              >
                <ShuffleIcon size={14} color="#14342B" />
                Değiştir
              </button>
            </div>

            {/* Product Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
              {currentOutfit.items.map((item, index) => (
                <div
                  key={item.id}
                  style={{
                    background: '#FFF', borderRadius: '16px', overflow: 'hidden',
                    border: '1px solid #F0ECE8',
                    animation: `mannequinFadeIn 0.4s ease-out ${index * 0.08}s both`,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                >
                  {/* Product Image */}
                  <div style={{
                    height: '110px', background: item.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative', overflow: 'hidden',
                  }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      style={{
                        width: '100%', height: '100%', objectFit: 'cover',
                        mixBlendMode: 'multiply', opacity: 0.9,
                      }}
                    />
                    {/* Type badge */}
                    <span style={{
                      position: 'absolute', top: '6px', left: '6px',
                      background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)',
                      padding: '3px 8px', borderRadius: '8px', fontSize: '9px',
                      fontWeight: 700, color: '#14342B', textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}>
                      {item.type === 'top' ? 'Üst' : item.type === 'bottom' ? 'Alt' : item.type === 'shoes' ? 'Ayakkabı' : 'Aksesuar'}
                    </span>
                  </div>
                  {/* Product Info */}
                  <div style={{ padding: '10px 10px 12px' }}>
                    <p style={{
                      fontSize: '12px', fontWeight: 700, color: '#111', margin: '0 0 6px',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {item.name}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '15px', fontWeight: 900, color: '#14342B' }}>
                        {item.price} ₺
                      </span>
                      <span style={{
                        fontSize: '11px', fontWeight: 500, color: '#BBB',
                        textDecoration: 'line-through',
                      }}>
                        {item.originalPrice} ₺
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Savings Summary */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
              padding: '14px 16px', marginBottom: '12px',
              background: 'linear-gradient(135deg, #14342B, #1a5a45)',
              borderRadius: '16px', color: '#FFF',
            }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '10px', fontWeight: 600, margin: 0, opacity: 0.7, marginBottom: '2px' }}>Piyasa Fiyatı</p>
                <p style={{ fontSize: '16px', fontWeight: 800, margin: 0, textDecoration: 'line-through', opacity: 0.5 }}>{totalOriginal} ₺</p>
              </div>
              <div style={{
                width: '2px', height: '30px', background: 'rgba(255,255,255,0.15)', borderRadius: '1px',
              }} />
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '10px', fontWeight: 600, margin: 0, opacity: 0.7, marginBottom: '2px' }}>Salutbabe&apos;de</p>
                <p style={{ fontSize: '22px', fontWeight: 900, margin: 0 }}>{totalPrice} ₺</p>
              </div>
              <div style={{
                width: '2px', height: '30px', background: 'rgba(255,255,255,0.15)', borderRadius: '1px',
              }} />
              <div style={{
                background: '#C9A96E', padding: '6px 12px', borderRadius: '10px', textAlign: 'center',
              }}>
                <p style={{ fontSize: '10px', fontWeight: 700, margin: 0, color: '#14342B', marginBottom: '1px' }}>Tasarruf</p>
                <p style={{ fontSize: '16px', fontWeight: 900, margin: 0, color: '#14342B' }}>%{savingsPercent}</p>
              </div>
            </div>

            {/* Add to Cart CTA */}
            <button
              onClick={handleAddAllToCart}
              style={{
                width: '100%', padding: '16px', borderRadius: '16px', border: 'none',
                background: 'linear-gradient(135deg, #14342B, #1a5a45)',
                cursor: 'pointer', fontWeight: 800, fontSize: '15px', color: '#FFF',
                fontFamily: 'inherit', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '10px',
                boxShadow: '0 6px 20px rgba(20,52,43,0.3)',
                transition: 'all 0.2s ease', position: 'relative', overflow: 'hidden',
              }}
            >
              <ShoppingBasketAdd01Icon size={20} color="#FFF" />
              Tüm Kombini Sepete Ekle
            </button>
          </div>
        )}

        {/* ── Empty State ── */}
        {!currentOutfit && (
          <div style={{
            padding: '32px 24px 36px', textAlign: 'center',
          }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '20px', margin: '0 auto 16px',
              background: 'linear-gradient(135deg, #f0faf5, #fdf8f0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid #e8f5ec',
            }}>
              <SparklesIcon size={28} color="#14342B" />
            </div>
            <p style={{ fontSize: '15px', fontWeight: 700, color: '#333', margin: '0 0 6px' }}>
              Bütçeni seç, harika kombinleri keşfet
            </p>
            <p style={{ fontSize: '12px', color: '#999', margin: 0, lineHeight: 1.5 }}>
              Yukarıdan bir fiyat aralığı seçerek<br />
              ikinci el ürünlerle nasıl şık kombinler<br />
              oluşturabileceğini gör!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
