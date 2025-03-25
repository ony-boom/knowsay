"use client";

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QcmState } from "@/lib/actions/types";
import {
  Question,
  StoreQuestion,
  StoreQuestionSchema,
} from "@/schemas/questionSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { DynamicQuestionEditor } from "../create/bloc-note/dynamic-editor";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateQuestion } from "@/lib/actions/update-question";

type EditQuestionFormProps = {
  quizId: string;
  initialData: Question;
};

export const EditQuestionForm = ({
  quizId,
  initialData,
}: EditQuestionFormProps) => {
  const [isPending, startTransition] = useTransition();
  const initialState: QcmState = { message: null, errors: {} };

  const updateQuestionWithId = updateQuestion.bind(null, initialData.id);

  const [state, formAction] = useActionState(
    updateQuestionWithId,
    initialState,
  );

  const form = useForm<StoreQuestion>({
    resolver: zodResolver(StoreQuestionSchema),
    defaultValues: {
      content: initialData.content,
      type: initialData.type,
      timer: initialData.timer || 20,
      quiz_id: quizId,
    },
    mode: "onBlur",
  });

  const onSubmit = (data: StoreQuestion) => {
    startTransition(() => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (key === "content") {
            const filteredValue = JSON.parse(value as never).filter(
              (block: { content?: unknown[] }) => block.content?.length,
            );
            formData.append(key, JSON.stringify(filteredValue));
            return;
          }
          formData.append(key, String(value));
        }
      });
      formAction(formData);
    });
  };

  return (
    <Form {...form}>
      <form id="question-form" onSubmit={form.handleSubmit(onSubmit)}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-2">
            <CardTitle>Edit Question</CardTitle>
            <CardDescription>
              Update your question details and save changes when done.
            </CardDescription>
          </div>
          <div className="mr-4 flex flex-1 flex-row items-center justify-end gap-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a question type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="QCM">Multiple Choice</SelectItem>
                      <SelectItem value="OPEN">Open Answer</SelectItem>
                      <SelectItem value="ORDER">Ordering</SelectItem>
                      <SelectItem value="MATCHING">Matching</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            form="question-form"
            disabled={
              !form.formState.isValid || !form.formState.isDirty || isPending
            }
          >
            {isPending ? "Updating..." : "Update Question"}
          </Button>
        </CardHeader>

        <CardContent className="mt-4 space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Content</FormLabel>
                  <FormControl>
                    <div className="bg-background rounded-md">
                      <DynamicQuestionEditor
                        onChange={(value) => {
                          field.onChange(JSON.stringify(value));
                        }}
                        value={
                          field.value ? JSON.parse(field.value as string) : null
                        }
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-muted-foreground text-xs">
              Use the rich text editor to format your question
            </p>

            {state.errors?._form && (
              <div className="bg-destructive/15 text-destructive rounded-md p-3 text-sm">
                <p className="font-medium">Error</p>
                <p>{state.errors._form.join(", ")}</p>
              </div>
            )}

            {state.message && (
              <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">
                <p>{state.message}</p>
              </div>
            )}
          </div>
        </CardContent>
      </form>
    </Form>
  );
};
