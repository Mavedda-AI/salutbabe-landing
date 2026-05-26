import Header from '@/components/Header';
import TopToastNotification from '@/components/TopToastNotification';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopToastNotification />
      <Header />
      <main>{children}</main>
    </>
  );
}
