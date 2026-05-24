import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      {/* Flutter: padding: EdgeInsets.fromLTRB(12, 8, 12, 0) */}
      <div className={styles.headerContainer}>
        
        {/* Search Bar matching Flutter: TextField inside Expanded */}
        <div className={styles.searchBarWrapper}>
          <div className={styles.searchIconWrapper}>
            <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            type="text" 
            placeholder="Ara..." 
            className={styles.searchInput}
          />
        </div>

        {/* Right action icons (Orders, Cart, Notifications) matching Flutter */}
        <div className={styles.actionsWrapper}>
          
          {/* Orders Icon */}
          <button className={styles.actionIconButton}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Cart Icon with Badge */}
          <button className={styles.actionIconButton}>
            <div className={styles.iconWithBadge}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {/* Flutter badge: minWidth 16, minHeight 16, text 9px */}
              <div className={styles.badge}>
                <span className={styles.badgeText}>3</span>
              </div>
            </div>
          </button>

          {/* Notification Icon with Badge */}
          <button className={styles.actionIconButton}>
            <div className={styles.iconWithBadge}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className={styles.badge}>
                <span className={styles.badgeText}>1</span>
              </div>
            </div>
          </button>

        </div>
      </div>
    </header>
  );
}
