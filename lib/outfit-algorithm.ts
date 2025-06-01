// Types for clothing items and outfits
export interface ClothingItem {
  id: number
  name: string
  category: string
  subcategory: string
  colors: string[]
  seasons: string[]
  occasions: string[]
  image: string
}

export interface OutfitPreference {
  occasion: string
  season: string
  style: string
  colorfulness: number
  useWeather: boolean
  includeAccessories: boolean
  weather?: {
    temperature: number
    condition: string
  }
}

export interface OutfitSuggestion {
  id: number
  name: string
  occasion: string
  style: string
  season: string
  items: ClothingItem[]
  weather: string
  description: string
  score: number
}

// Color compatibility rules
const colorCompatibility = {
  // Monochromatic
  monochromatic: (colors: string[]) => {
    // Check if all colors are the same or shades of black/white/gray
    const neutralColors = ["Black", "White", "Gray", "Beige"]
    const uniqueColors = [
      ...new Set(colors.filter((c) => !neutralColors.includes(c))),
    ]
    return uniqueColors.length <= 1
  },

  // Complementary colors
  complementary: (colors: string[]) => {
    const complementaryPairs = [
      ["Red", "Green"],
      ["Blue", "Orange"],
      ["Yellow", "Purple"],
      ["Pink", "Green"],
    ]

    for (const pair of complementaryPairs) {
      if (colors.includes(pair[0]) && colors.includes(pair[1])) {
        return true
      }
    }
    return false
  },

  // Analogous colors (colors that are next to each other on the color wheel)
  analogous: (colors: string[]) => {
    const colorWheel = [
      "Red",
      "Orange",
      "Yellow",
      "Green",
      "Blue",
      "Purple",
      "Pink",
    ]
    const uniqueColors = [
      ...new Set(colors.filter((c) => colorWheel.includes(c))),
    ]

    if (uniqueColors.length <= 1) return true

    // Check if colors are adjacent on the wheel
    const positions = uniqueColors
      .map((c) => colorWheel.indexOf(c))
      .sort((a, b) => a - b)
    for (let i = 1; i < positions.length; i++) {
      if (
        positions[i] - positions[i - 1] > 1 &&
        !(positions[i - 1] === 0 && positions[i] === colorWheel.length - 1)
      ) {
        return false
      }
    }
    return true
  },
}

// Season compatibility
const isSeasonCompatible = (
  itemSeasons: string[],
  targetSeason: string
): boolean => {
  if (targetSeason === "current") {
    // In a real app, determine the current season based on date or location
    const currentSeason = "Summer" // Example
    return itemSeasons.includes(currentSeason)
  }
  return itemSeasons.includes(targetSeason)
}

// Occasion compatibility
const isOccasionCompatible = (
  itemOccasions: string[],
  targetOccasion: string
): boolean => {
  // Map the target occasion to relevant item occasions
  const occasionMap: Record<string, string[]> = {
    casual: ["Casual", "Sport"],
    work: ["Work", "Formal"],
    formal: ["Formal"],
    date: ["Party", "Casual", "Formal"],
    sport: ["Sport", "Casual"],
    lounge: ["Casual"],
  }

  const relevantOccasions = occasionMap[targetOccasion] || [targetOccasion]
  return itemOccasions.some((o) => relevantOccasions.includes(o))
}

// Weather compatibility
const isWeatherCompatible = (
  itemSeasons: string[],
  weather: { temperature: number; condition: string }
): boolean => {
  // Simple weather compatibility based on temperature
  if (weather.temperature < 40) {
    return itemSeasons.includes("Winter")
  } else if (weather.temperature < 60) {
    return itemSeasons.includes("Fall") || itemSeasons.includes("Spring")
  } else {
    return itemSeasons.includes("Summer")
  }
}

