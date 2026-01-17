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

async function updateRow(env, token, table, params, body) {
  const url = buildUrl(env, table, params);
  if (!url) return { error: { status: 500, message: 'missing_supabase_env' } };
  return supabaseRequest(env, token, url, { method: 'PATCH', body, prefer: 'return=representation' });
}

async function callRpc(env, token, fnName, body = {}) {
  const baseUrl = getBaseUrl(env);
  if (!baseUrl) return { error: { status: 500, message: 'missing_supabase_env' } };
  const url = `${baseUrl}/rest/v1/rpc/${fnName}`;
  return supabaseRequest(env, token, url, { method: 'POST', body });
}

export async function fetchProfileState(env, token, userId) {
  const { data, error } = await selectRows(env, token, 'profile_state', {
    select: 'user_id,estado,nivel,progreso,habilitado,last_review_at,updated_at',
    user_id: `eq.${userId}`,
    limit: '1'
  });

  if (error) return { error };
  const row = data && data[0] ? data[0] : null;
  if (!row) return { data: null };

  return {
    data: {
      estadoPerfil: row.estado,
      nivelActual: row.nivel,
      progresoConducta: row.progreso,
      perfilHabilitado: row.habilitado,
      lastReviewAt: row.last_review_at,
      updatedAt: row.updated_at
    }
  };
}

export async function fetchProfileEvents(env, token, userId, limit = 20) {
  return selectRows(env, token, 'profile_events', {
    select: 'id,tipo,descripcion,metadata,created_at',
    user_id: `eq.${userId}`,
    order: 'created_at.desc',
    limit: String(limit)
  });
}

export async function fetchPendingLoan(env, token, userId) {
  const { data, error } = await selectRows(env, token, 'loan_requests', {
    select: 'id,estado',
    user_id: `eq.${userId}`,
    estado: 'in.(pendiente,evaluacion)',
    limit: '1'
  });

  if (error) return { error };
  return { data: data && data[0] ? data[0] : null };
}

export async function insertLoanRequest(env, token, userId, amount, termMonths) {
  return insertRow(env, token, 'loan_requests', {
    user_id: userId,
    monto_solicitado: amount,
    plazo_meses: termMonths,
    estado: 'pendiente'
  });
}

export async function insertEvent(env, token, userId, type, detail, metadata = {}) {
  return insertRow(env, token, 'profile_events', {
    user_id: userId,
    tipo: type,
    descripcion: detail,
    metadata
  });
}

export async function insertAuditLog(env, token, payload) {
  return insertRow(env, token, 'audit_logs', payload);
}

export async function isAdmin(env, token) {
  return callRpc(env, token, 'is_admin', {});
}

export async function createLoanFromRequest(env, token, loanRequestId) {
  return callRpc(env, token, 'create_loan_from_request', {
    loan_request_id: loanRequestId
  });
}

export async function fetchLoanRequestById(env, token, loanId) {
  const { data, error } = await selectRows(env, token, 'loan_requests', {
    select: 'id,user_id,monto_solicitado,plazo_meses,estado,created_at',
    id: `eq.${loanId}`,
    limit: '1'
  });

  if (error) return { error };
  return { data: data && data[0] ? data[0] : null };
}

export async function updateLoanRequestStatus(env, token, loanId, nextStatus) {
  return updateRow(env, token, 'loan_requests', { id: `eq.${loanId}` }, { estado: nextStatus });
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
