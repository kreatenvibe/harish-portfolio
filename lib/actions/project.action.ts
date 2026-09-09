"use server";

import { z } from "zod";
import type { QueryFilter } from "mongoose";
import { revalidateTag } from "next/cache";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import { dbConnect } from "@/lib/mongoose";
import { generateUniqueSlug } from "@/lib/slug";
import { Project, IProject, ProjectSection, Media } from "@/database";
import { NotFoundError } from "@/lib/http-errors";
import type {
  CreateProjectParams,
  UpdateProjectParams,
  DeleteProjectParams,
  SetProjectStatusParams,
  ReorderProjectsParams,
} from "@/types/action";

const PaginatedSearchParamsSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  query: z.string().optional(),
  filter: z.string().optional(),
  sort: z.string().optional(),
  categoryId: z.string().optional(),
});

const SEOSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  ogImage: z
    .object({
      url: z.string().url("Invalid OG image URL"),
      fileId: z.string().min(1, "OG image file ID is required"),
    })
    .optional(),
});

const CreateProjectSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  coverImage: z
    .object({
      url: z.string().url("Invalid cover image URL"),
      fileId: z.string().min(1, "Cover image file ID is required"),
    })
    .optional(),
  year: z.number().optional(),
  client: z.string().optional(),
  tags: z.array(z.string()).optional(),
  order: z.number().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  isFeatured: z.boolean().optional(),
  enableFullscreenGallery: z.boolean().optional(),
  seo: SEOSchema.optional(),
  customMetadata: z.record(z.string(), z.unknown()).optional(),
});

const UpdateProjectSchema = CreateProjectSchema.partial().extend({
  id: z.string().min(1, "Project ID is required"),
});

const DeleteProjectSchema = z.object({
  id: z.string().min(1, "Project ID is required"),
});

const SetProjectStatusSchema = z.object({
  id: z.string().min(1, "Project ID is required"),
  status: z.enum(["draft", "published", "archived"]),
});

const ReorderProjectsSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        order: z.number(),
      })
    )
    .min(1, "At least one item is required"),
});

