import { UpdateTestForm } from "@/components/update-test-form";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { getTestById } from "@/lib/actions/get-test";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const test = await getTestById(id);

  if (!test) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6">
        <div className="bg-muted rounded-lg p-8 text-center shadow-sm">
          <h2 className="text-2xl font-semibold tracking-tight">
            Test Not Found
          </h2>
          <p className="text-muted-foreground mt-2">
            The test you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <a
            href="/home/test"
            className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
          >
            Back to Tests
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-6 pt-0 md:px-6 md:py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <hgroup className="space-y-2 md:space-y-4">
          <h1 className="text-2xl font-black md:text-3xl lg:text-5xl">
            Edit Test
          </h1>
          <p className="text-foreground/80 text-base md:text-lg">
            Update your test details to refine the assessment experience.
          </p>
        </hgroup>
      </div>

      {/* edit test form */}
      <Collapsible className="w-full rounded-lg border" defaultOpen>
        <CollapsibleTrigger asChild>
          <div className="flex w-full items-center justify-between p-4 font-medium">
            <span>Test Information</span>
            <Button variant="ghost" size="sm">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="border-t p-4 pt-0">
          <UpdateTestForm initialData={test} />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
