"use server";

import { z } from "zod";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import { dbConnect } from "@/lib/mongoose";
import { ProjectSection, IProjectSection, Media } from "@/database";
import { NotFoundError } from "@/lib/http-errors";
import type {
  CreateProjectSectionParams,
  UpdateProjectSectionParams,
  DeleteProjectSectionParams,
  ReorderProjectSectionsParams,
} from "@/types/action";

const CreateSectionSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  order: z.number().optional(),
  customMetadata: z.record(z.string(), z.unknown()).optional(),
});

const UpdateSectionSchema = CreateSectionSchema.partial().extend({
  id: z.string().min(1, "Section ID is required"),
});

const DeleteSectionSchema = z.object({
  id: z.string().min(1, "Section ID is required"),
});

const ReorderSectionsSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        order: z.number(),
      })
    )
    .min(1, "At least one item is required"),
});

export async function getProjectSections(
  projectId: string
): Promise<ActionResponse<IProjectSection[]>> {
  try {
    await dbConnect();
    const sections = await ProjectSection.find({ projectId })
      .sort({ order: 1 })
      .lean<IProjectSection[]>();
    return { success: true, data: JSON.parse(JSON.stringify(sections)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getProjectSectionById(
  id: string
): Promise<ActionResponse<IProjectSection>> {
  try {
    await dbConnect();
    const section = await ProjectSection.findById(id).lean<IProjectSection>();
    if (!section) throw new NotFoundError("Project section");
    return { success: true, data: JSON.parse(JSON.stringify(section)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function createProjectSection(
  params: CreateProjectSectionParams
): Promise<ActionResponse<IProjectSection>> {
  try {
    const result = await action({
      params,
      schema: CreateSectionSchema,
      authorize: true,
    });
    if (result instanceof Error) throw result;

    const created = await ProjectSection.create(result.params);
    return { success: true, data: JSON.parse(JSON.stringify(created.toObject())) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function updateProjectSection(
  params: UpdateProjectSectionParams
): Promise<ActionResponse<IProjectSection>> {
  try {
    const result = await action({
      params,
      schema: UpdateSectionSchema,
      authorize: true,
    });
    if (result instanceof Error) throw result;

    const { id, ...rest } = result.params;
    const updated = await ProjectSection.findByIdAndUpdate(id, rest, {
      returnDocument: "after",
    }).lean<IProjectSection>();
    if (!updated) throw new NotFoundError("Project section");

    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteProjectSection(
  params: DeleteProjectSectionParams
): Promise<ActionResponse<{ id: string }>> {
  try {
    const result = await action({
      params,
      schema: DeleteSectionSchema,
      authorize: true,
    });
    if (result instanceof Error) throw result;

    const deleted = await ProjectSection.findByIdAndUpdate(result.params.id, {
      deletedAt: new Date(),
    });
    if (!deleted) throw new NotFoundError("Project section");

    // Media can't meaningfully outlive its section — cascade the soft delete.
    await Media.updateMany({ sectionId: result.params.id }, { deletedAt: new Date() });

    return { success: true, data: { id: result.params.id } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function reorderProjectSections(
  params: ReorderProjectSectionsParams
): Promise<ActionResponse<{ updated: number }>> {
  try {
    const result = await action({
      params,
      schema: ReorderSectionsSchema,
      authorize: true,
    });
    if (result instanceof Error) throw result;

    const { modifiedCount } = await ProjectSection.bulkWrite(
      result.params.items.map(({ id, order }) => ({
        updateOne: { filter: { _id: id, deletedAt: null }, update: { order } },
      }))
    );

    return { success: true, data: { updated: modifiedCount } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
