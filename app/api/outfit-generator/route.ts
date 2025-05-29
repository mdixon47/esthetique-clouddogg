import { NextResponse } from "next/server"
import OpenAI from "openai"
import { generateOutfitSuggestions } from "@/lib/outfit-algorithm"

// Create the OpenAI client outside the handler function
// This ensures it's only initialized on the server
const openai =
  process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY
    ? new OpenAI({
        apiKey:
          process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      })
    : null

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

    // Check if OpenAI client is available
    if (!openai) {
      console.log("OpenAI API key not found, using rule-based algorithm")
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

      // Create a detailed prompt for OpenAI
      const prompt = `Generate ${count} outfit suggestions based on the following preferences and wardrobe items.

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
1. A creative name for the outfit
2. The occasion it's suitable for
3. The style category
4. The season it's appropriate for
5. A list of wardrobe items to include (only use items from the available wardrobe)
6. A weather suitability description
7. A brief styling description
8. A confidence score (1-5) indicating how well the outfit matches the preferences

Format the response as a JSON array of outfit objects.`

      // Call OpenAI API
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a fashion AI assistant that creates outfit combinations based on user preferences and available wardrobe items. Provide responses in valid JSON format with an 'outfits' array.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      })

      // Extract the assistant's message
      const assistantMessage = response.choices[0].message.content

      // Parse the JSON response
      let outfits
      try {
        // Try to parse the response as JSON
        const parsedResponse = JSON.parse(assistantMessage)
        outfits = parsedResponse.outfits || []

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
        }))
      } catch (error) {
        console.error("Error parsing OpenAI response:", error)
        // Fall back to the rule-based algorithm
        outfits = generateOutfitSuggestions(wardrobe, preferences, count)
      }

      return NextResponse.json({ outfits })
    } catch (openaiError) {
      console.error("OpenAI API error:", openaiError)
      // Fall back to the rule-based algorithm
      const outfits = generateOutfitSuggestions(wardrobe, preferences, count)
      return NextResponse.json({ outfits })
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
