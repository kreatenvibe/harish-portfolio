"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { togglePublished } from "@/lib/actions/blog.action";

export default function TogglePublishedButton({
  id,
  published,
}: {
  id: string;
  published: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleToggle = () => {
    setError("");
    startTransition(async () => {
      const result = await togglePublished({ id });
      if (!result.success) {
        setError(result.error?.message ?? "Failed to update.");
        return;
      }
      router.refresh();
    });
  };

  return (
    <span className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleToggle}
        disabled={isPending}
        className={`inline-flex items-center rounded-md px-2.5 py-1 font-mono text-xs font-medium border transition-colors disabled:opacity-50 cursor-pointer ${
          published
            ? "border-line bg-surface text-foreground hover:bg-surface-hover"
            : "border-line/60 bg-background text-muted hover:border-line hover:text-foreground"
        }`}
      >
        {isPending ? "Updating…" : published ? "Published" : "Draft"}
      </button>
      {error && <span className="font-mono text-xs text-red-400">{error}</span>}
    </span>
  );
}
