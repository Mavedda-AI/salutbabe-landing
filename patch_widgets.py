import re

def patch_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "import {useThemeLanguage}" not in content:
        content = content.replace("import React", "import React from 'react';\nimport {useThemeLanguage} from '@/context/ThemeLanguageContext';\nimport {") 
        content = content.replace("import React from 'react';\nimport React from 'react';", "import React from 'react';")
    
    if "const { t } = useThemeLanguage();" not in content:
        content = re.sub(r'(export default function [a-zA-Z0-9_]+\([^)]*\)\s*\{)', r'\1\n  const { t } = useThemeLanguage();', content)
        
    for old, new in replacements.items():
        content = content.replace(old, new)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# 1. BrandGridWidget
patch_file('src/components/widgets/BrandGridWidget.tsx', {
    '>Popüler markalar<': '>{t("widgets.brands_title")}<',
    '>Keşfet<': '>{t("widgets.discover")}<'
})

# 2. BundleWidget
patch_file('src/components/widgets/BundleWidget.tsx', {
    '>Annelerin Sepetleri<': '>{t("widgets.bundles_title")}<',
    '>Yenidoğan Paketi<': '>{t("widgets.newborn_bundle")}<',
    '>Hastane Çıkışı Sepeti<': '>{t("widgets.hospital_bundle")}<',
    '>Kışlık Bebek Paketi<': '>{t("widgets.winter_bundle")}<',
    '>İkiz Bebek Kombini<': '>{t("widgets.twin_bundle")}<',
    '>Tümünü Gör<': '>{t("widgets.see_all")}<'
})

# 3. CategoryFilterWidget
patch_file('src/components/widgets/CategoryFilterWidget.tsx', {
    "'Tümü'": "t('widgets.category_all')",
    "'Kız Bebek'": "t('widgets.category_girl')",
    "'Erkek Bebek'": "t('widgets.category_boy')",
    "'Yenidoğan'": "t('widgets.category_newborn')",
    "'Hamile'": "t('widgets.category_pregnant')",
    "'Oyuncak'": "t('widgets.category_toy')",
    "'Ayakkabı'": "t('widgets.category_shoes')"
})

# 4. MosaicWidget
patch_file('src/components/widgets/MosaicWidget.tsx', {
    '>Sizin İçin Seçilenler<': '>{t("widgets.mosaic_title")}<',
})

# 5. PriceGridWidget
patch_file('src/components/widgets/PriceGridWidget.tsx', {
    '>Fiyata Göre Alışveriş<': '>{t("widgets.price_title")}<',
    '>₺250 Altı<': '>{t("widgets.price_under_250")}<',
    '>₺250 - ₺500<': '>{t("widgets.price_250_500")}<',
    '>₺500 - ₺1000<': '>{t("widgets.price_500_1000")}<',
    '>₺1000 Üzeri<': '>{t("widgets.price_over_1000")}<'
})

# 6. RankingWidget
patch_file('src/components/widgets/RankingWidget.tsx', {
    '>Haftanın En Çok Etkileşim Alanları<': '>{t("widgets.ranking_title")}<'
})

# 7. StyleGridWidget
patch_file('src/components/widgets/StyleGridWidget.tsx', {
    '>Tarzına Göre Keşfet<': '>{t("widgets.style_title")}<',
    '>Boho Tarz<': '>{t("widgets.style_boho")}<',
    '>Minimalist<': '>{t("widgets.style_minimalist")}<',
    '>Sportif<': '>{t("widgets.style_sporty")}<',
    '>Klasik<': '>{t("widgets.style_classic")}<'
})

# 8. CountrySelectorFooter
# It already uses useThemeLanguage!
with open('src/components/widgets/CountrySelectorFooter.tsx', 'r', encoding='utf-8') as f:
    cs_content = f.read()

cs_content = cs_content.replace(">Şunlar da İlginizi Çekebilir<", ">{t('widgets.country_seo_title')}<")
cs_content = cs_content.replace(">Vintage Bebek Elbiseleri<", ">{t('widgets.country_seo_link')}<")
cs_content = cs_content.replace(">Salutbabe uygulamasını indirin<", ">{t('widgets.country_app_title')}<")
cs_content = cs_content.replace(">Daha hızlı listeleyin, siparişlerinizi takip edin ve hiçbir yeniliği kaçırmayın.<", ">{t('widgets.country_app_desc')}<")
cs_content = cs_content.replace("title: 'Nasıl Satış Yaparım?'", "title: t('widgets.footer_sell')")
cs_content = cs_content.replace("content: 'Salutbabe\\'de satış yapmak çok kolay! Ürün fotoğrafını çek, açıklamanı yaz ve ücretsiz olarak listele. Alıcı bulunduğunda güvenli kargo ile gönderim yap.'", "content: t('widgets.footer_sell_desc')")
cs_content = cs_content.replace("title: 'Sıkça Sorulan Sorular'", "title: t('widgets.footer_faq')")
cs_content = cs_content.replace("content: 'Ödemeler, kargo süreçleri ve iade koşulları hakkında en çok merak edilen soruların yanıtlarına canlı destek merkezimizden ulaşabilirsiniz.'", "content: t('widgets.footer_faq_desc')")
cs_content = cs_content.replace("title: 'Kargo ve Teslimat'", "title: t('widgets.footer_shipping')")
cs_content = cs_content.replace("content: 'Siparişleriniz anlaşmalı kargo firmalarımız ile 1-3 iş günü içerisinde güvenle adresinize teslim edilir. Kargo takibini hesabınızdan yapabilirsiniz.'", "content: t('widgets.footer_shipping_desc')")
cs_content = cs_content.replace("title: 'Kullanıcı Sözleşmesi'", "title: t('widgets.footer_terms')")
cs_content = cs_content.replace("content: 'Platformumuzu kullanırken hem alıcıları hem de satıcıları koruyan güncel kurallarımız ve yasal yükümlülükler bu sözleşme çatısı altında yer almaktadır.'", "content: t('widgets.footer_terms_desc')")
cs_content = cs_content.replace("title: 'Gizlilik Politikası'", "title: t('widgets.footer_privacy')")
cs_content = cs_content.replace("content: 'Kişisel verileriniz üst düzey güvenlik önlemleriyle korunmakta olup, üçüncü şahıslarla asla paylaşılmamaktadır. Detaylar için KVKK metnini inceleyebilirsiniz.'", "content: t('widgets.footer_privacy_desc')")
cs_content = cs_content.replace("title: 'Hakkımızda'", "title: t('widgets.footer_about')")
cs_content = cs_content.replace("content: 'Salutbabe, annelerin bebek ve çocuk kıyafetlerini güvenle alıp satabileceği, sürdürülebilir modaya katkı sağlayan Türkiye\\'nin en güvenilir ikinci el alışveriş topluluğudur.'", "content: t('widgets.footer_about_desc')")

if "const { t } = useThemeLanguage();" not in cs_content:
    cs_content = cs_content.replace("const { language, setLanguage } = useThemeLanguage();", "const { language, setLanguage, t } = useThemeLanguage();")

with open('src/components/widgets/CountrySelectorFooter.tsx', 'w', encoding='utf-8') as f:
    f.write(cs_content)

print("Widgets patched successfully!")
