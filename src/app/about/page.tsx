import React from "react";

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto pt-28 pb-20 px-4">
      <div className="bg-white/80 rounded-2xl shadow-md border border-neutral-100 p-8">
        <h1 className="text-4xl font-extrabold mb-8 text-blue-700 tracking-tight">
          Hakkımızda
        </h1>
        <p className="text-neutral-700 text-lg mb-8">
          Salutbabe, ikinci el alışverişte güven, şeffaflık ve hız sunmak amacıyla
          2024 yılında kurulmuştur. Amacımız, kullanıcılarımıza en iyi ikinci el
          deneyimini yaşatmak ve sektörde yeni bir standart oluşturmaktır.
        </p>
        <h2 className="text-2xl font-bold mb-3 text-neutral-800">
          Misyonumuz
        </h2>
        <p className="mb-6 text-neutral-700">
          Kullanıcılarımızın güvenle alışveriş yapabileceği, yenilikçi ve kullanıcı
          dostu bir platform sunmak.
        </p>
        <h2 className="text-2xl font-bold mb-3 text-neutral-800">
          Vizyonumuz
        </h2>
        <p className="mb-6 text-neutral-700">
          Türkiye'nin en güvenilir ve en çok tercih edilen ikinci el platformu
          olmak.
        </p>
        <h2 className="text-2xl font-bold mb-3 text-neutral-800">
          Değerlerimiz
        </h2>
        <ul className="list-disc pl-6 text-neutral-700 mb-6 space-y-2">
          <li>Güven ve şeffaflık</li>
          <li>Yenilikçilik</li>
          <li>Kullanıcı memnuniyeti</li>
          <li>Sosyal sorumluluk</li>
        </ul>
        <p className="text-neutral-600">
          Daha fazla bilgi için{" "}
          <a
            href="/contact"
            className="underline text-blue-700"
          >
            iletişime geçebilirsiniz
          </a>
          .
        </p>
      </div>
    </main>
  );
}
