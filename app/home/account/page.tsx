import { UserProfile } from "@clerk/nextjs";

export default function Account() {
    return(
        <>
            <UserProfile routing="hash"/>
        </>
    )
}
