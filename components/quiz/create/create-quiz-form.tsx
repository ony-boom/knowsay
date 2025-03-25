"use client";

import { State } from "@/lib/actions/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useActionState, useTransition } from "react";
import { createQuizFormAction } from "@/lib/actions/create-quiz";
import { StoreQuiz, storeQuizSchema } from "@/lib/definitions";

type CreateQuizFormProps = {
  categories: { id: string; name: string }[];
};

export const CreateQuizForm = ({ categories }: CreateQuizFormProps) => {
  const [isPending, startTransition] = useTransition();
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(
    createQuizFormAction,
    initialState,
  );

  const form = useForm<StoreQuiz>({
    resolver: zodResolver(storeQuizSchema),
    defaultValues: {
      title: "",
      category_id: "",
      difficulty: undefined,
      description: "",
      is_public: false,
    },
    mode: "onBlur", // Validate on blur for better UX
  });

  const onSubmit = (data: StoreQuiz) => {
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
      <form className="mt-8 space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quiz Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your quiz title"
                      {...field}
                      aria-invalid={!!form.formState.errors.title}
                    />
                  </FormControl>
                  <FormDescription>
                    Choose a catchy title for your quiz that describes its
                    content.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={
                          form.formState.errors.category_id
                            ? "border-destructive"
                            : ""
                        }
                      >
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select a category that best fits your quiz content.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty Level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={
                          form.formState.errors.difficulty
                            ? "border-destructive"
                            : ""
                        }
                      >
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="EASY">Easy</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HARD">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose how challenging your quiz will be for participants.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Provide details about what your quiz covers..."
                    className="min-h-[120px]"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  Give potential quiz takers an idea of what to expect.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_public"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Public Quiz</FormLabel>
                  <FormDescription>
                    Make your quiz available for everyone to discover and play.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {state.errors?._form && (
            <div className="bg-destructive/15 text-destructive rounded-md p-3 text-sm">
              <p className="font-medium">Error</p>
              <p>{state.errors._form.join(", ")}</p>
            </div>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={
                !form.formState.isValid || !form.formState.isDirty || isPending
              }
            >
              {isPending ? "Creating..." : "Create Quiz"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
