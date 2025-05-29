import { CacheManager } from "@/components/cache-manager"

export default function SettingsPage() {
  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your application settings and preferences</p>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Cache Management</h2>
        <CacheManager />
      </div>
    </div>
  )
}
