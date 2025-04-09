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
import { useTranslations } from "next-intl";

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
  const t = useTranslations();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteTestAction(testId);

      if (result.success) {
        toast.success(t("testDelete.successTitle"), {
          description: t("testDelete.successDescription"),
        });
        if (onDelete) {
          onDelete(testId);
        }
      } else {
        toast.error(result.errors?._form?.[0] || t("testDelete.failedTitle"), {
          description: t("testDelete.failedDescription"),
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(t("testDelete.unexpectedErrorTitle"), {
        description: t("testDelete.unexpectedErrorDescription"),
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
              aria-label={t("testDelete.deleteTest")}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription className="line-clamp-2">
          {description || t("testList.noDescription")}
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
          <div className="text-muted-foreground text-sm">
            {t("testList.noSchedule")}
          </div>
        )}
        <div className="text-muted-foreground flex items-center text-sm">
          <Clock className="mr-1 h-4 w-4" />
          <span>
            {t("testList.created")}{" "}
            {formatDistanceToNow(createdAt, { addSuffix: true })}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/home/test/${testId}/edit`}>
            {t("testList.manageTest")}
          </Link>
        </Button>
      </CardFooter>

      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {t("testDelete.deleteTest")}
            </DialogTitle>
            <DialogDescription>
              {t("testDelete.deleteConfirmation", { title })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              {t("testDelete.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? t("testDelete.deleting") : t("testDelete.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
