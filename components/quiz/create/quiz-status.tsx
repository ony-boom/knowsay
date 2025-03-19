type QuizStatusProps = {
  status: "draft" | "in_progress" | "ready" | "published" | null;
};

export const QuizStatus = ({ status }: QuizStatusProps) => {
  const statusConfig = {
    draft: {
      label: "Draft",
      className: "bg-slate-100 text-slate-700 border border-slate-200",
    },
    in_progress: {
      label: "In Progress",
      className: "bg-amber-100 text-amber-700 border border-amber-200",
    },
    ready: {
      label: "Ready",
      className: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    },
    published: {
      label: "Published",
      className: "bg-blue-100 text-blue-700 border border-blue-200",
    },
  };

  const config = status ? statusConfig[status] : null;

  return config ? (
    <div className="flex items-center">
      <span
        className={`inline-flex h-6 items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
      >
        {config.label}
      </span>
    </div>
  ) : null;
};
