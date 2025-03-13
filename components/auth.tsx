"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AuthButtons() {
    return (
        <div className="flex gap-4">
            <Link href="auth/login">
                <Button variant="outline">Get Started</Button>
            </Link>
        </div>
    );
}

