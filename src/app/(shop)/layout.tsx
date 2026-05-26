import Header from '@/components/Header';
import TopToastNotification from '@/components/TopToastNotification';
import Footer from '@/components/Footer';
import BottomBar from '@/components/BottomBar';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopToastNotification />
      <Header />
      <main>{children}</main>
      <Footer />
      <BottomBar />
    </>
  );
}
