import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="flex flex-col space-y-4 p-4">
            {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-start space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-4 w-[60px]" />
                        </div>
                        <Skeleton className="h-16 w-full" />
                    </div>
                </div>
            ))}
        </div>
    );
}
