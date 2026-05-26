"use client";

import React, {useRef, useState} from 'react';
import {useThemeLanguage} from '@/context/ThemeLanguageContext';
import {useCart} from '@/context/CartContext';
import {useToast} from '@/context/ToastContext';
import {ArrowRight01Icon, ShoppingBasketAdd01Icon, SparklesIcon} from 'hugeicons-react';

// ── Types ──
interface OutfitItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  type: 'top' | 'bottom' | 'shoes' | 'accessory';
}

interface OutfitSet {
  name: string;
  tagline: string;
  outfitImage: string;
  items: OutfitItem[];
}

// ── Data ──
const BABY_OUTFITS: Record<number, OutfitSet[]> = {
  100: [{
    name: 'Kışlık Ayıcık Seti', tagline: '100 TL ile sıcacık şıklık',
    outfitImage: '/outfits/outfit-2.jpg',
    items: [
      { id: 'b1-1', name: 'Ayıcıklı Şişme Mont', price: 45, originalPrice: 200, type: 'top' },
      { id: 'b1-2', name: 'Ayıcıklı Ekru Sweat', price: 25, originalPrice: 120, type: 'top' },
      { id: 'b1-3', name: 'Fitilli Krem Tayt', price: 15, originalPrice: 80, type: 'bottom' },
      { id: 'b1-4', name: 'Krem Bağcıklı Bot & Bere', price: 15, originalPrice: 150, type: 'accessory' },
    ],
  }],
  200: [{
    name: 'Tilki Temalı Set', tagline: '200 TL ile doğadan ilham alan stil',
    outfitImage: '/outfits/outfit-1.jpg',
    items: [
      { id: 'b2-1', name: 'Çizgili Kazak', price: 65, originalPrice: 250, type: 'top' },
      { id: 'b2-2', name: 'Krem Fitilli Pantolon', price: 75, originalPrice: 280, type: 'bottom' },
      { id: 'b2-3', name: 'Kışlık Puf Yelek', price: 40, originalPrice: 150, type: 'top' },
      { id: 'b2-4', name: 'Chelsea Bot', price: 20, originalPrice: 180, type: 'shoes' },
    ],
  }],
  500: [{
    name: 'Premium Kombin', tagline: '500 TL ile marka kalitesi',
    outfitImage: '/outfits/outfit-2.jpg',
    items: [
      { id: 'b5-1', name: 'Ayıcıklı Şişme Mont', price: 220, originalPrice: 650, type: 'top' },
      { id: 'b5-2', name: 'Ayıcıklı Ekru Sweat', price: 120, originalPrice: 350, type: 'top' },
      { id: 'b5-3', name: 'Fitilli Krem Tayt', price: 80, originalPrice: 250, type: 'bottom' },
      { id: 'b5-4', name: 'Krem Bağcıklı Bot & Bere', price: 80, originalPrice: 350, type: 'accessory' },
    ],
  }],
  1000: [{
    name: 'Lüks Sokak Modası', tagline: '1000 TL ile tasarımcı ürünleri',
    outfitImage: '/outfits/outfit-1.jpg',
    items: [
      { id: 'b1k-1', name: 'Çizgili Organik Kazak', price: 350, originalPrice: 1500, type: 'top' },
      { id: 'b1k-2', name: 'İtalyan Kadife Yelek', price: 300, originalPrice: 1200, type: 'top' },
      { id: 'b1k-3', name: 'Premium Fitilli Tayt', price: 150, originalPrice: 600, type: 'bottom' },
      { id: 'b1k-4', name: 'Gerçek Deri Bot', price: 200, originalPrice: 850, type: 'shoes' },
    ],
  }],
};

