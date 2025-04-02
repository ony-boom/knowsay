"use client";

import { useState } from "react";
import { SortableQuizQuestionList } from "./sortable-quiz-question-list";
import { AddQuizQuestionButton } from "./add-quiz-question-button";
import { usePathname } from "next/navigation";
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { QuizQuestionWithQcm } from "@/schemas/quizQuestionSchema";

type QuizQuestionManagerProps = {
  initialQuizQuestions: QuizQuestionWithQcm[];
};

export function QuizQuestionsManager({
  initialQuizQuestions,
}: QuizQuestionManagerProps) {
  const pathname = usePathname();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const [quizQuestions, setQuizQuestions] =
    useState<QuizQuestionWithQcm[]>(initialQuizQuestions);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Quiz Questions</h3>

        <AddQuizQuestionButton pathname={pathname} />
      </div>

      <div className="mt-8">
        <SortableQuizQuestionList
          sensors={sensors}
          initialQuizQuestions={quizQuestions}
          onReorder={(reorderedQuizQuestions) => {
            setQuizQuestions(reorderedQuizQuestions);
          }}
        />
      </div>
    </div>
  );
}
