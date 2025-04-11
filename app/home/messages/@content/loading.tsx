import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@radix-ui/react-dropdown-menu";

export default function MessagesDefault() {
    return (
        <>
            <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[350px]" />
                    <Skeleton className="h-4 w-[300px]" />
                </div>
            </div>
            <Separator className="my-4" />
            <div className="flex flex-col gap-6">
                <div className="flex justify-center items-center w-full">
                    <Skeleton className="h-12 w-[350px]" />
                </div>
            </div>
        </>
    );
}