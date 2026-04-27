import type {Metadata} from "next";
import "../styles/globals.css";
import {Navbar} from "../components/layout/Navbar";
import {Footer} from "../components/layout/Footer";
import {CartProvider} from "../context/CartContext";

export const metadata: Metadata = {
  title: "Salutbabe | Anne ve Bebekler İçin Güvenli Alışveriş",
  description: "Türkiye'nin ilk anne-bebek pazaryeri. Bebek kıyafetleri, pusetler, oyuncaklar ve daha fazlasını güvenle alın, satın veya kiralayın.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased">
        <CartProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
