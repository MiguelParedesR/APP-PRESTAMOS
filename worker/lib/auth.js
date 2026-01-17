export function getBearerToken(request) {
  const header = request.headers.get('Authorization') || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

async function fetchSupabaseUser(env, token) {
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    return { error: 'missing_supabase_env' };
  }

  const baseUrl = env.SUPABASE_URL.replace(/\/+$/, '');
  const url = `${baseUrl}/auth/v1/user`;

  const response = await fetch(url, {
    headers: {
      apikey: env.SUPABASE_ANON_KEY,
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    return { error: 'invalid_token' };
  }

  const data = await response.json().catch(() => null);
  if (!data || !data.id) {
    return { error: 'invalid_token' };
  }

  return { user: data };
}

export async function requireAuth(request, env) {
  const token = getBearerToken(request);
  if (!token) {
    return { ok: false, status: 401, error: 'missing_token' };
  }

  const { user, error } = await fetchSupabaseUser(env, token);
  if (!user || error) {
    return { ok: false, status: 401, error: 'invalid_token' };
  }

  if (!user.id) {
    return { ok: false, status: 401, error: 'missing_subject' };
  }

  return { ok: true, token, userId: user.id, payload: user };
}
