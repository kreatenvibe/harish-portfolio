"use client";

import { useState, useTransition } from "react";
import { Plus, CaretDown, CaretUp, Trash, PencilSimple } from "@phosphor-icons/react";
import ReorderButtons from "@/components/admin/ReorderButtons";
import MediaManager from "@/components/admin/MediaManager";
import {
  createProjectSection,
  updateProjectSection,
  deleteProjectSection,
  reorderProjectSections,
} from "@/lib/actions/section.action";
import type { IProjectSection } from "@/database";

// Sections are plain admin-authored records, not a fixed set — the "New
// section title" field below accepts anything, and no section names are
// hardcoded anywhere in this component or the backend.
export default function ProjectSectionsManager({
  projectId,
  sections: initialSections,
}: {
  projectId: string;
  sections: IProjectSection[];
}) {
  const [sections, setSections] = useState(initialSections);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [adding, setAdding] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setError("");
    setAdding(true);

    const result = await createProjectSection({
      projectId,
      title: newTitle,
      description: newDescription || undefined,
      order: sections.length,
    });

    setAdding(false);

    if (!result.success || !result.data) {
      setError(result.error?.message ?? "Failed to add section.");
      return;
    }

    setSections((prev) => [...prev, result.data as IProjectSection]);
    setNewTitle("");
    setNewDescription("");
  };

  const startEdit = (section: IProjectSection) => {
    setEditingId(String(section._id));
    setEditTitle(section.title);
    setEditDescription(section.description ?? "");
  };

  const saveEdit = (id: string) => {
    startTransition(async () => {
      const result = await updateProjectSection({
        id,
        title: editTitle,
        description: editDescription || undefined,
      });
      if (!result.success || !result.data) {
        setError(result.error?.message ?? "Failed to update section.");
        return;
      }
      const updated = result.data;
      setSections((prev) => prev.map((s) => (String(s._id) === id ? updated : s)));
      setEditingId(null);
    });
  };

  const handleDelete = (section: IProjectSection) => {
    if (
      !window.confirm(`Delete "${section.title}"? Its media will be removed too.`)
    )
      return;
    const id = String(section._id);
    startTransition(async () => {
      const result = await deleteProjectSection({ id });
      if (!result.success) {
        setError(result.error?.message ?? "Failed to delete section.");
        return;
      }
      setSections((prev) => prev.filter((s) => String(s._id) !== id));
      if (expandedId === id) setExpandedId(null);
    });
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    [next[index], next[target]] = [next[target], next[index]];
    setSections(next);

    startTransition(async () => {
      const result = await reorderProjectSections({
        items: next.map((s, i) => ({ id: String(s._id), order: i })),
      });
      if (!result.success) {
        setError(result.error?.message ?? "Failed to reorder.");
        setSections(sections);
      }
    });
  };

  return (
    <div>
      {error && <p className="mb-4 font-mono text-xs text-red-400">{error}</p>}

      {sections.length === 0 ? (
        <p className="py-6 font-sans text-sm text-muted">
          No sections yet. Add one below.
        </p>
      ) : (
        <div className="divide-y divide-line border-y border-line">
          {sections.map((section, i) => {
            const id = String(section._id);
            const isExpanded = expandedId === id;
            const isEditing = editingId === id;

            return (
              <div key={id} className="py-4">
                <div className="flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : id)}
                    className="flex min-w-0 flex-1 items-center gap-2 text-left cursor-pointer"
                  >
                    {isExpanded ? <CaretUp size={16} /> : <CaretDown size={16} />}
                    <span className="truncate font-heading text-base font-semibold text-foreground">
                      {section.title}
                    </span>
                  </button>
                  <div className="flex shrink-0 items-center gap-2">
                    <ReorderButtons
                      onMoveUp={() => move(i, -1)}
                      onMoveDown={() => move(i, 1)}
                      disableUp={i === 0}
                      disableDown={i === sections.length - 1}
                      isPending={isPending}
                    />
                    <button
                      type="button"
                      onClick={() => startEdit(section)}
                      aria-label="Edit section"
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-line bg-surface text-muted transition-colors hover:border-white/40 hover:text-foreground cursor-pointer"
                    >
                      <PencilSimple size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(section)}
                      disabled={isPending}
                      aria-label="Delete section"
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-line bg-surface text-muted transition-colors hover:border-red-500/50 hover:text-red-400 disabled:opacity-50 cursor-pointer"
                    >
                      <Trash size={13} />
                    </button>
                  </div>
                </div>

                {isEditing ? (
                  <div className="mt-4 rounded-md border border-line bg-surface/50 p-4">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full rounded-md border border-line bg-surface px-3 py-2 font-sans text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-white/40 focus:ring-1 focus:ring-white/40"
                      placeholder="Section title"
                    />
                    <textarea
                      rows={2}
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="mt-2 w-full resize-none rounded-md border border-line bg-surface px-3 py-2 font-sans text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-white/40 focus:ring-1 focus:ring-white/40"
                      placeholder="Description (optional)"
                    />
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => saveEdit(id)}
                        disabled={isPending}
                        className="rounded-md bg-foreground px-4 py-1.5 font-sans text-xs font-semibold text-background hover:bg-white disabled:opacity-50 cursor-pointer transition-colors"
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
                ) : (
                  section.description && (
                    <p className="mt-2 font-sans text-sm text-muted">
                      {section.description}
                    </p>
                  )
                )}

                {isExpanded && (
                  <div className="mt-4">
                    <MediaManager projectId={projectId} sectionId={id} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <form onSubmit={handleAdd} className="mt-6 flex flex-wrap items-end gap-3">
        <div className="min-w-[200px] flex-1">
          <label className="font-sans text-xs font-semibold text-foreground">
            New section title
          </label>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 font-sans text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-white/40 focus:ring-1 focus:ring-white/40"
            placeholder="e.g. Overview, Gallery, Process"
          />
        </div>
        <div className="min-w-[200px] flex-1">
          <label className="font-sans text-xs font-semibold text-foreground">
            Description (optional)
          </label>
          <input
            type="text"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 font-sans text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-white/40 focus:ring-1 focus:ring-white/40"
          />
        </div>
        <button
          type="submit"
          disabled={adding || !newTitle.trim()}
          className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-4 py-2 font-sans text-sm font-semibold text-background transition-colors hover:bg-white disabled:opacity-50 cursor-pointer"
        >
          <Plus size={14} />
          {adding ? "Adding…" : "Add section"}
        </button>
      </form>
    </div>
  );
}
