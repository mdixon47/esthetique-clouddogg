"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UploadModal } from "@/components/wardrobe/upload-modal"

interface WardrobeHeaderProps {
  onItemAdded?: (item: any) => void
  onSearch?: (query: string) => void
}

export function WardrobeHeader({ onItemAdded, onSearch }: WardrobeHeaderProps) {
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    if (onSearch) {
      onSearch(query)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Wardrobe</h1>
        <Button
          onClick={() => setShowUploadModal(true)}
          className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search your wardrobe..."
          className="pl-10 bg-white"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <UploadModal open={showUploadModal} onOpenChange={setShowUploadModal} onItemAdded={onItemAdded} />
    </div>
  )
}
