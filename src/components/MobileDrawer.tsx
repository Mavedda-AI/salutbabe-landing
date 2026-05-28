import React, {useEffect} from 'react';
import {useThemeLanguage} from '@/context/ThemeLanguageContext';
import Link from 'next/link';
import {ArrowRight01Icon, Cancel01Icon} from 'hugeicons-react';
import styles from './MobileDrawer.module.css';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const { t } = useThemeLanguage();
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

  const categories = [
    { name: t('home.tab_mom'), href: '/category/anne' },
    { name: t('widgets.drawer_toy'), href: '/category/oyuncak' },
    { name: t('widgets.drawer_equipment'), href: '/category/arac-gerec' },
    { name: t('widgets.drawer_brands'), href: '/brands' },
    { name: t('widgets.drawer_sale'), href: '/sale', isRed: true },
  ];

  const footerLinks = [
    { name: t('drawer.blog'), href: '/blog' },
    { name: t('drawer.support'), href: '/support' },
    { name: t('widgets.drawer_about'), href: '/about' },
    { name: t('drawer.terms'), href: '/terms' },
    { name: t('drawer.how_to_sell'), href: '/how-to-sell' },
    { name: t('widgets.drawer_privacy'), href: '/privacy' },
  ];

  return (
    <div className={styles.drawerOverlay} onClick={onClose}>
      <div className={styles.drawerContent} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className={styles.drawerHeader}>
          <img 
            src="/assets/images/logo/logo_salutbabe.png" 
            alt="SalutBabe" 
            className={styles.drawerLogo} 
          />
          <button className={styles.closeButton} onClick={onClose}>
            <Cancel01Icon size={24} color="#111" strokeWidth={1.5} />
          </button>
        </div>

        <div className={styles.scrollArea}>
          {/* Main Action Buttons */}
          <div className={styles.actionButtonsContainer}>
            <Link href="/create" className={styles.primaryActionButton} onClick={onClose}>
              {t('drawer.sell_now')}
            </Link>
            <Link href="https://www.salutbabe.com/login" className={styles.secondaryActionButton} onClick={onClose}>
              {t('drawer.seller_panel')}
            </Link>
          </div>

          {/* Categories List */}
          <div className={styles.categoriesList}>
            {categories.map((cat, idx) => (
              <Link 
                key={idx} 
                href={cat.href} 
                className={styles.categoryItem}
                onClick={onClose}
              >
                <span className={cat.isRed ? styles.redText : styles.normalText}>
                  {cat.name}
                </span>
                <ArrowRight01Icon size={20} color="#111" strokeWidth={1.5} />
              </Link>
            ))}
          </div>

          {/* Footer Links Area */}
          <div className={styles.footerArea}>
            <h4 className={styles.footerTitle}>{t('drawer.more_from')}</h4>
            <div className={styles.footerGrid}>
              {footerLinks.map((link, idx) => (
                <Link 
                  key={idx} 
                  href={link.href} 
                  className={styles.footerLink}
                  onClick={onClose}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
