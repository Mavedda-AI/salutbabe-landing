import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto pt-28 pb-20 px-4">
      <div className="bg-white/80 rounded-2xl shadow-md border border-neutral-100 p-8">
        <h1 className="text-4xl font-extrabold mb-8 text-blue-700 tracking-tight">Gizlilik Politikası</h1>
        <p className="text-neutral-700 text-lg mb-8">Kullanıcılarımızın gizliliği bizim için çok önemlidir. Salutbabe olarak, kişisel verilerinizi korumak ve gizliliğinizi sağlamak için en yüksek güvenlik standartlarını uyguluyoruz.</p>
        <h2 className="text-2xl font-bold mb-3 text-neutral-800">Toplanan Bilgiler</h2>
        <ul className="list-disc pl-6 text-neutral-700 mb-6 space-y-2">
          <li>Ad, soyad, e-posta adresi, telefon numarası</li>
          <li>IP adresi ve cihaz bilgileri</li>
          <li>Kullanım ve işlem geçmişi</li>
        </ul>
        <h2 className="text-2xl font-bold mb-3 text-neutral-800">Veri Kullanımı</h2>
        <ul className="list-disc pl-6 text-neutral-700 mb-6 space-y-2">
          <li>Hizmet sunmak ve geliştirmek</li>
          <li>Kullanıcı desteği sağlamak</li>
          <li>Yasal yükümlülükleri yerine getirmek</li>
        </ul>
        <h2 className="text-2xl font-bold mb-3 text-neutral-800">Veri Paylaşımı</h2>
        <p className="mb-6 text-neutral-700">Kişisel verileriniz, yasal zorunluluklar dışında üçüncü kişilerle paylaşılmaz.</p>
        <h2 className="text-2xl font-bold mb-3 text-neutral-800">Haklarınız</h2>
        <p className="mb-6 text-neutral-700">KVKK kapsamında, verilerinizle ilgili her türlü talebinizi bize iletebilirsiniz.</p>
        <p className="text-neutral-600">Detaylı bilgi için lütfen <a href="/contact" className="underline text-blue-700">bizimle iletişime geçin</a>.</p>
      </div>
    </main>
  );
}
