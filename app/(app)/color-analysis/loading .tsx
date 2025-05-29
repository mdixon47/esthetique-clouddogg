import { Skeleton } from "@/components/ui/skeleton"

export default function ColorAnalysisLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-10 w-3/4 mb-2" />
      <Skeleton className="h-5 w-1/2 mb-8" />

      <Skeleton className="h-10 w-full mb-6" />

      <div className="space-y-4">
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    </div>
  )
}
