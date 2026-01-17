<template>
  <section class="space-y-6">
    <div class="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end">
      <div class="space-y-2">
        <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Panel de conducta</p>
        <h2 class="text-2xl font-semibold text-slate-900">Estado interno y reputacion en seguimiento.</h2>
        <p class="text-sm text-slate-600">Sin datos financieros. Solo constancia y registro.</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white/90 p-4 text-sm text-slate-600 shadow-sm">
        <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Siguiente hito</p>
        <p class="mt-2 text-sm text-slate-700">Completar 3 eventos positivos para subir de nivel.</p>
        <div class="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          Ritmo recomendado: 1 evento por semana
        </div>
      </div>
    </div>

    <div
      v-if="profileState.loading"
      class="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-600"
    >
      Cargando estado del perfil...
    </div>
    <div
      v-else-if="profileErrorMessage"
      class="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700"
    >
      {{ profileErrorMessage }}
    </div>

    <div class="grid gap-4 lg:grid-cols-3">
      <Card title="Estado del perfil">
        <div class="flex items-center justify-between">
          <span class="text-sm text-slate-700">{{ estadoConfig.label }}</span>
          <span :class="estadoConfig.badgeClass">{{ estadoConfig.badge }}</span>
        </div>
        <p class="mt-3 text-sm text-slate-500">{{ estadoConfig.detail }}</p>
      </Card>

      <Card title="Nivel actual">
        <p class="text-3xl font-semibold text-slate-900">{{ nivel.label }}</p>
        <p class="mt-2 text-sm text-slate-500">{{ nivel.descripcion }}</p>
      </Card>

      <Card title="Progreso de conducta">
        <ProgressBar :value="profileState.progresoConducta" :max="100" label="Progreso" />
        <p class="mt-3 text-sm text-slate-500">Avance registrado. Historial en formacion.</p>
      </Card>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <Card title="Mensaje del sistema">
        <p class="text-sm text-slate-600">{{ estadoConfig.mensaje }}</p>
      </Card>

      <Card title="Solicitud de evaluacion" :class="{ 'opacity-70': isFrozen || loanRequestState.pending }">
        <form class="space-y-3" @submit.prevent="handleSubmitLoan">
          <div class="grid gap-3 sm:grid-cols-2">
            <div>
              <label class="text-xs uppercase tracking-wide text-slate-500" for="loan-amount">Monto</label>
              <input
                id="loan-amount"
                v-model.number="amount"
                class="input-field mt-2"
                type="number"
                min="0"
                step="1"
                inputmode="numeric"
                placeholder="500"
              />
            </div>
            <div>
              <label class="text-xs uppercase tracking-wide text-slate-500" for="loan-term">Plazo (meses)</label>
              <input
                id="loan-term"
                v-model.number="termMonths"
                class="input-field mt-2"
                type="number"
                min="1"
                step="1"
                inputmode="numeric"
                placeholder="6"
              />
            </div>
          </div>
          <p class="text-sm text-slate-500">
            Esta solicitud inicia una revision interna. El sistema respondera con calma.
          </p>
          <p
            v-if="loanMessage"
            class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"
          >
            {{ loanMessage }}
          </p>
          <button type="submit" class="btn btn-primary w-full" :disabled="loanDisabled">
            {{ loanButtonLabel }}
          </button>
        </form>
      </Card>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <Card title="Indicadores de constancia">
        <div class="space-y-3 text-sm text-slate-600">
          <div class="flex items-center justify-between">
            <span>Registro semanal</span>
            <span class="text-slate-900">Estable</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Eventos positivos</span>
            <span class="text-slate-900">En progreso</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Alertas recientes</span>
            <span class="text-slate-900">0</span>
          </div>
        </div>
      </Card>

      <Card title="Actividad reciente">
        <p v-if="eventsState.loading" class="text-sm text-slate-600">Cargando historial...</p>
        <p v-else-if="eventsErrorMessage" class="text-sm text-amber-700">{{ eventsErrorMessage }}</p>
        <div v-else-if="eventsState.items.length" class="space-y-4">
          <div
            v-for="event in eventsState.items"
            :key="event.id"
            class="border-l border-slate-200 pl-4"
          >
            <div class="flex items-center justify-between text-sm text-slate-600">
              <span class="font-medium text-slate-800">{{ event.tipo }}</span>
              <span class="text-xs text-slate-400">{{ formatDate(event.created_at) }}</span>
            </div>
            <p class="mt-1 text-sm text-slate-500">{{ event.descripcion }}</p>
          </div>
        </div>
        <p v-else class="text-sm text-slate-600">
          Aun no hay eventos registrados. Tu historial se ira completando.
        </p>
      </Card>
    </div>

    <Card v-if="isFrozen" title="Aviso">
      <p class="text-sm text-slate-600">
        Tu perfil se encuentra temporalmente congelado para revision interna.
      </p>
    </Card>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import Card from '../components/Card.vue';
