import React from "react";
import Image from "next/image";


const Hero = () => (
  <section className="hero-section flex flex-col items-center justify-center text-center py-20 bg-white border-b border-neutral-200">
    <Image src="/logo-salutbabe.png" alt="Salutbabe Logosu" width={160} height={40} className="mb-8 w-40 h-auto z-10" />
    <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-6 z-10">
      Anneler İçin <span className="text-blue-700">İkinci El</span> Bebek Kıyafetleri Platformu
    </h1>
    <p className="text-lg md:text-xl text-neutral-600 mb-8 max-w-2xl z-10">
      Bebeğinizin küçülen kıyafetlerini güvenle satın, başka annelerin bebekleri için uygun fiyatlı ve kaliteli ürünler keşfedin. Döngüsel ekonomiye katkı sağlayın, sürdürülebilir alışverişin keyfini çıkarın.
    </p>
    <div className="flex flex-col md:flex-row gap-4 z-10">
      <a href="#" className="px-8 py-3 bg-blue-700 text-white font-semibold rounded-full shadow-sm hover:bg-blue-800 transition text-base">Hemen Satmaya Başla</a>
      <a href="#" className="px-8 py-3 bg-neutral-200 text-neutral-800 font-semibold rounded-full shadow-sm hover:bg-neutral-300 transition text-base">Alışverişe Başla</a>
    </div>
  </section>
);

export default Hero;
