"use client";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";

export const DeleteQuestionDialog = ({
  // id,
  // quizId,
  onClose,
}: {
  id: string;
  quizId: string;
  onClose: () => void;
}) => {
  const [isPending, startTransition] = React.useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        // Use the server action to delete the question
        // const deleteAction = deleteQuestion.bind(null, id, quizId);
        // await deleteAction();
        onClose(); // Close the dialog after successful deletion
      } catch (error) {
        console.error("Error deleting question:", error);
      }
    });
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Delete Question</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this question? This action cannot be
          undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="mt-4">
        <Button variant="outline" onClick={onClose} disabled={isPending}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isPending}
        >
          {isPending ? "Deleting..." : "Delete"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
