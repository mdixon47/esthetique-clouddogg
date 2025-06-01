"use client"
import { Button } from "@/components/ui/button"
import { useCookieConsent } from "@/components/providers/cookie-consent-provider"
import Link from "next/link"

export function CookieConsentBanner() {
  const { showBanner, acceptAllCookies, rejectAllCookies, openCookieSettings } = useCookieConsent()

  if (!showBanner) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg p-4 md:p-6"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 id="cookie-consent-title" className="text-lg font-semibold mb-2">
              We value your privacy
            </h3>
            <p id="cookie-consent-description" className="text-sm text-gray-600 mb-2">
              We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our
              traffic. By clicking "Accept All", you consent to our use of cookies. Read our{" "}
              <Link href="/cookie-policy" className="text-blue-600 hover:underline">
                Cookie Policy
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>{" "}
              to learn more.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
            <Button variant="outline" size="sm" onClick={rejectAllCookies} className="whitespace-nowrap">
              Essential Only
            </Button>
            <Button variant="outline" size="sm" onClick={openCookieSettings} className="whitespace-nowrap">
              Customize
            </Button>
            <Button size="sm" onClick={acceptAllCookies} className="whitespace-nowrap">
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
