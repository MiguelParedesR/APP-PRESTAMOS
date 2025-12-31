import { getProfileState } from './handlers/getProfileState.js';
import { getProfileEvents } from './handlers/getProfileEvents.js';
import { createLoanRequest } from './handlers/createLoanRequest.js';
import { getSystemFlags } from './handlers/getSystemFlags.js';

const routes = {
  'GET /me/state': getProfileState,
  'GET /me/events': getProfileEvents,
  'POST /loan/request': createLoanRequest,
  'GET /system/flags': getSystemFlags
};

const jsonResponse = (payload, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { 'content-type': 'application/json' }
  });

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const key = `${request.method.toUpperCase()} ${url.pathname}`;
    const handler = routes[key];

    if (!handler) {
      return jsonResponse({ status: 'error', error: 'not_found' }, 404);
    }

    try {
      return await handler(request, env, ctx);
    } catch {
      return jsonResponse({ status: 'error', error: 'internal_error' }, 500);
    }
  }
};
