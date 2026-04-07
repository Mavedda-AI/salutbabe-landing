import FloatingHeader from "../components/FloatingHeader";
import Footer from "../components/Footer";
import "./globals.css";
import {CartProvider} from "../context/CartContext";
import CartToast from "../components/CartToast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased bg-white">
        <CartProvider>
          <CartToast />
          <FloatingHeader />
          <div className="relative">{children}</div>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
