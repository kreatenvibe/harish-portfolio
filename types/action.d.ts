export interface CreateCategoryParams {
  name: string;
  description?: string;
  coverImage?: {
    url: string;
    fileId: string;
  };
  order?: number;
  isActive?: boolean;
}

export interface UpdateCategoryParams extends Partial<CreateCategoryParams> {
  id: string;
}

export interface DeleteCategoryParams {
  id: string;
}

export interface ReorderCategoriesParams {
  items: { id: string; order: number }[];
}

export interface ProjectSEOParams {
  title?: string;
  description?: string;
  ogImage?: {
    url: string;
    fileId: string;
  };
}

export interface CreateProjectParams {
  categoryId: string;
  title: string;
  description?: string;
  coverImage?: {
    url: string;
    fileId: string;
  };
  year?: number;
  client?: string;
  tags?: string[];
  order?: number;
  status?: "draft" | "published" | "archived";
  isFeatured?: boolean;
  seo?: ProjectSEOParams;
  customMetadata?: Record<string, unknown>;
}

export interface UpdateProjectParams extends Partial<CreateProjectParams> {
  id: string;
}

export interface DeleteProjectParams {
  id: string;
}

export interface SetProjectStatusParams {
  id: string;
  status: "draft" | "published" | "archived";
}

export interface ReorderProjectsParams {
  items: { id: string; order: number }[];
}

export interface CreateProjectSectionParams {
  projectId: string;
  title: string;
  description?: string;
  order?: number;
  customMetadata?: Record<string, unknown>;
}

export interface UpdateProjectSectionParams extends Partial<CreateProjectSectionParams> {
  id: string;
}

export interface DeleteProjectSectionParams {
  id: string;
}

export interface ReorderProjectSectionsParams {
  items: { id: string; order: number }[];
}

export interface CreateMediaParams {
  projectId: string;
  sectionId: string;
  type: "image" | "video" | "pdf" | "other";
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
  order?: number;
}

export interface UpdateMediaParams extends Partial<CreateMediaParams> {
  id: string;
}

export interface DeleteMediaParams {
  id: string;
}

export interface ReorderMediaParams {
  items: { id: string; order: number }[];
}

export interface CreateBlogPostParams {
  title: string;
  excerpt: string;
  content: string;
  coverImage?: {
    url: string;
    fileId: string;
  };
  tags?: string[];
  published?: boolean;
  publishedAt?: Date | string;
}

export interface UpdateBlogPostParams extends Partial<CreateBlogPostParams> {
  id: string;
}

export interface DeleteBlogPostParams {
  id: string;
}

export interface ToggleBlogPostPublishedParams {
  id: string;
}

export interface SubmitLeadParams {
  name: string;
  email: string;
  business?: string;
  businessDescription?: string;
  improvement?: string;
  currentTools?: string;
  whatToBuild?: string;
  anythingElse?: string;
  // Honeypot field — must stay empty; real users never see or fill it in.
  website?: string;
}

export interface MarkLeadReadParams {
  id: string;
  read: boolean;
}

export interface DeleteLeadParams {
  id: string;
}
