// Types for saved outfits
export interface SavedOutfit {
  id: number
  name: string
  occasion: string
  style: string
  season: string
  items: Array<{
    id: number
    name: string
    category: string
    image: string
  }>
  weather: string
  description: string
  score?: number
  generatedByModel?: string
  isAIGenerated?: boolean
  isGrokGenerated?: boolean
  isOpenAIGenerated?: boolean
  savedAt: number // timestamp when saved
}

// Get all saved outfits from localStorage
export function getSavedOutfits(): SavedOutfit[] {
  if (typeof window === "undefined") return []

  try {
    const savedOutfits = localStorage.getItem("savedOutfits")
    return savedOutfits ? JSON.parse(savedOutfits) : []
  } catch (error) {
    console.error("Error retrieving saved outfits:", error)
    return []
  }
}

// Check if an outfit is saved
export function isOutfitSaved(outfitId: number): boolean {
  const savedOutfits = getSavedOutfits()
  return savedOutfits.some((outfit) => outfit.id === outfitId)
}

// Save an outfit to localStorage
export function saveOutfit(outfit: SavedOutfit): void {
  try {
    const savedOutfits = getSavedOutfits()

    // Check if outfit already exists
    if (!isOutfitSaved(outfit.id)) {
      // Add savedAt timestamp if not present
      if (!outfit.savedAt) {
        outfit.savedAt = Date.now()
      }

      savedOutfits.push(outfit)
      localStorage.setItem("savedOutfits", JSON.stringify(savedOutfits))
    }
  } catch (error) {
    console.error("Error saving outfit:", error)
  }
}

// Remove a saved outfit from localStorage
export function removeSavedOutfit(outfitId: number): void {
  try {
    const savedOutfits = getSavedOutfits()
    const updatedOutfits = savedOutfits.filter(
      (outfit) => outfit.id !== outfitId
    )
    localStorage.setItem("savedOutfits", JSON.stringify(updatedOutfits))
  } catch (error) {
    console.error("Error removing saved outfit:", error)
  }
}

// Update the OutfitCard component to use our saved outfits functionality
export function updateOutfitCard(
  outfit: SavedOutfit,
  updates: Partial<SavedOutfit>
): void {
  try {
    const savedOutfits = getSavedOutfits()
    const updatedOutfits = savedOutfits.map((savedOutfit) =>
      savedOutfit.id === outfit.id
        ? { ...savedOutfit, ...updates }
        : savedOutfit
    )
    localStorage.setItem("savedOutfits", JSON.stringify(updatedOutfits))
  } catch (error) {
    console.error("Error updating saved outfit:", error)
  }
}
