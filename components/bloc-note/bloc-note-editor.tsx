"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import { BlockNoteView } from "@blocknote/shadcn";
import { BlockNoteViewProps } from "@blocknote/react";
import {
  DefaultBlockSchema,
  DefaultInlineContentSchema,
  DefaultStyleSchema,
} from "@blocknote/core";

export default function BlocNoteEditor(
  props: BlockNoteViewProps<
    DefaultBlockSchema,
    DefaultInlineContentSchema,
    DefaultStyleSchema
  >,
) {
  return <BlockNoteView {...props} theme="light" />;
}
