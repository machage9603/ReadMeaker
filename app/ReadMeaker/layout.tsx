import '@/app/ui/global.css'
import { ReadmeProvider } from './ReadmeContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ReadmeProvider>
          {children}
        </ReadmeProvider>
      </body>
    </html>
  )
}