import ProgressBar from '../components/ProgressBar.vue';
import {
  eventsState,
  loanRequestState,
  loadProfileEvents,
  loadProfileState,
  niveles,
  profileState,
  session,
  submitLoanRequest
} from '../logic/state';

const amount = ref(500);
const termMonths = ref(6);

const nivel = computed(
  () => niveles.find((item) => item.id === profileState.nivelActual) || niveles[0]
);

const estadoConfig = computed(() => {
  switch (profileState.estadoPerfil) {
    case 'activo':
      return {
        label: 'Activo',
        badge: 'Activo',
        badgeClass:
          'rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] uppercase tracking-wide text-emerald-700',
        detail: 'Perfil activo con seguimiento continuo.',
        mensaje: 'El sistema registra tu conducta y mantiene el historial disponible.'
      };
    case 'congelado':
      return {
        label: 'Congelado',
        badge: 'Congelado',
        badgeClass:
          'rounded-full border border-rose-200 bg-rose-50 px-2 py-1 text-[10px] uppercase tracking-wide text-rose-700',
        detail: 'Actividad limitada por revision interna.',
        mensaje: 'Tu perfil se encuentra temporalmente congelado para revision interna.'
      };
    default:
      return {
        label: 'En observacion',
        badge: 'Observacion',
        badgeClass:
          'rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] uppercase tracking-wide text-amber-700',
        detail: 'El sistema observa tu constancia.',
        mensaje: 'Perfil en evaluacion. El sistema recuerda tu comportamiento.'
      };
  }
});

const isFrozen = computed(() => profileState.estadoPerfil === 'congelado');

const profileErrorMessage = computed(() => {
  if (!profileState.error) return '';
  switch (profileState.error) {
    case 'missing_token':
      return 'Necesitas iniciar sesion para cargar tu estado.';
    case 'invalid_token':
      return 'La sesion no es valida. Vuelve a ingresar.';
    case 'profile_state_not_found':
      return 'Estado no inicializado. El sistema aun no registra tu perfil.';
    default:
      return 'No se pudo cargar el estado del perfil.';
  }
});

const eventsErrorMessage = computed(() => {
  if (!eventsState.error) return '';
  if (eventsState.error === 'missing_token') return 'Necesitas iniciar sesion para ver el historial.';
  return 'No se pudo cargar el historial.';
});

const loanMessage = computed(() => {
  if (loanRequestState.success) {
    return 'Solicitud registrada. El sistema revisara tu caso y te avisara.';
  }
  switch (loanRequestState.error) {
    case 'loans_disabled':
      return 'El sistema no habilita solicitudes en este momento.';
    case 'profile_frozen':
      return 'Tu perfil esta congelado. No se admiten solicitudes.';
    case 'loan_request_already_exists':
      return 'Ya tienes una evaluacion en curso. Espera la resolucion del sistema.';
    case 'invalid_payload':
      return 'Revisa el monto y el plazo antes de enviar.';
    case 'missing_token':
      return 'Necesitas iniciar sesion para solicitar evaluacion.';
    default:
      return loanRequestState.error ? 'No se pudo enviar la solicitud.' : '';
  }
});

const loanDisabled = computed(
  () => isFrozen.value || loanRequestState.pending || loanRequestState.submitting
);

const loanButtonLabel = computed(() => {
  if (loanRequestState.submitting) return 'Enviando...';
  if (loanRequestState.pending) return 'Evaluacion en curso';
  return 'Solicitar evaluacion';
});

const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return date.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const handleSubmitLoan = async () => {
  if (loanDisabled.value) return;
  await submitLoanRequest(amount.value, termMonths.value);
  await loadProfileEvents();
};

onMounted(async () => {
  if (session.token) {
    await loadProfileState();
    await loadProfileEvents();
  } else {
    profileState.error = 'missing_token';
    eventsState.error = 'missing_token';
  }
});
</script>
