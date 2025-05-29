"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LoginModal } from "@/components/login-modal"

export function LandingCTA() {
  const [showLoginModal, setShowLoginModal] = useState(false)

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-pink-400 to-purple-500 rounded-3xl shadow-xl overflow-hidden">
          <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
            <div className="lg:self-center lg:max-w-3xl">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                <span className="block">Ready to transform your style?</span>
                <span className="block">Start your StyleAI journey today.</span>
              </h2>
              <p className="mt-4 text-lg leading-6 text-pink-50">
                Join thousands of fashion enthusiasts who have discovered their perfect style with StyleAI. Sign up now
                and get a 14-day free trial of our Premium plan.
              </p>
              <div className="mt-8 flex space-x-4">
                <Button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-white text-pink-500 hover:bg-pink-50 hover:text-pink-600"
                >
                  Sign In / Register
                </Button>
                <Button variant="outline" className="text-white border-white hover:bg-pink-400">
                  Learn more
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </div>
  )
}
