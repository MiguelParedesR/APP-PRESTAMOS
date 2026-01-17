<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { clearSession, session } from '../logic/state';

const isMenuOpen = ref(false);
const route = useRoute();
const router = useRouter();

const isActive = (path) => route.path === path;
const closeMenu = () => {
  isMenuOpen.value = false;
};

const isLoggedIn = computed(() => Boolean(session.token));

const handleLogout = () => {
  clearSession();
  router.push('/login');
};
</script>

<template>
  <header class="border-b border-slate-200 bg-white/80 backdrop-blur">
    <div class="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4">
      <div class="flex items-center gap-3">
        <div
          class="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white/80 text-xs font-semibold text-slate-700"
        >
          UL
        </div>
        <div class="leading-tight">
          <p class="text-sm font-semibold text-slate-900">UNA LUCA</p>
          <p class="text-xs text-slate-500">Conducta, constancia, habilitacion</p>
        </div>
      </div>

      <div class="hidden items-center gap-5 md:flex">
        <div class="flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-600">
          <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          Sistema en seguimiento
        </div>
        <nav class="flex items-center gap-6" aria-label="Principal">
        <RouterLink
          class="nav-link"
          :class="{ 'nav-link-active': isActive('/') }"
          :aria-current="isActive('/') ? 'page' : undefined"
          to="/"
        >
          Inicio
        </RouterLink>
        <RouterLink
          class="nav-link"
          :class="{ 'nav-link-active': isActive('/login') }"
          :aria-current="isActive('/login') ? 'page' : undefined"
          to="/login"
        >
          Login
        </RouterLink>
        <RouterLink
          class="nav-link"
          :class="{ 'nav-link-active': isActive('/dashboard') }"
          :aria-current="isActive('/dashboard') ? 'page' : undefined"
          to="/dashboard"
        >
          Dashboard
        </RouterLink>
        <RouterLink
          class="nav-link"
          :class="{ 'nav-link-active': isActive('/perfil') }"
          :aria-current="isActive('/perfil') ? 'page' : undefined"
          to="/perfil"
        >
          Perfil
        </RouterLink>
        <button
          v-if="isLoggedIn"
          type="button"
          class="nav-link text-slate-500"
          @click="handleLogout"
        >
          Salir
        </button>
        </nav>
      </div>

      <button
        type="button"
        class="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white/80 p-2 text-slate-600 shadow-sm transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200 md:hidden"
        :aria-expanded="isMenuOpen.toString()"
        aria-controls="mobile-nav"
        :aria-label="isMenuOpen ? 'Cerrar menu' : 'Abrir menu'"
        @click="isMenuOpen = !isMenuOpen"
      >
        <svg
          v-if="!isMenuOpen"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M3 6h18" />
          <path d="M3 12h18" />
          <path d="M3 18h18" />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M18 6L6 18" />
          <path d="M6 6l12 12" />
        </svg>
      </button>
    </div>

    <nav
      id="mobile-nav"
      class="px-5 pb-4 md:hidden"
      :class="isMenuOpen ? 'block' : 'hidden'"
      aria-label="Navegacion movil"
    >
      <div class="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white/90 p-3 shadow-sm">
        <div class="flex items-center gap-2 rounded-lg border border-slate-200 bg-white/70 px-3 py-2 text-xs text-slate-600">
          <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          Sistema en seguimiento
        </div>
        <RouterLink
          class="nav-link"
          :class="{ 'nav-link-active': isActive('/') }"
          :aria-current="isActive('/') ? 'page' : undefined"
          to="/"
          @click="closeMenu"
        >
          Inicio
        </RouterLink>
        <RouterLink
          class="nav-link"
          :class="{ 'nav-link-active': isActive('/login') }"
          :aria-current="isActive('/login') ? 'page' : undefined"
          to="/login"
          @click="closeMenu"
        >
          Login
        </RouterLink>
        <RouterLink
          class="nav-link"
          :class="{ 'nav-link-active': isActive('/dashboard') }"
          :aria-current="isActive('/dashboard') ? 'page' : undefined"
          to="/dashboard"
          @click="closeMenu"
        >
          Dashboard
        </RouterLink>
        <RouterLink
          class="nav-link"
          :class="{ 'nav-link-active': isActive('/perfil') }"
          :aria-current="isActive('/perfil') ? 'page' : undefined"
          to="/perfil"
          @click="closeMenu"
        >
          Perfil
        </RouterLink>
        <button
          v-if="isLoggedIn"
          type="button"
          class="nav-link text-left text-slate-500"
          @click="
            handleLogout();
            closeMenu();
          "
        >
          Salir
        </button>
      </div>
    </nav>
  </header>
</template>
