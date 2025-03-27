"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { Card, CardContent } from "@/components/ui/card";
import { SortableItem } from "@/components/quiz/create/sortable-item";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlusIcon } from "lucide-react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

// Schema for a challenge quiz item, including linked quiz details
const sortableQuizzesSchema = z.object({
  quizzes: z.array(
    z.object({
      id: z.string().uuid(), // challenge quiz id
      challenge_id: z.string().uuid(),
      quiz_id: z.string().uuid(),
      position: z.number().int().positive(),
      created_at: z.coerce.date(),
      quiz: z.object({
        quiz_id: z.string().uuid(),
        title: z.string().min(3, "Title is required"),
        description: z.string().nullable().optional(),
        difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
        is_public: z.boolean(),
      }),
    }),
  ),
});

export type SortableQuizzesSchema = z.infer<typeof sortableQuizzesSchema>;

interface QuizManagerProps {
  initialQuizzes: SortableQuizzesSchema["quizzes"];
}

interface QuizCardProps {
  quizItem: SortableQuizzesSchema["quizzes"][number];
  index: number;
}

const QuizCard: React.FC<QuizCardProps> = ({ quizItem, index }) => (
  <Card className="border transition-all hover:shadow">
    <CardContent className="p-4">
      <div className="flex flex-col gap-2">
        <h4 className="text-lg font-bold">
          {index + 1}. {quizItem.quiz.title}
        </h4>
        {quizItem.quiz.description && (
          <p className="text-muted-foreground text-sm">
            {quizItem.quiz.description}
          </p>
        )}
        <p className="text-muted-foreground text-xs">
          Difficulty: {quizItem.quiz.difficulty}
        </p>
      </div>
    </CardContent>
  </Card>
);

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

  const form = useForm<SortableQuizzesSchema>({
    resolver: zodResolver(sortableQuizzesSchema),
    defaultValues: { quizzes: initialQuizzes },
  });

  const { fields, move } = useFieldArray({
    control: form.control,
    name: "quizzes",
    keyName: "_id",
  });

  const [, setQuizzes] = useState(initialQuizzes);

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
    // Update local state
    move(activeIndex, overIndex);
    const updatedQuizzes = form.getValues().quizzes;
    setQuizzes(updatedQuizzes);
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
