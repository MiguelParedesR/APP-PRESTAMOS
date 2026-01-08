<template>
  <section class="space-y-6">
    <div class="space-y-2">
      <h2 class="text-2xl font-semibold text-slate-900">Panel de conducta</h2>
      <p class="text-sm text-slate-600">Estado interno y reputacion en seguimiento. Sin datos financieros.</p>
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
        <ProgressBar :value="state.progresoConducta" :max="100" label="Progreso" />
        <p class="mt-3 text-sm text-slate-500">Avance registrado. Historial en formacion.</p>
      </Card>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <Card title="Mensaje del sistema">
        <p class="text-sm text-slate-600">{{ estadoConfig.mensaje }}</p>
      </Card>

      <Card title="Simulacion referencial" :class="{ 'opacity-70': isFrozen }">
        <div class="space-y-3">
          <div class="flex items-center justify-between text-sm text-slate-600">
            <span>Estado</span>
            <span class="font-semibold text-slate-800">{{ simulacionEstado }}</span>
          </div>
          <p class="text-sm text-slate-500">Rango indicativo: S/ 300 - S/ 1200.</p>
          <p class="text-sm text-slate-500">
            Segun tu estado actual, el sistema aun no habilita simulaciones finales.
          </p>
          <button
            type="button"
            class="btn btn-secondary w-full"
            :disabled="isFrozen || !state.perfilHabilitado"
          >
            {{ accionLabel }}
          </button>
        </div>
      </Card>
    </div>

    <Card title="Actividad reciente">
      <p class="text-sm text-slate-600">Aun no hay eventos registrados. Tu historial se ira completando.</p>
    </Card>

    <Card v-if="isFrozen" title="Aviso">
      <p class="text-sm text-slate-600">
        Tu perfil se encuentra temporalmente congelado para revision interna.
      </p>
    </Card>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import Card from '../components/Card.vue';
import ProgressBar from '../components/ProgressBar.vue';
import { state, niveles } from '../logic/state';

const nivel = computed(() => niveles.find((item) => item.id === state.nivelActual) || niveles[0]);

const estadoConfig = computed(() => {
  switch (state.estadoPerfil) {
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

const isFrozen = computed(() => state.estadoPerfil === 'congelado');

const simulacionEstado = computed(() => {
  if (isFrozen.value) return 'No habilitado';
  return state.perfilHabilitado ? 'En evaluacion' : 'No habilitado';
});

const accionLabel = computed(() => {
  if (isFrozen.value) return 'Interacciones limitadas';
  return state.perfilHabilitado ? 'Revisar estado de simulacion' : 'Simulacion no habilitada';
});
</script>
