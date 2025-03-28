"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Pencil, Trash2, Trophy, Clock } from "lucide-react";
import { useState } from "react";
import { deleteChallengeAction } from "@/lib/actions/delete-challenge";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { type Challenge } from "@/schemas/challengeSchema";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

type ChallengeListItemProps = {
  challenge: Challenge;
  participantCount?: number;
  onDelete?: (challengeId: string) => void;
};

export const UserChallengeListItem = ({
  challenge,
  participantCount = 0,
  onDelete,
}: ChallengeListItemProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteChallengeAction(challenge.challenge_id);

      if (result.success) {
        toast.success("Challenge deleted successfully", {
          description: "Your challenge has been permanently removed",
        });
        if (onDelete) {
          onDelete(challenge.challenge_id);
        }
      } else {
        toast.error(result.errors?._form?.[0] || "Failed to delete challenge", {
          description: "Please try again later",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred", {
        description: "Please try again later",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const formattedStartTime = format(challenge.start_time, "PPP 'at' p");
  const formattedEndTime = format(challenge.end_time, "PPP 'at' p");
  const timeLeftMs = new Date(challenge.end_time).getTime() - Date.now();
  const isActive = timeLeftMs > 0;

  const duration = Math.abs(
    new Date(challenge.end_time).getTime() -
      new Date(challenge.start_time).getTime(),
  );
  const durationHours = Math.round(duration / (1000 * 60 * 60));

  return (
    <Card className="group w-full transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-medium">
            {challenge.title}
          </CardTitle>
          <div className="flex space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              asChild
              onClick={(e) => e.stopPropagation()}
            >
              <Link
                href={`/home/challenge/${challenge.challenge_id}/edit`}
                aria-label="Edit challenge"
              >
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteDialogOpen(true);
              }}
              aria-label="Delete challenge"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription className="line-clamp-2">
          {challenge.description || "No description provided"}
        </CardDescription>

        {/* Challenge metadata tags */}
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="bg-secondary inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
            {challenge.is_team_based ? "Team-based" : "Individual"}
          </span>
          <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900 dark:text-amber-200">
            <Clock className="mr-1 h-3 w-3" /> {durationHours}h
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              isActive
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {isActive ? "Active" : "Ended"}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {/* Challenge stats and dates */}
        <div className="flex flex-col gap-1">
          <div className="text-muted-foreground text-xs">
            Starts: {formattedStartTime}
          </div>
          <div className="text-muted-foreground text-xs">
            Ends: {formattedEndTime}
          </div>
          <div className="text-primary mt-2 flex items-center text-xs font-medium">
            <Trophy className="mr-1 h-3 w-3" />
            {participantCount}{" "}
            {participantCount === 1 ? "participant" : "participants"}
          </div>
        </div>
      </CardContent>

      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Delete Challenge
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{challenge.title}&quot;?
              This action cannot be undone and all associated data will be
              permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Challenge"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
