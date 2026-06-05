const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');
const files = ['tr.json', 'en.json', 'fr.json'];

const sysopKeysTR = {
  nav_brand_mgmt: "Marka Yönetimi",
  under_construction: "Bu bölüm şu anda yapım aşamasındadır. Yakında buradan yönetebileceksiniz.",
  cat_mgmt: "Kategori ve Nitelik Yönetimi",
  categories: "Kategoriler",
  attributes: "Nitelikler",
  cat_name: "Kategori",
  cat_parent: "Üst Kategori",
  cat_slug: "URL Slug",
  cat_actions: "İşlemler",
  add_category: "Yeni Kategori Ekle",
  add_category_desc: "Ürünler için yeni bir kategori oluşturun.",
  attr_name_key: "Nitelik Anahtarı (Sistem)",
  attr_mobile_comp: "Mobil Bileşen",
  attr_type: "Tip",
  add_attribute: "Yeni Nitelik Ekle",
  edit_attribute: "Niteliği Düzenle",
  btn_save: "Kaydet",
  btn_cancel: "İptal",
  btn_edit: "Düzenle",
  approve_success: "İlan başarıyla onaylandı.",
  reject_success: "İlan başarıyla reddedildi.",
  approve_failed: "Onaylama başarısız:",
  reject_failed: "Reddetme başarısız:",
  unknown_error: "Bilinmeyen hata",
  error_occurred: "Bir hata oluştu",
  prompt_reject_reason: "Reddetme sebebini girin (isteğe bağlı):",
  no_pending_listings: "Onay Bekleyen İlan Yok",
  no_pending_listings_desc: "Şu anda onayınızı bekleyen yeni bir ürün ilanı bulunmuyor.",
  no_brand: "Markasız",
  no_desc: "İlan açıklaması girilmemiş.",
  condition_new: "YENİ",
  category: "Kategori",
  shipping_info: "Kargo Teslimat Bilgisi",
  shipping_seller_pays: "Satıcı Öder (Ücretsiz Kargo)",
  shipping_buyer_pays: "Alıcı Öder",
  price_unknown: "Fiyat Belirsiz",
  shipping_company: "Kargo Firması:",
  package_size: "Paket Boyutu:",
  desi: "Desi",
  btn_reject: "Reddet",
  btn_approve: "Onayla",
  loading_data: "Veriler Yükleniyor...",
  store_mgmt: "Mağaza Yönetimi",
  store_owner: "Sahibi",
  store_status: "Durum",
  store_active: "AKTİF",
  store_passive: "PASİF",
  store_edit: "Mağaza Düzenle"
};

const sysopKeysEN = {
  nav_brand_mgmt: "Brand Management",
  under_construction: "This section is under construction. You will be able to manage here soon.",
  cat_mgmt: "Category & Attribute Management",
  categories: "Categories",
  attributes: "Attributes",
  cat_name: "Category",
  cat_parent: "Parent",
  cat_slug: "URL Slug",
  cat_actions: "Actions",
  add_category: "Add New Category",
  add_category_desc: "Create a new category for products.",
  attr_name_key: "Attribute Key (System)",
  attr_mobile_comp: "Mobile Component",
  attr_type: "Type",
  add_attribute: "Add New Attribute",
  edit_attribute: "Edit Attribute",
  btn_save: "Save",
  btn_cancel: "Cancel",
  btn_edit: "Edit",
  approve_success: "Listing approved successfully.",
  reject_success: "Listing rejected successfully.",
  approve_failed: "Approval failed:",
  reject_failed: "Rejection failed:",
  unknown_error: "Unknown error",
  error_occurred: "An error occurred",
  prompt_reject_reason: "Enter rejection reason (optional):",
  no_pending_listings: "No Pending Listings",
  no_pending_listings_desc: "There are currently no new product listings waiting for your approval.",
  no_brand: "No Brand",
  no_desc: "No description provided.",
  condition_new: "NEW",
  category: "Category",
  shipping_info: "Shipping Information",
  shipping_seller_pays: "Seller Pays (Free Shipping)",
  shipping_buyer_pays: "Buyer Pays",
  price_unknown: "Price Unknown",
  shipping_company: "Shipping Company:",
  package_size: "Package Size:",
  desi: "Desi",
  btn_reject: "Reject",
  btn_approve: "Approve",
  loading_data: "Loading Data...",
  store_mgmt: "Store Management",
  store_owner: "Owner",
  store_status: "Status",
  store_active: "ACTIVE",
  store_passive: "PASSIVE",
  store_edit: "Edit Store"
};

