import React from "react";

export default function NasilCalisirPage() {
  return (
    <main className="max-w-3xl mx-auto py-16 px-4 pt-24">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Nasıl Çalışır?</h1>
      <ol className="list-decimal pl-6 text-neutral-700 mb-6 space-y-2">
        <li>
          <span className="font-semibold">Kayıt Olun:</span> Hızlıca üye olun,
          profilinizi oluşturun.
        </li>
        <li>
          <span className="font-semibold">İlanınızı Ekleyin:</span> Satmak
          istediğiniz ürünü detaylıca açıklayın ve fotoğraflarını yükleyin.
        </li>
        <li>
          <span className="font-semibold">Alıcı ile Güvenli İletişim:</span>
          Platform üzerinden güvenli mesajlaşma ile iletişime geçin.
        </li>
        <li>
          <span className="font-semibold">Güvenli Ödeme:</span> Ödeme, platform
          güvencesiyle gerçekleşir. Satıcıya ürün tesliminden sonra aktarılır.
        </li>
        <li>
          <span className="font-semibold">Kargo ve Teslimat:</span> Ürün,
          anlaşmalı kargo ile hızlıca alıcıya ulaşır.
        </li>
        <li>
          <span className="font-semibold">Değerlendirme:</span> Alıcı ve satıcı
          birbirini puanlayarak topluluğa katkı sağlar.
        </li>
      </ol>
      <h2 className="text-xl font-semibold mb-2">Neden Salutbabe?</h2>
      <ul className="list-disc pl-6 text-neutral-700 mb-4">
        <li>Güvenli ödeme ve koruma sistemi</li>
        <li>Şeffaf ve hızlı işlem</li>
        <li>Kullanıcı dostu arayüz</li>
        <li>7/24 destek</li>
      </ul>
      <p className="text-neutral-600">
        Daha fazla bilgi için{" "}
        <a
          href="/iletisim"
          className="underline text-blue-700"
        >
          iletişim
        </a>{" "}
        sayfamızdan bize ulaşabilirsiniz.
      </p>
    </main>
  );
}

