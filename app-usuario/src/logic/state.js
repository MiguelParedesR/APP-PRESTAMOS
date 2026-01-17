import { reactive } from 'vue';
import { createLoanRequest, fetchProfileEvents, fetchProfileState, signInWithPassword } from './api';

const TOKEN_KEY = 'cpc_token';

export const niveles = [
  { id: 1, label: 'Nivel 1', descripcion: 'Perfil en formacion' },
  { id: 2, label: 'Nivel 2', descripcion: 'Perfil consistente' },
  { id: 3, label: 'Nivel 3', descripcion: 'Perfil habilitado' }
];

export const session = reactive({
  token: localStorage.getItem(TOKEN_KEY),
  user: null,
  loading: false,
  error: null
});

export const profileState = reactive({
  loading: false,
  error: null,
  estadoPerfil: 'observacion',
  nivelActual: 1,
  progresoConducta: 0,
  perfilHabilitado: false,
  lastReviewAt: null,
  updatedAt: null
});

export const eventsState = reactive({
  loading: false,
  error: null,
  items: []
});

export const loanRequestState = reactive({
  submitting: false,
  error: null,
  success: null,
  pending: false,
  lastId: null
});

function syncPendingFromEvents(events) {
  if (!Array.isArray(events)) return;
  const hasPending = events.some((event) => event?.tipo === 'loan_request_created');
  if (hasPending) {
    loanRequestState.pending = true;
  }
}

export function clearSession() {
  session.token = null;
  session.user = null;
  session.error = null;
  localStorage.removeItem(TOKEN_KEY);
}

export async function signIn(email, password) {
  session.loading = true;
  session.error = null;
  const result = await signInWithPassword(email, password);
  session.loading = false;

  if (!result.ok) {
    session.error = result.error || 'auth_error';
    return result;
  }

  const token = result.data?.access_token;
  if (!token) {
    session.error = 'auth_error';
    return { ok: false, status: 500, error: 'auth_error' };
  }

  session.token = token;
  session.user = result.data?.user || null;
  localStorage.setItem(TOKEN_KEY, token);
  return { ok: true };
}

export async function loadProfileState() {
  if (!session.token) {
    profileState.error = 'missing_token';
    return { ok: false, status: 401, error: 'missing_token' };
  }

  profileState.loading = true;
  profileState.error = null;

  const result = await fetchProfileState(session.token);
  profileState.loading = false;

  if (!result.ok) {
    profileState.error = result.error || 'request_error';
    return result;
  }

  const data = result.data?.data;
  if (data) {
    profileState.estadoPerfil = data.estadoPerfil;
    profileState.nivelActual = data.nivelActual;
    profileState.progresoConducta = data.progresoConducta;
    profileState.perfilHabilitado = data.perfilHabilitado;
    profileState.lastReviewAt = data.lastReviewAt || null;
    profileState.updatedAt = data.updatedAt || null;
  }

  return result;
}

export async function loadProfileEvents() {
  if (!session.token) {
    eventsState.error = 'missing_token';
    return { ok: false, status: 401, error: 'missing_token' };
  }

  eventsState.loading = true;
  eventsState.error = null;

  const result = await fetchProfileEvents(session.token);
  eventsState.loading = false;

  if (!result.ok) {
    eventsState.error = result.error || 'request_error';
    return result;
  }

  eventsState.items = result.data?.data || [];
  syncPendingFromEvents(eventsState.items);
  return result;
}

export async function submitLoanRequest(amount, termMonths) {
  if (!session.token) {
    loanRequestState.error = 'missing_token';
    return { ok: false, status: 401, error: 'missing_token' };
  }

  if (!Number.isFinite(amount) || !Number.isFinite(termMonths)) {
    loanRequestState.error = 'invalid_payload';
    return { ok: false, status: 400, error: 'invalid_payload' };
  }

  loanRequestState.submitting = true;
  loanRequestState.error = null;
  loanRequestState.success = null;

  const result = await createLoanRequest(session.token, {
    monto: amount,
    plazo_meses: termMonths
  });

  loanRequestState.submitting = false;

  if (!result.ok) {
    loanRequestState.error = result.error || 'request_error';
    if (result.status === 409) {
      loanRequestState.pending = true;
    }
    return result;
  }

  loanRequestState.success = 'created';
  loanRequestState.pending = true;
  loanRequestState.lastId = result.data?.data?.id || null;
  return result;
}
