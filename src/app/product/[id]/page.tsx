import React from 'react';
import styles from './PDP.module.css';
import {
    ArrowLeft01Icon,
    FavouriteIcon,
    InformationCircleIcon,
    MoreVerticalIcon,
    Share01Icon,
    Tick02Icon
} from 'hugeicons-react';
import Link from 'next/link';

// App Router params
export default function ProductDetailPage({ params }: { params: { id: string } }) {
  // Mock data based on the route
  const product = {
    id: params.id,
    title: 'Dinozor Şeklinde Hasır Oyuncak Saklama Sepeti',
    price: '250 TL',
    description: 'El yapımı hasır oyuncak sepeti. Çok az kullanıldı, yepyeni duruyor.',
    images: [
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800',
    ],
    seller: {
      name: 'Mustafa',
      avatar: 'https://ui-avatars.com/api/?name=Mustafa&background=random&color=fff',
      fastResponse: true,
      rating: '4.9',
      reviewCount: 120,
    }
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

      {/* Image Carousel (Placeholder) */}
      <div className={styles.imageContainer}>
        <img src={product.images[0]} alt={product.title} className={styles.productImage} />
        <div className={styles.imageDots}>
          <span className={`${styles.dot} ${styles.dotActive}`}></span>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>
        </div>
      </div>

      {/* Main Content Info */}
      <div className={styles.contentSection}>
        <h1 className={styles.productTitle}>{product.title}</h1>
        <p className={styles.productPrice}>{product.price}</p>
        
        <div className={styles.brandRow}>
          <span className={styles.brandLabel}>Marka</span>
          <span className={styles.brandValue}>El Yapımı</span>
        </div>
      </div>

      {/* Seller Card (Pixel Perfect to Mobile Spec) */}
      <div className={styles.sellerCard}>
        <div className={styles.sellerInfo}>
          <div className={styles.avatarWrapper}>
            <img src={product.seller.avatar} alt={product.seller.name} className={styles.avatar} />
          </div>
          <div className={styles.sellerDetails}>
            <h3 className={styles.sellerName}>{product.seller.name}</h3>
            <div className={styles.ratingRow}>
              <span className={styles.ratingStar}>★</span>
              <span className={styles.ratingValue}>{product.seller.rating}</span>
              <span className={styles.reviewCount}>({product.seller.reviewCount} yorum)</span>
            </div>
          </div>
        </div>
        
        {/* Fast Response Badge */}
        {product.seller.fastResponse && (
          <div className={styles.fastResponseBadge}>
            <Tick02Icon size={12} color="white" />
            <span>Hızlı Yanıt</span>
          </div>
        )}
      </div>

      {/* Eco Banner Example */}
      <div className={styles.ecoBanner}>
        <InformationCircleIcon size={20} color="#059669" />
        <span className={styles.ecoBannerText}>Bu ürün "Salut Organik" standartlarına uygundur.</span>
      </div>

      {/* Description */}
      <div className={styles.descriptionSection}>
        <h3 className={styles.sectionTitle}>Açıklama</h3>
        <p className={styles.descriptionText}>{product.description}</p>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className={styles.bottomActionBar}>
        <div className={styles.actionBarContainer}>
          <span className={styles.bottomPrice}>{product.price}</span>
          <div className={styles.actionButtons}>
            <button className={styles.offerButton}>Teklif Ver</button>
            <button className={styles.buyButton}>Satın Al</button>
          </div>
        </div>
      </div>

    </div>
  );
}
