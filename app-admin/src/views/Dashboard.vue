<template>
  <section class="space-y-6">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Resumen operativo</p>
        <h2 class="mt-2 text-2xl font-semibold text-slate-900">Dashboard</h2>
        <p class="mt-2 text-sm text-slate-600">Indicadores clave para decisiones rapidas.</p>
      </div>
      <div class="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs text-slate-600">
        <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
        Flujo estable
      </div>
    </header>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Solicitudes hoy</p>
        <p class="mt-3 text-3xl font-semibold text-slate-900">24</p>
        <p class="mt-2 text-xs text-slate-500">+12% vs ayer</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p class="text-xs uppercase tracking-[0.3em] text-slate-500">En evaluacion</p>
        <p class="mt-3 text-3xl font-semibold text-slate-900">9</p>
        <p class="mt-2 text-xs text-slate-500">Cola estable</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Aprobadas</p>
        <p class="mt-3 text-3xl font-semibold text-slate-900">6</p>
        <p class="mt-2 text-xs text-slate-500">Tasa 42%</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Tiempo medio</p>
        <p class="mt-3 text-3xl font-semibold text-slate-900">2.4h</p>
        <p class="mt-2 text-xs text-slate-500">Ultimas 24h</p>
      </div>
    </div>

    <div class="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Flujo por estado</p>
        <div class="mt-4 space-y-4 text-sm text-slate-600">
          <div>
            <div class="flex items-center justify-between">
              <span>Pendiente</span>
              <span class="text-slate-900">38%</span>
            </div>
            <div class="mt-2 h-2 w-full rounded-full bg-slate-100">
              <div class="h-2 w-[38%] rounded-full bg-slate-900"></div>
            </div>
          </div>
          <div>
            <div class="flex items-center justify-between">
              <span>Evaluacion</span>
              <span class="text-slate-900">42%</span>
            </div>
            <div class="mt-2 h-2 w-full rounded-full bg-slate-100">
              <div class="h-2 w-[42%] rounded-full bg-slate-700"></div>
            </div>
          </div>
          <div>
            <div class="flex items-center justify-between">
              <span>Aprobadas</span>
              <span class="text-slate-900">20%</span>
            </div>
            <div class="mt-2 h-2 w-full rounded-full bg-slate-100">
              <div class="h-2 w-[20%] rounded-full bg-emerald-600"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Alertas del sistema</p>
        <div class="mt-4 space-y-3 text-sm text-slate-600">
          <div class="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
            2 perfiles requieren revision manual.
          </div>
          <div class="rounded-xl border border-slate-200 bg-white px-3 py-2">
            Cola estable. No hay bloqueos activos.
          </div>
          <div class="rounded-xl border border-slate-200 bg-white px-3 py-2">
            Ultima auditoria: hace 3 horas.
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
