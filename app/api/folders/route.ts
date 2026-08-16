import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { ikFetch } from "@/lib/imagekit.server";
import type { IKRawFolder, IKFolder } from "@/types/imagekit";

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const parentFolderPath = searchParams.get("path") || "/";

    // ImageKit lists folders via /v1/files?type=folder (the /v1/folders endpoint returns 404).
    const raw = await ikFetch<IKRawFolder[]>(
      `/files?type=folder&path=${parentFolderPath}`
    );

    const folders: IKFolder[] = raw.map((f) => ({
      id: f.folderId,
      name: f.name,
      path: f.folderPath,
    }));

    return NextResponse.json(folders);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to list folders" },
      { status: 500 }
    );
  }
}
