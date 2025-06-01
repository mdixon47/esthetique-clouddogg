"use client"

import { useState } from "react"
import { Shirt, Camera, FolderHeart, Palette, Cloud, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Image from 'next/image'

const features = [
  {
    title: "AI Outfit Suggestions",
    description: "Get personalized outfit recommendations based on occasion, weather, and current trends.",
    icon: Shirt,
    color: "from-pink-400 to-pink-300",
    hoverColor: "group-hover:from-pink-500 group-hover:to-pink-400",
  },
  {
    title: "Virtual Try-On",
    description: "See how clothes look on you before buying with our virtual fitting room.",
    icon: Camera,
    color: "from-purple-400 to-purple-300",
    hoverColor: "group-hover:from-purple-500 group-hover:to-purple-400",
  },
  {
    title: "Wardrobe Organizer",
    description: "AI-powered categorization of your clothing items from photos.",
    icon: FolderHeart,
    color: "from-blue-400 to-blue-300",
    hoverColor: "group-hover:from-blue-500 group-hover:to-blue-400",
  },
  {
    title: "Korean Color Analysis",
    description: "Discover your perfect color palette based on skin, hair, and eye tone.",
    icon: Palette,
    color: "from-yellow-400 to-yellow-300",
    hoverColor: "group-hover:from-yellow-500 group-hover:to-yellow-400",
  },
  {
    title: "Weather-Based Styling",
    description: "Get outfit recommendations that match the current weather forecast.",
    icon: Cloud,
    color: "from-green-400 to-green-300",
    hoverColor: "group-hover:from-green-500 group-hover:to-green-400",
  },
  {
    title: "Outfit Calendar & Packing",
    description: "Plan your outfits ahead of time and get packing lists for trips.",
    icon: Calendar,
    color: "from-red-400 to-red-300",
    hoverColor: "group-hover:from-red-500 group-hover:to-red-400",
  },
]

export function FeatureCards() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null)

  return (
    <section className="py-12">
      <div className="container px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Key Features</h2>
          <p className="mt-4 text-lg text-gray-500">Discover how our AI can transform your fashion experience</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className={cn(
                "group overflow-hidden transition-all duration-300 hover:shadow-lg",
                activeFeature === index ? "ring-2 ring-pink-400" : "",
              )}
              onClick={() => setActiveFeature(index === activeFeature ? null : index)}
            >
              <div
                className={cn(
                  "absolute inset-0 -z-10 opacity-10 bg-gradient-to-br transition-all duration-300",
                  feature.color,
                  feature.hoverColor,
                )}
              />
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className={cn("rounded-full p-2 bg-gradient-to-br", feature.color)}>
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <CardTitle className="mt-4">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
                <div
                  className={cn(
                    "mt-4 overflow-hidden transition-all duration-300",
                    activeFeature === index ? "max-h-96" : "max-h-0",
                  )}
                >
                  <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={`/placeholder.svg?height=200&width=400&text=${feature.title}`}
                      alt={feature.title}
                      width={400}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <p className="mt-4 text-sm text-gray-500">
                    Click to learn more about our {feature.title.toLowerCase()} feature and how it can help you elevate
                    your style.
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
