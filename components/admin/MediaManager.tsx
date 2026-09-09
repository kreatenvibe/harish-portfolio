"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import {
  FilmSlate,
  FileText,
  File as FileIcon,
  Plus,
  Trash,
  PencilSimple,
} from "@phosphor-icons/react";
import AssetSelector, { type MediaKind } from "@/components/admin/AssetSelector";
import ReorderButtons from "@/components/admin/ReorderButtons";
import {
  getMediaBySection,
  createMedia,
  updateMedia,
  deleteMedia,
  restoreMedia,
  reorderMedia,
} from "@/lib/actions/media.action";
import { getImageKitUrl } from "@/lib/imagekit";
import type { IMedia } from "@/database";

function MediaThumb({ item }: { item: IMedia }) {
  if (item.type === "video") {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <FilmSlate size={28} className="text-muted" />
      </div>
    );
  }
  if (item.type === "pdf") {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <FileText size={28} className="text-muted" />
      </div>
    );
  }
  if (item.type === "other") {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <FileIcon size={28} className="text-muted" />
      </div>
    );
  }
  return (
    <Image
      src={getImageKitUrl(item.url, { width: 400 })}
      alt={item.altText ?? item.title ?? ""}
      fill
      sizes="160px"
      className="object-cover"
      unoptimized
    />
  );
}

