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
import { QuestionSchema, Question } from "@/schemas/questionSchema";
// Schema for the form
const sortableQuestionsSchema = z.object({
  questions: z.array(QuestionSchema),
});

export type SortableQuestionsSchema = z.infer<typeof sortableQuestionsSchema>;

interface SortableQuestionListProps {
  initialQuestions: Question[];
  onEdit: (question: Question) => void;
  onDelete: (id: string) => void;
  onReorder: (questions: Question[]) => void;
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
