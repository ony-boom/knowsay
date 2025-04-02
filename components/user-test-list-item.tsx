"use client";

import { deleteTestAction } from "@/lib/actions/delete-test";
import { useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import { CalendarIcon, Clock, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export const UserTestListItem = ({
  testId,
  title,
  description,
  startTime,
  endTime,
  createdAt,
  onDelete,
}: {
  testId: string;
  title: string;
  description: string;
  startTime: Date | null;
  endTime: Date | null;
  createdAt: Date;
  onDelete?: (testId: string) => void;
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isScheduled = startTime && endTime;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteTestAction(testId);

      if (result.success) {
        toast.success("Test deleted successfully", {
          description: "Your test has been permanently removed",
        });
        if (onDelete) {
          onDelete(testId);
        }
      } else {
        toast.error(result.errors?._form?.[0] || "Failed to delete test", {
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

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="line-clamp-1">{title}</CardTitle>
          <div className="flex space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteDialogOpen(true);
              }}
              aria-label="Delete Test"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription className="line-clamp-2">
          {description || "No description available"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {isScheduled ? (
          <div className="text-muted-foreground flex items-center text-sm">
            <CalendarIcon className="mr-1 h-4 w-4" />
            <span>
              {startTime.toLocaleDateString()} - {endTime.toLocaleDateString()}
            </span>
          </div>
        ) : (
          <div className="text-muted-foreground text-sm">No schedule set</div>
        )}
        <div className="text-muted-foreground flex items-center text-sm">
          <Clock className="mr-1 h-4 w-4" />
          <span>
            Created {formatDistanceToNow(createdAt, { addSuffix: true })}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/home/test/${testId}/edit`}>Manage Test</Link>
        </Button>
      </CardFooter>

      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Delete Test</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{title}&quot;? This action
              cannot be undone and all associated questions, attempts, and data
              will be permanently removed.
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
              {isDeleting ? "Deleting..." : "Delete Test"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
