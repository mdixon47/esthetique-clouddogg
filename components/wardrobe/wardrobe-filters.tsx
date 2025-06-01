"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Sample data for filters
const categories = [
  { id: "tops", label: "Tops", count: 12 },
  { id: "bottoms", label: "Bottoms", count: 8 },
  { id: "dresses", label: "Dresses", count: 5 },
  { id: "outerwear", label: "Outerwear", count: 7 },
  { id: "shoes", label: "Shoes", count: 10 },
  { id: "accessories", label: "Accessories", count: 15 },
]

const colors = [
  { id: "black", label: "Black", count: 20 },
  { id: "white", label: "White", count: 18 },
  { id: "blue", label: "Blue", count: 15 },
  { id: "red", label: "Red", count: 8 },
  { id: "green", label: "Green", count: 6 },
  { id: "yellow", label: "Yellow", count: 4 },
  { id: "purple", label: "Purple", count: 3 },
  { id: "pink", label: "Pink", count: 7 },
  { id: "orange", label: "Orange", count: 2 },
  { id: "brown", label: "Brown", count: 5 },
  { id: "gray", label: "Gray", count: 10 },
  { id: "beige", label: "Beige", count: 8 },
  { id: "multicolor", label: "Multicolor", count: 6 },
]

const seasons = [
  { id: "spring", label: "Spring", count: 25 },
  { id: "summer", label: "Summer", count: 30 },
  { id: "fall", label: "Fall", count: 28 },
  { id: "winter", label: "Winter", count: 22 },
]

const occasions = [
  { id: "casual", label: "Casual", count: 35 },
  { id: "formal", label: "Formal", count: 12 },
  { id: "work", label: "Work", count: 20 },
  { id: "sport", label: "Sport", count: 8 },
  { id: "party", label: "Party", count: 15 },
  { id: "beach", label: "Beach", count: 6 },
]

interface WardrobeFiltersProps {
  onFilterChange?: (filters: {
    categories: string[];
    colors: string[];
    seasons: string[];
    occasions: string[];
  }) => void
}

export function WardrobeFilters({ onFilterChange }: WardrobeFiltersProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([])
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([])

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) => {
      const newSelection = prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
      updateFilters({
        categories: newSelection,
        colors: selectedColors,
        seasons: selectedSeasons,
        occasions: selectedOccasions,
      })
      return newSelection
    })
  }

  const toggleColor = (id: string) => {
    setSelectedColors((prev) => {
      const newSelection = prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
      updateFilters({
        categories: selectedCategories,
        colors: newSelection,
        seasons: selectedSeasons,
        occasions: selectedOccasions,
      })
      return newSelection
    })
  }

  const toggleSeason = (id: string) => {
    setSelectedSeasons((prev) => {
      const newSelection = prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
      updateFilters({
        categories: selectedCategories,
        colors: selectedColors,
        seasons: newSelection,
        occasions: selectedOccasions,
      })
      return newSelection
    })
  }

  const toggleOccasion = (id: string) => {
    setSelectedOccasions((prev) => {
      const newSelection = prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
      updateFilters({
        categories: selectedCategories,
        colors: selectedColors,
        seasons: selectedSeasons,
        occasions: newSelection,
      })
      return newSelection
    })
  }

  const updateFilters = (filters: {
    categories: string[];
    colors: string[];
    seasons: string[];
    occasions: string[];
  }) => {
    if (onFilterChange) {
      onFilterChange(filters)
    }
  }

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedColors([])
    setSelectedSeasons([])
    setSelectedOccasions([])

    if (onFilterChange) {
      onFilterChange({ categories: [], colors: [], seasons: [], occasions: [] })
    }
  }

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedColors.length > 0 ||
    selectedSeasons.length > 0 ||
    selectedOccasions.length > 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-pink-500 hover:text-pink-600 hover:bg-pink-50"
          >
            Clear All
          </Button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={["categories", "colors", "seasons", "occasions"]} className="space-y-4">
        <AccordionItem value="categories" className="border rounded-lg p-2">
          <AccordionTrigger className="px-2 hover:no-underline">
            <span className="text-sm font-medium">Categories</span>
          </AccordionTrigger>
          <AccordionContent className="pt-4 px-2">
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => toggleCategory(category.id)}
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="flex-1 text-sm cursor-pointer flex justify-between"
                  >
                    <span>{category.label}</span>
                    <span className="text-gray-500 text-xs">({category.count})</span>
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="colors" className="border rounded-lg p-2">
          <AccordionTrigger className="px-2 hover:no-underline">
            <span className="text-sm font-medium">Colors</span>
          </AccordionTrigger>
          <AccordionContent className="pt-4 px-2">
            <div className="space-y-2">
              {colors.map((color) => (
                <div key={color.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`color-${color.id}`}
                    checked={selectedColors.includes(color.id)}
                    onCheckedChange={() => toggleColor(color.id)}
                  />
                  <Label htmlFor={`color-${color.id}`} className="flex-1 text-sm cursor-pointer flex justify-between">
                    <span>{color.label}</span>
                    <span className="text-gray-500 text-xs">({color.count})</span>
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="seasons" className="border rounded-lg p-2">
          <AccordionTrigger className="px-2 hover:no-underline">
            <span className="text-sm font-medium">Seasons</span>
          </AccordionTrigger>
          <AccordionContent className="pt-4 px-2">
            <div className="space-y-2">
              {seasons.map((season) => (
                <div key={season.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`season-${season.id}`}
                    checked={selectedSeasons.includes(season.id)}
                    onCheckedChange={() => toggleSeason(season.id)}
                  />
                  <Label htmlFor={`season-${season.id}`} className="flex-1 text-sm cursor-pointer flex justify-between">
                    <span>{season.label}</span>
                    <span className="text-gray-500 text-xs">({season.count})</span>
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="occasions" className="border rounded-lg p-2">
          <AccordionTrigger className="px-2 hover:no-underline">
            <span className="text-sm font-medium">Occasions</span>
          </AccordionTrigger>
          <AccordionContent className="pt-4 px-2">
            <div className="space-y-2">
              {occasions.map((occasion) => (
                <div key={occasion.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`occasion-${occasion.id}`}
                    checked={selectedOccasions.includes(occasion.id)}
                    onCheckedChange={() => toggleOccasion(occasion.id)}
                  />
                  <Label
                    htmlFor={`occasion-${occasion.id}`}
                    className="flex-1 text-sm cursor-pointer flex justify-between"
                  >
                    <span>{occasion.label}</span>
                    <span className="text-gray-500 text-xs">({occasion.count})</span>
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="pt-4">
        <Button
          className="w-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500"
          onClick={() => {
            if (onFilterChange) {
              onFilterChange({
                categories: selectedCategories,
                colors: selectedColors,
                seasons: selectedSeasons,
                occasions: selectedOccasions,
              })
            }
          }}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  )
}
