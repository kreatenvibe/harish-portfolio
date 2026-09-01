"use client";

import { CaretUp, CaretDown } from "@phosphor-icons/react";

export default function ReorderButtons({
  onMoveUp,
  onMoveDown,
  disableUp,
  disableDown,
  isPending,
}: {
  onMoveUp: () => void;
  onMoveDown: () => void;
  disableUp?: boolean;
  disableDown?: boolean;
  isPending?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1">
      <button
        type="button"
        onClick={onMoveUp}
        disabled={disableUp || isPending}
        aria-label="Move up"
        className="flex h-7 w-7 items-center justify-center rounded-full border border-foreground/15 text-foreground transition-colors hover:border-accent hover:text-accent disabled:opacity-30"
      >
        <CaretUp size={13} />
      </button>
      <button
        type="button"
        onClick={onMoveDown}
        disabled={disableDown || isPending}
        aria-label="Move down"
        className="flex h-7 w-7 items-center justify-center rounded-full border border-foreground/15 text-foreground transition-colors hover:border-accent hover:text-accent disabled:opacity-30"
      >
        <CaretDown size={13} />
      </button>
    </span>
  );
}
