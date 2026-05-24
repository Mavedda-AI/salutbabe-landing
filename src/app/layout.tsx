import type {Metadata} from 'next'
import './globals.css'
import Header from '@/components/Header'

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
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}
