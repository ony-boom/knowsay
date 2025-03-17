import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Question } from "../types";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

type AddQuestionButtonProps = {
  onAddQuestion: () => void;
  currentQuestion: Question | null;
  isEditing: boolean;
  onSaveQuestion: (question: Question) => void;
  addAnswer: () => void;
  removeAnswer: (id: string) => void;
  setCurrentQuestion: React.Dispatch<React.SetStateAction<Question | null>>;
};

export const AddQuestionButton = ({
  onAddQuestion,
  currentQuestion,
  isEditing,
  onSaveQuestion,
  addAnswer,
  removeAnswer,
  setCurrentQuestion,
}: AddQuestionButtonProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button onClick={onAddQuestion} variant="default">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Question
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {isEditing ? "Edit Question" : "Add New Question"}
          </SheetTitle>
          <SheetDescription>
            Fill in the details for your question and provide answer options.
          </SheetDescription>
        </SheetHeader>

        {currentQuestion && (
          <div className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Textarea
                id="question"
                placeholder="Enter your question here"
                value={currentQuestion.question}
                onChange={(e) =>
                  setCurrentQuestion({
                    ...currentQuestion,
                    question: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Answer Options</Label>
                <Button variant="outline" size="sm" onClick={addAnswer}>
                  Add Answer
                </Button>
              </div>

              <RadioGroup
                value={currentQuestion.answers.find((a) => a.isCorrect)?.id}
                onValueChange={(value: string) => {
                  setCurrentQuestion({
                    ...currentQuestion,
                    answers: currentQuestion.answers.map((a) => ({
                      ...a,
                      isCorrect: a.id === value,
                    })),
                  });
                }}
              >
                {currentQuestion.answers.map((answer, index) => (
                  <div key={answer.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={answer.id} id={answer.id} />
                    <Input
                      className="flex-1"
                      placeholder={`Answer ${index + 1}`}
                      value={answer.text}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setCurrentQuestion({
                          ...currentQuestion,
                          answers: currentQuestion.answers.map((a) =>
                            a.id === answer.id
                              ? { ...a, text: e.target.value }
                              : a,
                          ),
                        });
                      }}
                    />
                    {currentQuestion.answers.length > 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAnswer(answer.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(null)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => onSaveQuestion(currentQuestion)}
                disabled={
                  !currentQuestion.question ||
                  currentQuestion.answers.some((a) => !a.text)
                }
              >
                Save Question
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
