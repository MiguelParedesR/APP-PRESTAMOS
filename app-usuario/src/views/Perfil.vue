<template>
  <section class="space-y-6">
    <div>
      <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Perfil</p>
      <h2 class="mt-2 text-2xl font-semibold text-slate-900">Resumen personal</h2>
      <p class="text-sm text-slate-600">Vista base del perfil, sin datos reales.</p>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <Card title="Identidad">
        <p class="text-sm text-slate-600">Datos personales se cargaran en fases futuras.</p>
        <div class="mt-4 space-y-2 text-xs text-slate-500">
          <div class="flex items-center justify-between">
            <span>Registro basico</span>
            <span class="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] uppercase tracking-wide text-emerald-700">
              Completo
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span>Validacion documental</span>
            <span class="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] uppercase tracking-wide text-amber-700">
              Pendiente
            </span>
          </div>
        </div>
      </Card>
      <Card title="Conducta">
        <p class="text-sm text-slate-600">Espacio reservado para reputacion y reglas.</p>
        <div class="mt-4 space-y-2 text-xs text-slate-500">
          <div class="flex items-center justify-between">
            <span>Eventos positivos</span>
            <span class="text-slate-700">En seguimiento</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Alertas activas</span>
            <span class="text-slate-700">0</span>
          </div>
        </div>
      </Card>
      <Card title="Actividad reciente">
        <p class="text-sm text-slate-600">Aun no hay eventos registrados en tu perfil.</p>
        <p class="mt-3 text-xs text-slate-500">El sistema mostrara aqui los ultimos registros.</p>
      </Card>
      <Card title="Checklist de avance">
        <div class="space-y-3 text-sm text-slate-600">
          <div class="flex items-center justify-between">
            <span>Completar datos base</span>
            <span class="text-slate-900">Listo</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Registrar 3 eventos</span>
            <span class="text-slate-900">En progreso</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Evaluacion de conducta</span>
            <span class="text-slate-900">Pendiente</span>
          </div>
        </div>
      </Card>
    </div>
  </section>
</template>

<script setup>
import Card from '../components/Card.vue';
</script>
