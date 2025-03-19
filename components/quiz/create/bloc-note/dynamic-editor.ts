"use client";

import dynamic from "next/dynamic";

export const DynamicQuestionEditor = dynamic(
  () => import("./question-editor"),
  { ssr: false },
);
