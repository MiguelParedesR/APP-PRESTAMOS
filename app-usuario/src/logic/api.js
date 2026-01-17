const fallbackHost = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1';
const WORKER_URL = import.meta.env.VITE_WORKER_URL || `http://${fallbackHost}:8787`;
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

async function supabaseAuthRequest(path, body) {
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const data = await parseJson(response);
  if (!response.ok) {
    return { ok: false, status: response.status, error: data?.msg || data?.error || 'auth_error' };
  }

  return { ok: true, status: response.status, data };
}

async function workerRequest(path, token, options = {}) {
  let response;
  try {
    response = await fetch(`${WORKER_URL}${path}`, {
      method: options.method || 'GET',
      headers: {
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
    return { ok: false, status: response.status, error: data?.error || 'request_error' };
  }

  return { ok: true, status: response.status, data };
}

export async function signInWithPassword(email, password) {
  return supabaseAuthRequest('/auth/v1/token?grant_type=password', { email, password });
}

export async function fetchProfileState(token) {
  return workerRequest('/me/state', token);
}

export async function fetchProfileEvents(token) {
  return workerRequest('/me/events', token);
}

export async function createLoanRequest(token, payload) {
  return workerRequest('/loan/request', token, { method: 'POST', body: payload });
}
