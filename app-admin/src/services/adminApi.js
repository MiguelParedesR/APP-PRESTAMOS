import { getValidSession } from '../state/auth';
import { insertAuditLog, supabaseRest } from './supabase';

const WORKER_URL = import.meta.env.VITE_WORKER_URL || 'http://127.0.0.1:8787';

async function getSession() {
  const result = await getValidSession();
  if (!result.ok) {
    return { ok: false, error: result.reason || 'missing_session' };
  }
  return { ok: true, session: result.session };
}

export async function listLoanRequests() {
  const sessionResult = await getSession();
  if (!sessionResult.ok) return sessionResult;
  const query = new URLSearchParams({
    select: 'id,user_id,monto_solicitado,plazo_meses,estado,created_at',
    order: 'created_at.desc',
    limit: '50'
  });
  return supabaseRest(`/rest/v1/loan_requests?${query.toString()}`, sessionResult.session.access_token);
}

export async function listUsers() {
  const sessionResult = await getSession();
  if (!sessionResult.ok) return sessionResult;
  const query = new URLSearchParams({
    select: '*',
    order: 'id.asc',
    limit: '100'
  });
  return supabaseRest(`/rest/v1/profiles?${query.toString()}`, sessionResult.session.access_token);
}

export async function getUserState(userId) {
  const sessionResult = await getSession();
  if (!sessionResult.ok) return sessionResult;
  const query = new URLSearchParams({
    select: 'user_id,estado,nivel,progreso,habilitado,last_review_at,updated_at',
    user_id: `eq.${userId}`,
    limit: '1'
  });
  return supabaseRest(`/rest/v1/profile_state?${query.toString()}`, sessionResult.session.access_token);
}

export async function listUserEvents(userId) {
  const sessionResult = await getSession();
  if (!sessionResult.ok) return sessionResult;
  const query = new URLSearchParams({
    select: 'id,tipo,descripcion,metadata,created_at',
    user_id: `eq.${userId}`,
    order: 'created_at.desc',
    limit: '20'
  });
  return supabaseRest(`/rest/v1/profile_events?${query.toString()}`, sessionResult.session.access_token);
}

export async function logAdminAction({ accion, target_id, metadata }) {
  const sessionResult = await getSession();
  if (!sessionResult.ok) return sessionResult;
  const actor = sessionResult.session.user?.email || sessionResult.session.user?.id || 'unknown';
  return insertAuditLog(sessionResult.session.access_token, {
    actor,
    accion,
    target_id,
    metadata
  });
}

async function workerRequest(path, token) {
  let response;
  try {
    response = await fetch(`${WORKER_URL}${path}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  } catch {
    return { ok: false, status: 0, error: 'network_error' };
  }

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
    return { ok: false, status: response.status, error: data?.error || 'request_error' };
  }

  return { ok: true, status: response.status, data };
}

export async function changeLoanStatus(loanId, action) {
  const sessionResult = await getSession();
  if (!sessionResult.ok) return sessionResult;
  return workerRequest(`/admin/loan/${loanId}/${action}`, sessionResult.session.access_token);
}
