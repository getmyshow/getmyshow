import crypto from "crypto";

/**
 * Generates a tamper-proof cryptographic QR token.
 * Token Format: GMS-<TICKET_ID_PREFIX>-<HMAC_SIGNATURE>
 */
export function generateQrToken(ticketId: string, eventId: string): string {
  const secret = process.env.QR_HMAC_SECRET || "getmyshow_hyperlocal_hmac_secret_2026";
  const data = `${eventId}:${ticketId}`;
  const hmac = crypto
    .createHmac("sha256", secret)
    .update(data)
    .digest("hex")
    .slice(0, 12)
    .toUpperCase();
  
  const shortTicketId = ticketId.replace(/-/g, "").slice(0, 8).toUpperCase();
  return `GMS-${shortTicketId}-${hmac}`;
}

/**
 * Validates the HMAC signature of a scanned QR token against the event.
 */
export function verifyQrTokenSignature(token: string, ticketId: string, eventId: string): boolean {
  if (!token || !ticketId || !eventId) return false;
  const expectedToken = generateQrToken(ticketId, eventId);
  return token.toUpperCase() === expectedToken.toUpperCase();
}

/**
 * Inspects whether a raw scanned string is a valid GetMyShow format.
 */
export function isValidQrFormat(rawScan: string): boolean {
  if (!rawScan || typeof rawScan !== "string") return false;
  const trimmed = rawScan.trim();
  // Accepts either direct token GMS-XXXX-YYYY or URL https://.../ticket/GMS-XXXX-YYYY
  if (trimmed.startsWith("GMS-")) {
    const parts = trimmed.split("-");
    return parts.length >= 3;
  }
  if (trimmed.includes("/ticket/")) {
    const tokenPart = trimmed.split("/ticket/").pop()?.split("?")[0];
    return Boolean(tokenPart && tokenPart.startsWith("GMS-"));
  }
  return false;
}

/**
 * Extracts the clean token from either raw text or scanned URL.
 */
export function extractTokenFromScan(rawScan: string): string {
  const trimmed = rawScan.trim();
  if (trimmed.includes("/ticket/")) {
    const tokenPart = trimmed.split("/ticket/").pop()?.split("?")[0];
    if (tokenPart) return tokenPart.trim();
  }
  return trimmed;
}

