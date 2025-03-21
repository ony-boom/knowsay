import { Answer } from "@/app/home/quiz/[id]/edit/answer/page";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  useSensors,
} from "@dnd-kit/core";
import { EmptyAnswers } from "./empty-answer";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./sortable-item";
import { AnswerItem } from "./answer-item";

type AnswerListProps = {
  answers: Answer[];
  sensors: ReturnType<typeof useSensors>;
  onDragEnd: (event: DragEndEvent) => void;
  onEdit: (updatedAnswer: Answer) => void;
  onToggleCorrect: (id: string) => void;
  onDelete: (id: string) => void;
};

export const AnswerList = ({
  answers,
  sensors,
  onDragEnd,
  onEdit,
  onToggleCorrect,
  onDelete,
}: AnswerListProps) => (
  <div className="space-y-4">
    <h3 className="font-medium">Answer Options</h3>
    {answers.length === 0 ? (
      <EmptyAnswers
        message="No answers yet"
        description="Add some answers to get started"
      />
    ) : (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={answers.map((a) => a.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {answers.map((answer, index) => (
              <SortableItem key={answer.id} id={answer.id}>
                <AnswerItem
                  answer={answer}
                  index={index}
                  onEdit={onEdit}
                  onToggleCorrect={onToggleCorrect}
                  onDelete={onDelete}
                />
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    )}
  </div>
);
