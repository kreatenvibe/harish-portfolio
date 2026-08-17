"use server";

import { z } from "zod";
import slugify from "slugify";
import type { QueryFilter } from "mongoose";
import { revalidateTag } from "next/cache";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import { dbConnect } from "@/lib/mongoose";
import { BlogPost, IBlogPost } from "@/database";
import { NotFoundError } from "@/lib/http-errors";
import type {
  CreateBlogPostParams,
  UpdateBlogPostParams,
  DeleteBlogPostParams,
  ToggleBlogPostPublishedParams,
} from "@/types/action";

const PaginatedSearchParamsSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  query: z.string().optional(),
  filter: z.string().optional(),
  sort: z.string().optional(),
});

const CreateBlogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  coverImage: z.object({
    url: z.string().url("Invalid image URL"),
    fileId: z.string().min(1, "Image file ID is required"),
  }).optional(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional(),
  publishedAt: z.union([z.date(), z.string()]).optional(),
});

const UpdateBlogPostSchema = CreateBlogPostSchema.partial().extend({
  id: z.string().min(1, "Blog Post ID is required"),
});

const DeleteBlogPostSchema = z.object({
  id: z.string().min(1, "Blog Post ID is required"),
});

const TogglePublishedSchema = z.object({
  id: z.string().min(1, "Blog Post ID is required"),
});

export async function getBlogPosts(
  params: PaginatedSearchParams,
  publishedOnly = false
): Promise<ActionResponse<{ blogPosts: IBlogPost[]; total: number; page: number; pages: number }>> {
  try {
    const result = await action({
      params,
      schema: PaginatedSearchParamsSchema,
    });
    if (result instanceof Error) throw result;

    const { page = 1, pageSize = 10, query, filter } = result.params;
    const skip = (page - 1) * pageSize;

    const dbQuery: QueryFilter<IBlogPost> = {};
    if (publishedOnly) {
      dbQuery.published = true;
    }

    if (query) {
      dbQuery.$or = [
        { title: { $regex: query, $options: "i" } },
        { excerpt: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ];
    }

    if (filter === "published") {
      dbQuery.published = true;
    } else if (filter === "draft") {
      dbQuery.published = false;
    }

    await dbConnect();
    const blogPosts = await BlogPost.find(dbQuery)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean<IBlogPost[]>();

    const total = await BlogPost.countDocuments(dbQuery);

    return {
      success: true,
      data: {
        blogPosts: JSON.parse(JSON.stringify(blogPosts)),
        total,
        page,
        pages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getBlogPostById(
  id: string
): Promise<ActionResponse<IBlogPost>> {
  try {
    await dbConnect();
    const blogPost = await BlogPost.findById(id).lean<IBlogPost>();
    if (!blogPost) throw new NotFoundError("Blog post");
    return { success: true, data: JSON.parse(JSON.stringify(blogPost)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getBlogPostBySlug(
  slug: string
): Promise<ActionResponse<IBlogPost>> {
  try {
    await dbConnect();
    const blogPost = await BlogPost.findOne({ slug }).lean<IBlogPost>();
    if (!blogPost) throw new NotFoundError("Blog post");
    return { success: true, data: JSON.parse(JSON.stringify(blogPost)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function createBlogPost(
  params: CreateBlogPostParams
): Promise<ActionResponse<IBlogPost>> {
  try {
    const result = await action({
      params,
      schema: CreateBlogPostSchema,
      authorize: true,
    });
    if (result instanceof Error) throw result;

    const blogPostData: Partial<IBlogPost> = {
      ...result.params,
      slug: slugify(result.params.title, { lower: true, strict: true }),
      publishedAt: result.params.publishedAt ? new Date(result.params.publishedAt) : undefined,
    };

    if (result.params.published && !result.params.publishedAt) {
      blogPostData.publishedAt = new Date();
    }

    const created = await BlogPost.create(blogPostData);
    revalidateTag("sitemap-blogs", "max");
    return { success: true, data: JSON.parse(JSON.stringify(created.toObject())) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function updateBlogPost(
  params: UpdateBlogPostParams
): Promise<ActionResponse<IBlogPost>> {
  try {
    const result = await action({
      params,
      schema: UpdateBlogPostSchema,
      authorize: true,
    });
    if (result instanceof Error) throw result;

    const { id, publishedAt: publishedAtInput, ...rest } = result.params;
    const updateData: Partial<IBlogPost> = {
      ...rest,
      ...(publishedAtInput ? { publishedAt: new Date(publishedAtInput) } : {}),
    };

    if (updateData.title) {
      updateData.slug = slugify(updateData.title, { lower: true, strict: true });
    }

    if (updateData.published === true && !updateData.publishedAt) {
      updateData.publishedAt = new Date();
    }

    const updated = await BlogPost.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
    }).lean<IBlogPost>();
    if (!updated) throw new NotFoundError("Blog post");

    revalidateTag("sitemap-blogs", "max");
    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteBlogPost(
  params: DeleteBlogPostParams
): Promise<ActionResponse<{ id: string }>> {
  try {
    const result = await action({
      params,
      schema: DeleteBlogPostSchema,
      authorize: true,
    });
    if (result instanceof Error) throw result;

    const deleted = await BlogPost.findByIdAndDelete(result.params.id);
    if (!deleted) throw new NotFoundError("Blog post");

    revalidateTag("sitemap-blogs", "max");
    return { success: true, data: { id: result.params.id } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function togglePublished(
  params: ToggleBlogPostPublishedParams
): Promise<ActionResponse<IBlogPost>> {
  try {
    const result = await action({
      params,
      schema: TogglePublishedSchema,
      authorize: true,
    });
    if (result instanceof Error) throw result;

    await dbConnect();
    const blogPost = await BlogPost.findById(result.params.id);
    if (!blogPost) throw new NotFoundError("Blog post");

    blogPost.published = !blogPost.published;
    if (blogPost.published) {
      blogPost.publishedAt = new Date();
    } else {
      blogPost.publishedAt = undefined;
    }

    await blogPost.save();
    revalidateTag("sitemap-blogs", "max");
    return { success: true, data: JSON.parse(JSON.stringify(blogPost.toObject())) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
