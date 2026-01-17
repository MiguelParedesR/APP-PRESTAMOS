<template>
  <section class="flex flex-col gap-10">
    <div class="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
      <div class="max-w-2xl space-y-4">
        <p class="text-sm uppercase tracking-[0.32em] text-slate-500">UNA LUCA</p>
        <h1 class="text-3xl font-semibold text-slate-900 sm:text-4xl">
          Aqui no se evalua tu dinero, se evalua tu conducta.
        </h1>
        <p class="text-sm text-slate-600">
          Tu perfil se construye con constancia y registro. El acceso se habilita como consecuencia, sin presion.
        </p>
        <div class="flex flex-wrap gap-3">
          <RouterLink to="/login" class="btn btn-primary w-full sm:w-auto">
            Ingresar
          </RouterLink>
          <RouterLink to="/dashboard" class="btn btn-secondary w-full sm:w-auto">
            Ver mi estado
          </RouterLink>
        </div>
      </div>

      <div class="space-y-4 rounded-2xl border border-slate-200 bg-white/90 p-5 text-sm text-slate-600 shadow-sm">
        <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Principios</p>
        <div class="space-y-3">
          <div class="flex items-start gap-3">
            <span class="mt-1 h-2 w-2 rounded-full bg-slate-900"></span>
            <p>Registro continuo, no presion inmediata.</p>
          </div>
          <div class="flex items-start gap-3">
            <span class="mt-1 h-2 w-2 rounded-full bg-slate-900"></span>
            <p>Evaluacion silenciosa basada en comportamiento.</p>
          </div>
          <div class="flex items-start gap-3">
            <span class="mt-1 h-2 w-2 rounded-full bg-slate-900"></span>
            <p>Acceso gradual, sin promesas instantaneas.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-3">
      <div class="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Paso 1</p>
        <h3 class="mt-2 text-lg font-semibold text-slate-900">Constancia</h3>
        <p class="mt-2 text-sm text-slate-600">Tu actividad deja huella y se registra.</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Paso 2</p>
        <h3 class="mt-2 text-lg font-semibold text-slate-900">Historial</h3>
        <p class="mt-2 text-sm text-slate-600">Se consolida un perfil conductual estable.</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Paso 3</p>
        <h3 class="mt-2 text-lg font-semibold text-slate-900">Habilitacion</h3>
        <p class="mt-2 text-sm text-slate-600">El sistema abre acceso cuando corresponde.</p>
      </div>
    </div>

    <div class="max-w-4xl rounded-2xl border border-slate-200 bg-white/90 p-5 text-sm text-slate-600 shadow-sm">
      <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Estado actual</p>
      <p class="mt-2">Perfil en evaluacion permanente. Historial en formacion. Avance registrado.</p>
    </div>
  </section>
</template>
