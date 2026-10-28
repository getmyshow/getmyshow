/**
 * Cloudinary image optimization and transformation helper
 */
export function getOptimizedPosterUrl(
  rawUrl: string | undefined | null,
  options: { width?: number; quality?: string } = {}
): string {
  if (!rawUrl) {
    return "/brand/default-event-poster.webp";
  }

  const { width = 800, quality = "auto" } = options;

  // If already a Cloudinary URL, inject optimal transformation flags
  if (rawUrl.includes("res.cloudinary.com") && rawUrl.includes("/upload/")) {
    return rawUrl.replace(
      "/upload/",
      `/upload/f_auto,q_${quality},w_${width},c_fill,g_auto/`
    );
  }

  // If Unsplash or standard image URL, format safely
  if (rawUrl.includes("images.unsplash.com")) {
    return `${rawUrl.split("?")[0]}?q=80&w=${width}&auto=format&fit=crop`;
  }

  return rawUrl;
}

