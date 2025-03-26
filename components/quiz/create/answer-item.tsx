import { Answer } from "@/app/home/quiz/[id]/edit/answer/page";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";

type AnswerItemProps = {
  answer: Answer;
  index: number;
  onEdit: (updatedAnswer: Answer) => void;
  onToggleCorrect: (id: string) => void;
  onDelete: (id: string) => void;
  isNew?: boolean;
  isModified?: boolean;
};

export const AnswerItem = ({
  answer,
  index,
  onEdit,
  onToggleCorrect,
  onDelete,
  isNew = false,
  isModified = false,
}: AnswerItemProps) => (
  <Card
    className="border-l-4 transition-all hover:shadow-md"
    style={{
      borderLeftColor: answer.isCorrect ? "var(--primary)" : "transparent",
    }}
  >
    <CardContent className="flex items-center justify-between p-4">
      <div className="flex flex-1 items-center gap-3">
        <span className="text-muted-foreground font-medium">{index + 1}.</span>
        <div className="flex-1">
          <Input
            value={answer.text}
            onChange={(e) => onEdit({ ...answer, text: e.target.value })}
            className="border-none p-0 shadow-none focus-visible:ring-0"
          />
          <div className="mt-1 flex gap-2">
            {isNew && (
              <Badge
                variant="outline"
                className="border-green-200 bg-green-50 text-xs text-green-700"
              >
                New
              </Badge>
            )}
            {isModified && (
              <Badge
                variant="outline"
                className="border-amber-200 bg-amber-50 text-xs text-amber-700"
              >
                Modified
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center space-x-2">
          <Switch
            id={`correct-${answer.id}`}
            checked={answer.isCorrect}
            onCheckedChange={() => onToggleCorrect(answer.id)}
          />
          <Label htmlFor={`correct-${answer.id}`} className="text-sm">
            Correct
          </Label>
        </div>
        <Button variant="ghost" size="icon" onClick={() => onDelete(answer.id)}>
          <Trash2 className="text-muted-foreground h-4 w-4" />
        </Button>
      </div>
    </CardContent>
  </Card>
);
