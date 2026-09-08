"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash } from "@phosphor-icons/react";

export default function AdminDeleteButton({
  action,
  confirmMessage = "Delete this item? This cannot be undone.",
}: {
  action: () => Promise<ActionResponse<unknown>>;
  confirmMessage?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleDelete = () => {
    if (!window.confirm(confirmMessage)) return;
    setError("");
    startTransition(async () => {
      const result = await action();
      if (!result.success) {
        setError(result.error?.message ?? "Failed to delete.");
        return;
      }
      router.refresh();
    });
  };

  return (
    <span className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-3 py-1.5 font-sans text-xs font-semibold text-muted transition-colors hover:border-red-500/50 hover:text-red-400 disabled:opacity-50 cursor-pointer"
      >
        <Trash size={14} />
        {isPending ? "Deleting…" : "Delete"}
      </button>
      {error && <span className="font-mono text-xs text-red-400">{error}</span>}
    </span>
  );
}
