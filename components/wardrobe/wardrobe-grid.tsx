"use client"

import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import { ClothingCard } from "@/components/wardrobe/clothing-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/providers/toast-provider"
import { AnimatePresence } from "framer-motion"

// Sample data for the wardrobe
const sampleItems = [
  {
    id: 1,
    name: "White Cotton T-Shirt",
    category: "Tops",
    subcategory: "T-Shirt",
    colors: ["White"],
    seasons: ["Spring", "Summer"],
    occasions: ["Casual"],
    image: "/placeholder.svg?height=300&width=300&text=White+T-Shirt",
  },
  {
    id: 2,
    name: "Blue Denim Jeans",
    category: "Bottoms",
    subcategory: "Jeans",
    colors: ["Blue"],
    seasons: ["Spring", "Fall", "Winter"],
    occasions: ["Casual", "Work"],
    image: "/placeholder.svg?height=300&width=300&text=Blue+Jeans",
  },
  {
    id: 3,
    name: "Black Leather Jacket",
    category: "Outerwear",
    subcategory: "Jacket",
    colors: ["Black"],
    seasons: ["Fall", "Winter"],
    occasions: ["Casual"],
    image: "/placeholder.svg?height=300&width=300&text=Black+Jacket",
  },
  {
    id: 4,
    name: "Floral Summer Dress",
    category: "Dresses",
    subcategory: "Casual Dress",
    colors: ["Multicolor", "Pink", "Green"],
    seasons: ["Spring", "Summer"],
    occasions: ["Casual", "Party"],
    image: "/placeholder.svg?height=300&width=300&text=Floral+Dress",
  },
  {
    id: 5,
    name: "White Sneakers",
    category: "Shoes",
    subcategory: "Sneakers",
    colors: ["White"],
    seasons: ["Spring", "Summer", "Fall"],
    occasions: ["Casual", "Sport"],
    image: "/placeholder.svg?height=300&width=300&text=White+Sneakers",
  },
  {
    id: 6,
    name: "Black Formal Blazer",
    category: "Outerwear",
    subcategory: "Blazer",
    colors: ["Black"],
    seasons: ["Fall", "Winter", "Spring"],
    occasions: ["Formal", "Work"],
    image: "/placeholder.svg?height=300&width=300&text=Black+Blazer",
  },
  {
    id: 7,
    name: "Red Knit Sweater",
    category: "Tops",
    subcategory: "Sweater",
    colors: ["Red"],
    seasons: ["Fall", "Winter"],
    occasions: ["Casual", "Work"],
    image: "/placeholder.svg?height=300&width=300&text=Red+Sweater",
  },
  {
    id: 8,
    name: "Beige Trench Coat",
    category: "Outerwear",
    subcategory: "Coat",
    colors: ["Beige"],
    seasons: ["Fall", "Spring"],
    occasions: ["Casual", "Work"],
    image: "/placeholder.svg?height=300&width=300&text=Beige+Coat",
  },
]

interface WardrobeGridProps {
  searchQuery?: string
}

