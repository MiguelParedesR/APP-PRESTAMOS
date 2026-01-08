<template>
  <section class="max-w-md space-y-6">
    <div class="space-y-2">
      <h2 class="text-2xl font-semibold text-slate-900">Ingreso a perfil</h2>
      <p class="text-sm text-slate-600">Acceso directo sin validacion en esta fase.</p>
    </div>

    <Card>
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label class="text-sm uppercase tracking-wide text-slate-600" for="login-identifier">
            DNI o correo
          </label>
          <input
            id="login-identifier"
            class="input-field mt-2"
            type="text"
            name="identifier"
            autocomplete="username"
            autocapitalize="none"
            spellcheck="false"
            enterkeyhint="go"
            placeholder="DNI o correo"
            aria-describedby="login-helper"
          />
          <p id="login-helper" class="mt-2 text-sm text-slate-500">
            Usa tu DNI o correo registrado para continuar.
          </p>
        </div>
        <button type="submit" class="btn btn-primary w-full">Continuar</button>
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
