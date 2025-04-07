"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, Award, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
export default function ChallengeInvitePage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [joinStatus] = useState<"idle" | "success" | "error">("idle");
  const [challengeDetails] = useState<{
    title: string;
    description: string;
  }>({
    title: "AI Programming Challenge",
    description:
      "Join our exciting programming challenge to test your AI development skills and compete with peers.",
  });

  // No-op function for the accept button
  const acceptChallenge = () => {
    // Button click does nothing
    console.log("Accept button clicked");
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <Award className="text-primary h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {challengeDetails.title}
          </CardTitle>
          <CardDescription className="mt-2">
            {challengeDetails.description}
          </CardDescription>
          {email && (
            <p className="text-muted-foreground mt-4 text-sm">
              Invitation sent to: <span className="font-medium">{email}</span>
            </p>
          )}
        </CardHeader>

        <CardContent>
          {joinStatus === "success" ? (
            <Alert className="border-green-500 bg-green-50 text-green-800">
              <Check className="h-4 w-4 text-green-800" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                You have successfully joined the challenge. Redirecting you to
                the challenge page...
              </AlertDescription>
            </Alert>
          ) : joinStatus === "error" ? (
            <Alert className="border-red-500 bg-red-50 text-red-800">
              <AlertCircle className="h-4 w-4 text-red-800" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                There was a problem joining the challenge. Please try again or
                contact support.
              </AlertDescription>
            </Alert>
          ) : (
            <Button onClick={acceptChallenge} className="w-full gap-2">
              <Mail className="h-4 w-4" />
              Accept Challenge Invitation
            </Button>
          )}
        </CardContent>

        <CardFooter className="text-muted-foreground flex flex-col text-center text-sm">
          <p>
            By accepting this challenge, you agree to participate according to
            the challenge rules.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
