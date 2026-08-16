"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { MagnifyingGlass } from "@phosphor-icons/react";

export default function FilterBar({
  filters,
  searchPlaceholder = "Search…",
}: {
  filters?: { value: string; label: string }[];
  searchPlaceholder?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") ?? "");

  const navigate = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const activeFilter = searchParams.get("filter") ?? "";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ query: query || null });
        }}
        className="relative"
      >
        <MagnifyingGlass
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-64 rounded-full border border-foreground/10 bg-background py-2 pl-9 pr-4 font-sans text-sm text-foreground outline-none focus:border-accent"
        />
      </form>

      {filters && filters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => navigate({ filter: null })}
            className={`rounded-full px-3.5 py-1.5 font-sans text-xs font-semibold transition-colors ${
              activeFilter === ""
                ? "bg-primary text-white"
                : "bg-foreground/5 text-muted hover:bg-foreground/10"
            }`}
          >
            All
          </button>
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => navigate({ filter: f.value })}
              className={`rounded-full px-3.5 py-1.5 font-sans text-xs font-semibold transition-colors ${
                activeFilter === f.value
                  ? "bg-primary text-white"
                  : "bg-foreground/5 text-muted hover:bg-foreground/10"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
