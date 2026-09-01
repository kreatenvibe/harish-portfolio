"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star } from "@phosphor-icons/react";
import {
  deleteProject,
  restoreProject,
  reorderProjects,
  updateProject,
} from "@/lib/actions/project.action";
import ReorderButtons from "@/components/admin/ReorderButtons";
import type { IProject, ProjectStatus } from "@/database";

const STATUS_STYLES: Record<ProjectStatus, string> = {
  draft: "bg-foreground/5 text-muted",
  published: "bg-accent/10 text-accent",
  archived: "bg-foreground/10 text-muted",
};

export default function ProjectList({
  projects,
  categoryNameById,
  showDeleted = false,
}: {
  projects: IProject[];
  categoryNameById: Record<string, string>;
  showDeleted?: boolean;
}) {
  const router = useRouter();
  const [items, setItems] = useState(projects);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);

    startTransition(async () => {
      const result = await reorderProjects({
        items: next.map((project, i) => ({ id: String(project._id), order: i })),
      });
      if (!result.success) {
        setError(result.error?.message ?? "Failed to reorder.");
        setItems(items);
      }
    });
  };

  const handleToggleFeatured = (project: IProject) => {
    startTransition(async () => {
      const result = await updateProject({
        id: String(project._id),
        isFeatured: !project.isFeatured,
      });
      if (!result.success) {
        setError(result.error?.message ?? "Failed to update.");
        return;
      }
      router.refresh();
    });
  };

  const handleDelete = (project: IProject) => {
    if (!window.confirm(`Delete "${project.title}"? This cannot be undone.`)) return;
    startTransition(async () => {
      const result = await deleteProject({ id: String(project._id) });
      if (!result.success) {
        setError(result.error?.message ?? "Failed to delete.");
        return;
      }
      router.refresh();
    });
  };

  const handleRestore = (project: IProject) => {
    startTransition(async () => {
      const result = await restoreProject({ id: String(project._id) });
      if (!result.success) {
        setError(result.error?.message ?? "Failed to restore.");
        return;
      }
      router.refresh();
    });
  };

  if (items.length === 0) {
    return (
      <p className="py-12 text-center font-sans text-sm text-muted">
        {showDeleted ? "No deleted projects." : "No projects yet."}
      </p>
    );
  }

  return (
    <div>
      {error && <p className="mb-4 font-sans text-sm text-accent">{error}</p>}
      <div className="divide-y divide-foreground/10 border-t border-foreground/10">
        {items.map((project, i) => {
          const categoryName = categoryNameById[String(project.categoryId)];
          return (
            <div
              key={String(project._id)}
              className="flex items-center justify-between gap-6 py-5"
            >
              <div className="min-w-0">
                {showDeleted ? (
                  <span className="font-heading text-lg font-semibold text-foreground">
                    {project.title}
                  </span>
                ) : (
                  <Link
                    href={`/admin/work/${project._id}/edit`}
                    className="font-heading text-lg font-semibold text-foreground hover:text-accent"
                  >
                    {project.title}
                  </Link>
                )}
                <p className="mt-1 truncate font-sans text-sm text-muted">
                  {categoryName ?? "Uncategorized"}
                  {project.client ? ` · ${project.client}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                {!showDeleted && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(project)}
                      disabled={isPending}
                      aria-label={project.isFeatured ? "Unfeature" : "Feature"}
                      className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors disabled:opacity-50 ${
                        project.isFeatured
                          ? "border-accent text-accent"
                          : "border-foreground/15 text-muted hover:text-foreground"
                      }`}
                    >
                      <Star size={14} weight={project.isFeatured ? "fill" : "regular"} />
                    </button>
                    <span
                      className={`rounded-full px-3 py-1.5 font-sans text-xs font-semibold capitalize ${STATUS_STYLES[project.status]}`}
                    >
                      {project.status}
                    </span>
                    <ReorderButtons
                      onMoveUp={() => move(i, -1)}
                      onMoveDown={() => move(i, 1)}
                      disableUp={i === 0}
                      disableDown={i === items.length - 1}
                      isPending={isPending}
                    />
                  </>
                )}
                <button
                  type="button"
                  onClick={() =>
                    showDeleted ? handleRestore(project) : handleDelete(project)
                  }
                  disabled={isPending}
                  className="inline-flex items-center rounded-full border border-foreground/15 px-3 py-1.5 font-sans text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
                >
                  {showDeleted ? "Restore" : "Delete"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
