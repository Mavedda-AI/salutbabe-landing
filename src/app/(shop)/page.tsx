"use client";

import React, {useEffect, useState} from 'react';
import PublicHero from '@/components/PublicHero';
import {ArrowDown01Icon} from 'hugeicons-react';
import {apiUrl} from '@/lib/api';
import styles from './page.module.css';

const FILTER_TABS = ["Tümü", "Sana Özel", "Anne", "Bebek", "Çocuk", "Diğer"];
const DROPDOWN_TABS = ["Beden", "Marka"];

const CATEGORY_BANNERS: Record<string, { image: string; title: string; text: string; buttonText: string; bg: string; color: string; btnBg: string; btnColor: string; dotColorActive: string; dotColorInactive: string }> = {
  "Tümü": {
    image: "https://images.unsplash.com/photo-1622218286192-95f6a20083c7?auto=format&fit=crop&q=80&w=1200",
    title: "Salutbabe'te Kargo Bedava",
    text: "Seveceğin bir şeyler bul. Sadece Salutbabe'te.",
    buttonText: "Alışverişe Başla",
    bg: "#14342B", /* Deep Forest Green */
    color: "#FFFFFF",
    btnBg: "#FFFFFF",
    btnColor: "#111111",
    dotColorActive: "rgba(255, 255, 255, 0.9)",
    dotColorInactive: "rgba(255, 255, 255, 0.3)"
  },
  "Sana Özel": {
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=1200",
    title: "Sana Özel Seçimler",
    text: "Zevkine ve tarzına en uygun ürünler.",
    buttonText: "Sana Özel Ürünleri Gör",
    bg: "#82857C", /* RAL 7023 Concrete Grey */
    color: "#FFFFFF",
    btnBg: "#FFFFFF",
    btnColor: "#111111",
    dotColorActive: "rgba(255, 255, 255, 0.9)",
    dotColorInactive: "rgba(255, 255, 255, 0.3)"
  },
  "Anne": {
    image: "https://images.unsplash.com/photo-1568043625493-2b0633c7c491?auto=format&fit=crop&q=80&w=1200",
    title: "Annelerin İhtiyaçları",
    text: "Hamilelikten lohusalığa tüm ihtiyaçların.",
    buttonText: "Anne Ürünlerini Keşfet",
    bg: "#BCA371", /* Warm Sand / Gold */
    color: "#FFFFFF",
    btnBg: "#FFFFFF",
    btnColor: "#111111",
    dotColorActive: "rgba(255, 255, 255, 0.9)",
    dotColorInactive: "rgba(255, 255, 255, 0.3)"
  },
  "Bebek": {
    image: "https://images.unsplash.com/photo-1470116945706-e6bf5d5a53ca?auto=format&fit=crop&q=80&w=1200",
    title: "Bebek Dünyası",
    text: "Bebeğiniz için en sevimli ürünler.",
    buttonText: "Bebek Ürünleri",
    bg: "#A3AFA2", /* Sage Green */
    color: "#FFFFFF",
    btnBg: "#FFFFFF",
    btnColor: "#111111",
    dotColorActive: "rgba(255, 255, 255, 0.9)",
    dotColorInactive: "rgba(255, 255, 255, 0.3)"
  },
  "Çocuk": {
    image: "https://images.unsplash.com/photo-1596066190600-3af9aadaaea1?auto=format&fit=crop&q=80&w=1200",
    title: "Çocuk Modası",
    text: "Dayanıklı, rahat ve trend kıyafetler.",
    buttonText: "Çocuk Giyimi Keşfet",
    bg: "#55644D", /* Olive Green */
    color: "#FFFFFF",
    btnBg: "#FFFFFF",
    btnColor: "#111111",
    dotColorActive: "rgba(255, 255, 255, 0.9)",
    dotColorInactive: "rgba(255, 255, 255, 0.3)"
  },
  "Diğer": {
    image: "https://images.unsplash.com/photo-1602773974733-b56200c8653f?auto=format&fit=crop&q=80&w=1200",
    title: "El İşçiliği Ürünler",
    text: "Özenle hazırlanmış el emeği ürünler.",
    buttonText: "Özel Tasarımları İncele",
    bg: "#14342B", /* Deep Forest Green */
    color: "#FFFFFF",
    btnBg: "#FFFFFF",
    btnColor: "#111111",
    dotColorActive: "rgba(255, 255, 255, 0.9)",
    dotColorInactive: "rgba(255, 255, 255, 0.3)"
  },
  "Beden": {
    image: "https://images.unsplash.com/photo-1560506840-ec148e82a604?auto=format&fit=crop&q=80&w=1200",
    title: "Bedene Göre Seçim",
    text: "Sana en uygun bedenleri hemen bul.",
    buttonText: "Beden Filtrele",
    bg: "#82857C", /* RAL 7023 Concrete Grey */
    color: "#FFFFFF",
    btnBg: "#FFFFFF",
    btnColor: "#111111",
    dotColorActive: "rgba(255, 255, 255, 0.9)",
    dotColorInactive: "rgba(255, 255, 255, 0.3)"
  },
  "Marka": {
    image: "/baby_brands.png",
    title: "Markaya Göre Seçim",
    text: "En sevdiğin markaları hemen keşfet.",
    buttonText: "Markaları Gör",
    bg: "#BCA371", /* Warm Sand / Gold */
    color: "#FFFFFF",
    btnBg: "#FFFFFF",
    btnColor: "#111111",
    dotColorActive: "rgba(255, 255, 255, 0.9)",
    dotColorInactive: "rgba(255, 255, 255, 0.3)"
  }
};

