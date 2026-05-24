import React, {useEffect} from 'react';
import {Cancel01Icon, ShoppingBasket02Icon} from 'hugeicons-react';
import styles from './CartDrawer.module.css';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.drawerOverlay} onClick={onClose}>
      <div className={styles.drawerContent} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className={styles.drawerHeader}>
          <h2 className={styles.drawerTitle}>Sepetim</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Kapat">
            <Cancel01Icon size={20} color="#111" strokeWidth={2} />
          </button>
        </div>

        {/* Content Area */}
        <div className={styles.scrollArea}>
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <ShoppingBasket02Icon size={44} color="#888" strokeWidth={1.5} />
            </div>
            <h3 className={styles.emptyTitle}>Sepetin şu an boş</h3>
            <p className={styles.emptyDesc}>
              Binlerce özel tasarım ürün arasından beğendiklerini sepetine eklemeye hemen başla.
            </p>
            <button className={styles.shopButton} onClick={onClose}>
              Alışverişe Başla
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
