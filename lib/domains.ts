/**
 * Domain & Subdomain Routing Helpers
 * Supports:
 *  1. Local Development via lvh.me (http://localhost:3000, http://org.lvh.me:3000, http://scan.lvh.me:3000)
 *  2. Free Vercel Deployments (getmyshow-nine.vercel.app, getmyshow-org.vercel.app, getmyshow-scan.vercel.app)
 *  3. Future Custom Domains (getmyshow.in, org.getmyshow.in, scan.getmyshow.in, api.getmyshow.in)
 */

export type AppTier = "public" | "org" | "scan";

/**
 * Extracts the active portal tier based on the incoming hostname.
 * Examples:
 *  - "org.lvh.me:3000" -> "org"
 *  - "scan.lvh.me:3000" -> "scan"
 *  - "org.getmyshow.in" -> "org"
 *  - "scan.getmyshow.in" -> "scan"
 *  - "getmyshow-org.vercel.app" -> "org"
 *  - "getmyshow-scan.vercel.app" -> "scan"
 *  - "localhost:3000" -> "public"
 *  - "getmyshow-nine.vercel.app" -> "public"
 */
export function getTierFromHost(hostname: string): AppTier {
  const host = hostname.toLowerCase().split(":")[0];

  // 1. Organizer detection
  if (
    host.startsWith("org.") ||
    host === "org" ||
    host.includes("-org.") ||
    host.endsWith("-org.vercel.app")
  ) {
    return "org";
  }

  // 2. Gate Scanner detection
  if (
    host.startsWith("scan.") ||
    host === "scan" ||
    host.includes("-scan.") ||
    host.endsWith("-scan.vercel.app")
  ) {
    return "scan";
  }

  // 3. Default to public attendee portal
  return "public";
}

/**
 * Generates an absolute or relative URL for a specific subdomain portal.
 */
export function getSubdomainUrl(tier: AppTier, path: string = ""): string {
  // Ensure path starts with a slash if not empty
  const formattedPath = path ? (path.startsWith("/") ? path : `/${path}`) : "";

  // Check client-side execution
  const isClient = typeof window !== "undefined";
  const currentHost = isClient ? window.location.hostname : "";
  const isDev =
    process.env.NODE_ENV === "development" ||
    (isClient && (currentHost.includes("localhost") || currentHost.includes("lvh.me")));

  // 1. Local Development (Uses lvh.me for zero-config loopback subdomains)
  if (isDev) {
    const port = isClient && window.location.port ? `:${window.location.port}` : ":3000";
    if (tier === "org") return `http://org.lvh.me${port}${formattedPath}`;
    if (tier === "scan") return `http://scan.lvh.me${port}${formattedPath}`;
    return `http://localhost${port}${formattedPath}`;
  }

  // 2. Custom Domain (e.g., getmyshow.in when purchased)
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
  if (rootDomain) {
    if (tier === "org") return `https://org.${rootDomain}${formattedPath}`;
    if (tier === "scan") return `https://scan.${rootDomain}${formattedPath}`;
    return `https://${rootDomain}${formattedPath}`;
  }

  // 3. Current Free Vercel Setup
  // If separate Vercel projects are configured (getmyshow-org.vercel.app / getmyshow-scan.vercel.app):
  const vercelOrgDomain = process.env.NEXT_PUBLIC_VERCEL_ORG_DOMAIN;
  const vercelScanDomain = process.env.NEXT_PUBLIC_VERCEL_SCAN_DOMAIN;

  if (tier === "org") {
    if (vercelOrgDomain) {
      return `https://${vercelOrgDomain}${formattedPath}`;
    }
    // Fallback on single Vercel project: direct subpath
    return `/organizer${formattedPath}`;
  }

  if (tier === "scan") {
    if (vercelScanDomain) {
      return `https://${vercelScanDomain}${formattedPath}`;
    }
    // Fallback on single Vercel project: direct subpath
    return `/scan${formattedPath}`;
  }

  return formattedPath || "/";
}
