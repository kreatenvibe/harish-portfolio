"use server";

import { z } from "zod";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import { Lead, ILead } from "@/database";
import { NotFoundError } from "@/lib/http-errors";
import type { SubmitLeadParams, MarkLeadReadParams, DeleteLeadParams } from "@/types/action";

const SubmitLeadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  business: z.string().optional(),
  businessDescription: z.string().optional(),
  improvement: z.string().optional(),
  currentTools: z.string().optional(),
  whatToBuild: z.string().optional(),
  anythingElse: z.string().optional(),
  // Honeypot — bots fill every field, real users never see this one.
  website: z.string().max(0, "Invalid submission").optional(),
});

const MarkLeadReadSchema = z.object({
  id: z.string().min(1, "Lead ID is required"),
  read: z.boolean(),
});

const DeleteLeadSchema = z.object({
  id: z.string().min(1, "Lead ID is required"),
});

export async function submitLead(
  params: SubmitLeadParams
): Promise<ActionResponse<{ id: string }>> {
  try {
    const result = await action({
      params,
      schema: SubmitLeadSchema,
    });
    if (result instanceof Error) throw result;

    const { website, ...leadData } = result.params;
    void website;

    const created = await Lead.create(leadData);
    return { success: true, data: { id: String(created._id) } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getLeads(): Promise<ActionResponse<ILead[]>> {
  try {
    const result = await action({
      params: {},
      schema: z.object({}),
      authorize: true,
    });
    if (result instanceof Error) throw result;

    const leads = await Lead.find().sort({ createdAt: -1 }).lean<ILead[]>();
    return { success: true, data: JSON.parse(JSON.stringify(leads)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function markLeadRead(
  params: MarkLeadReadParams
): Promise<ActionResponse<ILead>> {
  try {
    const result = await action({
      params,
      schema: MarkLeadReadSchema,
      authorize: true,
    });
    if (result instanceof Error) throw result;

    const { id, read } = result.params;
    const updated = await Lead.findByIdAndUpdate(id, { read }, {
      returnDocument: "after",
    }).lean<ILead>();
    if (!updated) throw new NotFoundError("Lead");

    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteLead(
  params: DeleteLeadParams
): Promise<ActionResponse<{ id: string }>> {
  try {
    const result = await action({
      params,
      schema: DeleteLeadSchema,
      authorize: true,
    });
    if (result instanceof Error) throw result;

    const deleted = await Lead.findByIdAndDelete(result.params.id);
    if (!deleted) throw new NotFoundError("Lead");

    return { success: true, data: { id: result.params.id } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
