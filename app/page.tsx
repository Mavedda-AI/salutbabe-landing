import Hero from "../components/Hero";
import Advantages from "../components/Advantages";
import Testimonials from "../components/Testimonials";
import ProductGrid from "../components/ProductGrid";

export default function Home() {
  return (
    <main className="bg-white min-h-screen">
      <Hero />
      <Advantages />
      <ProductGrid />
      <Testimonials />
      
      {/* Final CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-neutral-950 -z-10">
           <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-blue/20 blur-[120px]"></div>
           <div className="absolute bottom-0 left-0 w-1/2 h-full bg-primary-pink/20 blur-[120px]"></div>
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tighter">
            Bebeğinizin Gardırobunda <br />
            <span className="premium-gradient-text">Yeni Bir Dönem</span> Başlatın
          </h2>
          <p className="text-xl text-neutral-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Hemen üye olun, binlerce anne ile sürdürülebilir ve güvenli alışverişin keyfini çıkarın.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a href="#" className="px-12 py-4 bg-white text-neutral-950 font-black rounded-full shadow-2xl hover:bg-primary-blue hover:text-white transition-all duration-500 hover:-translate-y-1 active:scale-95 text-lg">
              Ücretsiz Üye Ol
            </a>
            <a href="#" className="px-12 py-4 bg-neutral-900 text-white font-black rounded-full shadow-2xl hover:bg-neutral-800 transition-all duration-500 border border-neutral-800 hover:-translate-y-1 active:scale-95 text-lg">
              Daha Fazla Bilgi
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
