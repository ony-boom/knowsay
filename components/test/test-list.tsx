import { Test } from "@/schemas/testSchema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { getUser } from "@/lib/actions/get-user";

export function TestList({ tests }: { tests: Test[] }) {
  if (tests.length === 0) {
    return (
      <div className="grid h-full place-items-center">
        <p>No tests found.</p>
      </div>
    );
  }

  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tests.map((test) => (
        <TestListItem key={test.test_id} test={test} />
      ))}
    </div>
  );
}

const TestListItem = async ({ test }: { test: Test }) => {
  const creationDate = new Date(test.created_at).toLocaleDateString();

  const creator = test.creator_id
    ? (await getUser(test.creator_id)).firstName
    : "Knowsay";

  return (
    <Card key={test.test_id}>
      <CardHeader>
        <CardTitle className="text-lg font-medium">{test.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {test.description}
        </CardDescription>

        <CardContent className="mt-4 flex justify-between p-0">
          <small className="text-muted-foreground">{creationDate}</small>
          <small className="text-muted-foreground">by {creator}</small>
        </CardContent>
      </CardHeader>
    </Card>
  );
};
