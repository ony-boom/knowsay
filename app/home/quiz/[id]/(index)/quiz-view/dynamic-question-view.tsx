"use client";

import dynamic from "next/dynamic";

export const DynamicQuestionView = dynamic(
  () => import("@/components/question-view"),
  { ssr: false },
);
