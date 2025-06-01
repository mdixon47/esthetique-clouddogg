"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Edit, Camera } from "lucide-react"
import { EditProfileModal } from "@/components/profile/edit-profile-modal"

export function ProfileHeader() {
  const [showEditModal, setShowEditModal] = useState(false)

  // Mock user data - in a real app, this would come from your database
  const user = {
    name: "Sophie Anderson",
    username: "sophiestyle",
    bio: "Fashion enthusiast | Minimalist | Sustainable fashion advocate",
    location: "New York, NY",
    memberSince: "January 2023",
    styleTypes: ["Minimalist", "Casual Chic", "Sustainable"],
    avatarUrl: "/placeholder.svg?height=200&width=200&text=SA",
  }

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="relative group">
          <Avatar className="h-24 w-24 border-2 border-white shadow-md">
            <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback className="text-xl">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <button className="absolute bottom-0 right-0 bg-pink-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-gray-500">@{user.username}</p>
            </div>
            <Button onClick={() => setShowEditModal(true)} variant="outline" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>

          <p className="mt-2">{user.bio}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {user.styleTypes.map((style) => (
              <Badge key={style} variant="outline" className="bg-pink-50">
                {style}
              </Badge>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
            <span>{user.location}</span>
            <span>Member since {user.memberSince}</span>
          </div>
        </div>
      </div>

      <EditProfileModal open={showEditModal} onOpenChange={setShowEditModal} user={user} />
    </div>
  )
}
