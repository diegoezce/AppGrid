import type { Metadata } from 'next'
import { LanguageProvider } from '@/app/i18n/context'
import './globals.css'

export const metadata: Metadata = {
  title: 'AppGrid — Turn your apps into income',
  description: 'Marketplace for developers. Publish SaaS, scripts and automations.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
