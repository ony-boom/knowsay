"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AuthButtons() {
  return (
    <div className="flex gap-4">
      <Button asChild>
        <Link href="auth/login">Get started</Link>
      </Button>
    </div>
  );
}
