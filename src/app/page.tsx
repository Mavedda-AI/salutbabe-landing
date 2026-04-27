import {Hero} from "../components/sections/Hero";

export default function Home() {
  return (
    <>
      <Hero />
      
      {/* Featured Categories Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-primary">Kategorilere Göz Atın</h2>
              <p className="text-lg text-gray-500 font-medium max-w-md">Bebeğinizin her ihtiyacı için özenle seçilmiş kategoriler.</p>
            </div>
            <button className="text-primary font-bold border-b-2 border-primary/10 hover:border-primary transition-all pb-1 px-1">
              Tüm Kategoriler →
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: 'Giyim', icon: '👕', color: 'bg-blue-50' },
              { name: 'Beslenme', icon: '🍼', color: 'bg-orange-50' },
              { name: 'Oyuncak', icon: '🧸', color: 'bg-purple-50' },
              { name: 'Mobilya', icon: '🛏️', color: 'bg-green-50' }
            ].map((cat, i) => (
              <div key={i} className={`${cat.color} group p-10 rounded-[40px] text-center cursor-pointer hover:scale-105 transition-all`}>
                <span className="text-6xl mb-6 block group-hover:scale-125 transition-transform">{cat.icon}</span>
                <h3 className="text-xl font-black text-primary">{cat.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Features Section */}
      <section className="section-padding bg-brand-bg">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { title: 'Güvenli Ödeme', desc: 'Para havuzda tutulur, siz onaylamadan satıcıya aktarılmaz.', icon: '🛡️' },
            { title: 'Kolay Kargo', desc: 'Anlaşmalı kargo kodları ile saniyeler içinde gönderim yapın.', icon: '📦' },
            { title: '7/24 Destek', desc: 'Dilediğiniz an uzman ekibimize ulaşıp destek alabilirsiniz.', icon: '💬' }
          ].map((feat, i) => (
            <div key={i} className="space-y-6">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-primary/5">
                {feat.icon}
              </div>
              <h3 className="text-2xl font-black text-primary">{feat.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
