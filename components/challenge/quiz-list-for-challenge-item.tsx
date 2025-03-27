import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

type QuizListForChallengeItemProps = {
  quizId: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  createdAt: string;
};

export const QuizListForChallengeItem = ({
  quizId,
  title,
  description,
  category,
  difficulty,
  createdAt,
}: QuizListForChallengeItemProps) => {
  console.log("Quiz id:", quizId);
  return (
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
  );
};
