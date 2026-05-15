import LayoutWrapper from "../components/LayoutWrapper";
import "./globals.css";
import {CartProvider} from "../context/CartContext";
import {ThemeLanguageProvider} from "../context/ThemeLanguageContext";
import {ToastProvider} from "../context/ToastContext";
import CartToast from "../components/CartToast";

export const metadata = {
  title: {
    template: "salutbabe | %s",
    default: "salutbabe | Anneden Anneye",
  },
  description: "SalutBabe - Eco-friendly and stylish baby clothes",
  icons: {
    icon: "/logo-favicon.png",
    shortcut: "/logo-favicon.png",
    apple: "/logo-favicon.png",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f9fafb' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
  ],
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
              <LayoutWrapper>{children}</LayoutWrapper>
            </CartProvider>
          </ToastProvider>
        </ThemeLanguageProvider>
      </body>
    </html>
  );
}
