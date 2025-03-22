"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export function AuthButtons(props: { children?: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <Button asChild>
        <Link href="/auth/login">{props.children || "Login"}</Link>
      </Button>
    </div>
  );
}
