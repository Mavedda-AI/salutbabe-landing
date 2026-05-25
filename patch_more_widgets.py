import glob
import re

def patch_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "import {useThemeLanguage}" not in content:
        content = content.replace("import React", "import React from 'react';\nimport {useThemeLanguage} from '@/context/ThemeLanguageContext';\nimport {") 
        content = content.replace("import React from 'react';\nimport React from 'react';", "import React from 'react';")
    
    if "const { t } = useThemeLanguage();" not in content and "const { language, setLanguage, t }" not in content and "const { t, language }" not in content:
        content = re.sub(r'(export default function [a-zA-Z0-9_]+\([^)]*\)\s*\{)', r'\1\n  const { t } = useThemeLanguage();', content)
        
    for old, new in replacements.items():
        content = content.replace(old, new)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# 1. MosaicWidget (sold stamp)
patch_file('src/components/widgets/MosaicWidget.tsx', {
    'Üzgünüz': '{t("widgets.sold_out_sorry")}',
    'SATILDI': '{t("widgets.sold_out_stamp")}'
})

# 2. PopularGridWidget
patch_file('src/components/widgets/PopularGridWidget.tsx', {
    '>Bebek Ayakkabısı<': '>{t("widgets.popular_shoes")}<',
    'alt="Bebek Ayakkabısı"': 'alt={t("widgets.popular_shoes")}',
    '>Bebek Tulumu<': '>{t("widgets.popular_romper")}<',
    'alt="Bebek Tulumu"': 'alt={t("widgets.popular_romper")}',
    '>Kız Çocuk Elbise<': '>{t("widgets.popular_dress")}<',
    'alt="Kız Çocuk Elbise"': 'alt={t("widgets.popular_dress")}'
})

# 3. CategoryFilterWidget
patch_file('src/components/widgets/CategoryFilterWidget.tsx', {
    '"Alışverişe Başla"': 't("widgets.category_all_button")',
    '"Annelerin İhtiyaçları"': 't("widgets.category_mom_title")',
    '"Hamilelikten lohusalığa tüm ihtiyaçların."': 't("widgets.category_mom_desc")',
    '"Anne Ürünlerini Keşfet"': 't("widgets.category_mom_button")',
    '"Bebek Dünyası"': 't("widgets.category_baby_title")',
    '"Bebek Ürünleri"': 't("widgets.category_baby_button")',
    '"Çocuk Modası"': 't("widgets.category_child_title")',
    '"Çocuk Giyimi Keşfet"': 't("widgets.category_child_button")',
    '"Bedene Göre Seçim"': 't("widgets.category_size_title")',
    '"Markaya Göre Seçim"': 't("widgets.category_brand_title")',
    '"Markaları Gör"': 't("widgets.category_brand_button")'
})

# 4. PublicHero
patch_file('src/components/PublicHero.tsx', {
    'isBuy ? "Hemen Keşfet" : isSell ? "Hemen Sat" : isLive ? "Odalara Katıl" : isStory ? "Hikayeni Oluştur" : "Doğalı Keşfet"': "isBuy ? t('widgets.hero_discover_now') : isSell ? t('widgets.hero_sell_now') : isLive ? t('widgets.hero_join_rooms') : isStory ? t('widgets.hero_create_story') : t('widgets.hero_discover_natural')",
    'title: "Keşfet & Öğren"': 'title: t("widgets.hero_card3_title")',
    'desc: "Bilgi al, ilan paylaş"': 'desc: t("widgets.hero_card3_desc")'
})

# 5. MobileDrawer
patch_file('src/components/MobileDrawer.tsx', {
    "name: 'Oyuncak'": "name: t('widgets.drawer_toy')",
    "name: 'Araç & Gereç'": "name: t('widgets.drawer_equipment')",
    "name: 'Markalar'": "name: t('widgets.drawer_brands')",
    "name: 'İndirim'": "name: t('widgets.drawer_sale')",
    "name: 'Hakkımızda'": "name: t('widgets.drawer_about')",
    "name: 'Gizlilik'": "name: t('widgets.drawer_privacy')"
})

# 6. CartDrawer
patch_file('src/components/CartDrawer.tsx', {
    '>Sepetim<': '>{t("widgets.cart_title")}<',
    '>Sepetin şu an boş<': '>{t("widgets.cart_empty")}<',
    '>Alışverişe Başla<': '>{t("widgets.cart_start_shopping")}<'
})

# 7. Header
patch_file('src/components/Header.tsx', {
    '>Kaydol<': '>{t("widgets.header_register")}<'
})

# 8. RankingWidget
patch_file('src/components/widgets/RankingWidget.tsx', {
    'extraStat = "Popüler"': 'extraStat = t("widgets.ranking_popular")'
})

print("More widgets patched successfully!")
