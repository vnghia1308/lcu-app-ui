import { Inter } from 'next/font/google'

import StyledComponentsRegistry from './AntdRegistry'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'League Extenions 3 (20240501-TEST)',
  description: 'League Extenions',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
