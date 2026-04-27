import React from "react";

export default function KullanimKosullariPage() {
  return (
    <main className="max-w-3xl mx-auto py-16 px-4 pt-24">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Kullanım Koşulları</h1>
      <p className="text-neutral-700 text-lg mb-4">Salutbabe platformunu kullanarak aşağıdaki koşulları kabul etmiş olursunuz. Lütfen platformumuzu kullanmadan önce bu koşulları dikkatlice okuyunuz.</p>
      <h2 className="text-xl font-semibold mb-2">Genel Kurallar</h2>
      <ul className="list-disc pl-6 text-neutral-700 mb-4">
        <li>Platform yalnızca yasal amaçlarla kullanılabilir.</li>
        <li>Yanıltıcı, sahte veya yasa dışı içerik paylaşmak yasaktır.</li>
        <li>Kullanıcılar, hesap bilgilerinin güvenliğinden sorumludur.</li>
      </ul>
      <h2 className="text-xl font-semibold mb-2">Sorumluluk Reddi</h2>
      <p className="mb-4">Salutbabe, kullanıcılar arasında gerçekleşen işlemlerde yalnızca aracı konumundadır. Ürün/hizmet ile ilgili tüm sorumluluk satıcıya aittir.</p>
      <h2 className="text-xl font-semibold mb-2">Değişiklikler</h2>
      <p className="mb-4">Salutbabe, kullanım koşullarında değişiklik yapma hakkını saklı tutar. Güncel koşullar web sitemizde yayınlanır.</p>
      <p className="text-neutral-600">Her türlü soru ve görüşünüz için <a href="/iletisim" className="underline text-blue-700">iletişim</a> sayfamızdan bize ulaşabilirsiniz.</p>
    </main>
  );
}
