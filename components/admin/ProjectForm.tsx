"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X } from "@phosphor-icons/react";
import AssetSelector from "@/components/admin/AssetSelector";
import { createProject, updateProject } from "@/lib/actions/project.action";
import type { IProject, ICategory } from "@/database";

const FIELD_CLASS =
  "mt-2 w-full rounded-xl bg-[#f4f4f2] px-4 py-3 font-sans text-base text-foreground outline-none focus:bg-[#eeeeec]";

function parseCustomMetadata(raw: string): Record<string, unknown> | undefined {
  if (!raw.trim()) return undefined;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
  } catch {
    // fall through to undefined — validated again below before submit
  }
  return undefined;
}

export default function ProjectForm({
  project,
  categories,
}: {
  project?: IProject;
  categories: ICategory[];
}) {
  const router = useRouter();
  const isEdit = !!project;

  const [categoryId, setCategoryId] = useState(
    project?.categoryId ? String(project.categoryId) : categories[0]?._id ? String(categories[0]._id) : ""
  );
  const [title, setTitle] = useState(project?.title ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [coverImage, setCoverImage] = useState(project?.coverImage);
  const [year, setYear] = useState(project?.year ?? new Date().getFullYear());
  const [client, setClient] = useState(project?.client ?? "");
  const [tags, setTags] = useState((project?.tags ?? []).join(", "));
  const [order, setOrder] = useState(project?.order ?? 0);
  const [status, setStatus] = useState(project?.status ?? "draft");
  const [isFeatured, setIsFeatured] = useState(project?.isFeatured ?? false);
  const [seoTitle, setSeoTitle] = useState(project?.seo?.title ?? "");
  const [seoDescription, setSeoDescription] = useState(project?.seo?.description ?? "");
  const [customMetadataRaw, setCustomMetadataRaw] = useState(
    project?.customMetadata && Object.keys(project.customMetadata).length
      ? JSON.stringify(project.customMetadata, null, 2)
      : ""
  );

  const [assetSelectorOpen, setAssetSelectorOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (customMetadataRaw.trim() && parseCustomMetadata(customMetadataRaw) === undefined) {
      setError("Custom metadata must be valid JSON (an object).");
      return;
    }

    setIsSubmitting(true);

    const params = {
      categoryId,
      title,
      description: description || undefined,
      coverImage:
        coverImage?.url && coverImage.fileId
          ? { url: coverImage.url, fileId: coverImage.fileId }
          : undefined,
      year: year || undefined,
      client: client || undefined,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      order,
      status,
      isFeatured,
      seo:
        seoTitle || seoDescription
          ? { title: seoTitle || undefined, description: seoDescription || undefined }
          : undefined,
      customMetadata: parseCustomMetadata(customMetadataRaw),
    };

    const result = isEdit
      ? await updateProject({ id: String(project._id), ...params })
      : await createProject(params);

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error?.message ?? "Something went wrong.");
      return;
    }

    if (isEdit) {
      router.refresh();
    } else {
      router.push(`/admin/work/${String(result.data?._id ?? "")}/edit`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      <div className="grid gap-6 sm:grid-cols-2">
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
            placeholder="Project title"
          />
        </div>
        <div>
          <label className="font-sans text-sm font-semibold text-foreground">
            Category
          </label>
          <select
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={FIELD_CLASS}
          >
            {categories.length === 0 && <option value="">No categories yet</option>}
            {categories.map((cat) => (
              <option key={String(cat._id)} value={String(cat._id)}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6">
        <label className="font-sans text-sm font-semibold text-foreground">
          Description
        </label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${FIELD_CLASS} resize-none`}
        />
      </div>

      <div className="mt-6">
        <label className="font-sans text-sm font-semibold text-foreground">
          Cover image
        </label>
        <div className="mt-2 flex items-center gap-4">
          {coverImage?.url && (
            <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg bg-[#f4f4f2]">
              <Image
                src={coverImage.url}
                alt=""
                fill
                sizes="128px"
                className="object-cover"
                unoptimized
              />
              <button
                type="button"
                onClick={() => setCoverImage(undefined)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
              >
                <X size={12} />
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() => setAssetSelectorOpen(true)}
            className="rounded-full border border-foreground/15 px-4 py-2 font-sans text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            {coverImage?.url ? "Change image" : "Choose image"}
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        <div>
          <label className="font-sans text-sm font-semibold text-foreground">
            Client
          </label>
          <input
            type="text"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            className={FIELD_CLASS}
          />
        </div>
        <div>
          <label className="font-sans text-sm font-semibold text-foreground">
            Year
          </label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className={FIELD_CLASS}
          />
        </div>
        <div>
          <label className="font-sans text-sm font-semibold text-foreground">
            Sort order
          </label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            className={FIELD_CLASS}
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
          placeholder="Comma-separated, e.g. logo, packaging, print"
        />
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <label className="font-sans text-sm font-semibold text-foreground">
            Status
          </label>
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as "draft" | "published" | "archived")
            }
            className={FIELD_CLASS}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <label className="mt-8 flex w-fit items-center gap-2.5 sm:mt-auto sm:pb-3.5">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="h-4 w-4 accent-accent"
          />
          <span className="font-sans text-sm font-semibold text-foreground">
            Featured
          </span>
        </label>
      </div>

      <fieldset className="mt-8 rounded-xl border border-foreground/10 p-5">
        <legend className="px-1 font-sans text-sm font-semibold text-foreground">
          SEO
        </legend>
        <div className="mt-2">
          <label className="font-sans text-sm font-semibold text-foreground">
            SEO title
          </label>
          <input
            type="text"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            className={FIELD_CLASS}
          />
        </div>
        <div className="mt-4">
          <label className="font-sans text-sm font-semibold text-foreground">
            SEO description
          </label>
          <textarea
            rows={2}
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            className={`${FIELD_CLASS} resize-none`}
          />
        </div>
      </fieldset>

      <div className="mt-6">
        <label className="font-sans text-sm font-semibold text-foreground">
          Custom metadata
        </label>
        <p className="mt-1 font-sans text-xs text-muted">
          Optional JSON object for project-specific fields that don&apos;t fit
          the standard schema.
        </p>
        <textarea
          rows={4}
          value={customMetadataRaw}
          onChange={(e) => setCustomMetadataRaw(e.target.value)}
          className={`${FIELD_CLASS} resize-none font-mono text-sm`}
          placeholder={'{\n  "awards": ["Awwwards SOTD"]\n}'}
        />
      </div>

      {error && <p className="mt-6 font-sans text-sm text-accent">{error}</p>}

      <div className="mt-10 flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting || categories.length === 0}
          className="inline-flex rounded-full bg-primary px-7 py-3.5 font-sans text-sm font-semibold text-white disabled:opacity-50"
        >
          {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Create project"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/work")}
          className="font-sans text-sm font-semibold text-muted hover:text-foreground"
        >
          Cancel
        </button>
      </div>

      <AssetSelector
        isOpen={assetSelectorOpen}
        onClose={() => setAssetSelectorOpen(false)}
        accept="image"
        onSelect={(url, fileId) => setCoverImage({ url, fileId: fileId ?? "" })}
      />
    </form>
  );
}