const CHILD_OUTFITS: Record<number, OutfitSet[]> = {
  100: [{
    name: 'Spor Şıklık', tagline: '100 TL ile trend görünüm',
    outfitImage: '/outfits/outfit-1.jpg',
    items: [
      { id: 'c1-1', name: 'Çizgili Kazak', price: 40, originalPrice: 150, type: 'top' },
      { id: 'c1-2', name: 'Kışlık Puf Yelek', price: 30, originalPrice: 180, type: 'top' },
      { id: 'c1-3', name: 'Krem Fitilli Pantolon', price: 20, originalPrice: 120, type: 'bottom' },
      { id: 'c1-4', name: 'Chelsea Bot', price: 10, originalPrice: 150, type: 'shoes' },
    ],
  }],
  200: [{
    name: 'Sıcak Kış Serisi', tagline: '200 TL ile sıcacık koruma',
    outfitImage: '/outfits/outfit-2.jpg',
    items: [
      { id: 'c2-1', name: 'Ayıcıklı Şişme Mont', price: 70, originalPrice: 280, type: 'top' },
      { id: 'c2-2', name: 'Ayıcıklı Ekru Sweat', price: 60, originalPrice: 250, type: 'top' },
      { id: 'c2-3', name: 'Fitilli Krem Tayt', price: 30, originalPrice: 120, type: 'bottom' },
      { id: 'c2-4', name: 'Krem Bağcıklı Bot & Bere', price: 40, originalPrice: 200, type: 'accessory' },
    ],
  }],
  500: [{
    name: 'Zarif Sonbahar', tagline: '500 TL ile dikkat çekici stil',
    outfitImage: '/outfits/outfit-1.jpg',
    items: [
      { id: 'c5-1', name: 'Çizgili Kazak', price: 180, originalPrice: 650, type: 'top' },
      { id: 'c5-2', name: 'Kışlık Puf Yelek', price: 150, originalPrice: 550, type: 'top' },
      { id: 'c5-3', name: 'Krem Fitilli Pantolon', price: 90, originalPrice: 350, type: 'bottom' },
      { id: 'c5-4', name: 'Chelsea Bot', price: 80, originalPrice: 380, type: 'shoes' },
    ],
  }],
  1000: [{
    name: 'Hype Görünüm', tagline: '1000 TL ile trendlerin öncüsü',
    outfitImage: '/outfits/outfit-2.jpg',
    items: [
      { id: 'c1k-1', name: 'Tasarımcı Ayıcıklı Mont', price: 380, originalPrice: 1600, type: 'top' },
      { id: 'c1k-2', name: 'Premium Ekru Sweat', price: 250, originalPrice: 1100, type: 'top' },
      { id: 'c1k-3', name: 'Lüks Krem Tayt', price: 170, originalPrice: 650, type: 'bottom' },
      { id: 'c1k-4', name: 'Özel Seri Bot & Bere', price: 200, originalPrice: 850, type: 'accessory' },
    ],
  }],
};

const MASTER_MANNEQUIN_IMAGE = '/mannequins/master-mannequin.jpg';

