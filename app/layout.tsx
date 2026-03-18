import FloatingHeader from "../components/FloatingHeader";
import Footer from "../components/Footer";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <FloatingHeader />
        <div className="relative">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
