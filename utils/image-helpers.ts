/**
 * Checks if an image URL is valid and accessible
 * @param url The image URL to check
 * @returns Promise that resolves to true if the image is valid, false otherwise
 */
export const isImageValid = async (url: string): Promise<boolean> => {
  // If it's a placeholder or data URL, assume it's valid
  if (url.startsWith("/placeholder") || url.startsWith("data:")) {
    return true
  }

  return new Promise((resolve) => {
    const img = new Image()

    img.onload = () => {
      resolve(true)
    }

    img.onerror = () => {
      resolve(false)
    }

    img.src = url
  })
}

/**
 * Gets a fallback image URL for a given item
 * @param itemName The name of the item
 * @param category Optional category of the item
 * @returns A placeholder image URL
 */
export const getFallbackImageUrl = (
  itemName: string,
  category?: string
): string => {
  const text = category ? `${category}:+${itemName}` : itemName

  return `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(
    text || "Item"
  )}`
}

/**
 * Preloads an image to ensure it's in the browser cache
 * @param url The image URL to preload
 * @returns Promise that resolves when the image is loaded
 */
export const preloadImage = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      resolve()
    }

    img.onerror = () => {
      reject(new Error(`Failed to preload image: ${url}`))
    }

    img.src = url
  })
}
