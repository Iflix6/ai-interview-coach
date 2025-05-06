import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Video Interviewer',
  description: 'Frontend Test',
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
