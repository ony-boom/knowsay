"use client";
import { AuthButtons } from "@/components/auth";
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function HomePage() {
  const { isSignedIn } = useAuth();
  if (isSignedIn) redirect("/dashboard"); // Redirige vers le dashboard si connecté

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-6">
      <h1 className="text-4xl font-bold text-gray-900">Welcome to Knowsay</h1>
      <p className="text-lg text-gray-600 mt-2">A quiz platform for everyone</p>
        <div className="mt-6">
             <AuthButtons />
        </div>
    </main>
  );
}