"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, Camera, X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CategoryForm } from "@/components/wardrobe/category-form"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/providers/toast-provider"

interface UploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onItemAdded?: (item: any) => void
}

export function UploadModal({ open, onOpenChange, onItemAdded }: UploadModalProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [step, setStep] = useState<"upload" | "categorize">("upload")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size - limit to 5MB
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          variant: "destructive",
        })
        return
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        })
        return
      }

      // Simulate upload progress
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setUploadProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)

          // Read the file after upload is "complete"
          const reader = new FileReader()
          reader.onload = (e) => {
            setUploadedImage(e.target?.result as string)
            setUploadProgress(0)
          }
          reader.readAsDataURL(file)
        }
      }, 200)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      // Check file size - limit to 5MB
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          variant: "destructive",
        })
        return
      }

      // Simulate upload progress
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setUploadProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)

          // Read the file after upload is "complete"
          const reader = new FileReader()
          reader.onload = (e) => {
            setUploadedImage(e.target?.result as string)
            setUploadProgress(0)
          }
          reader.readAsDataURL(file)
        }
      }, 200)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const clearImage = () => {
    setUploadedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const analyzeImage = () => {
    setIsAnalyzing(true)
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false)
      setStep("categorize")
    }, 1500)
  }

  const handleSave = (formData: any) => {
    // Here you would save the item to your database
    const newItem = {
      id: Date.now(),
      name: formData.name,
      category: formData.category,
      subcategory: formData.subcategory,
      colors: formData.colors,
      seasons: formData.seasons,
      occasions: formData.occasions,
      image: uploadedImage,
      notes: formData.notes,
      dateAdded: new Date().toISOString(),
    }

    // Call the onItemAdded callback if provided
    if (onItemAdded) {
      onItemAdded(newItem)
    }

    // Show success toast
    toast({
      title: "Item added to wardrobe",
      description: `${formData.name} has been added to your wardrobe`,
    })

    // Reset and close modal
    onOpenChange(false)
    setUploadedImage(null)
    setStep("upload")
  }

  const handleCancel = () => {
    onOpenChange(false)
    setUploadedImage(null)
    setStep("upload")
  }

  const handleCameraCapture = () => {
    // This would be implemented with a device camera API
    // For now, we'll just show a toast
    toast({
      title: "Camera access",
      description: "Camera functionality will be available soon",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{step === "upload" ? "Add New Clothing Item" : "Categorize Your Item"}</DialogTitle>
        </DialogHeader>

        {step === "upload" ? (
          <div className="mt-4 space-y-4">
            {uploadedImage ? (
              <div className="relative">
                <img
                  src={uploadedImage || "/placeholder.svg"}
                  alt="Clothing item"
                  className="w-full h-auto max-h-[300px] object-contain rounded-lg"
                />
                <Button variant="destructive" size="icon" className="absolute top-2 right-2" onClick={clearImage}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : uploadProgress > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Uploading image...</span>
                  <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="rounded-full bg-pink-100 p-3">
                    <Upload className="h-6 w-6 text-pink-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Drag and drop your image here</p>
                    <p className="text-xs text-gray-500 mt-1">or click to browse from your device</p>
                  </div>
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    Browse Files
                  </Button>
                  <input
                    ref={fileInputRef}
                    id="item-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
            )}

            <Tabs defaultValue="upload" className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload Image</TabsTrigger>
                <TabsTrigger value="camera">Take Photo</TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-4">
                {uploadedImage && (
                  <div className="flex justify-end">
                    <Button
                      onClick={analyzeImage}
                      disabled={isAnalyzing}
                      className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500"
                    >
                      {isAnalyzing ? (
                        <>Analyzing...</>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Analyze with AI
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="camera" className="space-y-4">
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <Camera className="h-12 w-12 text-gray-400" />
                </div>
                <Button className="w-full" onClick={handleCameraCapture}>
                  <Camera className="mr-2 h-4 w-4" />
                  Take Photo
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <CategoryForm image={uploadedImage || ""} onSave={handleSave} onCancel={handleCancel} />
        )}
      </DialogContent>
    </Dialog>
  )
}
