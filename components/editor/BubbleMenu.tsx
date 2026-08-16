"use client";

import { useRef, useState } from "react";
import type { Editor } from "@tiptap/react";
import { useEditorState } from "@tiptap/react";
import { BubbleMenu as TiptapBubbleMenu } from "@tiptap/react/menus";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Highlighter,
  Link2,
  Unlink,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";

interface EditorBubbleMenuProps {
  editor: Editor;
}

function BubbleBtn({
  onClick,
  isActive,
  title,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      style={{
        padding: "4px 8px",
        borderRadius: "3px",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: isActive ? "var(--background)" : "var(--muted)",
        background: isActive ? "var(--foreground)" : "transparent",
        transition: "background 0.1s, color 0.1s",
      }}
      onMouseEnter={(e) => {
        if (!isActive)
          (e.currentTarget as HTMLButtonElement).style.background = "#eeeeec";
      }}
      onMouseLeave={(e) => {
        if (!isActive)
          (e.currentTarget as HTMLButtonElement).style.background = "transparent";
      }}
    >
      {children}
    </button>
  );
}

export function EditorBubbleMenu({ editor }: EditorBubbleMenuProps) {
  const [showLink, setShowLink] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const showLinkRef = useRef(false);

  const state = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor.isActive("bold"),
      isItalic: ctx.editor.isActive("italic"),
      isUnderline: ctx.editor.isActive("underline"),
      isStrike: ctx.editor.isActive("strike"),
      isHighlight: ctx.editor.isActive("highlight", { color: "#fde2e1" }),
      isCode: ctx.editor.isActive("code"),
      isBulletList: ctx.editor.isActive("bulletList"),
      isOrderedList: ctx.editor.isActive("orderedList"),
      isBlockquote: ctx.editor.isActive("blockquote"),
      isLink: ctx.editor.isActive("link"),
    }),
  });

  const openLink = () => {
    setLinkUrl(editor.getAttributes("link").href ?? "");
    showLinkRef.current = true;
    setShowLink(true);
  };

  const applyLink = () => {
    showLinkRef.current = false;
    setShowLink(false);
    if (linkUrl.trim()) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
    setLinkUrl("");
  };

  const cancelLink = () => {
    showLinkRef.current = false;
    setShowLink(false);
    setLinkUrl("");
    editor.commands.focus();
  };

  return (
    <TiptapBubbleMenu
      editor={editor}
      shouldShow={({ editor: e }) => !e.state.selection.empty || showLinkRef.current}
      style={{
        background: "var(--background)",
        border: "1.5px solid rgb(10 10 10 / 0.12)",
        borderRadius: "6px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
        padding: "4px 6px",
        display: "flex",
        flexDirection: "column",
        gap: "2px",
        zIndex: 50,
      }}
    >
      <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
        <BubbleBtn title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} isActive={state.isBold}>
          <Bold size={14} />
        </BubbleBtn>
        <BubbleBtn title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} isActive={state.isItalic}>
          <Italic size={14} />
        </BubbleBtn>
        <BubbleBtn title="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={state.isUnderline}>
          <UnderlineIcon size={14} />
        </BubbleBtn>
        <BubbleBtn title="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()} isActive={state.isStrike}>
          <Strikethrough size={14} />
        </BubbleBtn>
        <BubbleBtn
          title="Highlight"
          onClick={() => editor.chain().focus().toggleHighlight({ color: "#fde2e1" }).run()}
          isActive={state.isHighlight}
        >
          <Highlighter size={14} />
        </BubbleBtn>
        <BubbleBtn title="Code" onClick={() => editor.chain().focus().toggleCode().run()} isActive={state.isCode}>
          <Code size={14} />
        </BubbleBtn>

        <div style={{ width: "1px", height: "20px", background: "rgb(10 10 10 / 0.12)", margin: "0 2px" }} />

        <BubbleBtn title="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={state.isBulletList}>
          <List size={14} />
        </BubbleBtn>
        <BubbleBtn title="Ordered list" onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={state.isOrderedList}>
          <ListOrdered size={14} />
        </BubbleBtn>
        <BubbleBtn title="Blockquote" onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={state.isBlockquote}>
          <Quote size={14} />
        </BubbleBtn>

        <div style={{ width: "1px", height: "20px", background: "rgb(10 10 10 / 0.12)", margin: "0 2px" }} />

        <BubbleBtn
          title={state.isLink ? "Edit link" : "Insert link"}
          onClick={openLink}
          isActive={state.isLink}
        >
          {state.isLink ? <Unlink size={14} /> : <Link2 size={14} />}
        </BubbleBtn>
      </div>

      {showLink && (
        <div
          style={{
            borderTop: "1px solid rgb(10 10 10 / 0.12)",
            paddingTop: "8px",
            marginTop: "2px",
            display: "flex",
            gap: "6px",
            alignItems: "center",
          }}
        >
          <input
            autoFocus
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") applyLink();
              if (e.key === "Escape") cancelLink();
            }}
            placeholder="https://example.com"
            style={{
              flex: 1,
              fontFamily: "var(--font-sans)",
              fontSize: "13px",
              padding: "4px 8px",
              border: "1.5px solid rgb(10 10 10 / 0.12)",
              borderRadius: "4px",
              outline: "none",
              minWidth: 0,
            }}
          />
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={cancelLink}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "13px",
              padding: "3px 8px",
              background: "transparent",
              border: "1.5px solid rgb(10 10 10 / 0.12)",
              borderRadius: "4px",
              cursor: "pointer",
              color: "var(--muted)",
              flexShrink: 0,
            }}
          >
            ×
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={applyLink}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "13px",
              padding: "3px 8px",
              background: "var(--foreground)",
              border: "1.5px solid var(--foreground)",
              borderRadius: "4px",
              cursor: "pointer",
              color: "var(--background)",
              flexShrink: 0,
            }}
          >
            Apply
          </button>
        </div>
      )}
    </TiptapBubbleMenu>
  );
}
