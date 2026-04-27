import React from "react";

export default function GizlilikPolitikasiPage() {
  return (
    <main className="max-w-3xl mx-auto py-16 px-4 pt-24">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Gizlilik Politikası</h1>
      <p className="text-neutral-700 text-lg mb-4">Kullanıcılarımızın gizliliği bizim için çok önemlidir. Salutbabe olarak, kişisel verilerinizi korumak ve gizliliğinizi sağlamak için en yüksek güvenlik standartlarını uyguluyoruz.</p>
      <h2 className="text-xl font-semibold mb-2">Toplanan Bilgiler</h2>
      <ul className="list-disc pl-6 text-neutral-700 mb-4">
        <li>Ad, soyad, e-posta adresi, telefon numarası</li>
        <li>IP adresi ve cihaz bilgileri</li>
        <li>Kullanım ve işlem geçmişi</li>
      </ul>
      <h2 className="text-xl font-semibold mb-2">Veri Kullanımı</h2>
      <ul className="list-disc pl-6 text-neutral-700 mb-4">
        <li>Hizmet sunmak ve geliştirmek</li>
        <li>Kullanıcı desteği sağlamak</li>
        <li>Yasal yükümlülükleri yerine getirmek</li>
      </ul>
      <h2 className="text-xl font-semibold mb-2">Veri Paylaşımı</h2>
      <p className="mb-4">Kişisel verileriniz, yasal zorunluluklar dışında üçüncü kişilerle paylaşılmaz.</p>
      <h2 className="text-xl font-semibold mb-2">Haklarınız</h2>
      <p className="mb-4">KVKK kapsamında, verilerinizle ilgili her türlü talebinizi bize iletebilirsiniz.</p>
      <p className="text-neutral-600">Detaylı bilgi için lütfen bizimle iletişime geçin.</p>
    </main>
  );
}
