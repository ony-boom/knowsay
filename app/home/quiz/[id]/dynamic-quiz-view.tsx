"use client";

import dynamic from "next/dynamic";

export const QuizView = dynamic(() => import("./quiz-view"), { ssr: false });
