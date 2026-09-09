/**
 * Client-safe and server-safe ImageKit URL utilities.
 */

export interface ImageKitTransformOptions {
  /** Maximum width in pixels (defaults to 2500 to stay safely below 25MP limit) */
  width?: number;
  /** Maximum height in pixels */
  height?: number;
  /** Quality between 1 and 100 */
  quality?: number;
  /** Output format */
  format?: "auto" | "webp" | "jpg" | "png" | "avif";
  /** Raw ImageKit transformation string, e.g. "w-2500,q-85" */
  rawTransform?: string;
}

/**
 * Checks whether a given URL is hosted on ImageKit.
 */
export function isImageKitUrl(url?: string | null): boolean {
  if (!url || typeof url !== "string") return false;
  return url.includes("ik.imagekit.io") || url.includes("imagekit.io");
}

/**
 * Returns an ImageKit delivery URL with safe transformations applied (e.g. max width 2500px)
 * to avoid HTTP 400 errors on images exceeding ImageKit's 25.0 MegaPixel transformation limit.
 *
 * - Non-ImageKit URLs are returned unchanged.
 * - URLs already containing a transformation (e.g., `tr=...` or `tr:...`) are preserved without duplicating.
 * - Preserves existing query params (e.g., `updatedAt=...`).
 */
export function getImageKitUrl(
  url?: string | null,
  options?: ImageKitTransformOptions
): string {
  if (!url || typeof url !== "string") return url ?? "";
  if (!isImageKitUrl(url)) return url;

  // If a transformation is already present in query params or path, don't duplicate
  if (/[?&]tr=/.test(url) || /\/tr:[^/]+\//.test(url)) {
    return url;
  }

  const transformParts: string[] = [];

  if (options?.rawTransform) {
    transformParts.push(options.rawTransform);
  } else {
    // Default to width 2500 if neither width nor height is specified
    const width = options?.width ?? (!options?.height ? 2500 : undefined);
    if (width) transformParts.push(`w-${width}`);
    if (options?.height) transformParts.push(`h-${options.height}`);
    if (options?.quality) transformParts.push(`q-${options.quality}`);
    if (options?.format) transformParts.push(`f-${options.format}`);
  }

  if (transformParts.length === 0) {
    transformParts.push("w-2500");
  }

  const transformQuery = `tr=${transformParts.join(",")}`;
  const separator = url.includes("?") ? "&" : "?";

  return `${url}${separator}${transformQuery}`;
}
