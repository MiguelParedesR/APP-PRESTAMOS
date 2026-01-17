<template>
  <div class="min-h-screen text-slate-900">
    <header class="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <div class="flex items-center gap-4">
          <div class="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-xs font-semibold text-slate-700">
            UL
          </div>
          <div>
            <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Sistema operativo</p>
            <h1 class="text-lg font-semibold text-slate-900">UNA LUCA / Admin</h1>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs text-slate-600">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            Operativo
          </div>
          <div class="hidden items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs text-slate-500 sm:flex">
            Ultima sync: 02 min
          </div>
        </div>
        <nav class="flex flex-wrap gap-4 text-sm font-medium text-slate-600">
          <RouterLink to="/login" class="hover:text-slate-900">Login</RouterLink>
          <RouterLink to="/dashboard" class="hover:text-slate-900">Dashboard</RouterLink>
          <RouterLink to="/solicitudes" class="hover:text-slate-900">Solicitudes</RouterLink>
          <RouterLink to="/usuarios" class="hover:text-slate-900">Usuarios</RouterLink>
        </nav>
      </div>
    </header>

    <main class="mx-auto w-full max-w-6xl px-6 py-10">
      <RouterView />
    </main>
  </div>
</template>
