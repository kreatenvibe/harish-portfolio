"use server";

import { z } from "zod";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import { dbConnect } from "@/lib/mongoose";
import { Media, IMedia } from "@/database";
import { NotFoundError } from "@/lib/http-errors";
import type {
  CreateMediaParams,
  UpdateMediaParams,
  DeleteMediaParams,
  ReorderMediaParams,
} from "@/types/action";

const CreateMediaSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  sectionId: z.string().min(1, "Section ID is required"),
  type: z.enum(["image", "video", "pdf", "other"]),
  url: z.string().url("Invalid media URL"),
  fileId: z.string().min(1, "Media file ID is required"),
  thumbnail: z.string().url("Invalid thumbnail URL").optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  altText: z.string().optional(),
  caption: z.string().optional(),
  mimeType: z.string().optional(),
  size: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  duration: z.number().optional(),
  order: z.number().optional(),
});

const UpdateMediaSchema = CreateMediaSchema.partial().extend({
  id: z.string().min(1, "Media ID is required"),
});

const DeleteMediaSchema = z.object({
  id: z.string().min(1, "Media ID is required"),
});

const ReorderMediaSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        order: z.number(),
      })
    )
    .min(1, "At least one item is required"),
});

export async function getMediaBySection(
  sectionId: string,
  onlyDeleted = false
): Promise<ActionResponse<IMedia[]>> {
  try {
    await dbConnect();
    const dbQuery = onlyDeleted
      ? { sectionId, deletedAt: { $ne: null } }
      : { sectionId };
    const media = await Media.find(dbQuery).sort({ order: 1 }).lean<IMedia[]>();
    return { success: true, data: JSON.parse(JSON.stringify(media)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getMediaByProject(projectId: string): Promise<ActionResponse<IMedia[]>> {
  try {
    await dbConnect();
    const media = await Media.find({ projectId }).sort({ order: 1 }).lean<IMedia[]>();
    return { success: true, data: JSON.parse(JSON.stringify(media)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function createMedia(params: CreateMediaParams): Promise<ActionResponse<IMedia>> {
  try {
    const result = await action({
      params,
      schema: CreateMediaSchema,
      authorize: true,
    });
    if (result instanceof Error) throw result;

    const created = await Media.create(result.params);
    return { success: true, data: JSON.parse(JSON.stringify(created.toObject())) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function updateMedia(params: UpdateMediaParams): Promise<ActionResponse<IMedia>> {
  try {
    const result = await action({
      params,
      schema: UpdateMediaSchema,
      authorize: true,
    });
    if (result instanceof Error) throw result;

    const { id, ...rest } = result.params;
    const updated = await Media.findByIdAndUpdate(id, rest, {
      returnDocument: "after",
    }).lean<IMedia>();
    if (!updated) throw new NotFoundError("Media");

    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteMedia(
  params: DeleteMediaParams
): Promise<ActionResponse<{ id: string }>> {
  try {
    const result = await action({
      params,
      schema: DeleteMediaSchema,
      authorize: true,
    });
    if (result instanceof Error) throw result;

    const deleted = await Media.findByIdAndUpdate(result.params.id, {
      deletedAt: new Date(),
    });
    if (!deleted) throw new NotFoundError("Media");

    return { success: true, data: { id: result.params.id } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function restoreMedia(
  params: DeleteMediaParams
): Promise<ActionResponse<IMedia>> {
  try {
    const result = await action({
      params,
      schema: DeleteMediaSchema,
      authorize: true,
    });
    if (result instanceof Error) throw result;

    const restored = await Media.findOneAndUpdate(
      { _id: result.params.id, deletedAt: { $ne: null } },
      { deletedAt: null },
      { returnDocument: "after" }
    ).lean<IMedia>();
    if (!restored) throw new NotFoundError("Media");

    return { success: true, data: JSON.parse(JSON.stringify(restored)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function reorderMedia(
  params: ReorderMediaParams
): Promise<ActionResponse<{ updated: number }>> {
  try {
    const result = await action({
      params,
      schema: ReorderMediaSchema,
      authorize: true,
    });
    if (result instanceof Error) throw result;

    const { modifiedCount } = await Media.bulkWrite(
      result.params.items.map(({ id, order }) => ({
        updateOne: { filter: { _id: id, deletedAt: null }, update: { order } },
      }))
    );

    return { success: true, data: { updated: modifiedCount } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
