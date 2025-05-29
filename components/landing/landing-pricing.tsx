"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Check } from "lucide-react"
import { LoginModal } from "@/components/login-modal"

export function LandingPricing() {
  const [annual, setAnnual] = useState(true)
  const [showLoginModal, setShowLoginModal] = useState(false)

  const toggleBilling = () => {
    setAnnual(!annual)
  }

  const plans = [
    {
      name: "Free",
      description: "Basic features for personal use",
      price: {
        monthly: "$0",
        annually: "$0",
      },
      features: ["Basic wardrobe organization", "Limited outfit suggestions", "Basic style profile", "Mobile access"],
      cta: "Get Started",
      highlighted: false,
    },
    {
      name: "Premium",
      description: "Everything you need for your personal style",
      price: {
        monthly: "$9.99",
        annually: "$7.99",
      },
      features: [
        "Unlimited wardrobe items",
        "Advanced outfit suggestions",
        "Weather-based styling",
        "Style preference profile",
        "Outfit history tracking",
        "Priority support",
      ],
      cta: "Start Free Trial",
      highlighted: true,
    },
    {
      name: "Family",
      description: "Style management for the whole family",
      price: {
        monthly: "$19.99",
        annually: "$16.99",
      },
      features: [
        "All Premium features",
        "Up to 5 user profiles",
        "Shared wardrobe items",
        "Family outfit coordination",
        "Advanced analytics",
        "24/7 priority support",
      ],
      cta: "Start Free Trial",
      highlighted: false,
    },
  ]

  return (
    <div id="pricing" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-pink-500 font-semibold tracking-wide uppercase">Pricing</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Plans for every style need
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Choose the perfect plan for your style journey.
          </p>
        </div>

        <div className="mt-12 flex justify-center">
          <div className="relative flex items-center">
            <span className={`text-sm ${annual ? "text-gray-500" : "text-gray-900 font-medium"}`}>Monthly</span>
            <Switch
              id="billing-toggle"
              checked={annual}
              onCheckedChange={toggleBilling}
              className="mx-4"
              aria-label="Toggle billing frequency"
            />
            <span className={`text-sm ${annual ? "text-gray-900 font-medium" : "text-gray-500"}`}>
              Annual <span className="text-pink-500 font-medium">(Save 20%)</span>
            </span>
          </div>
        </div>

        <div className="mt-12 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl shadow-lg overflow-hidden ${
                plan.highlighted ? "border-2 border-pink-400 lg:scale-105 z-10" : "border border-gray-200"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 inset-x-0 px-4 py-1 bg-gradient-to-r from-pink-400 to-purple-400 text-center text-white text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className={`px-6 py-8 bg-white ${plan.highlighted ? "pt-10" : ""}`}>
                <div>
                  <h3 className="text-2xl font-medium text-gray-900">{plan.name}</h3>
                  <p className="mt-2 text-gray-500">{plan.description}</p>
                </div>
                <div className="mt-6">
                  <p className="text-5xl font-extrabold text-gray-900">
                    {annual ? plan.price.annually : plan.price.monthly}
                  </p>
                  <p className="mt-1 text-gray-500">{annual ? "per month, billed annually" : "billed monthly"}</p>
                </div>
                <Button
                  onClick={() => setShowLoginModal(true)}
                  className={`mt-8 w-full ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500"
                      : ""
                  }`}
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </div>
              <div className="flex-1 px-6 pt-6 pb-8 bg-gray-50 space-y-4">
                <h4 className="text-sm font-medium text-gray-900 uppercase tracking-wide">What's included</h4>
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <p className="ml-3 text-sm text-gray-700">{feature}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </div>
  )
}
