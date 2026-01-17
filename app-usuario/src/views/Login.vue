<template>
  <section class="max-w-md space-y-6">
    <div class="space-y-2">
      <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Acceso</p>
      <h2 class="text-2xl font-semibold text-slate-900">Ingreso a perfil</h2>
      <p class="text-sm text-slate-600">Autenticacion minima para validar el sistema.</p>
    </div>

    <Card>
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label class="text-sm uppercase tracking-wide text-slate-600" for="login-email">
            Correo
          </label>
          <input
            id="login-email"
            v-model.trim="email"
            class="input-field mt-2"
            type="email"
            name="email"
            autocomplete="username"
            autocapitalize="none"
            spellcheck="false"
            enterkeyhint="next"
            placeholder="correo@dominio.com"
          />
        </div>
        <div>
          <label class="text-sm uppercase tracking-wide text-slate-600" for="login-password">
            Contrasena
          </label>
          <input
            id="login-password"
            v-model="password"
            class="input-field mt-2"
            type="password"
            name="password"
            autocomplete="current-password"
            enterkeyhint="go"
            placeholder="••••••••"
          />
        </div>
        <p v-if="errorMessage" class="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {{ errorMessage }}
        </p>
        <button type="submit" class="btn btn-primary w-full" :disabled="session.loading">
          {{ session.loading ? 'Validando...' : 'Continuar' }}
        </button>
      </form>
    </Card>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Card from '../components/Card.vue';
import { session, signIn } from '../logic/state';

const router = useRouter();
const email = ref('');
const password = ref('');

const errorMessage = computed(() => {
  if (!session.error) return '';
  const message = String(session.error).toLowerCase();
  if (message.includes('invalid')) return 'Credenciales invalidas.';
  return 'No se pudo validar el acceso. Intenta nuevamente.';
});

const handleSubmit = async () => {
  const result = await signIn(email.value, password.value);
  if (result.ok) {
    router.push('/dashboard');
  }
};

onMounted(() => {
  if (session.token) {
    router.push('/dashboard');
  }
});
</script>
