"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OutfitCard } from "@/components/outfits/outfit-card"
import { OutfitDetailsModal } from "@/components/outfits/outfit-details-modal"

export function SavedOutfits() {
  const [activeTab, setActiveTab] = useState("all")
  const [selectedOutfit, setSelectedOutfit] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  // Mock saved outfits data - in a real app, this would come from your database
  const savedOutfits = [
    {
      id: 1,
      name: "Casual Weekend Look",
      occasion: "casual",
      style: "minimalist",
      season: "summer",
      items: [
        {
          id: 1,
          name: "White Cotton T-Shirt",
          category: "Tops",
          image: "/placeholder.svg?height=300&width=300&text=White+T-Shirt",
        },
        {
          id: 2,
          name: "Blue Denim Jeans",
          category: "Bottoms",
          image: "/placeholder.svg?height=300&width=300&text=Blue+Jeans",
        },
        {
          id: 5,
          name: "White Sneakers",
          category: "Shoes",
          image: "/placeholder.svg?height=300&width=300&text=White+Sneakers",
        },
      ],
      weather: "Suitable for 70-85°F / Sunny or mild weather",
      description: "A comfortable outfit for everyday wear. This timeless combination never goes out of style.",
    },
    {
      id: 2,
      name: "Business Casual Outfit",
      occasion: "work",
      style: "classic",
      season: "fall",
      items: [
        {
          id: 7,
          name: "Red Knit Sweater",
          category: "Tops",
          image: "/placeholder.svg?height=300&width=300&text=Red+Sweater",
        },
        {
          id: 2,
          name: "Blue Denim Jeans",
          category: "Bottoms",
          image: "/placeholder.svg?height=300&width=300&text=Blue+Jeans",
        },
        {
          id: 6,
          name: "Black Formal Blazer",
          category: "Outerwear",
          image: "/placeholder.svg?height=300&width=300&text=Black+Blazer",
        },
        {
          id: 5,
          name: "White Sneakers",
          category: "Shoes",
          image: "/placeholder.svg?height=300&width=300&text=White+Sneakers",
        },
      ],
      weather: "Suitable for 55-65°F / Cool weather",
      description: "A polished look for your workday. A balanced mix of classic pieces with modern elements.",
    },
    {
      id: 3,
      name: "Summer Party Outfit",
      occasion: "party",
      style: "trendy",
      season: "summer",
      items: [
        {
          id: 4,
          name: "Floral Summer Dress",
          category: "Dresses",
          image: "/placeholder.svg?height=300&width=300&text=Floral+Dress",
        },
        {
          id: 5,
          name: "White Sneakers",
          category: "Shoes",
          image: "/placeholder.svg?height=300&width=300&text=White+Sneakers",
        },
      ],
      weather: "Suitable for 75-90°F / Warm weather",
      description:
        "Stylish outfit for a memorable evening out. Incorporating current fashion trends for a contemporary look.",
    },
  ]

  const handleOutfitClick = (outfit: any) => {
    setSelectedOutfit(outfit)
    setShowDetailsModal(true)
  }

  const filteredOutfits =
    activeTab === "all" ? savedOutfits : savedOutfits.filter((outfit) => outfit.occasion === activeTab)

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="casual">Casual</TabsTrigger>
          <TabsTrigger value="work">Work</TabsTrigger>
          <TabsTrigger value="party">Party</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {filteredOutfits.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredOutfits.map((outfit) => (
                <div key={outfit.id} onClick={() => handleOutfitClick(outfit)} className="cursor-pointer">
                  <OutfitCard outfit={outfit} />
                </div>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-center text-gray-500">No saved outfits in this category yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <OutfitDetailsModal outfit={selectedOutfit} open={showDetailsModal} onOpenChange={setShowDetailsModal} />
    </div>
  )
}
