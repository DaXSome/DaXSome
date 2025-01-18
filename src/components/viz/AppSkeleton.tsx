import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AppSkeleton() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      {/* Header Skeleton */}
      <header className="text-center">
        <Skeleton className="h-8 w-1/3 mx-auto" />
        <Skeleton className="h-4 w-2/4 mx-auto mt-2" />
      </header>

      {/* Year Selection Skeleton */}
      <div className="flex justify-center space-x-4">
        {Array(5)
          .fill(null)
          .map((_, index) => (
            <Skeleton key={index} className="h-10 w-20 rounded-md" />
          ))}
      </div>

      {/* Card Skeletons */}
      <SkeletonCard titleWidth="w-1/4" descWidth="w-2/3" />

      <div className="grid md:grid-cols-2 gap-6">
        <SkeletonCard titleWidth="w-1/3" descWidth="w-2/4" />
        <SkeletonCard titleWidth="w-1/3" descWidth="w-2/4" />
      </div>

      <SkeletonCard titleWidth="w-1/3" descWidth="w-2/3" />

      {/* Table Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-2/4 mt-1" />
        </CardHeader>
        <CardContent className="max-h-[600px] overflow-y-scroll">
          <Skeleton className="h-8 w-full" />
          {Array(10)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="flex items-center space-x-2 mt-4">
                <Skeleton className="h-4 w-20" />
                {Array(5)
                  .fill(null)
                  .map((__, colIndex) => (
                    <Skeleton key={colIndex} className="h-4 w-16" />
                  ))}
              </div>
            ))}
        </CardContent>
      </Card>

      {/* Footer Skeleton */}
      <footer className="text-center text-sm text-muted-foreground">
        <Skeleton className="h-4 w-1/3 mx-auto" />
        <div className="flex justify-center space-x-2 mt-2">
          {Array(3)
            .fill(null)
            .map((_, index) => (
              <Skeleton key={index} className="h-4 w-20" />
            ))}
        </div>
      </footer>
    </div>
  );
}

// Skeleton Card Component
function SkeletonCard({ titleWidth, descWidth }: { titleWidth: string; descWidth: string }) {
  return (
    <Card>
      <CardHeader>
        <Skeleton className={`h-6 ${titleWidth}`} />
        <Skeleton className={`h-4 ${descWidth} mt-1`} />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-64 w-full" />
      </CardContent>
    </Card>
  );
}
