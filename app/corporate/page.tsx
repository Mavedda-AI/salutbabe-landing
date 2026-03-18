import React from "react";

export default function KurumsalPage() {
  return (
    <main className="max-w-3xl mx-auto py-16 px-4 pt-24">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Kurumsal</h1>
      <p className="text-neutral-700 text-lg mb-4">Salutbabe, Mavedda Teknoloji A.Ş. çatısı altında faaliyet göstermektedir. Kurumsal yapımız, güçlü finansal altyapımız ve deneyimli ekibimizle sektörde fark yaratıyoruz.</p>
      <h2 className="text-xl font-semibold mb-2">Şirket Bilgileri</h2>
      <ul className="list-disc pl-6 text-neutral-700 mb-4">
        <li>Unvan: Mavedda Teknoloji A.Ş.</li>
        <li>Adres: Karaova Mah. S. Demirel Blv. Bellona No:195 Kuşadası / Aydın</li>
        <li>Vergi No: 10375602082</li>
        <li>Kuruluş Yılı: 2024</li>
      </ul>
      <h2 className="text-xl font-semibold mb-2">Ekibimiz</h2>
      <p className="mb-4">Alanında uzman yazılım geliştiriciler, müşteri temsilcileri ve operasyon ekibimizle her zaman yanınızdayız.</p>
      <h2 className="text-xl font-semibold mb-2">İletişim</h2>
      <p className="mb-4">Kurumsal iş birlikleri ve diğer talepleriniz için <a href="mailto:kurumsal@salutbabe.com" className="underline text-blue-700">kurumsal@salutbabe.com</a> adresinden bize ulaşabilirsiniz.</p>
    </main>
  );
}

