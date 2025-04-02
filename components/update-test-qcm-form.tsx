"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { DynamicQuestionEditor } from "./quiz/create/bloc-note/dynamic-editor";
import { Button } from "@/components/ui/button";
import {
  StoreTestQuestionWithQcm,
  storeTestQuestionWithQcmSchema,
  TestQuestionWithQcm,
} from "@/schemas/testQuestionSchema";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TestQcmState, updateTestQcm } from "@/lib/actions/update-test-qcm";

type UpdateTestQcmFormProps = {
  initialData: TestQuestionWithQcm;
};

export const UpdateTestQcmForm = ({ initialData }: UpdateTestQcmFormProps) => {
  const [isPending, startTransition] = useTransition();
  const initialState: TestQcmState = { message: null, errors: {} };

  const updateQuestionWithId = updateTestQcm.bind(
    null,
    initialData.qcm_id,
    initialData.id,
  );

  const [state, formAction] = useActionState(
    updateQuestionWithId,
    initialState,
  );

  const form = useForm<StoreTestQuestionWithQcm>({
    resolver: zodResolver(storeTestQuestionWithQcmSchema),
    defaultValues: {
      question: initialData.qcm.question,
      time_limit: initialData.time_limit || null,
      points: initialData.points,
      is_free_text: initialData.is_free_text,
      test_id: initialData.test_id,
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

  return (
    <Form {...form}>
      <form id="test-question-form" onSubmit={form.handleSubmit(onSubmit)}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-2">
            <CardTitle>Edit Test Question</CardTitle>
            <CardDescription>
              Update your test question and save changes when done.
            </CardDescription>
          </div>
          <Button
            type="submit"
            form="test-question-form"
            disabled={
              !form.formState.isValid || !form.formState.isDirty || isPending
            }
          >
            {isPending
              ? "Updating..."
              : state.success === true
                ? "Saved"
                : "Update Question"}
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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="time_limit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Limit (seconds)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Time limit in seconds"
                        {...field}
                        value={field.value === null ? "" : field.value}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseInt(e.target.value)
                            : null;
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="points"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Points</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Points for this question"
                        {...field}
                        value={field.value}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseInt(e.target.value)
                            : 1;
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="is_free_text"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Free Text Response
                    </FormLabel>
                    <FormDescription>
                      Allow free text answers instead of multiple choice
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
