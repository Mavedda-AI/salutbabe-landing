import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <Link href="/" className={styles.logo}>
          Salutbabe
        </Link>
        <div className={styles.searchBar}>
          <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Ürün, marka veya üye ara..." 
            className={styles.searchInput}
          />
        </div>
        <div className={styles.actions}>
          <button className={styles.btnText}>Giriş Yap</button>
          <button className={styles.btnPrimary}>Satış Yap</button>
        </div>
      </div>
    </header>
  );
}
