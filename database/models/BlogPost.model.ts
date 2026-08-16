import { Schema, model, models, Document, Types } from "mongoose";

export interface IBlogPost {
  _id?: Types.ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: {
    url: string;
    fileId: string;
  };
  tags?: string[];
  published: boolean;
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBlogPostDoc extends Omit<IBlogPost, "_id">, Document {}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: {
      url: { type: String },
      fileId: { type: String, default: "" },
    },
    tags: { type: [String], default: [] },
    published: { type: Boolean, default: false },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

// Indexes
BlogPostSchema.index({ slug: 1 }, { unique: true });
BlogPostSchema.index({ published: 1 });
BlogPostSchema.index({ tags: 1 });

const BlogPost = models?.BlogPost || model<IBlogPost>("BlogPost", BlogPostSchema);
export default BlogPost;
