"use client";

import { useState } from "react";
import { SortableQuestionList } from "./sortable-question-list";
import { AddQuestionButton } from "./add-question-button";
import { usePathname } from "next/navigation";
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Question } from "@/schemas/questionSchema";

type QuestionManagerProps = {
  initialQuestions: Question[];
};

export function QuestionsManager({ initialQuestions }: QuestionManagerProps) {
  const pathname = usePathname();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const [questions, setQuestions] = useState<Question[]>(initialQuestions);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Quiz Questions</h3>

        <AddQuestionButton pathname={pathname} />
      </div>

      <div className="mt-8">
        <SortableQuestionList
          sensors={sensors}
          initialQuestions={questions}
          onReorder={(reorderedQuestions) => {
            setQuestions(reorderedQuestions);
          }}
        />
      </div>
    </div>
  );
}
