"use client";

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QuizQcmState } from "@/lib/actions/types";
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
import { createQuizQcm } from "@/lib/actions/create-quiz-qcm";
import { StoreQCM } from "@/schemas/qcmSchema";
import { storeQcmSchema } from "@/schemas/qcmSchema";

type CreateQuizQcmFormProps = {
  quizId: string;
};

export const CreateQuizQCMForm = ({ quizId }: CreateQuizQcmFormProps) => {
  const [isPending, startTransition] = useTransition();
  const initialState: QuizQcmState = { message: null, errors: {} };

  const createQcmWithId = createQuizQcm.bind(null, quizId);

  const [state, formAction] = useActionState(createQcmWithId, initialState);

  const form = useForm<StoreQCM>({
    resolver: zodResolver(storeQcmSchema),
    defaultValues: {
      question: "",
    },
    mode: "onBlur",
  });

  const onSubmit = (data: StoreQCM) => {
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
              <CardTitle>Create New QCM Question</CardTitle>
              <CardDescription>
                Add a multiple-choice question to your quiz.
              </CardDescription>
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
                name="question"
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
