import { checkIsAdmin, insertAuditLog, refreshSession, signOut } from '../services/supabase';

const STORAGE_KEY = 'cpc_admin_session';

function nowSeconds() {
  return Math.floor(Date.now() / 1000);
}

export function getStoredSession() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveSession(session) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
}

async function ensureFreshSession() {
  const session = getStoredSession();
  if (!session) return { ok: false, reason: 'missing_session' };
  if (!session.expires_at || session.expires_at > nowSeconds() + 30) {
    return { ok: true, session };
  }

  if (!session.refresh_token) {
    clearSession();
    return { ok: false, reason: 'expired' };
  }

  const refresh = await refreshSession(session.refresh_token);
  if (!refresh.ok) {
    clearSession();
    return { ok: false, reason: 'expired' };
  }

  const next = {
    access_token: refresh.data.access_token,
    refresh_token: refresh.data.refresh_token || session.refresh_token,
    expires_at: nowSeconds() + (refresh.data.expires_in || 0),
    user: refresh.data.user || session.user
  };
  saveSession(next);
  return { ok: true, session: next };
}

export async function getValidSession() {
  return ensureFreshSession();
}

export async function requireAdmin() {
  const sessionResult = await ensureFreshSession();
  if (!sessionResult.ok) return sessionResult;

  const { session } = sessionResult;
  if (!session.user?.id) {
    await signOut(session.access_token, session.refresh_token);
    clearSession();
    return { ok: false, reason: 'profile_unavailable' };
  }
  const adminResult = await checkIsAdmin(session.access_token);
  if (!adminResult.ok) {
    await signOut(session.access_token, session.refresh_token);
    clearSession();
    return { ok: false, reason: 'profile_unavailable' };
  }

  const isAdmin = adminResult.data === true;
  if (!isAdmin) {
    await insertAuditLog(session.access_token, {
      actor: session.user?.email || session.user?.id || 'unknown',
      accion: 'admin_access_denied',
      target_id: session.user?.id || null,
      metadata: { source: 'app-admin' }
    });
    await signOut(session.access_token, session.refresh_token);
    clearSession();
    return { ok: false, reason: 'unauthorized' };
  }

  return { ok: true, session };
}

export async function recordAdminLogin(session) {
  if (!session?.access_token) return;
  await insertAuditLog(session.access_token, {
    actor: session.user?.email || session.user?.id || 'unknown',
    accion: 'admin_login',
    target_id: session.user?.id || null,
    metadata: { source: 'app-admin' }
  });
}
