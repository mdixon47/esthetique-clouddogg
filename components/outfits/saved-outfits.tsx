"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OutfitCard } from "@/components/outfits/outfit-card"
import { OutfitDetailsModal } from "@/components/outfits/outfit-details-modal"
import { getSavedOutfits, removeSavedOutfit, type SavedOutfit } from "@/utils/saved-outfits"
import { Button } from "@/components/ui/button"
import { Trash2, AlertTriangle, Calendar, Clock, Heart, Search, SortAsc } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/providers/toast-provider"
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
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"
import { Separator } from "@/components/ui/separator"
// import { format } from "date-fns"

export function SavedOutfits() {
  const [activeTab, setActiveTab] = useState("all")
  const [selectedOutfit, setSelectedOutfit] = useState<SavedOutfit | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([])
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "a-z">("newest")
  const { toast } = useToast()

  // Load saved outfits on component mount
  useEffect(() => {
    loadSavedOutfits()
  }, [])

  const loadSavedOutfits = () => {
    const outfits = getSavedOutfits()
    setSavedOutfits(outfits)
  }

  const handleOutfitClick = (outfit: SavedOutfit) => {
    setSelectedOutfit(outfit)
    setShowDetailsModal(true)
  }

  const handleSaveToggle = (outfitId: number, isSaved: boolean) => {
    // If an outfit was unsaved, refresh the list
    if (!isSaved) {
      loadSavedOutfits()
    }
  }

  const handleRemoveOutfit = (outfitId: number) => {
    removeSavedOutfit(outfitId)
    loadSavedOutfits()

    toast({
      title: "Outfit removed",
      description: "The outfit has been removed from your saved collection",
    })
  }

  const clearAllSavedOutfits = () => {
    // Clear all saved outfits from localStorage
    localStorage.removeItem("savedOutfits")
    setSavedOutfits([])
    setShowClearConfirm(false)

    toast({
      title: "Collection cleared",
      description: "All saved outfits have been removed",
      variant: "default",
    })
  }

  // Filter outfits based on tab, search query
  const getFilteredOutfits = () => {
    let filtered = savedOutfits

    // Filter by tab/occasion
    if (activeTab !== "all") {
      filtered = filtered.filter((outfit) => outfit.occasion === activeTab)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (outfit) =>
          outfit.name.toLowerCase().includes(query) ||
          outfit.description.toLowerCase().includes(query) ||
          outfit.items.some((item) => item.name.toLowerCase().includes(query)),
      )
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      if (sortOrder === "newest") {
        return b.savedAt - a.savedAt
      } else if (sortOrder === "oldest") {
        return a.savedAt - b.savedAt
      } else {
        // a-z
        return a.name.localeCompare(b.name)
      }
    })
  }

  const filteredOutfits = getFilteredOutfits()

  // Get counts for each category
  const getCategoryCount = (category: string) => {
    return savedOutfits.filter((outfit) => (category === "all" ? true : outfit.occasion === category)).length
  }

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 shadow-sm border border-pink-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <Heart className="h-5 w-5 mr-2 text-pink-500" />
              Your Saved Outfits
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {savedOutfits.length} {savedOutfits.length === 1 ? "outfit" : "outfits"} saved to your collection
            </p>
          </div>

          {savedOutfits.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="border-red-200 text-red-500 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
              onClick={() => setShowClearConfirm(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Collection
            </Button>
          )}
        </div>
      </div>

      {/* Search and filters */}
      {savedOutfits.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search saved outfits..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as any)}>
            <SelectTrigger className="w-[180px]">
              <SortAsc className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Newest First
                </div>
              </SelectItem>
              <SelectItem value="oldest">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Oldest First
                </div>
              </SelectItem>
              <SelectItem value="a-z">
                <div className="flex items-center">
                  <SortAsc className="h-4 w-4 mr-2" />
                  Name (A-Z)
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all" className="relative">
            All
            <Badge className="ml-1 bg-pink-100 text-pink-800 absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full">
              {getCategoryCount("all")}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="casual" className="relative">
            Casual
            {getCategoryCount("casual") > 0 && (
              <Badge className="ml-1 bg-pink-100 text-pink-800 absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full">
                {getCategoryCount("casual")}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="work" className="relative">
            Work
            {getCategoryCount("work") > 0 && (
              <Badge className="ml-1 bg-pink-100 text-pink-800 absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full">
                {getCategoryCount("work")}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="formal" className="relative">
            Formal
            {getCategoryCount("formal") > 0 && (
              <Badge className="ml-1 bg-pink-100 text-pink-800 absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full">
                {getCategoryCount("formal")}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {savedOutfits.length === 0 ? (
            <Card className="border-dashed border-2 border-gray-200 bg-gray-50">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="bg-pink-50 p-3 rounded-full mb-4">
                  <Heart className="h-8 w-8 text-pink-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No saved outfits yet</h3>
                <p className="text-center text-gray-500 max-w-md mb-6">
                  Save your favorite outfit suggestions by clicking the heart icon on any outfit card.
                </p>
                <Button
                  className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500"
                  onClick={() => (window.location.href = "/outfit-suggestions")}
                >
                  Browse Outfit Suggestions
                </Button>
              </CardContent>
            </Card>
          ) : filteredOutfits.length === 0 ? (
            <Alert className="bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <AlertTitle>No matching outfits</AlertTitle>
              <AlertDescription>
                No outfits match your current filters. Try changing your search query or selecting a different category.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {/* Results summary */}
              <div className="mb-4 flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Showing <span className="font-medium">{filteredOutfits.length}</span> of {savedOutfits.length} saved
                  outfits
                </p>

                {searchQuery && (
                  <Button variant="outline" size="sm" onClick={() => setSearchQuery("")} className="h-8 gap-1 text-xs">
                    Clear search
                    <Badge variant="secondary" className="ml-1 bg-gray-100">
                      "{searchQuery}"
                    </Badge>
                  </Button>
                )}
              </div>

              {/* Outfit grid */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                variants={container}
                initial="hidden"
                animate="show"
              >
                <AnimatePresence>
                  {filteredOutfits.map((outfit) => (
                    <motion.div
                      key={outfit.id}
                      variants={item}
                      exit={{ opacity: 0, scale: 0.8 }}
                      layout
                      className="relative group"
                    >
                      <div className="absolute -top-2 -right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="destructive"
                          className="h-7 w-7 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveOutfit(outfit.id)
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>

                      <div
                        onClick={() => handleOutfitClick(outfit)}
                        className="cursor-pointer transition-all duration-200 hover:shadow-md"
                      >
                        <OutfitCard
                          outfit={outfit}
                          isAIGenerated={outfit.isAIGenerated}
                          isGrokGenerated={outfit.isGrokGenerated}
                          isOpenAIGenerated={outfit.isOpenAIGenerated}
                          onSaveToggle={handleSaveToggle}
                        />

                        {/* Saved date indicator */}
                        <div className="mt-1 text-xs text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1 inline" />
                          Saved {format(new Date(outfit.savedAt), "MMM d, yyyy")}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </>
          )}
        </TabsContent>
      </Tabs>

      <OutfitDetailsModal
        outfit={selectedOutfit}
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
        onSaveToggle={handleSaveToggle}
      />

      <AlertDialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center flex flex-col items-center">
              <div className="bg-red-100 p-3 rounded-full mb-2">
                <Trash2 className="h-6 w-6 text-red-500" />
              </div>
              Clear all saved outfits?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              This will permanently delete all {savedOutfits.length} outfits from your saved collection. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Separator className="my-2" />
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="sm:mt-0 w-full">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={clearAllSavedOutfits} className="bg-red-500 hover:bg-red-600 text-white w-full">
              Yes, clear all outfits
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
