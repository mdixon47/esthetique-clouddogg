"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ShoppingBag, Camera, Palette, Calendar, Menu, X, LogIn, Shirt, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LoginModal } from "@/components/login-modal"
import { cn } from "@/lib/utils"
import { CartIcon } from "@/components/cart-icon"
import { ThemeToggle } from "@/components/theme-toggle"

// Update the navItems array to include the profile page
const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "My Wardrobe", href: "/wardrobe", icon: ShoppingBag },
  { name: "Outfit Suggestions", href: "/outfit-suggestions", icon: Shirt },
  { name: "Virtual Try-On", href: "/try-on", icon: Camera },
  { name: "Color Analysis", href: "/color-analysis", icon: Palette },
  { name: "Outfit Planner", href: "/planner", icon: Calendar },
  { name: "Profile", href: "/profile", icon: User },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  // Handle Escape key to close sidebar
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen])

  return (
    <>
      <div className="fixed top-0 left-0 z-40 w-full bg-white/80 backdrop-blur-sm md:hidden">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              StyleAI
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <CartIcon />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
              aria-controls="mobile-nav"
            >
              {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </Button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-30 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
        id="mobile-nav"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex h-full flex-col bg-white shadow-lg md:w-64">
          <div className="hidden md:flex items-center p-6">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                StyleAI
              </span>
            </Link>
            <div className="ml-auto">
              <CartIcon />
            </div>
          </div>

          <div className="mt-16 md:mt-0 flex flex-col flex-1 overflow-y-auto">
            <nav className="flex-1 px-4 py-4">
              <h2 className="sr-only">Main Navigation</h2>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                        pathname === item.href
                          ? "bg-pink-100 text-pink-600"
                          : "text-gray-600 hover:bg-pink-50 hover:text-pink-600",
                      )}
                      onClick={() => setIsOpen(false)}
                      aria-current={pathname === item.href ? "page" : undefined}
                    >
                      <item.icon className="mr-3 h-5 w-5" aria-hidden="true" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="p-4 border-t">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">Theme</span>
                <ThemeToggle />
              </div>
              <Button
                className="w-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500"
                onClick={() => {
                  setShowLoginModal(true)
                  setIsOpen(false)
                }}
              >
                <LogIn className="mr-2 h-4 w-4" aria-hidden="true" />
                Sign In / Register
              </Button>
            </div>
          </div>
        </div>

        {/* Backdrop for mobile */}
        <div
          className={cn("fixed inset-0 z-[-1] bg-black/50 md:hidden", isOpen ? "block" : "hidden")}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      </div>

      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </>
  )
}
