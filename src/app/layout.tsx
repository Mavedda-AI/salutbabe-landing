import type {Metadata} from 'next'
import {ThemeLanguageProvider} from '@/context/ThemeLanguageContext';
import {ToastProvider} from '@/context/ToastContext';
import {CartProvider} from '@/context/CartContext';
import './globals.css'

export const metadata: Metadata = {
  title: 'Salutbabe | Premium Vinted Style',
  description: 'Anneden Anneye',
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
