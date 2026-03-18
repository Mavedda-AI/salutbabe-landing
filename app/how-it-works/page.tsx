import React from "react";

export default function HowItWorksPage() {
  return (
    <main className="max-w-3xl mx-auto pt-28 pb-20 px-4">
      <div className="bg-white/80 rounded-2xl shadow-md border border-neutral-100 p-8">
        <h1 className="text-4xl font-extrabold mb-8 text-blue-700 tracking-tight">
          Nasıl Çalışır?
        </h1>
        <ol className="list-decimal pl-6 text-neutral-700 mb-8 space-y-2">
          <li>
            <span className="font-semibold">Kayıt Olun:</span> Hızlıca üye olun,
            profilinizi oluşturun.
          </li>
          <li>
            <span className="font-semibold">İlanınızı Ekleyin:</span> Satmak
            istediğiniz ürünü detaylıca açıklayın ve fotoğraflarını yükleyin.
          </li>
          <li>
            <span className="font-semibold">Güvenli İletişim:</span>
            Platform üzerinden güvenli mesajlaşma ile iletişime geçin.
          </li>
          <li>
            <span className="font-semibold">Güvenli Ödeme:</span> Ödeme, platform
            güvencesiyle gerçekleşir. Satıcıya ürün tesliminden sonra aktarılır.
          </li>
          <li>
            <span className="font-semibold">Kargo & Teslimat:</span> Ürün,
            anlaşmalı kargo ile hızlıca alıcıya ulaşır.
          </li>
          <li>
            <span className="font-semibold">Değerlendirme:</span> Alıcı ve satıcı
            birbirini puanlayarak topluluğa katkı sağlar.
          </li>
        </ol>
        <h2 className="text-2xl font-bold mb-3 text-neutral-800">
          Neden Salutbabe?
        </h2>
        <ul className="list-disc pl-6 text-neutral-700 mb-6 space-y-2">
          <li>Güvenli ödeme ve koruma sistemi</li>
          <li>Şeffaf ve hızlı işlem</li>
          <li>Kullanıcı dostu arayüz</li>
          <li>7/24 destek</li>
        </ul>
        <p className="text-neutral-600">
          Daha fazla bilgi için{" "}
          <a
            href="/contact"
            className="underline text-blue-700"
          >
            iletişim
          </a>{" "}
          sayfamızdan bize ulaşabilirsiniz.
        </p>
      </div>
    </main>
  );
}
