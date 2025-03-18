"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { DragEndEvent } from "@dnd-kit/core";

type Answer = {
  id: string;
  text: string;
  isCorrect: boolean;
};

type SortableItemProps = {
  id: string;
  children: React.ReactNode;
};

const SortableItem = ({ id, children }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="flex items-center">
        <button
          className="cursor-grab p-2 active:cursor-grabbing"
          {...listeners}
          type="button"
        >
          <GripVertical className="text-muted-foreground h-4 w-4" />
        </button>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

type AnswerFormProps = {
  newAnswer: string;
  setNewAnswer: (value: string) => void;
  addAnswer: () => void;
};

const AnswerForm = ({
  newAnswer,
  setNewAnswer,
  addAnswer,
}: AnswerFormProps) => (
  <div className="space-y-4 border-b pb-4">
    <div className="grid gap-2">
      <Label htmlFor="new-answer">New Answer Option</Label>
      <div className="flex gap-2">
        <Input
          id="new-answer"
          placeholder="Enter an answer option"
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
        />
        <Button type="button" onClick={addAnswer}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add
        </Button>
      </div>
    </div>
    <p className="text-muted-foreground text-xs">
      After adding, you can mark answers as correct from the list below. Drag
      answers to reorder them.
    </p>
  </div>
);

type EmptyAnswersProps = {
  message: string;
  description: string;
};

const EmptyAnswers = ({ message, description }: EmptyAnswersProps) => (
  <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
    <h3 className="text-lg font-medium">{message}</h3>
    <p className="text-muted-foreground mt-1 text-sm">{description}</p>
  </div>
);

type AnswerItemProps = {
  answer: Answer;
  index: number;
  onEdit: (updatedAnswer: Answer) => void;
  onToggleCorrect: (id: string) => void;
  onDelete: (id: string) => void;
};

const AnswerItem = ({
  answer,
  index,
  onEdit,
  onToggleCorrect,
  onDelete,
}: AnswerItemProps) => (
  <Card
    className="border-l-4 transition-all hover:shadow-md"
    style={{
      borderLeftColor: answer.isCorrect ? "var(--primary)" : "transparent",
    }}
  >
    <CardContent className="flex items-center justify-between p-4">
      <div className="flex flex-1 items-center gap-3">
        <span className="text-muted-foreground font-medium">{index + 1}.</span>
        <Input
          value={answer.text}
          onChange={(e) => onEdit({ ...answer, text: e.target.value })}
          className="border-none p-0 shadow-none focus-visible:ring-0"
        />
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center space-x-2">
          <Switch
            id={`correct-${answer.id}`}
            checked={answer.isCorrect}
            onCheckedChange={() => onToggleCorrect(answer.id)}
          />
          <Label htmlFor={`correct-${answer.id}`} className="text-sm">
            Correct
          </Label>
        </div>
        <Button variant="ghost" size="icon" onClick={() => onDelete(answer.id)}>
          <Trash2 className="text-muted-foreground h-4 w-4" />
        </Button>
      </div>
    </CardContent>
  </Card>
);

type AnswerListProps = {
  answers: Answer[];
  sensors: ReturnType<typeof useSensors>;
  onDragEnd: (event: DragEndEvent) => void;
  onEdit: (updatedAnswer: Answer) => void;
  onToggleCorrect: (id: string) => void;
  onDelete: (id: string) => void;
};

const AnswerList = ({
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

export default function CreateAnswerPage() {
  const [answers, setAnswers] = useState<Answer[]>([
    { id: uuidv4(), text: "Answer option 1", isCorrect: true },
    { id: uuidv4(), text: "Answer option 2", isCorrect: false },
  ]);

  const [newAnswer, setNewAnswer] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const addAnswer = () => {
    if (newAnswer.trim()) {
      setAnswers([
        ...answers,
        { id: uuidv4(), text: newAnswer, isCorrect: false },
      ]);
      setNewAnswer("");
    }
  };

  const handleDelete = (id: string) => {
    setAnswers(answers.filter((answer) => answer.id !== id));
  };

  const handleEdit = (updatedAnswer: Answer) => {
    setAnswers(
      answers.map((answer) =>
        answer.id === updatedAnswer.id ? updatedAnswer : answer,
      ),
    );
  };

  const toggleCorrect = (id: string) => {
    setAnswers(
      answers.map((answer) =>
        answer.id === id ? { ...answer, isCorrect: !answer.isCorrect } : answer,
      ),
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setAnswers((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        const newArray = [...items];
        const [movedItem] = newArray.splice(oldIndex, 1);
        newArray.splice(newIndex, 0, movedItem);

        return newArray;
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-2">
          <CardTitle>Manage Answer Options</CardTitle>
          <CardDescription>
            Create and organize answer options for your question. Mark the
            correct answers.
          </CardDescription>
        </div>
        <Button type="submit" form="answer-form">
          Save Answers
        </Button>
      </CardHeader>
      <form id="answer-form">
        <CardContent className="space-y-6">
          <AnswerForm
            newAnswer={newAnswer}
            setNewAnswer={setNewAnswer}
            addAnswer={addAnswer}
          />

          <AnswerList
            answers={answers}
            sensors={sensors}
            onDragEnd={handleDragEnd}
            onEdit={handleEdit}
            onToggleCorrect={toggleCorrect}
            onDelete={handleDelete}
          />
        </CardContent>
      </form>
    </Card>
  );
}
