import { requireAuth } from '../lib/auth.js';
import { checkRateLimit } from '../lib/rateLimit.js';
import { fetchProfileEvents, insertEvent } from '../lib/supabase.js';

const jsonResponse = (payload, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { 'content-type': 'application/json' }
  });

export async function getProfileEvents(request, env) {
  const auth = await requireAuth(request, env);
  if (!auth.ok) {
    return jsonResponse({ status: 'error', error: auth.error }, auth.status);
  }

  const rate = await checkRateLimit(env, auth.userId, 'me_events');
  if (!rate.allowed) {
    await insertEvent(env, auth.token, auth.userId, 'rate_limited', 'me_events').catch(() => null);
    return jsonResponse({ status: 'error', error: 'rate_limited' }, 429);
  }

  const { data, error } = await fetchProfileEvents(env, auth.token, auth.userId, 20);
  if (error) {
    return jsonResponse({ status: 'error', error: 'supabase_error' }, error.status || 500);
  }

  return jsonResponse({ status: 'ok', data: data || [] });
}
