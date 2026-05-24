import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

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
    <html lang="tr" className={inter.className}>
      <body>
        {children}
      </body>
    </html>
  )
}
