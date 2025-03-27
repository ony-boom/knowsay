"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { Card, CardContent } from "@/components/ui/card";
import { SortableItem } from "@/components/quiz/create/sortable-item";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlusIcon, Trash2 } from "lucide-react";
import { challengeQuizWithQuizArraySchema } from "@/schemas/challengeQuizSchema";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Button } from "../ui/button";

// Schema for a challenge quiz item, including linked quiz details
const sortableQuizzesSchema = z.object({
  quizzes: challengeQuizWithQuizArraySchema,
});

export type SortableQuizzesSchema = z.infer<typeof sortableQuizzesSchema>;

interface QuizManagerProps {
  initialQuizzes: SortableQuizzesSchema["quizzes"];
}
interface QuizCardProps {
  quizItem: SortableQuizzesSchema["quizzes"][number];
  index: number;
  onDelete?: (id: string) => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ quizItem, index, onDelete }) => {
  return (
    <Card className="group relative border transition-all hover:shadow-md">
      <CardContent className="flex items-center gap-4 p-3">
        <div className="bg-primary/10 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full">
          <span className="text-primary text-xs font-medium">{index + 1}</span>
        </div>
        <div className="flex flex-1 items-center justify-between gap-2 overflow-hidden">
          <h4 className="text-foreground group-hover:text-primary truncate text-sm font-medium">
            {quizItem.quiz.title}
          </h4>
          <div className="flex items-center gap-4">
            <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap">
              {quizItem.quiz.difficulty}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive h-7 w-7 rounded-full"
              onClick={() => onDelete?.(quizItem.quiz.quiz_id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="sr-only">Remove quiz from challenge</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AddQuizButton: React.FC = () => {
  const pathname = usePathname();
  return (
    <Link
      href={`${pathname}/add-quiz`}
      className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow transition-colors focus-visible:ring-1 focus-visible:outline-none"
    >
      <PlusIcon className="mr-2 h-4 w-4" />
      Add Quiz
    </Link>
  );
};

export const QuizManager: React.FC<QuizManagerProps> = ({ initialQuizzes }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
  );

  const [quizzes, setQuizzes] = useState(initialQuizzes);

  const form = useForm<SortableQuizzesSchema>({
    resolver: zodResolver(sortableQuizzesSchema),
    defaultValues: { quizzes },
  });

  const { fields, move } = useFieldArray({
    control: form.control,
    name: "quizzes",
    keyName: "_id",
  });

  // Update form values when quizzes state changes
  useEffect(() => {
    form.reset({ quizzes });
  }, [quizzes, form]);

  const handleMove = async ({
    activeIndex,
    overIndex,
    quizId,
  }: {
    activeIndex: number;
    overIndex: number;
    quizId: string;
  }) => {
    console.log("Moving quiz:", { activeIndex, overIndex, quizId });

    // Create a new array with the moved item
    const updatedQuizzes = [...quizzes];
    const [movedItem] = updatedQuizzes.splice(activeIndex, 1);
    updatedQuizzes.splice(overIndex, 0, movedItem);

    // Update local state
    setQuizzes(updatedQuizzes);

    // Update form state
    move(activeIndex, overIndex);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Challenge Quizzes</h3>
        <AddQuizButton />
      </div>

      {fields.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center gap-4">
            <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-full">
              <PlusIcon className="text-muted-foreground h-10 w-10" />
            </div>
            <h3 className="text-xl font-semibold tracking-tight">
              No quizzes yet
            </h3>
            <p className="text-muted-foreground text-center">
              Get started by adding quizzes to this challenge to create a
              complete learning experience.
            </p>
          </div>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          onDragEnd={(event) => {
            const { active, over } = event;
            if (over && active.id !== over.id) {
              const activeIndex = fields.findIndex((q) => q.id === active.id);
              const overIndex = fields.findIndex((q) => q.id === over.id);
              handleMove({
                activeIndex,
                overIndex,
                quizId: active.id as string,
              });
            }
          }}
        >
          <SortableContext
            items={fields.map((q) => q.id)}
            strategy={rectSortingStrategy}
          >
            <div className="flex flex-col space-y-3">
              {fields.map((quizItem, index) => (
                <SortableItem key={quizItem.id} id={quizItem.id}>
                  <QuizCard quizItem={quizItem} index={index} />
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};
