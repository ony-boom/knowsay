import React, { HTMLProps, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const QCMQuiz = ({
  question,
  options,
  correctAnswer,
  onAnswerChecked,
  onNext,
  nextButtonText = "Next",
  ...divProps
}: QCMQuizProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [answered, setAnswered] = useState(false);

  const handleAnswerSelect = (value: string) => {
    if (!answered) {
      setSelectedAnswer(value);
    }
  };

  const handleCheckAnswer = () => {
    const isCorrect = selectedAnswer === correctAnswer;
    setAnswered(true);
    if (onAnswerChecked) {
      onAnswerChecked(isCorrect, selectedAnswer);
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    }

    setSelectedAnswer("");
    setAnswered(false);
  };

  return (
    <Card className={cn("w-full max-w-md", divProps.className)}>
      <CardHeader>
        <CardTitle className="text-xl">{question}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedAnswer}
          onValueChange={handleAnswerSelect}
          className="space-y-3"
        >
          {options.map((option, index) => {
            const isCorrect = option === correctAnswer;
            const isSelected = option === selectedAnswer;

            let className =
              "flex items-center space-x-2 rounded-md border p-3 transition-colors";

            if (answered) {
              if (isCorrect) {
                className +=
                  " bg-green-100 border-green-500 dark:bg-green-900/30 dark:border-green-500";
              } else if (isSelected && !isCorrect) {
                className +=
                  " bg-red-100 border-red-500 dark:bg-red-900/30 dark:border-red-500";
              }
            } else if (isSelected) {
              className += " bg-muted";
            }

            return (
              <div key={index} className={className}>
                <RadioGroupItem
                  value={option}
                  id={`option-${index}`}
                  className="sr-only"
                />
                <Label
                  htmlFor={`option-${index}`}
                  className="flex-1 cursor-pointer font-normal"
                >
                  {option}
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        {!answered ? (
          <Button
            onClick={handleCheckAnswer}
            disabled={!selectedAnswer}
            className="w-full"
          >
            Check Answer
          </Button>
        ) : (
          <Button onClick={handleNext} className="w-full">
            {nextButtonText}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

type QCMQuizProps = {
  question: string;
  options: string[];
  correctAnswer: string;
  onAnswerChecked?: (isCorrect: boolean, selectedAnswer: string) => void;
  onNext?: () => void;
  nextButtonText?: string;
} & HTMLProps<HTMLDivElement>;
