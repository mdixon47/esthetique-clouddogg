import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { xai } from "@ai-sdk/xai"

// Predefined responses for when AI services are not available
const PREDEFINED_RESPONSES = [
  "I think that would look great on you! Would you like to try it on?",
  "That's a stylish choice. It would pair well with several items in your wardrobe.",
  "Great question! Based on your style preferences, I'd recommend trying a few different options.",
  "That's a popular trend this season. Would you like some styling tips for it?",
  "I'd recommend considering the occasion and weather when choosing that outfit.",
  "That color would complement your style nicely. Would you like to see some alternatives?",
  "Based on your previous choices, I think you'd really like that style.",
  "That's a versatile piece that can be dressed up or down depending on the occasion.",
  "I can help you find the perfect accessories to go with that outfit.",
  "That's a great choice for the current season!",
]

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

    const { messages, seasonalInfo, provider = "openai" } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      )
    }

    // Create a system message with seasonal context if available
    let systemContent = `You are a helpful fashion assistant for StyleAI, a virtual try-on and styling app. 
    Help users with fashion advice, outfit suggestions, and virtual try-on guidance. 
    Keep responses concise, friendly, and focused on fashion. 
    If asked about topics unrelated to fashion, politely redirect the conversation back to styling and fashion.`

    // Add seasonal context if available
    if (seasonalInfo) {
      systemContent += `
      It is currently ${seasonalInfo.currentSeason} with ${seasonalInfo.weatherDescription}.
      Provide seasonally appropriate fashion advice considering the current weather conditions.
      For ${seasonalInfo.currentSeason}, recommend appropriate fabrics, colors, and layering techniques.
      If the user is asking about items that aren't suitable for ${seasonalInfo.currentSeason}, suggest alternatives or ways to adapt them.`
    }

    // Handle different AI providers
    if (provider === "openai") {
      // Check if OpenAI API key is available
      const apiKey =
        process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY

      if (!apiKey) {
        console.log("OpenAI API key not found, using predefined response")
        // Return a random predefined response
        const randomIndex = Math.floor(
          Math.random() * PREDEFINED_RESPONSES.length
        )
        return NextResponse.json({ message: PREDEFINED_RESPONSES[randomIndex] })
      }

      try {
        // Use AI SDK to generate response with OpenAI
        const { text } = await generateText({
          model: openai("gpt-3.5-turbo"),
          messages: [
            {
              role: "system",
              content: systemContent,
            },
            ...messages.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
          ],
          maxTokens: 500,
          temperature: 0.7,
        })

        return NextResponse.json({ message: text })
      } catch (openaiError) {
        console.error("OpenAI API error:", openaiError)
        // Return a random predefined response as fallback
        const randomIndex = Math.floor(
          Math.random() * PREDEFINED_RESPONSES.length
        )
        return NextResponse.json({
          message: PREDEFINED_RESPONSES[randomIndex],
          error: `OpenAI error: ${openaiError.message || "Unknown error"}`,
        })
      }
    } else if (provider === "grok") {
      // Check if Grok API key is available
      if (!process.env.XAI_API_KEY) {
        console.log("Grok API key not found, using predefined response")
        // Return a random predefined response
        const randomIndex = Math.floor(
          Math.random() * PREDEFINED_RESPONSES.length
        )
        return NextResponse.json({ message: PREDEFINED_RESPONSES[randomIndex] })
      }

      try {
        // Use AI SDK to generate response with Grok
        const { text } = await generateText({
          model: xai("grok-2"),
          messages: [
            {
              role: "system",
              content: systemContent,
            },
            ...messages.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
          ],
          maxTokens: 500,
          temperature: 0.7,
        })

        return NextResponse.json({ message: text })
      } catch (grokError) {
        console.error("Grok API error:", grokError)
        // Return a random predefined response as fallback
        const randomIndex = Math.floor(
          Math.random() * PREDEFINED_RESPONSES.length
        )
        return NextResponse.json({
          message: PREDEFINED_RESPONSES[randomIndex],
          error: `Grok error: ${grokError.message || "Unknown error"}`,
        })
      }
    } else {
      // Use predefined responses for demo mode
      const randomIndex = Math.floor(
        Math.random() * PREDEFINED_RESPONSES.length
      )
      return NextResponse.json({ message: PREDEFINED_RESPONSES[randomIndex] })
    }
  } catch (error) {
    console.error("Error in chat API:", error)
    // Return a friendly error message
    const randomIndex = Math.floor(Math.random() * PREDEFINED_RESPONSES.length)
    return NextResponse.json({
      message: `I'm having trouble connecting right now. ${PREDEFINED_RESPONSES[randomIndex]}`,
      error: error.message || "Unknown error",
    })
  }
}
