import React from "react";

export default function IletisimPage() {
  return (
    <main className="max-w-3xl mx-auto py-16 px-4 pt-24">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">İletişim</h1>
      <p className="text-neutral-700 text-lg mb-4">Bize ulaşmak için aşağıdaki iletişim kanallarını kullanabilirsiniz. Size en kısa sürede dönüş yapacağız.</p>
      <ul className="list-disc pl-6 text-neutral-700 mb-4">
        <li>E-posta: <a href="mailto:destek@salutbabe.com" className="underline text-blue-700">destek@salutbabe.com</a></li>
        <li>Adres: Karaova Mah. S. Demirel Blv. Bellona No:195 Kuşadası / Aydın</li>
        <li>Telefon: 0 (555) 123 45 67</li>
      </ul>
      <h2 className="text-xl font-semibold mb-2">Çalışma Saatlerimiz</h2>
      <p className="mb-4">Hafta içi: 09:00 - 18:00<br/>Cumartesi: 10:00 - 16:00<br/>Pazar: Kapalı</p>
      <h2 className="text-xl font-semibold mb-2">Bize Yazın</h2>
      <form className="space-y-4">
        <input type="text" placeholder="Adınız Soyadınız" className="w-full border rounded px-3 py-2" />
        <input type="email" placeholder="E-posta Adresiniz" className="w-full border rounded px-3 py-2" />
        <textarea placeholder="Mesajınız" className="w-full border rounded px-3 py-2" rows={4}></textarea>
        <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded font-semibold">Gönder</button>
      </form>
    </main>
  );
}
