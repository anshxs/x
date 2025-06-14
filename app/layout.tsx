import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

import { AuthProvider } from '@/context/AuthProvider'
import AuthGate from '@/components/AuthGate' // ✅ Import Client Component
import { Toaster } from 'sonner'
import AppBar from '@/components/AppBar'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <AppBar/>
          <AuthGate>{children}</AuthGate>
          <Toaster richColors position="top-center" />
        </AuthProvider>
      </body>
    </html>
  )
}
