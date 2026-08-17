import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { ikFetch } from "@/lib/imagekit.server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { sourceFilePath, destinationPath } = await req.json();
    if (!sourceFilePath || !destinationPath) {
      return NextResponse.json({ error: "sourceFilePath and destinationPath are required" }, { status: 400 });
    }

    await ikFetch(`/files/move`, {
      method: "POST",
      body: JSON.stringify({
        sourceFilePath,
        destinationPath,
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to move file" },
      { status: 500 }
    );
  }
}
