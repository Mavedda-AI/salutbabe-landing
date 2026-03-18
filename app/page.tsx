import Hero from "../components/Hero";
import Advantages from "../components/Advantages";
import Testimonials from "../components/Testimonials";

export default function Home() {
  return (
    <main className="bg-linear-to-b from-blue-50 via-white to-pink-50 min-h-screen pt-24">
      <Hero />
      <Advantages />
      <Testimonials />
      <section className="py-16 bg-blue-700 text-white text-center mt-12">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Hemen Başla!</h2>
          <p className="text-lg mb-6">İkinci el alışverişin yeni nesil, güvenli ve şeffaf platformunda yerini al.</p>
          <a href="#" className="inline-block px-8 py-3 bg-pink-500 hover:bg-pink-600 rounded-full font-semibold text-lg transition">Ücretsiz Üye Ol</a>
        </div>
      </section>
    </main>
  );
}
