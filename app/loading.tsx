"use client";
import { GlobalLoading } from "@/components/loading";

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <GlobalLoading />
    </div>
  );
}
