import json

locales = ['tr', 'en', 'de', 'fr']
new_translations = {
    'header_seller_panel': {'tr': "Satıcı Paneli", 'en': "Seller Panel", 'de': "Verkäufer-Panel", 'fr': "Panneau Vendeur"},
    'header_search_placeholder': {'tr': "İstediğini ara", 'en': "Search for anything", 'de': "Suche nach allem", 'fr': "Chercher quoi que ce soit"},
    'hero_tab_buy': {'tr': "Al", 'en': "Buy", 'de': "Kaufen", 'fr': "Acheter"},
    'hero_tab_sell': {'tr': "Sat", 'en': "Sell", 'de': "Verkaufen", 'fr': "Vendre"},
    'hero_tab_live': {'tr': "Canlı Odalar", 'en': "Live Rooms", 'de': "Live-Räume", 'fr': "Salles en Direct"},
    'hero_tab_story': {'tr': "Hikayemiz", 'en': "Our Story", 'de': "Unsere Geschichte", 'fr': "Notre Histoire"},
    'hero_tab_organic': {'tr': "Salut Organik", 'en': "Salut Organic", 'de': "Salut Bio", 'fr': "Salut Bio"},
    
    'hero_headline_buy_1': {'tr': "İkinci el al.", 'en': "Buy second hand.", 'de': "Second Hand kaufen.", 'fr': "Achetez d'occasion."},
    'hero_headline_buy_2': {'tr': "Kendi tarzını oluştur.", 'en': "Create your style.", 'de': "Kreieren Sie Ihren Stil.", 'fr': "Créez votre style."},
    
    'hero_headline_sell_1': {'tr': "Dolabını nakite çevir.", 'en': "Turn your closet into cash.", 'de': "Machen Sie Ihren Schrank zu Geld.", 'fr': "Transformez votre placard en argent."},
    'hero_headline_sell_2': {'tr': "Hemen kazanmaya başla.", 'en': "Start earning now.", 'de': "Fangen Sie jetzt an zu verdienen.", 'fr': "Commencez à gagner maintenant."},
    
    'hero_headline_live_1': {'tr': "Sesli odalarda buluş.", 'en': "Meet in voice rooms.", 'de': "Treffen Sie sich in Sprachräumen.", 'fr': "Rencontrez-vous dans des salons vocaux."},
    'hero_headline_live_2': {'tr': "Deneyimlerini paylaş.", 'en': "Share your experiences.", 'de': "Teilen Sie Ihre Erfahrungen.", 'fr': "Partagez vos expériences."},
    
    'hero_headline_story_1': {'tr': "Her Annenin", 'en': "Every Mother has", 'de': "Jede Mutter hat", 'fr': "Chaque Mère a"},
    'hero_headline_story_2': {'tr': "bir hikayesi vardır.", 'en': "a story.", 'de': "eine Geschichte.", 'fr': "une histoire."},
    
    'hero_headline_organic_1': {'tr': "Çiftçiden ve anneden.", 'en': "From farmer and mother.", 'de': "Von Bauer und Mutter.", 'fr': "Du fermier et de la mère."},
    'hero_headline_organic_2': {'tr': "Doğadan bebeğinize.", 'en': "From nature to your baby.", 'de': "Von der Natur zu Ihrem Baby.", 'fr': "De la nature à votre bébé."},
    
    'hero_subhead_buy': {'tr': "Sürdürülebilir ve güvenilir ikinci el alışveriş.", 'en': "Sustainable and reliable second hand shopping.", 'de': "Nachhaltiges und zuverlässiges Second-Hand-Shopping.", 'fr': "Achat de seconde main durable et fiable."},
    'hero_subhead_sell': {'tr': "Küçülenleri kolayca sat, aile bütçene anında katkı sağla.", 'en': "Sell outgrown items easily, contribute to your family budget instantly.", 'de': "Verkaufen Sie herausgewachsene Artikel ganz einfach und tragen Sie sofort zum Familienbudget bei.", 'fr': "Vendez facilement les articles trop petits, contribuez instantanément au budget familial."},
    'hero_subhead_live': {'tr': "Sesli odalara katıl, annelerle sohbet et ve ilanları ilk sen keşfet.", 'en': "Join voice rooms, chat with mothers and discover listings first.", 'de': "Treten Sie Sprachräumen bei, chatten Sie mit Müttern und entdecken Sie Anzeigen zuerst.", 'fr': "Rejoignez des salons vocaux, discutez avec des mères et découvrez les annonces en premier."},
    'hero_subhead_story': {'tr': "Bu sadece bir alışveriş platformu değil, büyük bir paylaşım kültürü.", 'en': "This is not just a shopping platform, it's a great sharing culture.", 'de': "Dies ist nicht nur eine Einkaufsplattform, sondern eine großartige Teilkultur.", 'fr': "Ce n'est pas seulement une plateforme d'achat, c'est une grande culture de partage."},
    'hero_subhead_organic': {'tr': "Çiftçiler ve üreten annelerin ürünlerini keşfedin.", 'en': "Discover products from farmers and producing mothers.", 'de': "Entdecken Sie Produkte von Bauern und produzierenden Müttern.", 'fr': "Découvrez des produits de fermiers et de mères productrices."},
    
    'hero_card1_buy': {'tr': "Güvenle Al", 'en': "Buy Securely", 'de': "Sicher kaufen", 'fr': "Acheter en sécurité"},
    'hero_card1_sell': {'tr': "Güvenle Sat", 'en': "Sell Securely", 'de': "Sicher verkaufen", 'fr': "Vendre en sécurité"},
    'hero_card1_live': {'tr': "Güvenli Sohbet", 'en': "Secure Chat", 'de': "Sicherer Chat", 'fr': "Chat Sécurisé"},
    'hero_card1_story': {'tr': "Güvenli Alan", 'en': "Safe Space", 'de': "Sicherer Raum", 'fr': "Espace Sécurisé"},
    'hero_card1_organic': {'tr': "Doğal Üretim", 'en': "Natural Production", 'de': "Natürliche Produktion", 'fr': "Production Naturelle"},
    
    'hero_card1_desc_organic': {'tr': "Katkısız ve saf", 'en': "Pure and additive-free", 'de': "Rein und ohne Zusatzstoffe", 'fr': "Pur et sans additifs"},
    'hero_card1_desc_default': {'tr': "Salutbabe Koruması", 'en': "Salutbabe Protection", 'de': "Salutbabe-Schutz", 'fr': "Protection Salutbabe"},

    'hero_card2_buy_title': {'tr': "2M+", 'en': "2M+", 'de': "2M+", 'fr': "2M+"},
    'hero_card2_buy_desc': {'tr': "Satıştaki ürün", 'en': "Products on sale", 'de': "Produkte im Angebot", 'fr': "Produits en vente"},
    'hero_card2_sell_title': {'tr': "%0 Komisyon", 'en': "0% Commission", 'de': "0% Provision", 'fr': "0% Commission"},
    'hero_card2_sell_desc': {'tr': "Kazancın sana kalsın", 'en': "Keep your earnings", 'de': "Behalten Sie Ihren Gewinn", 'fr': "Gardez vos gains"},
    'hero_card2_live_title': {'tr': "300+", 'en': "300+", 'de': "300+", 'fr': "300+"},
    'hero_card2_live_desc': {'tr': "Aktif Oda", 'en': "Active Rooms", 'de': "Aktive Räume", 'fr': "Salles Actives"},
    'hero_card2_story_title': {'tr': "Herkes", 'en': "Everyone", 'de': "Jeder", 'fr': "Tout le monde"},
    'hero_card2_story_desc': {'tr': "Eşit ve değerli", 'en': "Equal and valuable", 'de': "Gleich und wertvoll", 'fr': "Égal et précieux"},
    'hero_card2_organic_title': {'tr': "Sertifikalı", 'en': "Certified", 'de': "Zertifiziert", 'fr': "Certifié"},
    'hero_card2_organic_desc': {'tr': "Organik tarım", 'en': "Organic farming", 'de': "Ökologischer Landbau", 'fr': "Agriculture biologique"},

    'hero_card3_buy_title': {'tr': "10K+", 'en': "10K+", 'de': "10K+", 'fr': "10K+"},
    'hero_card3_buy_desc': {'tr': "Her gün yeni ilan", 'en': "New listings every day", 'de': "Jeden Tag neue Anzeigen", 'fr': "Nouvelles annonces tous les jours"},
    'hero_card3_sell_title': {'tr': "Hızlı Satış", 'en': "Fast Sale", 'de': "Schneller Verkauf", 'fr': "Vente Rapide"},
    'hero_card3_sell_desc': {'tr': "Milyonlarca alıcı", 'en': "Millions of buyers", 'de': "Millionen Käufer", 'fr': "Des millions d'acheteurs"},
    'hero_card3_live_title': {'tr': "Keşfet & Öğren", 'en': "Discover & Learn", 'de': "Entdecken & Lernen", 'fr': "Découvrir & Apprendre"},
    'hero_card3_live_desc': {'tr': "Bilgi al, ilan paylaş", 'en': "Get info, share ads", 'de': "Infos erhalten, Anzeigen teilen", 'fr': "Obtenir des infos, partager des annonces"},
    'hero_card3_story_title': {'tr': "Gerçek", 'en': "Real", 'de': "Echt", 'fr': "Réel"},
    'hero_card3_story_desc': {'tr': "Deneyimler", 'en': "Experiences", 'de': "Erfahrungen", 'fr': "Expériences"},
    'hero_card3_organic_title': {'tr': "Sağlıklı", 'en': "Healthy", 'de': "Gesund", 'fr': "Sain"},
    'hero_card3_organic_desc': {'tr': "Gelecek için", 'en': "For the future", 'de': "Für die Zukunft", 'fr': "Pour l'avenir"}
}

for lang in locales:
    with open(f'src/locales/{lang}.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    if 'widgets' not in data:
        data['widgets'] = {}
        
    for key, trans in new_translations.items():
        data['widgets'][key] = trans[lang]
        
    with open(f'src/locales/{lang}.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

print('Hero & Header translations patched successfully!')
