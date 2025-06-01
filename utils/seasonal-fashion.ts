// Types for seasonal fashion recommendations
export interface SeasonalInfo {
  currentSeason: Season
  nextSeason: Season
  hemisphere: Hemisphere
  weatherDescription: string
  seasonProgress: number // 0-1 representing how far into the season we are
}

export type Season = "spring" | "summer" | "fall" | "winter"
export type Hemisphere = "northern" | "southern"

// Seasonal clothing recommendations
export interface SeasonalRecommendations {
  essentialItems: string[]
  trendingItems: string[]
  colorsToWear: string[]
  fabricsToWear: string[]
  layeringTips: string[]
  occasionOutfits: Record<string, string>
  transitionTips: string[]
}

/**
 * Determines the current season based on the date
 * Optionally takes a hemisphere parameter (defaults to northern)
 */
export function getCurrentSeason(
  date = new Date(),
  hemisphere: Hemisphere = "northern"
): SeasonalInfo {
  const month = date.getMonth() // 0-11
  const day = date.getDate() // 1-31

  // Adjust seasons based on hemisphere
  if (hemisphere === "northern") {
    // Northern Hemisphere seasons
    if (
      (month === 2 && day >= 20) ||
      month === 3 ||
      month === 4 ||
      (month === 5 && day < 21)
    ) {
      return createSeasonalInfo("spring", "summer", hemisphere, month, day)
    } else if (
      (month === 5 && day >= 21) ||
      month === 6 ||
      month === 7 ||
      (month === 8 && day < 22)
    ) {
      return createSeasonalInfo("summer", "fall", hemisphere, month, day)
    } else if (
      (month === 8 && day >= 22) ||
      month === 9 ||
      month === 10 ||
      (month === 11 && day < 21)
    ) {
      return createSeasonalInfo("fall", "winter", hemisphere, month, day)
    } else {
      return createSeasonalInfo("winter", "spring", hemisphere, month, day)
    }
  } else {
    // Southern Hemisphere seasons (reversed)
    if (
      (month === 2 && day >= 20) ||
      month === 3 ||
      month === 4 ||
      (month === 5 && day < 21)
    ) {
      return createSeasonalInfo("fall", "winter", hemisphere, month, day)
    } else if (
      (month === 5 && day >= 21) ||
      month === 6 ||
      month === 7 ||
      (month === 8 && day < 22)
    ) {
      return createSeasonalInfo("winter", "spring", hemisphere, month, day)
    } else if (
      (month === 8 && day >= 22) ||
      month === 9 ||
      month === 10 ||
      (month === 11 && day < 21)
    ) {
      return createSeasonalInfo("spring", "summer", hemisphere, month, day)
    } else {
      return createSeasonalInfo("summer", "fall", hemisphere, month, day)
    }
  }
}

/**
 * Creates a seasonal info object with weather description and season progress
 */
function createSeasonalInfo(
  currentSeason: Season,
  nextSeason: Season,
  hemisphere: Hemisphere,
  month: number,
  day: number
): SeasonalInfo {
  // Calculate season progress (0-1)
  let seasonProgress = 0

  // Each season is roughly 3 months
  const monthInSeason = month % 3
  seasonProgress = (monthInSeason * 30 + day) / 90

  // Ensure it's between 0-1
  seasonProgress = Math.max(0, Math.min(1, seasonProgress))

  // Generate weather description based on season and progress
  let weatherDescription = ""

  if (currentSeason === "spring") {
    if (seasonProgress < 0.33) {
      weatherDescription =
        "early spring, still chilly with occasional warm days"
    } else if (seasonProgress < 0.66) {
      weatherDescription = "mid-spring, mild temperatures with occasional rain"
    } else {
      weatherDescription = "late spring, warming up with longer days"
    }
  } else if (currentSeason === "summer") {
    if (seasonProgress < 0.33) {
      weatherDescription = "early summer, warm with occasional hot days"
    } else if (seasonProgress < 0.66) {
      weatherDescription = "mid-summer, hot and sunny"
    } else {
      weatherDescription = "late summer, hot with hints of fall approaching"
    }
  } else if (currentSeason === "fall") {
    if (seasonProgress < 0.33) {
      weatherDescription = "early fall, cooling down with occasional warm days"
    } else if (seasonProgress < 0.66) {
      weatherDescription = "mid-fall, cool and crisp with changing leaves"
    } else {
      weatherDescription = "late fall, getting colder with possible frost"
    }
  } else {
    if (seasonProgress < 0.33) {
      weatherDescription = "early winter, cold with possible snow"
    } else if (seasonProgress < 0.66) {
      weatherDescription = "mid-winter, cold and often snowy"
    } else {
      weatherDescription = "late winter, still cold but with hints of spring"
    }
  }

  return {
    currentSeason,
    nextSeason,
    hemisphere,
    weatherDescription,
    seasonProgress,
  }
}

