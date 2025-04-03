"use client";
import { GlobalLoading } from "@/components/loading";

export default function Loading() {
  return (
    <div className="flex h-full items-center justify-center">
      <GlobalLoading />
    </div>
  );
}
