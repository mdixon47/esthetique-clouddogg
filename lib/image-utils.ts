/**
 * Converts a base64 image to a Buffer
 */
export function base64ToBuffer(base64Image: string): Buffer {
  // Remove the data URL prefix if it exists
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "")
  return Buffer.from(base64Data, "base64")
}

/**
 * Resizes an image to fit within the specified dimensions while maintaining aspect ratio
 * Note: In a real implementation, you would use a library like sharp to resize the image
 */
export function resizeImage(
  base64Image: string,
  maxWidth: number,
  maxHeight: number
): Promise<string> {
  return new Promise((resolve) => {
    // In a real implementation, this would resize the image
    // For now, we'll just return the original image
    resolve(base64Image)
  })
}

/**
 * Converts an image URL to base64
 */
export async function imageUrlToBase64(url: string): Promise<string> {
  const response = await fetch(url)
  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  return `data:${response.headers.get("content-type")};base64,${buffer.toString(
    "base64"
  )}`
}
