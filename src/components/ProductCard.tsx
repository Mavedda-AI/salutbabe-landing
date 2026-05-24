import styles from './ProductCard.module.css';

interface ProductCardProps {
  image: string;
  price: string;
  brand: string;
  sellerName: string;
}

export default function ProductCard({ image, price, brand, sellerName }: ProductCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.imageContainer}>
        {/* Using a standard img tag since we don't have configured next/image domains */}
        <img src={image} alt={`${brand} ürünü`} className={styles.image} />
      </div>
      <div className={styles.content}>
        <div className={styles.priceRow}>
          <span className={styles.price}>{price} ₺</span>
          <button aria-label="Favoriye Ekle">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
        <span className={styles.brand}>{brand}</span>
      </div>
      <div className={styles.sellerInfo}>
        <div className={styles.sellerAvatar}>{sellerName.charAt(0)}</div>
        <span className={styles.sellerName}>{sellerName}</span>
      </div>
    </article>
  );
}
