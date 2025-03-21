import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { EmptyQuestionState } from "./sortable-question-list/empty-question-state";
import { QuestionCard } from "./sortable-question-list/question-card";
import { closestCenter, DndContext, useSensors } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./sortable-item";

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
  sensors: ReturnType<typeof useSensors>;
}

export const SortableQuestionList: React.FC<SortableQuestionListProps> = ({
  initialQuestions,
  onEdit,
  onDelete,
  onReorder,
  sensors,
}: SortableQuestionListProps) => {
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
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={(event) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
          const activeIndex = fields.findIndex((q) => q.id === active.id);
          const overIndex = fields.findIndex((q) => q.id === over.id);
          handleMove({ activeIndex, overIndex });
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
              <QuestionCard
                question={question}
                index={index}
                onEdit={() => onEdit(question)}
                onDelete={() => onDelete(question.id)}
              />
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