const sysopKeysFR = {
  nav_brand_mgmt: "Gestion des Marques",
  under_construction: "Cette section est en construction. Vous pourrez bientôt la gérer ici.",
  cat_mgmt: "Gestion des Catégories et Attributs",
  categories: "Catégories",
  attributes: "Attributs",
  cat_name: "Catégorie",
  cat_parent: "Catégorie Parente",
  cat_slug: "URL Slug",
  cat_actions: "Actions",
  add_category: "Ajouter une Catégorie",
  add_category_desc: "Créez une nouvelle catégorie pour les produits.",
  attr_name_key: "Clé d'Attribut (Système)",
  attr_mobile_comp: "Composant Mobile",
  attr_type: "Type",
  add_attribute: "Ajouter un Attribut",
  edit_attribute: "Modifier l'Attribut",
  btn_save: "Enregistrer",
  btn_cancel: "Annuler",
  btn_edit: "Modifier",
  approve_success: "Annonce approuvée avec succès.",
  reject_success: "Annonce rejetée avec succès.",
  approve_failed: "Échec de l'approbation:",
  reject_failed: "Échec du rejet:",
  unknown_error: "Erreur inconnue",
  error_occurred: "Une erreur est survenue",
  prompt_reject_reason: "Saisissez le motif du rejet (facultatif):",
  no_pending_listings: "Aucune Annonce en Attente",
  no_pending_listings_desc: "Il n'y a actuellement aucune nouvelle annonce de produit en attente de votre approbation.",
  no_brand: "Sans Marque",
  no_desc: "Aucune description fournie.",
  condition_new: "NOUVEAU",
  category: "Catégorie",
  shipping_info: "Informations de Livraison",
  shipping_seller_pays: "Le Vendeur Paie (Livraison Gratuite)",
  shipping_buyer_pays: "L'Acheteur Paie",
  price_unknown: "Prix Inconnu",
  shipping_company: "Société de Livraison:",
  package_size: "Taille du Colis:",
  desi: "Desi",
  btn_reject: "Rejeter",
  btn_approve: "Approuver",
  loading_data: "Chargement des Données...",
  store_mgmt: "Gestion du Magasin",
  store_owner: "Propriétaire",
  store_status: "Statut",
  store_active: "ACTIF",
  store_passive: "PASSIF",
  store_edit: "Modifier le Magasin"
};

const keysMapping = {
  'tr.json': sysopKeysTR,
  'en.json': sysopKeysEN,
  'fr.json': sysopKeysFR,
  'de.json': sysopKeysEN // Fallback to EN for DE as an example, but we will check if DE exists
};

files.forEach(file => {
  const filePath = path.join(localesDir, file);
  if (fs.existsSync(filePath)) {
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Make sure dashboard.sysop exists
    if (!data.dashboard) data.dashboard = {};
    if (!data.dashboard.sysop) data.dashboard.sysop = {};
    
    // Add keys
    Object.assign(data.dashboard.sysop, keysMapping[file] || keysMapping['en.json']);
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated ${file}`);
  }
});

// Also check de.json
const deFile = path.join(localesDir, 'de.json');
if (fs.existsSync(deFile)) {
    let data = JSON.parse(fs.readFileSync(deFile, 'utf8'));
    if (!data.dashboard) data.dashboard = {};
    if (!data.dashboard.sysop) data.dashboard.sysop = {};
    Object.assign(data.dashboard.sysop, sysopKeysEN); // default to EN for DE for now
    fs.writeFileSync(deFile, JSON.stringify(data, null, 2));
    console.log(`Updated de.json`);
}
