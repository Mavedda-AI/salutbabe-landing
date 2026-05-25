import React from 'react';
import {useThemeLanguage} from '@/context/ThemeLanguageContext';
import Link from 'next/link';
import {ArrowRight01Icon, Cancel01Icon} from 'hugeicons-react';
import styles from './MobileDrawer.module.css';
import {, {useEffect} from 'react';

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
    { name: 'Anne', href: '/category/anne' },
    { name: t('widgets.drawer_toy'), href: '/category/oyuncak' },
    { name: t('widgets.drawer_equipment'), href: '/category/arac-gerec' },
    { name: t('widgets.drawer_brands'), href: '/brands' },
    { name: t('widgets.drawer_sale'), href: '/sale', isRed: true },
  ];

  const footerLinks = [
    { name: 'Blog', href: '/blog' },
    { name: 'Destek', href: '/support' },
    { name: t('widgets.drawer_about'), href: '/about' },
    { name: 'Şartlar', href: '/terms' },
    { name: 'Nasıl Satış Yapılır?', href: '/how-to-sell' },
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
              Hemen Sat
            </Link>
            <Link href="/login" className={styles.secondaryActionButton} onClick={onClose}>
              Satıcı Paneli
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
            <h4 className={styles.footerTitle}>Salutbabe'den daha fazlası</h4>
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
