"use client";

import Editor from "@/components/editor/editor";
import { JSONContent } from "novel";
import { useState } from "react";

export const defaultValue: JSONContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [],
    },
  ],
};

export const QuestionEditor = () => {
  const [content, setContent] = useState<JSONContent>();

  const handleChange = (newContent: JSONContent) => {
    setContent(newContent);
    console.log(newContent);
  };

  return <Editor initialValue={defaultValue} onChange={handleChange} />;
};
