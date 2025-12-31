function getBaseUrl(env) {
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) return null;
  return env.SUPABASE_URL.replace(/\/+$/, '');
}

function buildUrl(env, table, params = {}) {
  const baseUrl = getBaseUrl(env);
  if (!baseUrl) return null;
  const url = new URL(`${baseUrl}/rest/v1/${table}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  });
  return url;
}

async function supabaseRequest(env, token, url, options = {}) {
  const headers = {
    apikey: env.SUPABASE_ANON_KEY,
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  if (options.prefer) {
    headers.Prefer = options.prefer;
  }

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    return { error: { status: response.status, message: data || response.statusText } };
  }

  return { data };
}

async function selectRows(env, token, table, params) {
  const url = buildUrl(env, table, params);
  if (!url) return { error: { status: 500, message: 'missing_supabase_env' } };
  return supabaseRequest(env, token, url);
}

async function insertRow(env, token, table, body) {
  const url = buildUrl(env, table);
  if (!url) return { error: { status: 500, message: 'missing_supabase_env' } };
  return supabaseRequest(env, token, url, { method: 'POST', body, prefer: 'return=representation' });
}

export async function fetchProfileState(env, token, userId) {
  const { data, error } = await selectRows(env, token, 'profile_state', {
    select: 'estado_perfil,nivel_actual,progreso_conducta,perfil_habilitado,updated_at',
    user_id: `eq.${userId}`,
    limit: '1'
  });

  if (error) return { error };
  const row = data && data[0] ? data[0] : null;
  if (!row) return { data: null };

  return {
    data: {
      estadoPerfil: row.estado_perfil,
      nivelActual: row.nivel_actual,
      progresoConducta: row.progreso_conducta,
      perfilHabilitado: row.perfil_habilitado,
      updatedAt: row.updated_at
    }
  };
}

export async function fetchProfileEvents(env, token, userId, limit = 20) {
  return selectRows(env, token, 'profile_events', {
    select: 'id,type,detail,created_at',
    user_id: `eq.${userId}`,
    order: 'created_at.desc',
    limit: String(limit)
  });
}

export async function fetchPendingLoan(env, token, userId) {
  const { data, error } = await selectRows(env, token, 'loan_requests', {
    select: 'id,status',
    user_id: `eq.${userId}`,
    status: 'eq.pending',
    limit: '1'
  });

  if (error) return { error };
  return { data: data && data[0] ? data[0] : null };
}

export async function insertLoanRequest(env, token, userId) {
  return insertRow(env, token, 'loan_requests', {
    user_id: userId,
    status: 'pending'
  });
}

export async function insertEvent(env, token, userId, type, detail) {
  return insertRow(env, token, 'profile_events', {
    user_id: userId,
    type,
    detail
  });
}

export async function fetchSystemFlags(env, token) {
  const { data, error } = await selectRows(env, token, 'system_flags', {
    select: 'key,value'
  });

  if (error) return { error };

  const flags = {};
  (data || []).forEach((row) => {
    if (row && row.key) {
      const value = row.value;
      if (value === 'true') {
        flags[row.key] = true;
      } else if (value === 'false') {
        flags[row.key] = false;
      } else {
        flags[row.key] = value;
      }
    }
  });

  return { data: flags };
}
