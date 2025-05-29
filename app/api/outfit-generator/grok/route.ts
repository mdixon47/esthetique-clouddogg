import { NextResponse } from "next/server"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"
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

    // Check if XAI_API_KEY is available
    if (!process.env.XAI_API_KEY) {
      console.log("Grok API key not found, using rule-based algorithm")
      // Fall back to the rule-based algorithm
      const outfits = generateOutfitSuggestions(wardrobe, preferences, count)
      return NextResponse.json({ outfits })
    }

    try {
      // Format wardrobe items for the prompt
      const wardrobeDescription = wardrobe
        .map(
          (item) =>
            `- ${item.name} (${item.category}, Colors: ${item.colors.join(
              ", "
            )}, Seasons: ${item.seasons.join(
              ", "
            )}, Occasions: ${item.occasions.join(", ")})`
        )
        .join("\n")

      // Create a detailed prompt for Grok
      const prompt = `Generate ${count} creative and stylish outfit suggestions based on the following preferences and wardrobe items.

Preferences:
- Occasion: ${preferences.occasion}
- Season: ${preferences.season}
- Style: ${preferences.style}
- Colorfulness: ${preferences.colorfulness} (0-100 scale)
- Weather considerations: ${preferences.useWeather ? "Yes" : "No"}
- Include accessories: ${preferences.includeAccessories ? "Yes" : "No"}
${
  preferences.weather
    ? `- Current weather: ${preferences.weather.temperature}°F, ${preferences.weather.condition}`
    : ""
}

Available wardrobe items:
${wardrobeDescription}

For each outfit, provide:
1. A creative and catchy name for the outfit
2. The occasion it's suitable for
3. The style category
4. The season it's appropriate for
5. A list of wardrobe items to include (only use items from the available wardrobe)
6. A weather suitability description
7. A detailed styling description with fashion-forward advice
8. A confidence score (1-5) indicating how well the outfit matches the preferences

IMPORTANT: Return ONLY a raw JSON array of outfit objects without any markdown formatting, code blocks, or explanations. The response should be valid JSON that can be directly parsed.`

      // Call Grok API using AI SDK with the correct model name
      const { text } = await generateText({
        model: xai("grok-2"),
        prompt: prompt,
        maxTokens: 2000,
      })

      // Parse the JSON response, handling potential markdown formatting
      let outfits
      try {
        // Extract JSON from potential markdown code blocks
        let jsonText = text

        // Check if the response is wrapped in markdown code blocks
        const jsonBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
        if (jsonBlockMatch && jsonBlockMatch[1]) {
          jsonText = jsonBlockMatch[1].trim()
        }

        // Try to parse the extracted JSON
        outfits = JSON.parse(jsonText)

        // If outfits is not an array or is empty, fall back to rule-based
        if (!Array.isArray(outfits) || outfits.length === 0) {
          throw new Error("Invalid outfits format in response")
        }

        // Ensure each outfit has the required properties and format
        outfits = outfits.map((outfit, index) => ({
          id: Date.now() + index,
          name: outfit.name || `Outfit ${index + 1}`,
          occasion: outfit.occasion || preferences.occasion,
          style: outfit.style || preferences.style,
          season: outfit.season || preferences.season,
          items: outfit.items.map((item) => {
            // Find the matching wardrobe item
            const wardrobeItem = wardrobe.find(
              (w) => w.name === item.name || w.id === item.id
            )
            return wardrobeItem || item
          }),
          weather:
            outfit.weather || `Suitable for ${preferences.season} weather`,
          description:
            outfit.description ||
            "A stylish outfit combination for your preferences.",
          score: outfit.score || 3,
          isGrokGenerated: true,
        }))
      } catch (error) {
        console.error("Error parsing Grok response:", error)
        console.error("Raw response:", text)

        // Fall back to the rule-based algorithm
        outfits = generateOutfitSuggestions(wardrobe, preferences, count)

        // Add a flag to indicate these are fallback outfits
        outfits = outfits.map((outfit) => ({
          ...outfit,
          isGrokGenerated: false,
          isAIGenerated: true,
        }))

        // Return both the error and the fallback outfits
        return NextResponse.json({
          error: "Failed to parse Grok response. Using fallback algorithm.",
          details: `${error.message}. Raw response contained markdown formatting.`,
          outfits,
        })
      }

      return NextResponse.json({ outfits })
    } catch (grokError) {
      console.error("Grok API error:", grokError)

      // Generate fallback outfits
      const fallbackOutfits = generateOutfitSuggestions(
        wardrobe,
        preferences,
        count
      )

      // Return a more detailed error message for debugging
      return NextResponse.json({
        error:
          "Failed to generate outfits with Grok. Using fallback algorithm.",
        details: grokError.message,
        outfits: fallbackOutfits.map((outfit) => ({
          ...outfit,
          isGrokGenerated: false,
          isAIGenerated: true,
        })),
      })
    }
  } catch (error) {
    console.error("Error in outfit generator API:", error)
    return NextResponse.json(
      {
        error: "Failed to generate outfit suggestions. Please try again later.",
      },
      { status: 500 }
    )
  }
}
