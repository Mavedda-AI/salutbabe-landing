import Header from "../components/Header";
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
      <body className="antialiased bg-[#f8fafc]">
        <CartProvider>
          <CartToast />
          <Header />
          <div className="relative pt-32">{children}</div>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