export async function getProjects(
  params: PaginatedSearchParams & { categoryId?: string },
  publicOnly = false
): Promise<ActionResponse<{ projects: IProject[]; total: number; page: number; pages: number }>> {
  try {
    const result = await action({
      params,
      schema: PaginatedSearchParamsSchema,
    });
    if (result instanceof Error) throw result;

    const { page = 1, pageSize = 12, query, filter, categoryId } = result.params;
    const skip = (page - 1) * pageSize;

    const dbQuery: QueryFilter<IProject> = {};
    if (publicOnly) dbQuery.status = "published";
    if (categoryId) dbQuery.categoryId = categoryId;

    if (query) {
      dbQuery.$or = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { client: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ];
    }

    if (filter === "featured") {
      dbQuery.isFeatured = true;
    } else if (filter === "draft" || filter === "published" || filter === "archived") {
      dbQuery.status = filter;
    } else if (filter === "deleted") {
      dbQuery.deletedAt = { $ne: null };
    }

    await dbConnect();
    const projects = await Project.find(dbQuery)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean<IProject[]>();

    const total = await Project.countDocuments(dbQuery);

    return {
      success: true,
      data: {
        projects: JSON.parse(JSON.stringify(projects)),
        total,
        page,
        pages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getProjectById(id: string): Promise<ActionResponse<IProject>> {
  try {
    await dbConnect();
    const project = await Project.findById(id).lean<IProject>();
    if (!project) throw new NotFoundError("Project");
    return { success: true, data: JSON.parse(JSON.stringify(project)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getProjectBySlug(slug: string): Promise<ActionResponse<IProject>> {
  try {
    await dbConnect();
    const project = await Project.findOne({ slug }).lean<IProject>();
    if (!project) throw new NotFoundError("Project");
    return { success: true, data: JSON.parse(JSON.stringify(project)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getFeaturedProjects(limit = 6): Promise<ActionResponse<IProject[]>> {
  try {
    await dbConnect();
    const projects = await Project.find({ status: "published", isFeatured: true })
      .sort({ order: 1 })
      .limit(limit)
      .lean<IProject[]>();
    return { success: true, data: JSON.parse(JSON.stringify(projects)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function createProject(
  params: CreateProjectParams
): Promise<ActionResponse<IProject>> {
  try {
    const result = await action({
      params,
      schema: CreateProjectSchema,
      authorize: true,
    });
    if (result instanceof Error) throw result;

    const slug = await generateUniqueSlug(Project, result.params.title);
    const projectData = {
      ...result.params,
      slug,
      createdBy: result.session?.user?.email ?? undefined,
      updatedBy: result.session?.user?.email ?? undefined,
    };

    const created = await Project.create(projectData);
    revalidateTag("sitemap-projects", "max");
    return { success: true, data: JSON.parse(JSON.stringify(created.toObject())) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function updateProject(
  params: UpdateProjectParams
): Promise<ActionResponse<IProject>> {
  try {
    const result = await action({
      params,
      schema: UpdateProjectSchema,
      authorize: true,
    });
    if (result instanceof Error) throw result;

    const { id, ...rest } = result.params;
    // categoryId arrives as a string from the client; Mongoose casts it to
    // ObjectId on write, but IProject types the field as ObjectId already.
    const updateData: Partial<Omit<IProject, "categoryId">> & { categoryId?: string } = {
      ...rest,
      updatedBy: result.session?.user?.email ?? undefined,
    };

    if (updateData.title) {
      updateData.slug = await generateUniqueSlug(Project, updateData.title, id);
    }

    const updated = await Project.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
    }).lean<IProject>();
    if (!updated) throw new NotFoundError("Project");

    revalidateTag("sitemap-projects", "max");
    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function setProjectStatus(
  params: SetProjectStatusParams
): Promise<ActionResponse<IProject>> {
  try {
    const result = await action({
      params,
      schema: SetProjectStatusSchema,
      authorize: true,
    });
    if (result instanceof Error) throw result;

    const updated = await Project.findByIdAndUpdate(
      result.params.id,
      {
        status: result.params.status,
        updatedBy: result.session?.user?.email ?? undefined,
      },
      { returnDocument: "after" }
    ).lean<IProject>();
    if (!updated) throw new NotFoundError("Project");

    revalidateTag("sitemap-projects", "max");
    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteProject(
  params: DeleteProjectParams
): Promise<ActionResponse<{ id: string }>> {
  try {
    const result = await action({
      params,
      schema: DeleteProjectSchema,
      authorize: true,
    });
    if (result instanceof Error) throw result;

    const deleted = await Project.findByIdAndUpdate(result.params.id, {
      deletedAt: new Date(),
    });
    if (!deleted) throw new NotFoundError("Project");

    // A section/media record can't meaningfully outlive its project, so
    // cascade the soft delete one level down. Categories are left untouched
    // by design — they're shared master data a project merely references.
    const now = new Date();
    await ProjectSection.updateMany({ projectId: result.params.id }, { deletedAt: now });
    await Media.updateMany({ projectId: result.params.id }, { deletedAt: now });

    revalidateTag("sitemap-projects", "max");
    return { success: true, data: { id: result.params.id } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function restoreProject(
  params: DeleteProjectParams
): Promise<ActionResponse<IProject>> {
  try {
    const result = await action({
      params,
      schema: DeleteProjectSchema,
      authorize: true,
    });
    if (result instanceof Error) throw result;

    const restored = await Project.findOneAndUpdate(
      { _id: result.params.id, deletedAt: { $ne: null } },
      { deletedAt: null },
      { returnDocument: "after" }
    ).lean<IProject>();
    if (!restored) throw new NotFoundError("Project");

    revalidateTag("sitemap-projects", "max");
    return { success: true, data: JSON.parse(JSON.stringify(restored)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function reorderProjects(
  params: ReorderProjectsParams
): Promise<ActionResponse<{ updated: number }>> {
  try {
    const result = await action({
      params,
      schema: ReorderProjectsSchema,
      authorize: true,
    });
    if (result instanceof Error) throw result;

    const { modifiedCount } = await Project.bulkWrite(
      result.params.items.map(({ id, order }) => ({
        updateOne: { filter: { _id: id, deletedAt: null }, update: { order } },
      }))
    );

    revalidateTag("sitemap-projects", "max");
    return { success: true, data: { updated: modifiedCount } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
