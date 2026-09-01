import slugify from "slugify";
import type { Model, QueryFilter } from "mongoose";

// Shared by Category and Project actions: derives a slug from `source` and
// appends -2, -3, ... until it no longer collides with another live document.
// Soft-deleted docs are excluded automatically by the model's default query
// scope (see softDelete.plugin.ts), so a slug freed up by a soft delete can
// be reused.
export async function generateUniqueSlug<T extends { slug: string }>(
  model: Model<T>,
  source: string,
  excludeId?: string
): Promise<string> {
  const base = slugify(source, { lower: true, strict: true });
  let slug = base;
  let counter = 2;

  while (
    await model.exists({
      slug,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    } as QueryFilter<T>)
  ) {
    slug = `${base}-${counter}`;
    counter += 1;
  }

  return slug;
}
