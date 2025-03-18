import { z } from "zod";
import { Label } from "@/components/ui/label";
import { AnswerSchema } from "@/schemas/answerSchema";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import React from "react";

export function QcmAnswer(props: QcmAnswerProps) {
  const { answers, ...divProps } = props;

  return (
    <RadioGroup {...divProps} className={cn("w-full", props.className)}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-2">
        {answers.map((answer) => {
          return (
            <div
              className="hover:bg-muted/50 group has-[button[aria-checked='true']]:bg-accent/80 relative flex items-center justify-center rounded-md border transition-colors"
              key={answer.id}
            >
              <RadioGroupItem
                value={answer.content}
                id={answer.id}
                className="hidden"
              />
              <Label
                className="w-full justify-center cursor-pointer p-4 text-center text-lg font-medium"
                htmlFor={answer.id}
              >
                {answer.content}
              </Label>
            </div>
          );
        })}
      </div>
    </RadioGroup>
  );
}

export type QcmAnswerProps = React.ComponentProps<typeof RadioGroup> & {
  answers: z.infer<typeof AnswerSchema>[];
};
