const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://kfbiiovahhoibgtfurxu.supabase.co';
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmYmlpb3ZhaGhvaWJndGZ1cnh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNzIzMDQsImV4cCI6MjA4Mzc0ODMwNH0.CWyoHT40Fat9EnTlFTCVrCF2RtnEFvRuPQxW9zMC08k';

async function parseJson(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function authRequest(path, body, accessToken) {
  let response;
  try {
    response = await fetch(`${SUPABASE_URL}${path}`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
  } catch {
    return { ok: false, status: 0, error: 'network_error' };
  }

  const data = await parseJson(response);
  if (!response.ok) {
    return { ok: false, status: response.status, error: data?.msg || data?.error || 'auth_error' };
  }

  return { ok: true, status: response.status, data };
}

async function restRequest(path, token, options = {}) {
  let response;
  try {
    response = await fetch(`${SUPABASE_URL}${path}`, {
      method: options.method || 'GET',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    });
  } catch {
    return { ok: false, status: 0, error: 'network_error' };
  }

  const data = await parseJson(response);
  if (!response.ok) {
    return { ok: false, status: response.status, error: data || 'request_error' };
  }

  return { ok: true, status: response.status, data };
}

export async function signInWithPassword(email, password) {
  return authRequest('/auth/v1/token?grant_type=password', { email, password });
}

export async function refreshSession(refreshToken) {
  return authRequest('/auth/v1/token?grant_type=refresh_token', {
    refresh_token: refreshToken
  });
}

export async function signOut(accessToken, refreshToken) {
  if (!accessToken) return { ok: true, status: 204, data: null };
  return authRequest(
    '/auth/v1/logout',
    {
      refresh_token: refreshToken,
      access_token: accessToken
    },
    accessToken
  );
}

export async function fetchProfileAdminFlag(accessToken, userId) {
  const query = new URLSearchParams({
    select: 'is_admin',
    id: `eq.${userId}`,
    limit: '1'
  });
  return restRequest(`/rest/v1/profiles?${query.toString()}`, accessToken);
}

export async function checkIsAdmin(accessToken) {
  return restRequest('/rest/v1/rpc/is_admin', accessToken, {
    method: 'POST',
    body: {}
  });
}

export async function insertAuditLog(accessToken, payload) {
  return restRequest('/rest/v1/audit_logs', accessToken, {
    method: 'POST',
    body: payload
  });
}

export async function supabaseRest(path, accessToken, options = {}) {
  return restRequest(path, accessToken, options);
}
