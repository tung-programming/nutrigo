import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import ChatbotWidget from "@/components/ChatbotWidget"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NutriGo - Decode Your Food, Redefine Your Health",
  description:
    "Smart food scanner that reveals sugar, calories, and hidden ingredients. Make informed nutrition choices with NutriGo.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <ChatbotWidget />
        <Analytics />
      </body>
    </html>
  )
}
