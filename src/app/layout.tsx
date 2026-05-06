import Header from "../components/Header";
import Footer from "../components/Footer";
import "./globals.css";
import {CartProvider} from "../context/CartContext";
import {ThemeLanguageProvider} from "../context/ThemeLanguageContext";
import {ToastProvider} from "../context/ToastContext";
import CartToast from "../components/CartToast";

export const metadata = {
  title: "SalutBabe",
  description: "SalutBabe - Eco-friendly and stylish baby clothes",
  icons: {
    icon: "/logo-favicon.png",
    shortcut: "/logo-favicon.png",
    apple: "/logo-favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased bg-background text-text-primary transition-colors duration-300">
        <ThemeLanguageProvider>
          <ToastProvider>
            <CartProvider>
              <CartToast />
              <Header />
              <div className="relative pt-32">{children}</div>
              <Footer />
            </CartProvider>
          </ToastProvider>
        </ThemeLanguageProvider>
      </body>
    </html>
  );
}
