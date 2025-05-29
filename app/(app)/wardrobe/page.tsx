"use client"

import { useState, useRef } from "react"
import { WardrobeHeader } from "@/components/wardrobe/wardrobe-header"
import { WardrobeGrid } from "@/components/wardrobe/wardrobe-grid"
import { WardrobeFilters } from "@/components/wardrobe/wardrobe-filters"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useToast } from "@/components/providers/toast-provider"
import { useSearchParams } from "next/navigation"

export default function WardrobePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const gridRef = useRef<any>(null)
  const { toast } = useToast()
  const searchParams = useSearchParams()

  // Check for shared item in URL
  const sharedItem = searchParams.get("shared")
  if (sharedItem && !window.localStorage.getItem("sharedItemProcessed")) {
    try {
      const decodedItem = JSON.parse(atob(sharedItem))
      toast({
        title: "Shared item received",
        description: `Someone shared "${decodedItem.name}" with you. You can add it to your wardrobe.`,
      })
      // Mark as processed to avoid showing the toast again on refresh
      window.localStorage.setItem("sharedItemProcessed", "true")
    } catch (error) {
      console.error("Error parsing shared item:", error)
    }
  }

  const handleItemAdded = (item: any) => {
    if (gridRef.current && gridRef.current.addItem) {
      gridRef.current.addItem(item)
      toast({
        title: "Item added",
        description: `${item.name} has been added to your wardrobe`,
      })
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <WardrobeHeader onItemAdded={handleItemAdded} onSearch={handleSearch} />

      {/* Mobile filter button */}
      <div className="md:hidden mt-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full flex items-center justify-center">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[85%] sm:w-[350px] pt-6">
            <div className="h-full overflow-y-auto pb-8">
              <WardrobeFilters />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr]">
        {/* Desktop filters - hidden on mobile */}
        <div className="hidden md:block">
          <WardrobeFilters />
        </div>

        <WardrobeGrid ref={gridRef} searchQuery={searchQuery} />
      </div>
    </div>
  )
}
