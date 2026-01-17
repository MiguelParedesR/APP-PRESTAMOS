<template>
  <section class="mx-auto max-w-md space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
    <div>
      <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Acceso</p>
      <h2 class="mt-2 text-2xl font-semibold text-slate-900">Login admin</h2>
      <p class="mt-3 text-sm text-slate-600">Ingresa con tu cuenta autorizada para operar el sistema.</p>
    </div>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div>
        <label class="text-xs uppercase tracking-wide text-slate-500" for="admin-email">Email</label>
        <input
          id="admin-email"
          v-model.trim="email"
          type="email"
          autocomplete="email"
          class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
          placeholder="admin@empresa.com"
          required
        />
      </div>
      <div>
        <label class="text-xs uppercase tracking-wide text-slate-500" for="admin-password">Password</label>
        <input
          id="admin-password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
          placeholder="••••••••"
          required
        />
      </div>
      <button
        type="submit"
        class="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Validando...' : 'Ingresar' }}
      </button>
    </form>

    <p
      v-if="errorMessage"
      class="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800"
    >
      {{ errorMessage }}
    </p>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { checkIsAdmin, insertAuditLog, signInWithPassword, signOut } from '../services/supabase';
import { clearSession, recordAdminLogin, saveSession } from '../state/auth';

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const router = useRouter();
const route = useRoute();

const reasonMessage = computed(() => {
  if (route.query.reason === 'unauthorized') return 'Acceso no autorizado';
  if (route.query.reason === 'profile_unavailable') return 'No se pudo validar el acceso';
  return '';
});

if (reasonMessage.value) {
  errorMessage.value = reasonMessage.value;
}

async function handleSubmit() {
  errorMessage.value = '';
  isLoading.value = true;

  const result = await signInWithPassword(email.value, password.value);
  if (!result.ok) {
    errorMessage.value = 'Credenciales invalidas';
    isLoading.value = false;
    return;
  }

  const session = {
    access_token: result.data.access_token,
    refresh_token: result.data.refresh_token,
    expires_at: Math.floor(Date.now() / 1000) + (result.data.expires_in || 0),
    user: result.data.user
  };

  if (!session.user?.id) {
    await signOut(session.access_token, session.refresh_token);
    clearSession();
    errorMessage.value = 'No se pudo validar el usuario';
    isLoading.value = false;
    return;
  }

  const adminResult = await checkIsAdmin(session.access_token);
  if (!adminResult.ok) {
    await signOut(session.access_token, session.refresh_token);
    clearSession();
    errorMessage.value = 'No se pudo validar el acceso';
    isLoading.value = false;
    return;
  }

  if (adminResult.data !== true) {
    await insertAuditLog(session.access_token, {
      actor: session.user.email || session.user.id,
      accion: 'admin_access_denied',
      target_id: session.user.id,
      metadata: { source: 'app-admin' }
    });
    await signOut(session.access_token, session.refresh_token);
    clearSession();
    errorMessage.value = 'Acceso no autorizado';
    isLoading.value = false;
    return;
  }

  saveSession(session);
  await recordAdminLogin(session);
  isLoading.value = false;
  router.replace({ name: 'Dashboard' });
}
</script>
