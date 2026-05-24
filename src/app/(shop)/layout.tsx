import BottomBar from '@/components/BottomBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopToastNotification from '@/components/TopToastNotification';

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
