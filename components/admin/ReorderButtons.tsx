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
        className="flex h-7 w-7 items-center justify-center rounded-md border border-line bg-surface text-muted transition-colors hover:border-white/40 hover:text-foreground disabled:opacity-30 cursor-pointer"
      >
        <CaretUp size={13} />
      </button>
      <button
        type="button"
        onClick={onMoveDown}
        disabled={disableDown || isPending}
        aria-label="Move down"
        className="flex h-7 w-7 items-center justify-center rounded-md border border-line bg-surface text-muted transition-colors hover:border-white/40 hover:text-foreground disabled:opacity-30 cursor-pointer"
      >
        <CaretDown size={13} />
      </button>
    </span>
  );
}
