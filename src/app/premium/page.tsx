import React from "react";

export default function PremiumPage() {
  return (
    <main className="max-w-3xl mx-auto py-16 px-4 pt-24">
      <h1 className="text-3xl font-bold mb-6 text-pink-700">Premium Hizmet Paketleri</h1>
      <p className="text-neutral-700 text-lg mb-6">Salutbabe Premium ile ikinci el alışverişte ayrıcalıklı bir deneyim yaşayın! Size özel avantajlar, güvenli ödeme, hızlı işlem ve daha fazlası için Premium paketlerimizi inceleyin.</p>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Avantajlar</h2>
        <ul className="list-disc pl-6 text-neutral-700 space-y-1">
          <li>Güvenli ödeme altyapısı ve alıcı-satıcı koruması</li>
          <li>Ücretsiz kargo ve hızlı teslimat</li>
          <li>7/24 müşteri desteği</li>
          <li>İlanınızda öne çıkarma ve daha fazla görünürlük</li>
          <li>Detaylı ürün raporu ve ekspertiz hizmeti</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Paketler</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6 bg-white shadow-sm">
            <h3 className="text-lg font-bold text-blue-700 mb-2">Standart Paket</h3>
            <ul className="list-disc pl-5 text-neutral-700 mb-2">
              <li>Güvenli ödeme</li>
              <li>Temel müşteri desteği</li>
              <li>Ücretsiz kargo</li>
            </ul>
            <p className="font-bold text-lg text-pink-600">Ücretsiz</p>
          </div>
          <div className="border rounded-lg p-6 bg-white shadow-md">
            <h3 className="text-lg font-bold text-pink-700 mb-2">Premium Paket</h3>
            <ul className="list-disc pl-5 text-neutral-700 mb-2">
              <li>Öne çıkarılmış ilan</li>
              <li>7/24 müşteri desteği</li>
              <li>Detaylı ürün raporu</li>
              <li>Hızlı işlem ve öncelikli destek</li>
            </ul>
            <p className="font-bold text-lg text-pink-600">Aylık 99 TL</p>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Sıkça Sorulan Sorular</h2>
        <ul className="list-disc pl-6 text-neutral-700 space-y-1">
          <li>Premium’a nasıl geçiş yapabilirim? <span className="text-gray-500">Profilinizden veya ana sayfadaki “Hemen Başla” butonundan geçiş yapabilirsiniz.</span></li>
          <li>Paketler arasında geçiş yapabilir miyim? <span className="text-gray-500">Evet, istediğiniz zaman paket değişikliği yapabilirsiniz.</span></li>
          <li>Premium avantajları ne kadar sürede aktif olur? <span className="text-gray-500">Ödeme sonrası anında aktifleşir.</span></li>
        </ul>
      </section>
    </main>
  );
}

