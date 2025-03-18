import { BadgeCheck } from "lucide-react";

interface AnswerItemProps {
  answer: {
    id: string;
    text: string;
    isCorrect: boolean;
  };
  index: number;
}

export const AnswerItem: React.FC<AnswerItemProps> = ({ answer, index }) => (
  <div
    className={`flex items-center rounded-lg p-2 ${
      answer.isCorrect ? "bg-green-50 dark:bg-green-950/30" : "bg-muted/40"
    }`}
  >
    <div
      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
        answer.isCorrect
          ? "bg-green-100 text-green-800 dark:bg-green-900/70 dark:text-green-300"
          : "bg-muted text-muted-foreground"
      }`}
    >
      {String.fromCharCode(65 + index)}
    </div>
    <span className="ml-2 flex-grow text-sm">{answer.text}</span>
    {answer.isCorrect && (
      <span className="mr-2 ml-1 inline-flex items-center text-xs font-medium whitespace-nowrap text-green-600 dark:text-green-400">
        <BadgeCheck className="mr-0.5 h-3 w-3" />
        <span className="hidden sm:inline">Correct</span>
      </span>
    )}
  </div>
);
