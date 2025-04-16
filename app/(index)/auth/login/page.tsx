"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/home";
  const error = searchParams.get("error");
  
  const handleLogin = async (provider: string) => {
    setIsLoading(true);
    await signIn(provider, { callbackUrl });
  };

  return (
    <div className="flex h-full min-h-[50vh] w-full flex-col items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
              {error === "OAuthAccountNotLinked" 
                ? "This email is already associated with another account." 
                : "An error occurred while signing in. Please try again."}
            </div>
          )}
          
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => handleLogin("google")}
            disabled={isLoading}
          >
            <FcGoogle className="h-5 w-5" />
            Sign in with Google
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-sm text-muted-foreground text-center">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
