import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";

export const BlocNote = () => {
  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: "paragraph",
        content: "Start typing here...",
      },
    ],
  });

  return <BlockNoteView editor={editor} />;
};
