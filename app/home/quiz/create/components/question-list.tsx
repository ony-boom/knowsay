import { Card, CardContent } from "@/components/ui/card";
import { QuestionListProps } from "../types";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Edit, Trash2 } from "lucide-react";

export const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  onEdit,
  onDelete,
}) => {
  if (questions.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed p-4 text-center sm:p-8">
        <p className="text-muted-foreground">
          No questions yet. Add your first question to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((question, index) => (
        <Card
          key={question.id}
          className="border-l-primary overflow-hidden border-l-4 transition-all hover:shadow-md"
        >
          <CardContent className="p-3 sm:p-6">
            <div className="mb-2 flex flex-col justify-between gap-2 sm:mb-4 sm:flex-row sm:items-center sm:gap-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium sm:h-8 sm:w-8 sm:text-base">
                  {index + 1}
                </div>
                <h4 className="line-clamp-2 text-base font-semibold sm:line-clamp-1 sm:text-lg">
                  {question.question}
                </h4>
              </div>
              <div className="flex space-x-1 self-end sm:self-auto">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(question)}
                      className="h-7 w-7 rounded-full sm:h-8 sm:w-8"
                    >
                      <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="sr-only">Edit question</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent />
                </Sheet>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(question.id)}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive h-7 w-7 rounded-full sm:h-8 sm:w-8"
                >
                  <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="sr-only">Delete question</span>
                </Button>
              </div>
            </div>

            <div className="mt-2 grid gap-1.5 sm:mt-3 sm:gap-2">
              {question.answers.map((answer, idx) => (
                <div
                  key={answer.id}
                  className={`flex items-center rounded-lg p-2 sm:p-2.5 ${
                    answer.isCorrect
                      ? "bg-green-50 dark:bg-green-950/30"
                      : "bg-muted/40"
                  }`}
                >
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium sm:h-7 sm:w-7 sm:text-sm ${
                      answer.isCorrect
                        ? "bg-green-100 text-green-800 dark:bg-green-900/70 dark:text-green-300"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="ml-2 flex-grow text-sm sm:ml-3 sm:text-base">
                    {answer.text}
                  </span>
                  {answer.isCorrect && (
                    <span className="mr-2 ml-1 inline-flex items-center text-xs font-medium whitespace-nowrap text-green-600 sm:ml-2 dark:text-green-400">
                      <BadgeCheck className="mr-0.5 h-3 w-3 sm:mr-1 sm:h-3.5 sm:w-3.5" />
                      Correct
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
