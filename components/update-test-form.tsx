"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useActionState, useTransition } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Test, CreateTestForm, createTestSchema } from "@/schemas/testSchema";
import { Calendar } from "@/components/ui/calendar";
import { updateTest, TestState } from "@/lib/actions/update-test";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Import the update test action (which you'll need to create)

type UpdateTestFormProps = {
  initialData: Test;
};

export const UpdateTestForm = ({ initialData }: UpdateTestFormProps) => {
  const [isPending, startTransition] = useTransition();
  const initialState: TestState = { message: null, errors: {} };

  // Bind test ID so the action updates the correct test
  const updateTestWithId = updateTest.bind(null, initialData.test_id);
  const [state, formAction] = useActionState(updateTestWithId, initialState);

  const form = useForm<CreateTestForm>({
    resolver: zodResolver(createTestSchema),
    defaultValues: {
      title: initialData.title,
      description: initialData.description || "",
      start_time: initialData.start_time
        ? format(initialData.start_time, "yyyy-MM-dd'T'HH:mm:ss'Z'")
        : undefined,
      end_time: initialData.end_time
        ? format(initialData.end_time, "yyyy-MM-dd'T'HH:mm:ss'Z'")
        : undefined,
    },
    mode: "onBlur",
  });

  const onSubmit = (data: CreateTestForm) => {
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
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Test Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your test title"
                    {...field}
                    aria-invalid={!!form.formState.errors.title}
                  />
                </FormControl>
                <FormDescription>
                  Choose a descriptive title for your test.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Provide test instructions, objectives, and other relevant information..."
                    className="min-h-[120px]"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  Add details about the test to help participants understand
                  what to expect.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="start_time"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Time</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={`w-full pl-3 text-left font-normal ${
                            !field.value ? "text-muted-foreground" : ""
                          }`}
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP HH:mm:ss")
                          ) : (
                            <span>Pick a date and time</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) => {
                          if (date) {
                            const dateTime = new Date(date);
                            dateTime.setHours(new Date().getHours());
                            dateTime.setMinutes(new Date().getMinutes());
                            field.onChange(dateTime.toISOString());
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    When will the test begin? (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="end_time"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Time</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={`w-full pl-3 text-left font-normal ${
                            !field.value ? "text-muted-foreground" : ""
                          }`}
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP HH:mm:ss")
                          ) : (
                            <span>Pick a date and time</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) => {
                          if (date) {
                            const dateTime = new Date(date);
                            dateTime.setHours(new Date().getHours());
                            dateTime.setMinutes(new Date().getMinutes());
                            field.onChange(dateTime.toISOString());
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    When will the test end? (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {state.errors?._form && (
            <div className="bg-destructive/15 text-destructive rounded-md p-3 text-sm">
              <p className="font-medium">Error</p>
              <p>{state.errors._form.join(", ")}</p>
            </div>
          )}

          {state.message && (
            <div className="rounded-md bg-green-100 p-3 text-sm text-green-800">
              <p className="font-medium">Success</p>
              <p>{state.message}</p>
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
              {isPending ? "Updating..." : "Update Test"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
