import { z } from "zod";
import { Label } from "@/components/ui/label";
import { AnswerSchema } from "@/schemas/answerSchema";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

export function QcmAnswer(props: QcmAnswerProps) {
  const { answers, ...divProps } = props;

  return (
    <RadioGroup {...divProps} className={cn("space-y-2", props.className)}>
      {answers.map((answer) => {
        return (
          <div className="flex items-center gap-2" key={answer.id}>
            <RadioGroupItem value={answer.content} id={answer.id} />
            <Label htmlFor={answer.id}>{answer.content}</Label>
          </div>
        );
      })}
    </RadioGroup>
  );
}

export type QcmAnswerProps = React.ComponentProps<typeof RadioGroup> & {
  answers: z.infer<typeof AnswerSchema>[];
};
