import React from "react";
import Image from "next/image";

const Hero = () => (
  <section className="relative pt-32 pb-20 overflow-hidden">
    {/* Background Decorative Elements */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-primary-blue/5 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-primary-pink/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
    </div>

    <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-blue/10 text-primary-blue text-sm font-bold mb-8 animate-fade-in-up">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-blue opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-blue"></span>
        </span>
        YENİ NESİL ANNE DAYANIŞMASI
      </div>

      <h1 className="text-5xl md:text-7xl font-extrabold text-neutral-900 mb-8 tracking-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        Anneler İçin <br />
        <span className="premium-gradient-text">İkinci El</span> Podyumu
      </h1>

      <p className="text-lg md:text-2xl text-neutral-600 mb-12 max-w-3xl leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        Bebeğinizin hikayesi olan kıyafetlerini yeni sahipleriyle buluşturun. 
        Sürdürülebilir, güvenli ve sevgi dolu bir alışveriş deneyimi Salutbabe ile başlar.
      </p>

      <div className="flex flex-col sm:flex-row gap-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <button className="px-10 py-4 bg-primary-blue text-white font-bold rounded-full shadow-2xl shadow-blue-500/30 hover:bg-neutral-900 transition-all duration-500 hover:-translate-y-1 active:scale-95 text-lg">
          Hemen Satmaya Başla
        </button>
        <button className="px-10 py-4 bg-white text-neutral-900 font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 border border-neutral-100 hover:-translate-y-1 active:scale-95 text-lg">
          Koleksiyonları Keşfet
        </button>
      </div>

      <div className="mt-20 w-full max-w-5xl relative animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
        <div className="absolute -inset-1 bg-linear-to-r from-blue-500 to-pink-500 rounded-[2.5rem] blur opacity-20"></div>
        <div className="relative bg-white p-4 rounded-[2.5rem] shadow-2xl border border-neutral-100 overflow-hidden">
          <div className="aspect-[21/9] bg-neutral-50 rounded-[2rem] flex items-center justify-center relative overflow-hidden group">
             <Image 
                src="/logo-salutbabe.png" 
                alt="Salutbabe Hero" 
                width={300} 
                height={100}
                className="opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
             />
             <div className="absolute inset-0 bg-linear-to-t from-white/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
