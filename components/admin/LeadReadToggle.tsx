"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { markLeadRead } from "@/lib/actions/lead.action";

export default function LeadReadToggle({
  id,
  read,
}: {
  id: string;
  read: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      const result = await markLeadRead({ id, read: !read });
      if (result.success) router.refresh();
    });
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      className={`inline-flex items-center rounded-md px-2.5 py-1 font-mono text-xs font-medium border transition-colors disabled:opacity-50 cursor-pointer ${
        read
          ? "border-line/60 bg-background text-muted hover:border-line hover:text-foreground"
          : "border-line bg-surface text-foreground hover:bg-surface-hover"
      }`}
    >
      {isPending ? "Updating…" : read ? "Mark unread" : "Mark read"}
    </button>
  );
}
