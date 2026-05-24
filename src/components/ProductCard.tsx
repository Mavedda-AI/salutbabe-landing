import React from 'react';
import {FavouriteIcon, ViewIcon} from 'hugeicons-react';
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
          <FavouriteIcon 
             className={styles.heartIcon} 
             size={28} 
             color={isFavorite ? "red" : "white"} 
             fill={isFavorite ? "red" : "none"}
             strokeWidth={2.5} 
          />
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
                    <FavouriteIcon size={12} color="#D32F2F" fill="#D32F2F" strokeWidth={2} />
                  )}
                  {statsIcon === 'eye' && (
                    <ViewIcon size={14} color="#757575" strokeWidth={2} />
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
