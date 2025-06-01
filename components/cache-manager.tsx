"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Trash2, RefreshCw, Database, Clock } from "lucide-react"
import { clearImageCache, getCacheStats } from "@/lib/image-cache"
import { useToast } from "@/hooks/use-toast"

export function CacheManager() {
  const [cacheStats, setCacheStats] = useState<{
    count: number
    oldestEntry: number
    newestEntry: number
    totalSize: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const { toast } = useToast()

  const loadCacheStats = async () => {
    setIsLoading(true)
    try {
      const stats = await getCacheStats()
      setCacheStats(stats)
    } catch (error) {
      console.error("Failed to load cache stats:", error)
      toast({
        title: "Error",
        description: "Failed to load cache statistics",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearCache = async () => {
    setIsClearing(true)
    try {
      await clearImageCache()
      setCacheStats({
        count: 0,
        oldestEntry: Date.now(),
        newestEntry: Date.now(),
        totalSize: 0,
      })
      toast({
        title: "Cache Cleared",
        description: "All cached images have been removed",
      })
    } catch (error) {
      console.error("Failed to clear cache:", error)
      toast({
        title: "Error",
        description: "Failed to clear cache",
        variant: "destructive",
      })
    } finally {
      setIsClearing(false)
    }
  }

  useEffect(() => {
    loadCacheStats()
  }, [])

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (timestamp: number) => {
    if (!timestamp) return "N/A"
    return new Date(timestamp).toLocaleString()
  }

  const getTimeSince = (timestamp: number) => {
    if (!timestamp) return "N/A"

    const seconds = Math.floor((Date.now() - timestamp) / 1000)

    let interval = seconds / 31536000
    if (interval > 1) return Math.floor(interval) + " years ago"

    interval = seconds / 2592000
    if (interval > 1) return Math.floor(interval) + " months ago"

    interval = seconds / 86400
    if (interval > 1) return Math.floor(interval) + " days ago"

    interval = seconds / 3600
    if (interval > 1) return Math.floor(interval) + " hours ago"

    interval = seconds / 60
    if (interval > 1) return Math.floor(interval) + " minutes ago"

    return Math.floor(seconds) + " seconds ago"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="mr-2 h-5 w-5 text-pink-500" />
          Image Cache Manager
        </CardTitle>
        <CardDescription>
          Manage locally cached AI-generated images to improve performance and reduce API calls
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 text-pink-500 animate-spin mb-4" />
            <p className="text-muted-foreground">Loading cache statistics...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Cached Images</h3>
                  <span className="text-2xl font-bold">{cacheStats?.count || 0}</span>
                </div>
                <Progress
                  value={cacheStats?.count ? Math.min((cacheStats.count / 50) * 100, 100) : 0}
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-2">Maximum: 50 images</p>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Total Size</h3>
                  <span className="text-2xl font-bold">{formatBytes(cacheStats?.totalSize || 0)}</span>
                </div>
                <Progress
                  value={cacheStats?.totalSize ? Math.min((cacheStats.totalSize / (10 * 1024 * 1024)) * 100, 100) : 0}
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-2">Estimated cache size</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Cache Timeline</h3>

              <div className="space-y-2">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-pink-500 mr-2" />
                  <span className="text-sm">Oldest cached image:</span>
                  <span className="text-sm ml-auto font-medium">{getTimeSince(cacheStats?.oldestEntry || 0)}</span>
                </div>

                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-pink-500 mr-2" />
                  <span className="text-sm">Most recent cached image:</span>
                  <span className="text-sm ml-auto font-medium">{getTimeSince(cacheStats?.newestEntry || 0)}</span>
                </div>

                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-pink-500 mr-2" />
                  <span className="text-sm">Cache expiration:</span>
                  <span className="text-sm ml-auto font-medium">7 days</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={loadCacheStats} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
        <Button
          variant="destructive"
          onClick={handleClearCache}
          disabled={isClearing || (cacheStats?.count || 0) === 0}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {isClearing ? "Clearing..." : "Clear Cache"}
        </Button>
      </CardFooter>
    </Card>
  )
}
