import React from "react";

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto pt-28 pb-20 px-4">
      <div className="bg-white/80 rounded-2xl shadow-md border border-neutral-100 p-8">
        <h1 className="text-4xl font-extrabold mb-8 text-blue-700 tracking-tight">İletişim</h1>
        <p className="text-neutral-700 text-lg mb-8">Bize aşağıdaki iletişim kanallarından ulaşabilirsiniz. Size en kısa sürede dönüş yapacağız.</p>
        <ul className="list-disc pl-6 text-neutral-700 mb-8 space-y-2">
          <li>E-posta: <a href="mailto:destek@salutbabe.com" className="underline text-blue-700">destek@salutbabe.com</a></li>
          <li>Adres: Karaova Mah. S. Demirel Blv. Bellona No:195 Kuşadası / Aydın</li>
          <li>Telefon: 0 (555) 123 45 67</li>
        </ul>
        <h2 className="text-2xl font-bold mb-3 text-neutral-800">Çalışma Saatlerimiz</h2>
        <p className="mb-0 text-neutral-700">Hafta içi: 09:00 - 18:00<br/>Cumartesi: 10:00 - 16:00<br/>Pazar: Kapalı</p>
      </div>
    </main>
  );
}
