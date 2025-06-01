"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useCookieConsent } from "@/components/providers/cookie-consent-provider"
import Link from "next/link"

export function CookieSettingsModal() {
  const { cookieConsent, showCookieSettings, setShowCookieSettings, acceptSelectedCookies } = useCookieConsent()

  const [settings, setSettings] = useState({
    essential: true,
    functional: cookieConsent.functional,
    analytics: cookieConsent.analytics,
    marketing: cookieConsent.marketing,
  })

  // Update local state when cookieConsent changes
  useEffect(() => {
    setSettings({
      essential: true,
      functional: cookieConsent.functional,
      analytics: cookieConsent.analytics,
      marketing: cookieConsent.marketing,
    })
  }, [cookieConsent])

  const handleSave = () => {
    acceptSelectedCookies(settings)
  }

  if (!showCookieSettings) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Cookie Settings</h2>
          <Button variant="ghost" size="icon" onClick={() => setShowCookieSettings(false)} aria-label="Close">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 space-y-6">
          <p className="text-sm text-gray-600">
            We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our
            traffic. You can choose which categories of cookies you want to allow. Read our{" "}
            <Link href="/cookie-policy" className="text-blue-600 hover:underline">
              Cookie Policy
            </Link>{" "}
            for more information.
          </p>

          <div className="space-y-4">
            {/* Essential Cookies */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Essential Cookies</h3>
                <p className="text-sm text-gray-600 mt-1">
                  These cookies are necessary for the website to function and cannot be switched off.
                </p>
              </div>
              <Switch checked={settings.essential} disabled={true} aria-readonly="true" />
            </div>

            {/* Functional Cookies */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Functional Cookies</h3>
                <p className="text-sm text-gray-600 mt-1">
                  These cookies enable personalized features and functionality.
                </p>
              </div>
              <Switch
                checked={settings.functional}
                onCheckedChange={(checked) => setSettings({ ...settings, functional: checked })}
                aria-label="Allow functional cookies"
              />
            </div>

            {/* Analytics Cookies */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Analytics Cookies</h3>
                <p className="text-sm text-gray-600 mt-1">
                  These cookies help us understand how visitors interact with our website.
                </p>
              </div>
              <Switch
                checked={settings.analytics}
                onCheckedChange={(checked) => setSettings({ ...settings, analytics: checked })}
                aria-label="Allow analytics cookies"
              />
            </div>

            {/* Marketing Cookies */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Marketing Cookies</h3>
                <p className="text-sm text-gray-600 mt-1">
                  These cookies are used to track visitors across websites to display relevant advertisements.
                </p>
              </div>
              <Switch
                checked={settings.marketing}
                onCheckedChange={(checked) => setSettings({ ...settings, marketing: checked })}
                aria-label="Allow marketing cookies"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t">
          <Button variant="outline" onClick={() => setShowCookieSettings(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Preferences</Button>
        </div>
      </div>
    </div>
  )
}
