"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Check, QrCode } from "lucide-react"
import { useToast } from "@/components/providers/toast-provider"

interface SharePreferencesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  preferences: {
    occasion: string
    season: string
    style: string
    colorfulness: number
    useWeather: boolean
    includeAccessories: boolean
    generationMode?: string
    preferredModel?: string
  }
}

export function SharePreferencesModal({ open, onOpenChange, preferences }: SharePreferencesModalProps) {
  const [activeTab, setActiveTab] = useState("link")
  const [copied, setCopied] = useState(false)
  const [shareUrl, setShareUrl] = useState("")
  const { toast } = useToast()

  // Generate share URL when preferences change or modal opens
  useEffect(() => {
    if (open) {
      // Convert preferences to base64
      const preferencesString = JSON.stringify(preferences)
      const encodedPreferences = btoa(preferencesString)
      
      // Create URL with encoded preferences
      const baseUrl = window.location.origin + "/outfit-suggestions"
      const url = `${baseUrl}?shared=${encodedPreferences}`
      
      setShareUrl(url)
    }
  }, [preferences, open])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      
      toast({
        title: "Copied to clipboard",
        description: "Share link has been copied to your clipboard",
      })
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Error copying to clipboard:", error)
      toast({
        title: "Failed to copy",
        description: "Please try again or copy the link manually",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Outfit Preferences</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link">Share Link</TabsTrigger>
            <TabsTrigger value="qr">QR Code</TabsTrigger>
          </TabsList>
          
          <TabsContent value="link" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="share-link">Share Link</Label>
              <div className="flex space-x-2">
                <Input
                  id="share-link"
                  value={shareUrl}
                  readOnly
                  className="flex-1"
                />
                <Button size="icon" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Share this link with others to let them use your outfit preferences
              </p>
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button onClick={handleCopy}>
                {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                Copy Link
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="qr" className="space-y-4 pt-4">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="border border-gray-200 p-4 rounded-md">
                {/* In a real app, you would generate a QR code here */}
                <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
                  <QrCode className="h-24 w-24 text-gray-400" />
                </div>
              </div>
              <p className="text-sm text-gray-500 text-center">
                Scan this QR code to access these outfit preferences
              </p>
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button onClick={() => {
                toast({
                  title: "QR Code saved",
                  description: "QR code has been saved to your device",
                })
              }}>
                Save QR Code
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
