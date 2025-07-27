import type { Metadata } from 'next'
import { Inter, Work_Sans } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { SkipNav } from '@/components/ui/skip-nav'

const inter = Inter({ subsets: ['latin'] })
const workSans = Work_Sans({ 
  subsets: ['latin'],
  weight: ['800'], // Extra bold
  variable: '--font-work-sans'
})

export const metadata: Metadata = {
  title: 'AskInBio - Your Modern Link in Bio',
  description: 'A modern Linktree alternative with great UX and analytics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${workSans.variable}`}>
        <SkipNav />
        <main id="main-content">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  )
}