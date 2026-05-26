import React, {useEffect} from 'react';
import {useThemeLanguage} from '@/context/ThemeLanguageContext';
import {Cancel01Icon, Delete01Icon, ShoppingBasket02Icon} from 'hugeicons-react';
import {useRouter} from 'next/navigation';
import {useCart} from '@/context/CartContext';
import styles from './CartDrawer.module.css';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { t } = useThemeLanguage();
  const router = useRouter();
  const { cart, removeFromCart, cartTotal, clearCart } = useCart();
  
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
          <h2 className={styles.drawerTitle}>{t("widgets.cart_title")} ({cart.length})</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Kapat">
            <Cancel01Icon size={20} color="#111" strokeWidth={2} />
          </button>
        </div>

        {/* Content Area */}
        <div className={styles.scrollArea}>
          {cart.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <ShoppingBasket02Icon size={44} color="#888" strokeWidth={1.5} />
              </div>
              <h3 className={styles.emptyTitle}>{t("widgets.cart_empty")}</h3>
              <p className={styles.emptyDesc}>
                {t('cart.empty_desc')}
              </p>
              <button 
                className={styles.shopButton} 
                onClick={() => {
                  onClose();
                  router.push('/');
                }}
              >
                {t('cart.start_shopping')}
              </button>
            </div>
          ) : (
            <div style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cart.map((item) => (
                <div key={item.listingID} style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #eee', paddingBottom: '16px' }}>
                  <img src={item.primaryImage} alt={item.title} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: '#111' }}>{item.brand?.name || 'Ürün'}</h4>
                      <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {item.title}
                      </p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                      <span style={{ fontWeight: 600, color: '#111' }}>{item.price} TL</span>
                      <button onClick={() => removeFromCart(item.listingID)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: '4px' }}>
                        <Delete01Icon size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              <div style={{ marginTop: 'auto', borderTop: '1px solid #eee', paddingTop: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>
                  <span>{t('cart.total')}</span>
                  <span>{cartTotal} TL</span>
                </div>
                <button 
                  style={{ width: '100%', padding: '16px', background: '#111', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 600, cursor: 'pointer' }}
                  onClick={() => {
                    alert(t('cart.order_success'));
                    clearCart();
                    onClose();
                  }}
                >
                  {t('cart.checkout')}
                </button>
              </div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
