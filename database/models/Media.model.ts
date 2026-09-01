import { Schema, model, models, Document, Types } from "mongoose";
import { softDeletePlugin } from "@/database/plugins/softDelete.plugin";

export type MediaType = "image" | "video" | "pdf" | "other";

// `url`/`fileId` reference an ImageKit file (see lib/imagekit.server.ts) —
// this model only stores the reference and its own presentation metadata,
// keeping storage/CDN concerns out of the domain model.
export interface IMedia {
  _id?: Types.ObjectId;
  projectId: Types.ObjectId;
  sectionId: Types.ObjectId;
  type: MediaType;
  url: string;
  fileId: string;
  thumbnail?: string;
  title?: string;
  description?: string;
  altText?: string;
  caption?: string;
  mimeType?: string;
  size?: number;
  width?: number;
  height?: number;
  duration?: number;
  order: number;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IMediaDoc extends Omit<IMedia, "_id">, Document {}

const MediaSchema = new Schema<IMedia>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    sectionId: { type: Schema.Types.ObjectId, ref: "ProjectSection", required: true },
    type: { type: String, enum: ["image", "video", "pdf", "other"], required: true },
    url: { type: String, required: true },
    fileId: { type: String, required: true },
    thumbnail: { type: String },
    title: { type: String },
    description: { type: String },
    altText: { type: String },
    caption: { type: String },
    mimeType: { type: String },
    size: { type: Number },
    width: { type: Number },
    height: { type: Number },
    duration: { type: Number },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

MediaSchema.plugin(softDeletePlugin);

MediaSchema.index({ sectionId: 1, order: 1 });
MediaSchema.index({ projectId: 1 });
MediaSchema.index({ type: 1 });

const Media = models?.Media || model<IMedia>("Media", MediaSchema);
export default Media;
