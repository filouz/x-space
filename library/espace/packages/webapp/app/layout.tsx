
import { Providers } from '@/lib/providers'
import { Inter } from 'next/font/google'
import './styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout(props: React.PropsWithChildren) {
  return (
    <Providers>
      <html lang="en">
        <title>E-Space</title>
        <body className={inter.className}>
          {props.children}
        </body>
      </html>
    </Providers>
  )
}