// Main outfit generation algorithm
export function generateOutfitSuggestions(
  wardrobe: ClothingItem[],
  preferences: OutfitPreference,
  count = 5
): OutfitSuggestion[] {
  // Filter items by season and occasion
  const filteredItems = wardrobe.filter(
    (item) =>
      isSeasonCompatible(item.seasons, preferences.season) &&
      isOccasionCompatible(item.occasions, preferences.occasion)
  )

  // Group items by category
  const itemsByCategory: Record<string, ClothingItem[]> = {}
  filteredItems.forEach((item) => {
    if (!itemsByCategory[item.category]) {
      itemsByCategory[item.category] = []
    }
    itemsByCategory[item.category].push(item)
  })

  // Generate outfit combinations
  const outfits: OutfitSuggestion[] = []
  const essentialCategories = ["Tops", "Bottoms", "Shoes"]
  const optionalCategories = ["Outerwear", "Accessories"]

  // Limit the number of combinations to avoid performance issues
  const maxCombinations = 100
  let combinationCount = 0

  // Try to create outfits with essential categories
  if (
    itemsByCategory["Tops"]?.length &&
    itemsByCategory["Bottoms"]?.length &&
    itemsByCategory["Shoes"]?.length
  ) {
    for (const top of itemsByCategory["Tops"]) {
      if (combinationCount >= maxCombinations) break

      for (const bottom of itemsByCategory["Bottoms"]) {
        if (combinationCount >= maxCombinations) break

        for (const shoe of itemsByCategory["Shoes"]) {
          if (combinationCount >= maxCombinations) break
          combinationCount++

          // Check if colors are compatible
          const outfitColors = [...top.colors, ...bottom.colors, ...shoe.colors]
          const colorScore = colorCompatibility.monochromatic(outfitColors)
            ? 3
            : colorCompatibility.analogous(outfitColors)
            ? 2
            : colorCompatibility.complementary(outfitColors)
            ? 1
            : 0

          // Calculate outfit score based on various factors
          let score = colorScore

          // Add weather score if enabled
          if (preferences.useWeather && preferences.weather) {
            score += isWeatherCompatible(top.seasons, preferences.weather)
              ? 1
              : 0
            score += isWeatherCompatible(bottom.seasons, preferences.weather)
              ? 1
              : 0
          }

          // Create basic outfit
          const outfitItems = [top, bottom, shoe]

          // Add outerwear if appropriate for the season/weather
          if (
            preferences.season === "fall" ||
            preferences.season === "winter" ||
            (preferences.weather && preferences.weather.temperature < 65)
          ) {
            const outerwear =
              itemsByCategory["Outerwear"]?.[
                Math.floor(Math.random() * itemsByCategory["Outerwear"].length)
              ]
            if (outerwear) {
              outfitItems.push(outerwear)
              score += 1 // Bonus for complete outfit with outerwear when needed
            }
          }

          // Add accessories if requested
          if (
            preferences.includeAccessories &&
            itemsByCategory["Accessories"]?.length
          ) {
            const accessory =
              itemsByCategory["Accessories"][
                Math.floor(
                  Math.random() * itemsByCategory["Accessories"].length
                )
              ]
            if (accessory) {
              outfitItems.push(accessory)
            }
          }

          // Generate outfit name and description
          const outfitName = generateOutfitName(outfitItems, preferences)
          const outfitDescription = generateOutfitDescription(
            outfitItems,
            preferences
          )

          // Create outfit suggestion
          outfits.push({
            id: Date.now() + combinationCount,
            name: outfitName,
            occasion: preferences.occasion,
            style: preferences.style,
            season: preferences.season,
            items: outfitItems,
            weather: generateWeatherDescription(preferences),
            description: outfitDescription,
            score,
          })
        }
      }
    }
  }

  // Also handle dresses as a special case (they replace top+bottom)
  if (itemsByCategory["Dresses"]?.length && itemsByCategory["Shoes"]?.length) {
    for (const dress of itemsByCategory["Dresses"]) {
      if (combinationCount >= maxCombinations) break

      for (const shoe of itemsByCategory["Shoes"]) {
        if (combinationCount >= maxCombinations) break
        combinationCount++

        // Check color compatibility
        const outfitColors = [...dress.colors, ...shoe.colors]
        const colorScore = colorCompatibility.monochromatic(outfitColors)
          ? 3
          : colorCompatibility.analogous(outfitColors)
          ? 2
          : colorCompatibility.complementary(outfitColors)
          ? 1
          : 0

        // Calculate outfit score
        let score = colorScore + 1 // Bonus for dress (simpler outfit)

        // Create outfit items
        const outfitItems = [dress, shoe]

        // Add outerwear if appropriate
        if (
          preferences.season === "fall" ||
          preferences.season === "winter" ||
          (preferences.weather && preferences.weather.temperature < 65)
        ) {
          const outerwear =
            itemsByCategory["Outerwear"]?.[
              Math.floor(Math.random() * itemsByCategory["Outerwear"].length)
            ]
          if (outerwear) {
            outfitItems.push(outerwear)
            score += 1
          }
        }

        // Add accessories if requested
        if (
          preferences.includeAccessories &&
          itemsByCategory["Accessories"]?.length
        ) {
          const accessory =
            itemsByCategory["Accessories"][
              Math.floor(Math.random() * itemsByCategory["Accessories"].length)
            ]
          if (accessory) {
            outfitItems.push(accessory)
          }
        }

        // Generate outfit details
        const outfitName = generateOutfitName(outfitItems, preferences)
        const outfitDescription = generateOutfitDescription(
          outfitItems,
          preferences
        )

        // Create outfit suggestion
        outfits.push({
          id: Date.now() + combinationCount + 1000,
          name: outfitName,
          occasion: preferences.occasion,
          style: preferences.style,
          season: preferences.season,
          items: outfitItems,
          weather: generateWeatherDescription(preferences),
          description: outfitDescription,
          score,
        })
      }
    }
  }

  // Sort outfits by score and return the top ones
  return outfits.sort((a, b) => b.score - a.score).slice(0, count)
}

