"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { TestQuestionWithQcm } from "@/schemas/testQuestionSchema";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableTestQuestionList } from "./sortable-test-question-list";

type TestQuestionsManagerProps = {
  initialTestQuestions: TestQuestionWithQcm[];
};

export function TestQuestionsManager({
  initialTestQuestions,
}: TestQuestionsManagerProps) {
  const pathname = usePathname();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const [testQuestions, setTestQuestions] =
    useState<TestQuestionWithQcm[]>(initialTestQuestions);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Test Questions</h3>

        <Button variant="outline" size="sm" className="gap-1" asChild>
          <a href={`${pathname}/questions/new`}>
            <Plus className="h-4 w-4" />
            <span>Add Question</span>
          </a>
        </Button>
      </div>

      <div className="mt-8">
        <SortableTestQuestionList
          sensors={sensors}
          initialTestQuestions={testQuestions}
          onReorder={(reorderedTestQuestions) => {
            setTestQuestions(reorderedTestQuestions);
          }}
        />
      </div>
    </div>
  );
}
