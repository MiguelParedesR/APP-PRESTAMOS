<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const isMenuOpen = ref(false);
const route = useRoute();

const isActive = (path) => route.path === path;
const closeMenu = () => {
  isMenuOpen.value = false;
};
</script>

<template>
  <header class="border-b border-slate-200 bg-white/80 backdrop-blur">
    <div class="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4">
      <div class="flex items-center gap-3">
        <div
          class="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-700"
        >
          CPC
        </div>
        <div class="leading-tight">
          <p class="text-sm font-semibold text-slate-900">Credito por Conducta</p>
          <p class="text-xs text-slate-500">Microprestamos por reputacion</p>
        </div>
      </div>

      <nav class="hidden items-center gap-6 md:flex" aria-label="Principal">
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
      </nav>

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
      </div>
    </nav>
  </header>
</template>
