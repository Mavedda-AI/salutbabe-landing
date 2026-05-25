import json

locales = ['tr', 'en', 'de', 'fr']
new_translations = {
    'sold_out_sorry': {'tr': "Üzgünüz", 'en': "Sorry", 'de': "Entschuldigung", 'fr': "Désolé"},
    'sold_out_stamp': {'tr': "SATILDI", 'en': "SOLD", 'de': "VERKAUFT", 'fr': "VENDU"},
    'popular_shoes': {'tr': "Bebek Ayakkabısı", 'en': "Baby Shoes", 'de': "Babyschuhe", 'fr': "Chaussures Bébé"},
    'popular_romper': {'tr': "Bebek Tulumu", 'en': "Baby Romper", 'de': "Baby-Strampler", 'fr': "Grenouillère Bébé"},
    'popular_dress': {'tr': "Kız Çocuk Elbise", 'en': "Girl's Dress", 'de': "Mädchenkleid", 'fr': "Robe Fille"},
    
    'hero_discover_now': {'tr': "Hemen Keşfet", 'en': "Discover Now", 'de': "Jetzt Entdecken", 'fr': "Découvrir Maintenant"},
    'hero_sell_now': {'tr': "Hemen Sat", 'en': "Sell Now", 'de': "Jetzt Verkaufen", 'fr': "Vendre Maintenant"},
    'hero_join_rooms': {'tr': "Odalara Katıl", 'en': "Join Rooms", 'de': "Räumen Beitreten", 'fr': "Rejoindre les Salles"},
    'hero_create_story': {'tr': "Hikayeni Oluştur", 'en': "Create Story", 'de': "Geschichte Erstellen", 'fr': "Créer une Histoire"},
    'hero_discover_natural': {'tr': "Doğalı Keşfet", 'en': "Discover Natural", 'de': "Natürliches Entdecken", 'fr': "Découvrir le Naturel"},
    'hero_card3_title': {'tr': "Keşfet & Öğren", 'en': "Discover & Learn", 'de': "Entdecken & Lernen", 'fr': "Découvrir & Apprendre"},
    'hero_card3_desc': {'tr': "Bilgi al, ilan paylaş", 'en': "Get info, share ads", 'de': "Infos erhalten, Anzeigen teilen", 'fr': "Obtenir des infos, partager des annonces"},
    
    'drawer_toy': {'tr': "Oyuncak", 'en': "Toy", 'de': "Spielzeug", 'fr': "Jouet"},
    'drawer_equipment': {'tr': "Araç & Gereç", 'en': "Equipment", 'de': "Ausrüstung", 'fr': "Équipement"},
    'drawer_brands': {'tr': "Markalar", 'en': "Brands", 'de': "Marken", 'fr': "Marques"},
    'drawer_sale': {'tr': "İndirim", 'en': "Sale", 'de': "Verkauf", 'fr': "Vente"},
    'drawer_about': {'tr': "Hakkımızda", 'en': "About Us", 'de': "Über Uns", 'fr': "À Propos de Nous"},
    'drawer_privacy': {'tr': "Gizlilik", 'en': "Privacy", 'de': "Datenschutz", 'fr': "Confidentialité"},
    
    'cart_title': {'tr': "Sepetim", 'en': "My Cart", 'de': "Mein Warenkorb", 'fr': "Mon Panier"},
    'cart_empty': {'tr': "Sepetin şu an boş", 'en': "Your cart is currently empty", 'de': "Ihr Warenkorb ist derzeit leer", 'fr': "Votre panier est actuellement vide"},
    'cart_start_shopping': {'tr': "Alışverişe Başla", 'en': "Start Shopping", 'de': "Einkaufen Beginnen", 'fr': "Commencer les Achats"},
    
    'header_register': {'tr': "Kaydol", 'en': "Sign Up", 'de': "Registrieren", 'fr': "S'inscrire"},
    'ranking_popular': {'tr': "Popüler", 'en': "Popular", 'de': "Beliebt", 'fr': "Populaire"},

    'category_all_button': {'tr': "Alışverişe Başla", 'en': "Start Shopping", 'de': "Einkaufen Beginnen", 'fr': "Commencer les Achats"},
    
    'category_mom_title': {'tr': "Annelerin İhtiyaçları", 'en': "Mothers' Needs", 'de': "Bedürfnisse von Müttern", 'fr': "Besoins des Mères"},
    'category_mom_desc': {'tr': "Hamilelikten lohusalığa tüm ihtiyaçların.", 'en': "All your needs from pregnancy to postpartum.", 'de': "Alle Ihre Bedürfnisse von der Schwangerschaft bis zur Wochenbettzeit.", 'fr': "Tous vos besoins de la grossesse au post-partum."},
    'category_mom_button': {'tr': "Anne Ürünlerini Keşfet", 'en': "Discover Maternity Products", 'de': "Umstandsprodukte Entdecken", 'fr': "Découvrir les Produits de Maternité"},
    
    'category_baby_title': {'tr': "Bebek Dünyası", 'en': "Baby World", 'de': "Babywelt", 'fr': "Monde de Bébé"},
    'category_baby_button': {'tr': "Bebek Ürünleri", 'en': "Baby Products", 'de': "Babyprodukte", 'fr': "Produits pour Bébé"},
    
    'category_child_title': {'tr': "Çocuk Modası", 'en': "Kids Fashion", 'de': "Kindermode", 'fr': "Mode Enfant"},
    'category_child_button': {'tr': "Çocuk Giyimi Keşfet", 'en': "Discover Kids Clothing", 'de': "Kinderkleidung Entdecken", 'fr': "Découvrir les Vêtements pour Enfants"},
    
    'category_size_title': {'tr': "Bedene Göre Seçim", 'en': "Shop by Size", 'de': "Nach Größe einkaufen", 'fr': "Acheter par Taille"},
    'category_brand_title': {'tr': "Markaya Göre Seçim", 'en': "Shop by Brand", 'de': "Nach Marke einkaufen", 'fr': "Acheter par Marque"},
    'category_brand_button': {'tr': "Markaları Gör", 'en': "View Brands", 'de': "Marken Ansehen", 'fr': "Voir les Marques"}
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

print('Additional translations patched successfully!')
