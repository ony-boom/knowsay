import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const StatCard = ({
  title,
  description,
  value,
}: {
  title: string;
  description: string;
  value: ReactNode;
}) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="text-4xl font-bold">{value}</div>
    </CardContent>
  </Card>
);
