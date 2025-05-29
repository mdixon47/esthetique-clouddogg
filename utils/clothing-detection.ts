// Types for clothing detection
export interface DetectedClothing {
  item: string
  category: string
  attributes: {
    color?: string
    pattern?: string
    material?: string
    style?: string
    occasion?: string
  }
  confidence: number
}

// Comprehensive clothing database with categories
export const CLOTHING_DATABASE = {
  tops: [
    "t-shirt",
    "shirt",
    "blouse",
    "tank top",
    "crop top",
    "sweater",
    "sweatshirt",
    "hoodie",
    "cardigan",
    "tunic",
    "polo",
    "turtleneck",
    "jersey",
    "vest",
    "camisole",
    "button-up",
    "button-down",
    "flannel",
    "top",
    "tee",
  ],
  bottoms: [
    "pants",
    "jeans",
    "shorts",
    "skirt",
    "trousers",
    "leggings",
    "joggers",
    "chinos",
    "slacks",
    "culottes",
    "capris",
    "jeggings",
    "sweatpants",
    "cargo pants",
    "khakis",
    "corduroys",
    "palazzo pants",
  ],
  dresses: [
    "dress",
    "gown",
    "sundress",
    "maxi dress",
    "mini dress",
    "midi dress",
    "shift dress",
    "wrap dress",
    "bodycon dress",
    "a-line dress",
    "slip dress",
    "sheath dress",
    "cocktail dress",
    "evening dress",
    "party dress",
  ],
  outerwear: [
    "jacket",
    "coat",
    "blazer",
    "parka",
    "windbreaker",
    "raincoat",
    "trench coat",
    "peacoat",
    "overcoat",
    "bomber jacket",
    "leather jacket",
    "denim jacket",
    "puffer jacket",
    "anorak",
    "poncho",
    "cape",
  ],
  footwear: [
    "shoes",
    "boots",
    "sneakers",
    "sandals",
    "heels",
    "flats",
    "loafers",
    "oxfords",
    "pumps",
    "mules",
    "espadrilles",
    "wedges",
    "slippers",
    "flip-flops",
    "stilettos",
    "ankle boots",
    "knee-high boots",
    "running shoes",
    "athletic shoes",
  ],
  accessories: [
    "hat",
    "scarf",
    "gloves",
    "belt",
    "tie",
    "bow tie",
    "socks",
    "tights",
    "stockings",
    "jewelry",
    "necklace",
    "bracelet",
    "earrings",
    "ring",
    "watch",
    "sunglasses",
    "glasses",
    "headband",
    "hair clip",
    "purse",
    "bag",
    "backpack",
    "wallet",
    "clutch",
    "tote",
  ],
  swimwear: [
    "swimsuit",
    "bikini",
    "one-piece",
    "swim trunks",
    "board shorts",
    "tankini",
    "swim shorts",
    "rash guard",
    "wetsuit",
    "bathing suit",
  ],
  underwear: [
    "underwear",
    "bra",
    "panties",
    "boxers",
    "briefs",
    "lingerie",
    "undershirt",
    "camisole",
    "slip",
    "shapewear",
  ],
  sleepwear: [
    "pajamas",
    "nightgown",
    "robe",
    "nightshirt",
    "sleep shirt",
    "loungewear",
    "nightwear",
    "pj's",
    "nightdress",
  ],
  activewear: [
    "activewear",
    "sportswear",
    "gym clothes",
    "workout clothes",
    "yoga pants",
    "sports bra",
    "athletic shorts",
    "track pants",
    "track jacket",
    "running tights",
  ],
  suits: [
    "suit",
    "tuxedo",
    "three-piece suit",
    "two-piece suit",
    "pantsuit",
    "skirt suit",
    "formal wear",
    "business suit",
  ],
}

// Colors for detection
export const COLORS = [
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "pink",
  "orange",
  "black",
  "white",
  "gray",
  "grey",
  "brown",
  "navy",
  "teal",
  "turquoise",
  "maroon",
  "olive",
  "mint",
  "coral",
  "burgundy",
  "beige",
  "tan",
  "cream",
  "ivory",
  "gold",
  "silver",
  "bronze",
  "copper",
]

// Patterns for detection
export const PATTERNS = [
  "striped",
  "plaid",
  "checkered",
  "floral",
  "polka dot",
  "dotted",
  "paisley",
  "geometric",
  "animal print",
  "leopard",
  "zebra",
  "camouflage",
  "camo",
  "herringbone",
  "houndstooth",
  "argyle",
  "tie-dye",
  "solid",
]

