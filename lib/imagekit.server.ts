// Server-only — never import in client components

const PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;
if (!PRIVATE_KEY) throw new Error("IMAGEKIT_PRIVATE_KEY is not defined");

export const IK_AUTH =
  "Basic " + Buffer.from(PRIVATE_KEY + ":").toString("base64");

export async function ikFetch<T = unknown>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(`https://api.imagekit.io/v1${path}`, {
    ...init,
    headers: {
      Authorization: IK_AUTH,
      "Content-Type": "application/json",
      ...(init?.headers as Record<string, string> | undefined),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`ImageKit ${res.status}: ${text}`);
  }

  // DELETE returns 204 No Content
  if (res.status === 204) return {} as T;
  return res.json() as Promise<T>;
}
