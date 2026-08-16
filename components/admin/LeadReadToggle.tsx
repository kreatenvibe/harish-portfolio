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
      className={`inline-flex items-center rounded-full px-3 py-1.5 font-sans text-xs font-semibold transition-colors disabled:opacity-50 ${
        read
          ? "bg-foreground/5 text-muted hover:bg-foreground/10"
          : "bg-accent/10 text-accent hover:bg-accent/20"
      }`}
    >
      {isPending ? "Updating…" : read ? "Mark unread" : "Mark read"}
    </button>
  );
}
