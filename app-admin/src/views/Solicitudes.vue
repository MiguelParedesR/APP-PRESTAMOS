<template>
  <section class="space-y-6">
    <header class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Gestion</p>
        <h2 class="mt-2 text-2xl font-semibold text-slate-900">Solicitudes</h2>
        <p class="mt-2 text-sm text-slate-600">Bandeja de solicitudes recientes.</p>
      </div>
      <div class="flex items-center gap-2">
        <label class="text-xs uppercase tracking-wide text-slate-500" for="status-filter">Estado</label>
        <select
          id="status-filter"
          v-model="statusFilter"
          class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
        >
          <option value="todos">Todos</option>
          <option value="pendiente">Pendiente</option>
          <option value="evaluacion">Evaluacion</option>
          <option value="aprobada">Aprobada</option>
          <option value="rechazada">Rechazada</option>
        </select>
      </div>
    </header>

    <div class="grid gap-4 md:grid-cols-3">
      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Entrantes hoy</p>
        <p class="mt-3 text-2xl font-semibold text-slate-900">{{ todayCount }}</p>
        <p class="mt-2 text-xs text-slate-500">Base actual</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p class="text-xs uppercase tracking-[0.3em] text-slate-500">En evaluacion</p>
        <p class="mt-3 text-2xl font-semibold text-slate-900">{{ evaluacionCount }}</p>
        <p class="mt-2 text-xs text-slate-500">Cola actual</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Antiguedad media</p>
        <p class="mt-3 text-2xl font-semibold text-slate-900">{{ avgAgeLabel }}</p>
        <p class="mt-2 text-xs text-slate-500">Desde creacion</p>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <div class="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-100 px-6 py-4 text-sm font-semibold text-slate-700">
          Listado
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full text-left text-sm">
            <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th class="px-6 py-3">Fecha</th>
                <th class="px-6 py-3">Usuario</th>
                <th class="px-6 py-3">Monto</th>
                <th class="px-6 py-3">Plazo</th>
                <th class="px-6 py-3">Estado</th>
                <th class="px-6 py-3">Accion</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="6" class="px-6 py-6 text-sm text-slate-500">Cargando solicitudes...</td>
              </tr>
              <tr v-else-if="errorMessage">
                <td colspan="6" class="px-6 py-6 text-sm text-amber-700">{{ errorMessage }}</td>
              </tr>
              <tr v-else-if="filteredRequests.length === 0">
                <td colspan="6" class="px-6 py-6 text-sm text-slate-500">Sin solicitudes.</td>
              </tr>
              <tr
                v-for="request in filteredRequests"
                :key="request.id"
                class="cursor-pointer border-t border-slate-100 transition hover:bg-slate-50"
                @click="openDetail(request)"
              >
                <td class="px-6 py-4 text-slate-600">{{ formatDate(request.created_at) }}</td>
                <td class="px-6 py-4 text-slate-700">{{ request.user_id }}</td>
                <td class="px-6 py-4 text-slate-700">{{ formatCurrency(request.monto_solicitado) }}</td>
                <td class="px-6 py-4 text-slate-600">{{ request.plazo_meses }} meses</td>
                <td class="px-6 py-4">
                  <span :class="statusBadgeClass(request.estado)">{{ request.estado }}</span>
                </td>
                <td class="px-6 py-4">
                  <button
                    class="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:bg-slate-100"
                    @click.stop="openDetail(request)"
                  >
                    Ver
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <aside class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
        <div v-if="!selectedRequest" class="space-y-2 text-sm text-slate-500">
          <p>Selecciona una solicitud para ver el detalle.</p>
        </div>

        <div v-else class="space-y-6">
          <div>
            <p class="text-xs uppercase tracking-wide text-slate-500">Solicitud</p>
            <h3 class="mt-2 text-lg font-semibold text-slate-900">Detalle</h3>
          </div>

          <div class="space-y-2 text-sm text-slate-700">
            <div class="flex justify-between">
              <span class="text-slate-500">ID</span>
              <span class="text-right text-xs text-slate-600">{{ selectedRequest.id }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Usuario</span>
              <span class="text-right text-xs text-slate-600">{{ selectedRequest.user_id }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Monto</span>
              <span>{{ formatCurrency(selectedRequest.monto_solicitado) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Plazo</span>
              <span>{{ selectedRequest.plazo_meses }} meses</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Estado</span>
              <span :class="statusBadgeClass(selectedRequest.estado)">{{ selectedRequest.estado }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Creada</span>
              <span>{{ formatDate(selectedRequest.created_at) }}</span>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <p class="text-xs uppercase tracking-wide text-slate-500">Contexto conductual</p>
              <span v-if="detailLoading" class="text-xs text-slate-400">Cargando...</span>
            </div>
            <p v-if="detailError" class="text-sm text-amber-700">{{ detailError }}</p>

            <div v-if="!detailLoading && userState" class="space-y-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm">
              <div class="flex justify-between">
                <span class="text-slate-500">Estado perfil</span>
                <span class="text-slate-700">{{ userState.estado }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Nivel</span>
                <span class="text-slate-700">{{ userState.nivel }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Progreso</span>
                <span class="text-slate-700">{{ userState.progreso }}%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Habilitado</span>
                <span class="text-slate-700">{{ userState.habilitado ? 'Si' : 'No' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Revision</span>
                <span class="text-slate-700">{{ formatDate(userState.last_review_at) }}</span>
              </div>
            </div>
          </div>

          <div v-if="!detailLoading" class="space-y-3">
            <p class="text-xs uppercase tracking-wide text-slate-500">Eventos recientes</p>
            <div v-if="userEvents.length === 0" class="text-sm text-slate-500">
              Sin eventos disponibles.
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="event in userEvents"
                :key="event.id"
                class="rounded-xl border border-slate-100 bg-white px-4 py-3 text-sm"
              >
                <div class="flex items-center justify-between text-xs text-slate-400">
                  <span>{{ event.tipo }}</span>
                  <span>{{ formatDate(event.created_at, true) }}</span>
                </div>
                <p class="mt-2 text-sm text-slate-700">{{ event.descripcion }}</p>
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <p class="text-xs uppercase tracking-wide text-slate-500">Acciones</p>
            <p v-if="actionMessage" class="text-sm text-slate-600">{{ actionMessage }}</p>
            <p v-if="actionError" class="text-sm text-amber-700">{{ actionError }}</p>
            <p v-if="actionLoading" class="text-sm text-slate-500">Actualizando estado...</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-if="selectedRequest.estado === 'pendiente'"
                class="rounded-lg border border-slate-200 bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-slate-800 disabled:opacity-60"
                :disabled="actionLoading"
                @click="updateStatus('evaluate')"
              >
                Pasar a evaluacion
              </button>
              <button
                v-if="selectedRequest.estado === 'evaluacion'"
                class="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-60"
                :disabled="actionLoading"
                @click="updateStatus('approve')"
              >
                Aprobar
              </button>
              <button
                v-if="selectedRequest.estado === 'evaluacion'"
                class="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-rose-700 transition hover:bg-rose-100 disabled:opacity-60"
                :disabled="actionLoading"
                @click="updateStatus('reject')"
              >
                Rechazar
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { changeLoanStatus, getUserState, listLoanRequests, listUserEvents, logAdminAction } from '../services/adminApi';

const loading = ref(false);
const errorMessage = ref('');
const requests = ref([]);
const statusFilter = ref('todos');

const selectedRequest = ref(null);
const detailLoading = ref(false);
const detailError = ref('');
const userState = ref(null);
const userEvents = ref([]);
const actionLoading = ref(false);
const actionError = ref('');
const actionMessage = ref('');

const filteredRequests = computed(() => {
  if (statusFilter.value === 'todos') return requests.value;
  return requests.value.filter((item) => item.estado === statusFilter.value);
});

const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
};

const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const todayCount = computed(() => {
  const today = new Date();
  return requests.value.filter((item) => {
    const createdAt = parseDate(item.created_at);
    return createdAt && isSameDay(createdAt, today);
  }).length;
});

const evaluacionCount = computed(
  () => requests.value.filter((item) => item.estado === 'evaluacion').length
);

const avgAgeHours = computed(() => {
  if (!requests.value.length) return 0;
  const now = Date.now();
  const ages = requests.value
    .map((item) => {
      const createdAt = parseDate(item.created_at);
      if (!createdAt) return null;
      return (now - createdAt.getTime()) / 36e5;
    })
    .filter((value) => value !== null);
  if (!ages.length) return 0;
  const avg = ages.reduce((sum, value) => sum + value, 0) / ages.length;
  return Math.round(avg * 10) / 10;
});

const avgAgeLabel = computed(() => `${avgAgeHours.value.toFixed(1)}h`);

function formatDate(value, withTime = false) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: withTime ? '2-digit' : undefined,
    minute: withTime ? '2-digit' : undefined
  });
}

function formatCurrency(value) {
  const amount = Number(value);
  if (Number.isNaN(amount)) return '-';
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    maximumFractionDigits: 0
  }).format(amount);
}

function statusBadgeClass(status) {
  const base =
    'rounded-full border px-2 py-1 text-[10px] uppercase tracking-wide';
  switch (status) {
    case 'pendiente':
      return `${base} border-amber-200 bg-amber-50 text-amber-700`;
    case 'evaluacion':
      return `${base} border-sky-200 bg-sky-50 text-sky-700`;
    case 'aprobada':
      return `${base} border-emerald-200 bg-emerald-50 text-emerald-700`;
    case 'rechazada':
      return `${base} border-rose-200 bg-rose-50 text-rose-700`;
    default:
      return `${base} border-slate-200 bg-slate-50 text-slate-600`;
  }
}

async function loadRequests() {
  loading.value = true;
  errorMessage.value = '';
  const result = await listLoanRequests();
  if (!result.ok) {
    errorMessage.value = 'No se pudo cargar la bandeja.';
    loading.value = false;
    return;
  }
  requests.value = result.data || [];
  loading.value = false;
}

async function openDetail(request) {
  selectedRequest.value = request;
  actionError.value = '';
  actionMessage.value = '';

  await logAdminAction({
    accion: 'admin_open_loan_request',
    target_id: request.id,
    metadata: {
      user_id: request.user_id,
      estado: request.estado,
      monto_solicitado: request.monto_solicitado,
      plazo_meses: request.plazo_meses
    }
  });

  await loadDetailData(request);
}

async function loadDetailData(request) {
  detailLoading.value = true;
  detailError.value = '';
  userState.value = null;
  userEvents.value = [];

  const [stateResult, eventsResult] = await Promise.all([
    getUserState(request.user_id),
    listUserEvents(request.user_id)
  ]);

  if (!stateResult.ok) {
    detailError.value = 'No se pudo cargar el contexto conductual.';
  } else {
    userState.value = stateResult.data?.[0] || null;
  }

  if (!eventsResult.ok) {
    detailError.value = detailError.value || 'No se pudo cargar los eventos.';
  } else {
    userEvents.value = eventsResult.data || [];
  }

  detailLoading.value = false;
}

function statusFromAction(action) {
  if (action === 'evaluate') return 'evaluacion';
  if (action === 'approve') return 'aprobada';
  if (action === 'reject') return 'rechazada';
  return '';
}

async function updateStatus(action) {
  if (!selectedRequest.value) return;
  actionLoading.value = true;
  actionError.value = '';
  actionMessage.value = '';

  const result = await changeLoanStatus(selectedRequest.value.id, action);
  if (!result.ok) {
    actionError.value = 'No se pudo actualizar el estado.';
    actionLoading.value = false;
    return;
  }

  const nextStatus = result.data?.data?.estado || statusFromAction(action);
  selectedRequest.value = { ...selectedRequest.value, estado: nextStatus };
  requests.value = requests.value.map((item) =>
    item.id === selectedRequest.value.id ? { ...item, estado: nextStatus } : item
  );
  actionMessage.value = action === 'approve' ? 'Prestamo creado correctamente.' : 'Estado actualizado.';
  await loadDetailData(selectedRequest.value);
  actionLoading.value = false;
}

onMounted(loadRequests);
</script>