/**
 * Gets seasonal fashion recommendations based on the current season
 */
export function getSeasonalRecommendations(
  seasonalInfo: SeasonalInfo
): SeasonalRecommendations {
  const { currentSeason, nextSeason, seasonProgress } = seasonalInfo

  // Base recommendations by season
  const recommendations: Record<Season, SeasonalRecommendations> = {
    spring: {
      essentialItems: [
        "lightweight trench coat",
        "rain jacket",
        "floral dresses",
        "light cardigans",
        "cotton blouses",
        "cropped pants",
        "midi skirts",
        "light denim jacket",
        "white sneakers",
        "loafers",
      ],
      trendingItems: [
        "pastel blazers",
        "statement sleeves",
        "gingham patterns",
        "lightweight jumpsuits",
        "espadrilles",
        "straw bags",
        "cropped jackets",
        "printed scarves",
      ],
      colorsToWear: [
        "pastel pink",
        "light blue",
        "mint green",
        "lavender",
        "yellow",
        "peach",
        "sage green",
      ],
      fabricsToWear: [
        "cotton",
        "linen",
        "light denim",
        "chiffon",
        "lightweight wool",
      ],
      layeringTips: [
        "Layer a light cardigan over a t-shirt for unpredictable temperatures",
        "Keep a lightweight scarf handy for windy days",
        "A denim jacket works over almost any spring outfit",
        "Try a light blazer over a floral dress for a polished look",
      ],
      occasionOutfits: {
        casual: "Jeans, a light cotton top, and white sneakers",
        work: "A midi skirt with a light blouse and cardigan",
        "date night": "A floral dress with a denim jacket and ankle boots",
        outdoor: "Cropped pants, a breathable top, and comfortable shoes",
      },
      transitionTips: [
        "Start incorporating summer colors while keeping light layers handy",
        "Transition to lighter fabrics but keep a cardigan for cooler evenings",
        "Switch to open-toe shoes on warmer days",
        "Begin incorporating more summer prints like florals and tropical patterns",
      ],
    },
    summer: {
      essentialItems: [
        "sundresses",
        "shorts",
        "linen pants",
        "tank tops",
        "swimwear",
        "sandals",
        "wide-brim hats",
        "sunglasses",
        "lightweight button-ups",
        "breathable skirts",
      ],
      trendingItems: [
        "crochet tops",
        "linen sets",
        "oversized shirts",
        "platform sandals",
        "bucket hats",
        "cut-out dresses",
        "bermuda shorts",
        "raffia accessories",
      ],
      colorsToWear: [
        "bright yellow",
        "coral",
        "turquoise",
        "hot pink",
        "lime green",
        "sky blue",
        "crisp white",
      ],
      fabricsToWear: [
        "linen",
        "cotton",
        "rayon",
        "chambray",
        "lightweight jersey",
      ],
      layeringTips: [
        "Keep a light cardigan for overly air-conditioned spaces",
        "A linen button-up can be worn open over a tank top",
        "Use lightweight scarves for sun protection and style",
        "A thin cotton sweater works for cool summer evenings",
      ],
      occasionOutfits: {
        casual: "Shorts, a breathable t-shirt, and sandals",
        work: "A lightweight dress with flat sandals or loafers",
        "date night": "A breezy sundress with wedge sandals",
        beach: "Swimwear with a stylish cover-up and flip-flops",
      },
      transitionTips: [
        "Start incorporating fall colors like burgundy and olive",
        "Layer summer dresses with light cardigans or denim jackets",
        "Switch to closed-toe shoes on cooler days",
        "Add light scarves to summer outfits",
      ],
    },
    fall: {
      essentialItems: [
        "sweaters",
        "cardigans",
        "ankle boots",
        "jeans",
        "leather jacket",
        "trench coat",
        "scarves",
        "flannel shirts",
        "corduroy pants",
        "suede skirts",
      ],
      trendingItems: [
        "oversized blazers",
        "chunky loafers",
        "leather pants",
        "shackets (shirt jackets)",
        "sweater vests",
        "knee-high boots",
        "plaid patterns",
        "statement collars",
      ],
      colorsToWear: [
        "burgundy",
        "mustard yellow",
        "olive green",
        "rust orange",
        "camel",
        "navy blue",
        "deep purple",
      ],
      fabricsToWear: [
        "wool",
        "cashmere",
        "corduroy",
        "leather",
        "suede",
        "flannel",
        "denim",
      ],
      layeringTips: [
        "Layer a turtleneck under a cardigan or sweater",
        "Wear a thin sweater under a blazer for extra warmth",
        "Add tights under skirts and dresses",
        "Try layering multiple thin pieces rather than one bulky item",
      ],
      occasionOutfits: {
        casual: "Jeans, a sweater, and ankle boots",
        work: "Wool pants, a blouse, and a blazer",
        "date night": "A sweater dress with knee-high boots",
        outdoor: "Jeans, a flannel shirt, and a light jacket",
      },
      transitionTips: [
        "Start incorporating heavier fabrics and winter accessories",
        "Layer with thermal pieces under your regular clothes",
        "Switch to waterproof boots for rainy or snowy days",
        "Add heavier coats to your fall outfits as temperatures drop",
      ],
    },
    winter: {
      essentialItems: [
        "heavy coat",
        "puffer jacket",
        "wool sweaters",
        "thermal layers",
        "boots",
        "gloves",
        "beanies",
        "scarves",
        "wool pants",
        "thick tights",
      ],
      trendingItems: [
        "teddy coats",
        "chunky knit sweaters",
        "faux fur accessories",
        "combat boots",
        "puffer vests",
        "leather gloves",
        "statement scarves",
        "velvet pieces",
      ],
      colorsToWear: [
        "black",
        "charcoal gray",
        "forest green",
        "burgundy",
        "navy blue",
        "cream",
        "deep red",
      ],
      fabricsToWear: [
        "wool",
        "cashmere",
        "fleece",
        "velvet",
        "corduroy",
        "leather",
        "down",
      ],
      layeringTips: [
        "Start with a thermal or heat-tech base layer",
        "Add a sweater or cardigan as your middle layer",
        "Finish with a heavy coat or jacket",
        "Don't forget accessories like scarves, gloves, and hats",
      ],
      occasionOutfits: {
        casual: "Jeans, a sweater, boots, and a puffer jacket",
        work: "Wool pants, a turtleneck, a blazer, and a wool coat",
        "date night": "A sweater dress, tights, boots, and a stylish coat",
        outdoor:
          "Thermal layers, a heavy coat, waterproof boots, and winter accessories",
      },
      transitionTips: [
        "Start incorporating lighter layers as temperatures rise",
        "Switch heavy coats for lighter jackets",
        "Begin incorporating spring colors into your winter wardrobe",
        "Transition to lighter knits and fewer layers",
      ],
    },
  }

  // Get base recommendations for the current season
  const baseRecommendations = recommendations[currentSeason]

  // If we're late in the season (>75%), start incorporating some next season recommendations
  if (seasonProgress > 0.75) {
    const nextSeasonRecs = recommendations[nextSeason]

    // Blend some recommendations from the next season
    return {
      ...baseRecommendations,
      trendingItems: [
        ...baseRecommendations.trendingItems.slice(0, 5),
        ...nextSeasonRecs.trendingItems.slice(0, 3),
      ],
      transitionTips: nextSeasonRecs.transitionTips,
    }
  }

  return baseRecommendations
}

