import React from "react";

export default function TicariIletisimIzinMetniPage() {
  return (
    <main className="max-w-3xl mx-auto py-16 px-4 pt-24">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Ticari İletişim İzin Metni</h1>
      <p className="text-neutral-700 text-lg mb-4">Salutbabe olarak, size kampanya, duyuru ve bilgilendirme amaçlı ticari elektronik iletiler gönderebilmemiz için izninize ihtiyaç duyuyoruz.</p>
      <h2 className="text-xl font-semibold mb-2">İzin Kapsamı</h2>
      <ul className="list-disc pl-6 text-neutral-700 mb-4">
        <li>Kampanya ve fırsat bildirimleri</li>
        <li>Yenilikler ve güncellemeler</li>
        <li>Anket ve memnuniyet çalışmaları</li>
      </ul>
      <h2 className="text-xl font-semibold mb-2">İptal Hakkı</h2>
      <p className="mb-4">Dilediğiniz zaman ticari iletişim izninizi iptal edebilirsiniz. İptal için <a href="mailto:destek@salutbabe.com" className="underline text-blue-700">destek@salutbabe.com</a> adresine e-posta gönderebilirsiniz.</p>
      <p className="text-neutral-600">Daha fazla bilgi için bizimle iletişime geçebilirsiniz.</p>
    </main>
  );
}

