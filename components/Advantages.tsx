import React from "react";

const advantages = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-blue"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    ),
    title: "Şeffaf & Güvenli",
    desc: "Her işlemde tam şeffaflık ve güvenli ödeme sistemi.",
    color: "bg-blue-50"
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
    ),
    title: "Döngüsel Anne Modası",
    desc: "Gardırobunuzu yenileyin, sürdürülebilir bir yaşama katkı sağlayın.",
    color: "bg-green-50"
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-pink"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
    ),
    title: "Işık Hızında Satış",
    desc: "Ürünlerinizi saniyeler içinde listeleyin ve anında satın.",
    color: "bg-pink-50"
  },
];

const Advantages = () => (
  <section className="py-24 bg-neutral-50/50 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16 animate-fade-in-up">
        <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-900 mb-4 tracking-tight">
          Neden <span className="premium-gradient-text">Salutbabe?</span>
        </h2>
        <p className="text-lg text-neutral-500 max-w-2xl mx-auto italic font-medium">Bizi diğerlerinden ayıran, annelere olan tutkumuzdur.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {advantages.map((adv, idx) => (
          <div
            key={idx}
            className="group p-10 rounded-[2.5rem] bg-white border border-neutral-100 hover:border-primary-blue/30 transition-all duration-700 hover:shadow-2xl hover:shadow-blue-500/5 animate-fade-in-up"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className={`mb-8 w-20 h-20 flex items-center justify-center rounded-[1.8rem] ${adv.color} transition-all duration-700 group-hover:scale-110 group-hover:rotate-6`}>
              {adv.icon}
            </div>
            <h3 className="text-2xl font-bold mb-4 text-neutral-900 transition-colors duration-300 group-hover:text-primary-blue">
              {adv.title}
            </h3>
            <p className="text-neutral-500 text-lg leading-relaxed">{adv.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Advantages;

