"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X } from "@phosphor-icons/react";
import AssetSelector from "@/components/admin/AssetSelector";
import { createCategory, updateCategory } from "@/lib/actions/category.action";
import type { ICategory } from "@/database";

const FIELD_CLASS =
  "mt-2 w-full rounded-xl bg-[#f4f4f2] px-4 py-3 font-sans text-base text-foreground outline-none focus:bg-[#eeeeec]";

export default function CategoryForm({ category }: { category?: ICategory }) {
  const router = useRouter();
  const isEdit = !!category;

  const [name, setName] = useState(category?.name ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [coverImage, setCoverImage] = useState(category?.coverImage);
  const [order, setOrder] = useState(category?.order ?? 0);
  const [isActive, setIsActive] = useState(category?.isActive ?? true);

  const [assetSelectorOpen, setAssetSelectorOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const params = {
      name,
      description: description || undefined,
      coverImage:
        coverImage?.url && coverImage.fileId
          ? { url: coverImage.url, fileId: coverImage.fileId }
          : undefined,
      order,
      isActive,
    };

    const result = isEdit
      ? await updateCategory({ id: String(category._id), ...params })
      : await createCategory(params);

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error?.message ?? "Something went wrong.");
      return;
    }

    router.push("/admin/categories");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div>
        <label className="font-sans text-sm font-semibold text-foreground">
          Name
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={FIELD_CLASS}
          placeholder="e.g. Branding"
        />
      </div>

      <div className="mt-6">
        <label className="font-sans text-sm font-semibold text-foreground">
          Description
        </label>
        <textarea
          rows={3}
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

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
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

      <label className="mt-6 flex w-fit items-center gap-2.5">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="h-4 w-4 accent-accent"
        />
        <span className="font-sans text-sm font-semibold text-foreground">
          Active
        </span>
      </label>

      {error && <p className="mt-6 font-sans text-sm text-accent">{error}</p>}

      <div className="mt-10 flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex rounded-full bg-primary px-7 py-3.5 font-sans text-sm font-semibold text-white disabled:opacity-50"
        >
          {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Create category"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/categories")}
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
