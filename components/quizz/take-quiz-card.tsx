import { z } from "zod";
import { getAnswers } from "@/app/api/answers/route";
import { QuestionSchema } from "@/schemas/questionSchema";

import {
  Card,
  /* CardContent,
  CardDescription,
  CardFooter, */
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export async function TakeQuizCard(props: TakeQuizCardProps) {
  // const answers = await getAnswers(props.question.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.question.content}</CardTitle>
      </CardHeader>
    </Card>
  );
}

export type TakeQuizCardProps = {
  question: z.infer<typeof QuestionSchema>;
};
