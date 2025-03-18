import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";

type AnswerFormProps = {
  newAnswer: string;
  setNewAnswer: (value: string) => void;
  addAnswer: () => void;
};

export const AnswerForm = ({
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
