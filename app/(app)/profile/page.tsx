import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileTabs } from "@/components/profile/profile-tabs"

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileHeader />
      <ProfileTabs />
    </div>
  )
}
