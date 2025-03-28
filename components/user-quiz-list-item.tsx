import Link from "next/link";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Pencil, Trash2 } from "lucide-react";

type QuizListItemProps = {
  quizId: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  createdAt: string;
};

export const UserQuizListItem = ({
  quizId,
  title,
  description,
  category,
  difficulty,
  createdAt,
}: QuizListItemProps) => {
  return (
    <Dialog>
      {/* Card trigger that opens the dialog when clicked */}
      <DialogTrigger asChild>
        <Card className="group w-full transition-all hover:shadow-md">
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg font-medium">{title}</CardTitle>
              <div className="opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  asChild
                >
                  <Link
                    href={`/home/quiz/${quizId}/edit`}
                    aria-label="Edit quiz"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <CardDescription className="line-clamp-2">
              {description}
            </CardDescription>
            {/* Quiz metadata tags */}
            <div className="mt-2 flex gap-2">
              <span className="bg-secondary inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
                {difficulty}
              </span>
              <span className="bg-primary/10 text-primary inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-ellipsis whitespace-nowrap">
                {category}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {/* Creation date information */}
            <div className="text-muted-foreground flex items-center justify-between text-xs">
              <span>Created: {createdAt}</span>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>

      {/* Dialog content - Appears when card is clicked */}
      <DialogContent className="max-w-[95vw] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold break-words sm:text-xl">
            {title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs sm:text-sm">
            {description}
          </DialogDescription>
        </DialogHeader>

        {/* Quiz details section */}
        <div className="mt-3 space-y-3 sm:mt-4 sm:space-y-4">
          {/* Category and Difficulty information */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <div className="bg-secondary/50 rounded-lg p-2 sm:py-3">
              <p className="text-muted-foreground text-xs font-medium">
                Category
              </p>
              <p className="text-sm font-medium sm:text-base">{category}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-2 sm:py-3">
              <p className="text-muted-foreground text-xs font-medium">
                Difficulty
              </p>
              <p className="text-sm font-medium sm:text-base">{difficulty}</p>
            </div>
          </div>

          {/* Creation date detail */}
          <div className="bg-secondary/50 rounded-lg p-2 sm:py-3">
            <p className="text-muted-foreground text-xs font-medium">Created</p>
            <p className="text-sm font-medium sm:text-base">{createdAt}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-6">
          <Button variant="outline" asChild>
            <Link href={`/home/quiz/${quizId}/edit`}>
              <span className="flex items-center gap-2">
                <Pencil className="h-4 w-4" />
                Edit
              </span>
            </Link>
          </Button>
          <Button variant="destructive" asChild>
            <Link href={`/home/quiz/${quizId}/delete`}>
              <span className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Delete
              </span>
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
