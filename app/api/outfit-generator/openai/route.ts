import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { generateOutfitSuggestions } from "@/lib/outfit-algorithm"

// Track quota status for different models
const modelStatus = {
  "gpt-4o": { quotaExceeded: false, resetTime: 0, failureCount: 0 },
  "gpt-4": { quotaExceeded: false, resetTime: 0, failureCount: 0 },
  "gpt-3.5-turbo": { quotaExceeded: false, resetTime: 0, failureCount: 0 },
}

// Define model fallback chain
const MODEL_FALLBACK_CHAIN = ["gpt-4o", "gpt-4", "gpt-3.5-turbo"]

// Reset failure count after this many seconds
const FAILURE_RESET_TIME = 3600 // 1 hour

// Check for debug parameter in the existing POST function
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

    const {
      preferences,
      wardrobe,
      count = 4,
      preferredModel,
      debug = false,
      temperature = 0.7,
    } = body

    if (!preferences || !wardrobe) {
      return NextResponse.json(
        { error: "Missing preferences or wardrobe data" },
        { status: 400 }
      )
    }

    // Check if OpenAI API key is available
    if (
      !process.env.OPENAI_API_KEY &&
      !process.env.NEXT_PUBLIC_OPENAI_API_KEY
    ) {
      console.log("OpenAI API key not found, using rule-based algorithm")
      // Fall back to the rule-based algorithm
      const outfits = generateOutfitSuggestions(wardrobe, preferences, count)
      return NextResponse.json({
        error: "OpenAI API key not configured",
        outfits: outfits.map((outfit) => ({
          ...outfit,
          isOpenAIGenerated: false,
          isAIGenerated: true,
        })),
      })
    }

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

    // Additional description from test interface
    const additionalDescription = preferences.description
      ? `\nAdditional request details: ${preferences.description}`
      : ""

    // Create a detailed prompt for OpenAI
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
${additionalDescription}

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

    // Determine which models to try based on preferences and status
    const modelToUse = preferredModel || "gpt-4o"

    try {
      console.log(`Using OpenAI model: ${modelToUse}`)

      // Call OpenAI API using AI SDK
      const { text } = await generateText({
        model: openai(modelToUse),
        prompt: prompt,
        system:
          "You are a fashion expert AI that creates outfit combinations based on user preferences and available wardrobe items. Provide responses in valid JSON format as an array of outfit objects.",
        temperature: temperature,
        maxTokens: 2000,
      })

      // Parse the JSON response
      try {
        // Extract JSON from potential markdown code blocks
        let jsonText = text

        // Check if the response is wrapped in markdown code blocks
        const jsonBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
        if (jsonBlockMatch && jsonBlockMatch[1]) {
          jsonText = jsonBlockMatch[1].trim()
        }

        // Try to parse the extracted JSON
        let parsedResponse
        try {
          parsedResponse = JSON.parse(jsonText)
        } catch (parseError) {
          console.error(
            `JSON parse error with model ${modelToUse}:`,
            parseError
          )

          // Try to fix common JSON issues
          // Sometimes the model returns invalid JSON with trailing commas
          const fixedJson = jsonText
            .replace(/,\s*}/g, "}")
            .replace(/,\s*\]/g, "]")
          try {
            parsedResponse = JSON.parse(fixedJson)
            console.log("Successfully parsed after fixing JSON format")
          } catch (secondParseError) {
            console.error(
              "Still failed to parse JSON after fixes:",
              secondParseError
            )

            if (debug) {
              return NextResponse.json({
                error: "Invalid JSON format in response",
                debug: {
                  prompt,
                  response: text,
                },
              })
            }
            throw new Error("Invalid JSON format in response")
          }
        }

        // Handle different response formats:
        let parsedOutfits
        // 1. If the response is already an array of outfits
        if (Array.isArray(parsedResponse)) {
          parsedOutfits = parsedResponse
        }
        // 2. If the response has an 'outfits' property that's an array
        else if (
          parsedResponse.outfits &&
          Array.isArray(parsedResponse.outfits)
        ) {
          parsedOutfits = parsedResponse.outfits
        }
        // 3. If the response is an object with numbered keys (like {1: outfit1, 2: outfit2})
        else if (
          typeof parsedResponse === "object" &&
          Object.keys(parsedResponse).length > 0
        ) {
          parsedOutfits = Object.values(parsedResponse)
        }
        // 4. If none of the above, throw an error
        else {
          console.error(
            `Could not find outfits array in response from model ${modelToUse}:`,
            parsedResponse
          )

          if (debug) {
            return NextResponse.json({
              error: "Could not find outfits array in response",
              debug: {
                prompt,
                response: text,
              },
            })
          }

          throw new Error("Could not find outfits array in response")
        }

        // If outfits is empty, return an error
        if (!parsedOutfits || parsedOutfits.length === 0) {
          console.log(
            `Empty outfits array in response from model ${modelToUse}`
          )

          if (debug) {
            return NextResponse.json({
              error: "Empty outfits array in response",
              debug: {
                prompt,
                response: text,
              },
            })
          }

          throw new Error("Empty outfits array in response")
        }

        // Ensure each outfit has the required properties and format
        const outfits = parsedOutfits.map((outfit, index) => ({
          id: Date.now() + index,
          name: outfit.name || `Outfit ${index + 1}`,
          occasion: outfit.occasion || preferences.occasion,
          style: outfit.style || preferences.style,
          season: outfit.season || preferences.season,
          items: Array.isArray(outfit.items)
            ? outfit.items.map((item) => {
                // Find the matching wardrobe item
                const wardrobeItem = wardrobe.find(
                  (w) => w.name === (item.name || "") || w.id === (item.id || 0)
                )
                return (
                  wardrobeItem || {
                    ...item,
                    // Ensure item has required properties
                    id: item.id || Date.now() + Math.random(),
                    name: item.name || "Unknown Item",
                    category: item.category || "Unknown",
                    image:
                      item.image ||
                      `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(
                        item.name || "Item"
                      )}`,
                  }
                )
              })
            : [], // If items is not an array, use empty array
          weather:
            outfit.weather || `Suitable for ${preferences.season} weather`,
          description:
            outfit.description ||
            "A stylish outfit combination for your preferences.",
          score: outfit.score || 3,
          isOpenAIGenerated: true,
          generatedByModel: modelToUse, // Add which model generated this
        }))

        // Add debug info if requested
        if (debug) {
          return NextResponse.json({
            outfits,
            model: modelToUse,
            debug: {
              prompt,
              response: text,
            },
          })
        }

        // Return the successful outfits with model info
        return NextResponse.json({
          outfits,
          model: modelToUse,
        })
      } catch (parseError) {
        console.error(`Error parsing ${modelToUse} response:`, parseError)

        if (debug) {
          return NextResponse.json({
            error: `Error parsing response: ${parseError.message}`,
            debug: {
              prompt,
              response: text,
            },
          })
        }

        // Generate fallback outfits
        const fallbackOutfits = generateOutfitSuggestions(
          wardrobe,
          preferences,
          count
        )
        return NextResponse.json({
          error: `Failed to parse OpenAI response. Using fallback algorithm.`,
          outfits: fallbackOutfits.map((outfit) => ({
            ...outfit,
            isOpenAIGenerated: false,
            isAIGenerated: true,
          })),
        })
      }
    } catch (apiError) {
      console.error(`Error with model ${modelToUse}:`, apiError)

      if (debug) {
        return NextResponse.json({
          error: `OpenAI API error: ${apiError.message || "Unknown error"}`,
          debug: {
            prompt,
          },
        })
      }

      // Generate fallback outfits
      const fallbackOutfits = generateOutfitSuggestions(
        wardrobe,
        preferences,
        count
      )
      return NextResponse.json({
        error: `OpenAI API error: ${
          apiError.message || "Unknown error"
        }. Using fallback algorithm.`,
        outfits: fallbackOutfits.map((outfit) => ({
          ...outfit,
          isOpenAIGenerated: false,
          isAIGenerated: true,
        })),
      })
    }
  } catch (error) {
    console.error("Error in outfit generator API:", error)

    // Generate fallback outfits as a last resort
    try {
      const {
        preferences,
        wardrobe,
        count = 4,
        debug = false,
      } = await req.json().catch(() => ({
        preferences: { occasion: "casual", season: "current" },
        wardrobe: [],
        count: 4,
        debug: false,
      }))

      const fallbackOutfits = generateOutfitSuggestions(
        wardrobe || [],
        preferences || { occasion: "casual", season: "current" },
        count
      )

      if (debug) {
        return NextResponse.json({
          error:
            "Failed to generate outfit suggestions. Using fallback algorithm.",
          outfits: fallbackOutfits.map((outfit) => ({
            ...outfit,
            isOpenAIGenerated: false,
            isAIGenerated: true,
          })),
          debug: {
            error: error.message || "Unknown error",
          },
        })
      }

      return NextResponse.json({
        error:
          "Failed to generate outfit suggestions. Using fallback algorithm.",
        outfits: fallbackOutfits.map((outfit) => ({
          ...outfit,
          isOpenAIGenerated: false,
          isAIGenerated: true,
        })),
      })
    } catch (fallbackError) {
      return NextResponse.json(
        {
          error:
            "Failed to generate outfit suggestions. Please try again later.",
          details: error.message,
        },
        { status: 500 }
      )
    }
  }
}
