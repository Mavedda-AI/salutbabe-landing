import React from "react";
import Image from "next/image";

const Hero = () => (
  <section className="hero-section flex flex-col items-center justify-center text-center py-24 bg-linear-to-r from-pink-100 via-blue-100 to-yellow-100 relative overflow-hidden">
    {/* Hareketli arka plan şekilleri */}
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none animate-pulse">
      <div className="absolute left-10 top-10 w-32 h-32 bg-pink-300 rounded-full blur-2xl opacity-30 animate-bounce" />
      <div className="absolute right-10 top-20 w-24 h-24 bg-blue-300 rounded-full blur-2xl opacity-30 animate-bounce" />
      <div className="absolute left-1/2 bottom-10 w-40 h-40 bg-yellow-300 rounded-full blur-2xl opacity-30 animate-bounce" />
    </div>
    <Image src="/logo-salutbabe.png" alt="Salutbabe Logo" width={192} height={48} className="mb-8 w-48 h-auto z-10 drop-shadow-lg" />
    <h1 className="text-5xl md:text-6xl font-extrabold text-pink-600 mb-6 z-10 animate-fade-in">
      Eğlenceli İkinci El Deneyimi
    </h1>
    <p className="text-xl md:text-2xl text-blue-700 mb-8 max-w-xl z-10 animate-fade-in">
      Şeffaf, güvenli ve adil alışveriş. Gardırobunu yenile, döngüsel modaya katıl.
    </p>
  </section>
);

export default Hero;
