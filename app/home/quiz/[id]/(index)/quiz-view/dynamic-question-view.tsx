"use client";

import dynamic from "next/dynamic";

export const DynamicQuestionView = dynamic(
  () => import("@/components/quiz/take/question-view"),
  { ssr: false },
);
