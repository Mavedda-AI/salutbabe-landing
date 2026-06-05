const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');
const files = ['tr.json', 'en.json', 'fr.json', 'de.json'];

const sysopKeysTR = {
  manage_listings: "İlanları Yönet",
  table_listing: "İlan",
  table_seller: "Satıcı",
  table_price: "Fiyat",
  table_status: "Durum",
  btn_approve: "Onayla",
  btn_reject: "Reddet",
  btn_deactivate: "Pasif Yap",
  btn_view_details: "Detaylar",
  no_listings_found: "İlan bulunamadı",
  listing_details: "İlan Detayları",
  detail_title: "Başlık",
  detail_description: "Açıklama",
  detail_price: "Fiyat",
  detail_seller: "Satıcı",
  detail_status: "Durum",
  detail_category_brand: "Kategori & Marka",
  detail_condition: "Durum / Kondisyon",
  detail_commissions: "Uygulanan Komisyonlar (Anlık)",
  detail_photos: "Fotoğraflar",
  unknown_category: "Bilinmeyen Kategori",
  no_brand: "Markasız",
  buyer: "Alıcı",
  seller: "Satıcı",
  current_system_commissions: "Güncel sistem komisyonlarına tabi (Eski ilan)",
  status_active: "AKTİF",
  status_pending: "BEKLEYEN",
  status_rejected: "REDDEDİLDİ",
  status_passive: "PASİF"
};

const sysopKeysEN = {
  manage_listings: "Manage Listings",
  table_listing: "Listing",
  table_seller: "Seller",
  table_price: "Price",
  table_status: "Status",
  btn_approve: "Approve",
  btn_reject: "Reject",
  btn_deactivate: "Deactivate",
  btn_view_details: "View Details",
  no_listings_found: "No listings found",
  listing_details: "Listing Details",
  detail_title: "Title",
  detail_description: "Description",
  detail_price: "Price",
  detail_seller: "Seller",
  detail_status: "Status",
  detail_category_brand: "Category & Brand",
  detail_condition: "Condition",
  detail_commissions: "Applied Commissions (Snapshot)",
  detail_photos: "Photos",
  unknown_category: "Unknown Category",
  no_brand: "No Brand",
  buyer: "Buyer",
  seller: "Seller",
  current_system_commissions: "Subject to current system commissions (Legacy listing)",
  status_active: "ACTIVE",
  status_pending: "PENDING",
  status_rejected: "REJECTED",
  status_passive: "PASSIVE"
};

const sysopKeysFR = {
  manage_listings: "Gérer les Annonces",
  table_listing: "Annonce",
  table_seller: "Vendeur",
  table_price: "Prix",
  table_status: "Statut",
  btn_approve: "Approuver",
  btn_reject: "Rejeter",
  btn_deactivate: "Désactiver",
  btn_view_details: "Détails",
  no_listings_found: "Aucune annonce trouvée",
  listing_details: "Détails de l'Annonce",
  detail_title: "Titre",
  detail_description: "Description",
  detail_price: "Prix",
  detail_seller: "Vendeur",
  detail_status: "Statut",
  detail_category_brand: "Catégorie et Marque",
  detail_condition: "État",
  detail_commissions: "Commissions Appliquées (Aperçu)",
  detail_photos: "Photos",
  unknown_category: "Catégorie Inconnue",
  no_brand: "Sans Marque",
  buyer: "Acheteur",
  seller: "Vendeur",
  current_system_commissions: "Soumis aux commissions actuelles (Annonce existante)",
  status_active: "ACTIF",
  status_pending: "EN ATTENTE",
  status_rejected: "REJETÉ",
  status_passive: "PASSIF"
};

const keysMapping = {
  'tr.json': sysopKeysTR,
  'en.json': sysopKeysEN,
  'fr.json': sysopKeysFR,
  'de.json': sysopKeysEN 
};

files.forEach(file => {
  const filePath = path.join(localesDir, file);
  if (fs.existsSync(filePath)) {
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (!data.dashboard) data.dashboard = {};
    if (!data.dashboard.sysop) data.dashboard.sysop = {};
    
    Object.assign(data.dashboard.sysop, keysMapping[file] || keysMapping['en.json']);
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated ${file}`);
  }
});
