type EmptyAnswersProps = {
  message: string;
  description: string;
};

export const EmptyAnswers = ({ message, description }: EmptyAnswersProps) => (
  <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
    <h3 className="text-lg font-medium">{message}</h3>
    <p className="text-muted-foreground mt-1 text-sm">{description}</p>
  </div>
);
