/**
 * Simple client-side image cache utility
 * Uses localStorage for simplicity, but could be upgraded to IndexedDB for larger storage
 */

// Cache keys
const CACHE_PREFIX = "fashion-ai-cache-"
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds

// Generate a cache key for outfit preferences
export function generateOutfitCacheKey(preferences: any): string {
  // Create a deterministic key based on the most important preferences
  const keyParts = [
    preferences.occasion || "casual",
    preferences.season || "current",
    preferences.style || "balanced",
    preferences.colorfulness || 50,
  ]

  return `${CACHE_PREFIX}outfit-${keyParts.join("-")}`
}

// Generate a cache key for try-on images
export function generateTryOnCacheKey(
  clothingItem: string,
  userImage: string | undefined
): string {
  return `${CACHE_PREFIX}tryon-${clothingItem}-${userImage || "no-user-image"}`
}

// Generate a hash from an image data URL
export function generateImageHash(imageData: string): string {
  let hash = 0,
    i,
    chr
  if (imageData.length === 0) return hash.toString()
  for (i = 0; i < imageData.length; i++) {
    chr = imageData.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0 // Convert to 32bit integer
  }
  return hash.toString()
}

// Store an image in the cache
export async function cacheImage(
  key: string,
  imageData: string,
  options: { type?: string; size?: number; query?: string } = {}
): Promise<void> {
  try {
    // Store the image with timestamp
    const cacheEntry = {
      data: imageData,
      timestamp: Date.now(),
      type: options.type || "image/png",
      size: options.size || imageData.length,
      query: options.query || "",
    }

    localStorage.setItem(key, JSON.stringify(cacheEntry))

    // Clean up old cache entries
    cleanupCache()
  } catch (error) {
    console.error("Error caching image:", error)
    // If localStorage is full, clear some space
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      clearOldestCacheEntries(5)
      // Try again
      try {
        const cacheEntry = {
          data: imageData,
          timestamp: Date.now(),
          type: options.type || "image/png",
          size: options.size || imageData.length,
          query: options.query || "",
        }
        localStorage.setItem(key, JSON.stringify(cacheEntry))
      } catch (retryError) {
        console.error("Failed to cache image after cleanup:", retryError)
      }
    }
  }
}

// Get an image from the cache
export async function getCachedImage(key: string): Promise<string | null> {
  try {
    const cacheEntryJson = localStorage.getItem(key)

    if (!cacheEntryJson) {
      return null
    }

    const cacheEntry = JSON.parse(cacheEntryJson)

    // Check if the cache entry has expired
    if (Date.now() - cacheEntry.timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(key)
      return null
    }

    // Update the timestamp to mark it as recently used
    cacheEntry.timestamp = Date.now()
    localStorage.setItem(key, JSON.stringify(cacheEntry))

    return cacheEntry.data
  } catch (error) {
    console.error("Error retrieving cached image:", error)
    return null
  }
}

// Clear the entire cache
export function clearCache(): void {
  try {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key)
      }
    })
  } catch (error) {
    console.error("Error clearing cache:", error)
  }
}

// Clear the entire image cache
export function clearImageCache(): void {
  try {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key)
      }
    })
  } catch (error) {
    console.error("Error clearing image cache:", error)
  }
}

// Clean up expired cache entries
function cleanupCache(): void {
  try {
    const now = Date.now()

    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(CACHE_PREFIX)) {
        try {
          const cacheEntryJson = localStorage.getItem(key)
          if (cacheEntryJson) {
            const cacheEntry = JSON.parse(cacheEntryJson)
            if (now - cacheEntry.timestamp > CACHE_EXPIRY) {
              localStorage.removeItem(key)
            }
          }
        } catch (parseError) {
          // If we can't parse the entry, remove it
          localStorage.removeItem(key)
        }
      }
    })
  } catch (error) {
    console.error("Error cleaning up cache:", error)
  }
}

// Clear the oldest cache entries to make space
function clearOldestCacheEntries(count: number): void {
  try {
    const cacheEntries: { key: string; timestamp: number }[] = []

    // Collect all cache entries with their timestamps
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(CACHE_PREFIX)) {
        try {
          const cacheEntryJson = localStorage.getItem(key)
          if (cacheEntryJson) {
            const cacheEntry = JSON.parse(cacheEntryJson)
            cacheEntries.push({
              key,
              timestamp: cacheEntry.timestamp,
            })
          }
        } catch (parseError) {
          // If we can't parse the entry, add it with an old timestamp
          cacheEntries.push({
            key,
            timestamp: 0,
          })
        }
      }
    })

    // Sort by timestamp (oldest first)
    cacheEntries.sort((a, b) => a.timestamp - b.timestamp)

    // Remove the oldest entries
    cacheEntries.slice(0, count).forEach((entry) => {
      localStorage.removeItem(entry.key)
    })
  } catch (error) {
    console.error("Error clearing oldest cache entries:", error)
  }
}

// Get cache statistics
export function getCacheStats(): {
  count: number
  size: number
  oldestEntry: number
  newestEntry: number
} {
  try {
    let count = 0
    let size = 0
    let oldestEntry = Date.now()
    let newestEntry = 0

    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(CACHE_PREFIX)) {
        count++
        const item = localStorage.getItem(key)
        if (item) {
          size += item.length * 2 // Approximate size in bytes (2 bytes per character)
          try {
            const cacheEntry = JSON.parse(item)
            oldestEntry = Math.min(oldestEntry, cacheEntry.timestamp)
            newestEntry = Math.max(newestEntry, cacheEntry.timestamp)
          } catch (parseError) {
            console.error("Error parsing cache entry for stats:", parseError)
          }
        }
      }
    })

    return {
      count,
      size: Math.round(size / 1024), // Convert to KB
      oldestEntry: count > 0 ? oldestEntry : 0,
      newestEntry: count > 0 ? newestEntry : 0,
    }
  } catch (error) {
    console.error("Error getting cache stats:", error)
    return {
      count: 0,
      size: 0,
      oldestEntry: 0,
      newestEntry: 0,
    }
  }
}