export default function MediaManager({
  projectId,
  sectionId,
}: {
  projectId: string;
  sectionId: string;
}) {
  const [media, setMedia] = useState<IMedia[]>([]);
  const [deletedMedia, setDeletedMedia] = useState<IMedia[]>([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [assetSelectorOpen, setAssetSelectorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFields, setEditFields] = useState({
    title: "",
    description: "",
    altText: "",
    caption: "",
  });
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  useEffect(() => {
    // A MediaManager instance always mounts fresh with a fixed sectionId
    // (the parent unmounts it on section collapse), so the initial
    // `loading: true` state already covers this — no need to set it again.
    let cancelled = false;
    getMediaBySection(sectionId).then((result) => {
      if (cancelled) return;
      if (result.success && result.data) setMedia(result.data);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [sectionId]);

  const toggleDeleted = () => {
    const next = !showDeleted;
    setShowDeleted(next);
    if (next && deletedMedia.length === 0) {
      startTransition(async () => {
        const result = await getMediaBySection(sectionId, true);
        if (result.success && result.data) setDeletedMedia(result.data);
      });
    }
  };

  const handleUploadSelect = (
    items: { url: string; fileId: string; type: MediaKind }[]
  ) => {
    startTransition(async () => {
      setError("");
      let nextOrder = media.length;
      for (const item of items) {
        const result = await createMedia({
          projectId,
          sectionId,
          type: item.type,
          url: item.url,
          fileId: item.fileId,
          order: nextOrder++,
        });
        if (result.success && result.data) {
          setMedia((prev) => [...prev, result.data as IMedia]);
        } else {
          setError(result.error?.message ?? "Failed to add media.");
        }
      }
    });
  };

  const startEdit = (item: IMedia) => {
    setEditingId(String(item._id));
    setEditFields({
      title: item.title ?? "",
      description: item.description ?? "",
      altText: item.altText ?? "",
      caption: item.caption ?? "",
    });
  };

  const saveEdit = (id: string) => {
    startTransition(async () => {
      const result = await updateMedia({
        id,
        title: editFields.title || undefined,
        description: editFields.description || undefined,
        altText: editFields.altText || undefined,
        caption: editFields.caption || undefined,
      });
      if (!result.success || !result.data) {
        setError(result.error?.message ?? "Failed to update media.");
        return;
      }
      const updated = result.data;
      setMedia((prev) => prev.map((m) => (String(m._id) === id ? updated : m)));
      setEditingId(null);
    });
  };

  const handleDelete = (item: IMedia) => {
    const id = String(item._id);
    startTransition(async () => {
      const result = await deleteMedia({ id });
      if (!result.success) {
        setError(result.error?.message ?? "Failed to delete media.");
        return;
      }
      setMedia((prev) => prev.filter((m) => String(m._id) !== id));
      setDeletedMedia((prev) => [item, ...prev]);
    });
  };

  const handleRestore = (item: IMedia) => {
    const id = String(item._id);
    startTransition(async () => {
      const result = await restoreMedia({ id });
      if (!result.success || !result.data) {
        setError(result.error?.message ?? "Failed to restore media.");
        return;
      }
      setDeletedMedia((prev) => prev.filter((m) => String(m._id) !== id));
      setMedia((prev) => [...prev, result.data as IMedia]);
    });
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= media.length) return;
    const next = [...media];
    [next[index], next[target]] = [next[target], next[index]];
    setMedia(next);

    startTransition(async () => {
      const result = await reorderMedia({
        items: next.map((m, i) => ({ id: String(m._id), order: i })),
      });
      if (!result.success) {
        setError(result.error?.message ?? "Failed to reorder.");
        setMedia(media);
      }
    });
  };

  return (
    <div className="rounded-md border border-line bg-surface/30 p-4">
      {error && <p className="mb-3 font-mono text-xs text-red-400">{error}</p>}

      {loading ? (
        <p className="font-sans text-sm text-muted">Loading media…</p>
      ) : media.length === 0 ? (
        <p className="font-sans text-sm text-muted">No media in this section yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {media.map((item, i) => {
            const id = String(item._id);
            const isEditing = editingId === id;
            return (
              <div
                key={id}
                className="overflow-hidden rounded-md border border-line bg-surface"
              >
                <div className="relative aspect-square w-full bg-background border-b border-line">
                  <MediaThumb item={item} />
                </div>
                <div className="p-2.5">
                  <p className="truncate font-sans text-xs font-semibold text-foreground">
                    {item.title || item.type}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-1">
                    <ReorderButtons
                      onMoveUp={() => move(i, -1)}
                      onMoveDown={() => move(i, 1)}
                      disableUp={i === 0}
                      disableDown={i === media.length - 1}
                      isPending={isPending}
                    />
                    <span className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        aria-label="Edit media"
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-line bg-surface text-muted transition-colors hover:border-white/40 hover:text-foreground cursor-pointer"
                      >
                        <PencilSimple size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        disabled={isPending}
                        aria-label="Delete media"
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-line bg-surface text-muted transition-colors hover:border-red-500/50 hover:text-red-400 disabled:opacity-50 cursor-pointer"
                      >
                        <Trash size={12} />
                      </button>
                    </span>
                  </div>
                </div>

                {isEditing && (
                  <div className="space-y-2 border-t border-line p-2.5 bg-background/50">
                    <input
                      type="text"
                      value={editFields.title}
                      onChange={(e) =>
                        setEditFields((f) => ({ ...f, title: e.target.value }))
                      }
                      placeholder="Title"
                      className="w-full rounded-md border border-line bg-surface px-2 py-1.5 font-sans text-xs text-foreground outline-none placeholder:text-muted focus:border-white/40"
                    />
                    <input
                      type="text"
                      value={editFields.altText}
                      onChange={(e) =>
                        setEditFields((f) => ({ ...f, altText: e.target.value }))
                      }
                      placeholder="Alt text"
                      className="w-full rounded-md border border-line bg-surface px-2 py-1.5 font-sans text-xs text-foreground outline-none placeholder:text-muted focus:border-white/40"
                    />
                    <input
                      type="text"
                      value={editFields.caption}
                      onChange={(e) =>
                        setEditFields((f) => ({ ...f, caption: e.target.value }))
                      }
                      placeholder="Caption"
                      className="w-full rounded-md border border-line bg-surface px-2 py-1.5 font-sans text-xs text-foreground outline-none placeholder:text-muted focus:border-white/40"
                    />
                    <textarea
                      rows={2}
                      value={editFields.description}
                      onChange={(e) =>
                        setEditFields((f) => ({ ...f, description: e.target.value }))
                      }
                      placeholder="Description"
                      className="w-full resize-none rounded-md border border-line bg-surface px-2 py-1.5 font-sans text-xs text-foreground outline-none placeholder:text-muted focus:border-white/40"
                    />
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => saveEdit(id)}
                        disabled={isPending}
                        className="rounded-md bg-foreground px-3 py-1 font-sans text-xs font-semibold text-background hover:bg-white disabled:opacity-50 cursor-pointer transition-colors"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="font-sans text-xs font-semibold text-muted hover:text-foreground transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setAssetSelectorOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-4 py-2 font-sans text-xs font-semibold text-foreground transition-colors hover:border-white/40 hover:bg-surface-hover cursor-pointer"
        >
          <Plus size={14} />
          Add media
        </button>
        <button
          type="button"
          onClick={toggleDeleted}
          className="font-sans text-xs font-semibold text-muted hover:text-foreground transition-colors cursor-pointer"
        >
          {showDeleted ? "Hide deleted" : "Show deleted"}
        </button>
      </div>

      {showDeleted && (
        <div className="mt-4 border-t border-line pt-4">
          {deletedMedia.length === 0 ? (
            <p className="font-sans text-xs text-muted">No deleted media.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {deletedMedia.map((item) => (
                <div
                  key={String(item._id)}
                  className="overflow-hidden rounded-md border border-line bg-surface opacity-60"
                >
                  <div className="relative aspect-square w-full bg-background border-b border-line">
                    <MediaThumb item={item} />
                  </div>
                  <div className="p-2.5">
                    <p className="truncate font-sans text-xs font-semibold text-foreground">
                      {item.title || item.type}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleRestore(item)}
                      disabled={isPending}
                      className="mt-2 w-full rounded-md border border-line bg-surface px-3 py-1 font-sans text-xs font-semibold text-foreground transition-colors hover:border-white/40 hover:bg-surface-hover disabled:opacity-50 cursor-pointer"
                    >
                      Restore
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <AssetSelector
        isOpen={assetSelectorOpen}
        onClose={() => setAssetSelectorOpen(false)}
        accept="all"
        multiple
        onSelectMultiple={handleUploadSelect}
      />
    </div>
  );
}
