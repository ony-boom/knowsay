"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export function AuthButtons(props: { children?: React.ReactNode }) {
  const { data: session } = useSession();
  
  if (session) {
    return (
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => signOut()}>
          Sign Out
        </Button>
      </div>
    );
  }
  
  return (
    <div className="flex gap-4">
      <Button asChild onClick={() => signIn('google')}>
        <Link href="#">{props.children || "Login"}</Link>
      </Button>
    </div>
  );
}
