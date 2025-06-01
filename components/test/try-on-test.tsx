"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/providers/toast-provider"
import { Upload, RefreshCw, Sparkles, AlertTriangle, Loader2, Info, X } from "lucide-react"

export function TryOnTest() {
  const { toast } = useToast()
  const [userImage, setUserImage] = useState<string | null>(null)
  const [clothingImage, setClothingImage] = useState<string | null>(null)
  const [clothingName, setClothingName] = useState("")
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("basic")
  const [showDebug, setShowDebug] = useState(false)
  const [requestData, setRequestData] = useState("")
  const [responseData, setResponseData] = useState("")
  const [customPrompt, setCustomPrompt] = useState("")
  const [useCustomPrompt, setUseCustomPrompt] = useState(false)
  const userImageInputRef = useRef<HTMLInputElement>(null)
  const clothingImageInputRef = useRef<HTMLInputElement>(null)

  // Sample clothing items for quick testing
  const sampleClothingItems = [
    { name: "Blue Denim Jacket", image: "/placeholder.svg?height=300&width=300&text=Denim+Jacket" },
    { name: "White Blouse", image: "/placeholder.svg?height=300&width=300&text=White+Blouse" },
    { name: "Black Dress", image: "/placeholder.svg?height=300&width=300&text=Black+Dress" },
    { name: "Red Sweater", image: "/placeholder.svg?height=300&width=300&text=Red+Sweater" },
    { name: "Floral Summer Dress", image: "/placeholder.svg?height=300&width=300&text=Floral+Dress" },
  ]

  const handleUserImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size - limit to 4MB to avoid payload issues
      if (file.size > 4 * 1024 * 1024) {
        setError("User image is too large. Please select an image under 4MB.")
        toast({
          title: "File too large",
          description: "Please select an image under 4MB",
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setUserImage(e.target?.result as string)
        setResultImage(null) // Reset result when new image is uploaded
        setError(null) // Clear any previous errors
      }
      reader.readAsDataURL(file)
    }
  }

  const handleClothingImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size - limit to 4MB to avoid payload issues
      if (file.size > 4 * 1024 * 1024) {
        setError("Clothing image is too large. Please select an image under 4MB.")
        toast({
          title: "File too large",
          description: "Please select an image under 4MB",
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setClothingImage(e.target?.result as string)
        setResultImage(null) // Reset result when new image is uploaded
        setError(null) // Clear any previous errors
      }
      reader.readAsDataURL(file)
    }
  }

  const selectSampleClothing = (item) => {
    setClothingName(item.name)
    setClothingImage(item.image)
    setResultImage(null)
    setError(null)
  }

  const clearUserImage = () => {
    setUserImage(null)
    if (userImageInputRef.current) {
      userImageInputRef.current.value = ""
    }
  }

  const clearClothingImage = () => {
    setClothingImage(null)
    if (clothingImageInputRef.current) {
      clothingImageInputRef.current.value = ""
    }
  }

  const generateTryOn = async () => {
    // For basic mode, we only need clothing name
    if (activeTab === "basic" && !clothingName) {
      setError("Please enter a clothing name")
      return
    }

    // For advanced mode, we need both user image and clothing image/name
    if (activeTab === "advanced" && (!userImage || (!clothingImage && !clothingName))) {
      setError("Please upload both a user image and a clothing image (or enter a clothing name)")
      return
    }

    setIsProcessing(true)
    setProcessingProgress(0)
    setError(null)
    setResultImage(null)
    setRequestData("")
    setResponseData("")

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProcessingProgress((prev) => {
        const newProgress = prev + Math.random() * 10
        return newProgress > 90 ? 90 : newProgress
      })
    }, 500)

    try {
      // Prepare request data
      const requestBody: any = {
        clothingName,
      }

      // Add images if available
      if (userImage) {
        requestBody.userImage = userImage
      }

      if (clothingImage) {
        requestBody.clothingImage = clothingImage
      }

      // Add custom prompt if enabled
      if (useCustomPrompt && customPrompt) {
        requestBody.customPrompt = customPrompt
      }

      // Add debug flag
      requestBody.debug = true

      // Store request data for debug view
      setRequestData(JSON.stringify(requestBody, null, 2))

      // Determine which API endpoint to use
      const endpoint = activeTab === "basic" ? "/api/try-on/basic" : "/api/try-on/advanced"

      // Call the API
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      // Check if the response is OK
      if (!response.ok) {
        let errorMessage = "Failed to generate try-on image"

        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
          setResponseData(JSON.stringify(errorData, null, 2))
        } catch (jsonError) {
          errorMessage = `Server error: ${response.status} ${response.statusText || ""}`
          setResponseData(`Failed to parse JSON response. Status: ${response.status}`)
        }

        throw new Error(errorMessage)
      }

      // Parse the JSON response
      const data = await response.json()
      setResponseData(JSON.stringify(data, null, 2))

      if (!data.imageUrl) {
        throw new Error("No image URL returned from the server")
      }

      setResultImage(data.imageUrl)
    } catch (err) {
      console.error("Error generating try-on:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")

      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      clearInterval(progressInterval)
      setProcessingProgress(100)

      // Small delay to show 100% progress before clearing
      setTimeout(() => {
        setIsProcessing(false)
      }, 500)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Virtual Try-On Test</CardTitle>
          <CardDescription>Test the virtual try-on API with different images and settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Try-On</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Try-On</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="pt-4 space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Basic try-on only requires a clothing description. It will generate an image of a person wearing the
                  described clothing.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="clothing-name">Clothing Description</Label>
                <Input
                  id="clothing-name"
                  placeholder="e.g., Blue Denim Jacket"
                  value={clothingName}
                  onChange={(e) => setClothingName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Sample Clothing Items</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {sampleClothingItems.map((item, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto py-2 px-3 text-xs"
                      onClick={() => selectSampleClothing(item)}
                    >
                      {item.name}
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="pt-4 space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Advanced try-on requires both a user image and clothing information. It will generate an image of the
                  user wearing the specified clothing.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Image Upload */}
                <div className="space-y-2">
                  <Label>User Image</Label>
                  {userImage ? (
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border bg-muted">
                      <img src={userImage || "/placeholder.svg"} alt="User" className="h-full w-full object-cover" />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={clearUserImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center cursor-pointer aspect-[3/4]"
                      onClick={() => userImageInputRef.current?.click()}
                    >
                      <Upload className="mb-4 h-8 w-8 text-pink-500" />
                      <h3 className="mb-1 text-lg font-medium">Upload user image</h3>
                      <p className="text-sm text-muted-foreground">Drag and drop or click to browse</p>
                      <p className="text-xs text-muted-foreground mt-1">Maximum size: 4MB</p>
                      <input
                        ref={userImageInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleUserImageUpload}
                      />
                    </div>
                  )}
                </div>

                {/* Clothing Image Upload */}
                <div className="space-y-2">
                  <Label>Clothing Image (Optional)</Label>
                  {clothingImage ? (
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border bg-muted">
                      <img
                        src={clothingImage || "/placeholder.svg"}
                        alt="Clothing"
                        className="h-full w-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={clearClothingImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center cursor-pointer aspect-[3/4]"
                      onClick={() => clothingImageInputRef.current?.click()}
                    >
                      <Upload className="mb-4 h-8 w-8 text-pink-500" />
                      <h3 className="mb-1 text-lg font-medium">Upload clothing image</h3>
                      <p className="text-sm text-muted-foreground">Drag and drop or click to browse</p>
                      <p className="text-xs text-muted-foreground mt-1">Maximum size: 4MB</p>
                      <input
                        ref={clothingImageInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleClothingImageUpload}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clothing-name-advanced">Clothing Description</Label>
                <Input
                  id="clothing-name-advanced"
                  placeholder="e.g., Blue Denim Jacket"
                  value={clothingName}
                  onChange={(e) => setClothingName(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Provide a detailed description of the clothing item, even if you've uploaded an image
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="custom-prompt" className="cursor-pointer">
                Use custom prompt
              </Label>
              <Switch id="custom-prompt" checked={useCustomPrompt} onCheckedChange={setUseCustomPrompt} />
            </div>

            {useCustomPrompt && (
              <Textarea
                placeholder="Enter a custom prompt for the AI model..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={3}
              />
            )}
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="debug" className="cursor-pointer">
              Show debug information
            </Label>
            <Switch id="debug" checked={showDebug} onCheckedChange={setShowDebug} />
          </div>

          {isProcessing && (
            <div className="w-full">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Generating try-on image...</span>
                <span className="text-sm text-muted-foreground">{Math.round(processingProgress)}%</span>
              </div>
              <Progress value={processingProgress} className="h-2" />
            </div>
          )}

          <Button
            className="w-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500"
            onClick={generateTryOn}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Virtual Try-On
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showDebug && (
        <Card>
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="request" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="request">Request</TabsTrigger>
                <TabsTrigger value="response">Response</TabsTrigger>
              </TabsList>
              <TabsContent value="request" className="p-4">
                <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-[400px]">
                  <pre className="text-xs whitespace-pre-wrap">{requestData || "No request data available"}</pre>
                </div>
              </TabsContent>
              <TabsContent value="response" className="p-4">
                <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-[400px]">
                  <pre className="text-xs whitespace-pre-wrap">{responseData || "No response data available"}</pre>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {resultImage && (
        <Card>
          <CardHeader>
            <CardTitle>Try-On Result</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="max-w-md overflow-hidden rounded-lg border">
              <div className="aspect-[3/4] w-full bg-muted">
                <img
                  src={resultImage || "/placeholder.svg"}
                  alt="Try-on result"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setResultImage(null)}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Another
            </Button>
            <Button
              className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500"
              onClick={() => {
                // In a real app, you would save the image
                toast({
                  title: "Image saved",
                  description: "The try-on result has been saved to your collection",
                })
              }}
            >
              Save Result
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
