import { requireAuth } from '../lib/auth.js';
import { getCacheJson, setCacheJson } from '../lib/cache.js';
import { checkRateLimit } from '../lib/rateLimit.js';
import { fetchProfileState, fetchSystemFlags, fetchPendingLoan, insertLoanRequest, insertEvent } from '../lib/supabase.js';

const FLAGS_CACHE_TTL = 120;
const STATE_CACHE_TTL = 60;

const jsonResponse = (payload, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { 'content-type': 'application/json' }
  });

export async function createLoanRequest(request, env) {
  const auth = await requireAuth(request, env);
  if (!auth.ok) {
    return jsonResponse({ status: 'error', error: auth.error }, auth.status);
  }

  const rate = await checkRateLimit(env, auth.userId, 'loan_request');
  if (!rate.allowed) {
    await insertEvent(env, auth.token, auth.userId, 'rate_limited', 'loan_request').catch(() => null);
    return jsonResponse({ status: 'error', error: 'rate_limited' }, 429);
  }

  const flagsKey = 'system_flags';
  let flags = await getCacheJson(env, flagsKey);
  if (!flags) {
    const flagsResult = await fetchSystemFlags(env, auth.token);
    if (flagsResult.error) {
      return jsonResponse({ status: 'error', error: 'supabase_error' }, flagsResult.error.status || 500);
    }
    flags = flagsResult.data || {};
    await setCacheJson(env, flagsKey, flags, FLAGS_CACHE_TTL);
  }

  if (flags.loans_enabled === false) {
    return jsonResponse({ status: 'error', error: 'loans_disabled' }, 403);
  }

  const stateKey = `profile_state:${auth.userId}`;
  let profileState = await getCacheJson(env, stateKey);
  if (!profileState) {
    const stateResult = await fetchProfileState(env, auth.token, auth.userId);
    if (stateResult.error) {
      return jsonResponse({ status: 'error', error: 'supabase_error' }, stateResult.error.status || 500);
    }
    profileState = stateResult.data;
    if (profileState) {
      await setCacheJson(env, stateKey, profileState, STATE_CACHE_TTL);
    }
  }

  if (!profileState) {
    return jsonResponse({ status: 'error', error: 'profile_state_not_found' }, 404);
  }

  if (profileState.estadoPerfil === 'congelado') {
    return jsonResponse({ status: 'error', error: 'profile_frozen' }, 403);
  }

  const pending = await fetchPendingLoan(env, auth.token, auth.userId);
  if (pending.error) {
    return jsonResponse({ status: 'error', error: 'supabase_error' }, pending.error.status || 500);
  }

  if (pending.data) {
    return jsonResponse({ status: 'error', error: 'pending_request_exists' }, 409);
  }

  const insertResult = await insertLoanRequest(env, auth.token, auth.userId);
  if (insertResult.error) {
    return jsonResponse({ status: 'error', error: 'supabase_error' }, insertResult.error.status || 500);
  }

  const created = insertResult.data && insertResult.data[0] ? insertResult.data[0] : null;
  await insertEvent(env, auth.token, auth.userId, 'loan_request_created', 'loan_request').catch(() => null);

  return jsonResponse({ status: 'ok', data: { request: created } }, 201);
}
