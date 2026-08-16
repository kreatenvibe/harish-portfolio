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
        className={`inline-flex items-center rounded-full px-3 py-1.5 font-sans text-xs font-semibold transition-colors disabled:opacity-50 ${
          published
            ? "bg-accent/10 text-accent hover:bg-accent/20"
            : "bg-foreground/5 text-muted hover:bg-foreground/10"
        }`}
      >
        {isPending ? "Updating…" : published ? "Published" : "Draft"}
      </button>
      {error && <span className="font-sans text-xs text-accent">{error}</span>}
    </span>
  );
}
