import Link from "next/link";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export const QuizListItem = ({
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
        <Card className="w-full transition-shadow hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-medium">{title}</CardTitle>
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
            <div className="text-muted-foreground flex justify-end text-xs">
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

        {/* Action button */}
        <div className="mt-4 flex justify-center sm:mt-6 sm:justify-end">
          <Button asChild className="w-full sm:w-auto">
            <Link href={`/home/quiz/${quizId}`}>Take Quiz</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

type QuizListItemProps = {
  quizId: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  createdAt: string;
};
