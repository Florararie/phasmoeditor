import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/700.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'

export const metadata = {
  title: 'phasmoeditor',
  description: 'Easily edit Phasmophobia save files',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-body bg-void text-paper antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
