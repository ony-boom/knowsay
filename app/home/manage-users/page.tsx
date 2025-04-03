import UsersList from "@/components/manage-users/users-list"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useTranslations } from "next-intl"

export default function ManageUsers() {
    const t = useTranslations("usersMangement")
    return (
        <>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <hgroup className="space-y-2 md:space-y-4">
                    <h1 className="text-2xl font-black md:text-3xl lg:text-5xl">
                        {t("title")}
                    </h1>
                    <p className="text-foreground/80 text-base md:text-lg">
                        {t("description")}
                    </p>
                </hgroup>
            </div>
            <div className="flex justify-start">
                <div className="relative w-full max-w-sm">
                    <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                    <Input
                        type="search"
                        placeholder="Search participants or teams..."
                        className="pl-8"
                    />
                </div>
            </div>
            <UsersList />
        </>
    )
}