import type { JSONContent } from "@tiptap/core";

export interface TiptapProps {
  content?: string | JSONContent;
  onChange?: (content: string | JSONContent) => void;
  output?: "html" | "json" | "markdown";
  rotated?: boolean;
  onImageInsert?: (insert: (url: string) => void) => void;
}
