"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useActionState, useTransition } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Challenge,
  CreateChallengeForm,
  createChallengeSchema,
} from "@/schemas/challengeSchema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { updateChallenge } from "@/lib/actions/update-challenge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChallengeState } from "@/lib/actions/create-challenge";

type UpdateChallengeFormProps = {
  initialData: Challenge;
};

export const UpdateChallengeForm = ({
  initialData,
}: UpdateChallengeFormProps) => {
  const [isPending, startTransition] = useTransition();
  const initialState: ChallengeState = { message: null, errors: {} };
  // Bind challenge ID so the action updates the correct challenge
  const updateChallengeWithId = updateChallenge.bind(
    null,
    initialData.challenge_id,
  );
  const [state, formAction] = useActionState(
    updateChallengeWithId,
    initialState,
  );

  const form = useForm<CreateChallengeForm>({
    resolver: zodResolver(createChallengeSchema),
    defaultValues: {
      title: initialData.title,
      description: initialData.description || "",
      start_time: initialData.start_time,
      end_time: initialData.end_time,
      is_team_based: initialData.is_team_based,
    },
    mode: "onBlur",
  });

  const onSubmit = (data: CreateChallengeForm) => {
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
                <FormLabel>Challenge Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your challenge title"
                    {...field}
                    aria-invalid={!!form.formState.errors.title}
                  />
                </FormControl>
                <FormDescription>
                  Choose a descriptive title for your challenge.
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
                    placeholder="Describe what this challenge is about..."
                    className="min-h-[120px]"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  Provide details about the challenge objectives and rules.
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
                    When will the challenge begin?
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
                    When will the challenge end?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="is_team_based"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Team-based Challenge</FormLabel>
                  <FormDescription>
                    Enable this option if participants will compete in teams
                    rather than individually.
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
              {isPending ? "Updating..." : "Update Challenge"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
