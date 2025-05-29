"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Share } from "lucide-react"
import { useToast } from "@/components/providers/toast-provider"
import { ShareItemModal } from "@/components/wardrobe/share-item-modal"

export default function SharedItemPage() {
  const [item, setItem] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const shared = searchParams.get("shared")
    if (shared) {
      try {
        const decodedItem = JSON.parse(atob(shared))
        setItem(decodedItem)
      } catch (error) {
        console.error("Error parsing shared item:", error)
        setError("Invalid shared item data")
      }
    } else {
      setError("No shared item found")
    }
    setLoading(false)
  }, [searchParams])

  const addToWardrobe = () => {
    // Get existing items from local storage
    const storedItems = localStorage.getItem("wardrobeItems")
    let wardrobeItems = []

    if (storedItems) {
      try {
        wardrobeItems = JSON.parse(storedItems)
      } catch (e) {
        console.error("Error parsing stored wardrobe items:", e)
      }
    }

    // Add the new item with a unique ID
    const newItem = {
      ...item,
      id: Date.now(),
      dateAdded: new Date().toISOString(),
    }

    wardrobeItems.push(newItem)
    localStorage.setItem("wardrobeItems", JSON.stringify(wardrobeItems))

    toast({
      title: "Item added to wardrobe",
      description: `${item.name} has been added to your wardrobe`,
    })

    // Navigate to the wardrobe page
    router.push("/wardrobe")
  }

  const goBack = () => {
    router.back()
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-lg">Loading shared item...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
          <div className="text-lg text-red-500">{error}</div>
          <Button onClick={goBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="outline" onClick={goBack} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={item.image || "/placeholder.svg"}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = `/placeholder.svg?height=500&width=500&text=${encodeURIComponent(item.name)}`
            }}
          />
        </div>

        <Card>
          <CardContent className="pt-6">
            <h1 className="text-2xl font-bold mb-2">{item.name}</h1>
            <div className="flex items-center text-gray-500 mb-4">
              <span>{item.category}</span>
              <span className="mx-2">•</span>
              <span>{item.subcategory}</span>
            </div>

            <div className="space-y-4">
              {item.colors && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Colors</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.colors.map((color: string) => (
                      <Badge key={color} variant="outline">
                        {color}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {item.seasons && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Seasons</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.seasons.map((season: string) => (
                      <Badge key={season} variant="outline">
                        {season}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {item.occasions && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Occasions</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.occasions.map((occasion: string) => (
                      <Badge key={occasion} variant="outline">
                        {occasion}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {item.notes && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Notes</h3>
                  <p className="text-gray-600">{item.notes}</p>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-4 pt-0">
            <Button
              onClick={addToWardrobe}
              className="w-full sm:w-auto bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add to My Wardrobe
            </Button>

            <Button variant="outline" onClick={() => setShowShareModal(true)} className="w-full sm:w-auto">
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
          </CardFooter>
        </Card>
      </div>

      <ShareItemModal open={showShareModal} onOpenChange={setShowShareModal} item={item} />
    </div>
  )
}
