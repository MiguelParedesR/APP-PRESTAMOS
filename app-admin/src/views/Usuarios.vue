<template>
  <section class="space-y-6">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Gestion</p>
      <div>
        <h2 class="mt-2 text-2xl font-semibold text-slate-900">Usuarios</h2>
        <p class="mt-2 text-sm text-slate-600">Listado base de perfiles registrados.</p>
      </div>
      <div class="flex items-center gap-2">
        <input
          type="search"
          placeholder="Buscar por email o ID"
          class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
        />
      </div>
    </header>

    <div class="grid gap-4 md:grid-cols-3">
      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Total usuarios</p>
        <p class="mt-3 text-2xl font-semibold text-slate-900">{{ totalUsers }}</p>
        <p class="mt-2 text-xs text-slate-500">Base activa</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Admins</p>
        <p class="mt-3 text-2xl font-semibold text-slate-900">{{ adminUsers }}</p>
        <p class="mt-2 text-xs text-slate-500">Control operativo</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Nuevos</p>
        <p class="mt-3 text-2xl font-semibold text-slate-900">{{ recentUsers }}</p>
        <p class="mt-2 text-xs text-slate-500">Ultimos 7 dias</p>
      </div>
    </div>

    <div class="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-100 px-6 py-4 text-sm font-semibold text-slate-700">
        Usuarios
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th class="px-6 py-3">Usuario</th>
              <th class="px-6 py-3">ID</th>
              <th class="px-6 py-3">Rol</th>
              <th class="px-6 py-3">Creado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="4" class="px-6 py-6 text-sm text-slate-500">Cargando usuarios...</td>
            </tr>
            <tr v-else-if="errorMessage">
              <td colspan="4" class="px-6 py-6 text-sm text-amber-700">{{ errorMessage }}</td>
            </tr>
            <tr v-else-if="users.length === 0">
              <td colspan="4" class="px-6 py-6 text-sm text-slate-500">Sin usuarios disponibles.</td>
            </tr>
            <tr
              v-for="user in users"
              :key="user.id"
              class="border-t border-slate-100"
            >
              <td class="px-6 py-4 text-slate-700">
                {{ userLabel(user) }}
              </td>
              <td class="px-6 py-4 text-xs text-slate-500">{{ user.id }}</td>
              <td class="px-6 py-4">
                <span :class="roleBadgeClass(user.is_admin)">
                  {{ user.is_admin ? 'Admin' : 'Usuario' }}
                </span>
              </td>
              <td class="px-6 py-4 text-slate-600">{{ formatDate(user.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { listUsers } from '../services/adminApi';

const loading = ref(false);
const errorMessage = ref('');
const users = ref([]);

const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
};

const totalUsers = computed(() => users.value.length);
const adminUsers = computed(
  () => users.value.filter((user) => user.is_admin).length
);
const recentUsers = computed(() => {
  const now = Date.now();
  return users.value.filter((user) => {
    const createdAt = parseDate(user.created_at);
    if (!createdAt) return false;
    const diffDays = (now - createdAt.getTime()) / 86400000;
    return diffDays <= 7;
  }).length;
});

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

function userLabel(user) {
  if (user.email) return user.email;
  if (user.full_name) return user.full_name;
  return 'Perfil sin alias';
}

function roleBadgeClass(isAdmin) {
  const base = 'rounded-full border px-2 py-1 text-[10px] uppercase tracking-wide';
  if (isAdmin) {
    return `${base} border-emerald-200 bg-emerald-50 text-emerald-700`;
  }
  return `${base} border-slate-200 bg-slate-50 text-slate-600`;
}

async function loadUsers() {
  loading.value = true;
  errorMessage.value = '';
  const result = await listUsers();
  if (!result.ok) {
    errorMessage.value = 'No se pudo cargar la lista de usuarios.';
    loading.value = false;
    return;
  }
  users.value = Array.isArray(result.data) ? result.data : [];
  loading.value = false;
}

onMounted(loadUsers);
</script>
