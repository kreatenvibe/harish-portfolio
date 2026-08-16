"use client";

import { useState } from "react";
import type { Editor } from "@tiptap/react";
import { useEditorState } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  CodeXml,
  Highlighter,
  List,
  ListOrdered,
  Quote,
  Link2,
  Unlink,
  Image as ImageIcon,
  Undo2,
  Redo2,
  Maximize2,
  Minimize2,
} from "lucide-react";

interface ToolbarProps {
  editor: Editor;
  onImageInsert?: (insert: (url: string) => void) => void;
  fullscreen: boolean;
  onFullscreenToggle: () => void;
}

function Divider() {
  return (
    <div
      style={{
        width: "1px",
        height: "20px",
        background: "rgb(10 10 10 / 0.12)",
        margin: "0 4px",
        flexShrink: 0,
      }}
    />
  );
}

function ToolbarBtn({
  onClick,
  isActive,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      style={{
        padding: "6px 10px",
        borderRadius: "4px",
        fontFamily: "var(--font-sans)",
        fontSize: "15px",
        color: isActive ? "var(--background)" : "var(--muted)",
        background: isActive ? "var(--foreground)" : "transparent",
        border: "none",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.4 : 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.1s, color 0.1s",
      }}
      onMouseEnter={(e) => {
        if (!isActive && !disabled)
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

function LinkBtn({ editor }: { editor: Editor }) {
  const [show, setShow] = useState(false);
  const [url, setUrl] = useState("");
  const isActive = editor.isActive("link");

  const handleOpen = () => {
    setUrl(editor.getAttributes("link").href ?? "");
    setShow(true);
  };

  const apply = () => {
    if (url.trim()) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
    setShow(false);
    setUrl("");
  };

  return (
    <div style={{ position: "relative" }}>
      <ToolbarBtn
        title={isActive ? "Edit link" : "Insert link"}
        onClick={handleOpen}
        isActive={isActive}
      >
        {isActive ? <Unlink size={15} /> : <Link2 size={15} />}
      </ToolbarBtn>
      {show && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            zIndex: 200,
            background: "var(--background)",
            border: "1.5px solid rgb(10 10 10 / 0.12)",
            borderRadius: "6px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
            padding: "12px",
            width: "280px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              margin: 0,
              color: "var(--foreground)",
            }}
          >
            Insert Link
          </p>
          <input
            autoFocus
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") apply();
              if (e.key === "Escape") setShow(false);
            }}
            placeholder="https://example.com"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              padding: "6px 10px",
              border: "1.5px solid rgb(10 10 10 / 0.12)",
              borderRadius: "4px",
              outline: "none",
              width: "100%",
              boxSizing: "border-box",
            }}
          />
          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShow(false)}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "14px",
                padding: "4px 12px",
                background: "transparent",
                border: "1.5px solid rgb(10 10 10 / 0.12)",
                borderRadius: "4px",
                cursor: "pointer",
                color: "var(--muted)",
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={apply}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "14px",
                padding: "4px 12px",
                background: "var(--foreground)",
                border: "1.5px solid var(--foreground)",
                borderRadius: "4px",
                cursor: "pointer",
                color: "var(--background)",
              }}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function Toolbar({ editor, onImageInsert, fullscreen, onFullscreenToggle }: ToolbarProps) {
  const state = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor.isActive("bold"),
      isItalic: ctx.editor.isActive("italic"),
      isUnderline: ctx.editor.isActive("underline"),
      isStrike: ctx.editor.isActive("strike"),
      isCode: ctx.editor.isActive("code"),
      isCodeBlock: ctx.editor.isActive("codeBlock"),
      isHighlight: ctx.editor.isActive("highlight", { color: "#fde2e1" }),
      isBulletList: ctx.editor.isActive("bulletList"),
      isOrderedList: ctx.editor.isActive("orderedList"),
      isBlockquote: ctx.editor.isActive("blockquote"),
      canUndo: ctx.editor.can().chain().focus().undo().run(),
      canRedo: ctx.editor.can().chain().focus().redo().run(),
      h1: ctx.editor.isActive("heading", { level: 1 }),
      h2: ctx.editor.isActive("heading", { level: 2 }),
      h3: ctx.editor.isActive("heading", { level: 3 }),
    }),
  });

  const handleImage = () => {
    if (onImageInsert) {
      onImageInsert((url: string) => {
        editor.chain().focus().setImage({ src: url }).run();
      });
    } else {
      const url = window.prompt("Image URL");
      if (url) editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div
      style={{
        background: "#f4f4f2",
        borderBottom: "1.5px solid rgb(10 10 10 / 0.12)",
        padding: "8px 12px",
        display: "flex",
        flexWrap: "wrap",
        gap: "4px",
        alignItems: "center",
        borderRadius: "6px 6px 0 0",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      {([1, 2, 3] as const).map((level) => (
        <ToolbarBtn
          key={level}
          title={`Heading ${level}`}
          onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
          isActive={state[`h${level}` as "h1" | "h2" | "h3"]}
        >
          H{level}
        </ToolbarBtn>
      ))}

      <Divider />

      <ToolbarBtn title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} isActive={state.isBold}>
        <Bold size={15} />
      </ToolbarBtn>
      <ToolbarBtn title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} isActive={state.isItalic}>
        <Italic size={15} />
      </ToolbarBtn>
      <ToolbarBtn title="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={state.isUnderline}>
        <UnderlineIcon size={15} />
      </ToolbarBtn>
      <ToolbarBtn title="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()} isActive={state.isStrike}>
        <Strikethrough size={15} />
      </ToolbarBtn>
      <ToolbarBtn title="Code" onClick={() => editor.chain().focus().toggleCode().run()} isActive={state.isCode}>
        <Code size={15} />
      </ToolbarBtn>
      <ToolbarBtn title="Code Block" onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={state.isCodeBlock}>
        <CodeXml size={15} />
      </ToolbarBtn>

      <Divider />

      <ToolbarBtn
        title="Highlight"
        onClick={() => editor.chain().focus().toggleHighlight({ color: "#fde2e1" }).run()}
        isActive={state.isHighlight}
      >
        <Highlighter size={15} />
      </ToolbarBtn>

      <Divider />

      <ToolbarBtn title="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={state.isBulletList}>
        <List size={15} />
      </ToolbarBtn>
      <ToolbarBtn title="Ordered list" onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={state.isOrderedList}>
        <ListOrdered size={15} />
      </ToolbarBtn>
      <ToolbarBtn title="Blockquote" onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={state.isBlockquote}>
        <Quote size={15} />
      </ToolbarBtn>

      <Divider />

      <LinkBtn editor={editor} />
      <ToolbarBtn title="Image" onClick={handleImage}>
        <ImageIcon size={15} />
      </ToolbarBtn>

      <Divider />

      <ToolbarBtn title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!state.canUndo}>
        <Undo2 size={15} />
      </ToolbarBtn>
      <ToolbarBtn title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!state.canRedo}>
        <Redo2 size={15} />
      </ToolbarBtn>

      <Divider />

      <ToolbarBtn title={fullscreen ? "Exit fullscreen" : "Fullscreen"} onClick={onFullscreenToggle}>
        {fullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
      </ToolbarBtn>
    </div>
  );
}
