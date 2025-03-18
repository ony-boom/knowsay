"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSignUp } from "@clerk/nextjs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import GoogleSignUpButton from "@/components/auth/google-signup-button";

// Schéma de validation avec Zod
const formSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters long" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .regex(/[a-zA-Z0-9]/, { message: "Password must be alphanumeric" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export default function RegisterWithUsername() {
  const { signUp, isLoaded } = useSignUp();
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isLoaded) return;

    try {
      await signUp.create({
        username: values.username,
        password: values.password,
      });
    } catch (err: any) {
      setError(
        err.errors?.[0]?.message || "An error occurred. Please try again.",
      );
    }
  }

  // Fonction pour l'inscription avec Google
  const handleGoogleSignUp = () => {
    signUp?.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/home",
    });
  };

  return (
    <div className="flex h-full min-h-[60vh] w-full items-center justify-center px-4">
      <div id="clerk-captcha"></div>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Register using your username and password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="mb-2 text-sm text-red-500">{error}</p>}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4">
                {/* Username */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="username">Username</FormLabel>
                      <FormControl>
                        <Input
                          id="username"
                          placeholder="your_username"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          id="password"
                          placeholder="******"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="confirmPassword">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          id="confirmPassword"
                          placeholder="******"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Register
                </Button>
              </div>
            </form>
          </Form>

          {/* Bouton pour l'inscription avec Google */}
          <div className="mt-4">
            <GoogleSignUpButton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
