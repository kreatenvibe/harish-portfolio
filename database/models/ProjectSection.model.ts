import { Schema, model, models, Document, Types } from "mongoose";
import { softDeletePlugin } from "@/database/plugins/softDelete.plugin";

// Sections are plain, admin-authored records (e.g. "Logos & Visual Identity",
// "Brand Guidelines") rather than fixed fields/models — every project can
// define its own set, including custom ones. `customMetadata` covers any
// section-specific extras a template doesn't anticipate.
export interface IProjectSection {
  _id?: Types.ObjectId;
  projectId: Types.ObjectId;
  title: string;
  description?: string;
  order: number;
  customMetadata?: Record<string, unknown>;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProjectSectionDoc extends Omit<IProjectSection, "_id">, Document {}

const ProjectSectionSchema = new Schema<IProjectSection>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String },
    order: { type: Number, default: 0 },
    customMetadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

ProjectSectionSchema.plugin(softDeletePlugin);

ProjectSectionSchema.index({ projectId: 1, order: 1 });

const ProjectSection =
  models?.ProjectSection || model<IProjectSection>("ProjectSection", ProjectSectionSchema);
export default ProjectSection;
