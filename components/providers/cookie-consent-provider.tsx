"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type CookieCategory = "essential" | "functional" | "analytics" | "marketing"

interface CookieConsent {
  essential: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
  consentGiven: boolean
}

interface CookieConsentContextType {
  cookieConsent: CookieConsent
  showBanner: boolean
  setShowBanner: (show: boolean) => void
  acceptAllCookies: () => void
  acceptSelectedCookies: (selected: Partial<CookieConsent>) => void
  rejectAllCookies: () => void
  openCookieSettings: () => void
  showCookieSettings: boolean
  setShowCookieSettings: (show: boolean) => void
  hasConsented: (category: CookieCategory) => boolean
}

const defaultConsent: CookieConsent = {
  essential: true, // Essential cookies are always required
  functional: false,
  analytics: false,
  marketing: false,
  consentGiven: false,
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined)

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [cookieConsent, setCookieConsent] = useState<CookieConsent>(defaultConsent)
  const [showBanner, setShowBanner] = useState(false)
  const [showCookieSettings, setShowCookieSettings] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load consent from localStorage on mount
  useEffect(() => {
    const storedConsent = localStorage.getItem("cookieConsent")

    if (storedConsent) {
      setCookieConsent(JSON.parse(storedConsent))
      setShowBanner(false)
    } else {
      setShowBanner(true)
    }

    setIsInitialized(true)
  }, [])

  // Save consent to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized && cookieConsent.consentGiven) {
      localStorage.setItem("cookieConsent", JSON.stringify(cookieConsent))
    }
  }, [cookieConsent, isInitialized])

  const acceptAllCookies = () => {
    const newConsent = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
      consentGiven: true,
    }
    setCookieConsent(newConsent)
    setShowBanner(false)
    setShowCookieSettings(false)
  }

  const acceptSelectedCookies = (selected: Partial<CookieConsent>) => {
    const newConsent = {
      ...cookieConsent,
      ...selected,
      essential: true, // Essential cookies are always required
      consentGiven: true,
    }
    setCookieConsent(newConsent)
    setShowBanner(false)
    setShowCookieSettings(false)
  }

  const rejectAllCookies = () => {
    const newConsent = {
      essential: true, // Essential cookies are always required
      functional: false,
      analytics: false,
      marketing: false,
      consentGiven: true,
    }
    setCookieConsent(newConsent)
    setShowBanner(false)
    setShowCookieSettings(false)
  }

  const openCookieSettings = () => {
    setShowCookieSettings(true)
  }

  const hasConsented = (category: CookieCategory) => {
    return cookieConsent[category]
  }

  return (
    <CookieConsentContext.Provider
      value={{
        cookieConsent,
        showBanner,
        setShowBanner,
        acceptAllCookies,
        acceptSelectedCookies,
        rejectAllCookies,
        openCookieSettings,
        showCookieSettings,
        setShowCookieSettings,
        hasConsented,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  )
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext)
  if (context === undefined) {
    throw new Error("useCookieConsent must be used within a CookieConsentProvider")
  }
  return context
}
