"use client"

import type React from "react"

import { useState } from "react"
import { MoreHorizontal, Edit, Trash2, Share, Heart } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { EditItemModal } from "@/components/wardrobe/edit-item-modal"
import { ShareItemModal } from "@/components/wardrobe/share-item-modal"
import { motion } from "framer-motion"
import Image from "next/image"

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

interface ClothingCardProps {
  item: ClothingItem
  viewMode: "grid" | "list"
  onDelete?: (id: number) => void
  onEdit?: (updatedItem: ClothingItem) => void
  onFavorite?: (id: number, isFavorite: boolean) => void
}

export function ClothingCard({ item, viewMode, onDelete, onEdit, onFavorite }: ClothingCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  const handleDelete = () => {
    if (onDelete) {
      onDelete(item.id)
    }
    setShowDeleteDialog(false)
  }

  const handleEdit = (updatedItem: ClothingItem) => {
    if (onEdit) {
      onEdit(updatedItem)
    }
  }

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newValue = !isFavorite
    setIsFavorite(newValue)
    if (onFavorite) {
      onFavorite(item.id, newValue)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <Card
          className={`overflow-hidden transition-all duration-300 hover:shadow-md ${
            viewMode === "list" ? "flex flex-col sm:flex-row" : ""
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className={`relative ${viewMode === "list" ? "w-full sm:w-[120px] h-[120px]" : ""}`}>
            <div
              className={`${
                viewMode === "list" ? "w-full sm:w-[120px] h-[120px]" : "aspect-square"
              } bg-gray-100 overflow-hidden`}
            >
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                width={300}
                height={300}
                className={`w-full h-full object-cover transition-transform duration-500 ${
                  isHovered ? "scale-110" : "scale-100"
                }`}
                onError={(e) => {
                  // If image fails to load, replace with a placeholder
                  e.currentTarget.src = `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(item.name)}`
                }}
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className={`absolute top-2 left-2 bg-white/80 backdrop-blur-sm hover:bg-white/90 ${
                isFavorite ? "text-pink-500" : "text-gray-400"
              }`}
              onClick={toggleFavorite}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white/90"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowShareModal(true)}>
                  <Share className="mr-2 h-4 w-4" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600" onClick={() => setShowDeleteDialog(true)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className={`flex flex-col ${viewMode === "list" ? "flex-1 p-4" : ""}`}>
            <CardContent className={viewMode === "list" ? "p-0" : "p-4"}>
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium line-clamp-1">{item.name}</h3>
                </div>
                <p className="text-sm text-gray-500">
                  {item.category} • {item.subcategory}
                </p>
              </div>
            </CardContent>

            <CardFooter className={`flex-wrap gap-2 ${viewMode === "list" ? "p-0 mt-2" : "px-4 pb-4 pt-0"}`}>
              {item.colors.slice(0, 2).map((color) => (
                <Badge key={color} variant="outline" className="bg-white">
                  {color}
                </Badge>
              ))}
              {item.colors.length > 2 && (
                <Badge variant="outline" className="bg-white">
                  +{item.colors.length - 2}
                </Badge>
              )}

              {viewMode === "list" && (
                <>
                  {item.seasons.slice(0, 1).map((season) => (
                    <Badge key={season} variant="outline" className="bg-white">
                      {season}
                    </Badge>
                  ))}
                  {item.seasons.length > 1 && (
                    <Badge variant="outline" className="bg-white">
                      +{item.seasons.length - 1}
                    </Badge>
                  )}
                </>
              )}
            </CardFooter>
          </div>
        </Card>
      </motion.div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove &ldquo;{item.name}&ldquo; from your wardrobe. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditItemModal open={showEditModal} onOpenChange={setShowEditModal} item={item} onSave={handleEdit} />

      <ShareItemModal open={showShareModal} onOpenChange={setShowShareModal} item={item} />
    </>
  )
}
