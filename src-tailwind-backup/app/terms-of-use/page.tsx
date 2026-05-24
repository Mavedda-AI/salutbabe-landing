import React from "react";

export default function KullanimKosullariPage() {
  return (
    <main className="max-w-3xl mx-auto pt-28 pb-20 px-4">
      <div className="bg-white/80 rounded-2xl shadow-md border border-neutral-100 p-8">
        <h1 className="text-4xl font-extrabold mb-8 text-blue-700 tracking-tight">Kullanım Koşulları</h1>
        <p className="text-neutral-700 text-lg mb-8">Salutbabe platformunu kullanarak aşağıdaki koşulları kabul etmiş olursunuz. Lütfen platformumuzu kullanmadan önce bu koşulları dikkatlice okuyunuz.</p>
        <h2 className="text-2xl font-bold mb-3 text-neutral-800">Genel Kurallar</h2>
        <ul className="list-disc pl-6 text-neutral-700 mb-8 space-y-2">
          <li>Platform yalnızca yasal amaçlarla kullanılabilir.</li>
          <li>Yanıltıcı, sahte veya yasa dışı içerik paylaşmak yasaktır.</li>
          <li>Kullanıcılar, hesap bilgilerinin güvenliğinden sorumludur.</li>
        </ul>
        <h2 className="text-2xl font-bold mb-3 text-neutral-800">Sorumluluk Reddi</h2>
        <p className="mb-8 text-neutral-700">Salutbabe, kullanıcılar arasında gerçekleşen işlemlerde yalnızca aracı konumundadır. Ürün/hizmet ile ilgili tüm sorumluluk satıcıya aittir.</p>
        <h2 className="text-2xl font-bold mb-3 text-neutral-800">Değişiklikler</h2>
        <p className="mb-8 text-neutral-700">Salutbabe, kullanım koşullarında değişiklik yapma hakkını saklı tutar. Güncel koşullar web sitemizde yayınlanır.</p>
        <p className="text-neutral-600">Her türlü soru ve görüşünüz için <a href="/iletisim" className="underline text-blue-700">iletişim</a> sayfamızdan bize ulaşabilirsiniz.</p>
      </div>
    </main>
  );
}
