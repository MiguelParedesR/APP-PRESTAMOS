import { requireAuth } from '../lib/auth.js';
import { getCacheJson, setCacheJson } from '../lib/cache.js';
import { checkRateLimit } from '../lib/rateLimit.js';
import { fetchProfileState, insertEvent } from '../lib/supabase.js';

const CACHE_TTL_SECONDS = 60;

const jsonResponse = (payload, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { 'content-type': 'application/json' }
  });

export async function getProfileState(request, env) {
  const auth = await requireAuth(request, env);
  if (!auth.ok) {
    return jsonResponse({ status: 'error', error: auth.error }, auth.status);
  }

  const rate = await checkRateLimit(env, auth.userId, 'me_state');
  if (!rate.allowed) {
    await insertEvent(env, auth.token, auth.userId, 'rate_limited', 'me_state').catch(() => null);
    return jsonResponse({ status: 'error', error: 'rate_limited' }, 429);
  }

  const cacheKey = `profile_state:${auth.userId}`;
  const cached = await getCacheJson(env, cacheKey);
  if (cached) {
    return jsonResponse({ status: 'ok', data: cached });
  }

  const { data, error } = await fetchProfileState(env, auth.token, auth.userId);
  if (error) {
    return jsonResponse({ status: 'error', error: 'supabase_error' }, error.status || 500);
  }

  if (!data) {
    return jsonResponse({ status: 'error', error: 'profile_state_not_found' }, 404);
  }

  await setCacheJson(env, cacheKey, data, CACHE_TTL_SECONDS);
  return jsonResponse({ status: 'ok', data });
}
