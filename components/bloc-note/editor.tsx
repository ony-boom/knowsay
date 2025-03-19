"use client";

import dynamic from "next/dynamic";

export const Editor = dynamic(() => import("./bloc-note-editor"), {
  ssr: false,
});
