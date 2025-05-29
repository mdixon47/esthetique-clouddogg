import { TryOnTest } from "@/components/test/try-on-test"

export default function TryOnTestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Virtual Try-On Test</h1>
        <p className="mt-2 text-gray-500">Test the virtual try-on API with different images and settings</p>
      </div>

      <TryOnTest />
    </div>
  )
}
