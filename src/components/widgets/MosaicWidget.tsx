"use client";

import React, {useEffect, useState} from 'react';
import styles from '@/app/(shop)/page.module.css';
import {useThemeLanguage} from '@/context/ThemeLanguageContext';
import {useRouter} from 'next/navigation';
import {ArrowDown01Icon, ViewIcon} from 'hugeicons-react';
import {useCart} from '@/context/CartContext';
import {useToast} from '@/context/ToastContext';

import {apiUrl} from '@/lib/api';

function MosaicItem({ product, onClick }: { product: any, onClick: () => void }) {
  const { t } = useThemeLanguage();
  const { addToCart, setIsCartOpen } = useCart();
  const { showToast } = useToast();
  const image = product.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1542355581-caf7454785ca?w=500&h=500&fit=crop";
  const displayPrice = parseFloat(product.price || 0).toString();
  const displayCurrency = product.currency === 'TRY' ? 'TL' : (product.currency || 'TL');
  const brandName = product.brand?.name || product.title;
  const isSold = product.status === "sold";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      listingID: product.listingID,
      title: product.title,
      price: parseFloat(product.price || 0),
      primaryImage: image,
      brand: { name: brandName }
    });
    showToast(t('home.added_to_cart'), "success");
    setIsCartOpen(true);
  };

  return (
    <div 
      className={styles.mosaicItem}
      onClick={onClick}
    >
      <img src={image} alt={brandName} loading="lazy" />
      <div className={styles.mosaicOverlay}>
        <span onClick={handleAddToCart} style={{ cursor: 'pointer' }}>{t('home.add_to_cart')}</span>
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

export default function MosaicWidget({ activeCategory = "Tümü", setActiveCategory = () => {} }: { activeCategory?: string, setActiveCategory?: (c: string) => void }) {
  const { t } = useThemeLanguage();
  const router = useRouter();
  const [showAppModal, setShowAppModal] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
  const [activeSubSubCategory, setActiveSubSubCategory] = useState<string | null>(null);

  const [dynamicFilterTabs, setDynamicFilterTabs] = useState<{key: string, label: string}[]>([
    { key: "Tümü", label: t('home.tab_all') },
    { key: "Sana Özel", label: t('home.tab_foryou') }
  ]);
  const [dynamicSubCategories, setDynamicSubCategories] = useState<Record<string, Record<string, string[]>>>({});

  useEffect(() => {
    let isMounted = true;
    const fetchCats = async () => {
      try {
        const res = await fetch(apiUrl('/listings/get-all-categories'), {
          headers: { 'X-Device-Type': 'web' }
        });
        const data = await res.json();
        if (isMounted && data?.payload) {
           const flatCats = data.payload;
           const roots = flatCats.filter((c: any) => !c.parentCategoryID);
           
           const newTabs = [
             { key: "Tümü", label: t('home.tab_all') },
             { key: "Sana Özel", label: t('home.tab_foryou') },
           ];
           
           const subCatsDict: Record<string, Record<string, string[]>> = {};

           roots.forEach((root: any) => {
             const rootName = root.displayedName?.tr || root.name;
             newTabs.push({ key: rootName, label: rootName });
             
             subCatsDict[rootName] = {};
             
             const children = flatCats.filter((c: any) => c.parentCategoryID === root.categoryID);
             children.forEach((child: any) => {
               const childName = child.displayedName?.tr || child.name;
               const subChildren = flatCats.filter((c: any) => c.parentCategoryID === child.categoryID);
               subCatsDict[rootName][childName] = subChildren.map((sc: any) => sc.displayedName?.tr || sc.name);
             });
           });



           setDynamicFilterTabs(newTabs);
           setDynamicSubCategories(subCatsDict);
        }
      } catch (err) {
        // Backend kapalıysa veya ulaşılamıyorsa sadece uyarı ver (Next.js hata overlay'ini tetiklememek için)
        console.warn("Categories fetch error (Sunucu kapalı olabilir):", err);
      }
    };
    fetchCats();
    return () => { isMounted = false; };
  }, [t]);

  const handleMainCategoryClick = (key: string) => {
    setActiveCategory(key);
    setActiveSubCategory(null);
    setActiveSubSubCategory(null);
  };

  const handleSubCategoryClick = (key: string) => {
    setActiveSubCategory(key);
    setActiveSubSubCategory(null);
  };
  
  const DROPDOWN_TABS = [
    { key: "Beden", label: t('home.tab_size') },
    { key: "Marka", label: t('home.tab_brand') }
  ];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const fetchProducts = async () => {
      try {
        let url = '/listings/products?limit=48';
        if (activeCategory && activeCategory !== "Tümü" && activeCategory !== "Sana Özel") {
           url += `&category=${encodeURIComponent(activeCategory)}`;
           if (activeSubCategory) {
              url += `&subCategory=${encodeURIComponent(activeSubCategory)}`;
              if (activeSubSubCategory) {
                  url += `&subSubCategory=${encodeURIComponent(activeSubSubCategory)}`;
              }
           }
        }

        const res = await fetch(apiUrl(url), {
          headers: { 'X-Device-Type': 'web' }
        });
        const data = await res.json();
        if (isMounted && data?.payload?.products) {
          setProducts(data.payload.products);
        }
      } catch (error) {
        // Backend kapalıysa sadece uyarı ver
        console.warn("Error fetching live products (Sunucu kapalı olabilir):", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [activeCategory, activeSubCategory, activeSubSubCategory]);

  return (
    <>
      <div id="shop-grid" className={styles.mosaicSection} style={{ scrollMarginTop: '80px' }}>
        <h2 className={styles.sectionTitle} style={{ margin: '0 16px 16px 16px' }}>{t('home.for_you_picks')}</h2>
        
        <div className={styles.categoryFilters} style={{ margin: '0 0 8px 0', gap: '16px' }}>
          {dynamicFilterTabs.map((tab) => (
            <span 
              key={tab.key}
              onClick={() => handleMainCategoryClick(tab.key)}
              className={`${styles.filterPill} ${activeCategory === tab.key ? styles.filterPillActive : ''}`}
            >
              {tab.label}
              {dynamicSubCategories[tab.key] && <span style={{ fontSize: '10px', marginLeft: '2px', color: '#111' }}>•</span>}
            </span>
          ))}
          {DROPDOWN_TABS.map((tab) => (
            <span 
              key={tab.key}
              className={`${styles.filterPillDropdown} ${activeCategory === tab.key ? styles.filterPillActive : ''}`}
              onClick={() => handleMainCategoryClick(tab.key)}
            >
              {tab.label} <ArrowDown01Icon size={18} color="currentColor" strokeWidth={2.5} />
            </span>
          ))}
        </div>

        {activeCategory && dynamicSubCategories[activeCategory] && (
          <div className={styles.subCategoryRow}>
            {Object.keys(dynamicSubCategories[activeCategory]).map((sub) => (
              <span
                key={sub}
                onClick={() => handleSubCategoryClick(sub)}
                className={`${styles.filterPill} ${activeSubCategory === sub ? styles.filterPillActive : ''}`}
              >
                {sub}
                {dynamicSubCategories[activeCategory][sub].length > 0 && <span style={{ fontSize: '10px', marginLeft: '2px', color: '#111' }}>•</span>}
              </span>
            ))}
          </div>
        )}

        {activeCategory && activeSubCategory && dynamicSubCategories[activeCategory]?.[activeSubCategory]?.length > 0 && (
          <div className={styles.subCategoryRow}>
            {dynamicSubCategories[activeCategory][activeSubCategory].map((subsub) => (
              <span
                key={subsub}
                onClick={() => setActiveSubSubCategory(subsub)}
                className={`${styles.filterPill} ${activeSubSubCategory === subsub ? styles.filterPillActive : ''}`}
              >
                {subsub}
              </span>
            ))}
          </div>
        )}

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
            {t('home.products_load_error')}
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
