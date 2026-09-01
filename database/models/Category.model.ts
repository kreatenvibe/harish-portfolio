import { Schema, model, models, Document, Types } from "mongoose";
import { softDeletePlugin } from "@/database/plugins/softDelete.plugin";

export interface ICategory {
  _id?: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  coverImage?: {
    url: string;
    fileId: string;
  };
  order: number;
  isActive: boolean;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICategoryDoc extends Omit<ICategory, "_id">, Document {}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    description: { type: String },
    coverImage: {
      url: { type: String },
      fileId: { type: String },
    },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

CategorySchema.plugin(softDeletePlugin);

// Partial index: only live (non soft-deleted) categories compete for a slug,
// so a slug freed by a soft delete can be reused by a new category.
CategorySchema.index(
  { slug: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } }
);
CategorySchema.index({ order: 1 });
CategorySchema.index({ isActive: 1 });

const Category = models?.Category || model<ICategory>("Category", CategorySchema);
export default Category;
