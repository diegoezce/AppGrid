import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AppGrid — Convertí tus apps en ingresos',
  description: 'Marketplace para desarrolladores. Publica SaaS, scripts y automatizaciones.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
