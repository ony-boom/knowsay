"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Trophy } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
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
import { CalendarDateRangePicker } from "@/components/ui/calendar-date-range-picker";
import { DateRange } from "react-day-picker";
import {
  createChallengeSchema,
  type CreateChallengeForm,
} from "@/schemas/challengeSchema";
import { format } from "date-fns";
import { useActionState, useTransition } from "react";
import { createChallengeAction } from "@/lib/actions/create-challenge";
import { State } from "@/lib/actions/types";

export default function CreateChallengePage() {
  // Use DateRange type from react-day-picker to match CalendarDateRangePicker component
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 1 week from now
  });

  const [isPending, startTransition] = useTransition();
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(
    createChallengeAction,
    initialState,
  );

  const form = useForm<CreateChallengeForm>({
    resolver: zodResolver(createChallengeSchema),
    defaultValues: {
      title: "",
      description: "",
      is_team_based: false,
      start_time: format(date?.from || new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      end_time: format(
        date?.to || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        "yyyy-MM-dd'T'HH:mm:ss'Z'",
      ),
    },
    mode: "onChange",
  });

  // Update form values when date range changes
  useEffect(() => {
    if (date?.from) {
      form.setValue(
        "start_time",
        format(date.from, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      );
      form.trigger("start_time");
    }
    if (date?.to) {
      form.setValue("end_time", format(date.to, "yyyy-MM-dd'T'HH:mm:ss'Z'"));
      form.trigger("end_time");
    }
  }, [date, form]);

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
    <div className="flex flex-col gap-6 px-4 py-6 pt-0 md:px-6 md:py-8">
      <PageHeader
        title="Create Challenge"
        description="Create a new challenge to engage participants in competitive quizzes and tests."
      />

      <ChallengeDetailsForm
        form={form}
        date={date}
        setDate={setDate}
        onSubmit={onSubmit}
        isPending={isPending}
      />

      {state.errors?._form && (
        <div className="bg-destructive/15 text-destructive rounded-md p-3 text-sm">
          <p className="font-medium">Error</p>
          <p>{state.errors._form.join(", ")}</p>
        </div>
      )}
    </div>
  );
}

// Component Types
type PageHeaderProps = {
  title: string;
  description: string;
};

type ChallengeDetailsFormProps = {
  form: ReturnType<typeof useForm<CreateChallengeForm>>;
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  onSubmit: (data: CreateChallengeForm) => void;
  isPending: boolean;
};

// Atomic Components
const PageHeader = ({ title, description }: PageHeaderProps) => (
  <hgroup className="space-y-2 md:space-y-4">
    <h1 className="text-2xl font-black md:text-3xl lg:text-5xl">{title}</h1>
    <p className="text-foreground/80 text-base md:text-lg">{description}</p>
  </hgroup>
);

const ChallengeDetailsForm = ({
  form,
  date,
  setDate,
  onSubmit,
  isPending,
}: ChallengeDetailsFormProps) => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
        <Trophy className="text-primary h-5 w-5" />
        <span>Challenge Information</span>
      </CardTitle>
      <CardDescription className="text-sm md:text-base">
        Set up your challenge with a title, description, and timing details.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Challenge Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a memorable title" {...field} />
                  </FormControl>
                  <FormDescription>
                    Choose a title that excites and motivates participants.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your challenge, its goals, and what participants can expect..."
                      className="min-h-[120px]"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide details about the challenge to help participants
                    prepare.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ChallengeDurationPicker date={date} setDate={setDate} />

            <FormField
              control={form.control}
              name="is_team_based"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 rounded-md border p-4 md:col-span-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Team-Based Challenge</FormLabel>
                    <FormDescription>
                      Enable this option to allow participants to compete in
                      teams rather than individually.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <FormActions
            isSubmitting={form.formState.isSubmitting || isPending}
            isValid={form.formState.isValid}
            isDirty={form.formState.isDirty}
          />
        </form>
      </Form>
    </CardContent>
  </Card>
);

type ChallengeDurationPickerProps = {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
};

const ChallengeDurationPicker = ({
  date,
  setDate,
}: ChallengeDurationPickerProps) => (
  <div className="space-y-4 md:col-span-2">
    <FormLabel>Challenge Duration</FormLabel>
    <div className="rounded-md border p-4">
      <div className="mb-4 flex items-center gap-2">
        <Calendar className="text-muted-foreground h-5 w-5" />
        <h4 className="text-sm font-medium">Select Start and End Times</h4>
      </div>
      <CalendarDateRangePicker date={date} setDate={setDate} />
      <FormDescription className="mt-2">
        Participants will only be able to join within this time period.
      </FormDescription>
    </div>
  </div>
);

type FormActionsProps = {
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
};

const FormActions = ({ isSubmitting, isValid, isDirty }: FormActionsProps) => (
  <div className="flex flex-col-reverse justify-end gap-2 pt-2 sm:flex-row">
    <Button variant="outline" type="button">
      Cancel
    </Button>
    <Button
      type="submit"
      className="gap-2"
      disabled={isSubmitting || !isValid || !isDirty}
    >
      {isSubmitting ? "Creating..." : "Create Challenge"}
    </Button>
  </div>
);
