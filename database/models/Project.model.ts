import { Schema, model, models, Document, Types } from "mongoose";
import { softDeletePlugin } from "@/database/plugins/softDelete.plugin";

export type ProjectStatus = "draft" | "published" | "archived";

export interface IProjectSEO {
  title?: string;
  description?: string;
  ogImage?: {
    url: string;
    fileId: string;
  };
}

export interface IProject {
  _id?: Types.ObjectId;
  categoryId: Types.ObjectId;
  title: string;
  slug: string;
  description?: string;
  coverImage?: {
    url: string;
    fileId: string;
  };
  year?: number;
  client?: string;
  tags: string[];
  order: number;
  status: ProjectStatus;
  isFeatured: boolean;
  enableFullscreenGallery?: boolean;
  seo?: IProjectSEO;
  // Flexible per-project extras a fixed schema can't anticipate.
  customMetadata?: Record<string, unknown>;
  createdBy?: string;
  updatedBy?: string;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProjectDoc extends Omit<IProject, "_id">, Document {}

const ProjectSchema = new Schema<IProject>(
  {
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    description: { type: String },
    coverImage: {
      url: { type: String },
      fileId: { type: String },
    },
    year: { type: Number },
    client: { type: String },
    tags: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    isFeatured: { type: Boolean, default: false },
    enableFullscreenGallery: { type: Boolean, default: true },
    seo: {
      title: { type: String },
      description: { type: String },
      ogImage: {
        url: { type: String },
        fileId: { type: String },
      },
    },
    customMetadata: { type: Schema.Types.Mixed, default: {} },
    createdBy: { type: String },
    updatedBy: { type: String },
  },
  { timestamps: true }
);

ProjectSchema.plugin(softDeletePlugin);

// Partial index: only live (non soft-deleted) projects compete for a slug,
// so a slug freed by a soft delete can be reused by a new project.
ProjectSchema.index(
  { slug: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } }
);
ProjectSchema.index({ categoryId: 1 });
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ isFeatured: 1 });
ProjectSchema.index({ order: 1 });
ProjectSchema.index({ tags: 1 });

const Project = models?.Project || model<IProject>("Project", ProjectSchema);
export default Project;