// Materials for detection
export const MATERIALS = [
  "cotton",
  "polyester",
  "wool",
  "silk",
  "linen",
  "leather",
  "suede",
  "denim",
  "velvet",
  "satin",
  "chiffon",
  "lace",
  "cashmere",
  "tweed",
  "corduroy",
  "fleece",
  "nylon",
  "spandex",
  "lycra",
  "rayon",
  "acrylic",
  "jersey",
]

// Styles for detection
export const STYLES = [
  "casual",
  "formal",
  "business",
  "business casual",
  "smart casual",
  "athleisure",
  "vintage",
  "retro",
  "bohemian",
  "boho",
  "preppy",
  "classic",
  "minimalist",
  "maximalist",
  "streetwear",
  "hipster",
  "punk",
  "grunge",
  "gothic",
  "elegant",
  "chic",
  "trendy",
  "sporty",
  "athletic",
  "edgy",
  "romantic",
  "feminine",
  "masculine",
]

// Occasions for detection
export const OCCASIONS = [
  "casual",
  "formal",
  "work",
  "office",
  "business",
  "date",
  "party",
  "wedding",
  "beach",
  "vacation",
  "travel",
  "gym",
  "workout",
  "exercise",
  "outdoor",
  "everyday",
  "special occasion",
  "evening",
  "night out",
  "brunch",
  "lunch",
  "dinner",
  "interview",
  "meeting",
  "presentation",
]

/**
 * Detects clothing items and their attributes in a user message
 */
