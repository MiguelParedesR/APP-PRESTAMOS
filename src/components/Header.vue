<template>
  <header class="border-b border-slate-200 bg-white/80 backdrop-blur">
    <div class="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4">
      <div class="flex items-center gap-3">
        <div class="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-700">
          CPC
        </div>
        <div class="leading-tight">
          <p class="text-sm font-semibold text-slate-900">Credito por Conducta</p>
          <p class="text-xs text-slate-500">Microprestamos por reputacion</p>
        </div>
      </div>
      <nav class="hidden items-center gap-6 text-sm text-slate-600 md:flex">
        <RouterLink class="hover:text-slate-900" to="/">Inicio</RouterLink>
        <RouterLink class="hover:text-slate-900" to="/login">Login</RouterLink>
        <RouterLink class="hover:text-slate-900" to="/dashboard">Dashboard</RouterLink>
        <RouterLink class="hover:text-slate-900" to="/perfil">Perfil</RouterLink>
      </nav>
    </div>
  </header>
</template>
