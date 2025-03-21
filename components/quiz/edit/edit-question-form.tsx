"use client";

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createQuestion, State } from "@/lib/actions";
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

type CreateQuestionFormProps = {
  initialData: Quiz;
};

export const EditQuestionForm = ({ initialData }: CreateQuestionFormProps) => {
  const [isPending, startTransition] = useTransition();
  const initialState: State = { message: null, errors: {} };

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
      timer: undefined,
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
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-2">
          <CardTitle>Create New Question</CardTitle>
          <CardDescription>
            Add a question to your quiz. Make sure to provide multiple options
            and select the correct answer.
          </CardDescription>
        </div>
        <Button
          type="submit"
          form="question-form"
          disabled={
            !form.formState.isValid || !form.formState.isDirty || isPending
          }
        >
          {isPending ? "Saving..." : "Save Question"}
        </Button>
      </CardHeader>

      <Form {...form}>
        <form id="question-form" onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
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
