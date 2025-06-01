"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface ClothingItem {
  id: number
  name: string
  category: string
  subcategory: string
  colors: string[]
  seasons: string[]
  occasions: string[]
  image: string
  notes?: string
}

interface EditItemModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: ClothingItem | null
  onSave: (updatedItem: ClothingItem) => void
}

// Sample data for the form
const categories = ["Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Accessories"]

const subcategories = {
  Tops: ["T-Shirt", "Blouse", "Sweater", "Tank Top", "Shirt", "Hoodie"],
  Bottoms: ["Jeans", "Pants", "Shorts", "Skirts", "Leggings"],
  Dresses: ["Casual Dress", "Formal Dress", "Maxi Dress", "Mini Dress"],
  Outerwear: ["Jacket", "Coat", "Blazer", "Cardigan"],
  Shoes: ["Sneakers", "Heels", "Boots", "Sandals", "Flats"],
  Accessories: ["Bags", "Jewelry", "Hats", "Scarves", "Belts"],
}

const colors = [
  "Black",
  "White",
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Purple",
  "Pink",
  "Orange",
  "Brown",
  "Gray",
  "Beige",
  "Multicolor",
]

const seasons = ["Spring", "Summer", "Fall", "Winter"]
const occasions = ["Casual", "Formal", "Work", "Sport", "Party", "Beach"]

export function EditItemModal({ open, onOpenChange, item, onSave }: EditItemModalProps) {
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [subcategory, setSubcategory] = useState("")
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([])
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([])
  const [notes, setNotes] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Initialize form with item data when it changes
  useEffect(() => {
    if (item) {
      setName(item.name || "")
      setCategory(item.category || "")
      setSubcategory(item.subcategory || "")
      setSelectedColors(item.colors || [])
      setSelectedSeasons(item.seasons || [])
      setSelectedOccasions(item.occasions || [])
      setNotes(item.notes || "")
      setErrors({})
    }
  }, [item])

  const toggleColor = (color: string) => {
    setSelectedColors((prev) => (prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]))
  }

  const toggleSeason = (season: string) => {
    setSelectedSeasons((prev) => (prev.includes(season) ? prev.filter((s) => s !== season) : [...prev, season]))
  }

  const toggleOccasion = (occasion: string) => {
    setSelectedOccasions((prev) => (prev.includes(occasion) ? prev.filter((o) => o !== occasion) : [...prev, occasion]))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) {
      newErrors.name = "Item name is required"
    }

    if (!category) {
      newErrors.category = "Category is required"
    }

    if (!subcategory && category) {
      newErrors.subcategory = "Subcategory is required"
    }

    if (selectedColors.length === 0) {
      newErrors.colors = "At least one color is required"
    }

    if (selectedSeasons.length === 0) {
      newErrors.seasons = "At least one season is required"
    }

    if (selectedOccasions.length === 0) {
      newErrors.occasions = "At least one occasion is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!item || !validateForm()) return

    const updatedItem: ClothingItem = {
      ...item,
      name,
      category,
      subcategory,
      colors: selectedColors,
      seasons: selectedSeasons,
      occasions: selectedOccasions,
      notes,
    }

    onSave(updatedItem)
    onOpenChange(false)
  }

  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
        </DialogHeader>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
          <div>
            <img src={item.image || "/placeholder.svg"} alt="Clothing item" className="w-full h-auto rounded-lg" />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className={errors.name ? "text-red-500" : ""}>
                Item Name
              </Label>
              <Input
                id="name"
                placeholder="e.g., Blue Denim Jacket"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className={errors.category ? "text-red-500" : ""}>
                  Category
                </Label>
                <Select
                  value={category}
                  onValueChange={(value) => {
                    setCategory(value)
                    setSubcategory("")
                  }}
                >
                  <SelectTrigger id="category" className={errors.category ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subcategory" className={errors.subcategory ? "text-red-500" : ""}>
                  Subcategory
                </Label>
                <Select value={subcategory} onValueChange={setSubcategory} disabled={!category}>
                  <SelectTrigger id="subcategory" className={errors.subcategory ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {category &&
                      subcategories[category as keyof typeof subcategories]?.map((subcat) => (
                        <SelectItem key={subcat} value={subcat}>
                          {subcat}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors.subcategory && <p className="text-xs text-red-500">{errors.subcategory}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label className={errors.colors ? "text-red-500" : ""}>Colors</Label>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <Badge
                    key={color}
                    variant={selectedColors.includes(color) ? "default" : "outline"}
                    className={`cursor-pointer ${selectedColors.includes(color) ? "bg-pink-500" : ""}`}
                    onClick={() => toggleColor(color)}
                  >
                    {color}
                    {selectedColors.includes(color) && <X className="ml-1 h-3 w-3" />}
                  </Badge>
                ))}
              </div>
              {errors.colors && <p className="text-xs text-red-500">{errors.colors}</p>}
            </div>

            <div className="space-y-2">
              <Label className={errors.seasons ? "text-red-500" : ""}>Seasons</Label>
              <div className="flex flex-wrap gap-2">
                {seasons.map((season) => (
                  <Badge
                    key={season}
                    variant={selectedSeasons.includes(season) ? "default" : "outline"}
                    className={`cursor-pointer ${selectedSeasons.includes(season) ? "bg-pink-500" : ""}`}
                    onClick={() => toggleSeason(season)}
                  >
                    {season}
                    {selectedSeasons.includes(season) && <X className="ml-1 h-3 w-3" />}
                  </Badge>
                ))}
              </div>
              {errors.seasons && <p className="text-xs text-red-500">{errors.seasons}</p>}
            </div>

            <div className="space-y-2">
              <Label className={errors.occasions ? "text-red-500" : ""}>Occasions</Label>
              <div className="flex flex-wrap gap-2">
                {occasions.map((occasion) => (
                  <Badge
                    key={occasion}
                    variant={selectedOccasions.includes(occasion) ? "default" : "outline"}
                    className={`cursor-pointer ${selectedOccasions.includes(occasion) ? "bg-pink-500" : ""}`}
                    onClick={() => toggleOccasion(occasion)}
                  >
                    {occasion}
                    {selectedOccasions.includes(occasion) && <X className="ml-1 h-3 w-3" />}
                  </Badge>
                ))}
              </div>
              {errors.occasions && <p className="text-xs text-red-500">{errors.occasions}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes about this item..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
