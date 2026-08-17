import { Schema, model, models, Document, Types } from "mongoose";

export interface IProject {
  _id?: Types.ObjectId;
  title: string;
  slug: string;
  label: string;
  challenge: string;
  whatWeBuilt: string;
  howItWorks: string;
  outcome: string;
  liveUrl?: string;
  // Optional: .lean() reads skip schema defaults, so documents saved before
  // this field existed come back without it.
  media?: {
    url: string;
    fileId: string;
    type: "image" | "video";
  }[];
  featured: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProjectDoc extends Omit<IProject, "_id">, Document {}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    challenge: { type: String, required: true },
    whatWeBuilt: { type: String, required: true },
    howItWorks: { type: String, required: true },
    outcome: { type: String, required: true },
    liveUrl: { type: String },
    media: {
      type: [
        {
          url: { type: String, required: true },
          fileId: { type: String, required: true },
          type: { type: String, enum: ["image", "video"], required: true },
        },
      ],
      default: [],
    },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Indexes
ProjectSchema.index({ slug: 1 }, { unique: true });
ProjectSchema.index({ featured: 1 });
ProjectSchema.index({ order: 1 });

const Project = models?.Project || model<IProject>("Project", ProjectSchema);
export default Project;
