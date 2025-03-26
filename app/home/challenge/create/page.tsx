"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Trophy, Users } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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

// Create a schema for challenge creation
const createChallengeSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(255, { message: "Title must be less than 255 characters" }),
  description: z.string().optional(),
  start_time: z.date(),
  end_time: z.date(),
  is_team_based: z.boolean().default(false),
});

type CreateChallengeForm = z.infer<typeof createChallengeSchema>;

export default function CreateChallengePage() {
  // Use DateRange type from react-day-picker to match CalendarDateRangePicker component
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 1 week from now
  });

  const form = useForm<CreateChallengeForm>({
    resolver: zodResolver(createChallengeSchema),
    defaultValues: {
      title: "",
      description: "",
      is_team_based: false,
      start_time: date?.from || new Date(),
      end_time: date?.to || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    mode: "onBlur",
  });

  // Update form values when date range changes
  useEffect(() => {
    if (date?.from) {
      form.setValue("start_time", date.from);
    }
    if (date?.to) {
      form.setValue("end_time", date.to);
    }
  }, [date, form]);

  const onSubmit = (data: CreateChallengeForm) => {
    console.log(data);
    // Handle form submission logic here
  };

  return (
    <div className="flex flex-col gap-6 px-6 py-8 pt-0">
      <PageHeader
        title="Create Challenge"
        description="Create a new challenge to engage participants in competitive quizzes and tests."
      />

      <ChallengeTabs
        form={form}
        date={date}
        setDate={setDate}
        onSubmit={onSubmit}
      />
    </div>
  );
}

// Component Types
type PageHeaderProps = {
  title: string;
  description: string;
};

type ChallengeTabsProps = {
  form: ReturnType<typeof useForm<CreateChallengeForm>>;
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  onSubmit: (data: CreateChallengeForm) => void;
};

type ChallengeDetailsFormProps = {
  form: ReturnType<typeof useForm<CreateChallengeForm>>;
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  onSubmit: (data: CreateChallengeForm) => void;
};

// Atomic Components
const PageHeader = ({ title, description }: PageHeaderProps) => (
  <hgroup className="space-y-4">
    <h1 className="text-3xl font-black lg:text-5xl">{title}</h1>
    <p className="text-foreground/80 text-lg">{description}</p>
  </hgroup>
);

const ChallengeTabs = ({
  form,
  date,
  setDate,
  onSubmit,
}: ChallengeTabsProps) => (
  <Tabs defaultValue="basic" className="w-full">
    <TabsList className="grid w-full grid-cols-2">
      <TabsTrigger value="basic">Challenge Details</TabsTrigger>
      <TabsTrigger value="advanced">Teams & Invitations</TabsTrigger>
    </TabsList>

    <TabsContent value="basic">
      <ChallengeDetailsForm
        form={form}
        date={date}
        setDate={setDate}
        onSubmit={onSubmit}
      />
    </TabsContent>

    <TabsContent value="advanced">
      <TeamConfiguration />
    </TabsContent>
  </Tabs>
);

const ChallengeDetailsForm = ({
  form,
  date,
  setDate,
  onSubmit,
}: ChallengeDetailsFormProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Trophy className="text-primary h-5 w-5" />
        <span>Challenge Information</span>
      </CardTitle>
      <CardDescription>
        Set up your challenge with a title, description, and timing details.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
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
              <FormItem>
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
              <FormItem className="flex flex-row items-start space-x-3 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Team-Based Challenge</FormLabel>
                  <FormDescription>
                    Enable this option to allow participants to compete in teams
                    rather than individually.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormActions
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
  <div className="space-y-4">
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
  isValid: boolean;
  isDirty: boolean;
};

const FormActions = ({ isValid, isDirty }: FormActionsProps) => (
  <div className="flex justify-end gap-2 pt-2">
    <Button variant="outline">Cancel</Button>
    <Button type="submit" className="gap-2" disabled={!isValid || !isDirty}>
      Next: Configure Teams
    </Button>
  </div>
);

const TeamConfiguration = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Users className="text-primary h-5 w-5" />
        <span>Team Configuration</span>
      </CardTitle>
      <CardDescription>
        Set up team details and invite participants to your challenge.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <EmptyTeamState />
      <Separator />
      <TeamConfigurationInfo />
      <div className="flex justify-end pt-2">
        <Button type="button" disabled className="gap-2">
          Complete Team Setup After Creating Challenge
        </Button>
      </div>
    </CardContent>
  </Card>
);

const EmptyTeamState = () => (
  <div className="bg-muted/40 rounded-lg border p-6 text-center">
    <div className="bg-primary/10 mx-auto mb-4 w-fit rounded-full p-3">
      <Users className="text-primary h-6 w-6" />
    </div>
    <h3 className="mb-2 text-xl font-semibold">Create Challenge First</h3>
    <p className="text-muted-foreground mx-auto max-w-md">
      Complete the basic challenge details before configuring teams and sending
      invitations.
    </p>
  </div>
);

const TeamConfigurationInfo = () => (
  <div className="space-y-4">
    <h3 className="font-medium">
      Teams will be configured here after creating the challenge
    </h3>
    <ul className="text-muted-foreground ml-4 list-inside list-disc space-y-1">
      <li>Create multiple teams with custom names</li>
      <li>Add participants to teams via email invitation</li>
      <li>Assign team captains with additional permissions</li>
      <li>Set team size limits and other competition parameters</li>
    </ul>
  </div>
);
