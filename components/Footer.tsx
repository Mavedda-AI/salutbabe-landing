import React from "react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => (
  <footer className="site-footer bg-gray-100 pt-8 pb-0">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col md:flex-row md:justify-between items-center md:items-start gap-8 mb-8">
        <div className="flex flex-col items-start md:items-start">
          <div className="mb-2">
            <Image src="/logo-salutbabe.png" alt="salutbabe logo" className="h-8" width={160} height={32} />
          </div>
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
              <li><Link href="/about" className="hover:underline">Hakkımızda</Link></li>
              <li><Link href="/corporate" className="hover:underline">Kurumsal</Link></li>
              <li><Link href="/privacy-policy" className="hover:underline">Gizlilik Politikası</Link></li>
              <li><Link href="/contact" className="hover:underline">İletişim</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-xs text-gray-700 mb-2">Platform</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li><Link href="/how-it-works" className="hover:underline">Nasıl Çalışır</Link></li>
              <li><Link href="/premium" className="hover:underline">Premium</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-xs text-gray-700 mb-2">Güvenlik & Uyum</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li><Link href="/kvkk-disclosure" className="hover:underline">KVKK Aydınlatma Metni</Link></li>
              <li><Link href="/commercial-communication-consent" className="hover:underline">Ticari İletişim İzin Metni</Link></li>
              <li><Link href="/distance-sales-info" className="hover:underline">Mesafeli Satış Ön Bilgilendirme</Link></li>
              <li><Link href="/terms-of-use" className="hover:underline">Kullanım Koşulları</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 mt-0">
        <p>© 2026 salutbabe — Tüm hakları saklıdır.</p>
        <p>salutbabe bir Mavedda markasıdır.</p>
      </div>
      {/* Ana içerik bloğu bittiği yer */}
      <div className="w-full flex justify-center items-end m-0 p-0">
        <Image src="/logo_band_colored.svg" alt="logo band colored" className="h-16 m-0 p-0" width={320} height={64} />
      </div>
    </div>
  </footer>
);

export default Footer;
