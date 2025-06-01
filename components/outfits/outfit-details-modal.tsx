"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Star, Sparkles, Zap, Brain, ShoppingBag } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { saveOutfit, removeSavedOutfit, isOutfitSaved } from "@/utils/saved-outfits"
import { useToast } from "@/components/providers/toast-provider"
import { SimilarProductsModal } from "@/components/outfits/similar-products-modal"

interface OutfitItem {
  id: number
  name: string
  category: string
  image: string
}

interface Outfit {
  id: number
  name: string
  occasion: string
  style: string
  season: string
  items: OutfitItem[]
  weather: string
  description: string
  score?: number
  isAIGenerated?: boolean
  isGrokGenerated?: boolean
  isOpenAIGenerated?: boolean
  generatedByModel?: string
}

interface OutfitDetailsModalProps {
  outfit: Outfit | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaveToggle?: (outfitId: number, isSaved: boolean) => void
  userWardrobe?: OutfitItem[] // User's existing wardrobe items
}

export function OutfitDetailsModal({
  outfit,
  open,
  onOpenChange,
  onSaveToggle,
  userWardrobe = [], // Default to empty array if not provided
}: OutfitDetailsModalProps) {
  const [saved, setSaved] = useState(false)
  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null)
  const [activeTab, setActiveTab] = useState("items")
  const { toast } = useToast()
  const [selectedItem, setSelectedItem] = useState<OutfitItem | null>(null)
  const [showSimilarModal, setShowSimilarModal] = useState(false)

  // Check if outfit is saved whenever the outfit changes
  useEffect(() => {
    if (outfit) {
      setSaved(isOutfitSaved(outfit.id))
    }
  }, [outfit])

  if (!outfit) return null

  // Function to check if an item is in the user's wardrobe
  const isItemInWardrobe = (item: OutfitItem) => {
    return userWardrobe.some(
      (wardrobeItem) => wardrobeItem.id === item.id || wardrobeItem.name.toLowerCase() === item.name.toLowerCase(),
    )
  }

  const toggleSave = () => {
    const newSavedState = !saved
    setSaved(newSavedState)

    if (newSavedState) {
      // Save the outfit
      saveOutfit({
        ...outfit,
        savedAt: Date.now(),
      })

      toast({
        title: "Outfit saved",
        description: "This outfit has been added to your saved collection",
      })
    } else {
      // Remove the outfit
      removeSavedOutfit(outfit.id)

      toast({
        title: "Outfit removed",
        description: "This outfit has been removed from your saved collection",
      })
    }

    // Notify parent component if callback provided
    if (onSaveToggle) {
      onSaveToggle(outfit.id, newSavedState)
    }
  }

  const giveFeedback = (type: "like" | "dislike") => {
    setFeedback(type === feedback ? null : type)
  }

  const handleBuySimilar = (item: OutfitItem) => {
    setSelectedItem(item)
    setShowSimilarModal(true)
  }

  // Get occasion emoji
  const getOccasionEmoji = (occasion: string) => {
    const emojis: Record<string, string> = {
      casual: "👕",
      work: "💼",
      formal: "👔",
      date: "❤️",
      party: "🎉",
      sport: "🏃‍♂️",
    }
    return emojis[occasion.toLowerCase()] || "👕"
  }

  // Get season emoji
  const getSeasonEmoji = (season: string) => {
    const emojis: Record<string, string> = {
      spring: "🌸",
      summer: "☀️",
      fall: "🍂",
      autumn: "🍂",
      winter: "❄️",
    }
    return emojis[season.toLowerCase()] || "📅"
  }

  // Get the appropriate icon based on generation type
  const getGenerationIcon = () => {
    if (outfit.isOpenAIGenerated) {
      return <Brain className="h-4 w-4 mr-1 text-green-500" aria-hidden="true" />
    } else if (outfit.isGrokGenerated) {
      return <Zap className="h-4 w-4 mr-1 text-blue-500" aria-hidden="true" />
    } else {
      return <Sparkles className="h-4 w-4 mr-1 text-pink-500" aria-hidden="true" />
    }
  }

  // Get the generation type name
  const getGenerationName = () => {
    if (outfit.isOpenAIGenerated) {
      return "OpenAI Styling Notes"
    } else if (outfit.isGrokGenerated) {
      return "Grok Styling Notes"
    } else {
      return "AI Styling Notes"
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden" aria-labelledby="outfit-details-title">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle id="outfit-details-title" className="flex items-center justify-between">
              <div className="flex items-center">
                <span>{outfit.name}</span>
                {outfit.score && outfit.score > 2 && (
                  <Badge className="ml-2 bg-yellow-400 text-yellow-900">
                    <Star className="h-3 w-3 mr-1 fill-current" aria-hidden="true" />
                    <span>Top Match</span>
                  </Badge>
                )}
                {outfit.isOpenAIGenerated && (
                  <Badge className="ml-2 bg-green-100 text-green-800">
                    <Brain className="h-3 w-3 mr-1" aria-hidden="true" />
                    <span>OpenAI</span>
                  </Badge>
                )}
                {outfit.isGrokGenerated && (
                  <Badge className="ml-2 bg-blue-100 text-blue-800">
                    <Zap className="h-3 w-3 mr-1" aria-hidden="true" />
                    <span>Grok</span>
                  </Badge>
                )}
                {outfit.isAIGenerated && !outfit.isGrokGenerated && !outfit.isOpenAIGenerated && (
                  <Badge className="ml-2 bg-purple-100 text-purple-800">
                    <Sparkles className="h-3 w-3 mr-1" aria-hidden="true" />
                    <span>AI</span>
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className={cn("rounded-full", saved && "text-pink-500 hover:text-pink-600")}
                onClick={toggleSave}
                aria-pressed={saved}
                aria-label={saved ? "Remove from saved outfits" : "Save outfit"}
              >
                <Heart className={cn("h-5 w-5", saved && "fill-current")} aria-hidden="true" />
              </Button>
            </DialogTitle>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline" className="bg-white flex items-center">
                <span aria-hidden="true">{getOccasionEmoji(outfit.occasion)}</span>
                <span className="ml-1">{outfit.occasion.charAt(0).toUpperCase() + outfit.occasion.slice(1)}</span>
              </Badge>
              <Badge variant="outline" className="bg-white">
                {outfit.style.charAt(0).toUpperCase() + outfit.style.slice(1)}
              </Badge>
              <Badge variant="outline" className="bg-white flex items-center">
                <span aria-hidden="true">{getSeasonEmoji(outfit.season)}</span>
                <span className="ml-1">{outfit.season.charAt(0).toUpperCase() + outfit.season.slice(1)}</span>
              </Badge>
            </div>
          </DialogHeader>

          <Tabs defaultValue="items" value={activeTab} onValueChange={setActiveTab} className="px-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="items">Outfit Items</TabsTrigger>
              <TabsTrigger value="details">Details & Styling</TabsTrigger>
            </TabsList>

            <TabsContent value="items" className="pt-4 pb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4" role="list" aria-label="Outfit items">
                {outfit.items.map((item) => (
                  <div key={item.id} className="space-y-2" role="listitem">
                    <div className="aspect-square bg-gray-100 rounded-md overflow-hidden relative group">
                      {item.image ? (
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={`${item.name} - ${item.category}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // If image fails to load, replace with a reliable placeholder
                            e.currentTarget.src = `https://placehold.co/300x300/f5f5f5/666666?text=${encodeURIComponent(
                              item.name?.substring(0, 10) || "Item",
                            )}`
                          }}
                        />
                      ) : (
                        // Direct fallback if no image is provided
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 text-xs text-center p-2">
                          {item.name || "Item"}
                        </div>
                      )}

                      {/* Add "Buy Similar" button if item is not in wardrobe */}
                      {!isItemInWardrobe(item) && (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="absolute bottom-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-pink-500 hover:bg-pink-50 border border-pink-200 text-xs py-1 h-7"
                          onClick={() => handleBuySimilar(item)}
                          aria-label={`Buy similar to ${item.name}`}
                        >
                          <ShoppingBag className="h-3 w-3 mr-1" aria-hidden="true" />
                          Buy Similar
                        </Button>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.category}</p>
                      {!isItemInWardrobe(item) && (
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 h-auto text-pink-500 text-xs"
                          onClick={() => handleBuySimilar(item)}
                          aria-label={`Buy similar to ${item.name}`}
                        >
                          <ShoppingBag className="h-3 w-3 mr-1" aria-hidden="true" />
                          Buy Similar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="details" className="pt-4 pb-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-1 flex items-center">
                  {getGenerationIcon()}
                  {getGenerationName()}
                </h3>
                <p className="text-sm">{outfit.description}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-1">Weather Suitability</h3>
                <p className="text-sm text-gray-500">{outfit.weather}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-1">Occasion</h3>
                <p className="text-sm">
                  This outfit is perfect for {outfit.occasion} occasions in {outfit.season}.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Similar Products Modal */}
      {selectedItem && (
        <SimilarProductsModal
          open={showSimilarModal}
          onOpenChange={setShowSimilarModal}
          itemName={selectedItem.name}
          itemCategory={selectedItem.category}
        />
      )}
    </>
  )
}
