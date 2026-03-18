import React from "react";

export default function MesafeliSatisOnBilgilendirmePage() {
  return (
    <main className="max-w-3xl mx-auto py-16 px-4 pt-24">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Mesafeli Satış Ön Bilgilendirme</h1>
      <p className="text-neutral-700 text-lg mb-4">Bu metin, 6502 sayılı Tüketicinin Korunması Hakkında Kanun kapsamında, mesafeli satış sözleşmeleri öncesinde tüketicilerin bilgilendirilmesi amacıyla hazırlanmıştır.</p>
      <h2 className="text-xl font-semibold mb-2">Satıcı Bilgileri</h2>
      <ul className="list-disc pl-6 text-neutral-700 mb-4">
        <li>Unvan: Mavedda Teknoloji A.Ş.</li>
        <li>Adres: Karaova Mah. S. Demirel Blv. Bellona No:195 Kuşadası / Aydın</li>
        <li>Telefon: 0 (555) 123 45 67</li>
        <li>E-posta: destek@salutbabe.com</li>
      </ul>
      <h2 className="text-xl font-semibold mb-2">Ürün ve Hizmet Bilgileri</h2>
      <p className="mb-4">Satın alınan ürün/hizmetin temel özellikleri, fiyatı ve ödeme bilgileri sipariş sırasında ayrıca sunulmaktadır.</p>
      <h2 className="text-xl font-semibold mb-2">Cayma Hakkı</h2>
      <p className="mb-4">Tüketici, 14 gün içinde hiçbir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir.</p>
      <h2 className="text-xl font-semibold mb-2">İade ve İptal Koşulları</h2>
      <p className="mb-4">İade ve iptal işlemleri için <a href="mailto:destek@salutbabe.com" className="underline text-blue-700">destek@salutbabe.com</a> adresine başvurabilirsiniz.</p>
    </main>
  );
}

