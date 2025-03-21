"use client";

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createQuestion, QuestionState } from "@/lib/actions";
import { StoreQuestion, StoreQuestionSchema } from "@/schemas/questionSchema";
import { Quiz } from "@/schemas/quizSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useActionState, useTransition } from "react";
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

type CreateQuestionFormProps = {
  initialData: Quiz;
};

export const EditQuestionForm = ({ initialData }: CreateQuestionFormProps) => {
  const [isPending, startTransition] = useTransition();
  const initialState: QuestionState = { message: null, errors: {} };

  const createQuestionWithId = createQuestion.bind(null, initialData.id);

  const [state, formAction] = useActionState(
    createQuestionWithId,
    initialState,
  );

  const form = useForm<StoreQuestion>({
    resolver: zodResolver(StoreQuestionSchema),
    defaultValues: {
      content: "",
      type: "QCM",
      quiz_id: initialData.id,
    },
    mode: "onBlur",
  });

  const onSubmit = (data: StoreQuestion) => {
    startTransition(() => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });
      formAction(formData);
    });
  };

  return (
    <>
      <Form {...form}>
        <form id="question-form" onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-2">
              <CardTitle>Create New Question</CardTitle>
              <CardDescription>
                Add a question to your quiz. Make sure to provide multiple
                options and select the correct answer.
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
                !form.formState.isValid ||
                !form.formState.isDirty ||
                isPending ||
                state.success
              }
            >
              {isPending
                ? "Saving..."
                : state.success === true
                  ? "Saved"
                  : "Save Question"}
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
            </div>
          </CardContent>
        </form>
      </Form>
    </>
  );
};
