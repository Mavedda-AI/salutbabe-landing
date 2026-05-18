'use client';
import React, {useEffect, useState} from "react";
import {useThemeLanguage} from "../../../../context/ThemeLanguageContext";

export default function CategoryManagementPage() {
  const { theme } = useThemeLanguage();
  const [loading, setLoading] = useState(true);
  const [expandedCats, setExpandedCats] = useState<string[]>(['CAT-1']);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'bebek' | 'cocuk' | 'organik'>('all');
  const [showModal, setShowModal] = useState<any>(null);

  const isDark = theme === 'dark';

  useEffect(() => { setTimeout(() => setLoading(false), 400); }, []);
  const cardClass = `rounded-[20px] border transition-all duration-300 ${isDark ? 'bg-[#121214] border-white/5 shadow-2xl' : 'bg-white border-gray-100 shadow-sm'}`;

  const categories = [
    {
      id: 'CAT-1', name: 'Bebek Giyim & Tekstil', productCount: 4444, status: 'Aktif',
      subcategories: [
        { id: 'SUB-101', name: 'Hastane Çıkış Seti', productCount: 978, status: 'Aktif' },
        { id: 'SUB-102', name: 'Yenidoğan Tulum', productCount: 434, status: 'Aktif' },
        { id: 'SUB-103', name: 'Yenidoğan Takım', productCount: 661, status: 'Aktif' },
        { id: 'SUB-104', name: 'Kısa Tulum', productCount: 858, status: 'Aktif' },
        { id: 'SUB-105', name: 'Patiksiz Tulum', productCount: 350, status: 'Aktif' },
        { id: 'SUB-106', name: 'Pijama Tulum', productCount: 988, status: 'Aktif' },
        { id: 'SUB-107', name: 'Pijama Takımı', productCount: 912, status: 'Aktif' },
        { id: 'SUB-108', name: 'İç Giyim', productCount: 246, status: 'Aktif' },
        { id: 'SUB-109', name: 'Şortlu Takım', productCount: 784, status: 'Aktif' },
        { id: 'SUB-110', name: 'Eşofman Takımı', productCount: 622, status: 'Aktif' },
        { id: 'SUB-111', name: 'Salopetli Takım', productCount: 600, status: 'Aktif' },
        { id: 'SUB-112', name: 'Body', productCount: 607, status: 'Aktif' },
        { id: 'SUB-113', name: 'Tişört', productCount: 477, status: 'Aktif' },
        { id: 'SUB-114', name: 'Soket Çorap', productCount: 420, status: 'Aktif' },
        { id: 'SUB-115', name: 'Külotlu Çorap', productCount: 453, status: 'Aktif' },
        { id: 'SUB-116', name: 'Bilek Çorap', productCount: 121, status: 'Aktif' },
        { id: 'SUB-117', name: 'Yağmurluk', productCount: 788, status: 'Aktif' },
        { id: 'SUB-118', name: 'Ceket', productCount: 114, status: 'Aktif' },
        { id: 'SUB-119', name: 'Şort', productCount: 909, status: 'Aktif' },
        { id: 'SUB-120', name: 'Eşofman Altı', productCount: 532, status: 'Aktif' },
        { id: 'SUB-121', name: 'Tayt', productCount: 236, status: 'Aktif' },
        { id: 'SUB-122', name: 'Sandalet', productCount: 511, status: 'Aktif' },
        { id: 'SUB-123', name: 'İlk Adım Ayakkabısı', productCount: 484, status: 'Aktif' },
        { id: 'SUB-124', name: 'Deniz Ayakkabısı', productCount: 327, status: 'Aktif' },
      ]
    },
    {
      id: 'CAT-2', name: 'Bebek Araç & Gereç', productCount: 1208, status: 'Aktif',
      subcategories: [
        { id: 'SUB-201', name: 'Baston Bebek Arabası', productCount: 143, status: 'Aktif' },
        { id: 'SUB-202', name: 'Kabin Bebek Arabaları', productCount: 283, status: 'Aktif' },
        { id: 'SUB-203', name: 'Travel Sistem Bebek Arabası', productCount: 149, status: 'Aktif' },
        { id: 'SUB-204', name: 'İkiz Bebek Arabası', productCount: 764, status: 'Aktif' },
        { id: 'SUB-205', name: 'Bebek Arabası Aksesuarları', productCount: 366, status: 'Aktif' },
        { id: 'SUB-206', name: 'Bebek Arabası Yağmurluğu', productCount: 554, status: 'Aktif' },
        { id: 'SUB-207', name: 'Bebek Arabası Minderi', productCount: 454, status: 'Aktif' },
        { id: 'SUB-208', name: 'Tüm Bebek Arabaları', productCount: 698, status: 'Aktif' },
        { id: 'SUB-209', name: 'Bebek Arabası Tavsiyeleri', productCount: 505, status: 'Aktif' },
        { id: 'SUB-210', name: 'Bebek Oto Koltuğu', productCount: 632, status: 'Aktif' },
        { id: 'SUB-211', name: 'Oto Koltuğu Yükseltici', productCount: 854, status: 'Aktif' },
        { id: 'SUB-212', name: 'Oto Koltuğu Aksesuarları', productCount: 127, status: 'Aktif' },
        { id: 'SUB-213', name: 'Portatif Mama Sandalyesi', productCount: 784, status: 'Aktif' },
        { id: 'SUB-214', name: 'Mama Sandalyesi Minderi & Kılıfı', productCount: 260, status: 'Aktif' },
        { id: 'SUB-215', name: 'Mama Sandalyesi Oyuncağı', productCount: 803, status: 'Aktif' },
        { id: 'SUB-216', name: 'Fonksiyonel Mama Sandalyesi', productCount: 974, status: 'Aktif' },
        { id: 'SUB-217', name: 'Kanguru', productCount: 272, status: 'Aktif' },
        { id: 'SUB-218', name: 'Portbebe', productCount: 109, status: 'Aktif' },
        { id: 'SUB-219', name: 'Sling', productCount: 544, status: 'Aktif' },
        { id: 'SUB-220', name: 'Örümcek Yürüteç', productCount: 646, status: 'Aktif' },
        { id: 'SUB-221', name: 'Otomatik Sallanan Ana Kucağı', productCount: 788, status: 'Aktif' },
        { id: 'SUB-222', name: 'Ev Tipi Ana Kucağı', productCount: 383, status: 'Aktif' },
        { id: 'SUB-223', name: 'Bebek Salıncakları', productCount: 301, status: 'Aktif' },
        { id: 'SUB-224', name: 'Anne Yanı Park Yatak', productCount: 190, status: 'Aktif' },
        { id: 'SUB-225', name: 'Park Beşik', productCount: 712, status: 'Aktif' },
        { id: 'SUB-226', name: 'Sallanan Beşik', productCount: 663, status: 'Aktif' },
        { id: 'SUB-227', name: 'Bebek Yatağı', productCount: 902, status: 'Aktif' },
      ]
    },
    {
      id: 'CAT-3', name: 'Bebek Bez & Mendil', productCount: 5181, status: 'Aktif',
      subcategories: [
        { id: 'SUB-301', name: 'Bebek Bezi', productCount: 477, status: 'Aktif' },
        { id: 'SUB-302', name: 'Külot Bebek Bez', productCount: 562, status: 'Aktif' },
        { id: 'SUB-303', name: 'Mayo Bebek Bezi', productCount: 333, status: 'Aktif' },
        { id: 'SUB-304', name: 'Yenidoğan Islak Mendil', productCount: 113, status: 'Aktif' },
        { id: 'SUB-305', name: 'Bebek Temizleme Pamuğu', productCount: 548, status: 'Aktif' },
        { id: 'SUB-306', name: 'Günlük Kullanım', productCount: 744, status: 'Aktif' },
        { id: 'SUB-307', name: 'Bebek Alt Açma Örtüsü', productCount: 353, status: 'Aktif' },
        { id: 'SUB-308', name: 'Kirli Bebek Bezi Atık Sistemi', productCount: 240, status: 'Aktif' },
      ]
    },
    {
      id: 'CAT-4', name: 'Bebek Oyuncak & Kitap', productCount: 3750, status: 'Aktif',
      subcategories: [
        { id: 'SUB-401', name: 'Eğitici Oyuncaklar', productCount: 311, status: 'Aktif' },
        { id: 'SUB-402', name: 'Pelüşlar', productCount: 755, status: 'Aktif' },
        { id: 'SUB-403', name: 'Oyun Setleri', productCount: 627, status: 'Aktif' },
        { id: 'SUB-404', name: 'Oyuncak Bebekler', productCount: 479, status: 'Aktif' },
        { id: 'SUB-405', name: 'Akülü Araçlar', productCount: 517, status: 'Aktif' },
        { id: 'SUB-406', name: 'Müzikli Oyuncaklar', productCount: 755, status: 'Aktif' },
        { id: 'SUB-407', name: 'Ahşap Oyuncaklar', productCount: 566, status: 'Aktif' },
        { id: 'SUB-408', name: 'Yürüme Oyuncakları', productCount: 138, status: 'Aktif' },
        { id: 'SUB-409', name: 'Bahçe ve Plaj Oyuncakları', productCount: 674, status: 'Aktif' },
        { id: 'SUB-410', name: 'Boyalar ve Boya Kalemleri', productCount: 803, status: 'Aktif' },
        { id: 'SUB-411', name: 'Oyun Halıları', productCount: 326, status: 'Aktif' },
        { id: 'SUB-412', name: 'Zihinsel Gelişim Oyuncakları', productCount: 692, status: 'Aktif' },
        { id: 'SUB-413', name: 'Dil Gelişimi Oyuncakları', productCount: 475, status: 'Aktif' },
        { id: 'SUB-414', name: 'Sosyal ve Duygusal Gelişim', productCount: 489, status: 'Aktif' },
        { id: 'SUB-415', name: 'Duyu Gelişimi Oyuncakları', productCount: 775, status: 'Aktif' },
        { id: 'SUB-416', name: 'Kaba Motor Kas Gelişimi', productCount: 266, status: 'Aktif' },
        { id: 'SUB-417', name: 'İnce Motor Gelişimi', productCount: 150, status: 'Aktif' },
        { id: 'SUB-418', name: 'Yenidoğan Kitapları', productCount: 926, status: 'Aktif' },
        { id: 'SUB-419', name: 'Boyama & Aktivite Kitapları', productCount: 445, status: 'Aktif' },
        { id: 'SUB-420', name: 'Resimli Hikâye & Masallar', productCount: 718, status: 'Aktif' },
        { id: 'SUB-421', name: 'Gelişim Kitapları & Setleri', productCount: 242, status: 'Aktif' },
        { id: 'SUB-422', name: 'Sesli & Hareketli Kitaplar', productCount: 186, status: 'Aktif' },
        { id: 'SUB-423', name: 'İlk Kitaplar', productCount: 842, status: 'Aktif' },
        { id: 'SUB-424', name: 'İngilizce Kitaplar', productCount: 975, status: 'Aktif' },
        { id: 'SUB-425', name: 'Ebeveyn Kitapları', productCount: 760, status: 'Aktif' },
      ]
    },
    {
      id: 'CAT-5', name: 'Bebek Beslenme', productCount: 4960, status: 'Aktif',
      subcategories: [
        { id: 'SUB-501', name: 'Biberon Mamaları', productCount: 598, status: 'Aktif' },
        { id: 'SUB-502', name: 'Keçi Sütü Mamaları', productCount: 168, status: 'Aktif' },
        { id: 'SUB-503', name: 'Kavanoz Mamaları', productCount: 744, status: 'Aktif' },
        { id: 'SUB-504', name: 'Kaşık Mamaları', productCount: 162, status: 'Aktif' },
        { id: 'SUB-505', name: 'Atıştırmalık Mamalar', productCount: 327, status: 'Aktif' },
        { id: 'SUB-506', name: 'Organik Beslenme Ürünleri', productCount: 754, status: 'Aktif' },
        { id: 'SUB-507', name: 'Gıda Takviyesi', productCount: 612, status: 'Aktif' },
        { id: 'SUB-508', name: 'Glutensiz Ürünler', productCount: 583, status: 'Aktif' },
        { id: 'SUB-509', name: 'Biberonlar', productCount: 401, status: 'Aktif' },
        { id: 'SUB-510', name: 'Biberon Emziği', productCount: 459, status: 'Aktif' },
        { id: 'SUB-511', name: 'Biberon Aksesuarları', productCount: 929, status: 'Aktif' },
        { id: 'SUB-512', name: 'Biberon & Emzik Temizleyici', productCount: 938, status: 'Aktif' },
        { id: 'SUB-513', name: 'Silikon Emzik', productCount: 292, status: 'Aktif' },
        { id: 'SUB-514', name: 'Kauçuk Emzik', productCount: 153, status: 'Aktif' },
        { id: 'SUB-515', name: 'Bebek Sebze Meyve Filesi', productCount: 894, status: 'Aktif' },
        { id: 'SUB-516', name: 'Bebek Mama Taşıma Kabı', productCount: 333, status: 'Aktif' },
        { id: 'SUB-517', name: 'Bebek Tabak, Çatal, Kaşık', productCount: 411, status: 'Aktif' },
        { id: 'SUB-518', name: 'Bebek Önlükleri', productCount: 738, status: 'Aktif' },
        { id: 'SUB-519', name: 'Termal Saklama Termosu', productCount: 670, status: 'Aktif' },
        { id: 'SUB-520', name: 'Bebek Alıştırma Bardağı', productCount: 165, status: 'Aktif' },
        { id: 'SUB-521', name: 'Mama Hazırlayıcılar', productCount: 318, status: 'Aktif' },
        { id: 'SUB-522', name: 'Buharlı Pişirici', productCount: 635, status: 'Aktif' },
        { id: 'SUB-523', name: 'Mama Isıtıcı', productCount: 175, status: 'Aktif' },
        { id: 'SUB-524', name: 'Sterilizatör', productCount: 632, status: 'Aktif' },
      ]
    },
    {
      id: 'CAT-6', name: 'Bebek Banyo & Bakım', productCount: 5809, status: 'Aktif',
      subcategories: [
        { id: 'SUB-601', name: 'Bebek Küveti', productCount: 742, status: 'Aktif' },
        { id: 'SUB-602', name: 'Bebek Küvet Filesi', productCount: 387, status: 'Aktif' },
        { id: 'SUB-603', name: 'Bebek Kovası', productCount: 923, status: 'Aktif' },
        { id: 'SUB-604', name: 'Bebek Küvet Oturağı', productCount: 583, status: 'Aktif' },
        { id: 'SUB-605', name: 'Bebek Banyo Süngerleri', productCount: 889, status: 'Aktif' },
        { id: 'SUB-606', name: 'Bebek Sabunları', productCount: 829, status: 'Aktif' },
        { id: 'SUB-607', name: 'Bebek Şampuanı', productCount: 473, status: 'Aktif' },
        { id: 'SUB-608', name: 'Bebek Yağı', productCount: 394, status: 'Aktif' },
        { id: 'SUB-609', name: 'Bebek Tarağı', productCount: 190, status: 'Aktif' },
        { id: 'SUB-610', name: 'Bebek Vücut Kremi', productCount: 146, status: 'Aktif' },
        { id: 'SUB-611', name: 'Banyo Oyuncakları', productCount: 381, status: 'Aktif' },
        { id: 'SUB-612', name: 'Bebek Ateş Ölçer', productCount: 199, status: 'Aktif' },
        { id: 'SUB-613', name: 'Bebek Sağlığı Ürünleri', productCount: 454, status: 'Aktif' },
        { id: 'SUB-614', name: 'Bebek Buhar Makinesi', productCount: 177, status: 'Aktif' },
        { id: 'SUB-615', name: 'Oda Termometresi', productCount: 391, status: 'Aktif' },
        { id: 'SUB-616', name: 'Bebek Burun Aspiratörü', productCount: 791, status: 'Aktif' },
        { id: 'SUB-617', name: 'Bebek Lazımlıkları', productCount: 444, status: 'Aktif' },
        { id: 'SUB-618', name: 'Bebek Alıştırma Külodu', productCount: 400, status: 'Aktif' },
        { id: 'SUB-619', name: 'Bebek Bakım Ürünleri', productCount: 973, status: 'Aktif' },
        { id: 'SUB-620', name: 'Bebek Güneş Kremi', productCount: 116, status: 'Aktif' },
        { id: 'SUB-621', name: 'Sinek Kovucuları', productCount: 219, status: 'Aktif' },
        { id: 'SUB-622', name: 'Bebek Pişik Kremi', productCount: 918, status: 'Aktif' },
        { id: 'SUB-623', name: 'Çatlak Önleyici Krem', productCount: 861, status: 'Aktif' },
        { id: 'SUB-624', name: 'Hijyenik Ped', productCount: 208, status: 'Aktif' },
        { id: 'SUB-625', name: 'Saç Bakım', productCount: 286, status: 'Aktif' },
        { id: 'SUB-626', name: 'Cilt Bakım', productCount: 311, status: 'Aktif' },
        { id: 'SUB-627', name: 'Kişisel Bakım', productCount: 763, status: 'Aktif' },
        { id: 'SUB-628', name: 'Bebek Diş Fırçası', productCount: 423, status: 'Aktif' },
        { id: 'SUB-629', name: 'Bebek Diş Macunu', productCount: 126, status: 'Aktif' },
        { id: 'SUB-630', name: 'Temizlik Ürünleri', productCount: 936, status: 'Aktif' },
        { id: 'SUB-631', name: 'Bebek Leke Çıkarıcı', productCount: 667, status: 'Aktif' },
        { id: 'SUB-632', name: 'Bebek Deterjanlar', productCount: 690, status: 'Aktif' },
        { id: 'SUB-633', name: 'Biberon & Emzik Temizleyici', productCount: 711, status: 'Aktif' },
      ]
    },
    {
      id: 'CAT-7', name: 'Bebek Emzirme', productCount: 5697, status: 'Aktif',
      subcategories: [
        { id: 'SUB-701', name: 'Emzirme Ürünleri', productCount: 728, status: 'Aktif' },
        { id: 'SUB-702', name: 'Tekli Elektrikli Süt Pompası', productCount: 429, status: 'Aktif' },
        { id: 'SUB-703', name: 'Çiftli Elektrikli Süt Pompası', productCount: 831, status: 'Aktif' },
        { id: 'SUB-704', name: 'Manuel Süt Pompası', productCount: 674, status: 'Aktif' },
        { id: 'SUB-705', name: 'Süt Saklama Poşeti ve Kabı', productCount: 606, status: 'Aktif' },
        { id: 'SUB-706', name: 'Süt Pompası', productCount: 981, status: 'Aktif' },
        { id: 'SUB-707', name: 'Emzirme Önlüğü', productCount: 379, status: 'Aktif' },
        { id: 'SUB-708', name: 'Emziren Anne İçecekleri', productCount: 325, status: 'Aktif' },
        { id: 'SUB-709', name: 'Emzirme Minderi', productCount: 789, status: 'Aktif' },
        { id: 'SUB-710', name: 'Emzirme Sütyeni', productCount: 338, status: 'Aktif' },
        { id: 'SUB-711', name: 'Göğüs Koruyucu', productCount: 876, status: 'Aktif' },
        { id: 'SUB-712', name: 'Göğüs Kremi', productCount: 568, status: 'Aktif' },
        { id: 'SUB-713', name: 'Göğüs Pedi', productCount: 591, status: 'Aktif' },
      ]
    },
    {
      id: 'CAT-8', name: 'Bebek Odası Mobilya', productCount: 3595, status: 'Aktif',
      subcategories: [
        { id: 'SUB-801', name: 'Beşik', productCount: 577, status: 'Aktif' },
        { id: 'SUB-802', name: 'Bebek Yatağı', productCount: 113, status: 'Aktif' },
        { id: 'SUB-803', name: 'Karyola', productCount: 236, status: 'Aktif' },
        { id: 'SUB-804', name: 'Dolap', productCount: 727, status: 'Aktif' },
        { id: 'SUB-805', name: 'Şifonyer', productCount: 615, status: 'Aktif' },
        { id: 'SUB-806', name: 'Çocuk Masa & Sandalye', productCount: 655, status: 'Aktif' },
        { id: 'SUB-807', name: 'Oyuncak Dolapları', productCount: 188, status: 'Aktif' },
        { id: 'SUB-808', name: 'Kitaplıklar', productCount: 958, status: 'Aktif' },
        { id: 'SUB-809', name: 'Bebek Odası Aksesuarları', productCount: 292, status: 'Aktif' },
        { id: 'SUB-810', name: 'Aydınlatma', productCount: 677, status: 'Aktif' },
        { id: 'SUB-811', name: 'Bebek Cibinlik', productCount: 272, status: 'Aktif' },
        { id: 'SUB-812', name: 'Çadır ve Tenteler', productCount: 164, status: 'Aktif' },
        { id: 'SUB-813', name: 'Bebek Uyku Seti', productCount: 503, status: 'Aktif' },
      ]
    },
    {
      id: 'CAT-9', name: 'Bebek Güvenlik', productCount: 2333, status: 'Aktif',
      subcategories: [
        { id: 'SUB-901', name: 'Evde Güvenlik Ürünleri', productCount: 694, status: 'Aktif' },
        { id: 'SUB-902', name: 'Araba İçin Güvenlik Ürünleri', productCount: 658, status: 'Aktif' },
        { id: 'SUB-903', name: 'Araba Güneşliği', productCount: 973, status: 'Aktif' },
        { id: 'SUB-904', name: 'Bebek Araba Aynası', productCount: 237, status: 'Aktif' },
        { id: 'SUB-905', name: 'Otomobil Aksesuarları', productCount: 189, status: 'Aktif' },
        { id: 'SUB-906', name: 'Bebek Köşe Koruyucuları', productCount: 701, status: 'Aktif' },
        { id: 'SUB-907', name: 'Bebek Emekleme Dizliği', productCount: 774, status: 'Aktif' },
        { id: 'SUB-908', name: 'Bebek Çekmece Kilidi', productCount: 958, status: 'Aktif' },
        { id: 'SUB-909', name: 'Bebek Priz Koruyucuları', productCount: 600, status: 'Aktif' },
        { id: 'SUB-910', name: 'Bebek Güvenlik Kapısı', productCount: 514, status: 'Aktif' },
        { id: 'SUB-911', name: 'Bebek Güvenli Yatış Yastığı', productCount: 809, status: 'Aktif' },
        { id: 'SUB-912', name: 'Kameralı Telsiz', productCount: 225, status: 'Aktif' },
        { id: 'SUB-913', name: 'Dijital Bebek Telsizi', productCount: 981, status: 'Aktif' },
      ]
    },
    {
      id: 'CAT-10', name: 'Kız Çocuk Giyim', productCount: 4663, status: 'Aktif',
      subcategories: [
        { id: 'SUB-1001', name: 'Tişört', productCount: 247, status: 'Aktif' },
        { id: 'SUB-1002', name: 'Kazak', productCount: 815, status: 'Aktif' },
        { id: 'SUB-1003', name: 'Hırka', productCount: 746, status: 'Aktif' },
        { id: 'SUB-1004', name: 'Sweatshirt', productCount: 562, status: 'Aktif' },
        { id: 'SUB-1005', name: 'Gömlek', productCount: 455, status: 'Aktif' },
        { id: 'SUB-1006', name: 'Bluz', productCount: 462, status: 'Aktif' },
        { id: 'SUB-1007', name: 'Pantolon', productCount: 367, status: 'Aktif' },
        { id: 'SUB-1008', name: 'Jean', productCount: 485, status: 'Aktif' },
        { id: 'SUB-1009', name: 'Eşofman Altı', productCount: 741, status: 'Aktif' },
        { id: 'SUB-1010', name: 'Tayt', productCount: 908, status: 'Aktif' },
        { id: 'SUB-1011', name: 'Şort', productCount: 492, status: 'Aktif' },
        { id: 'SUB-1012', name: 'Etek', productCount: 399, status: 'Aktif' },
        { id: 'SUB-1013', name: 'Mont', productCount: 545, status: 'Aktif' },
        { id: 'SUB-1014', name: 'Kaban', productCount: 114, status: 'Aktif' },
        { id: 'SUB-1015', name: 'Yağmurluk', productCount: 548, status: 'Aktif' },
        { id: 'SUB-1016', name: 'Ceket', productCount: 614, status: 'Aktif' },
        { id: 'SUB-1017', name: 'Yelek', productCount: 800, status: 'Aktif' },
        { id: 'SUB-1018', name: 'Günlük Elbise', productCount: 599, status: 'Aktif' },
        { id: 'SUB-1019', name: 'Abiye Elbise', productCount: 884, status: 'Aktif' },
        { id: 'SUB-1020', name: 'Tulum', productCount: 162, status: 'Aktif' },
        { id: 'SUB-1021', name: 'Salopet', productCount: 557, status: 'Aktif' },
        { id: 'SUB-1022', name: 'Pijama Takımı', productCount: 538, status: 'Aktif' },
        { id: 'SUB-1023', name: 'İç Çamaşırı', productCount: 251, status: 'Aktif' },
        { id: 'SUB-1024', name: 'Atlet', productCount: 411, status: 'Aktif' },
        { id: 'SUB-1025', name: 'Bornoz & Havlu', productCount: 622, status: 'Aktif' },
        { id: 'SUB-1026', name: 'Ev Terliği', productCount: 252, status: 'Aktif' },
        { id: 'SUB-1027', name: 'Mayo', productCount: 100, status: 'Aktif' },
        { id: 'SUB-1028', name: 'Bikini', productCount: 578, status: 'Aktif' },
        { id: 'SUB-1029', name: 'Haşema', productCount: 142, status: 'Aktif' },
        { id: 'SUB-1030', name: 'Plaj Havlusu', productCount: 629, status: 'Aktif' },
      ]
    },
    {
      id: 'CAT-11', name: 'Erkek Çocuk Giyim', productCount: 3554, status: 'Aktif',
      subcategories: [
        { id: 'SUB-1101', name: 'Tişört', productCount: 201, status: 'Aktif' },
        { id: 'SUB-1102', name: 'Polo Yaka Tişört', productCount: 988, status: 'Aktif' },
        { id: 'SUB-1103', name: 'Kazak', productCount: 646, status: 'Aktif' },
        { id: 'SUB-1104', name: 'Hırka', productCount: 550, status: 'Aktif' },
        { id: 'SUB-1105', name: 'Sweatshirt', productCount: 518, status: 'Aktif' },
        { id: 'SUB-1106', name: 'Gömlek', productCount: 464, status: 'Aktif' },
        { id: 'SUB-1107', name: 'Pantolon', productCount: 633, status: 'Aktif' },
        { id: 'SUB-1108', name: 'Jean', productCount: 237, status: 'Aktif' },
        { id: 'SUB-1109', name: 'Eşofman Altı', productCount: 552, status: 'Aktif' },
        { id: 'SUB-1110', name: 'Şort', productCount: 513, status: 'Aktif' },
        { id: 'SUB-1111', name: 'Mont', productCount: 545, status: 'Aktif' },
        { id: 'SUB-1112', name: 'Kaban', productCount: 843, status: 'Aktif' },
        { id: 'SUB-1113', name: 'Yağmurluk', productCount: 939, status: 'Aktif' },
        { id: 'SUB-1114', name: 'Ceket', productCount: 311, status: 'Aktif' },
        { id: 'SUB-1115', name: 'Yelek', productCount: 987, status: 'Aktif' },
        { id: 'SUB-1116', name: 'Takım Elbise', productCount: 791, status: 'Aktif' },
        { id: 'SUB-1117', name: 'Gömlek & Kravat Seti', productCount: 648, status: 'Aktif' },
        { id: 'SUB-1118', name: 'Yelekli Takım', productCount: 652, status: 'Aktif' },
        { id: 'SUB-1119', name: 'Pijama Takımı', productCount: 660, status: 'Aktif' },
        { id: 'SUB-1120', name: 'İç Çamaşırı', productCount: 947, status: 'Aktif' },
        { id: 'SUB-1121', name: 'Atlet', productCount: 280, status: 'Aktif' },
        { id: 'SUB-1122', name: 'Bornoz & Havlu', productCount: 299, status: 'Aktif' },
        { id: 'SUB-1123', name: 'Deniz Şortu', productCount: 325, status: 'Aktif' },
        { id: 'SUB-1124', name: 'Mayo', productCount: 975, status: 'Aktif' },
        { id: 'SUB-1125', name: 'Plaj Havlusu', productCount: 212, status: 'Aktif' },
      ]
    },
    {
      id: 'CAT-12', name: 'Çocuk Ayakkabı', productCount: 3895, status: 'Aktif',
      subcategories: [
        { id: 'SUB-1201', name: 'Sneaker', productCount: 412, status: 'Aktif' },
        { id: 'SUB-1202', name: 'Spor Ayakkabı', productCount: 511, status: 'Aktif' },
        { id: 'SUB-1203', name: 'Bez Ayakkabı', productCount: 935, status: 'Aktif' },
        { id: 'SUB-1204', name: 'Slip-on', productCount: 513, status: 'Aktif' },
        { id: 'SUB-1205', name: 'Bot', productCount: 481, status: 'Aktif' },
        { id: 'SUB-1206', name: 'Çizme', productCount: 480, status: 'Aktif' },
        { id: 'SUB-1207', name: 'Kar Botu', productCount: 276, status: 'Aktif' },
        { id: 'SUB-1208', name: 'Sandalet', productCount: 909, status: 'Aktif' },
        { id: 'SUB-1209', name: 'Terlik', productCount: 486, status: 'Aktif' },
        { id: 'SUB-1210', name: 'Deniz Ayakkabısı', productCount: 659, status: 'Aktif' },
        { id: 'SUB-1211', name: 'Klasik Ayakkabı', productCount: 683, status: 'Aktif' },
        { id: 'SUB-1212', name: 'Babet', productCount: 899, status: 'Aktif' },
        { id: 'SUB-1213', name: 'Rugan Ayakkabı', productCount: 622, status: 'Aktif' },
      ]
    },
    {
      id: 'CAT-13', name: 'Çocuk Aksesuar', productCount: 1656, status: 'Aktif',
      subcategories: [
        { id: 'SUB-1301', name: 'Sırt Çantası', productCount: 237, status: 'Aktif' },
        { id: 'SUB-1302', name: 'Bel Çantası', productCount: 713, status: 'Aktif' },
        { id: 'SUB-1303', name: 'Postacı Çantası', productCount: 139, status: 'Aktif' },
        { id: 'SUB-1304', name: 'Cüzdan', productCount: 115, status: 'Aktif' },
        { id: 'SUB-1305', name: 'Şapka & Bere', productCount: 274, status: 'Aktif' },
        { id: 'SUB-1306', name: 'Atkı & Boyunluk', productCount: 481, status: 'Aktif' },
        { id: 'SUB-1307', name: 'Eldiven', productCount: 744, status: 'Aktif' },
        { id: 'SUB-1308', name: 'Toka', productCount: 916, status: 'Aktif' },
        { id: 'SUB-1309', name: 'Taç', productCount: 135, status: 'Aktif' },
        { id: 'SUB-1310', name: 'Saç Bandı', productCount: 930, status: 'Aktif' },
        { id: 'SUB-1311', name: 'Çocuk Saati', productCount: 241, status: 'Aktif' },
        { id: 'SUB-1312', name: 'Kolye', productCount: 468, status: 'Aktif' },
        { id: 'SUB-1313', name: 'Bileklik', productCount: 669, status: 'Aktif' },
        { id: 'SUB-1314', name: 'Güneş Gözlüğü', productCount: 508, status: 'Aktif' },
      ]
    },
    {
      id: 'CAT-14', name: 'Çocuk Eğitici & Eğlence', productCount: 3862, status: 'Aktif',
      subcategories: [
        { id: 'SUB-1401', name: 'Kutu Oyunları', productCount: 337, status: 'Aktif' },
        { id: 'SUB-1402', name: 'Yapboz & Puzzle', productCount: 203, status: 'Aktif' },
        { id: 'SUB-1403', name: 'Bilim Setleri', productCount: 561, status: 'Aktif' },
        { id: 'SUB-1404', name: 'Kodlama Oyuncakları', productCount: 592, status: 'Aktif' },
        { id: 'SUB-1405', name: 'Boyama Setleri', productCount: 504, status: 'Aktif' },
        { id: 'SUB-1406', name: 'Kil & Oyun Hamuru', productCount: 472, status: 'Aktif' },
        { id: 'SUB-1407', name: 'Takı Tasarım Setleri', productCount: 504, status: 'Aktif' },
        { id: 'SUB-1408', name: 'Müzik Aletleri', productCount: 941, status: 'Aktif' },
        { id: 'SUB-1409', name: 'Aksiyon Figürleri', productCount: 875, status: 'Aktif' },
        { id: 'SUB-1410', name: 'Model Araçlar', productCount: 152, status: 'Aktif' },
        { id: 'SUB-1411', name: 'Oyuncak Bebekler', productCount: 707, status: 'Aktif' },
        { id: 'SUB-1412', name: 'Uzaktan Kumandalı Araçlar', productCount: 210, status: 'Aktif' },
        { id: 'SUB-1413', name: 'Bisiklet', productCount: 633, status: 'Aktif' },
        { id: 'SUB-1414', name: 'Scooter', productCount: 678, status: 'Aktif' },
        { id: 'SUB-1415', name: 'Paten & Kaykay', productCount: 481, status: 'Aktif' },
        { id: 'SUB-1416', name: 'Top Oyunları', productCount: 247, status: 'Aktif' },
        { id: 'SUB-1417', name: 'Uçurtma', productCount: 565, status: 'Aktif' },
      ]
    },
    {
      id: 'CAT-15', name: 'Çocuk Okul & Kırtasiye', productCount: 4647, status: 'Aktif',
      subcategories: [
        { id: 'SUB-1501', name: 'Çekçekli Çanta', productCount: 125, status: 'Aktif' },
        { id: 'SUB-1502', name: 'Beslenme Çantası', productCount: 570, status: 'Aktif' },
        { id: 'SUB-1503', name: 'Kalem Kutusu', productCount: 777, status: 'Aktif' },
        { id: 'SUB-1504', name: 'Boya Kalemleri', productCount: 550, status: 'Aktif' },
        { id: 'SUB-1505', name: 'Defterler', productCount: 307, status: 'Aktif' },
        { id: 'SUB-1506', name: 'Okul Setleri', productCount: 261, status: 'Aktif' },
        { id: 'SUB-1507', name: 'Okuma Kitapları', productCount: 881, status: 'Aktif' },
        { id: 'SUB-1508', name: 'Çizgi Romanlar', productCount: 147, status: 'Aktif' },
        { id: 'SUB-1509', name: 'Test & Kaynak Kitapları', productCount: 708, status: 'Aktif' },
      ]
    },
    {
      id: 'CAT-16', name: 'Çocuk Odası', productCount: 4174, status: 'Aktif',
      subcategories: [
        { id: 'SUB-1601', name: 'Çocuk Karyolası', productCount: 528, status: 'Aktif' },
        { id: 'SUB-1602', name: 'Çalışma Masası', productCount: 965, status: 'Aktif' },
        { id: 'SUB-1603', name: 'Gardırop', productCount: 224, status: 'Aktif' },
        { id: 'SUB-1604', name: 'Kitaplık', productCount: 784, status: 'Aktif' },
        { id: 'SUB-1605', name: 'Oyuncak Dolabı', productCount: 122, status: 'Aktif' },
        { id: 'SUB-1606', name: 'Nevresim Takımı', productCount: 657, status: 'Aktif' },
        { id: 'SUB-1607', name: 'Yatak Örtüsü', productCount: 291, status: 'Aktif' },
        { id: 'SUB-1608', name: 'Çocuk Halısı', productCount: 846, status: 'Aktif' },
        { id: 'SUB-1609', name: 'Perde', productCount: 691, status: 'Aktif' },
        { id: 'SUB-1610', name: 'Gece Lambası', productCount: 592, status: 'Aktif' },
        { id: 'SUB-1611', name: 'Masa Lambası', productCount: 109, status: 'Aktif' },
        { id: 'SUB-1612', name: 'Duvar Süsleri', productCount: 249, status: 'Aktif' },
        { id: 'SUB-1613', name: 'Tablo & Poster', productCount: 677, status: 'Aktif' },
      ]
    }
  ];


  const toggleCat = (id: string) => {
    setExpandedCats(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const filteredCategories = categories.filter(c => {
    // 1. Tip Filtresi (Bebek/Çocuk/Organik)
    if (activeFilter === 'bebek' && !c.name.toLowerCase().includes('bebek')) return false;
    if (activeFilter === 'cocuk' && !c.name.toLowerCase().includes('çocuk')) return false;
    if (activeFilter === 'organik' && !c.name.toLowerCase().includes('organik') && !c.subcategories.some(sub => sub.name.toLowerCase().includes('organik'))) return false;

    // 2. Arama Filtresi
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const matchCat = c.name.toLowerCase().includes(q);
    const matchSub = c.subcategories.some(sub => sub.name.toLowerCase().includes(q));
    return matchCat || matchSub;
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-[1400px] mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
         <div>
           <h1 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`}>Kategori & Alt Kategori Yönetimi</h1>
           <p className={`text-[13px] font-medium mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Pazaryerindeki ana ve alt kategorileri, ağaç (tree) yapısında düzenleyin.</p>
         </div>
         <div className="flex gap-3">
           <button onClick={() => setShowModal({type: 'new'})} className="w-full md:w-auto px-5 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-wider text-white bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
              + Yeni Kategori Ekle
           </button>
         </div>
      </div>

      <div className={`${cardClass} p-2 mb-6 w-full overflow-hidden`}>
         <div className="px-2 md:px-4 w-full flex flex-col md:flex-row gap-4 items-center py-2">
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {['all', 'bebek', 'cocuk', 'organik'].map(filter => (
                 <button
                   key={filter}
                   onClick={() => setActiveFilter(filter as any)}
                   className={`px-5 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeFilter === filter ? 'bg-primary text-white shadow-lg shadow-primary/20' : isDark ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                 >
                   {filter === 'all' ? 'Tümü' : filter === 'bebek' ? 'Bebek' : filter === 'cocuk' ? 'Çocuk' : 'Organik'}
                 </button>
              ))}
            </div>

            <div className={`relative flex items-center w-full md:flex-1 h-12 rounded-xl border transition-colors ${isDark ? 'bg-[#1A1D1F] border-white/10 focus-within:border-primary/50' : 'bg-gray-50 border-gray-200 focus-within:border-primary/50 focus-within:bg-white'}`}>
               <svg className={`w-5 h-5 ml-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
               <input 
                 type="text" 
                 placeholder="Kategori veya Alt Kategori Ara..." 
                 value={searchQuery}
                 onChange={(e) => {
                   setSearchQuery(e.target.value);
                   if (e.target.value) setExpandedCats(categories.map(c => c.id));
                 }}
                 className="w-full h-full bg-transparent border-none outline-none px-4 text-[13px] font-bold placeholder:text-gray-400 text-inherit"
               />
            </div>
         </div>
      </div>

      <div className={`${cardClass} overflow-hidden`}>
        <div className="p-4 md:p-6">
          {loading ? (
            <div className="p-8 text-center text-gray-500 text-sm font-medium">Kategori ağacı yükleniyor...</div>
          ) : filteredCategories.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm font-medium">Aranan kriterde kategori bulunamadı.</div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredCategories.map(cat => (
                <div key={cat.id} className={`rounded-2xl border transition-all ${isDark ? 'border-white/5 bg-[#1A1D1F]' : 'border-gray-200 bg-gray-50/50'}`}>
                  {/* Main Category Row */}
                  <div 
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors rounded-2xl"
                    onClick={() => toggleCat(cat.id)}
                  >
                    <div className="flex items-center gap-4">
                      <button className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${expandedCats.includes(cat.id) ? 'rotate-90' : ''} ${isDark ? 'bg-white/10 text-white' : 'bg-white shadow-sm text-gray-600'}`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                      </button>
                      <div className="flex flex-col">
                        <span className={`text-[14px] font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{cat.name}</span>
                        <span className={`text-[11px] font-medium mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{cat.id} • {cat.productCount.toLocaleString()} Ürün</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <span className={`hidden md:inline-flex px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${cat.status === 'Aktif' ? (isDark ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-green-50 text-green-600 border-green-100') : (isDark ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-red-50 text-red-600 border-red-100')}`}>
                         {cat.status}
                       </span>
                       <button onClick={(e) => { e.stopPropagation(); setShowModal({type: 'edit', data: cat}); }} className={`p-2 rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900 hover:bg-white shadow-sm'}`}>
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                       </button>
                    </div>
                  </div>

                  {/* Subcategories (Alt Kategoriler) */}
                  {expandedCats.includes(cat.id) && (
                    <div className={`border-t p-4 md:pl-16 pl-6 flex flex-col gap-2 ${isDark ? 'border-white/5 bg-[#121214]/50' : 'border-gray-200 bg-white'}`}>
                      <div className="flex items-center justify-between mb-2">
                         <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Alt Kategoriler</span>
                         <button onClick={() => setShowModal({type: 'new_sub', parentId: cat.id})} className="text-[11px] font-bold text-primary hover:underline">+ Yeni Ekle</button>
                      </div>
                      
                      {cat.subcategories.map(sub => (
                        <div key={sub.id} className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${isDark ? 'border-white/5 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-1.5 h-1.5 rounded-full ${sub.status === 'Aktif' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <div className="flex flex-col">
                              <span className={`text-[13px] font-bold ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>{sub.name}</span>
                              <span className={`text-[10px] font-medium mt-0.5 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{sub.productCount.toLocaleString()} Ürün</span>
                            </div>
                          </div>
                          <button onClick={() => setShowModal({type: 'edit_sub', data: sub})} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${isDark ? 'border-white/10 text-gray-400 hover:bg-white/10 hover:text-white' : 'border-gray-200 text-gray-600 hover:bg-white shadow-sm'}`}>
                            Düzenle
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up" onClick={() => setShowModal(null)}>
          <div className={`w-full max-w-md p-6 rounded-[24px] shadow-2xl border ${isDark ? 'bg-[#1A1D1F] border-white/10' : 'bg-white border-gray-100'}`} onClick={e => e.stopPropagation()}>
            <h3 className={`text-xl font-black mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {showModal.type === 'new' ? 'Yeni Kategori' : showModal.type === 'edit' ? 'Kategori Düzenle' : 'Alt Kategori İşlemi'}
            </h3>
            <p className={`text-[12px] mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Kategori adını ve durumunu buradan güncelleyebilirsiniz.</p>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className={`block text-[11px] font-bold uppercase mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Kategori Adı</label>
                <input type="text" defaultValue={showModal.data?.name || ''} className={`w-full h-12 rounded-xl px-4 text-[13px] font-bold border outline-none focus:border-primary transition-colors ${isDark ? 'bg-[#121214] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} placeholder="Örn: Bebek Giyim" />
              </div>
              <div>
                <label className={`block text-[11px] font-bold uppercase mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Durum</label>
                <select className={`w-full h-12 rounded-xl px-4 text-[13px] font-bold border outline-none focus:border-primary transition-colors appearance-none ${isDark ? 'bg-[#121214] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}>
                  <option value="Aktif">Aktif (Yayında)</option>
                  <option value="Pasif">Pasif (Gizli)</option>
                </select>
              </div>
              
              <div className="flex gap-3 mt-4">
                <button onClick={() => setShowModal(null)} className={`flex-1 p-3 rounded-xl font-bold text-[13px] transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}>İptal</button>
                <button onClick={() => setShowModal(null)} className="flex-1 p-3 rounded-xl font-bold text-[13px] bg-primary hover:bg-primary/90 text-white transition-colors shadow-lg shadow-primary/20">Kaydet</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
