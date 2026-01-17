import { getProfileState } from './handlers/getProfileState.js';
import { getProfileEvents } from './handlers/getProfileEvents.js';
import { createLoanRequest } from './handlers/createLoanRequest.js';
import { getSystemFlags } from './handlers/getSystemFlags.js';
import { adminLoanStatus } from './handlers/adminLoanStatus.js';

const routes = {
  'GET /me/state': getProfileState,
  'GET /me/events': getProfileEvents,
  'POST /loan/request': createLoanRequest,
  'GET /system/flags': getSystemFlags
};

const corsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET,POST,OPTIONS',
  'access-control-allow-headers': 'Authorization,Content-Type',
  'access-control-max-age': '86400'
};

const jsonResponse = (payload, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { 'content-type': 'application/json', ...corsHeaders }
  });

const withCors = (response) => {
  const headers = new Headers(response.headers);
  Object.entries(corsHeaders).forEach(([key, value]) => headers.set(key, value));
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
};

export default {
  async fetch(request, env, ctx) {
    if (request.method.toUpperCase() === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
      return jsonResponse({ status: 'error', error: 'missing_supabase_config' }, 500);
    }

    const url = new URL(request.url);
    const key = `${request.method.toUpperCase()} ${url.pathname}`;
    const handler = routes[key];

    if (!handler) {
      if (request.method.toUpperCase() === 'POST' && url.pathname.startsWith('/admin/loan/')) {
        const response = await adminLoanStatus(request, env, ctx);
        return withCors(response);
      }
      return jsonResponse({ status: 'error', error: 'not_found' }, 404);
    }

    try {
      const response = await handler(request, env, ctx);
      return withCors(response);
    } catch {
      return jsonResponse({ status: 'error', error: 'internal_error' }, 500);
    }
  }
};
