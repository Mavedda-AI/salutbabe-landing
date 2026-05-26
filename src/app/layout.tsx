import type {Metadata} from 'next'
import {ThemeLanguageProvider} from '@/context/ThemeLanguageContext';
import {ToastProvider} from '@/context/ToastContext';
import {CartProvider} from '@/context/CartContext';
import './globals.css'

export const metadata: Metadata = {
  title: 'Salutbabe | Premium Vinted Style',
  description: 'Anneden Anneye Güvenli Alışveriş – Safe Mother-to-Mother Shopping for Baby & Kids Clothing',
  keywords: ['salutbabe', 'ikinci el bebek kıyafeti', 'anne alışveriş', 'second hand baby clothes', 'kids fashion', 'sustainable fashion', 'vinted', 'bebek giyim'],
  icons: {
    icon: '/logo-favicon.png',
    apple: '/logo-favicon.png',
  },
  openGraph: {
    title: 'Salutbabe | Premium Vinted Style',
    description: 'Anneden Anneye Güvenli Alışveriş – Safe Mother-to-Mother Shopping for Baby & Kids Clothing',
    url: 'https://salutbabe.com',
    siteName: 'Salutbabe',
    locale: 'tr_TR',
    type: 'website',
    images: [
      {
        url: '/logo-icon.png',
        width: 512,
        height: 512,
        alt: 'Salutbabe Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Salutbabe | Premium Vinted Style',
    description: 'Anneden Anneye Güvenli Alışveriş – Safe Mother-to-Mother Shopping',
    images: ['/logo-icon.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body>
        <ThemeLanguageProvider>
          <ToastProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </ToastProvider>
        </ThemeLanguageProvider>
      </body>
    </html>
  )
}
