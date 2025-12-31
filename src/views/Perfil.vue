<template>
  <section class="space-y-6">
    <div>
      <h2 class="text-2xl font-semibold text-slate-900">Perfil</h2>
      <p class="text-sm text-slate-600">Vista base del perfil, sin datos reales.</p>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <Card title="Identidad">
        <p class="text-sm text-slate-600">Datos personales se cargaran en fases futuras.</p>
      </Card>
      <Card title="Conducta">
        <p class="text-sm text-slate-600">Espacio reservado para reputacion y reglas.</p>
      </Card>
    </div>
  </section>
</template>

<script setup>
import Card from '../components/Card.vue';
</script>
