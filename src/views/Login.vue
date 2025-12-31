<template>
  <section class="max-w-md space-y-6">
    <div class="space-y-2">
      <h2 class="text-2xl font-semibold text-slate-900">Ingreso a perfil</h2>
      <p class="text-sm text-slate-600">Acceso directo sin validacion en esta fase.</p>
    </div>

    <Card>
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label class="text-xs uppercase tracking-wide text-slate-600">DNI o correo</label>
          <input
            class="mt-2 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
            type="text"
            placeholder="DNI o correo"
          />
        </div>
        <button class="w-full rounded-xl bg-sky-700 px-4 py-2 text-sm font-semibold text-white">
          Continuar
        </button>
      </form>
    </Card>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router';
import Card from '../components/Card.vue';

const router = useRouter();

const handleSubmit = () => {
  router.push('/dashboard');
};
</script>
