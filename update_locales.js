const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');

const newTranslations = {
  tr: {
    home: {
      category_filter_title: "Kategorine göre keşfet",
      tab_all: "Tümü",
      tab_foryou: "Sana Özel",
      tab_mom: "Anne",
      tab_baby: "Bebek",
      tab_child: "Çocuk",
      tab_other: "Diğer",
      tab_size: "Beden",
      tab_brand: "Marka",
      style_explore: "Stiline göre keşfet",
      price_shopping: "Fiyata göre alışveriş",
      price_under_100: "100 TL Altı",
      price_under_200: "200 TL Altı",
      price_under_500: "500 TL Altı",
      price_under_1000: "1000 TL Altı",
      bundle_title: "Annelerin Sepetleri",
      bundle_desc: "Tek tıkla hazır kombinler ve setler.",
      view_in_app: "App'te Gör",
      sold: "SATILDI",
      sorry: "ÜZGÜNÜZ",
      for_you_picks: "Sizin İçin Seçilenler",
      ranking_title: "Haftanın En Çok Etkileşim Alanları",
      ranking_desc: "salutbabe topluluğunun bu hafta en çok incelediği ve favorilediği satıcılar."
    },
    footer: {
      download_app: "Uygulamayı İndir",
      contact_us: "Bize Ulaşın",
      secure_payment: "Güvenli Ödeme",
      return_policy: "İade Şartları",
      all_rights_reserved: "Tüm hakları saklıdır."
    }
  },
  en: {
    home: {
      category_filter_title: "Explore by category",
      tab_all: "All",
      tab_foryou: "For You",
      tab_mom: "Mom",
      tab_baby: "Baby",
      tab_child: "Child",
      tab_other: "Other",
      tab_size: "Size",
      tab_brand: "Brand",
      style_explore: "Explore by style",
      price_shopping: "Shop by price",
      price_under_100: "Under 100 TL",
      price_under_200: "Under 200 TL",
      price_under_500: "Under 500 TL",
      price_under_1000: "Under 1000 TL",
      bundle_title: "Mothers' Baskets",
      bundle_desc: "Ready combinations and sets with one click.",
      view_in_app: "View in App",
      sold: "SOLD OUT",
      sorry: "SORRY WE'RE",
      for_you_picks: "Picked for You",
      ranking_title: "Most Interacted This Week",
      ranking_desc: "Sellers most viewed and favorited by the salutbabe community this week."
    },
    footer: {
      download_app: "Download App",
      contact_us: "Contact Us",
      secure_payment: "Secure Payment",
      return_policy: "Return Policy",
      all_rights_reserved: "All rights reserved."
    }
  },
  fr: {
    home: {
      category_filter_title: "Explorer par catégorie",
      tab_all: "Tout",
      tab_foryou: "Pour vous",
      tab_mom: "Maman",
      tab_baby: "Bébé",
      tab_child: "Enfant",
      tab_other: "Autres",
      tab_size: "Taille",
      tab_brand: "Marque",
      style_explore: "Explorer par style",
      price_shopping: "Acheter par prix",
      price_under_100: "Moins de 100 TL",
      price_under_200: "Moins de 200 TL",
      price_under_500: "Moins de 500 TL",
      price_under_1000: "Moins de 1000 TL",
      bundle_title: "Paniers de mères",
      bundle_desc: "Combinaisons et ensembles prêts en un clic.",
      view_in_app: "Voir dans l'App",
      sold: "VENDU",
      sorry: "DÉSOLÉ",
      for_you_picks: "Sélectionnés pour vous",
      ranking_title: "Les plus populaires cette semaine",
      ranking_desc: "Les vendeurs les plus vus et favoris par la communauté salutbabe cette semaine."
    },
    footer: {
      download_app: "Télécharger l'App",
      contact_us: "Nous contacter",
      secure_payment: "Paiement sécurisé",
      return_policy: "Politique de retour",
      all_rights_reserved: "Tous droits réservés."
    }
  },
  de: {
    home: {
      category_filter_title: "Nach Kategorie entdecken",
      tab_all: "Alle",
      tab_foryou: "Für dich",
      tab_mom: "Mutter",
      tab_baby: "Baby",
      tab_child: "Kind",
      tab_other: "Andere",
      tab_size: "Größe",
      tab_brand: "Marke",
      style_explore: "Nach Stil entdecken",
      price_shopping: "Nach Preis einkaufen",
      price_under_100: "Unter 100 TL",
      price_under_200: "Unter 200 TL",
      price_under_500: "Unter 500 TL",
      price_under_1000: "Unter 1000 TL",
      bundle_title: "Körbe der Mütter",
      bundle_desc: "Fertige Kombinationen und Sets mit einem Klick.",
      view_in_app: "In App ansehen",
      sold: "VERKAUFT",
      sorry: "ENTSCHULDIGUNG",
      for_you_picks: "Für dich ausgewählt",
      ranking_title: "Am meisten interagiert diese Woche",
      ranking_desc: "Die von der salutbabe-Community am meisten angesehenen und favorisierten Verkäufer diese Woche."
    },
    footer: {
      download_app: "App herunterladen",
      contact_us: "Kontaktiere uns",
      secure_payment: "Sichere Zahlung",
      return_policy: "Rückgaberecht",
      all_rights_reserved: "Alle Rechte vorbehalten."
    }
  }
};

const mergeDeep = (target, source) => {
  for (const key in source) {
    if (source[key] instanceof Object && !Array.isArray(source[key])) {
      if (!target[key]) Object.assign(target, { [key]: {} });
      mergeDeep(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
};

// Ensure de.json exists by copying en.json if it doesn't
const enPath = path.join(localesDir, 'en.json');
const dePath = path.join(localesDir, 'de.json');
if (!fs.existsSync(dePath)) {
  const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  fs.writeFileSync(dePath, JSON.stringify(enData, null, 2));
}

['tr', 'en', 'fr', 'de'].forEach(lang => {
  const file = path.join(localesDir, `${lang}.json`);
  if (fs.existsSync(file)) {
    const currentData = JSON.parse(fs.readFileSync(file, 'utf8'));
    const mergedData = mergeDeep(currentData, newTranslations[lang]);
    fs.writeFileSync(file, JSON.stringify(mergedData, null, 2));
    console.log(`Updated ${lang}.json`);
  }
});
