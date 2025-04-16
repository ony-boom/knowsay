"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleRegister = async (provider: string) => {
    setIsLoading(true);
    await signIn(provider, { callbackUrl: "/home" });
  };

  return (
    <div className="flex h-full min-h-[60vh] w-full items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
          <CardDescription>Sign up to get started with Knowsay</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => handleRegister("google")}
            disabled={isLoading}
          >
            <FcGoogle className="h-5 w-5" />
            Sign up with Google
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-sm text-muted-foreground text-center">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
