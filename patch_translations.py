import json

locales = ['tr', 'en', 'de', 'fr']
new_translations = {
    'brands_title': {'tr': "Popüler markalar", 'en': "Popular Brands", 'de': "Beliebte Marken", 'fr': "Marques Populaires"},
    'discover': {'tr': "Keşfet", 'en': "Discover", 'de': "Entdecken", 'fr': "Découvrir"},
    'bundles_title': {'tr': "Annelerin Sepetleri", 'en': "Mothers' Bundles", 'de': "Mütter-Pakete", 'fr': "Paniers des Mères"},
    'newborn_bundle': {'tr': "Yenidoğan Paketi", 'en': "Newborn Bundle", 'de': "Neugeborenen-Paket", 'fr': "Panier Nouveau-Né"},
    'hospital_bundle': {'tr': "Hastane Çıkışı Sepeti", 'en': "Hospital Exit Bundle", 'de': "Krankenhaus-Austrittspaket", 'fr': "Panier Sortie d'Hôpital"},
    'winter_bundle': {'tr': "Kışlık Bebek Paketi", 'en': "Winter Baby Bundle", 'de': "Winter-Babypaket", 'fr': "Panier Bébé Hiver"},
    'twin_bundle': {'tr': "İkiz Bebek Kombini", 'en': "Twin Baby Combo", 'de': "Zwillings-Baby-Kombi", 'fr': "Combo Bébés Jumeaux"},
    'see_all': {'tr': "Tümünü Gör", 'en': "See All", 'de': "Alle ansehen", 'fr': "Voir Tout"},
    'category_all': {'tr': "Tümü", 'en': "All", 'de': "Alle", 'fr': "Tout"},
    'category_girl': {'tr': "Kız Bebek", 'en': "Baby Girl", 'de': "Baby-Mädchen", 'fr': "Bébé Fille"},
    'category_boy': {'tr': "Erkek Bebek", 'en': "Baby Boy", 'de': "Baby-Junge", 'fr': "Bébé Garçon"},
    'category_newborn': {'tr': "Yenidoğan", 'en': "Newborn", 'de': "Neugeboren", 'fr': "Nouveau-Né"},
    'category_pregnant': {'tr': "Hamile", 'en': "Pregnant", 'de': "Schwanger", 'fr': "Enceinte"},
    'category_toy': {'tr': "Oyuncak", 'en': "Toy", 'de': "Spielzeug", 'fr': "Jouet"},
    'category_shoes': {'tr': "Ayakkabı", 'en': "Shoes", 'de': "Schuhe", 'fr': "Chaussures"},
    'mosaic_title': {'tr': "Sizin İçin Seçilenler", 'en': "Picked for You", 'de': "Für Sie Ausgewählt", 'fr': "Sélectionné Pour Vous"},
    'price_title': {'tr': "Fiyata Göre Alışveriş", 'en': "Shop by Price", 'de': "Nach Preis Einkaufen", 'fr': "Acheter par Prix"},
    'price_under_250': {'tr': "₺250 Altı", 'en': "Under ₺250", 'de': "Unter ₺250", 'fr': "Moins de ₺250"},
    'price_250_500': {'tr': "₺250 - ₺500", 'en': "₺250 - ₺500", 'de': "₺250 - ₺500", 'fr': "₺250 - ₺500"},
    'price_500_1000': {'tr': "₺500 - ₺1000", 'en': "₺500 - ₺1000", 'de': "₺500 - ₺1000", 'fr': "₺500 - ₺1000"},
    'price_over_1000': {'tr': "₺1000 Üzeri", 'en': "Over ₺1000", 'de': "Über ₺1000", 'fr': "Plus de ₺1000"},
    'ranking_title': {'tr': "Haftanın En Çok Etkileşim Alanları", 'en': "Most Engaged of the Week", 'de': "Meiste Interaktionen der Woche", 'fr': "Les Plus Engagés de la Semaine"},
    'style_title': {'tr': "Tarzına Göre Keşfet", 'en': "Discover by Style", 'de': "Nach Stil Entdecken", 'fr': "Découvrir par Style"},
    'style_boho': {'tr': "Boho Tarz", 'en': "Boho Style", 'de': "Boho-Stil", 'fr': "Style Boho"},
    'style_minimalist': {'tr': "Minimalist", 'en': "Minimalist", 'de': "Minimalistisch", 'fr': "Minimaliste"},
    'style_sporty': {'tr': "Sportif", 'en': "Sporty", 'de': "Sportlich", 'fr': "Sportif"},
    'style_classic': {'tr': "Klasik", 'en': "Classic", 'de': "Klassisch", 'fr': "Classique"},
    'country_seo_title': {'tr': "Şunlar da İlginizi Çekebilir", 'en': "You might also like", 'de': "Das könnte Ihnen auch gefallen", 'fr': "Vous aimerez peut-être aussi"},
    'country_seo_link': {'tr': "Vintage Bebek Elbiseleri", 'en': "Vintage Baby Dresses", 'de': "Vintage Babykleider", 'fr': "Robes Bébé Vintage"},
    'country_app_title': {'tr': "Salutbabe uygulamasını indirin", 'en': "Download Salutbabe app", 'de': "Laden Sie die Salutbabe-App herunter", 'fr': "Téléchargez l'application Salutbabe"},
    'country_app_desc': {'tr': "Daha hızlı listeleyin, siparişlerinizi takip edin ve hiçbir yeniliği kaçırmayın.", 'en': "List faster, track your orders and never miss an update.", 'de': "Schneller auflisten, Bestellungen verfolgen und keine Neuigkeiten verpassen.", 'fr': "Mettez en ligne plus rapidement, suivez vos commandes et ne manquez aucune nouveauté."},
    'footer_sell': {'tr': "Nasıl Satış Yaparım?", 'en': "How to Sell?", 'de': "Wie verkaufe ich?", 'fr': "Comment vendre ?"},
    'footer_sell_desc': {'tr': "Salutbabe'de satış yapmak çok kolay! Ürün fotoğrafını çek, açıklamanı yaz ve ücretsiz olarak listele. Alıcı bulunduğunda güvenli kargo ile gönderim yap.", 'en': "Selling on Salutbabe is very easy! Take a product photo, write a description, and list for free. Ship securely when a buyer is found.", 'de': "Verkaufen auf Salutbabe ist sehr einfach! Mache ein Produktfoto, schreibe eine Beschreibung und liste es kostenlos. Sicher versenden, wenn ein Käufer gefunden ist.", 'fr': "Vendre sur Salutbabe est très facile ! Prenez une photo du produit, rédigez une description et mettez en ligne gratuitement. Expédiez en toute sécurité lorsqu'un acheteur est trouvé."},
    'footer_faq': {'tr': "Sıkça Sorulan Sorular", 'en': "FAQ", 'de': "Häufig gestellte Fragen", 'fr': "FAQ"},
    'footer_faq_desc': {'tr': "Ödemeler, kargo süreçleri ve iade koşulları hakkında en çok merak edilen soruların yanıtlarına canlı destek merkezimizden ulaşabilirsiniz.", 'en': "You can find answers to the most frequently asked questions about payments, shipping processes, and return conditions in our live support center.", 'de': "Antworten auf die am häufigsten gestellten Fragen zu Zahlungen, Versandprozessen und Rückgabebedingungen finden Sie in unserem Live-Support-Center.", 'fr': "Vous pouvez trouver les réponses aux questions les plus fréquemment posées sur les paiements, les processus d'expédition et les conditions de retour dans notre centre d'assistance en direct."},
    'footer_shipping': {'tr': "Kargo ve Teslimat", 'en': "Shipping and Delivery", 'de': "Versand und Lieferung", 'fr': "Expédition et Livraison"},
    'footer_shipping_desc': {'tr': "Siparişleriniz anlaşmalı kargo firmalarımız ile 1-3 iş günü içerisinde güvenle adresinize teslim edilir. Kargo takibini hesabınızdan yapabilirsiniz.", 'en': "Your orders are safely delivered to your address within 1-3 business days by our contracted shipping companies. You can track your shipment from your account.", 'de': "Ihre Bestellungen werden von unseren Vertragspartnern innerhalb von 1-3 Werktagen sicher an Ihre Adresse geliefert. Sie können Ihre Sendung von Ihrem Konto aus verfolgen.", 'fr': "Vos commandes sont livrées en toute sécurité à votre adresse dans un délai de 1 à 3 jours ouvrables par nos partenaires d'expédition. Vous pouvez suivre votre envoi depuis votre compte."},
    'footer_terms': {'tr': "Kullanıcı Sözleşmesi", 'en': "User Agreement", 'de': "Nutzervereinbarung", 'fr': "Accord Utilisateur"},
    'footer_terms_desc': {'tr': "Platformumuzu kullanırken hem alıcıları hem de satıcıları koruyan güncel kurallarımız ve yasal yükümlülükler bu sözleşme çatısı altında yer almaktadır.", 'en': "Our current rules and legal obligations that protect both buyers and sellers while using our platform are included under this agreement.", 'de': "Unsere aktuellen Regeln und rechtlichen Verpflichtungen, die sowohl Käufer als auch Verkäufer bei der Nutzung unserer Plattform schützen, sind in dieser Vereinbarung enthalten.", 'fr': "Nos règles actuelles et obligations légales qui protègent à la fois les acheteurs et les vendeurs lors de l'utilisation de notre plateforme sont incluses dans cet accord."},
    'footer_privacy': {'tr': "Gizlilik Politikası", 'en': "Privacy Policy", 'de': "Datenschutzrichtlinie", 'fr': "Politique de Confidentialité"},
    'footer_privacy_desc': {'tr': "Kişisel verileriniz üst düzey güvenlik önlemleriyle korunmakta olup, üçüncü şahıslarla asla paylaşılmamaktadır. Detaylar için KVKK metnini inceleyebilirsiniz.", 'en': "Your personal data is protected by high-level security measures and is never shared with third parties. You can review the GDPR text for details.", 'de': "Ihre persönlichen Daten sind durch hochrangige Sicherheitsmaßnahmen geschützt und werden niemals an Dritte weitergegeben. Weitere Informationen finden Sie im DSGVO-Text.", 'fr': "Vos données personnelles sont protégées par des mesures de sécurité de haut niveau et ne sont jamais partagées avec des tiers. Vous pouvez consulter le texte RGPD pour plus de détails."},
    'footer_about': {'tr': "Hakkımızda", 'en': "About Us", 'de': "Über Uns", 'fr': "À Propos de Nous"},
    'footer_about_desc': {'tr': "Salutbabe, annelerin bebek ve çocuk kıyafetlerini güvenle alıp satabileceği, sürdürülebilir modaya katkı sağlayan Türkiye'nin en güvenilir ikinci el alışveriş topluluğudur.", 'en': "Salutbabe is Turkey's most reliable second-hand shopping community where mothers can safely buy and sell baby and children's clothes, contributing to sustainable fashion.", 'de': "Salutbabe ist die zuverlässigste Second-Hand-Shopping-Community in der Türkei, in der Mütter Baby- und Kinderkleidung sicher kaufen und verkaufen können, und trägt zur nachhaltigen Mode bei.", 'fr': "Salutbabe est la communauté d'achat de seconde main la plus fiable de Turquie où les mères peuvent acheter et vendre en toute sécurité des vêtements pour bébés et enfants, contribuant ainsi à la mode durable."}
}

for lang in locales:
    with open(f'src/locales/{lang}.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    data['widgets'] = {}
    for key, trans in new_translations.items():
        data['widgets'][key] = trans[lang]
        
    with open(f'src/locales/{lang}.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

print('Translations patched successfully!')
