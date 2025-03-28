import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { EmptyQuestionState } from "./sortable-question-list/empty-question-state";
import { QuizQuestionCard } from "./sortable-question-list/quiz-question-card";
import { closestCenter, DndContext, useSensors } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./sortable-item";
import { updateQuestionOrder } from "@/lib/actions/update-question-order";
import {
  QuizQuestionWithQcm,
  quizQuestionWithQcmSchema,
} from "@/schemas/quizQuestionSchema";

// Schema for the form
const sortableQuizQuestionsSchema = z.object({
  questions: z.array(quizQuestionWithQcmSchema),
});

export type SortableQuizQuestionsSchema = z.infer<
  typeof sortableQuizQuestionsSchema
>;

interface SortableQuestionListProps {
  initialQuizQuestions: QuizQuestionWithQcm[];
  onReorder: (questions: QuizQuestionWithQcm[]) => void;
  sensors: ReturnType<typeof useSensors>;
}

export const SortableQuizQuestionList: React.FC<SortableQuestionListProps> = ({
  initialQuizQuestions,
  onReorder,
  sensors,
}: SortableQuestionListProps) => {
  const form = useForm<SortableQuizQuestionsSchema>({
    resolver: zodResolver(sortableQuizQuestionsSchema),
    defaultValues: {
      questions: initialQuizQuestions,
    },
  });

  const { fields, move } = useFieldArray({
    control: form.control,
    name: "questions",
    keyName: "_id",
  });

  const handleMove = async ({
    activeIndex,
    overIndex,
    questionId,
  }: {
    activeIndex: number;
    overIndex: number;
    questionId: string;
  }) => {
    // Update local state
    move(activeIndex, overIndex);
    const updatedQuestions = form.getValues().questions;
    onReorder(updatedQuestions);

    // Update on server
    const result = await updateQuestionOrder(questionId, overIndex + 1);

    if (!result.success) {
      console.error("Failed to update question order:", result.error);
      // You could add toast notification here
    }
  };

  if (fields.length === 0) {
    return <EmptyQuestionState />;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={(event) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
          const activeIndex = fields.findIndex((q) => q.id === active.id);
          const overIndex = fields.findIndex((q) => q.id === over.id);
          handleMove({
            activeIndex,
            overIndex,
            questionId: active.id as string,
          });
        }
      }}
    >
      <SortableContext
        items={fields.map((q) => q.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {fields.map((question, index) => (
            <SortableItem key={question.id} id={question.id}>
              <QuizQuestionCard question={question} index={index} />
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
