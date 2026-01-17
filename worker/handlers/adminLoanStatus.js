import { requireAuth } from '../lib/auth.js';
import {
  createLoanFromRequest,
  fetchLoanRequestById,
  insertAuditLog,
  insertEvent,
  isAdmin,
  updateLoanRequestStatus
} from '../lib/supabase.js';

const ACTIONS = {
  evaluate: {
    from: ['pendiente'],
    to: 'evaluacion',
    event: 'loan_under_review',
    detail: 'Solicitud en evaluacion'
  },
  approve: {
    from: ['evaluacion'],
    to: 'aprobada',
    event: 'loan_approved',
    detail: 'Solicitud aprobada'
  },
  reject: {
    from: ['evaluacion'],
    to: 'rechazada',
    event: 'loan_rejected',
    detail: 'Solicitud rechazada'
  }
};

const jsonResponse = (payload, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { 'content-type': 'application/json' }
  });

function extractErrorMessage(error) {
  if (!error) return null;
  const message = error.message;
  if (typeof message === 'string') return message;
  if (message && typeof message === 'object') {
    return message.message || message.error || message.code || null;
  }
  return null;
}

function parsePath(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length !== 4) return null;
  if (parts[0] !== 'admin' || parts[1] !== 'loan') return null;
  const loanId = parts[2];
  const action = parts[3];
  if (!loanId || !ACTIONS[action]) return null;
  return { loanId, action };
}

export async function adminLoanStatus(request, env) {
  const auth = await requireAuth(request, env);
  if (!auth.ok) {
    return jsonResponse({ status: 'error', error: auth.error }, auth.status);
  }

  const { pathname } = new URL(request.url);
  const parsed = parsePath(pathname);
  if (!parsed) {
    return jsonResponse({ status: 'error', error: 'not_found' }, 404);
  }

  const adminResult = await isAdmin(env, auth.token);
  if (adminResult.error || adminResult.data !== true) {
    return jsonResponse({ status: 'error', error: 'forbidden' }, 403);
  }

  const actionConfig = ACTIONS[parsed.action];
  const loanResult = await fetchLoanRequestById(env, auth.token, parsed.loanId);
  if (loanResult.error) {
    return jsonResponse({ status: 'error', error: 'supabase_error' }, loanResult.error.status || 500);
  }
  if (!loanResult.data) {
    return jsonResponse({ status: 'error', error: 'loan_not_found' }, 404);
  }

  const currentStatus = loanResult.data.estado;
  if (currentStatus === actionConfig.to) {
    return jsonResponse({ status: 'error', error: 'already_in_state' }, 409);
  }
  if (!actionConfig.from.includes(currentStatus)) {
    return jsonResponse({ status: 'error', error: 'invalid_transition' }, 409);
  }

  let responseStatus = 200;
  let responseData = { id: parsed.loanId, estado: actionConfig.to };

  if (parsed.action === 'approve') {
    const createResult = await createLoanFromRequest(env, auth.token, parsed.loanId);
    if (createResult.error) {
      const message = extractErrorMessage(createResult.error);
      if (message === 'loan_not_found') {
        return jsonResponse({ status: 'error', error: 'loan_not_found' }, 404);
      }
      if (message === 'already_has_loan' || message === 'invalid_state') {
        return jsonResponse({ status: 'error', error: message }, 409);
      }
      return jsonResponse({ status: 'error', error: 'supabase_error' }, createResult.error.status || 500);
    }
    const created = Array.isArray(createResult.data) ? createResult.data[0] : createResult.data;
    responseStatus = 201;
    responseData = {
      loan_id: created?.loan_id || null,
      installments_count: created?.installments_count ?? null
    };
  } else {
    const updateResult = await updateLoanRequestStatus(env, auth.token, parsed.loanId, actionConfig.to);
    if (updateResult.error) {
      return jsonResponse({ status: 'error', error: 'supabase_error' }, updateResult.error.status || 500);
    }
  }

  await insertAuditLog(env, auth.token, {
    actor: auth.payload?.email || auth.userId,
    accion: 'admin_change_loan_status',
    target_id: parsed.loanId,
    metadata: { from: currentStatus, to: actionConfig.to }
  }).catch(() => null);

  await insertEvent(env, auth.token, loanResult.data.user_id, actionConfig.event, actionConfig.detail, {
    loan_request_id: parsed.loanId
  }).catch(() => null);

  return jsonResponse({
    status: 'ok',
    data: responseData
  }, responseStatus);
}
