import { AntdRegistry } from '@ant-design/nextjs-registry'

import './globals.css'

export const metadata = {
  title: 'League Extenions 3 (3.0.2-20240601-FINAL)',
  description: 'League Extenions',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          {children}
        </AntdRegistry>
      </body>
    </html>
  )
}
