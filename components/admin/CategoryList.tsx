"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  deleteCategory,
  restoreCategory,
  reorderCategories,
} from "@/lib/actions/category.action";
import ReorderButtons from "@/components/admin/ReorderButtons";
import type { ICategory } from "@/database";

export default function CategoryList({
  categories,
  showDeleted = false,
}: {
  categories: ICategory[];
  showDeleted?: boolean;
}) {
  const router = useRouter();
  const [items, setItems] = useState(categories);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;

    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);

    startTransition(async () => {
      const result = await reorderCategories({
        items: next.map((category, i) => ({ id: String(category._id), order: i })),
      });
      if (!result.success) {
        setError(result.error?.message ?? "Failed to reorder.");
        setItems(items);
      }
    });
  };

  const handleDelete = (category: ICategory) => {
    if (!window.confirm(`Delete "${category.name}"? Projects keep this category until reassigned.`))
      return;
    startTransition(async () => {
      const result = await deleteCategory({ id: String(category._id) });
      if (!result.success) {
        setError(result.error?.message ?? "Failed to delete.");
        return;
      }
      router.refresh();
    });
  };

  const handleRestore = (category: ICategory) => {
    startTransition(async () => {
      const result = await restoreCategory({ id: String(category._id) });
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
        {showDeleted ? "No deleted categories." : "No categories yet."}
      </p>
    );
  }

  return (
    <div>
      {error && (
        <p className="mb-4 font-mono text-xs text-red-400">{error}</p>
      )}
      <div className="divide-y divide-line border-t border-b border-line">
        {items.map((category, i) => (
          <div
            key={String(category._id)}
            className="flex items-center justify-between gap-6 py-4"
          >
            <div className="min-w-0">
              {showDeleted ? (
                <span className="font-heading text-lg font-semibold text-foreground">
                  {category.name}
                </span>
              ) : (
                <Link
                  href={`/admin/categories/${category._id}/edit`}
                  className="font-heading text-lg font-semibold text-foreground hover:text-white transition-colors"
                >
                  {category.name}
                </Link>
              )}
              {category.description && (
                <p className="mt-1 truncate font-sans text-sm text-muted">
                  {category.description}
                </p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-3">
              {!showDeleted && (
                <>
                  <span
                    className={`rounded-md px-2.5 py-1 font-mono text-xs font-medium border ${
                      category.isActive
                        ? "border-line bg-surface text-foreground"
                        : "border-line/60 bg-background text-muted"
                    }`}
                  >
                    {category.isActive ? "Active" : "Inactive"}
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
                  showDeleted ? handleRestore(category) : handleDelete(category)
                }
                disabled={isPending}
                className="inline-flex items-center rounded-md border border-line bg-surface px-3 py-1.5 font-sans text-xs font-semibold text-muted transition-colors hover:border-red-500/50 hover:text-red-400 disabled:opacity-50 cursor-pointer"
              >
                {showDeleted ? "Restore" : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
