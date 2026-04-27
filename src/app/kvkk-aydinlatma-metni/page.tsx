import React from "react";

export default function KvkkAydinlatmaMetniPage() {
  return (
    <main className="max-w-3xl mx-auto py-16 px-4 pt-24">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">KVKK Aydınlatma Metni</h1>
      <p className="text-neutral-700 text-lg mb-4">Kişisel verilerinizin korunması ve gizliliğinizin sağlanması bizim için önceliklidir. 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) kapsamında, verilerinizin işlenmesiyle ilgili olarak sizi bilgilendirmek isteriz.</p>
      <h2 className="text-xl font-semibold mb-2">Veri Sorumlusu</h2>
      <p className="mb-4">Mavedda Teknoloji A.Ş. - Karaova Mah. S. Demirel Blv. Bellona No:195 Kuşadası / Aydın</p>
      <h2 className="text-xl font-semibold mb-2">İşlenen Kişisel Veriler</h2>
      <ul className="list-disc pl-6 text-neutral-700 mb-4">
        <li>Kimlik ve iletişim bilgileri</li>
        <li>Kullanıcı işlemleri ve işlem geçmişi</li>
        <li>IP ve cihaz bilgileri</li>
      </ul>
      <h2 className="text-xl font-semibold mb-2">Veri İşleme Amaçları</h2>
      <ul className="list-disc pl-6 text-neutral-700 mb-4">
        <li>Hizmet sunmak ve geliştirmek</li>
        <li>Yasal yükümlülükleri yerine getirmek</li>
        <li>İstatistiksel analiz ve raporlama</li>
      </ul>
      <h2 className="text-xl font-semibold mb-2">Haklarınız</h2>
      <p className="mb-4">KVKK kapsamında, verilerinizle ilgili bilgi talep edebilir, düzeltilmesini veya silinmesini isteyebilirsiniz. Tüm talepleriniz için <a href="mailto:kvkk@salutbabe.com" className="underline text-blue-700">kvkk@salutbabe.com</a> adresine başvurabilirsiniz.</p>
    </main>
  );
}
