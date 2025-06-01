"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Mail, MessageSquare, Twitter, Facebook, Instagram, Link } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/providers/toast-provider"
import QRCode from "react-qr-code"

interface ClothingItem {
  id: number
  name: string
  category: string
  subcategory: string
  colors: string[]
  seasons: string[]
  occasions: string[]
  image: string
}

interface ShareItemModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: ClothingItem | null
}

export function ShareItemModal({ open, onOpenChange, item }: ShareItemModalProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("link")

  if (!item) return null

  // Create a shareable link with encoded item data
  const encodedItem = btoa(
    JSON.stringify({
      id: item.id,
      name: item.name,
      category: item.category,
      subcategory: item.subcategory,
      image: item.image,
    }),
  )

  const shareableLink = `${window.location.origin}/wardrobe/item?shared=${encodedItem}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink)
    setCopied(true)
    toast({
      title: "Link copied to clipboard",
      description: "You can now share this link with others",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Check out my ${item.name}`)
    const body = encodeURIComponent(`I wanted to share this ${item.name} from my wardrobe with you: ${shareableLink}`)
    window.open(`mailto:?subject=${subject}&body=${body}`)
    toast({ title: "Email client opened" })
  }

  const shareViaSMS = () => {
    const body = encodeURIComponent(`Check out my ${item.name} from my wardrobe: ${shareableLink}`)
    window.open(`sms:?body=${body}`)
    toast({ title: "SMS client opened" })
  }

  const shareViaSocial = (platform: string) => {
    const text = encodeURIComponent(`Check out my ${item.name} from my wardrobe!`)
    let url = ""

    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareableLink)}&text=${text}`
        break
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareableLink)}`
        break
      case "instagram":
        // Instagram doesn't have a direct sharing URL, so we'll just copy the link
        navigator.clipboard.writeText(shareableLink)
        toast({
          title: "Link copied for Instagram",
          description: "Open Instagram and paste the link in your story or message",
        })
        return
    }

    if (url) window.open(url)
    toast({ title: `${platform} sharing opened` })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Item</DialogTitle>
        </DialogHeader>

        <div className="flex justify-center mb-4">
          <img
            src={item.image || "/placeholder.svg"}
            alt={item.name}
            className="w-32 h-32 object-cover rounded-md border"
            onError={(e) => {
              e.currentTarget.src = `/placeholder.svg?height=128&width=128&text=${encodeURIComponent(item.name)}`
            }}
          />
        </div>

        <h3 className="text-center font-medium mb-4">{item.name}</h3>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link">Share Link</TabsTrigger>
            <TabsTrigger value="qr">QR Code</TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Input value={shareableLink} readOnly className="flex-1" />
                <Button size="icon" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={shareViaEmail} className="flex items-center justify-center">
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
              <Button variant="outline" onClick={shareViaSMS} className="flex items-center justify-center">
                <MessageSquare className="mr-2 h-4 w-4" />
                SMS
              </Button>
              <Button
                variant="outline"
                onClick={() => shareViaSocial("twitter")}
                className="flex items-center justify-center"
              >
                <Twitter className="mr-2 h-4 w-4" />
                Twitter
              </Button>
              <Button
                variant="outline"
                onClick={() => shareViaSocial("facebook")}
                className="flex items-center justify-center"
              >
                <Facebook className="mr-2 h-4 w-4" />
                Facebook
              </Button>
              <Button
                variant="outline"
                onClick={() => shareViaSocial("instagram")}
                className="flex items-center justify-center col-span-2"
              >
                <Instagram className="mr-2 h-4 w-4" />
                Copy for Instagram
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="qr" className="py-4">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="p-4 bg-white rounded-lg">
                <QRCode value={shareableLink} size={200} />
              </div>
              <p className="text-sm text-center text-gray-500">Scan this QR code to view this item</p>
              <Button variant="outline" onClick={copyToClipboard} className="flex items-center">
                <Link className="mr-2 h-4 w-4" />
                Copy Link
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