export default function MannequinWidget() {
  const { t } = useThemeLanguage();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  
  const [activeType, setActiveType] = useState<'baby' | 'child'>('baby');
  const [selectedPrice, setSelectedPrice] = useState<number>(100);
  const [currentOutfit, setCurrentOutfit] = useState<OutfitSet>(BABY_OUTFITS[100][0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiLoadingText, setAiLoadingText] = useState('Kombin analiz ediliyor...');
  const [touchStart, setTouchStart] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const PRICES = [100, 200, 500, 1000];

  const switchType = (type: 'baby' | 'child') => {
    if (type === activeType || isGeneratingAI) return;
    
    // Manually scroll to the correct snap point
    if (scrollRef.current) {
      const targetScroll = type === 'baby' ? 0 : scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }

    setIsAnimating(true);
    setTimeout(() => {
      setActiveType(type);
      setCurrentOutfit((type === 'baby' ? BABY_OUTFITS[selectedPrice as keyof typeof BABY_OUTFITS] : CHILD_OUTFITS[selectedPrice as keyof typeof CHILD_OUTFITS])[0]);
      setIsAnimating(false);
    }, 400);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (isGeneratingAI) return;
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.clientWidth;
    const newType = scrollLeft > width / 2 ? 'child' : 'baby';
    
    if (newType !== activeType) {
      setActiveType(newType);
      setCurrentOutfit((newType === 'baby' ? BABY_OUTFITS[selectedPrice as keyof typeof BABY_OUTFITS] : CHILD_OUTFITS[selectedPrice as keyof typeof CHILD_OUTFITS])[0]);
    }
  };

  const selectPrice = (price: number) => {
    if (price === selectedPrice || isGeneratingAI) return;
    
    // AI Virtual Try-On Simulation
    setIsGeneratingAI(true);
    setAiLoadingText('Manken 3D pozisyonu algılanıyor...');
    
    setTimeout(() => setAiLoadingText('Kumaş kıvrımları ve ışık hesaplanıyor...'), 1200);
    setTimeout(() => setAiLoadingText('Yapay Zeka kombini giydiriyor...'), 2400);

    setTimeout(() => {
      setSelectedPrice(price);
      setCurrentOutfit((activeType === 'baby' ? BABY_OUTFITS[price] : CHILD_OUTFITS[price])[0]);
      setIsGeneratingAI(false);
    }, 3500);
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
        primaryImage: currentOutfit.outfitImage,
        brand: { name: 'Salutbabe' },
      });
    });
    showToast('Tüm kombin sepete eklendi!', 'success');
  };

  const totalPrice = currentOutfit.items.reduce((sum, item) => sum + item.price, 0);
  const totalOriginal = currentOutfit.items.reduce((sum, item) => sum + item.originalPrice, 0);

  return (
    <div style={{ margin: '40px 16px', position: 'relative' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes imageFade { from { opacity: 0.6; filter: blur(10px); } to { opacity: 1; filter: blur(0); } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scanLaser { 
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}} />

      {/* Title Header */}
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '8px' }}>
        <SparklesIcon size={22} color="#121212" />
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#121212', letterSpacing: '-0.3px', margin: 0 }}>
          Salutbabe Kıyafet Deneme Kabini
        </h2>
      </div>

      <div style={{
        background: '#FFF',
        borderRadius: '28px',
        overflow: 'hidden',
        boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
        border: '1px solid #F0ECE8',
      }}>
        
        <div 
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{ 
            height: '420px', 
            position: 'relative', 
            background: 'transparent',
            overflow: 'hidden'
          }}
        >
          {/* Swiped to change mannequins (Toggle UI removed) */}

          <img 
            key={activeType + selectedPrice}
            src={activeType === 'baby' ? '/mannequins/baby-perfect.png?v=7' : '/mannequins/child-perfect.png?v=7'} 
            alt="Styled Mannequin" 
            style={{
              width: '100%', height: '100%', 
              objectFit: 'contain',
              mixBlendMode: 'darken',
              animation: 'imageFade 0.6s ease-out forwards'
            }}
          />

          {/* Single Right Arrow Indicator for Cycling Mannequins */}
          <button 
            onClick={() => switchType(activeType === 'baby' ? 'child' : 'baby')}
            style={{
              position: 'absolute', top: '45%', right: '16px', transform: 'translateY(-50%)',
              width: '40px', height: '40px', borderRadius: '20px',
              background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)', border: 'none', zIndex: 10,
              cursor: 'pointer', transition: 'all 0.2s ease-out'
            }}
          >
            <ArrowRight01Icon size={20} color="#121212" />
          </button>

          {/* AI Virtual Try-On Scanner Overlay */}
          {isGeneratingAI && (
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              zIndex: 20
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
                background: '#A3E635', boxShadow: '0 0 15px #A3E635, 0 0 30px #A3E635',
                animation: 'scanLaser 2s linear infinite'
              }} />
              <div style={{
                background: 'rgba(20, 52, 43, 0.85)', backdropFilter: 'blur(4px)',
                padding: '12px 24px', borderRadius: '30px', border: '1px solid #A3E635',
                display: 'flex', alignItems: 'center', gap: '8px'
              }}>
                <SparklesIcon size={18} color="#A3E635" />
                <span style={{ color: '#A3E635', fontWeight: 600, fontSize: '14px', letterSpacing: '0.5px' }}>
                  {aiLoadingText}
                </span>
              </div>
            </div>
          )}

          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '160px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
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

        <div style={{ padding: '24px 20px', background: '#FFF' }}>
          
          <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
            {PRICES.map(price => (
              <button
                key={price}
                onClick={() => selectPrice(price)}
                style={{
                  flex: 1, padding: '12px 4px', borderRadius: '16px',
                  border: '1px solid', borderColor: selectedPrice === price ? '#2D2D2D' : '#EBEBEB',
                  background: selectedPrice === price ? '#2D2D2D' : '#FFF',
                  color: selectedPrice === price ? '#FFF' : '#333',
                  fontWeight: 700, fontSize: '14px',
                  transition: 'all 0.2s',
                  boxShadow: selectedPrice === price ? '0 4px 12px rgba(0,0,0,0.1)' : '0 2px 6px rgba(0,0,0,0.02)',
                }}
              >
                {price} ₺
              </button>
            ))}
          </div>

          <div style={{
             animation: isAnimating ? 'none' : 'slideInUp 0.4s ease-out',
             opacity: isAnimating ? 0 : 1, transition: 'opacity 0.3s'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#121212' }}>
                Önerilen Kombin
              </h3>
            </div>
            
            <div style={{ 
              width: '100%', 
              borderRadius: '20px', 
              overflow: 'hidden', 
              background: '#F5F5F5',
              marginBottom: '20px',
            }}>
              <img 
                key={currentOutfit.outfitImage + selectedPrice}
                src={currentOutfit.outfitImage} 
                alt="Outfit Flatlay" 
                style={{ 
                  width: '100%', 
                  height: 'auto', 
                  display: 'block',
                  animation: 'imageFade 0.4s ease-out forwards',
                  mixBlendMode: 'darken'
                }} 
              />
            </div>

            <div style={{ marginBottom: '28px', padding: '0 8px' }}>
              {currentOutfit.items.map((item) => (
                <div key={item.id} style={{
                  display: 'flex', alignItems: 'flex-end', marginBottom: '10px',
                }}>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: '#333', margin: 0, paddingRight: '8px' }}>
                    {item.name}
                  </p>
                  <div style={{ flex: 1, borderBottom: '1px dashed #E0E0E0', position: 'relative', top: '-4px' }} />
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#121212', margin: 0, paddingLeft: '8px' }}>
                    {item.price} ₺
                  </p>
                </div>
              ))}
            </div>

            <div style={{ background: '#F5F5F5', borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '12px', color: '#666', margin: '0 0 4px', fontWeight: 500 }}>Piyasa Değeri</p>
                  <p style={{ fontSize: '16px', fontWeight: 600, textDecoration: 'line-through', color: '#999', margin: 0 }}>{totalOriginal} ₺</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '12px', color: '#121212', fontWeight: 700, margin: '0 0 4px' }}>Salutbabe Kombini</p>
                  <p style={{ fontSize: '26px', fontWeight: 800, color: '#121212', margin: 0 }}>{totalPrice} ₺</p>
                </div>
              </div>
              
              <button
                onClick={handleAddAllToCart}
                style={{
                  width: '100%', padding: '16px', borderRadius: '16px', border: 'none',
                  background: '#2D2D2D', color: '#FFF', fontWeight: 700, fontSize: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
                }}
              >
                <ShoppingBasketAdd01Icon size={20} color="#FFF" />
                Tüm Kombini Sepete Ekle
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
