"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Share, Sparkles, Zap, Brain, ShoppingBag } from "lucide-react"
import { SimilarProductsModal } from "@/components/outfits/similar-products-modal"

interface OutfitItem {
  id?: number
  name?: string
  category?: string
  subcategory?: string
  colors?: string[]
  seasons?: string[]
  occasions?: string[]
  image?: string
}

interface OutfitCardProps {
  outfit: {
    id?: number
    name?: string
    occasion?: string
    style?: string
    season?: string
    items?: OutfitItem[]
    weather?: string
    description?: string
    score?: number
    isAIGenerated?: boolean
    isGrokGenerated?: boolean
    isOpenAIGenerated?: boolean
  }
  isAIGenerated?: boolean
  isGrokGenerated?: boolean
  isOpenAIGenerated?: boolean
  userWardrobe?: OutfitItem[]
}

export function OutfitCard({
  outfit,
  isAIGenerated = false,
  isGrokGenerated = false,
  isOpenAIGenerated = false,
  userWardrobe = [],
}: OutfitCardProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [selectedItem, setSelectedItem] = useState<OutfitItem | null>(null)
  const [showSimilarModal, setShowSimilarModal] = useState(false)

  // Safe access to outfit properties with fallbacks
  const outfitName = outfit?.name || "Outfit"
  const outfitItems = outfit?.items || []
  const outfitDescription = outfit?.description || "A stylish outfit combination."
  const outfitOccasion = outfit?.occasion || "casual"
  const outfitSeason = outfit?.season || "all seasons"
  const outfitWeather = outfit?.weather || "various weather conditions"

  // Function to check if an item is in the user's wardrobe
  const isItemInWardrobe = (item: OutfitItem) => {
    if (!item || !item.name || !userWardrobe || !Array.isArray(userWardrobe)) return true

    return userWardrobe.some((wardrobeItem) => {
      if (!wardrobeItem || !wardrobeItem.name) return false
      return wardrobeItem.id === item.id || wardrobeItem.name.toLowerCase() === item.name.toLowerCase()
    })
  }

  // Handle showing the similar products modal
  const handleBuySimilar = (item: OutfitItem, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedItem(item)
    setShowSimilarModal(true)
  }

  // Get the appropriate AI badge based on the generation method
  const getAIBadge = () => {
    if (isOpenAIGenerated || outfit.isOpenAIGenerated) {
      return (
        <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200">
          <Brain className="h-3 w-3" aria-hidden="true" />
          <span>OpenAI</span>
        </Badge>
      )
    } else if (isGrokGenerated || outfit.isGrokGenerated) {
      return (
        <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200">
          <Zap className="h-3 w-3" aria-hidden="true" />
          <span>Grok</span>
        </Badge>
      )
    } else if (isAIGenerated || outfit.isAIGenerated) {
      return (
        <Badge variant="outline" className="flex items-center gap-1 bg-purple-50 text-purple-700 border-purple-200">
          <Sparkles className="h-3 w-3" aria-hidden="true" />
          <span>AI</span>
        </Badge>
      )
    }
    return null
  }

  return (
    <>
      <Card className="overflow-hidden h-full">
        <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg font-medium">{outfitName}</CardTitle>
          {getAIBadge()}
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="secondary">{outfitOccasion}</Badge>
            <Badge variant="secondary">{outfitSeason}</Badge>
            <Badge variant="secondary">{outfitWeather}</Badge>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4" role="list" aria-label="Outfit items">
            {outfitItems &&
              outfitItems.slice(0, 3).map((item, index) => (
                <div
                  key={item?.id || index}
                  className="relative group"
                  role="listitem"
                  aria-label={item?.name || `Item ${index + 1}`}
                >
                  <img
                    src={item?.image || `/placeholder.svg?height=300&width=300&text=Item`}
                    alt={item?.name || `Clothing item: ${item?.category || "Unknown category"}`}
                    className="aspect-square object-cover rounded-md"
                  />
                  {!isItemInWardrobe(item) && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                      onClick={(e) => handleBuySimilar(item, e)}
                      aria-label={`Buy similar to ${item?.name || "this item"}`}
                    >
                      <ShoppingBag className="h-3 w-3" aria-hidden="true" />
                    </Button>
                  )}
                </div>
              ))}
          </div>

          <p className="text-sm text-gray-600 mb-4">{outfitDescription}</p>

          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant={isSaved ? "default" : "outline"}
                className={isSaved ? "bg-pink-500 hover:bg-pink-600" : ""}
                onClick={(e) => {
                  e.stopPropagation()
                  setIsSaved(!isSaved)
                }}
                aria-pressed={isSaved}
                aria-label={isSaved ? "Remove from saved outfits" : "Save outfit"}
              >
                <Heart className={`h-4 w-4 mr-1 ${isSaved ? "fill-current" : ""}`} aria-hidden="true" />
                {isSaved ? "Saved" : "Save"}
              </Button>
              <Button size="sm" variant="outline" onClick={(e) => e.stopPropagation()} aria-label="Share this outfit">
                <Share className="h-4 w-4 mr-1" aria-hidden="true" />
                Share
              </Button>
            </div>
            <div>
              {outfitItems && outfitItems.some((item) => !isItemInWardrobe(item)) && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-green-600 border-green-200 hover:bg-green-50"
                  aria-label="Buy similar items for this outfit"
                >
                  <ShoppingBag className="h-4 w-4 mr-1" aria-hidden="true" />
                  Buy Similar
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Similar Products Modal */}
      {selectedItem && (
        <SimilarProductsModal
          open={showSimilarModal}
          onOpenChange={setShowSimilarModal}
          itemName={selectedItem.name || ""}
          itemCategory={selectedItem.category || ""}
          itemImage={selectedItem.image || ""}
        />
      )}
    </>
  )
}