export function detectClothing(message: string): DetectedClothing[] {
  const lowerMessage = message.toLowerCase()
  const words = lowerMessage.split(/\s+/)
  const detectedItems: DetectedClothing[] = []

  // Check for multi-word clothing items first (e.g., "leather jacket")
  for (const [category, items] of Object.entries(CLOTHING_DATABASE)) {
    for (const item of items) {
      if (item.includes(" ")) {
        if (lowerMessage.includes(item)) {
          const attributes = detectAttributes(lowerMessage, item)
          detectedItems.push({
            item,
            category,
            attributes,
            confidence: 0.9, // Higher confidence for exact multi-word matches
          })
        }
      }
    }
  }

  // Then check for single-word items
  for (const word of words) {
    const cleanWord = word.replace(/[.,!?;:'"()]/g, "")

    // Skip very short words
    if (cleanWord.length < 3) continue

    for (const [category, items] of Object.entries(CLOTHING_DATABASE)) {
      for (const item of items) {
        // Skip multi-word items as we've already checked them
        if (item.includes(" ")) continue

        // Check for exact match
        if (cleanWord === item) {
          const attributes = detectAttributes(lowerMessage, item)
          detectedItems.push({
            item,
            category,
            attributes,
            confidence: 0.8, // High confidence for exact matches
          })
        }
        // Check for partial match (e.g., "shirt" in "t-shirt")
        else if (cleanWord.includes(item) || item.includes(cleanWord)) {
          // Only add if we don't already have an exact match
          if (!detectedItems.some((detected) => detected.item === item)) {
            const attributes = detectAttributes(lowerMessage, item)
            detectedItems.push({
              item,
              category,
              attributes,
              confidence: 0.6, // Medium confidence for partial matches
            })
          }
        }
        // Check for plural forms
        else if (cleanWord === `${item}s` || cleanWord === `${item}es`) {
          const attributes = detectAttributes(lowerMessage, item)
          detectedItems.push({
            item,
            category,
            attributes,
            confidence: 0.7, // High confidence for plural forms
          })
        }
      }
    }
  }

  // Remove duplicates and keep items with highest confidence
  const uniqueItems = new Map<string, DetectedClothing>()
  for (const item of detectedItems) {
    const existing = uniqueItems.get(item.item)
    if (!existing || item.confidence > existing.confidence) {
      uniqueItems.set(item.item, item)
    }
  }

  return Array.from(uniqueItems.values()).sort(
    (a, b) => b.confidence - a.confidence
  )
}

/**
 * Detects attributes of a clothing item from the message
 */
function detectAttributes(message: string) {
  const attributes: DetectedClothing["attributes"] = {}

  // Detect color
  for (const color of COLORS) {
    if (message.includes(color)) {
      attributes.color = color
      break
    }
  }

  // Detect pattern
  for (const pattern of PATTERNS) {
    if (message.includes(pattern)) {
      attributes.pattern = pattern
      break
    }
  }

  // Detect material
  for (const material of MATERIALS) {
    if (message.includes(material)) {
      attributes.material = material
      break
    }
  }

  // Detect style
  for (const style of STYLES) {
    if (message.includes(style)) {
      attributes.style = style
      break
    }
  }

  // Detect occasion
  for (const occasion of OCCASIONS) {
    if (message.includes(occasion)) {
      attributes.occasion = occasion
      break
    }
  }

  return attributes
}

/**
 * Formats a clothing item with its attributes for natural language
 */
export function formatClothingWithAttributes(
  clothing: DetectedClothing
): string {
  const { item, attributes } = clothing
  const parts: string[] = []

  if (attributes.color) parts.push(attributes.color)
  if (attributes.pattern) parts.push(attributes.pattern)
  if (attributes.material) parts.push(attributes.material)

  parts.push(item)

  return parts.join(" ")
}

/**
 * Gets a contextual response based on detected clothing
 */
export function getClothingResponse(detectedItems: DetectedClothing[]): string {
  if (detectedItems.length === 0) {
    return "I'd be happy to help with your fashion needs. Could you tell me more about what you're looking for?"
  }

  const item = detectedItems[0] // Use the highest confidence item
  const formattedItem = formatClothingWithAttributes(item)

  // Responses based on category
  const categoryResponses = {
    tops: [
      `That ${formattedItem} would be a great addition to your wardrobe! It's versatile and can be paired with different bottoms.`,
      `The ${formattedItem} is a great choice. Would you like some styling tips for it?`,
      `I think the ${formattedItem} would look fantastic on you. It's perfect for layering or wearing on its own.`,
    ],
    bottoms: [
      `The ${formattedItem} would be a great choice! They're versatile and can be styled in many ways.`,
      `I love ${formattedItem}! They're comfortable yet stylish, and work for many occasions.`,
      `${
        formattedItem.charAt(0).toUpperCase() + formattedItem.slice(1)
      } are a wardrobe essential. Would you like to see how they look with different tops?`,
    ],
    dresses: [
      `That ${formattedItem} would be perfect! It's a versatile piece that can be dressed up or down.`,
      `The ${formattedItem} is a great choice for various occasions. Would you like to try it on?`,
      `I think you'd look amazing in that ${formattedItem}! It's flattering and stylish.`,
    ],
    outerwear: [
      `A ${formattedItem} is a great investment piece. It can elevate any outfit and keep you warm.`,
      `The ${formattedItem} would be perfect for layering over your outfits. Would you like to see how it looks?`,
      `I think the ${formattedItem} would complement your style nicely. It's both functional and fashionable.`,
    ],
    footwear: [
      `Those ${formattedItem} would complete your outfit perfectly! They're stylish and practical.`,
      `The ${formattedItem} are a great choice. They can be paired with various outfits.`,
      `I think you'd love those ${formattedItem}! They're comfortable yet stylish.`,
    ],
    accessories: [
      `That ${formattedItem} would be the perfect finishing touch to your outfit!`,
      `The ${formattedItem} is a great way to elevate your look. It adds personality and style.`,
      `I think the ${formattedItem} would complement your outfit beautifully. It's all about the details!`,
    ],
  }

  // Get responses for the category or use generic responses
  const responses = categoryResponses[
    item.category as keyof typeof categoryResponses
  ] || [
    `The ${formattedItem} is a great choice! Would you like to try it on?`,
    `I think the ${formattedItem} would suit you well. It's a versatile piece.`,
    `That ${formattedItem} is trending this season. It would be a great addition to your wardrobe!`,
  ]

  // Add occasion-specific responses if detected
  if (item.attributes.occasion) {
    responses.push(
      `The ${formattedItem} would be perfect for ${item.attributes.occasion} occasions!`,
      `For ${item.attributes.occasion} events, the ${formattedItem} is an excellent choice.`
    )
  }

  // Add style-specific responses if detected
  if (item.attributes.style) {
    responses.push(
      `The ${formattedItem} has a great ${item.attributes.style} vibe that would suit your style.`,
      `If you're going for a ${item.attributes.style} look, the ${formattedItem} is perfect.`
    )
  }

  // Return a random response from the available options
  return responses[Math.floor(Math.random() * responses.length)]
}
