import re

# 1. Header.tsx
with open('src/components/Header.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('"Satıcı Paneli"', 't("widgets.header_seller_panel")')
content = content.replace('placeholder="İstediğini ara"', 'placeholder={t("widgets.header_search_placeholder")}')
content = content.replace('>Satıcı Paneli<', '>{t("widgets.header_seller_panel")}<')

with open('src/components/Header.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

# 2. PublicHero.tsx
with open('src/components/PublicHero.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Tabs
content = content.replace('>Al<', '>{t("widgets.hero_tab_buy")}<')
content = content.replace('>Sat<', '>{t("widgets.hero_tab_sell")}<')
content = content.replace('>Canlı Odalar<', '>{t("widgets.hero_tab_live")}<')
content = content.replace('>Hikayemiz<', '>{t("widgets.hero_tab_story")}<')
content = content.replace('>Salut Organik<', '>{t("widgets.hero_tab_organic")}<')

# Headlines
content = content.replace('<span>İkinci el al.<br />Kendi tarzını oluştur.</span>', '<span>{t("widgets.hero_headline_buy_1")}<br />{t("widgets.hero_headline_buy_2")}</span>')
content = content.replace('<span>Dolabını nakite çevir.<br />Hemen kazanmaya başla.</span>', '<span>{t("widgets.hero_headline_sell_1")}<br />{t("widgets.hero_headline_sell_2")}</span>')
content = content.replace('<span>Sesli odalarda buluş.<br />Deneyimlerini paylaş.</span>', '<span>{t("widgets.hero_headline_live_1")}<br />{t("widgets.hero_headline_live_2")}</span>')
content = content.replace('<span>Her Annenin<br />bir hikayesi vardır.</span>', '<span>{t("widgets.hero_headline_story_1")}<br />{t("widgets.hero_headline_story_2")}</span>')
content = content.replace('<span>Çiftçiden ve anneden.<br />Doğadan bebeğinize.</span>', '<span>{t("widgets.hero_headline_organic_1")}<br />{t("widgets.hero_headline_organic_2")}</span>')

# Subheads
content = content.replace('<span>Sürdürülebilir ve güvenilir ikinci el alışveriş.</span>', '<span>{t("widgets.hero_subhead_buy")}</span>')
content = content.replace('<span>Küçülenleri kolayca sat, aile bütçene anında katkı sağla.</span>', '<span>{t("widgets.hero_subhead_sell")}</span>')
content = content.replace('<span>Sesli odalara katıl, annelerle sohbet et ve ilanları ilk sen keşfet.</span>', '<span>{t("widgets.hero_subhead_live")}</span>')
content = content.replace('<span>Bu sadece bir alışveriş platformu değil, büyük bir paylaşım kültürü.</span>', '<span>{t("widgets.hero_subhead_story")}</span>')
content = content.replace('<span>Çiftçiler ve üreten annelerin ürünlerini keşfedin.</span>', '<span>{t("widgets.hero_subhead_organic")}</span>')

# Card 1
content = content.replace('"Güvenle Al" : isSell ? "Güvenle Sat" : isLive ? "Güvenli Sohbet" : isStory ? "Güvenli Alan" : "Doğal Üretim"', 't("widgets.hero_card1_buy") : isSell ? t("widgets.hero_card1_sell") : isLive ? t("widgets.hero_card1_live") : isStory ? t("widgets.hero_card1_story") : t("widgets.hero_card1_organic")')
content = content.replace('"Katkısız ve saf" : "Salutbabe Koruması"', 't("widgets.hero_card1_desc_organic") : t("widgets.hero_card1_desc_default")')

# Card 2
content = content.replace('title: "2M+", desc: "Satıştaki ürün"', 'title: t("widgets.hero_card2_buy_title"), desc: t("widgets.hero_card2_buy_desc")')
content = content.replace('title: "%0 Komisyon", desc: "Kazancın sana kalsın"', 'title: t("widgets.hero_card2_sell_title"), desc: t("widgets.hero_card2_sell_desc")')
content = content.replace('title: "300+", desc: "Aktif Oda"', 'title: t("widgets.hero_card2_live_title"), desc: t("widgets.hero_card2_live_desc")')
content = content.replace('title: "Herkes", desc: "Eşit ve değerli"', 'title: t("widgets.hero_card2_story_title"), desc: t("widgets.hero_card2_story_desc")')
content = content.replace('title: "Sertifikalı", desc: "Organik tarım"', 'title: t("widgets.hero_card2_organic_title"), desc: t("widgets.hero_card2_organic_desc")')

# Card 3
content = content.replace('title: "10K+", desc: "Her gün yeni ilan"', 'title: t("widgets.hero_card3_buy_title"), desc: t("widgets.hero_card3_buy_desc")')
content = content.replace('title: "Hızlı Satış", desc: "Milyonlarca alıcı"', 'title: t("widgets.hero_card3_sell_title"), desc: t("widgets.hero_card3_sell_desc")')
content = content.replace('title: t("widgets.hero_card3_title"), desc: t("widgets.hero_card3_desc")', 'title: t("widgets.hero_card3_live_title"), desc: t("widgets.hero_card3_live_desc")') # Wait I already replaced this partially in earlier script!
# Fallback for Card 3 if the previous script replaced it:
content = content.replace('title: "Gerçek", desc: "Deneyimler"', 'title: t("widgets.hero_card3_story_title"), desc: t("widgets.hero_card3_story_desc")')
content = content.replace('title: "Sağlıklı", desc: "Gelecek için"', 'title: t("widgets.hero_card3_organic_title"), desc: t("widgets.hero_card3_organic_desc")')

# Wait, let me explicitly handle card3 live since it might be in an intermediate state.
content = content.replace('card3 = { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.featureIcon}><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>, title: t("widgets.hero_card3_title"), desc: t("widgets.hero_card3_desc") };', 'card3 = { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.featureIcon}><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>, title: t("widgets.hero_card3_live_title"), desc: t("widgets.hero_card3_live_desc") };')


with open('src/components/PublicHero.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("More widgets patched successfully!")
