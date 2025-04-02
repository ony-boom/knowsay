"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useActionState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { DynamicQuestionEditor } from "@/components/quiz/create/bloc-note/dynamic-editor";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  StoreTestQuestionWithQcm,
  storeTestQuestionWithQcmSchema,
} from "@/schemas/testQuestionSchema";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createTestQcm, TestQcmState } from "@/lib/actions/create-test-qcm";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type CreateTestQcmFormProps = {
  testId: string;
};

export const CreateTestQCMForm = ({ testId }: CreateTestQcmFormProps) => {
  const [isPending, startTransition] = useTransition();
  const initialState: TestQcmState = {
    errors: {},
    message: undefined,
  };

  const createTestQcmWithId = createTestQcm.bind(null, testId);

  const [state, formAction] = useActionState(createTestQcmWithId, initialState);

  const form = useForm<StoreTestQuestionWithQcm>({
    resolver: zodResolver(storeTestQuestionWithQcmSchema),
    defaultValues: {
      test_id: testId,
      is_free_text: false,
      time_limit: 30,
      points: 1,
      question: "",
    },
    mode: "onBlur",
  });

  const onSubmit = (data: StoreTestQuestionWithQcm) => {
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

  const isFreeText = form.watch("is_free_text");

  return (
    <>
      <Form {...form}>
        <form id="test-question-form" onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-2">
              <CardTitle>Create New Test Question</CardTitle>
              <CardDescription>
                Add a question to your test. Can be multiple-choice or free
                text.
              </CardDescription>
            </div>
            <Button
              type="submit"
              form="test-question-form"
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
                name="is_free_text"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Free Text Question
                      </FormLabel>
                      <FormDescription>
                        Enable for open-ended responses that require manual
                        correction
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Display appropriate fields based on question type */}
              {isFreeText ? (
                <div className="bg-muted/50 rounded-lg border p-4">
                  <h3 className="mb-2 text-sm font-medium">
                    Free Text Question
                  </h3>
                  <p className="text-muted-foreground mb-4 text-xs">
                    Students will be able to type in their answers freely. These
                    answers will need manual grading.
                  </p>
                </div>
              ) : (
                <div className="bg-muted/50 rounded-lg border p-4">
                  <h3 className="mb-2 text-sm font-medium">
                    Multiple Choice Question
                  </h3>
                  <p className="text-muted-foreground mb-4 text-xs">
                    Students will select from provided options. Answers will be
                    automatically graded.
                  </p>
                  {/* QCM specific options would go here */}
                </div>
              )}

              <FormField
                control={form.control}
                name="points"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Points</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time_limit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Limit (seconds)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={5}
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
