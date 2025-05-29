"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LoginModal } from "@/components/login-modal"
import { ArrowRight, Menu, X } from "lucide-react"

export function LandingHero() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="relative bg-white overflow-hidden">
      {/* Navigation */}
      <div className="relative pt-6 pb-16 sm:pb-24">
        <nav className="relative max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6" aria-label="Global">
          <div className="flex items-center flex-1">
            <div className="flex items-center justify-between w-full md:w-auto">
              <Link href="/">
                <span className="sr-only">StyleAI</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  StyleAI
                </span>
              </Link>
              <div className="-mr-2 flex items-center md:hidden">
                <Button
                  variant="ghost"
                  onClick={() => setMobileMenuOpen(true)}
                  className="rounded-md p-2 inline-flex items-center justify-center"
                >
                  <span className="sr-only">Open main menu</span>
                  <Menu className="h-6 w-6" aria-hidden="true" />
                </Button>
              </div>
            </div>
            <div className="hidden md:block md:ml-10 md:space-x-10">
              <Link href="#features" className="font-medium text-gray-500 hover:text-gray-900">
                Features
              </Link>
              <Link href="#testimonials" className="font-medium text-gray-500 hover:text-gray-900">
                Testimonials
              </Link>
              <Link href="#pricing" className="font-medium text-gray-500 hover:text-gray-900">
                Pricing
              </Link>
              <Link href="wardrobe" className="font-medium text-gray-500 hover:text-gray-900">
                Wardrobe
              </Link>
            </div>
          </div>
          <div className="hidden md:block text-right">
            <Button
              className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500"
              onClick={() => setShowLoginModal(true)}
            >
              Sign In / Register
            </Button>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="absolute z-10 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
            <div className="rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
              <div className="px-5 pt-4 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                    StyleAI
                  </span>
                </div>
                <div className="-mr-2">
                  <Button
                    variant="ghost"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-md p-2 inline-flex items-center justify-center"
                  >
                    <span className="sr-only">Close main menu</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </Button>
                </div>
              </div>
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  href="#features"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </Link>
                <Link
                  href="#testimonials"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Testimonials
                </Link>
                <Link
                  href="#pricing"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Link
                  href="wardrobe"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Wardrobe
                </Link>
              </div>
              <div className="px-5 py-4">
                <Button
                  className="w-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500"
                  onClick={() => {
                    setShowLoginModal(true)
                    setMobileMenuOpen(false)
                  }}
                >
                  Sign In / Register
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Hero content */}
        <div className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24 sm:px-6">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Your AI-Powered</span>
              <span className="block bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
                Personal Stylist
              </span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Discover your perfect style, organize your wardrobe, and get personalized outfit recommendations with the
              power of AI.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow w-full sm:w-auto">
                <Button
                  className="w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-white bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 md:py-4 md:text-lg md:px-10"
                  onClick={() => setShowLoginModal(true)}
                >
                  Get started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 w-full sm:w-auto">
                <Link href="wardrobe" className="w-full block">
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-pink-500 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                  >
                    Try demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero image */}
      <div className="relative">
        <div className="absolute inset-0 flex flex-col" aria-hidden="true">
          <div className="flex-1" />
          <div className="flex-1 w-full bg-gradient-to-t from-pink-50 to-white" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <img
            className="relative rounded-lg shadow-lg"
            src="/placeholder.svg?height=600&width=1200&text=StyleAI+Dashboard"
            alt="App screenshot"
          />
        </div>
      </div>

      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </div>
  )
}
