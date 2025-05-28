import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '10aTask',
  description: '10 Minutes is all it takes',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
