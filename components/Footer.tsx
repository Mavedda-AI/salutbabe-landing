import React from "react";

const Footer = () => (
  <footer className="site-footer bg-gray-100 py-14">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col md:flex-row md:justify-between items-center md:items-start gap-8 mb-8">
        <div className="flex flex-col items-center md:items-start">
          {/* Logo kaldırıldı */}
          <p className="text-sm text-gray-600 mb-2">“Yeni nesil ikinci el deneyimi — şeffaf, güvenli ve hızlı.”</p>
          <hr className="w-full border-gray-300 my-2" />
          <div className="text-xs text-gray-500 mb-2">
            <p className="font-semibold">İletişim</p>
            <ul>
              <li>E-posta: <a href="mailto:destek@salutbabe.com" className="underline">destek@salutbabe.com</a></li>
              <li>Adres: Karaova Mah. S. Demirel Blv. Bellona No:195 Kuşadası / Aydın</li>
              <li>Vergi No: 10375602082</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <div>
            <p className="font-semibold text-xs text-gray-700 mb-2">Hakkımızda</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li><a href="#hakkimizda" className="hover:underline">Kurumsal</a></li>
              <li><a href="#gizlilik" className="hover:underline">Gizlilik Politikası</a></li>
              <li><a href="#iletisim" className="hover:underline">İletişim</a></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-xs text-gray-700 mb-2">Platform</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li><a href="#nasilcalisir" className="hover:underline">Nasıl Çalışır</a></li>
              <li><a href="#hizmetpaket" className="hover:underline">Hizmet Paketleri</a></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-xs text-gray-700 mb-2">Güvenlik & Uyum</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li><a href="#kvkk" className="hover:underline">KVKK Aydınlatma Metni</a></li>
              <li><a href="#ticari" className="hover:underline">Ticari İletişim İzin Metni</a></li>
              <li><a href="#bilgilendirme" className="hover:underline">Mesafeli Satış Ön Bilgilendirme</a></li>
              <li><a href="#kosullar" className="hover:underline">Kullanım Koşulları</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center mt-4">
        <img src="/logo_band_colored.svg" alt="logo band colored" className="h-8" />
      </div>
      <hr className="border-gray-300 mb-6 mt-2" />
      <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 mt-2">
        <p>© 2026 salutbabe — Tüm hakları saklıdır.</p>
        <p>salutbabe bir Mavedda markasıdır.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
