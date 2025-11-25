import { Skeleton } from "./skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export function ProductCardSkeleton() {
    return (
        <Card className="overflow-hidden h-full flex flex-col">
            <div className="relative aspect-square">
                <Skeleton className="h-full w-full" />
            </div>
            <CardHeader className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent className="p-4 pt-0 flex-grow">
                <div className="flex justify-between items-center mb-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-5 w-16" />
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Skeleton className="h-10 w-full" />
            </CardFooter>
        </Card>
    )
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-[250px]" />
                <Skeleton className="h-10 w-[100px]" />
            </div>
            <div className="border rounded-md">
                <div className="p-4 border-b">
                    <div className="flex gap-4">
                        {Array.from({ length: columns }).map((_, i) => (
                            <Skeleton key={i} className="h-6 flex-1" />
                        ))}
                    </div>
                </div>
                <div className="p-4 space-y-4">
                    {Array.from({ length: rows }).map((_, i) => (
                        <div key={i} className="flex gap-4">
                            {Array.from({ length: columns }).map((_, j) => (
                                <Skeleton key={j} className="h-12 flex-1" />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
