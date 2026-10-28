import { Redis } from "@upstash/redis";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis =
  redisUrl && redisToken && !redisUrl.includes("placeholder")
    ? new Redis({
        url: redisUrl,
        token: redisToken,
      })
    : null;

/**
 * Concurrency seat lock: prevents overselling the last seats during checkout.
 * Hold expires automatically after 5 minutes (300s).
 */
export async function lockSeats(eventId: string, count: number): Promise<boolean> {
  if (!redis) {
    // Graceful fallback when Upstash keys are pending
    return true;
  }
  try {
    const lockKey = `lock:event:${eventId}`;
    const acquired = await redis.set(lockKey, "locked", { nx: true, ex: 300 });
    return Boolean(acquired);
  } catch (err) {
    console.error("Redis seat lock error, proceeding with DB constraint:", err);
    return true;
  }
}

/**
 * Concurrency seat reservation with 8-minute TTL (480s) matching BookMyShow standards.
 */
export async function holdSeatReservation(eventId: string, ticketId: string, quantity: number, ttl = 480): Promise<boolean> {
  if (!redis) return true;
  try {
    const key = `seat_hold:${eventId}:${ticketId}`;
    await redis.set(key, quantity.toString(), { ex: ttl });
    return true;
  } catch (err) {
    console.error("Redis seat reservation error:", err);
    return true;
  }
}

export async function releaseSeatReservation(eventId: string, ticketId: string): Promise<boolean> {
  if (!redis) return true;
  try {
    const key = `seat_hold:${eventId}:${ticketId}`;
    await redis.del(key);
    return true;
  } catch (err) {
    console.error("Redis seat release error:", err);
    return true;
  }
}

/**
 * Fast Gate Check-In Cache (<50ms lookups).
 */
export async function markTicketScannedCache(eventId: string, qrToken: string): Promise<boolean> {
  if (!redis) return true;
  try {
    const key = `scanned:${eventId}`;
    const added = await redis.sadd(key, qrToken);
    return added === 1;
  } catch (err) {
    console.error("Redis gate check error:", err);
    return true;
  }
}

export async function isTicketScannedInCache(eventId: string, qrToken: string): Promise<boolean> {
  if (!redis) return false;
  try {
    const key = `scanned:${eventId}`;
    return Boolean(await redis.sismember(key, qrToken));
  } catch (err) {
    console.error("Redis check error:", err);
    return false;
  }
}

