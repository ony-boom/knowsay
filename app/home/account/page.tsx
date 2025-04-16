"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { signOut } from "next-auth/react";
import { AlertCircle, LogOut } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";

export default function Account() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetchUserData(session.user.email);
    } else if (status === "unauthenticated") {
      setIsLoading(false);
    }
  }, [status, session]);

  const fetchUserData = async (email: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();
        
      if (error) throw error;
      setUserData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[50vh]">Loading...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!session) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Authentication Required</AlertTitle>
        <AlertDescription>Please sign in to view your account.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Account Profile</CardTitle>
          <CardDescription>Manage your account information</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={session.user.image || undefined} alt={session.user.name || "User"} />
              <AvatarFallback>{session.user.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-2xl font-bold">{session.user.name}</h3>
              <p className="text-muted-foreground">{session.user.email}</p>
              {userData?.role && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {userData.role}
                </span>
              )}
            </div>
          </div>
          
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <div className="p-2 bg-muted rounded-md">{session.user.email}</div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="provider">Sign-in Method</Label>
              <div className="p-2 bg-muted rounded-md">
                {userData?.provider || "Google"}
              </div>
            </div>
            
            {userData?.clerk_id && (
              <div className="grid gap-2">
                <Label htmlFor="legacy-id">Legacy ID (Clerk)</Label>
                <div className="p-2 bg-muted rounded-md text-xs font-mono overflow-auto">
                  {userData.clerk_id}
                </div>
              </div>
            )}
          </div>
          
          <div className="pt-6 border-t">
            <Button 
              variant="destructive"
              onClick={() => setIsLogoutDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Sign Out</DialogTitle>
            <DialogDescription>
              Are you sure you want to sign out of your account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLogoutDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => signOut({ callbackUrl: '/' })}>
              Sign Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