/**
 * Gets seasonal advice for a specific clothing item
 */
export function getSeasonalAdviceForClothing(
  clothingItem: string,
  clothingCategory: string,
  seasonalInfo: SeasonalInfo
): string {
  const { currentSeason, weatherDescription, seasonProgress } = seasonalInfo
  const recommendations = getSeasonalRecommendations(seasonalInfo)

  // Check if the item is in the essential or trending items for the season
  const isEssential = recommendations.essentialItems.some((item) =>
    clothingItem.toLowerCase().includes(item.toLowerCase())
  )

  const isTrending = recommendations.trendingItems.some((item) =>
    clothingItem.toLowerCase().includes(item.toLowerCase())
  )

  // Generate seasonal advice based on the clothing category and current season
  let advice = ""

  if (isEssential) {
    advice += `A ${clothingItem} is perfect for ${currentSeason}! It's one of the essential items for this season. `
  } else if (isTrending) {
    advice += `A ${clothingItem} is very trendy this ${currentSeason}! It's a great choice. `
  }

  // Add category-specific seasonal advice
  switch (clothingCategory) {
    case "tops":
      if (currentSeason === "spring") {
        advice += `For ${weatherDescription}, this top would pair well with a light jacket or cardigan for layering. `
      } else if (currentSeason === "summer") {
        advice += `This is perfect for ${weatherDescription}. You could pair it with shorts or a light skirt. `
      } else if (currentSeason === "fall") {
        advice += `For ${weatherDescription}, layer this top under a cardigan or light jacket. `
      } else {
        advice += `For ${weatherDescription}, you'll want to layer this under a warm sweater or jacket. `
      }
      break

    case "bottoms":
      if (currentSeason === "spring") {
        advice += `These are great for ${weatherDescription}. Pair with a light top and maybe a denim jacket. `
      } else if (currentSeason === "summer") {
        advice += `These are perfect for ${weatherDescription}. Pair with a breathable top to stay cool. `
      } else if (currentSeason === "fall") {
        advice += `These work well for ${weatherDescription}. Try pairing with ankle boots and a sweater. `
      } else {
        advice += `For ${weatherDescription}, pair these with thermal layers underneath for extra warmth. `
      }
      break

    case "dresses":
      if (currentSeason === "spring") {
        advice += `This dress is perfect for ${weatherDescription}. Add a light cardigan for cooler days. `
      } else if (currentSeason === "summer") {
        advice += `This dress is ideal for ${weatherDescription}. Pair with sandals and a sun hat. `
      } else if (currentSeason === "fall") {
        advice += `For ${weatherDescription}, layer this dress with tights and a cardigan or jacket. `
      } else {
        advice += `For ${weatherDescription}, you could layer this dress with thick tights, boots, and a warm coat. `
      }
      break

    case "outerwear":
      if (currentSeason === "spring") {
        advice += `This is perfect for ${weatherDescription} when you need light protection from the elements. `
      } else if (currentSeason === "summer") {
        advice += `This might be too warm for ${weatherDescription}, but could be useful for cool evenings or air-conditioned spaces. `
      } else if (currentSeason === "fall") {
        advice += `This is ideal for ${weatherDescription}. It provides the right amount of warmth for autumn. `
      } else {
        advice += `For ${weatherDescription}, check if this provides enough warmth or if you'll need additional layers. `
      }
      break

    case "footwear":
      if (currentSeason === "spring") {
        advice += `These are great for ${weatherDescription}. Versatile for both sunny days and spring showers. `
      } else if (currentSeason === "summer") {
        advice += `These are perfect for ${weatherDescription}. They'll keep your feet cool and comfortable. `
      } else if (currentSeason === "fall") {
        advice += `These work well for ${weatherDescription}. They'll pair nicely with jeans or trousers. `
      } else {
        advice += `For ${weatherDescription}, make sure these provide enough warmth and protection from the elements. `
      }
      break

    default:
      if (currentSeason === "spring") {
        advice += `This is a nice choice for ${currentSeason}. It works well with the ${weatherDescription}. `
      } else if (currentSeason === "summer") {
        advice += `This is a good option for ${currentSeason}, especially with the ${weatherDescription}. `
      } else if (currentSeason === "fall") {
        advice += `This fits well with ${currentSeason} style, perfect for the ${weatherDescription}. `
      } else {
        advice += `This can work for ${currentSeason}, but make sure it's appropriate for the ${weatherDescription}. `
      }
  }

  // Add color advice if applicable
  const seasonalColors = recommendations.colorsToWear
  const colorAdvice = `Popular colors this ${currentSeason} include ${seasonalColors
    .slice(0, 3)
    .join(", ")}, which would complement this item nicely.`

  // Add transition advice if we're late in the season
  if (seasonProgress > 0.7) {
    const transitionTip =
      recommendations.transitionTips[
        Math.floor(Math.random() * recommendations.transitionTips.length)
      ]
    advice += `As we're moving toward ${
      seasonalInfo.nextSeason
    }, ${transitionTip.toLowerCase()} `
  }

  return advice + " " + colorAdvice
}
