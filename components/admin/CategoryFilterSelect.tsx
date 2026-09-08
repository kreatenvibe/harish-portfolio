"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { ICategory } from "@/database";

export default function CategoryFilterSelect({
  categories,
}: {
  categories: ICategory[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const value = searchParams.get("categoryId") ?? "";

  const handleChange = (next: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next) params.set("categoryId", next);
    else params.delete("categoryId");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <select
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      className="rounded-md border border-line bg-surface px-3.5 py-2 font-sans text-sm text-foreground outline-none transition-colors focus:border-white/40 focus:ring-1 focus:ring-white/40"
    >
      <option value="">All categories</option>
      {categories.map((category) => (
        <option key={String(category._id)} value={String(category._id)}>
          {category.name}
        </option>
      ))}
    </select>
  );
}
