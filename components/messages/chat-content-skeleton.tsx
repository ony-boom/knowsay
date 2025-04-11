import { Skeleton } from "@/components/ui/skeleton"

export function ChatContentSkeleton() {
    // Create an array of 3 items to show multiple skeleton messages
    return (
        <>
            {[1, 2, 3].map((item) => (
                <div
                    key={item}
                    className="flex items-start gap-3 mb-4"
                >
                    <Skeleton className="h-8 w-8 rounded-full" />
                    
                    <div className="flex flex-col gap-2 min-w-[200px] max-w-[75%]">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                        <Skeleton className="h-3 w-16 mt-1" />
                    </div>
                </div>
            ))}
        </>
    )
}
