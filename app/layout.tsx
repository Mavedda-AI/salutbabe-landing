import FloatingHeader from "../components/FloatingHeader";
import Footer from "../components/Footer";
import "./globals.css";
import {CartProvider} from "../context/CartContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased bg-white">
        <CartProvider>
          <FloatingHeader />
          <div className="relative">{children}</div>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
