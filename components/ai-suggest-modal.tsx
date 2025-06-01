"use client"

import type React from "react"
import Image from "next/image"

import { useState } from "react"
import { Sparkles, Send, ImageIcon, Camera, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

interface AiSuggestModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AiSuggestModal({ open, onOpenChange }: AiSuggestModalProps) {
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  const handleSubmit = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setSuggestions([
        "A floral midi dress paired with white sneakers and a denim jacket would be perfect for your casual brunch.",
        "For your office meeting, try a tailored blazer in navy with cream trousers and minimal accessories.",
        "The weather forecast shows rain - consider a trench coat with water-resistant boots and a pop of color with your accessories.",
      ])
      setIsLoading(false)
    }, 1500)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearImage = () => {
    setUploadedImage(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <div className="bg-gradient-to-r from-pink-400 to-purple-400 p-2 rounded-full mr-3">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent font-bold">
              AI Style Suggestions
            </span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="text" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">Text Prompt</TabsTrigger>
            <TabsTrigger value="image">Upload Image</TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="mt-4 space-y-4">
            <Textarea
              placeholder="Describe what you're looking for... (e.g., 'What should I wear to a casual brunch tomorrow?')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
            />

            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={!prompt.trim() || isLoading}
                className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                {isLoading ? (
                  <>
                    <span className="mr-2">Thinking...</span>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Get Suggestions
                    <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="image" className="mt-4 space-y-4">
            {uploadedImage ? (
              <div className="relative">
                <Image
                  src={uploadedImage || "/placeholder.svg"}
                  alt="Uploaded clothing"
                  width={500}
                  height={500}
                  className="w-full h-auto rounded-lg"
                />
                <Button variant="destructive" size="icon" className="absolute top-2 right-2" onClick={clearImage}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-32 flex flex-col items-center justify-center border-dashed"
                  onClick={() => document.getElementById("image-upload")?.click()}
                >
                  <ImageIcon className="h-8 w-8 mb-2 text-pink-400" />
                  <span>Upload Image</span>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </Button>

                <Button variant="outline" className="h-32 flex flex-col items-center justify-center border-dashed">
                  <Camera className="h-8 w-8 mb-2 text-pink-400" />
                  <span>Take Photo</span>
                </Button>
              </div>
            )}

            {uploadedImage && (
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <span className="mr-2">Analyzing...</span>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Analyze Image
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {suggestions.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="font-medium text-lg">Suggestions:</h3>
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <Card key={index}>
                  <CardContent className="p-4 text-sm">{suggestion}</CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
