"use client";

import React, {use, useEffect, useState} from 'react';
import styles from './PDP.module.css';
import {ArrowLeft01Icon, FavouriteIcon, MoreVerticalIcon, Share01Icon, Tick02Icon} from 'hugeicons-react';
import Link from 'next/link';
import {apiUrl} from '@/lib/api';
import {useCart} from '@/context/CartContext';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [purchased, setPurchased] = useState(false);
  const { addToCart, setIsCartOpen } = useCart();

  useEffect(() => {
    let isMounted = true;
    const fetchProduct = async () => {
      try {
        // Fetch products list and find by ID (Since we don't have a single product endpoint atm)
        const res = await fetch(apiUrl('/listings/products?limit=48'), {
          headers: { 'X-Device-Type': 'web' }
        });
        const data = await res.json();
        if (isMounted && data?.payload?.products) {
          const found = data.payload.products.find((p: any) => p.listingID === id);
          setProduct(found);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProduct();
    return () => { isMounted = false; };
  }, [id]);

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Yükleniyor...</div>;
  }

  if (!product) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', paddingTop: '100px' }}>
        <h2>Ürün bulunamadı.</h2>
        <Link href="/" style={{ color: 'blue', marginTop: '16px', display: 'inline-block' }}>Ana Sayfaya Dön</Link>
      </div>
    );
  }

  const displayPrice = parseFloat(product.price || 0).toString();
  const displayCurrency = product.currency === 'TRY' ? 'TL' : (product.currency || 'TL');
  const imageUrl = product.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800';
  const brandName = product.brand?.name || 'Belirtilmemiş';

  const handleBuy = () => {
    setPurchased(true);
    addToCart({
      listingID: product.listingID,
      title: product.title,
      price: parseFloat(product.price || 0),
      primaryImage: imageUrl,
      brand: { name: brandName }
    });
    setIsCartOpen(true);
  };

  return (
    <div className={styles.pdpContainer}>
      
      {/* Top Navigation */}
      <div className={styles.topNav}>
        <Link href="/" className={styles.navButton}>
          <ArrowLeft01Icon size={24} color="var(--text-primary)" strokeWidth={2} />
        </Link>
        <div className={styles.navActions}>
          <button className={styles.navButton}>
            <Share01Icon size={24} color="var(--text-primary)" strokeWidth={2} />
          </button>
          <button className={styles.navButton}>
            <FavouriteIcon size={24} color="var(--text-primary)" strokeWidth={2} />
          </button>
          <button className={styles.navButton}>
            <MoreVerticalIcon size={24} color="var(--text-primary)" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Image Container */}
      <div className={styles.imageContainer}>
        <img src={imageUrl} alt={product.title} className={styles.productImage} />
        {product.images?.length > 1 && (
          <div className={styles.imageDots}>
            {product.images.map((_: any, idx: number) => (
              <span key={idx} className={`${styles.dot} ${idx === 0 ? styles.dotActive : ''}`}></span>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Info */}
      <div className={styles.contentSection}>
        <h1 className={styles.productTitle}>{product.title}</h1>
        <p className={styles.productPrice}>{displayPrice} {displayCurrency}</p>
        
        <div className={styles.brandRow}>
          <span className={styles.brandLabel}>Marka</span>
          <span className={styles.brandValue}>{brandName}</span>
        </div>
      </div>

      {/* Seller Card (Mocked for now since seller info might not be in product payload deeply) */}
      <div className={styles.sellerCard}>
        <div className={styles.sellerInfo}>
          <div className={styles.avatarWrapper}>
            <img src="https://ui-avatars.com/api/?name=Satici&background=random&color=fff" alt="Satıcı" className={styles.avatar} />
          </div>
          <div className={styles.sellerDetails}>
            <h3 className={styles.sellerName}>Güvenilir Satıcı</h3>
            <div className={styles.ratingRow}>
              <span className={styles.ratingStar}>★</span>
              <span className={styles.ratingValue}>4.9</span>
              <span className={styles.reviewCount}>(120 yorum)</span>
            </div>
          </div>
        </div>
        <div className={styles.fastResponseBadge}>
          <Tick02Icon size={12} color="white" />
          <span>Hızlı Yanıt</span>
        </div>
      </div>

      {/* Description */}
      <div className={styles.descriptionSection}>
        <h3 className={styles.sectionTitle}>Açıklama</h3>
        <p className={styles.descriptionText}>{product.description || 'Bu ürün için henüz bir açıklama girilmemiş.'}</p>
      </div>

      {/* Spacer so the bottom bar doesn't overlap text */}
      <div style={{ height: '100px' }}></div>

      {/* Fixed Bottom Action Bar */}
      <div className={styles.bottomActionBar}>
        <div className={styles.actionBarContainer}>
          <span className={styles.bottomPrice}>{displayPrice} {displayCurrency}</span>
          <div className={styles.actionButtons}>
            <button className={styles.offerButton}>Teklif Ver</button>
            <button 
              className={styles.buyButton} 
              onClick={handleBuy}
              style={{ background: purchased ? '#059669' : '#111' }}
            >
              {purchased ? 'Sepette ✓' : 'Satın Al'}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
