"use server";

import { z } from "zod";
import slugify from "slugify";
import type { QueryFilter } from "mongoose";
import { revalidateTag } from "next/cache";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import { dbConnect } from "@/lib/mongoose";
import { generateUniqueSlug } from "@/lib/slug";
import { Category, ICategory } from "@/database";
import { NotFoundError } from "@/lib/http-errors";
import type {
  CreateCategoryParams,
  UpdateCategoryParams,
  DeleteCategoryParams,
  ReorderCategoriesParams,
} from "@/types/action";

const PaginatedSearchParamsSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  query: z.string().optional(),
  filter: z.string().optional(),
  sort: z.string().optional(),
});

const CreateCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  coverImage: z
    .object({
      url: z.string().url("Invalid cover image URL"),
      fileId: z.string().min(1, "Cover image file ID is required"),
    })
    .optional(),
  order: z.number().optional(),
  isActive: z.boolean().optional(),
});

const UpdateCategorySchema = CreateCategorySchema.partial().extend({
  id: z.string().min(1, "Category ID is required"),
});

const DeleteCategorySchema = z.object({
  id: z.string().min(1, "Category ID is required"),
});

const ReorderCategoriesSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        order: z.number(),
      })
    )
    .min(1, "At least one item is required"),
});

export async function getCategories(
  params: PaginatedSearchParams,
  activeOnly = false
): Promise<ActionResponse<{ categories: ICategory[]; total: number; page: number; pages: number }>> {
  try {
    const result = await action({
      params,
      schema: PaginatedSearchParamsSchema,
    });
    if (result instanceof Error) throw result;

    const { page = 1, pageSize = 50, query, filter } = result.params;
    const skip = (page - 1) * pageSize;

    const dbQuery: QueryFilter<ICategory> = {};
    if (activeOnly) dbQuery.isActive = true;
    if (query) dbQuery.name = { $regex: query, $options: "i" };

    if (filter === "active") dbQuery.isActive = true;
    else if (filter === "inactive") dbQuery.isActive = false;
    else if (filter === "deleted") dbQuery.deletedAt = { $ne: null };

    await dbConnect();
    const categories = await Category.find(dbQuery)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean<ICategory[]>();

    const total = await Category.countDocuments(dbQuery);

    return {
      success: true,
      data: {
        categories: JSON.parse(JSON.stringify(categories)),
        total,
        page,
        pages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getCategoryById(id: string): Promise<ActionResponse<ICategory>> {
  try {
    await dbConnect();
    const category = await Category.findById(id).lean<ICategory>();
    if (!category) throw new NotFoundError("Category");
    return { success: true, data: JSON.parse(JSON.stringify(category)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getCategoryBySlug(slug: string): Promise<ActionResponse<ICategory>> {
  try {
    await dbConnect();
    const category = await Category.findOne({ slug }).lean<ICategory>();
    if (!category) throw new NotFoundError("Category");
    return { success: true, data: JSON.parse(JSON.stringify(category)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function createCategory(
  params: CreateCategoryParams
): Promise<ActionResponse<ICategory>> {
  try {
    const result = await action({
      params,
      schema: CreateCategorySchema,
      authorize: true,
    });
    if (result instanceof Error) throw result;

    const slug = await generateUniqueSlug(Category, result.params.name);
    const created = await Category.create({ ...result.params, slug });

    revalidateTag("categories", "max");
    return { success: true, data: JSON.parse(JSON.stringify(created.toObject())) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function updateCategory(
  params: UpdateCategoryParams
): Promise<ActionResponse<ICategory>> {
  try {
    const result = await action({
      params,
      schema: UpdateCategorySchema,
      authorize: true,
    });
    if (result instanceof Error) throw result;

    const { id, ...rest } = result.params;
    const updateData: Partial<ICategory> = { ...rest };

    if (updateData.name) {
      updateData.slug = await generateUniqueSlug(Category, updateData.name, id);
    }

    const updated = await Category.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
    }).lean<ICategory>();
    if (!updated) throw new NotFoundError("Category");

    revalidateTag("categories", "max");
    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteCategory(
  params: DeleteCategoryParams
): Promise<ActionResponse<{ id: string }>> {
  try {
    const result = await action({
      params,
      schema: DeleteCategorySchema,
      authorize: true,
    });
    if (result instanceof Error) throw result;

    const deleted = await Category.findByIdAndUpdate(result.params.id, {
      deletedAt: new Date(),
    });
    if (!deleted) throw new NotFoundError("Category");

    revalidateTag("categories", "max");
    return { success: true, data: { id: result.params.id } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

const INITIAL_CATEGORIES = ["Branding", "Packaging", "Social Media", "Print Design"];

// Idempotent: only creates categories that don't already exist (matched by
// slug), so it's safe to call more than once. No categories are hardcoded
// into any query/model — this just seeds the initial dynamic data.
export async function seedInitialCategories(): Promise<ActionResponse<{ created: string[] }>> {
  try {
    const result = await action({ params: {}, schema: z.object({}), authorize: true });
    if (result instanceof Error) throw result;

    const created: string[] = [];
    for (let i = 0; i < INITIAL_CATEGORIES.length; i++) {
      const name = INITIAL_CATEGORIES[i];
      const slug = slugify(name, { lower: true, strict: true });
      const exists = await Category.exists({ slug });
      if (exists) continue;

      await Category.create({ name, slug, order: i, isActive: true });
      created.push(name);
    }

    if (created.length) revalidateTag("categories", "max");
    return { success: true, data: { created } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function restoreCategory(
  params: DeleteCategoryParams
): Promise<ActionResponse<ICategory>> {
  try {
    const result = await action({
      params,
      schema: DeleteCategorySchema,
      authorize: true,
    });
    if (result instanceof Error) throw result;

    const restored = await Category.findOneAndUpdate(
      { _id: result.params.id, deletedAt: { $ne: null } },
      { deletedAt: null },
      { returnDocument: "after" }
    ).lean<ICategory>();
    if (!restored) throw new NotFoundError("Category");

    revalidateTag("categories", "max");
    return { success: true, data: JSON.parse(JSON.stringify(restored)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function reorderCategories(
  params: ReorderCategoriesParams
): Promise<ActionResponse<{ updated: number }>> {
  try {
    const result = await action({
      params,
      schema: ReorderCategoriesSchema,
      authorize: true,
    });
    if (result instanceof Error) throw result;

    const { modifiedCount } = await Category.bulkWrite(
      result.params.items.map(({ id, order }) => ({
        updateOne: { filter: { _id: id, deletedAt: null }, update: { order } },
      }))
    );

    revalidateTag("categories", "max");
    return { success: true, data: { updated: modifiedCount } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
