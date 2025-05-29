"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { OutfitGenerator } from "@/components/outfits/outfit-generator"
import { OutfitPreferences } from "@/components/outfits/outfit-preferences"
import { SavedOutfits } from "@/components/outfits/saved-outfits"
import { generateOutfitSuggestions } from "@/lib/outfit-algorithm"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal, Sparkles, Zap, AlertTriangle, Brain, RefreshCw } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"
import { SharedPreferencesAlert } from "@/components/outfits/shared-preferences-alert"
import { useToast } from "@/hooks/use-toast"
import { getSavedOutfits } from "@/utils/saved-outfits"
import { Badge } from "@/components/ui/badge"
import { OutfitDetailsModal } from "@/components/outfits/outfit-details-modal"

// Sample wardrobe data (in a real app, this would come from your database)
const sampleWardrobe = [
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

export default function OutfitSuggestionsPage() {
  const [activeTab, setActiveTab] = useState("suggested")
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [outfits, setOutfits] = useState(() => {
    const generatedOutfits = generateOutfitSuggestions(
      sampleWardrobe,
      {
        occasion: "casual",
        season: "current",
        style: "balanced",
        colorfulness: 50,
        useWeather: true,
        includeAccessories: true,
        weather: {
          temperature: 75,
          condition: "Sunny",
        },
      },
      4,
    )

    // Ensure each outfit has items with valid image paths
    return generatedOutfits.map((outfit) => ({
      ...outfit,
      items: outfit.items.map((item) => ({
        ...item,
        // Use a reliable external placeholder service
        image:
          item.image ||
          `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(item.name?.substring(0, 10) || "Item")}`,
      })),
    }))
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [useAI, setUseAI] = useState(true)
  const [useGrok, setUseGrok] = useState(false)
  const [useOpenAI, setUseOpenAI] = useState(false)
  const [preferredModel, setPreferredModel] = useState("gpt-4o")
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)
  const [sharedPreferences, setSharedPreferences] = useState<any>(null)
  const [modelStatus, setModelStatus] = useState<Record<
    string,
    { available: boolean; resetIn: number; failureCount: number }
  > | null>(null)
  const [lastUsedModel, setLastUsedModel] = useState<string | null>(null)
  const [savedOutfitsCount, setSavedOutfitsCount] = useState(0)
  const [selectedOutfit, setSelectedOutfit] = useState<any>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [isCheckingQuota, setIsCheckingQuota] = useState(false)
  const [openAIQuotaExceeded, setOpenAIQuotaExceeded] = useState(false)
  const [quotaRetryTime, setQuotaRetryTime] = useState<string | null>(null)
  const [generationMode, setGenerationMode] = useState<string>("standard")
  const [retryCount, setRetryCount] = useState(0)
  const MAX_RETRIES = 2

  // State for user's wardrobe - in a real app, this would come from a database
  const [userWardrobe, setUserWardrobe] = useState(sampleWardrobe)

  // Create a local fallback generator function
  const generateLocalOutfits = useCallback(
    (count = 4, preferences = {}) => {
      console.log("Using local fallback outfit generator")

      // Generate random outfits based on the wardrobe
      return Array(count)
        .fill(null)
        .map((_, index) => {
          // Randomly select items from different categories
          const tops = userWardrobe.filter((item) => item.category === "Tops")
          const bottoms = userWardrobe.filter((item) => item.category === "Bottoms")
          const shoes = userWardrobe.filter((item) => item.category === "Shoes")
          const outerwear = userWardrobe.filter((item) => item.category === "Outerwear")
          const dresses = userWardrobe.filter((item) => item.category === "Dresses")

          // Decide if we're creating a dress outfit or a top+bottom outfit
          const useDress = dresses.length > 0 && Math.random() > 0.7

          let items = []

          if (useDress) {
            const randomDress = dresses[Math.floor(Math.random() * dresses.length)]
            items.push(randomDress)
          } else {
            const randomTop = tops.length > 0 ? tops[Math.floor(Math.random() * tops.length)] : null
            const randomBottom = bottoms.length > 0 ? bottoms[Math.floor(Math.random() * bottoms.length)] : null

            if (randomTop) items.push(randomTop)
            if (randomBottom) items.push(randomBottom)
          }

          // Add shoes if available
          const randomShoes = shoes.length > 0 ? shoes[Math.floor(Math.random() * shoes.length)] : null
          if (randomShoes) items.push(randomShoes)

          // Randomly decide whether to include outerwear
          const includeOuterwear = Math.random() > 0.5 && outerwear.length > 0
          const randomOuterwear = includeOuterwear ? outerwear[Math.floor(Math.random() * outerwear.length)] : null
          if (randomOuterwear) items.push(randomOuterwear)

          // If we somehow have no items, add some random ones
          if (items.length === 0 && userWardrobe.length > 0) {
            const randomItems = userWardrobe.sort(() => 0.5 - Math.random()).slice(0, 3)
            items = randomItems
          }

          // Generate a random outfit name
          const occasions = ["Casual", "Work", "Formal", "Date Night", "Weekend"]
          const styles = ["Classic", "Modern", "Trendy", "Relaxed", "Elegant"]
          const randomOccasion = occasions[Math.floor(Math.random() * occasions.length)]
          const randomStyle = styles[Math.floor(Math.random() * styles.length)]

          const occasion = preferences.occasion || randomOccasion.toLowerCase()
          const season = preferences.season || "current"

          return {
            id: Date.now() + index,
            name: `${randomStyle} ${randomOccasion} Look`,
            occasion: occasion,
            style: preferences.style || "balanced",
            season: season,
            items: items,
            weather: `Suitable for ${season} weather conditions`,
            description: `A ${randomStyle.toLowerCase()} outfit perfect for ${randomOccasion.toLowerCase()} occasions.`,
            score: Math.floor(Math.random() * 5) + 1,
            isAIGenerated: false,
            isLocallyGenerated: true,
          }
        })
    },
    [userWardrobe],
  )

  // Add a function to check OpenAI quota status
  const checkOpenAIQuota = async () => {
    try {
      setIsCheckingQuota(true)

      // Add a timeout to the fetch request
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000) // 8 second timeout

      try {
        // Wrap the fetch in another try/catch to handle network errors
        try {
          const response = await fetch("/api/quota-check", {
            signal: controller.signal,
          })

          clearTimeout(timeoutId)

          // Handle server errors more gracefully
          if (!response.ok) {
            console.error(`Quota check failed with status: ${response.status}`)

            // For any server error, assume quota is not exceeded
            setOpenAIQuotaExceeded(false)
            setQuotaRetryTime(null)

            // Show a warning toast
            toast({
              title: "OpenAI check warning",
              description: "Could not verify quota status. Proceeding with standard settings.",
            })

            // Return true to allow operation to continue with standard AI
            return false
          }

          // Now try to parse the JSON response
          try {
            const data = await response.json()
            setOpenAIQuotaExceeded(!data.available)

            if (data.quotaExceeded) {
              // Format retry time
              const retryMinutes = Math.ceil(data.retryAfter / 60)
              setQuotaRetryTime(
                retryMinutes > 60 ? `${Math.floor(retryMinutes / 60)} hour(s)` : `${retryMinutes} minutes`,
              )

              // If OpenAI is not available and user selected it, show a toast
              if (generationMode === "openai") {
                toast({
                  title: "OpenAI quota exceeded",
                  description: "Switched to standard AI due to quota limitations",
                })
              }

              return false
            } else {
              setQuotaRetryTime(null)
              return true
            }
          } catch (jsonError) {
            console.error("Error parsing quota check response:", jsonError)

            // If JSON parsing fails, assume quota is not exceeded
            setOpenAIQuotaExceeded(false)
            setQuotaRetryTime(null)

            toast({
              title: "OpenAI check warning",
              description: "Could not verify quota status. Proceeding with standard settings.",
            })

            return false
          }
        } catch (fetchError) {
          clearTimeout(timeoutId)

          // Handle abort errors differently
          if (fetchError.name === "AbortError") {
            console.error("Quota check timed out")
            toast({
              title: "OpenAI check timed out",
              description: "Using standard AI due to timeout",
            })
          } else {
            console.error("Error fetching quota check:", fetchError)
          }

          // For any fetch error, assume quota is not exceeded
          setOpenAIQuotaExceeded(false)
          setQuotaRetryTime(null)

          return false
        }
      } catch (outerError) {
        console.error("Outer error in quota check:", outerError)
        clearTimeout(timeoutId)

        // For any unexpected error, assume quota is not exceeded
        setOpenAIQuotaExceeded(false)
        setQuotaRetryTime(null)

        return false
      }
    } catch (error) {
      console.error("Error checking quota:", error)

      // For any unexpected error, assume quota is not exceeded
      setOpenAIQuotaExceeded(false)
      setQuotaRetryTime(null)

      return false
    } finally {
      setIsCheckingQuota(false)
    }
  }

  // Add a useEffect to check quota on page load
  useEffect(() => {
    // Wrap in try/catch to ensure it never breaks the page
    try {
      checkOpenAIQuota().catch((error) => {
        console.error("Error in initial quota check:", error)
        // Don't show any UI errors for the initial check
      })
    } catch (error) {
      console.error("Unexpected error in quota check effect:", error)
    }
  }, [])

  // Add a useEffect to update saved outfits count
  useEffect(() => {
    const updateSavedCount = () => {
      const savedOutfits = getSavedOutfits()
      setSavedOutfitsCount(savedOutfits.length)
    }

    // Update count on mount
    updateSavedCount()

    // Set up event listener for storage changes
    window.addEventListener("storage", updateSavedCount)

    // Custom event for when outfits are saved/removed
    window.addEventListener("savedOutfitsChanged", updateSavedCount)

    return () => {
      window.removeEventListener("storage", updateSavedCount)
      window.removeEventListener("savedOutfitsChanged", updateSavedCount)
    }
  }, [])

  // Function to handle applying shared preferences
  const applySharedPreferences = (preferences) => {
    if (preferences.occasion) setActiveTab(preferences.occasion === "casual" ? "suggested" : preferences.occasion)

    // Set preferred model if it exists in shared preferences
    if (preferences.preferredModel) {
      setPreferredModel(preferences.preferredModel)
    }

    // Call handleGenerateOutfits with the shared preferences
    handleGenerateOutfits({
      occasion: preferences.occasion || "casual",
      season: preferences.season || "current",
      style: preferences.style || "balanced",
      colorfulness: [preferences.colorfulness || 50],
      useWeather: preferences.useWeather !== undefined ? preferences.useWeather : true,
      includeAccessories: preferences.includeAccessories !== undefined ? preferences.includeAccessories : true,
      useAI:
        preferences.generationMode === "ai" ||
        preferences.generationMode === "grok" ||
        preferences.generationMode === "openai",
      useGrok: preferences.generationMode === "grok",
      useOpenAI: preferences.generationMode === "openai",
      preferredModel: preferences.preferredModel,
    })

    // Clear the shared preferences
    setSharedPreferences(null)
  }

  // Check for shared preferences in the URL
  useEffect(() => {
    const shared = searchParams.get("shared")
    if (shared) {
      try {
        const decodedPreferences = JSON.parse(atob(shared))
        setSharedPreferences(decodedPreferences)

        // Optional: Show a toast notification
        toast({
          title: "Preferences received",
          description: "Someone has shared their outfit preferences with you",
        })
      } catch (error) {
        console.error("Error parsing shared preferences:", error)
        toast({
          title: "Invalid shared preferences",
          description: "The shared link contains invalid data",
          variant: "destructive",
        })
      }
    }
  }, [searchParams, toast])

  // Modify the handleGenerateOutfits function to check quota before using OpenAI
  const handleGenerateOutfits = async (preferences) => {
    setIsGenerating(true)
    setError(null)
    setWarning(null)
    setRetryCount(0)
    setLastUsedModel(null)

    // If OpenAI is selected, check quota first
    if (preferences.useOpenAI) {
      try {
        const isAvailable = await checkOpenAIQuota()
        if (!isAvailable) {
          setWarning(
            `OpenAI quota check failed or quota exceeded. ${
              quotaRetryTime ? `Try again in approximately ${quotaRetryTime}.` : ""
            } Using standard AI algorithm instead.`,
          )
          // Override the OpenAI preference
          preferences.useOpenAI = false
        }
      } catch (quotaCheckError) {
        console.error("Error during quota check:", quotaCheckError)
        setWarning("OpenAI quota check failed. Using standard AI algorithm instead.")
        preferences.useOpenAI = false
      }
    }

    const { useAI = true, useGrok = false, useOpenAI = false, preferredModel, ...otherPreferences } = preferences

    try {
      // If AI is disabled, use the rule-based algorithm directly
      if (!useAI) {
        const newOutfits = generateOutfitSuggestions(
          sampleWardrobe,
          {
            ...otherPreferences,
            colorfulness: otherPreferences.colorfulness?.[0] || 50,
            weather: {
              temperature: 75,
              condition: "Sunny",
            },
          },
          4,
        )

        setOutfits(newOutfits)
        setIsGenerating(false)
        return
      }

      // If OpenAI was selected but previously failed, automatically switch to fallback
      if (useOpenAI && error && error.includes("quota exceeded")) {
        setWarning("OpenAI quota exceeded. Automatically switching to standard AI algorithm.")

        // Use the fallback endpoint instead
        try {
          const fallbackResponse = await fetch("/api/outfit-generator/simple", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              preferences: {
                ...otherPreferences,
                colorfulness: otherPreferences.colorfulness?.[0] || 50,
                weather: {
                  temperature: 75,
                  condition: "Sunny",
                },
              },
              wardrobe: sampleWardrobe,
              count: 4,
            }),
          })

          // Check if the response is OK
          if (!fallbackResponse.ok) {
            throw new Error(`Fallback API returned status: ${fallbackResponse.status}`)
          }

          // Try to parse the JSON response
          let data
          try {
            data = await fallbackResponse.json()
          } catch (jsonError) {
            console.error("Error parsing fallback response:", jsonError)
            // Get the response text for debugging
            const responseText = await fallbackResponse.text()
            console.error("Raw response:", responseText)
            throw new Error("Invalid JSON response from fallback API")
          }

          setOutfits(data.outfits || [])
          setIsGenerating(false)
          return
        } catch (fallbackError) {
          console.error("Error with fallback API:", fallbackError)

          // Use local generation as a last resort
          const localOutfits = generateLocalOutfits(4, {
            occasion: otherPreferences.occasion,
            season: otherPreferences.season,
            style: otherPreferences.style,
          })
          setOutfits(localOutfits)
          setIsGenerating(false)
          return
        }
      }

      // Determine which API endpoint to use
      let apiEndpoint = "/api/outfit-generator/simple"

      if (useOpenAI) {
        apiEndpoint = "/api/outfit-generator/openai"
      } else if (useGrok) {
        apiEndpoint = "/api/outfit-generator/grok"
      }

      const attemptGeneration = async (currentRetry = 0) => {
        try {
          // Create a controller for timeout
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 15000) // 15-second timeout

          // Call our API endpoint
          const response = await fetch(apiEndpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              preferences: {
                ...otherPreferences,
                colorfulness: otherPreferences.colorfulness?.[0] || 50,
                weather: {
                  temperature: 75, // In a real app, get this from a weather API
                  condition: "Sunny",
                },
              },
              wardrobe: sampleWardrobe,
              count: 4,
              preferredModel: useOpenAI ? preferredModel : undefined,
            }),
            signal: controller.signal,
          })

          // Clear the timeout once we get a response
          clearTimeout(timeoutId)

          // Check if the response is OK
          if (!response.ok) {
            // Get the response text for debugging
            let errorText
            try {
              errorText = await response.text()
            } catch (textError) {
              errorText = `Status: ${response.status} ${response.statusText}`
            }

            console.error(`API returned status ${response.status}:`, errorText)

            // For 500 errors, immediately use the local generator
            if (response.status === 500) {
              console.log("Server error (500), using local generator...")

              // Use local generation for 500 errors
              const localOutfits = generateLocalOutfits(4, {
                occasion: otherPreferences.occasion,
                season: otherPreferences.season,
                style: otherPreferences.style,
              })

              setOutfits(localOutfits)
              setWarning("Server error encountered. Using local generation instead.")
              return true
            }

            if (currentRetry < MAX_RETRIES) {
              // If we haven't exceeded max retries
              setRetryCount(currentRetry + 1)
              console.log(`API error, retrying (${currentRetry + 1}/${MAX_RETRIES})...`)
              return await attemptGeneration(currentRetry + 1)
            }

            throw new Error(`API returned status ${response.status}: ${errorText.substring(0, 100)}...`)
          }

          // Try to parse the JSON response
          let data
          try {
            data = await response.json()
          } catch (jsonError) {
            console.error("Error parsing JSON response:", jsonError)

            // Get the response text for debugging
            let responseText
            try {
              // Reset the response body
              responseText = await response.clone().text()
              console.error("Raw response:", responseText)
            } catch (textError) {
              responseText = "Could not get response text"
              console.error("Error getting response text:", textError)
            }

            if (currentRetry < MAX_RETRIES) {
              // If we haven't exceeded max retries
              setRetryCount(currentRetry + 1)
              console.log(`JSON parse error, retrying (${currentRetry + 1}/${MAX_RETRIES})...`)
              return await attemptGeneration(currentRetry + 1)
            }

            // Use local generation if JSON parsing fails
            const localOutfits = generateLocalOutfits(4, {
              occasion: otherPreferences.occasion,
              season: otherPreferences.season,
              style: otherPreferences.style,
            })

            setOutfits(localOutfits)
            setWarning("Error parsing server response. Using local generation instead.")
            return true
          }

          // Store model status if available
          if (data.modelStatus) {
            setModelStatus(data.modelStatus)
          }

          // Store the model that was used
          if (data.model) {
            setLastUsedModel(data.model)

            // If a different model was used than preferred, show a message
            if (preferredModel && data.model !== preferredModel) {
              setWarning(`Your preferred model (${preferredModel}) was unavailable. Used ${data.model} instead.`)
            }
          }

          // Check if there's an error message in the response
          if (data.error) {
            console.warn("API returned an error:", data.error)

            // Special handling for quota exceeded errors
            if (data.error.includes("quota exceeded") || data.error.includes("OpenAI quota")) {
              setWarning("OpenAI quota exceeded. Using our standard AI algorithm instead.")
              setUseOpenAI(false)
              toast({
                title: "OpenAI unavailable",
                description: "Switched to standard AI due to quota limitations",
              })
            } else if (data.error.includes("Empty outfits array") && currentRetry < MAX_RETRIES) {
              // If we got an empty outfits array and haven't exceeded max retries
              setRetryCount(currentRetry + 1)
              console.log(`Retrying generation (${currentRetry + 1}/${MAX_RETRIES})...`)
              return await attemptGeneration(currentRetry + 1)
            } else {
              setWarning(data.error)
            }

            // Still use the outfits if they were provided despite the error
            if (data.outfits && Array.isArray(data.outfits) && data.outfits.length > 0) {
              setOutfits(data.outfits)
              return true
            } else if (currentRetry < MAX_RETRIES) {
              // If no outfits were provided and we haven't exceeded max retries
              setRetryCount(currentRetry + 1)
              console.log(`Retrying generation (${currentRetry + 1}/${MAX_RETRIES})...`)
              return await attemptGeneration(currentRetry + 1)
            } else {
              // Use local generation if API returns error with no outfits
              const localOutfits = generateLocalOutfits(4, {
                occasion: otherPreferences.occasion,
                season: otherPreferences.season,
                style: otherPreferences.style,
              })

              setOutfits(localOutfits)
              setWarning("API error encountered. Using local generation instead.")
              return true
            }
          } else if (data.outfits && Array.isArray(data.outfits)) {
            // Validate outfits to ensure they have all required properties
            const validatedOutfits = data.outfits.map((outfit) => ({
              ...outfit,
              id: outfit.id || Date.now() + Math.random(),
              name: outfit.name || "Outfit",
              items: Array.isArray(outfit.items)
                ? outfit.items.map((item) => ({
                    ...item,
                    id: item.id || Date.now() + Math.random(),
                    name: item.name || "Item",
                    image:
                      item.image ||
                      `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(item.name?.substring(0, 10) || "Item")}`,
                  }))
                : [],
            }))

            setOutfits(validatedOutfits)
            return true
          } else if (currentRetry < MAX_RETRIES) {
            // If no outfits were provided and we haven't exceeded max retries
            setRetryCount(currentRetry + 1)
            console.log(`Retrying generation (${currentRetry + 1}/${MAX_RETRIES})...`)
            return await attemptGeneration(currentRetry + 1)
          } else {
            // Use local generation if API returns no outfits
            const localOutfits = generateLocalOutfits(4, {
              occasion: otherPreferences.occasion,
              season: otherPreferences.season,
              style: otherPreferences.style,
            })

            setOutfits(localOutfits)
            setWarning("No outfits returned from API. Using local generation instead.")
            return true
          }
        } catch (error) {
          // Handle timeout errors specifically
          if (error.name === "AbortError") {
            console.error("Request timed out")

            if (currentRetry < MAX_RETRIES) {
              // If we haven't exceeded max retries
              setRetryCount(currentRetry + 1)
              console.log(`Request timed out, retrying (${currentRetry + 1}/${MAX_RETRIES})...`)
              return await attemptGeneration(currentRetry + 1)
            } else {
              // Use local generation for timeout errors
              const localOutfits = generateLocalOutfits(4, {
                occasion: otherPreferences.occasion,
                season: otherPreferences.season,
                style: otherPreferences.style,
              })

              setOutfits(localOutfits)
              setWarning("Request timed out. Using local generation instead.")
              return true
            }
          } else if (currentRetry < MAX_RETRIES) {
            // If we haven't exceeded max retries for other errors
            setRetryCount(currentRetry + 1)
            console.log(`Error occurred, retrying (${currentRetry + 1}/${MAX_RETRIES})...`, error)
            return await attemptGeneration(currentRetry + 1)
          } else {
            throw error
          }
        }
      }

      // Start the generation process with retry mechanism
      const success = await attemptGeneration()

      if (!success) {
        // If all attempts failed, use local generation as a last resort
        const localOutfits = generateLocalOutfits(4, {
          occasion: otherPreferences.occasion,
          season: otherPreferences.season,
          style: otherPreferences.style,
        })
        setOutfits(localOutfits)
        setWarning("Using local generation after multiple failed attempts.")
      }
    } catch (error) {
      console.error("Error generating outfits:", error)

      let errorMessage = "There was an issue generating outfits. Using local algorithm instead."

      // Special handling for quota exceeded errors
      if (error.message && error.message.includes("quota")) {
        errorMessage = "OpenAI quota exceeded. Using local algorithm instead."

        // If using OpenAI, switch to simple AI
        if (useOpenAI) {
          setUseOpenAI(false)
          toast({
            title: "OpenAI unavailable",
            description: "Switched to local generation due to quota limitations",
          })
        }
      } else if (error.message && error.message.includes("Invalid JSON")) {
        errorMessage = "Received invalid response from server. Using local algorithm instead."
      } else if (useOpenAI) {
        errorMessage = "There was an issue with OpenAI generation. Falling back to local algorithm."
      } else if (useGrok) {
        errorMessage = "There was an issue with Grok generation. Falling back to local algorithm."
      }

      setError(errorMessage)

      // Use local generation as a last resort
      const localOutfits = generateLocalOutfits(4, {
        occasion: otherPreferences.occasion,
        season: otherPreferences.season,
        style: otherPreferences.style,
      })
      setOutfits(localOutfits)

      // Show a toast notification
      toast({
        title: "Using local generator",
        description: "We couldn't connect to our AI service. Using local outfit generator instead.",
        variant: "default",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const dismissSharedPreferences = () => {
    setSharedPreferences(null)
  }

  // Determine button style based on active AI mode
  const getButtonStyle = () => {
    if (useOpenAI) {
      return "bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700"
    } else if (useGrok) {
      return "bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700"
    } else {
      return "bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500"
    }
  }

  // Get the appropriate icon based on active AI mode
  const getButtonIcon = () => {
    if (useOpenAI) {
      return <Brain className="mr-2 h-4 w-4" />
    } else if (useGrok) {
      return <Zap className="mr-2 h-4 w-4" />
    } else {
      return <Sparkles className="mr-2 h-4 w-4" />
    }
  }

  // Handle save toggle from outfit card
  const handleSaveToggle = () => {
    // Update saved outfits count
    setSavedOutfitsCount(getSavedOutfitsCount())
  }

  // Function to get saved outfits count
  const getSavedOutfitsCount = () => {
    const savedOutfits = getSavedOutfits()
    return savedOutfits.length
  }

  // Handle outfit click to show details modal
  const handleOutfitClick = (outfit: any) => {
    setSelectedOutfit(outfit)
    setShowDetailsModal(true)
  }

  // Handle retry button click
  const handleRetry = () => {
    setError(null)
    setWarning(null)
    handleGenerateOutfits({
      occasion: activeTab === "suggested" ? "casual" : activeTab,
      season: "current",
      style: "balanced",
      colorfulness: [50],
      useWeather: true,
      includeAccessories: true,
      useAI,
      useGrok,
      useOpenAI,
      preferredModel,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Outfit Suggestions</h1>
        <p className="mt-2 text-gray-500">Get personalized outfit combinations based on your wardrobe items</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={handleRetry} className="ml-2">
              <RefreshCw className="h-3 w-3 mr-1" /> Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {warning && !error && (
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Note</AlertTitle>
          <AlertDescription>{warning}</AlertDescription>
        </Alert>
      )}

      {lastUsedModel && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <Brain className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-700">Model Information</AlertTitle>
          <AlertDescription className="text-green-700">
            Outfits were generated using the {lastUsedModel} model.
          </AlertDescription>
        </Alert>
      )}

      {openAIQuotaExceeded && useOpenAI && (
        <Alert className="mb-6 border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <AlertTitle className="text-yellow-700">OpenAI Quota Exceeded</AlertTitle>
          <AlertDescription className="text-yellow-700">
            The OpenAI API quota is currently exceeded.{" "}
            {quotaRetryTime && `Try again in approximately ${quotaRetryTime}.`}
            The application will automatically use the standard AI algorithm instead.
            <Button
              variant="link"
              size="sm"
              className="text-yellow-700 underline p-0 h-auto"
              onClick={checkOpenAIQuota}
            >
              Check again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {sharedPreferences && (
        <SharedPreferencesAlert
          preferences={sharedPreferences}
          onApply={applySharedPreferences}
          onDismiss={dismissSharedPreferences}
        />
      )}

      <Tabs defaultValue="suggested" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="suggested">Suggested</TabsTrigger>
            <TabsTrigger value="saved" className="relative">
              Saved
              {savedOutfitsCount > 0 && (
                <Badge className="ml-1 bg-pink-100 text-pink-800 absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full">
                  {savedOutfitsCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Quick generate button for desktop */}
          <div className="hidden md:block">
            <Button
              onClick={() =>
                handleGenerateOutfits({
                  occasion: "casual",
                  season: "current",
                  style: "balanced",
                  colorfulness: [50],
                  useWeather: true,
                  includeAccessories: true,
                  useAI,
                  useGrok,
                  useOpenAI,
                  preferredModel,
                })
              }
              disabled={isGenerating}
              className={getButtonStyle()}
            >
              {isGenerating ? (
                "Generating..."
              ) : (
                <>
                  {getButtonIcon()}
                  Quick Generate
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile preferences button */}
        <div className="lg:hidden mt-6 flex space-x-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex-1 flex items-center justify-center">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Preferences
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85%] sm:w-[350px] pt-6">
              <div className="h-full overflow-y-auto pb-8">
                <OutfitPreferences
                  onGenerateOutfits={handleGenerateOutfits}
                  isGenerating={isGenerating}
                  initialUseAI={useAI}
                  initialUseGrok={useGrok}
                  initialUseOpenAI={useOpenAI}
                  onUseAIChange={setUseAI}
                  onUseGrokChange={setUseGrok}
                  onUseOpenAIChange={setUseOpenAI}
                  initialPreferences={{
                    ...sharedPreferences,
                    preferredModel,
                  }}
                  modelStatus={modelStatus}
                />
              </div>
            </SheetContent>
          </Sheet>

          {/* Quick generate button for mobile */}
          <Button
            onClick={() =>
              handleGenerateOutfits({
                occasion: "casual",
                season: "current",
                style: "balanced",
                colorfulness: [50],
                useWeather: true,
                includeAccessories: true,
                useAI,
                useGrok,
                useOpenAI,
                preferredModel,
              })
            }
            disabled={isGenerating}
            className={`flex-1 ${getButtonStyle()}`}
          >
            {isGenerating ? (
              "Generating..."
            ) : (
              <>
                {getButtonIcon()}
                Generate
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr] mt-6">
          {/* Desktop preferences - hidden on mobile */}
          <div className="hidden lg:block">
            <OutfitPreferences
              onGenerateOutfits={handleGenerateOutfits}
              isGenerating={isGenerating}
              initialUseAI={useAI}
              initialUseGrok={useGrok}
              initialUseOpenAI={useOpenAI}
              onUseAIChange={setUseAI}
              onUseGrokChange={setUseGrok}
              onUseOpenAIChange={setUseOpenAI}
              initialPreferences={{
                ...sharedPreferences,
                preferredModel,
              }}
              modelStatus={modelStatus}
            />
          </div>

          <div>
            <TabsContent value="suggested" className="mt-0">
              <OutfitGenerator
                outfits={outfits}
                setOutfits={setOutfits}
                isGenerating={isGenerating}
                useAI={useAI}
                useGrok={useGrok}
                useOpenAI={useOpenAI}
              />
            </TabsContent>

            <TabsContent value="saved" className="mt-0">
              <SavedOutfits />
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <h3 className="text-lg font-medium mb-2">Outfit History</h3>
                <p className="text-gray-500">Your outfit history will appear here.</p>
              </div>
            </TabsContent>
          </div>
        </div>
      </Tabs>

      {/* Outfit Details Modal */}
      {selectedOutfit && (
        <OutfitDetailsModal
          outfit={selectedOutfit}
          open={showDetailsModal}
          onOpenChange={setShowDetailsModal}
          onSaveToggle={handleSaveToggle}
          userWardrobe={userWardrobe}
        />
      )}
    </div>
  )
}
