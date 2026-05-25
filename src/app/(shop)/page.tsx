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
            <div className={styles.styleCard}>
              <div className={styles.styleImageWrapper}>
                <img src="https://images.unsplash.com/photo-1546015720-b8b30df5aa27?w=500" alt="Sokak Stili" className={styles.styleImage} />
              </div>
              <span className={styles.styleTitle}>Sokak Stili</span>
            </div>
            <div className={styles.styleCard}>
              <div className={styles.styleImageWrapper}>
                <img src="https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=500" alt="Özel Tasarımlar" className={styles.styleImage} />
              </div>
              <span className={styles.styleTitle}>Özel Tasarımlar</span>
            </div>
          </div>
        </div>

        {/* Popular brands */}
        <div className={styles.brandSection}>
          <h2 className={styles.sectionTitle} style={{ margin: '0 16px 16px 16px' }}>Popüler markalar</h2>
          <div className={styles.brandGrid}>
            <div className={styles.brandCard}>
              <div className={styles.brandImagesGrid}>
                <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300" alt="Brand 1" className={styles.brandImage} />
                <img src="https://images.unsplash.com/photo-1542355581-caf7454785ca?w=300" alt="Brand 2" className={styles.brandImage} />
                <img src="https://images.unsplash.com/photo-1543346242-2b8e41fb91ca?w=300" alt="Brand 3" className={styles.brandImage} />
                <img src="https://images.unsplash.com/photo-1546015720-b8b30df5aa27?w=300" alt="Brand 4" className={styles.brandImage} />
              </div>
              <div className={styles.brandFooter}>
                <span className={styles.brandName}>Zara Baby</span>
                <button className={styles.brandShopBtn}>Keşfet</button>
              </div>
            </div>
            
            <div className={styles.brandCard}>
              <div className={styles.brandImagesGrid}>
                <img src="https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=300" alt="Brand 1" className={styles.brandImage} />
                <img src="https://images.unsplash.com/photo-1569974641446-22542de88536?w=300" alt="Brand 2" className={styles.brandImage} />
                <img src="https://images.unsplash.com/photo-1616666428759-679a7d578307?w=300" alt="Brand 3" className={styles.brandImage} />
                <img src="https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=300" alt="Brand 4" className={styles.brandImage} />
              </div>
              <div className={styles.brandFooter}>
                <span className={styles.brandName}>H&M Kids</span>
                <button className={styles.brandShopBtn}>Keşfet</button>
              </div>
            </div>

            <div className={styles.brandCard}>
              <div className={styles.brandImagesGrid}>
                <img src="https://images.unsplash.com/photo-1622290291720-ac961c43ee30?w=300" alt="Brand 1" className={styles.brandImage} />
                <img src="https://images.unsplash.com/photo-1622290319146-7b63df48a635?w=300" alt="Brand 2" className={styles.brandImage} />
                <img src="https://images.unsplash.com/photo-1684244160171-97f5dac39204?w=300" alt="Brand 3" className={styles.brandImage} />
                <img src="https://images.unsplash.com/photo-1522771930-78848d9293e8?w=300" alt="Brand 4" className={styles.brandImage} />
              </div>
              <div className={styles.brandFooter}>
                <span className={styles.brandName}>Mango Kids</span>
                <button className={styles.brandShopBtn}>Keşfet</button>
              </div>
            </div>

            <div className={styles.brandCard}>
              <div className={styles.brandImagesGrid}>
                <img src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300" alt="Brand 1" className={styles.brandImage} />
                <img src="https://images.unsplash.com/photo-1622290291165-d341f1938b8a?w=300" alt="Brand 2" className={styles.brandImage} />
                <img src="https://images.unsplash.com/photo-1611911813383-67769b37a149?w=300" alt="Brand 3" className={styles.brandImage} />
                <img src="https://images.unsplash.com/photo-1560506840-ec148e82a604?w=300" alt="Brand 4" className={styles.brandImage} />
              </div>
              <div className={styles.brandFooter}>
                <span className={styles.brandName}>LC Waikiki</span>
                <button className={styles.brandShopBtn}>Keşfet</button>
              </div>
            </div>
          </div>
        </div>

        {/* Popular this week */}
        <div className={styles.popularWeekSection}>
          <h2 className={styles.sectionTitle} style={{ margin: '0 16px 16px 16px' }}>Bu hafta popüler</h2>
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
            <div className={styles.popularCard}>
              <img src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500" alt="Mavi Gömlek" className={styles.popularImage} />
              <span className={styles.popularTitle}>Yazlık Elbise</span>
              <span className={styles.popularSub}>+2.4k arama</span>
            </div>
            <div className={styles.popularCard}>
              <img src="https://images.unsplash.com/photo-1560506840-ec148e82a604?w=500" alt="Kız Çocuk Elbise" className={styles.popularImage} />
              <span className={styles.popularTitle}>Kız Çocuk Elbise</span>
              <span className={styles.popularSub}>+1.1k arama</span>
            </div>
          </div>
        </div>

        {/* Shop by price */}
        <div className={styles.priceSection}>
          <h2 className={styles.sectionTitle} style={{ margin: '0 16px 16px 16px' }}>Fiyata göre alışveriş</h2>
          <div className={styles.priceGrid}>
            <button className={styles.priceBtn}><span>100 TL</span>Altı</button>
            <button className={styles.priceBtn}><span>200 TL</span>Altı</button>
            <button className={styles.priceBtn}><span>500 TL</span>Altı</button>
            <button className={styles.priceBtn}><span>1000 TL</span>Altı</button>
          </div>
        </div>
      </div>
      {/* Footer (Matches Depop Screenshot) */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
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
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className={styles.footerBadge} />
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.salutbabe&hl=tr" target="_blank" rel="noopener noreferrer">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className={styles.footerBadge} />
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
        </div>
        
        <div className={styles.footerRegion}>
          Türkiye
          <ArrowDown01Icon size={18} color="currentColor" />
        </div>
      </footer>
    </>
  );
}
