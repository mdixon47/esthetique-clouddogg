"use client"

import { CookieConsentBanner } from "@/components/cookie-consent-banner"
import { CookieSettingsModal } from "@/components/cookie-settings-modal"

export function CookieConsentManager() {
  return (
    <>
      <CookieConsentBanner />
      <CookieSettingsModal />
    </>
  )
}
