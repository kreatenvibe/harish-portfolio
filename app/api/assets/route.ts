import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { ikFetch } from "@/lib/imagekit.server";
import type { IKRawFile, IKFile } from "@/types/imagekit";

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get("folder") || "/";
    const limit = Number(searchParams.get("limit") || "50");
    const skip = Number(searchParams.get("skip") || "0");

    // Do NOT use encodeURIComponent on folder paths — ImageKit's API gateway
    // does not decode %2F back to / in query params, causing 404 "Function not found".
    const data = await ikFetch<IKRawFile[]>(
      `/files?path=${path}&limit=${limit}&skip=${skip}`
    );

    const items: IKFile[] = data.map((item) => ({
      id: item.fileId,
      name: item.name,
      url: item.url,
      thumbnailUrl: item.thumbnail ?? item.url,
      type: item.fileType,
      path: item.filePath,
    }));

    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to list assets" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { fileId } = (await req.json()) as { fileId?: string };
    if (!fileId) {
      return NextResponse.json({ error: "fileId required" }, { status: 400 });
    }

    await ikFetch(`/files/${fileId}`, { method: "DELETE" });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete asset" },
      { status: 500 }
    );
  }
}
