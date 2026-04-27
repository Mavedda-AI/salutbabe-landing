import React from "react";

export default function CorporatePage() {
  return (
    <main className="max-w-3xl mx-auto pt-28 pb-20 px-4">
      <div className="bg-white/80 rounded-2xl shadow-md border border-neutral-100 p-8">
        <h1 className="text-4xl font-extrabold mb-8 text-blue-700 tracking-tight">Kurumsal</h1>
        <p className="text-neutral-700 text-lg mb-8">Salutbabe, Mavedda Teknoloji A.Ş. çatısı altında faaliyet göstermektedir. Güçlü finansal altyapımız ve deneyimli ekibimizle sektörde fark yaratıyoruz.</p>
        <h2 className="text-2xl font-bold mb-3 text-neutral-800">Şirket Bilgileri</h2>
        <ul className="list-disc pl-6 text-neutral-700 mb-6 space-y-2">
          <li>Unvan: Mavedda Teknoloji A.Ş.</li>
          <li>Adres: Karaova Mah. S. Demirel Blv. Bellona No:195 Kuşadası / Aydın</li>
          <li>Vergi No: 10375602082</li>
          <li>Kuruluş Yılı: 2024</li>
        </ul>
        <h2 className="text-2xl font-bold mb-3 text-neutral-800">Ekibimiz</h2>
        <p className="mb-6 text-neutral-700">Alanında uzman yazılım geliştiriciler, müşteri temsilcileri ve operasyon ekibimizle her zaman yanınızdayız.</p>
        <h2 className="text-2xl font-bold mb-3 text-neutral-800">İletişim</h2>
        <p className="text-neutral-600">Kurumsal iş birlikleri ve diğer talepleriniz için <a href="mailto:kurumsal@salutbabe.com" className="underline text-blue-700">kurumsal@salutbabe.com</a> adresinden bize ulaşabilirsiniz.</p>
      </div>
    </main>
  );
}
