import { NextResponse } from "next/server"

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

    const { clothingName, userImage, debug } = body

    if (!clothingName) {
      return NextResponse.json(
        { error: "Missing clothing name" },
        { status: 400 }
      )
    }

    // Log the request for debugging
    console.log("Try-on request received:", {
      clothingName,
      hasUserImage: !!userImage,
    })

    try {
      // Instead of calling OpenAI API, return a reliable placeholder image
      // This ensures the API always works even without an API key
      const imageUrl = `/placeholder.svg?height=800&width=600&text=Person+Wearing+${encodeURIComponent(
        clothingName
      )}`

      // If debug mode is enabled, include additional information
      if (debug) {
        return NextResponse.json({
          imageUrl,
          debug: true,
          message: "Using placeholder image instead of calling AI API",
          requestBody: { clothingName, hasUserImage: !!userImage },
        })
      }

      return NextResponse.json({
        imageUrl,
        success: true,
        message: "Image generated successfully (placeholder)",
      })
    } catch (aiError) {
      console.error("Error generating AI image:", aiError)

      // Return a fallback image with error information
      const fallbackUrl = `/placeholder.svg?height=800&width=600&text=Error+Generating+Image`

      return NextResponse.json({
        imageUrl: fallbackUrl,
        error: "Failed to generate AI image, using fallback",
        errorDetails: aiError.message,
      })
    }
  } catch (error) {
    console.error("Error in try-on API:", error)
    return NextResponse.json(
      {
        error: "Failed to generate try-on image. Please try again later.",
        errorDetails: error.message,
      },
      { status: 500 }
    )
  }
}
