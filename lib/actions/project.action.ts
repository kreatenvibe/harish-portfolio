"use server";

import { z } from "zod";
import slugify from "slugify";
import type { QueryFilter } from "mongoose";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import { dbConnect } from "@/lib/mongoose";
import { Project, IProject } from "@/database";
import { NotFoundError } from "@/lib/http-errors";
import type { CreateProjectParams, UpdateProjectParams, DeleteProjectParams } from "@/types/action";

const PaginatedSearchParamsSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  query: z.string().optional(),
  filter: z.string().optional(),
  sort: z.string().optional(),
});

const CreateProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  label: z.string().min(1, "Label is required"),
  challenge: z.string().min(1, "Challenge is required"),
  whatWeBuilt: z.string().min(1, "What we built is required"),
  howItWorks: z.string().min(1, "How it works is required"),
  outcome: z.string().min(1, "Outcome is required"),
  liveUrl: z.string().url("Invalid live URL").optional().or(z.literal("")),
  coverImage: z
    .object({
      url: z.string().url("Invalid image URL"),
      fileId: z.string().min(1, "Image file ID is required"),
    })
    .optional(),
  featured: z.boolean().optional(),
  order: z.number().optional(),
});

const UpdateProjectSchema = CreateProjectSchema.partial().extend({
  id: z.string().min(1, "Project ID is required"),
});

const DeleteProjectSchema = z.object({
  id: z.string().min(1, "Project ID is required"),
});

export async function getProjects(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ projects: IProject[]; total: number; page: number; pages: number }>> {
  try {
    const result = await action({
      params,
      schema: PaginatedSearchParamsSchema,
    });
    if (result instanceof Error) throw result;

    const { page = 1, pageSize = 10, query, filter } = result.params;
    const skip = (page - 1) * pageSize;

    const dbQuery: QueryFilter<IProject> = {};
    if (query) {
      dbQuery.$or = [
        { title: { $regex: query, $options: "i" } },
        { challenge: { $regex: query, $options: "i" } },
      ];
    }

    if (filter === "featured") {
      dbQuery.featured = true;
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

export async function getProjectById(
  id: string
): Promise<ActionResponse<IProject>> {
  try {
    await dbConnect();
    const project = await Project.findById(id).lean<IProject>();
    if (!project) throw new NotFoundError("Project");
    return { success: true, data: JSON.parse(JSON.stringify(project)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getProjectBySlug(
  slug: string
): Promise<ActionResponse<IProject>> {
  try {
    await dbConnect();
    const project = await Project.findOne({ slug }).lean<IProject>();
    if (!project) throw new NotFoundError("Project");
    return { success: true, data: JSON.parse(JSON.stringify(project)) };
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

    const projectData = {
      ...result.params,
      slug: slugify(result.params.title, { lower: true, strict: true }),
    };

    const created = await Project.create(projectData);
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
    const updateData: Partial<IProject> = { ...rest };

    if (updateData.title) {
      updateData.slug = slugify(updateData.title, { lower: true, strict: true });
    }

    const updated = await Project.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
    }).lean<IProject>();
    if (!updated) throw new NotFoundError("Project");

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

    const deleted = await Project.findByIdAndDelete(result.params.id);
    if (!deleted) throw new NotFoundError("Project");

    return { success: true, data: { id: result.params.id } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
