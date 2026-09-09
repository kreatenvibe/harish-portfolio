"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X } from "@phosphor-icons/react";
import TextEditor from "@/components/editor/TextEditor";
import AssetSelector from "@/components/admin/AssetSelector";
import { createBlogPost, updateBlogPost } from "@/lib/actions/blog.action";
import { getImageKitUrl } from "@/lib/imagekit";
import type { IBlogPost } from "@/database";

const FIELD_CLASS =
  "mt-2 w-full rounded-md border border-line bg-surface px-4 py-2.5 font-sans text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-white/40 focus:ring-1 focus:ring-white/40";

export default function BlogPostForm({ post }: { post?: IBlogPost }) {
  const router = useRouter();
  const isEdit = !!post;

  const [title, setTitle] = useState(post?.title ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [tags, setTags] = useState((post?.tags ?? []).join(", "));
  const [published, setPublished] = useState(post?.published ?? false);
  const [coverImage, setCoverImage] = useState(post?.coverImage);

  const [assetSelectorOpen, setAssetSelectorOpen] = useState(false);
  const [assetTarget, setAssetTarget] = useState<"cover" | "editor">("cover");
  const editorInsertRef = useRef<((url: string) => void) | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleAssetSelect = (url: string, fileId?: string) => {
    if (assetTarget === "cover") {
      setCoverImage({ url, fileId: fileId ?? "" });
    } else {
      editorInsertRef.current?.(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const params = {
      title,
      excerpt,
      content,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      published,
      coverImage:
        coverImage?.url && coverImage.fileId
          ? { url: coverImage.url, fileId: coverImage.fileId }
          : undefined,
    };

    const result = isEdit
      ? await updateBlogPost({ id: String(post._id), ...params })
      : await createBlogPost(params);

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error?.message ?? "Something went wrong.");
      return;
    }

    router.push("/admin/blog");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      <div>
        <label className="font-sans text-sm font-semibold text-foreground">
          Title
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={FIELD_CLASS}
          placeholder="Post title"
        />
      </div>

      <div className="mt-6">
        <label className="font-sans text-sm font-semibold text-foreground">
          Excerpt
        </label>
        <textarea
          required
          rows={2}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className={`${FIELD_CLASS} resize-none`}
          placeholder="Short summary shown in listings"
        />
      </div>

      <div className="mt-6">
        <label className="font-sans text-sm font-semibold text-foreground">
          Cover image
        </label>
        <div className="mt-2 flex items-center gap-4">
          {coverImage?.url && (
            <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-md border border-line bg-surface">
              <Image
                src={getImageKitUrl(coverImage.url, { width: 300 })}
                alt=""
                fill
                sizes="128px"
                className="object-cover"
                unoptimized
              />
              <button
                type="button"
                onClick={() => setCoverImage(undefined)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white cursor-pointer"
              >
                <X size={12} />
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              setAssetTarget("cover");
              setAssetSelectorOpen(true);
            }}
            className="inline-flex items-center rounded-md border border-line bg-surface px-4 py-2 font-sans text-xs font-semibold text-foreground transition-colors hover:border-white/40 hover:bg-surface-hover cursor-pointer"
          >
            {coverImage?.url ? "Change image" : "Choose image"}
          </button>
        </div>
      </div>

      <div className="mt-6">
        <label className="font-sans text-sm font-semibold text-foreground">
          Content
        </label>
        <div className="mt-2">
          <TextEditor
            content={content}
            output="markdown"
            onChange={(value) => setContent(value as string)}
            onImageInsert={(insert) => {
              editorInsertRef.current = insert;
              setAssetTarget("editor");
              setAssetSelectorOpen(true);
            }}
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="font-sans text-sm font-semibold text-foreground">
          Tags
        </label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className={FIELD_CLASS}
          placeholder="Comma-separated, e.g. product, engineering"
        />
      </div>

      <label className="mt-6 flex w-fit items-center gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="h-4 w-4 rounded border-line bg-surface text-foreground focus:ring-0 focus:ring-offset-0"
        />
        <span className="font-sans text-sm font-semibold text-foreground">
          Published
        </span>
      </label>

      {error && (
        <p className="mt-6 font-mono text-xs text-red-400">{error}</p>
      )}

      <div className="mt-10 flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-md bg-foreground px-6 py-2.5 font-sans text-sm font-semibold text-background transition-colors hover:bg-white disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Create post"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/blog")}
          className="font-sans text-sm font-semibold text-muted hover:text-foreground transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>

      <AssetSelector
        isOpen={assetSelectorOpen}
        onClose={() => setAssetSelectorOpen(false)}
        onSelect={handleAssetSelect}
      />
    </form>
  );
}
