import { PlusIcon } from "lucide-react";
import Link from "next/link";

export const AddTestQuestionButton = ({ pathname }: { pathname: string }) => {
  return (
    <Link
      href={`${pathname}/question`}
      className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow transition-colors focus-visible:ring-1 focus-visible:outline-none"
    >
      <PlusIcon className="mr-2 h-4 w-4" />
      Add Question
    </Link>
  );
};