// Helper functions for generating outfit details
function generateOutfitName(
  items: ClothingItem[],
  preferences: OutfitPreference
): string {
  const occasionNames: Record<string, string[]> = {
    casual: ["Casual", "Relaxed", "Everyday", "Weekend", "Laid-back"],
    work: ["Office", "Professional", "Business", "Work-ready", "Corporate"],
    formal: ["Elegant", "Formal", "Sophisticated", "Dressy", "Polished"],
    date: ["Date Night", "Evening", "Romantic", "Night Out", "Chic"],
    sport: ["Active", "Sporty", "Workout", "Athletic", "Fitness"],
    lounge: ["Cozy", "Loungewear", "Relaxation", "Comfort", "Stay-at-home"],
  }

  const styleNames: Record<string, string[]> = {
    classic: ["Timeless", "Classic", "Traditional", "Refined"],
    trendy: ["Trendy", "Fashion-Forward", "Modern", "Contemporary"],
    balanced: ["Balanced", "Versatile", "Adaptable", "Flexible"],
  }

  const occasionName =
    occasionNames[preferences.occasion]?.[
      Math.floor(Math.random() * occasionNames[preferences.occasion].length)
    ] || preferences.occasion
  const styleName =
    styleNames[preferences.style]?.[
      Math.floor(Math.random() * styleNames[preferences.style].length)
    ] || preferences.style

  return `${occasionName} ${styleName} Look`
}

function generateOutfitDescription(
  items: ClothingItem[],
  preferences: OutfitPreference
): string {
  const occasionDescriptions: Record<string, string[]> = {
    casual: [
      "Perfect for a relaxed day out.",
      "A comfortable outfit for everyday wear.",
      "Ideal for weekend activities and casual meetups.",
    ],
    work: [
      "Professional attire suitable for the office environment.",
      "A polished look for your workday.",
      "Business-appropriate outfit that maintains comfort.",
    ],
    formal: [
      "Elegant ensemble for special occasions.",
      "Sophisticated outfit perfect for formal events.",
      "A refined look that makes a statement.",
    ],
    date: [
      "Stylish outfit for a memorable evening out.",
      "The perfect balance of elegance and comfort for your date night.",
      "Make an impression with this carefully curated look.",
    ],
    sport: [
      "Functional attire for your active lifestyle.",
      "Performance-focused outfit that doesn't sacrifice style.",
      "Ready for any workout or casual sport activity.",
    ],
    lounge: [
      "Ultimate comfort for relaxing at home.",
      "Cozy yet put-together for lounging or quick errands.",
      "Soft fabrics and relaxed fit for maximum comfort.",
    ],
  }

  const randomDescription =
    occasionDescriptions[preferences.occasion]?.[
      Math.floor(
        Math.random() * occasionDescriptions[preferences.occasion].length
      )
    ] || "A versatile outfit for various occasions."

  // Add style-specific description
  let styleDescription = ""
  if (preferences.style === "classic") {
    styleDescription = " This timeless combination never goes out of style."
  } else if (preferences.style === "trendy") {
    styleDescription =
      " Incorporating current fashion trends for a contemporary look."
  } else {
    styleDescription = " A balanced mix of classic pieces with modern elements."
  }

  return randomDescription + styleDescription
}

function generateWeatherDescription(preferences: OutfitPreference): string {
  if (preferences.weather) {
    return `Suitable for ${preferences.weather.temperature}°F / ${preferences.weather.condition}`
  }

  const seasonWeather: Record<string, string> = {
    spring: "Suitable for 55-70°F / Mild weather",
    summer: "Suitable for 70-90°F / Warm weather",
    fall: "Suitable for 45-65°F / Cool weather",
    winter: "Suitable for 25-45°F / Cold weather",
    current: "Suitable for the current weather conditions",
  }

  return (
    seasonWeather[preferences.season] ||
    "Suitable for various weather conditions"
  )
}
