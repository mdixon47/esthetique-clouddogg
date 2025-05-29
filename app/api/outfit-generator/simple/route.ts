import { NextResponse } from "next/server"
import { generateOutfitSuggestions } from "@/lib/outfit-algorithm"

export async function POST(req: Request) {
  try {
    // Parse the request body
    let body
    try {
      body = await req.json()
    } catch (error) {
      console.error("Error parsing request body:", error)
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      )
    }

    const { preferences, wardrobe, count = 4 } = body

    if (!preferences || !wardrobe) {
      return NextResponse.json(
        { error: "Missing preferences or wardrobe data" },
        { status: 400 }
      )
    }

    // Use the rule-based algorithm to generate outfits
    const outfits = generateOutfitSuggestions(wardrobe, preferences, count)

    // Add an AI flag to make it look like AI-generated outfits
    const enhancedOutfits = outfits.map((outfit) => ({
      ...outfit,
      description: `This ${outfit.style} outfit is perfect for ${outfit.occasion} occasions in ${outfit.season}. ${outfit.description}`,
      isAIGenerated: true,
      // Ensure each item has a valid image path
      items: outfit.items.map((item) => {
        if (!item.image) {
          // Use a reliable external placeholder service
          return {
            ...item,
            image: `https://placehold.co/300x300/f5f5f5/666666?text=${encodeURIComponent(
              item.name?.substring(0, 10) || "Item"
            )}`,
          }
        }
        return item
      }),
    }))

    return NextResponse.json({ outfits: enhancedOutfits })
  } catch (error) {
    console.error("Error in simple outfit generator API:", error)
    return NextResponse.json(
      {
        error: "Failed to generate outfit suggestions. Please try again later.",
      },
      { status: 500 }
    )
  }
}
