<template>
  <section class="space-y-6">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Resumen operativo</p>
        <h2 class="mt-2 text-2xl font-semibold text-slate-900">Dashboard</h2>
        <p class="mt-2 text-sm text-slate-600">Indicadores clave para decisiones rapidas.</p>
      </div>
      <div class="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs text-slate-600">
        <span class="h-1.5 w-1.5 rounded-full" :class="statusDotClass"></span>
        {{ statusLabel }}
      </div>
    </header>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Solicitudes hoy</p>
        <p class="mt-3 text-3xl font-semibold text-slate-900">{{ todayCount }}</p>
        <p class="mt-2 text-xs text-slate-500">Base actual</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p class="text-xs uppercase tracking-[0.3em] text-slate-500">En evaluacion</p>
        <p class="mt-3 text-3xl font-semibold text-slate-900">{{ evaluacionCount }}</p>
        <p class="mt-2 text-xs text-slate-500">Cola actual</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Aprobadas</p>
        <p class="mt-3 text-3xl font-semibold text-slate-900">{{ aprobadaCount }}</p>
        <p class="mt-2 text-xs text-slate-500">Tasa {{ approvalRate }}%</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Antiguedad media</p>
        <p class="mt-3 text-3xl font-semibold text-slate-900">{{ avgAgeLabel }}</p>
        <p class="mt-2 text-xs text-slate-500">Desde creacion</p>
      </div>
    </div>

    <div class="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Flujo por estado</p>
        <div class="mt-4 space-y-4 text-sm text-slate-600">
          <div>
            <div class="flex items-center justify-between">
              <span>Pendiente</span>
              <span class="text-slate-900">{{ pendingPercent }}%</span>
            </div>
            <div class="mt-2 h-2 w-full rounded-full bg-slate-100">
              <div class="h-2 rounded-full bg-slate-900" :style="{ width: `${pendingPercent}%` }"></div>
            </div>
          </div>
          <div>
            <div class="flex items-center justify-between">
              <span>Evaluacion</span>
              <span class="text-slate-900">{{ evaluacionPercent }}%</span>
            </div>
            <div class="mt-2 h-2 w-full rounded-full bg-slate-100">
              <div class="h-2 rounded-full bg-slate-700" :style="{ width: `${evaluacionPercent}%` }"></div>
            </div>
          </div>
          <div>
            <div class="flex items-center justify-between">
              <span>Aprobadas</span>
              <span class="text-slate-900">{{ aprobadaPercent }}%</span>
            </div>
            <div class="mt-2 h-2 w-full rounded-full bg-slate-100">
              <div class="h-2 rounded-full bg-emerald-600" :style="{ width: `${aprobadaPercent}%` }"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Alertas del sistema</p>
        <div class="mt-4 space-y-3 text-sm text-slate-600">
          <div class="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
            {{ stalePendingLabel }}
          </div>
          <div class="rounded-xl border border-slate-200 bg-white px-3 py-2">
            Evaluaciones activas: {{ evaluacionCount }}
          </div>
          <div class="rounded-xl border border-slate-200 bg-white px-3 py-2">
            Rechazadas: {{ rechazadaCount }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { listLoanRequests } from '../services/adminApi';

const loading = ref(false);
const errorMessage = ref('');
const requests = ref([]);

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

const pendingCount = computed(
  () => requests.value.filter((item) => item.estado === 'pendiente').length
);
const evaluacionCount = computed(
  () => requests.value.filter((item) => item.estado === 'evaluacion').length
);
const aprobadaCount = computed(
  () => requests.value.filter((item) => item.estado === 'aprobada').length
);
const rechazadaCount = computed(
  () => requests.value.filter((item) => item.estado === 'rechazada').length
);

const totalCount = computed(() => requests.value.length);

const approvalRate = computed(() => {
  if (!totalCount.value) return 0;
  return Math.round((aprobadaCount.value / totalCount.value) * 100);
});

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

const percentFromTotal = (count) => {
  if (!totalCount.value) return 0;
  return Math.round((count / totalCount.value) * 100);
};

const pendingPercent = computed(() => percentFromTotal(pendingCount.value));
const evaluacionPercent = computed(() => percentFromTotal(evaluacionCount.value));
const aprobadaPercent = computed(() => percentFromTotal(aprobadaCount.value));

const stalePendingCount = computed(() => {
  const now = Date.now();
  return requests.value.filter((item) => {
    if (item.estado !== 'pendiente') return false;
    const createdAt = parseDate(item.created_at);
    if (!createdAt) return false;
    const hours = (now - createdAt.getTime()) / 36e5;
    return hours >= 48;
  }).length;
});

const stalePendingLabel = computed(() => {
  if (stalePendingCount.value === 0) {
    return 'No hay pendientes mayores a 48h.';
  }
  return `${stalePendingCount.value} solicitudes pendientes mayores a 48h.`;
});

const statusLabel = computed(() => {
  if (loading.value) return 'Cargando datos';
  if (errorMessage.value) return 'Sin datos';
  if (!requests.value.length) return 'Sin solicitudes';
  return 'Flujo activo';
});

const statusDotClass = computed(() => {
  if (loading.value) return 'bg-amber-500';
  if (errorMessage.value) return 'bg-rose-500';
  if (!requests.value.length) return 'bg-slate-400';
  return 'bg-emerald-500';
});

async function loadRequests() {
  loading.value = true;
  errorMessage.value = '';
  const result = await listLoanRequests();
  if (!result.ok) {
    errorMessage.value = 'No se pudo cargar la data.';
    loading.value = false;
    return;
  }
  requests.value = Array.isArray(result.data) ? result.data : [];
  loading.value = false;
}

onMounted(loadRequests);
</script>
