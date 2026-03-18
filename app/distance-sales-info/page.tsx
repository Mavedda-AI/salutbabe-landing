import React from "react";

export default function DistanceSalesInfoPage() {
  return (
    <main className="max-w-3xl mx-auto pt-28 pb-20 px-4">
      <div className="bg-white/80 rounded-2xl shadow-md border border-neutral-100 p-8">
        <h1 className="text-4xl font-extrabold mb-8 text-blue-700 tracking-tight">Mesafeli Satış Ön Bilgilendirme</h1>
        <p className="text-neutral-700 text-lg mb-8">Bu metin, 6502 sayılı Tüketicinin Korunması Hakkında Kanun kapsamında, mesafeli satış sözleşmeleri öncesinde tüketicilerin bilgilendirilmesi amacıyla hazırlanmıştır.</p>
        <h2 className="text-2xl font-bold mb-3 text-neutral-800">Satıcı Bilgileri</h2>
        <ul className="list-disc pl-6 text-neutral-700 mb-6 space-y-2">
          <li>Unvan: Mavedda Teknoloji A.Ş.</li>
          <li>Adres: Karaova Mah. S. Demirel Blv. Bellona No:195 Kuşadası / Aydın</li>
          <li>Telefon: 0 (555) 123 45 67</li>
          <li>E-posta: destek@salutbabe.com</li>
        </ul>
        <h2 className="text-2xl font-bold mb-3 text-neutral-800">Ürün ve Hizmet Bilgileri</h2>
        <p className="mb-6 text-neutral-700">Satın alınan ürün/hizmetin temel özellikleri, fiyatı ve ödeme bilgileri sipariş sırasında ayrıca sunulmaktadır.</p>
        <h2 className="text-2xl font-bold mb-3 text-neutral-800">Cayma Hakkı</h2>
        <p className="mb-6 text-neutral-700">Tüketici, 14 gün içinde hiçbir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir.</p>
        <h2 className="text-2xl font-bold mb-3 text-neutral-800">İade ve İptal Koşulları</h2>
        <p className="mb-6 text-neutral-700">İade ve iptal işlemleri için <a href="mailto:destek@salutbabe.com" className="underline text-blue-700">destek@salutbabe.com</a> adresine başvurabilirsiniz.</p>
      </div>
    </main>
  );
}
