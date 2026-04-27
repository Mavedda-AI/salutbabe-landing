import React from "react";

export default function CommercialCommunicationConsentPage() {
  return (
    <main className="max-w-3xl mx-auto pt-28 pb-20 px-4">
      <div className="bg-white/80 rounded-2xl shadow-md border border-neutral-100 p-8">
        <h1 className="text-4xl font-extrabold mb-8 text-blue-700 tracking-tight">Ticari İletişim İzin Metni</h1>
        <p className="text-neutral-700 text-lg mb-8">Salutbabe olarak, size kampanya, duyuru ve bilgilendirme amaçlı ticari elektronik iletiler gönderebilmemiz için izninize ihtiyaç duyuyoruz.</p>
        <h2 className="text-2xl font-bold mb-3 text-neutral-800">İzin Kapsamı</h2>
        <ul className="list-disc pl-6 text-neutral-700 mb-6 space-y-2">
          <li>Kampanya ve fırsat bildirimleri</li>
          <li>Yenilikler ve güncellemeler</li>
          <li>Anket ve memnuniyet çalışmaları</li>
        </ul>
        <h2 className="text-2xl font-bold mb-3 text-neutral-800">İptal Hakkı</h2>
        <p className="mb-6 text-neutral-700">Dilediğiniz zaman ticari iletişim izninizi iptal edebilirsiniz. İptal için <a href="mailto:destek@salutbabe.com" className="underline text-blue-700">destek@salutbabe.com</a> adresine e-posta gönderebilirsiniz.</p>
        <p className="text-neutral-600">Daha fazla bilgi için bizimle iletişime geçebilirsiniz.</p>
      </div>
    </main>
  );
}
