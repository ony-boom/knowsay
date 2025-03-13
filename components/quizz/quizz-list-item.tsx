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

export const QuizzListItem = ({
  title,
  description,
  category,
  difficulty,
  createdAt,
}: QuizzListItemProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="w-full transition-shadow hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-medium">{title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {description}
            </CardDescription>
            <div className="mt-2 flex gap-2">
              <span className="bg-secondary inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
                {difficulty}
              </span>
              <span className="bg-primary/10 text-primary inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
                {category}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground flex justify-end text-xs">
              <span>Created: {createdAt}</span>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary/50 rounded-lg py-3">
              <p className="text-muted-foreground text-xs font-medium">
                Category
              </p>
              <p className="font-medium">{category}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg py-3">
              <p className="text-muted-foreground text-xs font-medium">
                Difficulty
              </p>
              <p className="font-medium">{difficulty}</p>
            </div>
          </div>
          <div className="bg-secondary/50 rounded-lg py-3">
            <p className="text-muted-foreground text-xs font-medium">Created</p>
            <p className="font-medium">{createdAt}</p>
          </div>
        </div>
        <Button>Take Quiz</Button>
      </DialogContent>
    </Dialog>
  );
};

type QuizzListItemProps = {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  createdAt: string;
};
