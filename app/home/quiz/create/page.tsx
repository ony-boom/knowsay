"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CreateQuizForm } from "./components/create-quiz-form";
import { Button } from "@/components/ui/button";
import { BadgeCheck, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function CreateQuizPage() {
  return (
    <div className="flex flex-col gap-6 px-6 py-8">
      <hgroup className="space-y-4">
        <h1 className="text-3xl font-black lg:text-5xl">Create a New Quiz</h1>
        <p className="text-foreground/80 text-lg">
          Design your interactive quiz with custom questions and share it with
          others to test their knowledge.
        </p>
      </hgroup>

      {/* create quiz form */}
      <Collapsible className="w-full rounded-lg border">
        <CollapsibleTrigger asChild>
          <div className="flex w-full items-center justify-between p-4 font-medium">
            <span>Describe Your Amazing Quiz Here</span>
            <Button variant="ghost" size="sm">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="border-t p-4 pt-0">
          <CreateQuizForm />
        </CollapsibleContent>
      </Collapsible>

      {/* create questions */}
      <Collapsible className="w-full rounded-lg border">
        <CollapsibleTrigger asChild>
          <div className="flex w-full items-center justify-between p-4 font-medium">
            <span>Create Questions</span>
            <Button variant="ghost" size="sm">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="border-t p-4 pt-0">
          <p className="text-foreground/80 mt-4 text-lg">
            Create questions for your quiz. You can add multiple questions and
            customize them as needed.
          </p>
          <QuestionsManager />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

// Define types for questions and answers
type Answer = {
  id: string;
  text: string;
  isCorrect: boolean;
};

type Question = {
  id: string;
  question: string;
  answers: Answer[];
};

interface AnswerUpdateProps {
  id: string;
  text: string;
  isCorrect: boolean;
}

export function QuestionsManager() {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "q1",
      question: "What is the capital of France?",
      answers: [
        { id: "a1", text: "Paris", isCorrect: true },
        { id: "a2", text: "London", isCorrect: false },
        { id: "a3", text: "Berlin", isCorrect: false },
      ],
    },
  ]);

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleAddQuestion = () => {
    setCurrentQuestion({
      id: `q${Date.now()}`,
      question: "",
      answers: [
        { id: `a${Date.now()}-1`, text: "", isCorrect: true },
        { id: `a${Date.now()}-2`, text: "", isCorrect: false },
      ],
    });
    setIsEditing(false);
  };

  const handleEditQuestion = (question: Question) => {
    setCurrentQuestion({ ...question });
    setIsEditing(true);
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleSaveQuestion = (question: Question) => {
    if (isEditing) {
      setQuestions(questions.map((q) => (q.id === question.id ? question : q)));
    } else {
      setQuestions([...questions, question]);
    }
    setCurrentQuestion(null);
  };

  const addAnswer = () => {
    if (currentQuestion) {
      setCurrentQuestion({
        ...currentQuestion,
        answers: [
          ...currentQuestion.answers,
          { id: `a${Date.now()}`, text: "", isCorrect: false },
        ],
      });
    }
  };

  const removeAnswer = (id: string) => {
    if (currentQuestion) {
      setCurrentQuestion({
        ...currentQuestion,
        answers: currentQuestion.answers.filter((a) => a.id !== id),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Quiz Questions</h3>
        <Sheet>
          <SheetTrigger asChild>
            <Button onClick={handleAddQuestion} variant="default">
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
                Fill in the details for your question and provide answer
                options.
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
                      <div
                        key={answer.id}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem value={answer.id} id={answer.id} />
                        <Input
                          className="flex-1"
                          placeholder={`Answer ${index + 1}`}
                          value={answer.text}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
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
                    onClick={() => handleSaveQuestion(currentQuestion)}
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
      </div>

      <QuestionList
        questions={questions}
        onEdit={handleEditQuestion}
        onDelete={handleDeleteQuestion}
      />
    </div>
  );
}

type QuestionListProps = {
  questions: Question[];
  onEdit: (question: Question) => void;
  onDelete: (id: string) => void;
};

const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  onEdit,
  onDelete,
}) => {
  if (questions.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed p-4 text-center sm:p-8">
        <p className="text-muted-foreground">
          No questions yet. Add your first question to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((question, index) => (
        <Card
          key={question.id}
          className="border-l-primary overflow-hidden border-l-4 transition-all hover:shadow-md"
        >
          <CardContent className="p-3 sm:p-6">
            <div className="mb-2 flex flex-col justify-between gap-2 sm:mb-4 sm:flex-row sm:items-center sm:gap-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium sm:h-8 sm:w-8 sm:text-base">
                  {index + 1}
                </div>
                <h4 className="line-clamp-2 text-base font-semibold sm:line-clamp-1 sm:text-lg">
                  {question.question}
                </h4>
              </div>
              <div className="flex space-x-1 self-end sm:self-auto">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(question)}
                      className="h-7 w-7 rounded-full sm:h-8 sm:w-8"
                    >
                      <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="sr-only">Edit question</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent />
                </Sheet>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(question.id)}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive h-7 w-7 rounded-full sm:h-8 sm:w-8"
                >
                  <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="sr-only">Delete question</span>
                </Button>
              </div>
            </div>

            <div className="mt-2 grid gap-1.5 sm:mt-3 sm:gap-2">
              {question.answers.map((answer, idx) => (
                <div
                  key={answer.id}
                  className={`flex items-center rounded-lg p-2 sm:p-2.5 ${
                    answer.isCorrect
                      ? "bg-green-50 dark:bg-green-950/30"
                      : "bg-muted/40"
                  }`}
                >
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium sm:h-7 sm:w-7 sm:text-sm ${
                      answer.isCorrect
                        ? "bg-green-100 text-green-800 dark:bg-green-900/70 dark:text-green-300"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="ml-2 flex-grow text-sm sm:ml-3 sm:text-base">
                    {answer.text}
                  </span>
                  {answer.isCorrect && (
                    <span className="mr-2 ml-1 inline-flex items-center text-xs font-medium whitespace-nowrap text-green-600 sm:ml-2 dark:text-green-400">
                      <BadgeCheck className="mr-0.5 h-3 w-3 sm:mr-1 sm:h-3.5 sm:w-3.5" />
                      Correct
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
