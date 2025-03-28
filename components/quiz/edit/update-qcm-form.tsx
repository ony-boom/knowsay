"use client";

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QuizQcmState } from "@/lib/actions/types";
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
import { updateQcm } from "@/lib/actions/update-qcm";
import { QuizQuestionWithQcm } from "@/schemas/quizQuestionSchema";
import { StoreQCM, storeQcmSchema } from "@/schemas/qcmSchema";

type EditQuestionFormProps = {
  initialData: QuizQuestionWithQcm;
};

export const UpdateQcmForm = ({ initialData }: EditQuestionFormProps) => {
  const [isPending, startTransition] = useTransition();
  const initialState: QuizQcmState = { message: null, errors: {} };

  const updateQuestionWithId = updateQcm.bind(
    null,
    initialData.qcm_id,
    initialData.id,
  );

  const [state, formAction] = useActionState(
    updateQuestionWithId,
    initialState,
  );

  const form = useForm<StoreQCM>({
    resolver: zodResolver(storeQcmSchema),
    defaultValues: {
      question: initialData.qcm.question,
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
    <Form {...form}>
      <form id="question-form" onSubmit={form.handleSubmit(onSubmit)}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-2">
            <CardTitle>Edit QCM Question</CardTitle>
            <CardDescription>
              Update your multiple-choice question and save changes when done.
            </CardDescription>
          </div>
          <Button
            type="submit"
            form="question-form"
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
