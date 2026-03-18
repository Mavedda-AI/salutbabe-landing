import React from "react";

export default function KvkkDisclosurePage() {
  return (
    <main className="max-w-3xl mx-auto pt-28 pb-20 px-4">
      <div className="bg-white/80 rounded-2xl shadow-md border border-neutral-100 p-8">
        <h1 className="text-4xl font-extrabold mb-8 text-blue-700 tracking-tight">KVKK Aydınlatma Metni</h1>
        <p className="text-neutral-700 text-lg mb-8">Kişisel verilerinizin korunması ve gizliliğinizin sağlanması bizim için önceliklidir. 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında, verilerinizin işlenmesiyle ilgili olarak sizi bilgilendirmek isteriz.</p>
        <h2 className="text-2xl font-bold mb-3 text-neutral-800">Veri Sorumlusu</h2>
        <p className="mb-6 text-neutral-700">Mavedda Teknoloji A.Ş. - Karaova Mah. S. Demirel Blv. Bellona No:195 Kuşadası / Aydın</p>
        <h2 className="text-2xl font-bold mb-3 text-neutral-800">İşlenen Kişisel Veriler</h2>
        <ul className="list-disc pl-6 text-neutral-700 mb-6 space-y-2">
          <li>Kimlik ve iletişim bilgileri</li>
          <li>Kullanıcı işlemleri ve işlem geçmişi</li>
          <li>IP ve cihaz bilgileri</li>
        </ul>
        <h2 className="text-2xl font-bold mb-3 text-neutral-800">Veri İşleme Amaçları</h2>
        <ul className="list-disc pl-6 text-neutral-700 mb-6 space-y-2">
          <li>Hizmet sunmak ve geliştirmek</li>
          <li>Yasal yükümlülükleri yerine getirmek</li>
          <li>İstatistiksel analiz ve raporlama</li>
        </ul>
        <h2 className="text-2xl font-bold mb-3 text-neutral-800">Haklarınız</h2>
        <p className="mb-6 text-neutral-700">KVKK kapsamında, verilerinizle ilgili bilgi talep edebilir, düzeltilmesini veya silinmesini isteyebilirsiniz. Tüm talepleriniz için <a href="mailto:kvkk@salutbabe.com" className="underline text-blue-700">kvkk@salutbabe.com</a> adresine başvurabilirsiniz.</p>
      </div>
    </main>
  );
}
