import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { CookieConsentProvider } from "@/components/providers/cookie-consent-provider"
import { CookieConsentManager } from "@/components/cookie-consent-manager"
import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "StyleAI - AI-Powered Personal Stylist",
  description: "Your AI-powered personal stylist and wardrobe companion",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="bg-background">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <CookieConsentProvider>
          <ThemeProvider attribute="class" defaultTheme="light">
            {children}
            <CookieConsentManager />
          </ThemeProvider>
        </CookieConsentProvider>
      </body>
    </html>
  )
}
