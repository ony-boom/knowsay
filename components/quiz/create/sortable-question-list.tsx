// filepath: app/home/quiz/create/components/sortable-question-list.tsx
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Card, CardContent } from "@/components/ui/card";
import { Sortable, SortableItem } from "@/components/ui/sortable";
import { EmptyQuestionState } from "./sortable-question-list/empty-question-state";
import { QuestionCard } from "./sortable-question-list/question-card";

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

export type SortableQuestionsSchema = z.infer<typeof sortableQuestionsSchema>;

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
