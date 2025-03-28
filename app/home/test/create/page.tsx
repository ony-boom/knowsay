"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, FileText } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDateRangePicker } from "@/components/ui/calendar-date-range-picker";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { useActionState, useTransition } from "react";
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
import { createTestAction, TestState } from "@/lib/actions/create-test";
import { CreateTestForm, createTestSchema } from "@/schemas/testSchema";

export default function CreateTestPage() {
  // Use DateRange type from react-day-picker to match CalendarDateRangePicker component
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 1 week from now
  });

  const [isPending, startTransition] = useTransition();
  const initialState: TestState = { message: null, errors: {} };
  const [state, formAction] = useActionState(createTestAction, initialState);

  const form = useForm<CreateTestForm>({
    resolver: zodResolver(createTestSchema),
    defaultValues: {
      title: "",
      description: "",
      start_time: date?.from
        ? format(date.from, "yyyy-MM-dd'T'HH:mm:ss'Z'")
        : undefined,
      end_time: date?.to
        ? format(date.to, "yyyy-MM-dd'T'HH:mm:ss'Z'")
        : undefined,
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
    <div className="flex flex-col gap-6 px-4 py-6 pt-0 md:px-6 md:py-8">
      <PageHeader
        title="Create Test"
        description="Create a new test with automatic and free-text questions to assess knowledge."
      />

      <TestDetailsForm
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

      {state.message && (
        <div className="rounded-md bg-green-100 p-3 text-sm text-green-800">
          <p className="font-medium">Success</p>
          <p>{state.message}</p>
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

type TestDetailsFormProps = {
  form: ReturnType<typeof useForm<CreateTestForm>>;
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  onSubmit: (data: CreateTestForm) => void;
  isPending: boolean;
};

// Atomic Components
const PageHeader = ({ title, description }: PageHeaderProps) => (
  <hgroup className="space-y-2 md:space-y-4">
    <h1 className="text-2xl font-black md:text-3xl lg:text-5xl">{title}</h1>
    <p className="text-foreground/80 text-base md:text-lg">{description}</p>
  </hgroup>
);

const TestDetailsForm = ({
  form,
  date,
  setDate,
  onSubmit,
  isPending,
}: TestDetailsFormProps) => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
        <FileText className="text-primary h-5 w-5" />
        <span>Test Information</span>
      </CardTitle>
      <CardDescription className="text-sm md:text-base">
        Configure your test with essential details such as title, description,
        and scheduling.
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
                  <FormLabel>Test Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a descriptive title" {...field} />
                  </FormControl>
                  <FormDescription>
                    Choose a clear title that describes the test&apos;s purpose.
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
                      placeholder="Provide test instructions, objectives, and other relevant information..."
                      className="min-h-[120px]"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Add detailed information about the test to help participants
                    understand what to expect.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <TestDurationPicker date={date} setDate={setDate} />
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

type TestDurationPickerProps = {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
};

const TestDurationPicker = ({ date, setDate }: TestDurationPickerProps) => (
  <div className="space-y-4 md:col-span-2">
    <FormLabel>Test Duration</FormLabel>
    <div className="rounded-md border p-4">
      <div className="mb-4 flex items-center gap-2">
        <Calendar className="text-muted-foreground h-5 w-5" />
        <h4 className="text-sm font-medium">Select Start and End Times</h4>
      </div>
      <CalendarDateRangePicker date={date} setDate={setDate} />
      <FormDescription className="mt-2">
        The test will be available to participants within this timeframe. Leave
        empty for unlimited access.
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
      {isSubmitting ? "Creating..." : "Create Test"}
    </Button>
  </div>
);
