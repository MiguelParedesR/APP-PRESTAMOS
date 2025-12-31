const memoryCounts = new Map();

export async function checkRateLimit(env, userId, endpoint, limit = 30, windowSeconds = 60) {
  const now = Date.now();
  const bucket = Math.floor(now / (windowSeconds * 1000));
  const key = `rl:${endpoint}:${userId}:${bucket}`;

  let count = memoryCounts.get(key) || 0;

  if (env.RATE_LIMIT) {
    const stored = await env.RATE_LIMIT.get(key);
    if (stored) {
      const storedCount = Number(stored);
      if (storedCount > count) count = storedCount;
    }
  }

  if (count >= limit) {
    const resetAt = (bucket + 1) * windowSeconds * 1000;
    const resetSeconds = Math.max(0, Math.ceil((resetAt - now) / 1000));
    return { allowed: false, remaining: 0, resetSeconds };
  }

  const nextCount = count + 1;
  memoryCounts.set(key, nextCount);

  if (env.RATE_LIMIT) {
    await env.RATE_LIMIT.put(key, String(nextCount), { expirationTtl: windowSeconds + 5 });
  }

  return { allowed: true, remaining: Math.max(0, limit - nextCount), resetSeconds: windowSeconds };
}
