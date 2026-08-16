// Raw shape returned by ImageKit REST API
export interface IKRawFile {
  fileId: string;
  name: string;
  url: string;
  thumbnail?: string;
  filePath: string;
  fileType: "image" | "non-image";
  size: number;
  width?: number;
  height?: number;
  createdAt: string;
}

export interface IKRawFolder {
  folderId: string;
  name: string;
  folderPath: string;
}

// Normalised shapes used by the UI
export interface IKFile {
  id: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  type: "image" | "non-image";
  path: string;
}

export interface IKFolder {
  id: string;
  name: string;
  path: string;
}
