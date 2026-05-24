import React from "react";
import Image from "next/image";

const testimonials = [
  {
    name: "Elif Yıldız",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    text: "Kızımın küçülen kıyafetlerini kolayca sattım, hem dolabım ferahladı hem de başka annelere faydam oldu. Çok güvenli ve pratik!",
    role: "Modern Anne"
  },
  {
    name: "Ayşe Demir",
    avatar: "https://randomuser.me/api/portraits/women/43.jpg",
    text: "Bebekler için kaliteli ikinci el ürünleri uygun fiyata bulmak harika. Platformun arayüzü çok sıcak ve kullanımı kolay.",
    role: "Bilinçli Ebeveyn"
  },
  {
    name: "Zeynep Kaya",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    text: "Satış süreci çok hızlı ilerledi, güvenli ödeme sistemi sayesinde hiç endişe etmedim. Tüm annelere tavsiye ederim!",
    role: "Yuvam Kolay"
  },
];

const Testimonials = () => (
  <section className="py-24 bg-white relative">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16 animate-fade-in-up">
        <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-900 mb-4 tracking-tight">
          Annelerin <span className="premium-gradient-text">Gözünden</span>
        </h2>
        <p className="text-lg text-neutral-500 max-w-2xl mx-auto">Binlerce anne Salutbabe ile hem kazanıyor hem de paylaşıyor.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {testimonials.map((t, idx) => (
          <div
            key={idx}
            className="flex flex-col relative group animate-fade-in-up"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className="absolute -top-6 -right-2 text-8xl text-neutral-50 font-serif -z-10 group-hover:text-primary-pink/10 transition-colors duration-700">&quot;</div>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="absolute -inset-1 bg-linear-to-tr from-primary-blue to-primary-pink rounded-full blur opacity-40 group-hover:opacity-100 transition-opacity duration-700"></div>
                <Image
                  src={t.avatar}
                  alt={t.name}
                  width={64}
                  height={64}
                  className="relative w-16 h-16 rounded-full border-2 border-white object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold text-neutral-900 leading-none mb-1">{t.name}</h4>
                <span className="text-xs font-black text-primary-pink uppercase tracking-widest">{t.role}</span>
              </div>
            </div>
            <p className="text-neutral-600 text-lg leading-relaxed italic">
              &quot;{t.text}&quot;
            </p>
            <div className="mt-8 flex gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
