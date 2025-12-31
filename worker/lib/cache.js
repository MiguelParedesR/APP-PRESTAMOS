export async function getCacheJson(env, key) {
  if (!env.CACHE) return null;
  const value = await env.CACHE.get(key);
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export async function setCacheJson(env, key, value, ttlSeconds) {
  if (!env.CACHE) return;
  const payload = JSON.stringify(value);
  await env.CACHE.put(key, payload, { expirationTtl: ttlSeconds });
}
