import React from 'react';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  brand: string;
  price: string;
  sellerName: string;
  image: string;
  oldPrice?: string;
  statsText?: string;
  statsIcon?: 'heart' | 'eye';
  badgeText?: string;
  isFavorite?: boolean;
}

export default function ProductCard({
  brand,
  price,
  sellerName,
  image,
  oldPrice,
  statsText,
  statsIcon,
  badgeText,
  isFavorite = false,
}: ProductCardProps) {
  // Extract initials for the avatar fallback
  const getInitials = (name: string) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name[0].toUpperCase();
  };

  return (
    <div className={styles.cardContainer}>
      <div className={styles.imageWrapper}>
        <img src={image} alt={brand} className={styles.productImage} />
        
        {/* Heart Icon Top Right (Inside Image) */}
        <button className={styles.favoriteButton} aria-label="Favorite">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill={isFavorite ? "red" : "none"}
            stroke={isFavorite ? "red" : "white"}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.heartIcon}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>

        {/* Optional Badge */}
        {badgeText && (
          <div className={styles.badgeWrapper}>
            <div className={styles.badge}>
              <span className={styles.badgeText}>{badgeText}</span>
            </div>
          </div>
        )}
      </div>

      <div className={styles.infoWrapper}>
        <div className={styles.infoColumn}>
          {/* Title */}
          <h3 className={styles.title}>{brand}</h3>
          
          {/* Stats Row with Icon */}
          {(statsText || oldPrice) && (
            <div className={styles.statsRow}>
              {statsText && (
                <div className={styles.statsItem}>
                  {statsIcon === 'heart' && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="#D32F2F" stroke="#D32F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  )}
                  {statsIcon === 'eye' && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#757575" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                  <span className={styles.statsText}>{statsText}</span>
                </div>
              )}
              {oldPrice && (
                <span className={styles.oldPrice}>
                  <span className={styles.strikeThrough}>{oldPrice}</span>
                </span>
              )}
            </div>
          )}

          {/* Price Row */}
          <div className={styles.priceRow}>
            <span className={styles.price}>{price} TL</span>
          </div>
        </div>

        {/* Seller Avatar Bottom Right */}
        <div className={styles.sellerAvatar}>
          <div className={styles.avatarCircle}>
            {/* If seller name is initials, else we assume we'd have a real image, simulating image here with color if no initials */}
            {sellerName === 'DS' ? 'DS' : <img src={`https://ui-avatars.com/api/?name=${sellerName}&background=random&color=fff&rounded=true`} alt={sellerName} className={styles.avatarImg}/>}
          </div>
        </div>
      </div>
    </div>
  );
}
