import React from 'react';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  brand: string;
  price: string;
  sellerName: string;
  image: string;
  oldPrice?: string;
  stats?: string;
  badgeText?: string;
  isFavorite?: boolean;
}

export default function ProductCard({
  brand,
  price,
  sellerName,
  image,
  oldPrice,
  stats,
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
        
        {badgeText && (
          <div className={styles.badgeWrapper}>
            <div className={styles.badge}>
              <span className={styles.badgeText}>{badgeText}</span>
            </div>
          </div>
        )}

        <button className={styles.favoriteButton} aria-label="Favorite">
          {/* Using a simple SVG heart to match flutter Icons.favorite / favorite_border */}
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill={isFavorite ? "red" : "none"}
            stroke={isFavorite ? "red" : "white"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.heartIcon}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>

      <div className={styles.infoWrapper}>
        <div className={styles.infoColumn}>
          <h3 className={styles.title}>{brand}</h3>
          
          <div className={styles.statsRow}>
            {stats && (
              <span className={styles.statsText}>
                ★ {stats}
              </span>
            )}
          </div>

          <div className={styles.priceRow}>
            {oldPrice && (
              <span className={styles.oldPrice}>
                Sıfır: <span className={styles.strikeThrough}>{oldPrice}</span>
              </span>
            )}
            <span className={`${styles.price} ${oldPrice ? styles.priceDiscounted : ''}`}>
              {price} TL
            </span>
          </div>
        </div>

        <div className={styles.sellerAvatar}>
          <div className={styles.avatarCircle}>
            {getInitials(sellerName)}
          </div>
        </div>
      </div>
    </div>
  );
}
