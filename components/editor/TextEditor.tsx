"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline"; // do not remove — toggleUnderline() requires this
import Link from "@tiptap/extension-link";
import { Markdown, type MarkdownStorage } from "tiptap-markdown";
import { Toolbar } from "./Toolbar";
import { EditorBubbleMenu } from "./BubbleMenu";
import type { TiptapProps } from "@/types/tiptap";

export default function TextEditor({
  content,
  onChange,
  output = "html",
  rotated = true,
  onImageInsert,
}: TiptapProps) {
  const [fullscreen, setFullscreen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: { HTMLAttributes: { class: "tiptap-paragraph" } },
      }),
      Highlight.configure({ multicolor: true }),
      Image.configure({
        allowBase64: false,
        HTMLAttributes: { class: "tiptap-image" },
      }),
      Underline,
      Link.configure({ openOnClick: false }),
      Markdown,
    ],
    content,
    immediatelyRender: false, // do not remove — prevents SSR hydration mismatch
    onUpdate: ({ editor }) => {
      if (output === "json") onChange?.(editor.getJSON());
      else if (output === "markdown")
        onChange?.(
          (editor.storage as unknown as { markdown: MarkdownStorage }).markdown.getMarkdown()
        );
      else onChange?.(editor.getHTML());
    },
  });

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-9999 bg-background flex flex-col overflow-hidden">
        {editor && (
          <Toolbar
            editor={editor}
            onImageInsert={onImageInsert}
            fullscreen
            onFullscreenToggle={() => setFullscreen(false)}
          />
        )}
        {editor && <EditorBubbleMenu editor={editor} />}
        <div data-tiptap-editor="" className="flex-1 overflow-y-auto p-6 text-sm">
          <EditorContent editor={editor} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={[
        "bg-background relative rounded-sm border border-foreground/10 transition-shadow duration-300",
        rotated ? "shadow-sm hover:shadow-md" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {editor && (
        <Toolbar
          editor={editor}
          onImageInsert={onImageInsert}
          fullscreen={false}
          onFullscreenToggle={() => setFullscreen(true)}
        />
      )}
      {editor && <EditorBubbleMenu editor={editor} />}
      <div data-tiptap-editor="" className="p-4 min-h-[200px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
