"use client"

import { Button } from "@/components/ui/button"
import { useCookieConsent } from "@/components/providers/cookie-consent-provider"

export function CookieSettingsButton() {
  const { openCookieSettings } = useCookieConsent()

  return (
    <Button variant="link" size="sm" onClick={openCookieSettings} className="text-gray-500 hover:text-gray-700">
      Cookie Settings
    </Button>
  )
}
