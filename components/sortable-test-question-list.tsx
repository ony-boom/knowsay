import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { closestCenter, DndContext, useSensors } from "@dnd-kit/core";
import { SortableItem } from "./quiz/create/sortable-item";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  TestQuestionWithQcm,
  testQuestionWithQcmSchema,
} from "@/schemas/testQuestionSchema";

// Schema for the form
const sortableTestQuestionsSchema = z.object({
  questions: z.array(testQuestionWithQcmSchema),
});

export type SortableTestQuestionsSchema = z.infer<
  typeof sortableTestQuestionsSchema
>;

export const EmptyQuestionState = () => {
  return (
    <div className="bg-muted/50 border-muted-foreground/50 flex flex-col items-center justify-center rounded-lg border border-dashed p-8">
      <h3 className="text-lg font-medium">No questions added yet</h3>
      <p className="text-muted-foreground mt-1 text-sm">
        Add questions to your test by selecting from the question bank or
        creating new ones.
      </p>
    </div>
  );
};

interface TestQuestionCardProps {
  question: TestQuestionWithQcm;
  index: number;
}

export const TestQuestionCard: React.FC<TestQuestionCardProps> = ({
  question,
  index,
}) => {
  return (
    <div className="bg-card rounded-lg border p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium">
            {index + 1}
          </div>
          <h3 className="text-sm font-medium">{question.qcm.question}</h3>
        </div>
        <div className="text-muted-foreground flex items-center space-x-1 text-sm">
          <span>{question.points} pts</span>
          <span className="mx-1">•</span>
          <span>
            {question.time_limit ? `${question.time_limit}s` : "No time limit"}
          </span>
          <span className="mx-1">•</span>
          <span>{question.is_free_text ? "Free text" : "Multiple choice"}</span>
        </div>
      </div>
    </div>
  );
};

interface SortableTestQuestionListProps {
  initialTestQuestions: TestQuestionWithQcm[];
  onReorder: (questions: TestQuestionWithQcm[]) => void;
  sensors: ReturnType<typeof useSensors>;
}

export const SortableTestQuestionList: React.FC<
  SortableTestQuestionListProps
> = ({
  initialTestQuestions,
  onReorder,
  sensors,
}: SortableTestQuestionListProps) => {
  const form = useForm<SortableTestQuestionsSchema>({
    resolver: zodResolver(sortableTestQuestionsSchema),
    defaultValues: {
      questions: initialTestQuestions,
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
    console.log("questionId", questionId);
    // Update local state
    move(activeIndex, overIndex);
    const updatedQuestions = form.getValues().questions;
    onReorder(updatedQuestions);

    // Update on server
    // const result = await updateTestQuestionOrder(questionId, overIndex + 1);

    // if (!result.success) {
    //   console.error("Failed to update test question order:", result.error);
    // You could add toast notification here
    // }
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
              <TestQuestionCard question={question} index={index} />
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