export default function HomeFeed() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [openFooterMenu, setOpenFooterMenu] = useState<string | null>(null);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(apiUrl('/listings/products?limit=20')),
          fetch(apiUrl('/listings/get-all-categories'))
        ]);
        
        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        
        if (productsData.data?.listings) {
          setProducts(productsData.data.listings);
        } else if (Array.isArray(productsData.data)) {
          setProducts(productsData.data);
        }

        if (categoriesData.data) {
          setCategories(categoriesData.data);
        }
      } catch (error) {
        console.error("Error fetching feed data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <>
      <PublicHero />
      
      <div className={styles.feedContainer}>
        {/* Category Filter Tabs */}
        <div className={styles.categoryFiltersWrapper}>
          <h2 className={styles.sectionTitle}>Kategorine göre keşfet</h2>
          <div className={styles.categoryFilters}>
            {FILTER_TABS.map((tab) => (
              <span 
                key={tab}
                onClick={() => setActiveCategory(tab)}
                className={`${styles.filterPill} ${activeCategory === tab ? styles.filterPillActive : ''}`}
              >
                {tab}
              </span>
            ))}
            
            {DROPDOWN_TABS.map((tab) => (
              <span 
                key={tab}
                onClick={() => setActiveCategory(tab)}
                className={`${styles.filterPillDropdown} ${activeCategory === tab ? styles.filterPillActive : ''}`}
              >
                {tab}
                <ArrowDown01Icon size={18} color="currentColor" strokeWidth={2.5} />
              </span>
            ))}
          </div>

          {/* Promotional Banner (Matches Depop Banner) */}
          <div className={styles.promoBanner}>
            <img 
              src={CATEGORY_BANNERS[activeCategory]?.image} 
              alt="Promo" 
              className={styles.promoImage} 
              style={{ backgroundColor: CATEGORY_BANNERS[activeCategory]?.bg }}
            />
            <div 
              className={styles.promoContent} 
              style={{ 
                background: CATEGORY_BANNERS[activeCategory]?.bg, 
                color: CATEGORY_BANNERS[activeCategory]?.color 
              }}
            >
              <h3 className={styles.promoTitle}>{CATEGORY_BANNERS[activeCategory]?.title}</h3>
              <p className={styles.promoText}>{CATEGORY_BANNERS[activeCategory]?.text}</p>
              <button 
                className={styles.promoButton}
                style={{ 
                  backgroundColor: CATEGORY_BANNERS[activeCategory]?.btnBg, 
                  color: CATEGORY_BANNERS[activeCategory]?.btnColor 
                }}
              >
                {CATEGORY_BANNERS[activeCategory]?.buttonText}
              </button>
              <div className={styles.promoDots}>
                <span 
                  className={styles.promoDot} 
                  style={{ backgroundColor: CATEGORY_BANNERS[activeCategory]?.dotColorActive }}
                ></span>
                <span 
                  className={styles.promoDot} 
                  style={{ backgroundColor: CATEGORY_BANNERS[activeCategory]?.dotColorInactive }}
                ></span>
                <span 
                  className={styles.promoDot} 
                  style={{ backgroundColor: CATEGORY_BANNERS[activeCategory]?.dotColorInactive }}
                ></span>
              </div>
            </div>
          </div>
        </div>

        {/* Shop by style */}
        <div className={styles.styleSection}>
          <h2 className={styles.sectionTitle} style={{ margin: '0 16px 12px 16px' }}>Stiline göre keşfet</h2>
          <div className={styles.styleGrid}>
            <div className={styles.styleCard}>
              <div className={styles.styleImageWrapper}>
                <img src="/style_jacket.png" alt="Hafif Katmanlar" className={styles.styleImage} />
              </div>
              <span className={styles.styleTitle}>Hafif katmanlar</span>
            </div>
            <div className={styles.styleCard}>
              <div className={styles.styleImageWrapper}>
                <img src="/style_yellow.png" alt="Soft Renkler" className={styles.styleImage} />
              </div>
              <span className={styles.styleTitle}>Soft renkler</span>
            </div>
            <div className={styles.styleCard}>
              <div className={styles.styleImageWrapper}>
                <img src="/style_shoes.png" alt="Minik Adımlar" className={styles.styleImage} />
              </div>
              <span className={styles.styleTitle}>Minik Adımlar</span>
            </div>
            <div className={styles.styleCard}>
              <div className={styles.styleImageWrapper}>
                <img src="/style_organic.png" alt="Organik Pamuk" className={styles.styleImage} />
              </div>
              <span className={styles.styleTitle}>Organik Pamuk</span>
            </div>
            <div className={styles.styleCard}>
              <div className={styles.styleImageWrapper}>
                <img src="/style_knit.png" alt="Örgü & Triko" className={styles.styleImage} />
              </div>
              <span className={styles.styleTitle}>Örgü & Triko</span>
            </div>
            <div className={styles.styleCard}>
              <div className={styles.styleImageWrapper}>
                <img src="/style_denim.png" alt="Denim Tutkusu" className={styles.styleImage} />
              </div>
              <span className={styles.styleTitle}>Denim Tutkusu</span>
            </div>
          </div>
        </div>

        {/* Popular brands */}
        <div className={styles.brandSection}>
          <h2 className={styles.sectionTitle} style={{ margin: '0 0 12px 0' }}>Popüler markalar</h2>
          <div className={styles.brandCard}>
            <div className={styles.brandImagesGrid}>
              <img src="https://images.unsplash.com/photo-1611911813383-67769b37a149?w=300" alt="Brand 1" className={styles.brandImage} />
              <img src="https://images.unsplash.com/photo-1622290291165-d341f1938b8a?w=300" alt="Brand 2" className={styles.brandImage} />
              <img src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300" alt="Brand 3" className={styles.brandImage} />
              <img src="https://images.unsplash.com/photo-1560506840-ec148e82a604?w=300" alt="Brand 4" className={styles.brandImage} />
            </div>
            <div className={styles.brandFooter}>
              <span className={styles.brandName}>Zara Baby</span>
              <button className={styles.brandShopBtn}>Keşfet</button>
            </div>
          </div>
        </div>

        {/* Popular this week */}
        <div className={styles.popularWeekSection}>
          <h2 className={styles.sectionTitle} style={{ margin: '0 0 16px 0' }}>Bu hafta popüler</h2>
          <div className={styles.popularGrid}>
            <div className={styles.popularCard}>
              <img src="https://images.unsplash.com/photo-1594150878496-a921e5af8907?w=500" alt="Bebek Ayakkabısı" className={styles.popularImage} />
              <span className={styles.popularTitle}>Bebek Ayakkabısı</span>
              <span className={styles.popularSub}>+1.3k arama</span>
            </div>
            <div className={styles.popularCard}>
              <img src="https://images.unsplash.com/photo-1632337949070-1fdb69fe2159?w=500" alt="Bebek Tulumu" className={styles.popularImage} />
              <span className={styles.popularTitle}>Bebek Tulumu</span>
              <span className={styles.popularSub}>+1.9k arama</span>
            </div>
          </div>
        </div>

        {/* Shop by price */}
        <div className={styles.priceSection}>
          <h2 className={styles.sectionTitle} style={{ margin: '0 0 16px 0' }}>Fiyata göre alışveriş</h2>
          <div className={styles.priceGrid}>
            <button className={styles.priceBtn}><span>100 TL</span>Altı</button>
            <button className={styles.priceBtn}><span>250 TL</span>Altı</button>
            <button className={styles.priceBtn}><span>500 TL</span>Altı</button>
            <button className={styles.priceBtn}><span>1000 TL</span>Altı</button>
          </div>
        </div>
      </div>
      {/* Footer (Matches Depop Screenshot) */}
      <footer className={styles.footer}>
        <div className={styles.footerMenu}>
          <div className={`${styles.footerMenuItem} ${openFooterMenu === 'salutbabe' ? styles.activeTitle : ''}`} onClick={() => setOpenFooterMenu(openFooterMenu === 'salutbabe' ? null : 'salutbabe')}>
            Salutbabe
            <ArrowDown01Icon size={18} color="currentColor" className={openFooterMenu === 'salutbabe' ? styles.arrowOpen : ''} />
          </div>
          <div className={`${styles.footerMenuContent} ${openFooterMenu === 'salutbabe' ? styles.open : ''}`}>
            <ul className={styles.footerSubMenuList}>
              <li className={styles.footerSubMenuItem}>
                <div className={`${styles.footerSubItemHeader} ${openSubMenu === 'hakkimizda' ? styles.active : ''}`} onClick={() => setOpenSubMenu(openSubMenu === 'hakkimizda' ? null : 'hakkimizda')}>
                  Hakkımızda
                </div>
                <div className={`${styles.footerSubItemContent} ${openSubMenu === 'hakkimizda' ? styles.open : ''}`}>
                  Salutbabe, anneden anneye güvenilir, hızlı ve sürdürülebilir bir bebek ve çocuk giyim pazaryeridir. Amacımız kullanılmayan kıyafetlere ikinci bir şans vermek.
                </div>
              </li>
              <li className={styles.footerSubMenuItem}>
                <div className={`${styles.footerSubItemHeader} ${openSubMenu === 'kariyer' ? styles.active : ''}`} onClick={() => setOpenSubMenu(openSubMenu === 'kariyer' ? null : 'kariyer')}>
                  Kariyer
                </div>
                <div className={`${styles.footerSubItemContent} ${openSubMenu === 'kariyer' ? styles.open : ''}`}>
                  Şu an için açık pozisyonumuz bulunmuyor. Ancak ekibimize katılmak isterseniz özgeçmişinizi info@salutbabe.com adresine gönderebilirsiniz.
                </div>
              </li>
              <li className={styles.footerSubMenuItem}>
                <div className={`${styles.footerSubItemHeader} ${openSubMenu === 'blog' ? styles.active : ''}`} onClick={() => setOpenSubMenu(openSubMenu === 'blog' ? null : 'blog')}>
                  Blog
                </div>
                <div className={`${styles.footerSubItemContent} ${openSubMenu === 'blog' ? styles.open : ''}`}>
                  Bebek gelişimi, sürdürülebilir moda, satıcı ipuçları ve annelik serüveni hakkında en güncel yazılarımız çok yakında burada olacak.
                </div>
              </li>
              <li className={styles.footerSubMenuItem}>
                <div className={`${styles.footerSubItemHeader} ${openSubMenu === 'haberler' ? styles.active : ''}`} onClick={() => setOpenSubMenu(openSubMenu === 'haberler' ? null : 'haberler')}>
                  Haberler
                </div>
                <div className={`${styles.footerSubItemContent} ${openSubMenu === 'haberler' ? styles.open : ''}`}>
                  Uygulama güncellemeleri, yeni özellikler ve Salutbabe ile ilgili basında çıkan en son haberler yakında eklenecektir.
                </div>
              </li>
              <li className={styles.footerSubMenuItem}>
                <div className={`${styles.footerSubItemHeader} ${openSubMenu === 'etki' ? styles.active : ''}`} onClick={() => setOpenSubMenu(openSubMenu === 'etki' ? null : 'etki')}>
                  Etki
                </div>
                <div className={`${styles.footerSubItemContent} ${openSubMenu === 'etki' ? styles.open : ''}`}>
                  İkinci el alışverişi teşvik ederek döngüsel ekonomiye katkı sağlıyor, tekstil atıklarını azaltıyor ve karbon ayak izimizi küçültüyoruz.
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className={styles.footerMenu}>
          <div className={`${styles.footerMenuItem} ${openFooterMenu === 'sell' ? styles.activeTitle : ''}`} onClick={() => setOpenFooterMenu(openFooterMenu === 'sell' ? null : 'sell')}>
            Satış Yap
            <ArrowDown01Icon size={18} color="currentColor" className={openFooterMenu === 'sell' ? styles.arrowOpen : ''} />
          </div>
          <div className={`${styles.footerMenuContent} ${openFooterMenu === 'sell' ? styles.open : ''}`}>
            <ul className={styles.footerSubMenuList}>
              <li className={styles.footerSubMenuItem}>
                <div className={`${styles.footerSubItemHeader} ${openSubMenu === 'satis' ? styles.active : ''}`} onClick={() => setOpenSubMenu(openSubMenu === 'satis' ? null : 'satis')}>
                  Salutbabe'te Satış Yap
                </div>
                <div className={`${styles.footerSubItemContent} ${openSubMenu === 'satis' ? styles.open : ''}`}>
                  Kullanmadığınız bebek ve çocuk eşyalarını saniyeler içinde listeleyin, yeni annelerle buluşturun.
                </div>
              </li>
              <li className={styles.footerSubMenuItem}>
                <div className={`${styles.footerSubItemHeader} ${openSubMenu === 'kargo' ? styles.active : ''}`} onClick={() => setOpenSubMenu(openSubMenu === 'kargo' ? null : 'kargo')}>
                  Salutbabe Kargo
                </div>
                <div className={`${styles.footerSubItemContent} ${openSubMenu === 'kargo' ? styles.open : ''}`}>
                  Anlaşmalı kargo firmalarımızla evden çıkmadan uygun fiyata ve güvenle gönderim yapın.
                </div>
              </li>
              <li className={styles.footerSubMenuItem}>
                <div className={`${styles.footerSubItemHeader} ${openSubMenu === 'elciler' ? styles.active : ''}`} onClick={() => setOpenSubMenu(openSubMenu === 'elciler' ? null : 'elciler')}>
                  Salutbabe Elçileri
                </div>
                <div className={`${styles.footerSubItemContent} ${openSubMenu === 'elciler' ? styles.open : ''}`}>
                  Platformumuzu arkadaşlarınıza önererek komisyon kazanın ve topluluğumuzu büyütün.
                </div>
              </li>
              <li className={styles.footerSubMenuItem}>
                <div className={`${styles.footerSubItemHeader} ${openSubMenu === 'insider' ? styles.active : ''}`} onClick={() => setOpenSubMenu(openSubMenu === 'insider' ? null : 'insider')}>
                  Salutbabe Insider Ol
                </div>
                <div className={`${styles.footerSubItemContent} ${openSubMenu === 'insider' ? styles.open : ''}`}>
                  En yeni satıcı özelliklerine ilk siz erişin, özel davetlere ve fırsatlara katılma şansı yakalayın.
                </div>
              </li>
              <li className={styles.footerSubMenuItem}>
                <div className={`${styles.footerSubItemHeader} ${openSubMenu === 'eniyi' ? styles.active : ''}`} onClick={() => setOpenSubMenu(openSubMenu === 'eniyi' ? null : 'eniyi')}>
                  En İyi Satıcı Programı
                </div>
                <div className={`${styles.footerSubItemContent} ${openSubMenu === 'eniyi' ? styles.open : ''}`}>
                  Yüksek puanlı satıcımız olun, listelemelerinizde üst sıralara çıkın ve güvenilirlik rozeti kazanın.
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className={styles.footerMenu}>
          <div className={`${styles.footerMenuItem} ${openFooterMenu === 'help' ? styles.activeTitle : ''}`} onClick={() => setOpenFooterMenu(openFooterMenu === 'help' ? null : 'help')}>
            Yardım
            <ArrowDown01Icon size={18} color="currentColor" className={openFooterMenu === 'help' ? styles.arrowOpen : ''} />
          </div>
          <div className={`${styles.footerMenuContent} ${openFooterMenu === 'help' ? styles.open : ''}`}>
            <ul className={styles.footerSubMenuList}>
              <li className={styles.footerSubMenuItem}>
                <div className={`${styles.footerSubItemHeader} ${openSubMenu === 'merkez' ? styles.active : ''}`} onClick={() => setOpenSubMenu(openSubMenu === 'merkez' ? null : 'merkez')}>
                  Yardım Merkezi
                </div>
                <div className={`${styles.footerSubItemContent} ${openSubMenu === 'merkez' ? styles.open : ''}`}>
                  Sıkça sorulan sorular, kargo takibi ve iade süreçleriyle ilgili tüm detaylara buradan ulaşabilirsiniz.
                </div>
              </li>
              <li className={styles.footerSubMenuItem}>
                <div className={`${styles.footerSubItemHeader} ${openSubMenu === 'guvenlik' ? styles.active : ''}`} onClick={() => setOpenSubMenu(openSubMenu === 'guvenlik' ? null : 'guvenlik')}>
                  Güvenlik Merkezi
                </div>
                <div className={`${styles.footerSubItemContent} ${openSubMenu === 'guvenlik' ? styles.open : ''}`}>
                  Alıcı ve satıcı koruma politikalarımızla ödemeleriniz ve kişisel verileriniz her zaman güvendedir.
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className={styles.footerMenu}>
          <div className={`${styles.footerMenuItem} ${openFooterMenu === 'info' ? styles.activeTitle : ''}`} onClick={() => setOpenFooterMenu(openFooterMenu === 'info' ? null : 'info')}>
            Site Bilgileri
            <ArrowDown01Icon size={18} color="currentColor" className={openFooterMenu === 'info' ? styles.arrowOpen : ''} />
          </div>
          <div className={`${styles.footerMenuContent} ${openFooterMenu === 'info' ? styles.open : ''}`}>
            <ul className={styles.footerSubMenuList}>
              <li className={styles.footerSubMenuItem}>
                <div className={`${styles.footerSubItemHeader} ${openSubMenu === 'gizlilik' ? styles.active : ''}`} onClick={() => setOpenSubMenu(openSubMenu === 'gizlilik' ? null : 'gizlilik')}>
                  Gizlilik Politikası
                </div>
                <div className={`${styles.footerSubItemContent} ${openSubMenu === 'gizlilik' ? styles.open : ''}`}>
                  Kişisel verilerinizin nasıl işlendiğini ve sistemlerimizde nasıl korunduğunu detaylı olarak inceleyin.
                </div>
              </li>
              <li className={styles.footerSubMenuItem}>
                <div className={`${styles.footerSubItemHeader} ${openSubMenu === 'kosul' ? styles.active : ''}`} onClick={() => setOpenSubMenu(openSubMenu === 'kosul' ? null : 'kosul')}>
                  Kullanım Koşulları
                </div>
                <div className={`${styles.footerSubItemContent} ${openSubMenu === 'kosul' ? styles.open : ''}`}>
                  Salutbabe platformunu kullanırken uymanız gereken kurallar, komisyon oranları ve hizmet şartlarımız.
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.footerAppSection}>
          <h4 className={styles.footerAppTitle}>Salutbabe uygulamasını indir</h4>
          <p className={styles.footerAppDesc}>Daha hızlı ilan ver, siparişlerini takip et ve hiçbir fırsatı kaçırma.</p>
          <div className={styles.footerAppBadges}>
            <a href="https://apps.apple.com/us/app/salutbabe/id6759988511" target="_blank" rel="noopener noreferrer">
              <svg width="135" height="40" viewBox="0 0 135 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="135" height="40" rx="5" fill="#111111"/>
                <path d="M22.9566 14.1614C22.9365 11.5303 25.1099 10.228 25.2104 10.1656C23.9431 8.31828 21.9961 8.04018 21.282 8.0121C19.6022 7.84277 17.9926 8.99507 17.1177 8.99507C16.2427 8.99507 14.9351 8.03714 13.527 8.06746C11.7366 8.0954 10.0767 9.10903 9.14125 10.7303C7.23002 14.0456 8.65969 18.9616 10.5103 21.6318C11.4155 22.9366 12.4815 24.4082 13.9192 24.3484C15.3168 24.2885 15.8499 23.4475 17.4792 23.4475C19.1086 23.4475 19.6015 24.3484 21.0594 24.3188C22.5574 24.2885 23.4627 22.9973 24.3479 21.6917C25.3739 20.1947 25.7963 18.7367 25.8164 18.6653C25.7762 18.6441 22.9767 17.5752 22.9566 14.1614Z" fill="white"/>
                <path d="M19.3499 5.86435C20.1143 4.94225 20.6373 3.65485 20.4965 2.37891C19.4103 2.42211 18.0624 3.10263 17.2578 3.99968C16.5436 4.79282 15.92 6.11306 16.0809 7.37039C17.2878 7.46366 18.5852 6.78651 19.3499 5.86435Z" fill="white"/>
                <path d="M43.6067 11.2384C42.0673 11.2384 41.242 12.2267 41.242 13.901V20.1388H43.8642V14.1166C43.8642 13.0871 44.3821 12.7844 45.1963 12.7844C46.0642 12.7844 46.5915 13.1189 46.5915 14.1166V20.1388H49.2137V13.5858C49.2137 11.666 48.2435 11.0827 46.756 11.0827C45.5414 11.0827 44.5939 11.6342 43.8642 12.3995V11.2384H43.6067ZM36.1956 18.2709H36.2168C36.8797 18.2709 37.3853 17.7554 37.3853 17.1118C37.3853 16.4474 36.8797 15.9319 36.2168 15.9319C35.5327 15.9319 35.0378 16.4474 35.0378 17.1118C35.0378 17.7554 35.5433 18.2709 36.1956 18.2709ZM39.9984 15.6946C39.9984 12.8799 38.3242 11.0827 36.1745 11.0827C34.0247 11.0827 32.3506 12.8799 32.3506 15.6946C32.3506 18.4879 34.0247 20.3065 36.1745 20.3065C38.3242 20.3065 39.9984 18.4879 39.9984 15.6946ZM37.3853 15.6946C37.3853 17.37 36.5641 18.2709 35.3326 18.2709V13.1189C36.4377 13.1189 37.3853 14.1166 37.3853 15.6946ZM54.2128 20.3276C55.086 20.3276 55.77 20.0805 56.4013 19.4682L55.4332 17.9015C55.0436 18.2346 54.6754 18.3995 54.1917 18.3995C53.7183 18.3995 53.4764 18.1513 53.4447 17.4753H56.5595C56.5912 17.2069 56.6123 16.9271 56.6123 16.6369C56.6123 14.4777 55.4648 13.414 54.1811 13.414C52.8868 13.414 51.5819 14.52 51.5819 16.8943C51.5819 19.167 52.8129 20.3276 54.2128 20.3276ZM54.5186 16.0392H53.4447C53.5187 15.223 53.8135 14.9009 54.1599 14.9009C54.496 14.9009 54.7279 15.1479 54.7596 15.6845H54.5186V16.0392ZM58.7424 16.5946L57.2483 11.2384H59.574L60.2796 14.1377L60.9118 11.2384H62.9109L63.5432 14.1483L64.2486 11.2384H66.5744L65.0804 16.5946L66.7219 21.9613H64.4068L63.5959 18.9149L62.8055 21.9613H60.4905L58.7424 16.5946ZM70.4705 19.3719V20.1388H71.9751V21.728H70.4705V23.7042H68.3242V21.728H66.8196V20.1388H68.3242V19.3719C68.3242 16.4813 69.1764 15.7082 71.9011 15.7082V17.6515C70.9648 17.6515 70.4705 18.0055 70.4705 19.3719ZM74.5518 12.6346H74.573C75.2359 12.6346 75.7415 12.119 75.7415 11.4754C75.7415 10.811 75.2359 10.2955 74.573 10.2955C73.8889 10.2955 73.394 10.811 73.394 11.4754C73.394 12.119 73.8995 12.6346 74.5518 12.6346ZM78.3546 10.0583C78.3546 7.24354 76.6804 5.44634 74.5307 5.44634C72.381 5.44634 70.7068 7.24354 70.7068 10.0583C70.7068 12.8515 72.381 14.6701 74.5307 14.6701C76.6804 14.6701 78.3546 12.8515 78.3546 10.0583ZM75.7415 10.0583C75.7415 11.7336 74.9204 12.6346 73.6888 12.6346V7.48261C74.7939 7.48261 75.7415 8.48028 75.7415 10.0583ZM82.2612 11.2384V14.1271H81.0825V20.1388H78.4604V14.1271H77.2816V11.2384H82.2612ZM83.7432 20.1388V11.2384H86.3653V20.1388H83.7432ZM89.4184 11.2384C87.879 11.2384 87.0537 12.2267 87.0537 13.901V20.1388H89.6759V14.1166C89.6759 13.0871 90.1938 12.7844 91.008 12.7844C91.8759 12.7844 92.4032 13.1189 92.4032 14.1166V20.1388H95.0254V13.5858C95.0254 11.666 94.0552 11.0827 92.5677 11.0827C91.3531 11.0827 90.4056 11.6342 89.6759 12.3995V11.2384H89.4184ZM100.865 15.6946C100.865 12.8799 99.1908 11.0827 97.0411 11.0827C94.8913 11.0827 93.2172 12.8799 93.2172 15.6946C93.2172 18.4879 94.8913 20.3065 97.0411 20.3065C99.1908 20.3065 100.865 18.4879 100.865 15.6946ZM98.2518 15.6946C98.2518 17.37 97.4307 18.2709 96.1991 18.2709C94.9676 18.2709 94.1465 17.37 94.1465 15.6946C94.1465 14.0297 94.9676 13.1189 96.1991 13.1189C97.4307 13.1189 98.2518 14.0297 98.2518 15.6946ZM102.327 20.1388V11.2384H104.425L106.88 17.5684V11.2384H109.289V20.1388H107.19L104.736 13.8087V20.1388H102.327Z" fill="white"/>
                <path d="M125.048 24.0858V14.5422H120.384V24.0858H117.762V14.5422H113.098V12.1852H125.048V24.0858ZM127.424 24.0858V8.12503H130.046V15.9351C130.659 15.2497 131.785 14.7342 133.242 14.7342C136.035 14.7342 138.483 16.9206 138.483 20.1064C138.483 23.2922 136.035 25.4786 133.242 25.4786C131.785 25.4786 130.659 24.963 130.046 24.2777V24.0858H127.424ZM133.007 23.1235C134.509 23.1235 135.795 21.8488 135.795 20.1064C135.795 18.3639 134.509 17.0892 133.007 17.0892C131.506 17.0892 130.221 18.3639 130.221 20.1064C130.221 21.8488 131.506 23.1235 133.007 23.1235ZM145.471 20.3606C147.26 20.3606 148.657 19.8553 149.957 18.6019L147.965 17.0185C147.16 17.7039 146.402 18.0463 145.418 18.0463C144.444 18.0463 143.943 17.5358 143.882 16.1432H150.276C150.34 15.5901 150.38 15.0118 150.38 14.4137C150.38 10.0076 148.024 7.82283 145.397 7.82283C142.742 7.82283 140.07 10.0827 140.07 14.9376C140.07 19.5898 142.593 21.9613 145.471 21.9613V20.3606ZM146.096 13.1895H143.882C144.032 11.5173 144.64 10.8528 145.352 10.8528C146.045 10.8528 146.52 11.3653 146.584 12.4646H146.096V13.1895Z" fill="white"/>
              </svg>
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.salutbabe&hl=tr" target="_blank" rel="noopener noreferrer">
              <svg width="135" height="40" viewBox="0 0 135 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="135" height="40" rx="5" fill="#111111"/>
                <path d="M42.7162 10.3341C42.7162 11.1969 41.8341 12.0384 41.0567 12.0384C40.4079 12.0384 39.8672 11.5369 39.8672 10.7584C39.8672 9.8741 40.7317 9.03258 41.5269 9.03258C42.1757 9.03258 42.7162 9.53412 42.7162 10.3341ZM42.4746 13.7844V20.1388H39.9984V13.7844H42.4746ZM49.0315 13.7844V15.0061H49.0104C48.5133 14.1956 47.3884 13.6344 46.1332 13.6344C44.0561 13.6344 42.2384 15.3503 42.2384 17.5855C42.2384 19.8207 44.0561 21.5366 46.1332 21.5366C47.3884 21.5366 48.5133 20.9754 49.0104 20.1649H49.0315V21.191C49.0315 22.6565 48.2526 23.4357 46.1755 23.4357C44.488 23.4357 43.4282 22.2514 43.0175 21.2539L40.84 22.1583C41.5317 23.7785 43.2766 25.556 46.1755 25.556C48.9882 25.556 51.4552 23.9016 51.4552 20.7635V13.7844H49.0315ZM46.3065 19.4795C45.0305 19.4795 43.9912 18.42 43.9912 17.0485C43.9912 15.677 45.0305 14.6175 46.3065 14.6175C47.5824 14.6175 48.6006 15.677 48.6006 17.0485C48.6006 18.42 47.5824 19.4795 46.3065 19.4795ZM56.3268 20.1177L55.0717 18.061L54.5531 17.2188L52.887 19.885H52.8659L52.8236 19.9272H52.7592V23.7785H50.294V9.66479H52.7592V16.3533H52.8659L55.5369 13.6823H58.4871L55.0505 17.1189L58.9197 23.7785H56.0945L56.3268 20.1177ZM62.8808 19.3331H67.2307V21.1206H62.8808V23.7785H68.0318V25.556H60.4046V13.7844H68.0318V15.562H62.8808V17.5552H67.2307V19.3331H62.8808Z" fill="white"/>
                <path d="M72.25 15.5513H75.1274V25.556H77.6046V15.5513H80.482V13.7844H72.25V15.5513ZM85.5134 23.7785V13.7844H88.0009V25.556H85.5134V23.7785ZM94.8874 19.4795C93.6114 19.4795 92.5721 18.42 92.5721 17.0485C92.5721 15.677 93.6114 14.6175 94.8874 14.6175C96.1633 14.6175 97.2026 15.677 97.2026 17.0485C97.2026 18.42 96.1633 19.4795 94.8874 19.4795ZM94.8874 13.6344C92.8103 13.6344 91.0963 15.3503 91.0963 17.5855C91.0963 19.8207 92.8103 21.5366 94.8874 21.5366C96.9644 21.5366 98.6784 19.8207 98.6784 17.5855C98.6784 15.3503 96.9644 13.6344 94.8874 13.6344Z" fill="white"/>
                <path d="M107.575 14.4907L103.528 24.3644H103.486L103.465 24.3855H103.444L103.423 24.3644H103.38L99.3333 14.4907H102.083L103.465 18.5779H103.486L104.825 14.4907H107.575Z" fill="white"/>
              </svg>
            </a>
          </div>
          <div className={styles.footerSocials}>
            {/* Simple SVGs for X, IG, TikTok matching Depop style */}
            <a href="https://x.com/salutbabecom" target="_blank" rel="noopener noreferrer">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="4" x2="20" y2="20"></line><line x1="20" y1="4" x2="4" y2="20"></line></svg>
            </a>
            <a href="https://instagram.com/salutbabecom" target="_blank" rel="noopener noreferrer">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="https://tiktok.com/@salutbabecom" target="_blank" rel="noopener noreferrer">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
            </a>
          </div>
        </div>
        
        <div className={styles.footerRegion}>
          Türkiye
          <ArrowDown01Icon size={18} color="currentColor" />
        </div>
      </footer>
    </>
  );
}