export const WardrobeGrid = forwardRef(({ searchQuery = "" }: WardrobeGridProps, ref) => {
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState("grid")
  const [items, setItems] = useState<any[]>([])
  const [filteredItems, setFilteredItems] = useState<any[]>([])
  const [activeFilters, setActiveFilters] = useState<{
    category?: string
    color?: string
    season?: string
    occasion?: string
  }>({})
  const [favoriteItems, setFavoriteItems] = useState<number[]>([])
  const { toast } = useToast()

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    addItem: (newItem: any) => {
      const updatedItems = [...items, newItem]
      setItems(updatedItems)
      saveItemsToLocalStorage(updatedItems)
    },
    getItems: () => items,
  }))

  // Initialize with sample items and check local storage on mount
  useEffect(() => {
    // Try to get items from local storage
    const storedItems = localStorage.getItem("wardrobeItems")
    const storedFavorites = localStorage.getItem("wardrobeFavorites")

    if (storedItems) {
      try {
        const parsedItems = JSON.parse(storedItems)
        setItems([...sampleItems, ...parsedItems])
      } catch (e) {
        console.error("Error parsing stored wardrobe items:", e)
        setItems(sampleItems)
      }
    } else {
      setItems(sampleItems)
    }

    if (storedFavorites) {
      try {
        setFavoriteItems(JSON.parse(storedFavorites))
      } catch (e) {
        console.error("Error parsing stored favorites:", e)
        setFavoriteItems([])
      }
    }
  }, [])

  // Update filtered items when items, filters, or search query change
  useEffect(() => {
    let result = [...items]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.subcategory.toLowerCase().includes(query) ||
          item.colors.some((color: string) => color.toLowerCase().includes(query)) ||
          item.seasons.some((season: string) => season.toLowerCase().includes(query)) ||
          item.occasions.some((occasion: string) => occasion.toLowerCase().includes(query)),
      )
    }

    // Apply category filter
    if (activeFilters.category) {
      result = result.filter((item) => item.category === activeFilters.category)
    }

    // Apply color filter
    if (activeFilters.color) {
      result = result.filter((item) => item.colors.includes(activeFilters.color))
    }

    // Apply season filter
    if (activeFilters.season) {
      result = result.filter((item) => item.seasons.includes(activeFilters.season))
    }

    // Apply occasion filter
    if (activeFilters.occasion) {
      result = result.filter((item) => item.occasions.includes(activeFilters.occasion))
    }

    // Apply sorting
    if (sortBy === "newest") {
      result.sort((a, b) => (b.id || 0) - (a.id || 0))
    } else if (sortBy === "oldest") {
      result.sort((a, b) => (a.id || 0) - (b.id || 0))
    } else if (sortBy === "a-z") {
      result.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === "z-a") {
      result.sort((a, b) => b.name.localeCompare(a.name))
    } else if (sortBy === "favorites") {
      result.sort((a, b) => {
        const aIsFavorite = favoriteItems.includes(a.id) ? 1 : 0
        const bIsFavorite = favoriteItems.includes(b.id) ? 1 : 0
        return bIsFavorite - aIsFavorite
      })
    }

    setFilteredItems(result)
  }, [items, activeFilters, sortBy, searchQuery, favoriteItems])

  // Save items to local storage
  const saveItemsToLocalStorage = (updatedItems: any[]) => {
    // Save to local storage (only the user-added items)
    const userItems = updatedItems.filter((item) => !sampleItems.some((sample) => sample.id === item.id))
    localStorage.setItem("wardrobeItems", JSON.stringify(userItems))
  }

  // Save favorites to local storage
  const saveFavoritesToLocalStorage = (updatedFavorites: number[]) => {
    localStorage.setItem("wardrobeFavorites", JSON.stringify(updatedFavorites))
  }

  // Add a new item to the wardrobe
  const addItem = (newItem: any) => {
    const updatedItems = [...items, newItem]
    setItems(updatedItems)
    saveItemsToLocalStorage(updatedItems)

    toast({
      title: "Item added",
      description: `${newItem.name} has been added to your wardrobe`,
    })
  }

  // Remove an item from the wardrobe
  const removeItem = (id: number) => {
    const updatedItems = items.filter((item) => item.id !== id)
    setItems(updatedItems)
    saveItemsToLocalStorage(updatedItems)

    // Also remove from favorites if it was favorited
    if (favoriteItems.includes(id)) {
      const updatedFavorites = favoriteItems.filter((itemId) => itemId !== id)
      setFavoriteItems(updatedFavorites)
      saveFavoritesToLocalStorage(updatedFavorites)
    }

    toast({
      title: "Item removed",
      description: "The item has been removed from your wardrobe",
    })
  }

  // Edit an item in the wardrobe
  const editItem = (updatedItem: any) => {
    const updatedItems = items.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    setItems(updatedItems)
    saveItemsToLocalStorage(updatedItems)

    toast({
      title: "Item updated",
      description: `${updatedItem.name} has been updated`,
    })
  }

  // Toggle favorite status
  const toggleFavorite = (id: number, isFavorite: boolean) => {
    let updatedFavorites

    if (isFavorite) {
      updatedFavorites = [...favoriteItems, id]
    } else {
      updatedFavorites = favoriteItems.filter((itemId) => itemId !== id)
    }

    setFavoriteItems(updatedFavorites)
    saveFavoritesToLocalStorage(updatedFavorites)

    toast({
      title: isFavorite ? "Added to favorites" : "Removed from favorites",
      description: isFavorite ? "Item has been added to your favorites" : "Item has been removed from your favorites",
    })
  }

  // Clear all filters
  const clearFilters = () => {
    setActiveFilters({})
  }

  // Get unique values for filter dropdowns
  const getUniqueValues = (key: "category" | "colors" | "seasons" | "occasions") => {
    const allValues = items.flatMap((item) => (Array.isArray(item[key]) ? item[key] : [item[key]]))
    return [...new Set(allValues)].filter(Boolean).sort()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium">{filteredItems.length}</span> items
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Label htmlFor="sort-by" className="text-sm whitespace-nowrap min-w-[60px]">
              Sort by:
            </Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger id="sort-by" className="w-full sm:w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="a-z">A-Z</SelectItem>
                <SelectItem value="z-a">Z-A</SelectItem>
                <SelectItem value="favorites">Favorites</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Label htmlFor="view-mode" className="text-sm whitespace-nowrap min-w-[60px]">
              View:
            </Label>
            <Select value={viewMode} onValueChange={setViewMode}>
              <SelectTrigger id="view-mode" className="w-full sm:w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Grid</SelectItem>
                <SelectItem value="list">List</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Quick filters */}
      <div className="flex flex-wrap gap-2">
        <Select
          value={activeFilters.category || ""}
          onValueChange={(value) =>
            setActiveFilters({ ...activeFilters, category: value === "all" ? undefined : value })
          }
        >
          <SelectTrigger className="h-9 w-[150px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {getUniqueValues("category").map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={activeFilters.color || ""}
          onValueChange={(value) => setActiveFilters({ ...activeFilters, color: value === "all" ? undefined : value })}
        >
          <SelectTrigger className="h-9 w-[150px]">
            <SelectValue placeholder="Color" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Colors</SelectItem>
            {getUniqueValues("colors").map((color) => (
              <SelectItem key={color} value={color}>
                {color}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={activeFilters.season || ""}
          onValueChange={(value) => setActiveFilters({ ...activeFilters, season: value === "all" ? undefined : value })}
        >
          <SelectTrigger className="h-9 w-[150px]">
            <SelectValue placeholder="Season" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Seasons</SelectItem>
            {getUniqueValues("seasons").map((season) => (
              <SelectItem key={season} value={season}>
                {season}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={activeFilters.occasion || ""}
          onValueChange={(value) =>
            setActiveFilters({ ...activeFilters, occasion: value === "all" ? undefined : value })
          }
        >
          <SelectTrigger className="h-9 w-[150px]">
            <SelectValue placeholder="Occasion" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Occasions</SelectItem>
            {getUniqueValues("occasions").map((occasion) => (
              <SelectItem key={occasion} value={occasion}>
                {occasion}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {Object.keys(activeFilters).length > 0 && (
          <Button variant="outline" size="sm" onClick={clearFilters} className="h-9">
            Clear Filters
          </Button>
        )}
      </div>

      {filteredItems.length > 0 ? (
        <div
          className={`grid gap-4 sm:gap-6 ${
            viewMode === "grid"
              ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1"
          }`}
        >
          <AnimatePresence>
            {filteredItems.map((item) => (
              <ClothingCard
                key={item.id}
                item={item}
                viewMode={viewMode as "grid" | "list"}
                onDelete={removeItem}
                onEdit={editItem}
                onFavorite={toggleFavorite}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-center text-gray-500 mb-4">No items found matching your filters.</p>
            <Button
              variant="outline"
              onClick={clearFilters}
              className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white"
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
})

WardrobeGrid.displayName = "WardrobeGrid"
