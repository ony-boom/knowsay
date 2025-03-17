// filepath: app/home/quiz/create/components/sortable-question-list.tsx
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeCheck, Edit, GripVertical, Trash2 } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Sortable,
  SortableDragHandle,
  SortableItem,
} from "@/components/ui/sortable";

// Schema for the form
const sortableQuestionsSchema = z.object({
  questions: z.array(
    z.object({
      id: z.string().uuid(),
      question: z.string().min(5, "Question must have at least 5 characters"),
      type: z.enum(["QCM", "OPEN", "ORDER", "MATCHING"]).default("QCM"),
      answers: z.array(
        z.object({
          id: z.string(),
          text: z.string(),
          isCorrect: z.boolean(),
        }),
      ),
    }),
  ),
});

type SortableQuestionsSchema = z.infer<typeof sortableQuestionsSchema>;

interface SortableQuestionListProps {
  initialQuestions: SortableQuestionsSchema["questions"];
  onEdit: (question: SortableQuestionsSchema["questions"][0]) => void;
  onDelete: (id: string) => void;
  onReorder: (questions: SortableQuestionsSchema["questions"]) => void;
}

export const SortableQuestionList: React.FC<SortableQuestionListProps> = ({
  initialQuestions,
  onEdit,
  onDelete,
  onReorder,
}) => {
  const form = useForm<SortableQuestionsSchema>({
    resolver: zodResolver(sortableQuestionsSchema),
    defaultValues: {
      questions: initialQuestions,
    },
  });

  const { fields, move } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const handleMove = ({
    activeIndex,
    overIndex,
  }: {
    activeIndex: number;
    overIndex: number;
  }) => {
    move(activeIndex, overIndex);
    const updatedQuestions = form.getValues().questions;
    onReorder(updatedQuestions);
  };

  if (fields.length === 0) {
    return <EmptyQuestionState />;
  }

  return (
    <Sortable
      value={fields}
      onMove={handleMove}
      overlay={
        <Card className="border-l-primary border-l-4 opacity-60">
          <CardContent className="p-2">
            <div className="bg-muted/30 h-10 animate-pulse rounded-md"></div>
          </CardContent>
        </Card>
      }
    >
      <div className="space-y-2">
        {fields.map((question, index) => (
          <SortableItem key={question.id} value={question.id}>
            <QuestionCard
              question={question}
              index={index}
              onEdit={() => onEdit(question)}
              onDelete={() => onDelete(question.id)}
            />
          </SortableItem>
        ))}
      </div>
    </Sortable>
  );
};

// Define the components in the same file, or move them to separate files
// and import them as shown above

const EmptyQuestionState = () => (
  <div className="rounded-lg border-2 border-dashed p-4 text-center sm:p-8">
    <p className="text-muted-foreground">
      No questions yet. Add your first question to get started.
    </p>
  </div>
);

interface QuestionCardProps {
  question: SortableQuestionsSchema["questions"][0];
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  onEdit,
  onDelete,
}) => (
  <Card className="border-l-primary overflow-hidden border-l-2 transition-all hover:shadow-sm">
    <CardContent className="p-2">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <QuestionInfo question={question} index={index} />
        <QuestionActions
          question={question}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </CardContent>
  </Card>
);

interface QuestionInfoProps {
  question: SortableQuestionsSchema["questions"][0];
  index: number;
}

const QuestionInfo: React.FC<QuestionInfoProps> = ({ question, index }) => (
  <div className="flex min-w-0 flex-1 items-center gap-2">
    <div className="bg-primary/10 text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium">
      {index + 1}
    </div>
    <h4 className="line-clamp-1 text-sm font-medium">{question.question}</h4>
    <div className="text-muted-foreground ml-1 shrink-0 text-xs">
      {question.type}
    </div>
  </div>
);

interface QuestionActionsProps {
  question: SortableQuestionsSchema["questions"][0];
  onEdit: () => void;
  onDelete: () => void;
}

const QuestionActions: React.FC<QuestionActionsProps> = ({
  question,
  onEdit,
  onDelete,
}) => (
  <div className="mt-2 flex shrink-0 space-x-2 self-end sm:mt-0 sm:space-x-3 sm:self-auto">
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 text-xs">
          View Answers
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <QuestionAnswersSheet question={question} />
      </SheetContent>
    </Sheet>

    <SortableDragHandle className="hover:bg-accent hover:text-accent-foreground flex h-7 w-7 items-center justify-center rounded-full">
      <GripVertical className="h-3.5 w-3.5" aria-hidden="true" />
    </SortableDragHandle>

    <Button
      variant="ghost"
      size="icon"
      onClick={onEdit}
      className="h-7 w-7 rounded-full"
    >
      <Edit className="h-3.5 w-3.5" />
      <span className="sr-only">Edit question</span>
    </Button>

    <Button
      variant="ghost"
      size="icon"
      onClick={onDelete}
      className="text-destructive hover:bg-destructive/10 hover:text-destructive h-7 w-7 rounded-full"
    >
      <Trash2 className="h-3.5 w-3.5" />
      <span className="sr-only">Delete question</span>
    </Button>
  </div>
);

interface QuestionAnswersSheetProps {
  question: SortableQuestionsSchema["questions"][0];
}

const QuestionAnswersSheet: React.FC<QuestionAnswersSheetProps> = ({
  question,
}) => (
  <div className="mt-6 space-y-2">
    <h3 className="line-clamp-2 text-lg font-semibold">{question.question}</h3>
    <div className="mt-2 grid gap-1.5">
      {question.answers.map((answer, idx) => (
        <AnswerItem key={answer.id} answer={answer} index={idx} />
      ))}
    </div>
  </div>
);

interface AnswerItemProps {
  answer: {
    id: string;
    text: string;
    isCorrect: boolean;
  };
  index: number;
}

const AnswerItem: React.FC<AnswerItemProps> = ({ answer, index }) => (
  <div
    className={`flex items-center rounded-lg p-2 ${
      answer.isCorrect ? "bg-green-50 dark:bg-green-950/30" : "bg-muted/40"
    }`}
  >
    <div
      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
        answer.isCorrect
          ? "bg-green-100 text-green-800 dark:bg-green-900/70 dark:text-green-300"
          : "bg-muted text-muted-foreground"
      }`}
    >
      {String.fromCharCode(65 + index)}
    </div>
    <span className="ml-2 flex-grow text-sm">{answer.text}</span>
    {answer.isCorrect && (
      <span className="mr-2 ml-1 inline-flex items-center text-xs font-medium whitespace-nowrap text-green-600 dark:text-green-400">
        <BadgeCheck className="mr-0.5 h-3 w-3" />
        <span className="hidden sm:inline">Correct</span>
      </span>
    )}
  </div>
);
