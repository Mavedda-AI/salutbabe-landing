"use client";

import React, {useEffect, useState} from 'react';
import styles from '@/app/(shop)/page.module.css';
import {useThemeLanguage} from '@/context/ThemeLanguageContext';
import {useRouter} from 'next/navigation';
import {ViewIcon} from 'hugeicons-react';

import {apiUrl} from '@/lib/api';

function MosaicItem({ product, onClick }: { product: any, onClick: () => void }) {
  const { t } = useThemeLanguage();
  const image = product.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1542355581-caf7454785ca?w=500&h=500&fit=crop";
  const displayPrice = parseFloat(product.price || 0).toString();
  const displayCurrency = product.currency === 'TRY' ? 'TL' : (product.currency || 'TL');
  const brandName = product.brand?.name || product.title;
  const isSold = product.status === "sold";

  return (
    <div 
      className={styles.mosaicItem}
      onClick={onClick}
    >
      <img src={image} alt={brandName} loading="lazy" />
      <div className={styles.mosaicOverlay}>
        <span>{t('home.view_in_app') || 'Uygulamada Gör'}</span>
      </div>
      
      <div className={styles.mosaicPrice}>{displayPrice} {displayCurrency}</div>
      
      {/* Views Badge */}
      <div className={styles.mosaicViews}>
        <ViewIcon size={12} strokeWidth={2.5} />
        {product.viewCount || product.totalViewsLast24h || 0}
      </div>
      
      {isSold && (
        <div className={styles.mosaicSoldOverlay}>
          <div className={styles.soldStamp}>
            <div className={styles.soldStampTop}>{t('home.sorry')}</div>
            <div className={styles.soldStampBottom}>{t('home.sold')}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MosaicWidget() {
  const { t } = useThemeLanguage();
  const router = useRouter();
  const [showAppModal, setShowAppModal] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        const res = await fetch(apiUrl('/listings/products?limit=48'), {
          headers: { 'X-Device-Type': 'web' }
        });
        const data = await res.json();
        if (isMounted && data?.payload?.products) {
          setProducts(data.payload.products);
        }
      } catch (error) {
        console.error("Error fetching live products:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <div id="shop-grid" className={styles.mosaicSection} style={{ scrollMarginTop: '80px' }}>
        <h2 className={styles.sectionTitle} style={{ margin: '0 16px 16px 16px' }}>{t('home.for_you_picks')}</h2>
        
        {loading ? (
          <div className={styles.mosaicContainer}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className={styles.mosaicItem} style={{ background: 'var(--input-bg)', minHeight: '200px', animation: 'pulse 1.5s infinite' }}></div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className={styles.mosaicContainer}>
            {products.map((product, i) => (
              <MosaicItem key={product.listingID || i} product={product} onClick={() => router.push('/product/' + product.listingID)} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            Ürünler yüklenemedi. Lütfen daha sonra tekrar deneyin.
          </div>
        )}
      </div>

      {showAppModal && (
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
          }}
          onClick={() => setShowAppModal(false)}
        >
          <div 
            style={{
              background: '#fff', borderRadius: '24px', padding: '32px 24px',
              maxWidth: '360px', width: '100%', textAlign: 'center', position: 'relative',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowAppModal(false)}
              style={{
                position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.05)',
                border: 'none', width: '32px', height: '32px', borderRadius: '16px',
                fontSize: '16px', cursor: 'pointer', color: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              ✕
            </button>
            <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '12px', color: '#111' }}>
              {t('widgets.country_app_title')}
            </h3>
            <p style={{ fontSize: '15px', color: '#666', marginBottom: '24px', lineHeight: '1.5' }}>
              {t('widgets.country_app_desc')}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a 
                href="https://apps.apple.com/us/app/salutbabe/id6759988511" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#000', color: '#fff', padding: '14px', borderRadius: '12px', textDecoration: 'none'
                }}
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" style={{ height: 32 }} />
              </a>
              <a 
                href="https://play.google.com/store/apps/details?id=com.salutbabe&hl=tr" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#000', color: '#fff', padding: '14px', borderRadius: '12px', textDecoration: 'none'
                }}
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" style={{ height: 32 }} />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
