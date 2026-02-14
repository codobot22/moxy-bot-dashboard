import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Moxy Bot - Book Arbitrage",
  description: "Track profitable book deals on Vinted and sell to Momox",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
          {children}
        </div>
      </body>
    </html>
  )
}
