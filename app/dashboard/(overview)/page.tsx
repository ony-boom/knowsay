import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default async function Page() {
  return (
    <main className="flex w-full flex-col p-8">
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <QuizzListItem
            key={index}
            title={`Sample Quiz ${index + 1}`}
            description="This is a sample quiz description"
            category="General Knowledge"
            difficulty="Medium"
            createdAt="2023-07-15"
          />
        ))}
      </div>

      <div className="mt-8">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </main>
  );
}

const QuizzListItem = ({
  title,
  description,
  category,
  difficulty,
  createdAt,
}: QuizzListItemProps) => {
  return (
    <Card className="w-full transition-shadow hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {description}
        </CardDescription>
        <div className="mt-2 flex gap-2">
          <span className="bg-secondary inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
            {difficulty}
          </span>
          <span className="bg-primary/10 text-primary inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
            {category}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground flex justify-end text-xs">
          <span>Created: {createdAt}</span>
        </div>
      </CardContent>
    </Card>
  );
};

type QuizzListItemProps = {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  createdAt: string;
};
