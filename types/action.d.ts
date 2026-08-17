export interface CreateProjectParams {
  title: string;
  label: string;
  challenge: string;
  whatWeBuilt: string;
  howItWorks: string;
  outcome: string;
  liveUrl?: string;
  media?: {
    url: string;
    fileId: string;
    type: "image" | "video";
  }[];
  featured?: boolean;
  order?: number;
}

export interface UpdateProjectParams extends Partial<CreateProjectParams> {
  id: string;
}

export interface DeleteProjectParams {
  id: string;
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
